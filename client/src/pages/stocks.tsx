import { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, Filter, BarChart3, ArrowUpDown, ArrowUp, ArrowDown, Clock, Users, ExternalLink, Package, Timer, RefreshCw } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

// Types for the stock API response
interface StockItem {
  name: string;
  value: number;
}

interface LastSeenItem {
  name: string;
  emoji: string;
  seen: string;
}

interface StockDataWithImages {
  easterStock: StockItem[];
  gearStock: StockItem[];
  eggStock: StockItem[];
  nightStock: StockItem[];
  honeyStock: StockItem[];
  cosmeticsStock: StockItem[];
  seedsStock: StockItem[];
  lastSeen: {
    Seeds: LastSeenItem[];
    Gears: LastSeenItem[];
    Eggs: LastSeenItem[];
    Weather: LastSeenItem[];
  };
  restockTimers: {
    seeds: number | null;
    gears: number | null;
    eggs: number | null;
    honey: number | null;
    cosmetics: number | null;
  };
  timerCalculatedAt: number; // Timestamp when timers were calculated on server
  imageData: Record<string, string>;
}

export default function Stocks() {
  // ===== REFS AND STATE =====
  // Timer element refs to avoid React re-renders
  const timerRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  
  // Timer state tracking to prevent spam refetches
  const refetchTriggered = useRef<Record<string, boolean>>({});
  const lastRefetchTime = useRef<Record<string, number>>({});
  const sameDataFetchCount = useRef<Record<string, number>>({});
  const lastKnownTimers = useRef<Record<string, number | null>>({});
  
  // ===== API QUERY =====
  // Fetch stock data with caching and auto-refresh
  const { data: stockData, refetch, isLoading, error } = useQuery<StockDataWithImages>({
    queryKey: ['stock-data'],
    queryFn: async () => {
      const response = await fetch('/api/stock');
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // ===== TIMER LOGIC =====
  // Update countdowns every second using direct DOM manipulation for performance
  useEffect(() => {
    if (!stockData?.restockTimers || !stockData?.timerCalculatedAt) return;

    // Reset refetch flags when new data arrives
    refetchTriggered.current = {};

    // Constants for timer calculations
    const REFETCH_COOLDOWN = 10000; // 10 seconds cooldown between refetches
    const RESTOCK_INTERVALS = {
      seeds: 5,       // 5 minutes
      gears: 5,       // 5 minutes  
      eggs: 30,       // 30 minutes
      honey: 30,      // 30 minutes (independent timer)
      cosmetics: 240, // 4 hours (independent timer)
    } as const;

    const updateCountdowns = () => {
      const now = Date.now();
      const timeSinceCalculation = now - stockData.timerCalculatedAt;
      let shouldRefetch = false;

      // Helper function to calculate next restock time for categories with last seen data
      const calculateNextRestock = (category: string, intervalMinutes: number): number => {
        // Map category names to lastSeen keys
        const categoryMap: Record<string, keyof typeof stockData.lastSeen> = {
          seeds: 'Seeds',
          gears: 'Gears',
          eggs: 'Eggs'
        };
        
        const categoryKey = categoryMap[category];
        if (!categoryKey) return 0;
        
        const lastSeenData = stockData.lastSeen?.[categoryKey];
        if (!lastSeenData || lastSeenData.length === 0) {
          return 0; // No data available, trigger immediate refresh
        }

        // Find the most recently seen item
        const mostRecent = lastSeenData.reduce((latest: LastSeenItem, item: LastSeenItem) => {
          const itemTime = new Date(item.seen).getTime();
          const latestTime = new Date(latest.seen).getTime();
          return itemTime > latestTime ? item : latest;
        });

        const lastSeenTime = new Date(mostRecent.seen).getTime();
        const intervalMs = intervalMinutes * 60 * 1000;
        
        // Calculate next restock time
        let nextRestockTime = lastSeenTime + intervalMs;
        while (nextRestockTime <= now) {
          nextRestockTime += intervalMs;
        }
        
        return nextRestockTime - now;
      };

      Object.entries(stockData.restockTimers).forEach(([category, initialTime]) => {
        const timerElement = timerRefs.current[category];
        if (!timerElement) return;

        if (initialTime === null) {
          timerElement.textContent = "Manual Updates";
          timerElement.className = "font-mono text-purple-400";
        } else {
          let actualTime: number;

          // For categories with lastSeen data, calculate based on actual timestamps
          if (RESTOCK_INTERVALS[category as keyof typeof RESTOCK_INTERVALS] && ['seeds', 'gears', 'eggs'].includes(category)) {
            actualTime = calculateNextRestock(category, RESTOCK_INTERVALS[category as keyof typeof RESTOCK_INTERVALS]);
          } else {
            // For honey and cosmetics, use server-provided timer
            const remainingTime = initialTime - timeSinceCalculation;
            actualTime = Math.max(0, remainingTime);
          }
          
          // Display timer state
          if (actualTime <= 0) {
            timerElement.textContent = "Refreshing...";
            timerElement.className = "font-mono text-purple-400";
            
            // Trigger refetch with cooldown protection
            const lastRefetch = lastRefetchTime.current[category] || 0;
            const timeSinceLastRefetch = now - lastRefetch;
            
            if (!refetchTriggered.current[category] && 
                !shouldRefetch && 
                timeSinceLastRefetch > REFETCH_COOLDOWN) {
              console.log(`⏰ ${category} stock refresh triggered`);
              refetchTriggered.current[category] = true;
              lastRefetchTime.current[category] = now;
              shouldRefetch = true;
            }
          } else {
            // Format time as MM:SS
            const minutes = Math.floor(actualTime / 60000);
            const seconds = Math.floor((actualTime % 60000) / 1000);
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when close to restock
            const isNearRestock = actualTime <= 30000;
            timerElement.className = `font-mono ${isNearRestock ? 'text-yellow-400 animate-pulse' : 'text-purple-400'}`;
            
            // Reset refetch flag when timer is running
            refetchTriggered.current[category] = false;
          }
        }
      });

      // Only refetch once per update cycle, not for each category
      if (shouldRefetch) {
        refetch();
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [stockData?.restockTimers, stockData?.timerCalculatedAt, stockData?.lastSeen, refetch]);

  // ===== HELPER FUNCTIONS =====
  // Get item image with fallback to placeholder
  const getItemImage = useCallback((itemName: string) => {
    return stockData?.imageData[itemName] || 
           `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName)}&size=64&background=random&color=fff&font-size=0.6`;
  }, [stockData?.imageData]);

  // Format last seen time to human readable format
  const formatLastSeen = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }, []);

  // ===== MEMOIZED COMPONENTS =====
  // Timer display component optimized with refs to prevent re-renders
  const TimerDisplay = memo(({ 
    categoryKey, 
    timerRefs 
  }: { 
    categoryKey: string; 
    timerRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>; 
  }) => (
    <div className="flex items-center gap-2 text-sm">
      <Timer className="w-4 h-4" />
      <span 
        ref={(el) => { timerRefs.current[categoryKey] = el; }}
        className="font-mono text-purple-400"
      >
        Manual Updates
      </span>
    </div>
  ));
  TimerDisplay.displayName = 'TimerDisplay';

  // Stock section component with optimized re-rendering
  const StockSection = memo(({ 
    title, 
    items, 
    updateInterval, 
    categoryKey,
    timerRefs,
    getItemImage
  }: { 
    title: string; 
    items: StockItem[]; 
    updateInterval: string;
    categoryKey: string;
    timerRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>;
    getItemImage: (itemName: string) => string;
  }) => (
    <Card className="gaming-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            {title}
          </CardTitle>
          <p className="text-sm text-gray-400">Updates {updateInterval}</p>
        </div>
        <TimerDisplay categoryKey={categoryKey} timerRefs={timerRefs} />
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No items in stock</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div key={`${item.name}-${item.value}-${index}`} className="bg-black/30 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <img 
                    src={getItemImage(item.name)} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=48&background=random&color=fff`;
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        {item.value} in stock
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  ), (prevProps, nextProps) => {
    // Custom comparison function to ensure re-render when items change
    return (
      prevProps.title === nextProps.title &&
      prevProps.updateInterval === nextProps.updateInterval &&
      prevProps.categoryKey === nextProps.categoryKey &&
      JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items)
    );
  });

  StockSection.displayName = 'StockSection';

  const LastSeenSection = memo(({ 
    title, 
    items,
    formatLastSeen,
    getItemImage
  }: { 
    title: string; 
    items: LastSeenItem[];
    formatLastSeen: (dateString: string) => string;
    getItemImage: (itemName: string) => string;
  }) => {
    // Sort items by last seen time (most recent first)
    const sortedItems = [...items].sort((a, b) => {
      const timeA = new Date(a.seen).getTime();
      const timeB = new Date(b.seen).getTime();
      return timeB - timeA; // Most recent first
    });

    return (
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Last Seen {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedItems.map((item, index) => (
              <div key={`${item.name}-${item.seen}-${index}`} className="bg-black/20 rounded-lg p-3 border border-gray-800 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <img 
                    src={getItemImage(item.name)} 
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=40&background=random&color=fff`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">{formatLastSeen(item.seen)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison function to ensure re-render when items change
    return (
      prevProps.title === nextProps.title &&
      JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items)
    );
  });

  LastSeenSection.displayName = 'LastSeenSection';

  // Memoized market overview component
  const MarketOverview = memo(({ stockData }: { stockData: StockDataWithImages }) => (
    <Card className="gaming-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white text-center">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stockData.seedsStock?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Seed Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {stockData.gearStock?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Gear Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {stockData.eggStock?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Egg Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {stockData.honeyStock?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Honey Items</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {stockData.cosmeticsStock?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Cosmetics</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  MarketOverview.displayName = 'MarketOverview';

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-20 px-4">
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="text-red-400 mb-4">
              <Package className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Stock Data Unavailable</h1>
            <p className="text-gray-400 mb-6">Unable to fetch current stock information. Please try again later.</p>
            <button 
              onClick={() => refetch()} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-4xl text-white" size={48} />
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">Live Stock Market</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Track real-time stock levels and availability for all Grow a Garden items. 
              Join our community for the latest updates and trading opportunities.
            </p>
          </section>

          {/* Discord CTA */}
          <section className="py-8">
            <Card className="gaming-card bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-white mb-1">Join Our Discord Community!</h3>
                      <p className="text-gray-300">Get real-time stock alerts, trade with other players, and stay updated on the latest market trends.</p>
                    </div>
                  </div>
                  <a 
                    href="https://discord.gg/growagarden"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    Join Discord
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Loading State */}
          {isLoading && (
            <section className="py-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
                <p className="text-gray-400">Loading stock data...</p>
              </div>
            </section>
          )}

          {/* Current Stocks */}
          {stockData && (
            <>
              <section className="py-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Stocks</h2>
                <div className="space-y-8">
                  <StockSection 
                    title="Seed Stock" 
                    items={stockData.seedsStock || []} 
                    updateInterval="every 5 minutes"
                    categoryKey="seeds"
                    timerRefs={timerRefs}
                    getItemImage={getItemImage}
                  />
                  <StockSection 
                    title="Gear Stock" 
                    items={stockData.gearStock || []} 
                    updateInterval="every 5 minutes"
                    categoryKey="gears"
                    timerRefs={timerRefs}
                    getItemImage={getItemImage}
                  />
                  <StockSection 
                    title="Egg Stock" 
                    items={stockData.eggStock || []} 
                    updateInterval="every 30 minutes"
                    categoryKey="eggs"
                    timerRefs={timerRefs}
                    getItemImage={getItemImage}
                  />
                  <StockSection 
                    title="Honey Stock" 
                    items={stockData.honeyStock || []} 
                    updateInterval="every 30 minutes"
                    categoryKey="honey"
                    timerRefs={timerRefs}
                    getItemImage={getItemImage}
                  />
                  <StockSection 
                    title="Cosmetic Stock" 
                    items={stockData.cosmeticsStock || []} 
                    updateInterval="every 4 hours"
                    categoryKey="cosmetics"
                    timerRefs={timerRefs}
                    getItemImage={getItemImage}
                  />
                </div>
              </section>

              {/* Last Seen Items */}
              <section className="py-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Last Seen Items</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <LastSeenSection 
                    title="Seeds" 
                    items={stockData.lastSeen?.Seeds || []}
                    formatLastSeen={formatLastSeen}
                    getItemImage={getItemImage}
                  />
                  <LastSeenSection 
                    title="Gears" 
                    items={stockData.lastSeen?.Gears || []}
                    formatLastSeen={formatLastSeen}
                    getItemImage={getItemImage}
                  />
                  <LastSeenSection 
                    title="Eggs" 
                    items={stockData.lastSeen?.Eggs || []}
                    formatLastSeen={formatLastSeen}
                    getItemImage={getItemImage}
                  />
                </div>
              </section>

              {/* Market Statistics */}
              <section className="py-8">
                <MarketOverview stockData={stockData} />
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
