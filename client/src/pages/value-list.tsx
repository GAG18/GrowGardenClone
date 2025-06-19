import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

// Types for the value list API response
interface ValueListItem {
  category: string;
  pets: string;
  age: number;
  weight: string;
  value: string;
  demand: string;
  trend: string;
  rarity: string;
  origin: string;
  hatchPercent: string;
  image: string;
  updateTime: number;
  valueHistory: string;
  itemId: number;
  position: number;
}

// Color mappings for demand and trend
const DEMAND_COLORS = {
  "10/10": "#00ff00",
  "9/10": "#00ff7f",
  "8/10": "#32cd32",
  "7/10": "#adff2f",
  "6/10": "#d4af37",
  "5/10": "#ffff00",
  "4/10": "#ffd700",
  "3/10": "#ffa500",
  "2/10": "#ff4500",
  "1/10": "#ff0000",
};

const TREND_COLORS = {
  "Stable": "#00FF00",
  "Unstable": "#FFCC00",
  "Fluctuating": "#FFCC00",
  "Rising": "#00c2ff",
  "Dropping": "#FF0000",
};

// Sort options
const SORT_OPTIONS = [
  { value: "default", label: "Default Order" },
  { value: "value-high", label: "Value: High to Low" },
  { value: "value-low", label: "Value: Low to High" },
  { value: "demand-high", label: "Demand: High to Low" },
  { value: "demand-low", label: "Demand: Low to High" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ValueList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedItem, setSelectedItem] = useState<ValueListItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch value list data
  const { data: valueListData, isLoading, error } = useQuery<ValueListItem[]>({
    queryKey: ['value-list'],
    queryFn: async () => {
      const response = await fetch('/api/value-list');
      if (!response.ok) {
        throw new Error('Failed to fetch value list data');
      }
      return response.json();
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });

  // Get unique categories from data
  const categories = useMemo(() => {
    if (!valueListData) return ["All"];
    const uniqueCategories = Array.from(new Set(valueListData.map(item => item.category)));
    return ["All", ...uniqueCategories.sort()];
  }, [valueListData]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    if (!valueListData) return [];

    let filtered = valueListData.filter(item => {
      const matchesSearch = item.pets.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.rarity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort items
    switch (sortBy) {
      case "value-high":
        filtered.sort((a, b) => {
          const aVal = parseFloat(a.value === "N/A" ? "0" : a.value);
          const bVal = parseFloat(b.value === "N/A" ? "0" : b.value);
          return bVal - aVal;
        });
        break;
      case "value-low":
        filtered.sort((a, b) => {
          const aVal = parseFloat(a.value === "N/A" ? "0" : a.value);
          const bVal = parseFloat(b.value === "N/A" ? "0" : b.value);
          return aVal - bVal;
        });
        break;
      case "demand-high":
        filtered.sort((a, b) => {
          const aDemand = a.demand === "N/A" ? 0 : parseInt(a.demand.split("/")[0]);
          const bDemand = b.demand === "N/A" ? 0 : parseInt(b.demand.split("/")[0]);
          return bDemand - aDemand;
        });
        break;
      case "demand-low":
        filtered.sort((a, b) => {
          const aDemand = a.demand === "N/A" ? 0 : parseInt(a.demand.split("/")[0]);
          const bDemand = b.demand === "N/A" ? 0 : parseInt(b.demand.split("/")[0]);
          return aDemand - bDemand;
        });
        break;
      case "newest":
        filtered.sort((a, b) => b.updateTime - a.updateTime);
        break;
      case "oldest":
        filtered.sort((a, b) => a.updateTime - b.updateTime);
        break;
      default:
        filtered.sort((a, b) => a.position - b.position);
    }

    return filtered;
  }, [valueListData, searchTerm, selectedCategory, sortBy]);

  // Get demand color
  const getDemandColor = (demand: string) => {
    return DEMAND_COLORS[demand as keyof typeof DEMAND_COLORS] || "#666666";
  };

  // Get trend color and icon
  const getTrendInfo = (trend: string) => {
    const color = TREND_COLORS[trend as keyof typeof TREND_COLORS] || "#666666";
    let icon = <Minus className="w-3 h-3" />;
    
    if (trend === "Rising") icon = <TrendingUp className="w-3 h-3" />;
    else if (trend === "Dropping") icon = <TrendingDown className="w-3 h-3" />;
    
    return { color, icon };
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - (timestamp * 1000); // Convert to milliseconds
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  // Parse value history for the chart
  const parseValueHistory = (valueHistory: string) => {
    try {
      const parsed = JSON.parse(valueHistory);
      return parsed.map(([timestamp, value]: [number, string]) => ({
        timestamp,
        value: value === "N/A" ? 0 : parseFloat(value),
        date: new Date(timestamp).toLocaleDateString()
      }));
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading value list...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-400">Error loading value list data</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Item Value List</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Browse and search through all items with their current values, demand, and trends
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-gray-400 text-sm">
              Showing {filteredAndSortedItems.length} items
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredAndSortedItems.map((item) => {
              const trendInfo = getTrendInfo(item.trend);
              
              return (
                <Card
                  key={item.itemId}
                  className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-3">
                    {/* Item Image */}
                    <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-gray-700">
                      <img
                        src={item.image}
                        alt={item.pets}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>

                    {/* Item Name */}
                    <h3 className="text-white text-sm font-medium mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {item.pets}
                    </h3>

                    {/* Value */}
                    <div className="text-xs text-gray-400 mb-1">
                      Value: <span className="text-white font-mono">{item.value}</span>
                    </div>

                    {/* Demand */}
                    <div className="text-xs text-gray-400 mb-1">
                      Demand: <span 
                        className="font-mono"
                        style={{ color: getDemandColor(item.demand) }}
                      >
                        {item.demand}
                      </span>
                    </div>

                    {/* Trend */}
                    <div className="flex items-center gap-1 text-xs mb-1">
                      <span className="text-gray-400">Trend:</span>
                      <div 
                        className="flex items-center gap-1"
                        style={{ color: trendInfo.color }}
                      >
                        {trendInfo.icon}
                        <span className="font-mono">{item.trend}</span>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="text-xs text-gray-400 mb-1">
                      Age: <span className="text-white">{item.age}d</span>
                    </div>

                    {/* Last Updated */}
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(item.updateTime)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No results */}
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No items found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl gradient-text">{selectedItem.pets}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.pets}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Value</p>
                      <p className="text-white font-mono text-lg">{selectedItem.value}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Demand</p>
                      <p 
                        className="font-mono text-lg"
                        style={{ color: getDemandColor(selectedItem.demand) }}
                      >
                        {selectedItem.demand}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Trend</p>
                      <div 
                        className="flex items-center gap-1 text-lg"
                        style={{ color: getTrendInfo(selectedItem.trend).color }}
                      >
                        {getTrendInfo(selectedItem.trend).icon}
                        <span className="font-mono">{selectedItem.trend}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Age</p>
                      <p className="text-white text-lg">{selectedItem.age} days</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400 text-sm">Category: </span>
                      <Badge variant="secondary" className="bg-purple-900 text-purple-100">
                        {selectedItem.category}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Rarity: </span>
                      <Badge variant="secondary" className="bg-blue-900 text-blue-100">
                        {selectedItem.rarity}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Origin: </span>
                      <span className="text-white">{selectedItem.origin}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Hatch Rate: </span>
                      <span className="text-white">{selectedItem.hatchPercent}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Weight: </span>
                      <span className="text-white">{selectedItem.weight}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Last Updated: </span>
                      <span className="text-white">{formatTimeAgo(selectedItem.updateTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value History Chart Placeholder */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Price History</h3>
                <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Value history chart coming soon</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
