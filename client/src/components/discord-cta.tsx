import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, TrendingUp, Users } from "lucide-react";

export default function DiscordCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
            <div className="col-span-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
            <div className="col-span-1 bg-gradient-to-b from-transparent via-green-500 to-transparent"></div>
          </div>
        </div>

        <Card className="relative z-10 gaming-card p-12 border border-purple-800/30">
          <CardContent className="p-0">
            <div className="mb-8">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-4xl font-bold mb-4 text-white">Join the Grow a Garden Trading Discord</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Connect with fellow traders, get exclusive insights, and stay updated with real-time market analysis in our vibrant community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="text-2xl text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Live Chat</h3>
                <p className="text-sm text-gray-400">Real-time discussions with active traders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-2xl text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Market Updates</h3>
                <p className="text-sm text-gray-400">Instant notifications on value changes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-2xl text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Community</h3>
                <p className="text-sm text-gray-400">Connect with 50,000+ traders</p>
              </div>
            </div>

            <Button className="gaming-button text-lg animate-glow">
              🎮 Join Our Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
