import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Cloud } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { TradingItem } from "@shared/schema";

interface DisplayItem {
  name: string;
  type: string;
  currentValue: number;
  changePercent: string;
  isPositive: boolean;
  icon: string;
}

export default function LiveStocks() {
  const { data: stockData = [], isLoading } = useQuery<TradingItem[]>({
    queryKey: ['/api/trading-items'],
    enabled: true
  });

  const mockStockData: DisplayItem[] = [
    {
      name: "Candy Blossom",
      type: "Crop",
      currentValue: 100000,
      changePercent: "+5.2%",
      isPositive: true,
      icon: "🌸"
    },
    {
      name: "Dragon Fruit", 
      type: "Crop",
      currentValue: 4750,
      changePercent: "-2.1%",
      isPositive: false,
      icon: "🐲"
    },
    {
      name: "Golden Gear",
      type: "Equipment", 
      currentValue: 25000,
      changePercent: "+12.8%",
      isPositive: true,
      icon: "⚙️"
    }
  ];

  // Transform API data to match expected format
  const transformedStockData: DisplayItem[] = (stockData || []).map((item: TradingItem) => ({
    name: item.name,
    type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    currentValue: item.currentValue,
    changePercent: item.changePercent || "0%",
    isPositive: item.changePercent?.startsWith('+') ?? true,
    icon: item.type === 'crop' ? '🌱' : item.type === 'gear' ? '⚙️' : '🥚'
  }));

  const displayData = transformedStockData.length > 0 ? transformedStockData : mockStockData;

  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Live Stocks & Weather
          </h2>
          <p className="text-gray-300 text-lg">
            Track real-time market values and trends for Seeds, Gears, and Eggs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Overview */}
          <div className="lg:col-span-2">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <TrendingUp className="text-green-400 mr-3" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {item.currentValue.toLocaleString()}
                      </div>
                      <div className={`text-sm flex items-center ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {item.isPositive ? <TrendingUp className="mr-1" size={16} /> : <TrendingDown className="mr-1" size={16} />}
                        <span>{item.changePercent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Market Stats & Weather */}
          <div className="space-y-6">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Users className="text-blue-400 mr-3" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Traders</span>
                  <span className="font-bold text-green-400">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="font-bold text-green-400">240K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Online Now</span>
                  <span className="font-bold text-green-400">892</span>
                </div>
              </CardContent>
            </Card>

            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Cloud className="text-yellow-400 mr-3" />
                  Weather Status
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl mb-2">🌧️</div>
                <div className="font-semibold text-blue-400">Rainy Season</div>
                <div className="text-sm text-gray-400 mt-2">+20% Water Crop Growth</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
