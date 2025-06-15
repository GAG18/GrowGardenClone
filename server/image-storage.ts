import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import fs from 'fs';
import path from 'path';

let bucket: GridFSBucket;

export function initializeGridFS() {
  if (mongoose.connection.readyState === 1) {
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'item_images'
    });
    console.log('✅ GridFS initialized for image storage');
  } else {
    throw new Error('MongoDB connection not ready for GridFS');
  }
}

export async function uploadImage(filePath: string, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      reject(new Error('GridFS not initialized'));
      return;
    }

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        uploadDate: new Date(),
        contentType: 'image/png'
      }
    });

    const readStream = fs.createReadStream(filePath);
    
    uploadStream.on('error', reject);
    uploadStream.on('finish', () => {
      resolve(uploadStream.id.toString());
    });

    readStream.pipe(uploadStream);
  });
}

export async function getImageUrl(imageId: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      reject(new Error('GridFS not initialized'));
      return;
    }

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(imageId));
    const chunks: Buffer[] = [];

    downloadStream.on('data', (chunk) => chunks.push(chunk));
    downloadStream.on('error', reject);
    downloadStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

export async function uploadItemImages(): Promise<void> {
  const imagesDir = path.join(process.cwd(), 'client', 'src', 'assets', 'items');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('No images directory found, creating placeholder images...');
    return;
  }

  const imageFiles = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  );

  console.log(`Uploading ${imageFiles.length} item images to GridFS...`);
  
  for (const file of imageFiles) {
    try {
      const filePath = path.join(imagesDir, file);
      await uploadImage(filePath, file);
      console.log(`✅ Uploaded: ${file}`);
    } catch (error) {
      console.log(`❌ Failed to upload ${file}:`, error);
    }
  }
}