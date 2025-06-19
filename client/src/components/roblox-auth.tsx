import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { Link } from "wouter";

interface RobloxUser {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export function RobloxAuth() {
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Force clear any stuck state on component mount
  useEffect(() => {
    localStorage.removeItem('oauth_state');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('roblox_user');
    console.log('Checking localStorage for user:', storedUser);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        
        // Fix any old incorrect image proxy URLs
        if (userData.profileImageUrl && userData.profileImageUrl.includes('/api/proxy-image')) {
          userData.profileImageUrl = userData.profileImageUrl.replace('/api/proxy-image', '/api/image-proxy');
          // Update localStorage with corrected URL
          localStorage.setItem('roblox_user', JSON.stringify(userData));
          console.log('Fixed profile image URL in localStorage');
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('roblox_user');
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');
    
    console.log('OAuth callback check:', { code: !!code, state, storedState });
    
    if (code && state && state === storedState) {
      console.log('Valid OAuth callback detected, exchanging code for token');
      setIsLoading(true);
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      console.log('Exchanging code for token...');
      
      const clientId = import.meta.env.VITE_ROBLOX_CLIENT_ID;
      if (!clientId) {
        throw new Error('VITE_ROBLOX_CLIENT_ID is not configured');
      }

      const response = await fetch('https://apis.roblox.com/oauth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: import.meta.env.VITE_ROBLOX_CLIENT_SECRET || '',
          grant_type: 'authorization_code',
          code: code,
        }),
      });

      console.log('Token exchange response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange failed:', errorText);
        throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
      }

      const tokenData = await response.json();
      console.log('Token exchange successful');
      
      // Get user info
      const userInfoResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await userInfoResponse.json();
      console.log('User info fetched:', userInfo);
      
      // Get user details from public API
      const userDetailsResponse = await fetch(`https://users.roblox.com/v1/users/${userInfo.sub}`);
      const userDetails = await userDetailsResponse.json();
      
      const userData: RobloxUser = {
        id: parseInt(userInfo.sub),
        username: userDetails.name || userInfo.preferred_username || 'Unknown',
        displayName: userDetails.displayName || userInfo.name || userDetails.name || 'Unknown',
        profileImageUrl: userInfo.picture ? `/api/image-proxy?url=${encodeURIComponent(userInfo.picture)}` : ''
      };

      console.log('Final user data:', userData);
      
      // Store user data
      localStorage.setItem('roblox_user', JSON.stringify(userData));
      localStorage.removeItem('oauth_state');
      setUser(userData);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (error) {
      console.error('OAuth flow failed:', error);
      alert('Login failed. Please try again.');
      localStorage.removeItem('oauth_state');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    console.log('Starting OAuth login flow');
    
    const clientId = import.meta.env.VITE_ROBLOX_CLIENT_ID;
    if (!clientId) {
      console.error('VITE_ROBLOX_CLIENT_ID is not configured');
      alert('OAuth is not configured. Please check environment variables.');
      return;
    }

    // Generate a random state for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    
    // Get current URL for redirect
    const currentUrl = window.location.origin + window.location.pathname;
    
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(currentUrl)}&` +
      `scope=openid profile&` +
      `response_type=code&` +
      `state=${state}`;
    
    console.log('Redirecting to OAuth URL:', authUrl);
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    console.log('Logging out user');
    localStorage.removeItem('roblox_user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <Button disabled className="bg-green-600 hover:bg-green-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-purple-400">
            <User className="w-4 h-4" />
            <span>@{user.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center space-x-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center space-x-2 cursor-pointer text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={handleLogin}
      className="bg-green-600 hover:bg-green-700 text-white"
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