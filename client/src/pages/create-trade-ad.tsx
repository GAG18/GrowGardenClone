import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Search, ArrowUp, ArrowDown, RotateCcw, Save, Send, Sprout, Crown, Package, Minus, Gift, GitBranch } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TradingItem, InsertTradeAd } from "@shared/schema";

interface SelectedItem {
  id: number;
  name: string;
  type: string;
  imageUrl?: string;
  petAge?: number;
  weight?: number;
  quantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  mutation?: string;
  mutationValue?: number;
}

interface ItemCustomization {
  petAge: number;
  weight: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  mutation: string;
  mutationValue: number;
}

// Helper functions to classify items by name
const isPetItem = (name: string): boolean => {
  const petKeywords = ['Dog', 'Cat', 'Bunny', 'Chicken', 'Deer', 'Pig', 'Rooster', 'Monkey', 'Cow', 'Sea Otter', 'Turtle', 'Polar Bear', 'Snail', 'Giant Ant', 'Caterpillar', 'Praying Mantis', 'Dragonfly', 'Panda', 'Hedgehog', 'Mole', 'Frog', 'Echo Frog', 'Night Owl', 'Raccoon', 'Kiwi', 'Owl', 'Chicken Zombie', 'Blood Owl', 'Blood Hedgehog', 'Blood Kiwi', 'Grey Mouse', 'Brown Mouse', 'Moon Cat', 'Squirrel', 'Red Giant Ant', 'Red Fox', 'Bee', 'Honey Bee', 'Bear Bee', 'Petal Bee', 'Queen Bee', 'Wasp', 'Tarantula Hawk', 'Moth', 'Butterfly', 'Disco Bee', 'Golden Lab', 'Black Bunny', 'Orange Tabby', 'Spotted Deer', 'Silver Monkey'];
  return petKeywords.some(keyword => name.includes(keyword));
};

const isCropItem = (name: string): boolean => {
  const cropKeywords = ['Carrot', 'Strawberry', 'Blueberry', 'Orange Tulip', 'Corn', 'Tomato', 'Daffodil', 'Watermelon', 'Bamboo', 'Coconut', 'Pumpkin', 'Apple', 'Cactus', 'Dragon Fruit', 'Mango', 'Grape', 'Pepper', 'Mushroom', 'Pineapple', 'Peach', 'Pear', 'Papaya', 'Cacao', 'Lemon', 'Rose', 'Foxglove', 'Lilac', 'Pink Lily', 'Purple Dahila', 'Nectarine', 'Hive Fruit', 'Sunflower', 'Honeysuckle', 'Lavender', 'Manuka Flower', 'Nectarshade', 'Dandelion', 'Lumira', 'Ember Lily'];
  return cropKeywords.some(keyword => name.includes(keyword));
};

export default function CreateTradeAd() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [haveItems, setHaveItems] = useState<SelectedItem[]>([]);
  const [wantItems, setWantItems] = useState<SelectedItem[]>([]);
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<'have' | 'want'>('have');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<TradingItem | null>(null);
  
  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('roblox_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }
  }, []);
  const [itemCustomization, setItemCustomization] = useState<ItemCustomization>({
    petAge: 0,
    weight: 0,
    quantity: 1,
    minQuantity: 1,
    maxQuantity: 999,
    mutation: '',
    mutationValue: 0
  });

  // Fetch available trading items
  const { data: tradingItems = [] } = useQuery<TradingItem[]>({
    queryKey: ["/api/trading-items"],
  });

  // Filter and sort items based on search
  const filteredItems = tradingItems
    .filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));



  // Create trade ad mutation
  const createTradeAdMutation = useMutation({
    mutationFn: async (tradeAd: InsertTradeAd) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add user authentication header
      if (currentUser) {
        headers['x-user-data'] = JSON.stringify(currentUser);
      }
      
      const response = await fetch("/api/trade-ads", {
        method: "POST",
        headers,
        body: JSON.stringify(tradeAd),
      });
      if (!response.ok) throw new Error("Failed to create trade ad");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trade-ads"] });
      toast({
        title: "Trade Ad Published!",
        description: "Your trade ad has been published successfully.",
      });
      setLocation("/trade-ads");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish trade ad. Please try again.",
        variant: "destructive",
      });
    },
  });

  const openItemPicker = (section: 'have' | 'want') => {
    setCurrentSection(section);
    setIsItemPickerOpen(true);
    setSearchQuery("");
  };

  const openItemCustomization = (item: TradingItem) => {
    setSelectedItemForCustomization(item);
    setItemCustomization({
      petAge: 0,
      weight: 0,
      quantity: 1,
      minQuantity: 1,
      maxQuantity: 999,
      mutation: '',
      mutationValue: 0
    });
    setIsItemPickerOpen(false);
    setIsCustomizationOpen(true);
  };

  const addCustomizedItem = () => {
    if (!selectedItemForCustomization) return;

    const selectedItem: SelectedItem = {
      id: selectedItemForCustomization.id,
      name: selectedItemForCustomization.name,
      type: selectedItemForCustomization.type,
      imageUrl: selectedItemForCustomization.imageUrl ? `/api/image-proxy?url=${encodeURIComponent(selectedItemForCustomization.imageUrl)}` : undefined,
      petAge: itemCustomization.petAge,
      weight: itemCustomization.weight,
      quantity: itemCustomization.quantity,
      minQuantity: itemCustomization.minQuantity,
      maxQuantity: itemCustomization.maxQuantity,
      mutation: itemCustomization.mutation,
      mutationValue: itemCustomization.mutationValue,
    };

    if (currentSection === 'have') {
      if (!haveItems.find(i => i.id === selectedItemForCustomization.id)) {
        setHaveItems([...haveItems, selectedItem]);
      }
    } else {
      if (!wantItems.find(i => i.id === selectedItemForCustomization.id)) {
        setWantItems([...wantItems, selectedItem]);
      }
    }
    
    setIsCustomizationOpen(false);
    setSelectedItemForCustomization(null);
  };

  const removeItem = (itemId: number, section: 'have' | 'want') => {
    if (section === 'have') {
      setHaveItems(haveItems.filter(item => item.id !== itemId));
    } else {
      setWantItems(wantItems.filter(item => item.id !== itemId));
    }
  };

  const addTradeTypeItem = (tradeType: string) => {
    const imageUrls: Record<string, string> = {
      "Or": "https://i.postimg.cc/59zK0MWL/1170262339673657345.png",
      "Adds": "https://i.postimg.cc/bYmKCsB2/image.png", 
      "Offers": "https://i.postimg.cc/pTYGYBYs/1223364818598232184.png",
      "Downgrade": "https://i.postimg.cc/v8J6gdvt/image.png",
      "Upgrade": "https://i.postimg.cc/3wtKggQH/image.png"
    };

    // Create a special trade type item with unique ID
    const tradeTypeItem: SelectedItem = {
      id: Date.now() + Math.random(), // Unique ID for trade type items
      name: tradeType,
      type: 'TradeType',
      imageUrl: imageUrls[tradeType], // Use specific image URL for each trade type
      quantity: 1,
      minQuantity: 1,
      maxQuantity: 1
    };

    // Add to want items (only trade types go to "I Want" section)
    if (!wantItems.find(i => i.name === tradeType)) {
      setWantItems([...wantItems, tradeTypeItem]);
    }
  };

  const handlePublish = () => {
    if (haveItems.length === 0 || wantItems.length === 0) {
      toast({
        title: "Incomplete Trade",
        description: "Please add at least one item to both 'I Have' and 'I Want' sections.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a trade ad.",
        variant: "destructive",
      });
      return;
    }

    const tradeAd: InsertTradeAd = {
      userId: currentUser.id.toString(), // Use authenticated user's ID
      title: `Trading ${haveItems.map(i => i.name).join(', ')} for ${wantItems.map(i => i.name).join(', ')}`,
      description: `Looking to trade my ${haveItems.map(i => i.name).join(', ')} for ${wantItems.map(i => i.name).join(', ')}.`,
      offeringItems: JSON.stringify(haveItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        weight: item.weight,
        petAge: item.petAge,
        mutation: item.mutation,
        mutationValue: item.mutationValue,
        minQuantity: item.minQuantity,
        maxQuantity: item.maxQuantity
      }))),
      wantingItems: JSON.stringify(wantItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        weight: item.weight,
        petAge: item.petAge,
        mutation: item.mutation,
        mutationValue: item.mutationValue,
        minQuantity: item.minQuantity,
        maxQuantity: item.maxQuantity
      }))),
      status: "active"
    };

    createTradeAdMutation.mutate(tradeAd);
  };

  const handleReset = () => {
    setHaveItems([]);
    setWantItems([]);
  };

  const AddItemButton = ({ section }: { section: 'have' | 'want' }) => (
    <button
      onClick={() => openItemPicker(section)}
      className="w-full min-h-[180px] border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 hover:bg-gray-800/50 transition-all duration-300 group"
    >
      <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-400 mb-2" />
      <span className="text-gray-400 group-hover:text-purple-400 font-medium">Add Item</span>
    </button>
  );

  // Helper function to get display item type
  const getDisplayItemType = (itemName: string): string => {
    if (isPetItem(itemName)) return 'Pet';
    if (isCropItem(itemName)) return 'Crop';
    return 'Gear';
  };

  const ItemCard = ({ item, section }: { item: SelectedItem; section: 'have' | 'want' }) => {
    const displayType = getDisplayItemType(item.name);
    
    return (
      <div className="relative group bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 overflow-hidden min-h-[180px] flex flex-col">
        {/* Quantity Badge - Top Right */}
        {item.quantity && item.quantity > 1 && (
          <div className="absolute top-2 right-2 bg-gray-900/90 text-white px-2 py-1 rounded-lg text-sm font-bold border border-gray-600 z-10">
            ×{item.quantity}
          </div>
        )}
        
        {/* Remove Button - Top Left */}
        <button
          onClick={() => removeItem(item.id, section)}
          className="absolute top-2 left-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 mb-3 flex items-center justify-center relative">
            {item.type === 'TradeType' ? (
              // Special display for trade type items (Upgrade, Downgrade, etc.)
              item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                  crossOrigin="anonymous"
                  loading="lazy"
                  onLoad={() => {
                    console.log(`✅ Trade type image loaded: ${item.name} - ${item.imageUrl}`);
                  }}
                  onError={(e) => {
                    console.log(`❌ Trade type image failed: ${item.name} - ${item.imageUrl}`);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                          item.name === 'Upgrade' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          item.name === 'Downgrade' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          item.name === 'Adds' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          item.name === 'Offers' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                          item.name === 'Or' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }">
                          <div class="text-center">
                            <div class="text-xs">${item.name}</div>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className={`w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                  item.name === 'Upgrade' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  item.name === 'Downgrade' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  item.name === 'Adds' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  item.name === 'Offers' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                  item.name === 'Or' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                  'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  <div className="text-center">
                    {item.name === 'Upgrade' && <ArrowUp className="w-6 h-6 mx-auto mb-1" />}
                    {item.name === 'Downgrade' && <ArrowDown className="w-6 h-6 mx-auto mb-1" />}
                    {item.name === 'Adds' && <Plus className="w-6 h-6 mx-auto mb-1" />}
                    {item.name === 'Offers' && <Gift className="w-6 h-6 mx-auto mb-1" />}
                    {item.name === 'Or' && <GitBranch className="w-6 h-6 mx-auto mb-1" />}
                    <div className="text-xs">{item.name}</div>
                  </div>
                </div>
              )
            ) : item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
                crossOrigin="anonymous"
                loading="lazy"
                onLoad={() => {
                  console.log(`✅ ItemCard image loaded: ${item.name} - ${item.imageUrl}`);
                }}
                onError={(e) => {
                  console.log(`❌ ItemCard image failed: ${item.name} - ${item.imageUrl}`);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        ${displayType === 'Crop' ? 
                          '<svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 9.5V11.5L21 9ZM3 15V17L9 14.5V12.5L3 15ZM10 15C10 16.1 10.9 17 12 17S14 16.1 14 15H10Z"/></svg>' :
                          displayType === 'Pet' ?
                          '<svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 16L5.5 20.5L6.5 19.5L8 21L9 20L7.5 18.5L9 17L8 16L6.5 17.5L5 16ZM12 14L14 17L17 14L14 11L12 14ZM19 16L18 17L19.5 18.5L18 20L19 21L20.5 19.5L22 20.5L21 16L19 16Z"/></svg>' :
                          '<svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z"/></svg>'
                        }
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                {displayType === 'Crop' ? (
                  <Sprout className="w-10 h-10 text-white" />
                ) : displayType === 'Pet' ? (
                  <Crown className="w-10 h-10 text-white" />
                ) : (
                  <Package className="w-10 h-10 text-white" />
                )}
              </div>
            )}
            
          </div>
          
          {/* Customization Values - Below image */}
          {(item.weight !== undefined && item.weight > 0) || 
           (item.petAge !== undefined && item.petAge > 0 && displayType === 'Pet') ||
           (item.mutation && item.mutation !== '' && displayType === 'Crop') ? (
            <div className="text-white text-xs mb-2 space-y-0.5">
              {/* Weight */}
              {item.weight !== undefined && item.weight > 0 && (
                <div className="text-center font-medium text-green-300">
                  {item.weight} kg
                </div>
              )}
              {/* Pet Age */}
              {item.petAge !== undefined && item.petAge > 0 && displayType === 'Pet' && (
                <div className="text-center font-medium text-blue-300">
                  Age: {item.petAge}
                </div>
              )}
              {/* Mutation */}
              {item.mutation && item.mutation !== '' && displayType === 'Crop' && (
                <div className="text-center font-medium text-purple-300">
                  {item.mutation}
                  {item.mutationValue !== undefined && item.mutationValue > 0 && (
                    <span className="text-yellow-300 ml-1">({item.mutationValue.toLocaleString()})</span>
                  )}
                </div>
              )}
            </div>
          ) : null}
          
          <h3 className="text-white font-medium text-sm mb-1 leading-tight line-clamp-2">{item.name}</h3>
          {item.type !== 'TradeType' && (
            <Badge variant="secondary" className="text-xs">{displayType}</Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/trade-ads")}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center"
          >
            ← Back to Trade Ads
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Create Trade Ad</h1>
          <p className="text-gray-400">Set up your trade offer and find the perfect match for your items.</p>
        </div>

        {/* Trade Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* I Have Section */}
          <div>
            <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              I Have
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {haveItems.map((item) => (
                <ItemCard key={item.id} item={item} section="have" />
              ))}
              {Array.from({ length: Math.max(0, 4 - haveItems.length) }).map((_, index) => (
                <AddItemButton key={`have-${index}`} section="have" />
              ))}
            </div>
          </div>

          {/* I Want Section */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              I Want
            </h2>
            

            
            <div className="grid grid-cols-2 gap-4">
              {wantItems.map((item) => (
                <ItemCard key={item.id} item={item} section="want" />
              ))}
              {Array.from({ length: Math.max(0, 4 - wantItems.length) }).map((_, index) => (
                <AddItemButton key={`want-${index}`} section="want" />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => addTradeTypeItem("Upgrade")}
                className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200 flex items-center text-sm border border-green-500/30"
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                Upgrade
              </button>
              <button
                onClick={() => addTradeTypeItem("Downgrade")}
                className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center text-sm border border-red-500/30"
              >
                <ArrowDown className="w-3 h-3 mr-1" />
                Downgrade
              </button>
              <button
                onClick={() => addTradeTypeItem("Adds")}
                className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center text-sm border border-blue-500/30"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adds
              </button>
              <button
                onClick={() => addTradeTypeItem("Offers")}
                className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all duration-200 flex items-center text-sm border border-yellow-500/30"
              >
                <Gift className="w-3 h-3 mr-1" />
                Offers
              </button>
              <button
                onClick={() => addTradeTypeItem("Or")}
                className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200 flex items-center text-sm border border-purple-500/30"
              >
                <GitBranch className="w-3 h-3 mr-1" />
                Or
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-red-400 border-red-400 hover:bg-red-400/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              className="text-gray-400 border-gray-400 hover:bg-gray-400/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={createTradeAdMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {createTradeAdMutation.isPending ? "Publishing..." : "Publish Trade Ad"}
            </Button>
          </div>
        </div>

        {/* Item Picker Modal */}
        <Dialog open={isItemPickerOpen} onOpenChange={setIsItemPickerOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center">
                <Search className="w-6 h-6 mr-2" />
                Item Picker
              </DialogTitle>
              <p className="text-gray-400">Search and select an item to add to your trade</p>
            </DialogHeader>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Available Items Grid */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-4">Available Items</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto pr-2">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openItemCustomization(item)}
                    className="bg-gray-800/50 hover:bg-gray-700/80 rounded-xl p-3 transition-all duration-300 group border border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 aspect-square flex flex-col justify-center items-center"
                  >
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      {/* Item Image */}
                      <div className="w-12 h-12 mb-2 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={`/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-icon')) {
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'fallback-icon w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center';
                                const iconHtml = item.type === 'Pets' || item.type === 'Pet' ? 
                                  '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l3.707 3.707A1 1 0 0018 18V8a1 1 0 00-.293-.707z"/></svg>' :
                                  item.type === 'Crop' ?
                                  '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 000 2c2.45 0 4.45 1.69 4.9 4h-1.4A1 1 0 008 9v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-1.4c-.45-2.31-2.45-4-4.9-4z"/></svg>' :
                                  '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>';
                                fallbackDiv.innerHTML = iconHtml;
                                parent.appendChild(fallbackDiv);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            {item.type === 'Pets' || item.type === 'Pet' ? (
                              <Crown className="w-6 h-6 text-white" />
                            ) : item.type === 'Crop' ? (
                              <Sprout className="w-6 h-6 text-white" />
                            ) : (
                              <Package className="w-6 h-6 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Item Name */}
                      <h4 className="text-white font-medium text-xs leading-tight text-center line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      
                      {/* Item Type Badge */}
                      <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No items found matching your search.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Customization Modal */}
        <Dialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <DialogTitle className="text-lg font-medium">Item Picker</DialogTitle>
              </div>
            </DialogHeader>

            {selectedItemForCustomization && (
              <div className="space-y-6">
                {/* Customize your item header */}
                <div className="text-sm text-gray-400 mb-4">
                  Customize your item
                </div>

                {/* Item Display */}
                <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                    {selectedItemForCustomization.imageUrl ? (
                      <img
                        src={`/api/image-proxy?url=${encodeURIComponent(selectedItemForCustomization.imageUrl)}`}
                        alt={selectedItemForCustomization.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      selectedItemForCustomization.type === 'Pets' ? (
                        <Crown className="w-8 h-8 text-white" />
                      ) : selectedItemForCustomization.type === 'Crop' ? (
                        <Sprout className="w-8 h-8 text-white" />
                      ) : (
                        <Package className="w-8 h-8 text-white" />
                      )
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{selectedItemForCustomization.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedItemForCustomization.type}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-sm border-gray-600 text-gray-300"
                    onClick={() => {
                      setIsCustomizationOpen(false);
                      setIsItemPickerOpen(true);
                    }}
                  >
                    Change
                  </Button>
                </div>

                {/* Pet Age - Only for Pets */}
                {selectedItemForCustomization.type === 'Pets' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </div>
                      <label className="text-white font-medium">Pet Age</label>
                    </div>
                    <Select 
                      value={itemCustomization.petAge.toString()} 
                      onValueChange={(value) => setItemCustomization({...itemCustomization, petAge: parseInt(value)})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {Array.from({ length: 101 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()} className="text-white hover:bg-gray-700">
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Weight - Only for Pets and Crops */}
                {(selectedItemForCustomization.type === 'Pets' || selectedItemForCustomization.type === 'Crop') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                        <Package className="w-2.5 h-2.5 text-white" />
                      </div>
                      <label className="text-white font-medium">Weight (kg)</label>
                    </div>
                    
                    {/* Weight Slider */}
                    <div className="px-2">
                      <Slider
                        value={[itemCustomization.weight]}
                        onValueChange={(value) => setItemCustomization({...itemCustomization, weight: value[0]})}
                        max={50000}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Weight Controls */}
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemCustomization({...itemCustomization, weight: Math.max(0, itemCustomization.weight - 1000)})}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      >
                        - 1,000
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemCustomization({...itemCustomization, weight: Math.max(0, itemCustomization.weight - 100)})}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      >
                        - 100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 cursor-default"
                      >
                        Edit Exact
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemCustomization({...itemCustomization, weight: itemCustomization.weight + 100})}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      >
                        + 100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setItemCustomization({...itemCustomization, weight: itemCustomization.weight + 1000})}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      >
                        + 1,000
                      </Button>
                    </div>
                    
                    {/* Weight Display */}
                    <div className="text-center">
                      <Input
                        type="number"
                        value={itemCustomization.weight}
                        onChange={(e) => setItemCustomization({...itemCustomization, weight: Math.max(0, Math.min(50000, parseInt(e.target.value) || 0))})}
                        className="text-center bg-gray-800 border-gray-600 text-white w-24 mx-auto"
                        max={50000}
                      />
                    </div>
                  </div>
                )}

                {/* Mutations - Only for Crops */}
                {selectedItemForCustomization.type === 'Crop' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <Sprout className="w-2.5 h-2.5 text-white" />
                      </div>
                      <label className="text-white font-medium">Mutations</label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Mutation Type */}
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Mutation</label>
                        <Select 
                          value={itemCustomization.mutation || undefined} 
                          onValueChange={(value) => setItemCustomization({...itemCustomization, mutation: value})}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue placeholder="Select mutations" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="Gold" className="text-white hover:bg-gray-700">Gold</SelectItem>
                            <SelectItem value="Rainbow" className="text-white hover:bg-gray-700">Rainbow</SelectItem>
                            <SelectItem value="Wet" className="text-white hover:bg-gray-700">Wet</SelectItem>
                            <SelectItem value="Chilled" className="text-white hover:bg-gray-700">Chilled</SelectItem>
                            <SelectItem value="Frozen" className="text-white hover:bg-gray-700">Frozen</SelectItem>
                            <SelectItem value="Shocked" className="text-white hover:bg-gray-700">Shocked</SelectItem>
                            <SelectItem value="Chocolate" className="text-white hover:bg-gray-700">Chocolate</SelectItem>
                            <SelectItem value="Moonlit" className="text-white hover:bg-gray-700">Moonlit</SelectItem>
                            <SelectItem value="Bloodlit" className="text-white hover:bg-gray-700">Bloodlit</SelectItem>
                            <SelectItem value="Celestial" className="text-white hover:bg-gray-700">Celestial</SelectItem>
                            <SelectItem value="Zombified" className="text-white hover:bg-gray-700">Zombified</SelectItem>
                            <SelectItem value="Disco" className="text-white hover:bg-gray-700">Disco</SelectItem>
                            <SelectItem value="Plasma" className="text-white hover:bg-gray-700">Plasma</SelectItem>
                            <SelectItem value="Pollinated" className="text-white hover:bg-gray-700">Pollinated</SelectItem>
                            <SelectItem value="Honey Glazed" className="text-white hover:bg-gray-700">Honey Glazed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Mutation Value */}
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Value</label>
                        <Input
                          type="number"
                          value={itemCustomization.mutationValue}
                          onChange={(e) => setItemCustomization({...itemCustomization, mutationValue: Math.max(0, Math.min(10000000000, parseInt(e.target.value) || 0))})}
                          className="bg-gray-800 border-gray-600 text-white"
                          max={10000000000}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      N
                    </div>
                    <label className="text-white font-medium">Quantity</label>
                  </div>
                  
                  {/* Quantity Control */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setItemCustomization({...itemCustomization, quantity: Math.max(itemCustomization.minQuantity, itemCustomization.quantity - 1)})}
                      className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={itemCustomization.quantity}
                      onChange={(e) => setItemCustomization({...itemCustomization, quantity: Math.max(itemCustomization.minQuantity, Math.min(itemCustomization.maxQuantity, parseInt(e.target.value) || 1))})}
                      className="text-center bg-gray-800 border-gray-600 text-white w-20 text-xl font-semibold"
                      min={itemCustomization.minQuantity}
                      max={itemCustomization.maxQuantity}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setItemCustomization({...itemCustomization, quantity: Math.min(itemCustomization.maxQuantity, itemCustomization.quantity + 1)})}
                      className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-blue-400 text-center">
                    Max 999
                  </div>
                  
                  {/* Min/Max Range */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setItemCustomization({...itemCustomization, quantity: itemCustomization.minQuantity})}
                      className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      Min ({itemCustomization.minQuantity})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setItemCustomization({...itemCustomization, quantity: 10})}
                      className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setItemCustomization({...itemCustomization, quantity: itemCustomization.maxQuantity})}
                      className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      Max ({itemCustomization.maxQuantity})
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCustomizationOpen(false);
                      setIsItemPickerOpen(true);
                    }}
                    className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={addCustomizedItem}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}