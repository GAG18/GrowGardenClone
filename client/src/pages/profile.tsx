import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Star, Trash2, Edit, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { TradeAd } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";

interface RobloxUser {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export default function Profile() {
  const queryClient = useQueryClient();

  // Get current user from localStorage (since auth is working)
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('roblox_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }
    setUserLoading(false);
  }, []);

  // Get user's trade ads
  const { data: tradeAds = [], isLoading: adsLoading } = useQuery<TradeAd[]>({
    queryKey: ['/api/trade-ads/my-ads'],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch('/api/trade-ads/my-ads', {
        headers: {
          'x-user-data': JSON.stringify(user)
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trade ads');
      }
      return response.json();
    }
  });

  // Delete trade ad mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (adId: number) => {
      const response = await fetch(`/api/trade-ads/${adId}`, {
        method: 'DELETE',
        headers: {
          'x-user-data': JSON.stringify(user)
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete trade ad');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trade-ads/my-ads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trade-ads'] });
    },
  });

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-muted-foreground mb-4">You need to sign in to view your profile</p>
            <Button asChild>
              <a href="/api/roblox/auth">Sign in with Roblox</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeAds = tradeAds.filter(ad => ad.status === 'active');
  const completedAds = tradeAds.filter(ad => ad.status === 'completed');

  const parseItems = (itemsString: string) => {
    try {
      return JSON.parse(itemsString);
    } catch {
      return [];
    }
  };

  const TradeAdCard = ({ ad }: { ad: TradeAd }) => {
    const offeringItems = parseItems(ad.offeringItems);
    const wantingItems = parseItems(ad.wantingItems);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{ad.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Created {format(new Date(ad.createdAt || ''), 'MMM d, yyyy')}
              </CardDescription>
            </div>
            <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
              {ad.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {ad.description && (
            <p className="text-sm text-muted-foreground mb-4">{ad.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Offering ({offeringItems.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {offeringItems.slice(0, 3).map((item: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item.name}
                  </Badge>
                ))}
                {offeringItems.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{offeringItems.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Wanting ({wantingItems.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {wantingItems.slice(0, 3).map((item: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item.name}
                  </Badge>
                ))}
                {wantingItems.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{wantingItems.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trade-ads`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            
            {ad.status === 'active' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAdMutation.mutate(ad.id)}
                disabled={deleteAdMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={user.profileImageUrl} 
                  alt={user.displayName}
                />
                <AvatarFallback className="text-lg">
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{tradeAds.length} Trade Ads</span>
                  <span>{activeAds.length} Active</span>
                  <span>{completedAds.length} Completed</span>
                </div>
              </div>
              
              <div className="text-right">
                <Button asChild>
                  <Link href="/create-trade-ad">Create New Trade Ad</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade Ads Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Ads ({activeAds.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAds.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Ads ({tradeAds.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          {adsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : activeAds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Trade Ads</h3>
                <p className="text-muted-foreground mb-4">Create your first trade ad to start trading</p>
                <Button asChild>
                  <Link href="/create-trade-ad">Create Trade Ad</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeAds.map((ad) => (
                <TradeAdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedAds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Trades</h3>
                <p className="text-muted-foreground">Your completed trades will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedAds.map((ad) => (
                <TradeAdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          {tradeAds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Trade Ads Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first trade ad to get started</p>
                <Button asChild>
                  <Link href="/create-trade-ad">Create Trade Ad</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tradeAds.map((ad) => (
                <TradeAdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}