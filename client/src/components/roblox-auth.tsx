import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";

interface RobloxUser {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export function RobloxAuth() {
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('roblox_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleRobloxLogin = async () => {
    setIsLoading(true);
    try {
      const clientId = import.meta.env.VITE_ROBLOX_CLIENT_ID;
      
      if (!clientId) {
        console.error('Roblox Client ID not configured');
        setIsLoading(false);
        return;
      }

      const state = Math.random().toString(36).substring(2, 15);
      const baseRedirectUri = `${window.location.origin}/auth/callback`;
      const redirectUri = encodeURIComponent(baseRedirectUri);
      
      const authUrl = `https://apis.roblox.com/oauth/v1/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=openid&` +
        `response_type=code&` +
        `state=${state}`;
      
      console.log('=== OAuth Debug Info ===');
      console.log('Current window location:', window.location.href);
      console.log('Window origin:', window.location.origin);
      console.log('Base redirect URI:', baseRedirectUri);
      console.log('Encoded redirect URI:', redirectUri);
      console.log('Client ID:', clientId);
      console.log('Full OAuth URL:', authUrl);
      console.log('========================');
      
      // Store state for validation
      localStorage.setItem('oauth_state', state);
      
      // Client-side OAuth redirect (works independently of server API access)
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('roblox_user');
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <img
              className="h-10 w-10 rounded-full border-2 border-purple-500"
              src={user.profileImageUrl}
              alt={user.displayName}
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                (e.target as HTMLImageElement).src = 
                  `https://ui-avatars.com/api/?name=${user.username}&background=8b5cf6&color=fff&size=40`;
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black/90 border-gray-700" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-white">{user.displayName}</p>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </div>
          </div>
          <div className="h-px bg-gray-700 my-1" />
          <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <div className="h-px bg-gray-700 my-1" />
          <DropdownMenuItem 
            className="text-red-400 hover:bg-gray-800 focus:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
      onClick={handleRobloxLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      ) : (
        <>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Roblox_Logo.svg/32px-Roblox_Logo.svg.png" 
            alt="Roblox" 
            className="w-3 h-3 mr-2"
          />
          Sign in
        </>
      )}
    </Button>
  );
}