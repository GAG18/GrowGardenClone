// Map item names to external image URLs or category icons
export const itemImageMap: Record<string, string> = {
  // Using PostImg and external CDNs for all images
  'Carrot': 'https://i.postimg.cc/q7QKGJFw/carrot.png',
  'Corn': 'https://i.postimg.cc/XJKcHjMN/corn.png', 
  'Tomato': 'https://i.postimg.cc/FFhfN8gK/tomato.png',
  'Wheat': 'https://i.postimg.cc/jSkJKnHv/wheat.png',
  'Potato': 'https://i.postimg.cc/4yLPf3vL/potato.png',
  'Rice': 'https://i.postimg.cc/GtBfx8pH/rice.png',
  'Strawberry': 'https://i.postimg.cc/wTMp4jyb/strawberry.png',
  'Blueberry': 'https://i.postimg.cc/1tzMJjNm/blueberry.png',
  'Apple': 'https://i.postimg.cc/yYp5K7Mb/apple.png',
  'Orange': 'https://i.postimg.cc/cHJBkKnh/orange.png'
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