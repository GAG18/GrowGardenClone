import { Card } from "@/components/ui/card";
import { Gamepad2, Users } from "lucide-react";

const trustedPartners = [
  { name: "AlphaGG", icon: "🎮" },
  { name: "GuiGuiDragons", icon: "🐲" },
  { name: "Naits", icon: "⭐" },
  { name: "Nuke", icon: "💣" },
  { name: "num", icon: "#️⃣" },
  { name: "PHMittens", icon: "🐾" },
  { name: "RyanBlox", icon: "👤" },
  { name: "FoltynPlays", icon: "▶️" }
];

const supportedGames = [
  { name: "Anime Defenders", icon: "⚔️", color: "from-red-500 to-pink-500" },
  { name: "Blox Fruits", icon: "☠️", color: "from-orange-500 to-red-500" },
  { name: "Counter Blox", icon: "🎯", color: "from-gray-500 to-black" },
  { name: "Jailbreak", icon: "🚗", color: "from-blue-500 to-indigo-600" },
  { name: "Murder Mystery", icon: "🥷", color: "from-purple-500 to-pink-500" },
  { name: "Pets Go", icon: "🐕", color: "from-green-400 to-blue-500" },
  { name: "Pet Sim 99", icon: "🐱", color: "from-yellow-400 to-orange-500" },
  { name: "Fisch", icon: "🐟", color: "from-blue-400 to-cyan-500" }
];

export default function TrustedPartners() {
  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">Trusted by the Community</h2>
        <p className="text-gray-300 text-lg mb-12">Supporting trading communities across Roblox</p>
        
        {/* Trusted Content Creators */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Trusted Content Creators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            {trustedPartners.map((partner, index) => (
              <div key={partner.name} className="flex flex-col items-center space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform`}>
                  {partner.icon}
                </div>
                <span className="text-sm font-medium text-gray-300">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Supported Games */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Supporting Other Games</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {supportedGames.map((game) => (
              <Card key={game.name} className="gaming-card p-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${game.color} rounded-lg flex items-center justify-center mx-auto text-xl`}>
                  {game.icon}
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="text-center">
          <div className="text-6xl font-bold text-purple-400 mb-4">240K</div>
          <p className="text-xl text-gray-300">Active traders in our community</p>
        </div>
      </div>
    </section>
  );
}
