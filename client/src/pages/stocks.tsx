import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Search, Filter, BarChart3 } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import type { TradingItem } from "@shared/schema";

export default function Stocks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const { data: stockData = [] } = useQuery<TradingItem[]>({
    queryKey: ['/api/trading-items'],
    enabled: true
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      case 'mythical': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'crop': return '🌱';
      case 'gear': return '⚙️';
      case 'seed': return '🌰';
      case 'egg': return '🥚';
      default: return '📦';
    }
  };

  const filteredData = stockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['all', ...new Set(stockData.map(item => item.type))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="text-4xl text-white" size={48} />
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">Live Stocks & Values</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Track real-time market values and trends for all trading items. Make informed decisions with our comprehensive market data.
            </p>
          </section>

          {/* Filters */}
          <section className="py-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Market Overview */}
          <section className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="gaming-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {stockData.filter(item => item.changePercent?.startsWith('+')).length}
                  </div>
                  <div className="text-gray-400">Rising</div>
                </CardContent>
              </Card>
              <Card className="gaming-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {stockData.filter(item => item.changePercent?.startsWith('-')).length}
                  </div>
                  <div className="text-gray-400">Falling</div>
                </CardContent>
              </Card>
              <Card className="gaming-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{stockData.length}</div>
                  <div className="text-gray-400">Total Items</div>
                </CardContent>
              </Card>
              <Card className="gaming-card text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {Math.round(stockData.reduce((sum, item) => sum + item.currentValue, 0) / stockData.length || 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400">Avg Value</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Items Table */}
          <section className="py-8">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Market Data ({filteredData.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400">Item</th>
                        <th className="text-left p-4 text-gray-400">Type</th>
                        <th className="text-left p-4 text-gray-400">Rarity</th>
                        <th className="text-right p-4 text-gray-400">Current Value</th>
                        <th className="text-right p-4 text-gray-400">24h Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => {
                        const isPositive = item.changePercent?.startsWith('+') ?? true;
                        return (
                          <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{getTypeIcon(item.type)}</div>
                                <div>
                                  <div className="font-semibold text-white">{item.name}</div>
                                  <div className="text-sm text-gray-400">#{item.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getRarityColor(item.rarity)} text-white`}>
                                {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <div className="font-bold text-white text-lg">
                                {item.currentValue.toLocaleString()}
                              </div>
                              {item.previousValue && (
                                <div className="text-sm text-gray-400">
                                  was {item.previousValue.toLocaleString()}
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {isPositive ? (
                                  <TrendingUp size={16} />
                                ) : (
                                  <TrendingDown size={16} />
                                )}
                                <span className="font-semibold">
                                  {item.changePercent || "0%"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}