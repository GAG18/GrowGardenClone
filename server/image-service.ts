import fs from 'fs';
import path from 'path';

// Map item names to Roblox asset IDs or local images
export const itemImageMap: Record<string, string> = {
  // Crops
  'Carrot': 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-C1D3E5E7D18A6D5E8F1C2A0B9C8D7E6F5A4B3C2D1E0F-Png/352/352/AvatarHeadshot/Png/noFilter',
  'Corn': '/assets/items/corn.png',
  'Tomato': '/assets/items/tomato.png',
  'Wheat': '/assets/items/wheat.png',
  'Potato': '/assets/items/potato.png',
  'Rice': '/assets/items/rice.png',
  'Strawberry': '/assets/items/strawberry.png',
  'Blueberry': '/assets/items/blueberry.png',
  'Apple': '/assets/items/apple.png',
  'Orange': '/assets/items/orange.png',
  
  // Pets - using category icons for now
  'Dog': '/assets/icons/pet.svg',
  'Cat': '/assets/icons/pet.svg',
  'Rabbit': '/assets/icons/pet.svg',
  'Horse': '/assets/icons/pet.svg',
  'Cow': '/assets/icons/pet.svg',
  'Pig': '/assets/icons/pet.svg',
  'Chicken': '/assets/icons/pet.svg',
  'Sheep': '/assets/icons/pet.svg',
  
  // Items
  'Watering Can': '/assets/icons/tool.svg',
  'Fertilizer': '/assets/icons/package.svg',
  'Seeds': '/assets/icons/package.svg',
  'Harvest Tool': '/assets/icons/tool.svg'
};

export function getItemImageUrl(itemName: string, itemType: string): string {
  // Check if we have a specific image mapping
  if (itemImageMap[itemName]) {
    return itemImageMap[itemName];
  }
  
  // Fallback to category icons
  switch (itemType.toLowerCase()) {
    case 'crop':
      return '/assets/icons/plant.svg';
    case 'pet':
      return '/assets/icons/crown.svg';
    case 'item':
    case 'tool':
      return '/assets/icons/package.svg';
    default:
      return '/assets/icons/package.svg';
  }
}

export function createCategoryIcon(type: string): string {
  const icons = {
    plant: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.5 8.5L20 7L14 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L10 12L4 7L10.5 8.5L12 2Z" fill="#22c55e"/>
    </svg>`,
    crown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 18H22L20 8L16 12L12 6L8 12L4 8L2 18Z" fill="#eab308"/>
    </svg>`,
    package: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#3b82f6"/>
      <path d="M2 7L12 12L22 7M12 12V22" stroke="#1e40af" stroke-width="2"/>
    </svg>`,
    tool: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 6.3L20 12L18 14L12 8L14.7 6.3Z" fill="#8b5cf6"/>
      <path d="M4 20L8 16L10 18L6 22L4 20Z" fill="#8b5cf6"/>
    </svg>`
  };
  
  return `data:image/svg+xml;base64,${Buffer.from(icons[type as keyof typeof icons] || icons.package).toString('base64')}`;
}