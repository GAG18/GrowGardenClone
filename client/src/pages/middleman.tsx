import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, CheckCircle } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const middlemen = [
  {
    id: 1,
    username: "TrustedTrader_Pro",
    reputation: 456,
    completedTrades: 1247,
    status: "online",
    avatar: "T"
  },
  {
    id: 2,
    username: "SafeTrading_Expert",
    reputation: 389,
    completedTrades: 892,
    status: "online", 
    avatar: "S"
  },
  {
    id: 3,
    username: "MiddleMan_Supreme",
    reputation: 567,
    completedTrades: 1456,
    status: "busy",
    avatar: "M"
  }
];

export default function MiddleMan() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-20 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-4xl text-white" size={48} />
              </div>
              <h1 className="text-5xl font-bold mb-4 gradient-text">
                Trusted Middleman Service
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Trade with confidence using our verified middleman service. Our trusted community members 
                ensure safe and secure trades for all participants.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="gaming-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Request Middleman</h3>
                  <p className="text-gray-400">
                    Both traders agree to use a middleman and submit a request with trade details.
                  </p>
                </CardContent>
              </Card>

              <Card className="gaming-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Get Matched</h3>
                  <p className="text-gray-400">
                    Our system assigns an available trusted middleman to facilitate your trade.
                  </p>
                </CardContent>
              </Card>

              <Card className="gaming-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Safe Trade</h3>
                  <p className="text-gray-400">
                    Complete your trade safely with the middleman ensuring both parties receive their items.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Available Middlemen */}
          <section className="py-16">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">Available Middlemen</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">3 Online</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {middlemen.map((middleman) => (
                <Card key={middleman.id} className="gaming-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{middleman.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">{middleman.username}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${middleman.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <span className={`text-sm ${middleman.status === 'online' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {middleman.status === 'online' ? 'Online' : 'Busy'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Reputation</span>
                        <span className="font-bold text-purple-400">{middleman.reputation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Completed Trades</span>
                        <span className="font-bold text-green-400">{middleman.completedTrades.toLocaleString()}</span>
                      </div>
                      <Button 
                        className="w-full gaming-button"
                        disabled={middleman.status === 'busy'}
                      >
                        {middleman.status === 'online' ? 'Request Middleman' : 'Currently Busy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Request Form */}
          <section className="py-16">
            <Card className="gaming-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-white">
                  Request Middleman Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-yellow-400" size={20} />
                      <span className="text-yellow-400 font-semibold">Estimated Wait Time: 5-10 minutes</span>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="text-6xl">🛡️</div>
                    <h3 className="text-xl font-bold text-white">Ready to Trade Safely?</h3>
                    <p className="text-gray-400">
                      Join the game and both traders should be ready before requesting a middleman.
                    </p>
                    <Button className="gaming-button text-lg">
                      Start Middleman Request
                    </Button>
                  </div>
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