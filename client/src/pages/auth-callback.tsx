import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface RobloxUser {
  id: number;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<RobloxUser | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback starting...');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        console.log('URL parameters:', { code: !!code, state, error });

        if (error) {
          console.error('OAuth error from URL:', error);
          setStatus('error');
          setError(`Authentication failed: ${error}`);
          return;
        }

        if (!code) {
          console.error('No authorization code found');
          setStatus('error');
          setError('No authorization code received from Roblox');
          return;
        }

        // Verify state parameter for security
        const storedState = localStorage.getItem('oauth_state');
        console.log('State verification:', {
          receivedState: state,
          storedState: storedState,
          statesMatch: state === storedState
        });

        if (state && storedState && state !== storedState) {
          console.error('State mismatch - possible CSRF attack');
          setStatus('error');
          setError('Invalid state parameter - please try signing in again');
          return;
        }

        // Clear used state
        localStorage.removeItem('oauth_state');

        // Exchange authorization code via server (keeps client secret secure)
        console.log('Exchanging code for tokens via server...', {
          codeLength: code.length
        });

        const response = await fetch('/api/auth/roblox/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server token exchange failed:', errorData);
          
          // Handle specific OAuth errors with user-friendly messages
          if (errorData.error === 'Authorization code expired') {
            throw new Error('Your login session expired. Please try signing in again.');
          } else if (errorData.message) {
            throw new Error(errorData.message);
          } else {
            throw new Error(errorData.error || 'Authentication failed');
          }
        }

        const userData: RobloxUser = await response.json();
        
        // Store user data in localStorage
        localStorage.setItem('roblox_user', JSON.stringify(userData));
        localStorage.removeItem('oauth_state');
        
        setUser(userData);
        setStatus('success');
        
        // Redirect to home page after a brief delay
        setTimeout(() => {
          setLocation('/');
        }, 2000);

      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/80 border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-white">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome to the Trading Hub!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {status === 'loading' && 'Please wait while we verify your Roblox account'}
            {status === 'success' && 'You will be redirected shortly'}
            {status === 'error' && 'There was an issue with your authentication'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <p className="text-gray-300">Connecting to Roblox...</p>
            </div>
          )}
          
          {status === 'success' && user && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="flex items-center space-x-3">
                <img
                  src={user.profileImageUrl}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full border-2 border-purple-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 
                      `https://ui-avatars.com/api/?name=${user.username}&background=8b5cf6&color=fff&size=48`;
                  }}
                />
                <div className="text-left">
                  <p className="text-white font-medium">{user.displayName}</p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
              <p className="text-green-400">Successfully authenticated!</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-400">{error}</p>
              <Button 
                onClick={() => setLocation('/')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Return Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}