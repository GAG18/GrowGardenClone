import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const chatMessages = [
  {
    id: 1,
    username: "PetSimKing_2025",
    message: "Hey, would you be interested in this trade?",
    time: "2m ago",
    avatar: "P",
    color: "from-purple-500 to-blue-500"
  },
  {
    id: 2,
    username: "RobloxPro_Gaming123", 
    message: "Hmm, that looks like a good trade! I've been looking for a Candy Blossom.",
    time: "1m ago",
    avatar: "R",
    color: "from-green-400 to-emerald-500"
  }
];

export default function TradingInterface() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Live Trading Messages</h2>
          <p className="text-gray-300 text-lg">Engage in real-time messaging for the best deals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Trading Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-80 overflow-y-auto mb-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${message.color} rounded-full flex items-center justify-center`}>
                      <span className="text-sm font-bold text-white">{message.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-purple-400">{message.username}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-gray-300">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1 bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
                <Button size="icon" className="bg-purple-600 hover:bg-purple-700">
                  <Send size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trade Offer */}
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Active Trade Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Offering Section */}
              <div>
                <h4 className="font-semibold mb-3 text-green-400">Offering</h4>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center text-xl">
                      🌸
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-white">Candy Blossom</h5>
                      <p className="text-sm text-gray-400">Rare Crop</p>
                      <p className="text-green-400 font-bold">Value: 100,000</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">×1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wants Section */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-400">Wants</h4>
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                      🐲
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-white">Dragon Fruit</h5>
                      <p className="text-sm text-gray-400">Epic Crop</p>
                      <p className="text-blue-400 font-bold">Value: 4,750 each</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">×3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Actions */}
              <div className="flex space-x-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Accept Trade
                </Button>
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
