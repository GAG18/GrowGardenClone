import { Request, Response } from 'express';

export async function proxyImage(req: Request, res: Response) {
  try {
    const imageUrl = req.query.url as string;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL required' });
    }

    // Allow specific trusted domains for images
    const allowedDomains = [
      'i.postimg.cc',
      'tr.rbxcdn.com',
      'thumbnails.roblox.com',
      't0.rbxcdn.com',
      't1.rbxcdn.com',
      't2.rbxcdn.com',
      't3.rbxcdn.com',
      't4.rbxcdn.com',
      't5.rbxcdn.com',
      't6.rbxcdn.com',
      't7.rbxcdn.com'
    ];

    const isAllowedDomain = allowedDomains.some(domain => imageUrl.includes(domain));
    if (!isAllowedDomain) {
      console.log('Blocked image URL from untrusted domain:', imageUrl);
      return res.status(400).json({ error: 'Untrusted image domain' });
    }

    console.log('Proxying image from:', imageUrl);

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Access-Control-Allow-Origin': '*'
    });

    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
}