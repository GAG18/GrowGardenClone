import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Search, Plus, MessageCircle, TrendingUp, Users, MessageSquare, Star, Trophy } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { TradeAd } from "@shared/schema";

export default function TradeAds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: rawTradeAds = [] } = useQuery<TradeAd[]>({
    queryKey: ['/api/trade-ads'],
    enabled: true
  });

  // Filter and sort trade ads
  const filteredAndSortedTradeAds = rawTradeAds
    .filter(tradeAd => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const title = tradeAd.title?.toLowerCase() || '';
      const description = tradeAd.description?.toLowerCase() || '';
      
      // Search in offering and wanting items
      const offeringItems = JSON.parse(tradeAd.offeringItems || '[]');
      const wantingItems = JSON.parse(tradeAd.wantingItems || '[]');
      
      const allItems = [...offeringItems, ...wantingItems];
      const itemMatches = allItems.some((item: any) => 
        item.name?.toLowerCase().includes(searchLower) ||
        item.type?.toLowerCase().includes(searchLower) ||
        item.mutation?.toLowerCase().includes(searchLower)
      );
      
      return title.includes(searchLower) || 
             description.includes(searchLower) || 
             itemMatches;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'value-high':
          // Calculate total value of items (simplified)
          const aValue = JSON.parse(a.offeringItems || '[]').reduce((sum: number, item: any) => sum + (item.currentValue || 0), 0);
          const bValue = JSON.parse(b.offeringItems || '[]').reduce((sum: number, item: any) => sum + (item.currentValue || 0), 0);
          return bValue - aValue;
        case 'value-low':
          const aValueLow = JSON.parse(a.offeringItems || '[]').reduce((sum: number, item: any) => sum + (item.currentValue || 0), 0);
          const bValueLow = JSON.parse(b.offeringItems || '[]').reduce((sum: number, item: any) => sum + (item.currentValue || 0), 0);
          return aValueLow - bValueLow;
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
                Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Hub</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Browse and create trade advertisements for Grow a Garden items. Connect with other players and make the trades you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create-trade-ad">
                  <Button size="lg" className="gaming-button text-lg px-8">
                    <Plus className="mr-2" size={20} />
                    Create Trade Ad
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8">
                  <Search className="mr-2" size={20} />
                  Browse All
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          {/* <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="gaming-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{rawTradeAds.length}</div>
                    <div className="text-gray-300">Active Trades</div>
                  </CardContent>
                </Card>
                <Card className="gaming-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2.4K</div>
                    <div className="text-gray-300">Total Traders</div>
                  </CardContent>
                </Card>
                <Card className="gaming-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-400 mb-2">8.7K</div>
                    <div className="text-gray-300">Completed Deals</div>
                  </CardContent>
                </Card>
                <Card className="gaming-card text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                    <div className="text-gray-300">Success Rate</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section> */}

          {/* Trading Features */}
          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="gaming-card text-center">
                  <CardContent className="p-8">
                    <div className="text-purple-400 mb-4">
                      <TrendingUp className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Real-Time Values</h3>
                    <p className="text-gray-400">Stay updated with current market prices and trending items in the trading community.</p>
                  </CardContent>
                </Card>
                <Card className="gaming-card text-center">
                  <CardContent className="p-8">
                    <div className="text-blue-400 mb-4">
                      <Users className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Trusted Community</h3>
                    <p className="text-gray-400">Trade with verified members and build your reputation through successful exchanges.</p>
                  </CardContent>
                </Card>
                <Card className="gaming-card text-center">
                  <CardContent className="p-8">
                    <div className="text-green-400 mb-4">
                      <MessageSquare className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Secure Trading</h3>
                    <p className="text-gray-400">Built-in chat system and middleman services ensure safe and smooth transactions.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Leaderboard */}
          {/* <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Top Traders</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                  { rank: 1, name: "TradeMaster99", trades: 847, rating: 4.9 },
                  { rank: 2, name: "DragonDealer", trades: 652, rating: 4.8 },
                  { rank: 3, name: "GemCollector", trades: 589, rating: 4.7 }
                ].map((trader, index) => (
                  <Card key={index} className="gaming-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            trader.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            trader.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                            'bg-gradient-to-r from-orange-400 to-orange-600'
                          }`}>
                            {trader.rank}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{trader.name}</h3>
                          <div className="text-sm text-gray-400">{trader.trades} trades completed</div>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-sm ml-1">{trader.rating}</span>
                          </div>
                        </div>
                        <Trophy className="w-6 h-6 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section> */}

          {/* Search and Filters */}
          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search items by name, mutation, or attributes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/80 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 h-12 rounded-lg"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm whitespace-nowrap">Sort By</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-black/80 border-gray-600 text-white focus:border-purple-500 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="newest" className="text-white hover:bg-gray-800">Newest First</SelectItem>
                      <SelectItem value="oldest" className="text-white hover:bg-gray-800">Oldest First</SelectItem>
                      <SelectItem value="value-high" className="text-white hover:bg-gray-800">Highest Value</SelectItem>
                      <SelectItem value="value-low" className="text-white hover:bg-gray-800">Lowest Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Trade Listings */}
          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-6">
                {rawTradeAds.length === 0 ? (
                  <Card className="gaming-card">
                    <CardContent className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <ArrowRightLeft className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Trade Ads Yet</h3>
                        <p>Be the first to create a trade ad and start trading!</p>
                      </div>
                      <Link href="/create-trade-ad">
                        <Button className="gaming-button">
                          <Plus className="mr-2" size={18} />
                          Create Your First Trade Ad
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : filteredAndSortedTradeAds.length === 0 ? (
                  <Card className="gaming-card">
                    <CardContent className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                        <p>Try adjusting your search terms or filters.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAndSortedTradeAds.map((tradeAd: TradeAd) => {
                    const offeringItems = JSON.parse(tradeAd.offeringItems || '[]');
                    const wantingItems = JSON.parse(tradeAd.wantingItems || '[]');
                    
                    return (
                      <Card key={tradeAd.id} className="gaming-card">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50">
                                {(tradeAd as any).profileImageUrl ? (
                                  <img 
                                    src={(tradeAd as any).profileImageUrl} 
                                    alt={(tradeAd as any).username || `User ${tradeAd.userId}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to generated avatar if Roblox image fails
                                      const target = e.target as HTMLImageElement;
                                      target.src = `https://ui-avatars.com/api/?name=${(tradeAd as any).username || 'User'}&background=8b5cf6&color=fff&size=40`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {((tradeAd as any).username || 'U').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {(tradeAd as any).username || `User ${tradeAd.userId}`}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {tradeAd.createdAt ? new Date(tradeAd.createdAt).toLocaleDateString() : 'Recent'}
                                </div>
                              </div>
                            </div>
                            {/* <div className="flex space-x-2">
                              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                <MessageCircle className="mr-2" size={16} />
                                Chat
                              </Button>
                              <Button className="gaming-button">
                                <ArrowRightLeft className="mr-2" size={16} />
                                Trade
                              </Button>
                            </div> */}
                          </div>

                          {tradeAd.title && (
                            <h3 className="text-lg font-semibold text-white mb-2">{tradeAd.title}</h3>
                          )}
                          
                          {tradeAd.description && (
                            <p className="text-gray-300 mb-4">{tradeAd.description}</p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Offering Items */}
                            <div>
                              <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
                                <Plus className="mr-2" size={16} />
                                Offering ({offeringItems.length})
                              </h4>
                              <div className="space-y-2">
                                {offeringItems.slice(0, 3).map((item: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded-lg border border-green-500/30 flex items-center justify-center relative overflow-hidden">
                                        {item.imageUrl ? (
                                          <img 
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                              {item.name?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-white font-medium text-sm">{item.name}</div>
                                        {item.quantity && (
                                          <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                                        )}
                                      </div>
                                    </div>
                                    {item.currentValue && (
                                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                                        {item.currentValue.toLocaleString()}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                                {offeringItems.length > 3 && (
                                  <div className="text-center text-gray-400 text-sm">
                                    +{offeringItems.length - 3} more items
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Wanting Items */}
                            <div>
                              <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                                <Search className="mr-2" size={16} />
                                Looking For ({wantingItems.length})
                              </h4>
                              <div className="space-y-2">
                                {wantingItems.slice(0, 3).map((item: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded-lg border border-blue-500/30 flex items-center justify-center relative overflow-hidden">
                                        {item.imageUrl ? (
                                          <img 
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                              {item.name?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-white font-medium text-sm">{item.name}</div>
                                        {item.quantity && (
                                          <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                                        )}
                                      </div>
                                    </div>
                                    {item.currentValue && (
                                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                        {item.currentValue.toLocaleString()}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                                {wantingItems.length > 3 && (
                                  <div className="text-center text-gray-400 text-sm">
                                    +{wantingItems.length - 3} more items
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}