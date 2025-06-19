import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sprout, 
  Trophy, 
  TrendingUp, 
  Star,
  Leaf,
  Crown,
  Calendar,
  MapPin
} from "lucide-react";

export default function GameGuide() {
  const progressionTiers = [
    {
      name: "Beginner Tier",
      level: "Lv 1-10", 
      description: "Basic Equipment • Starter Locations • Community Support",
      icon: Leaf,
      color: "from-green-400 to-blue-500"
    },
    {
      name: "Advanced Tier",
      level: "Lv 11-25",
      description: "Premium Tools • Rare Locations • Market Analysis", 
      icon: Star,
      color: "from-purple-400 to-pink-500"
    },
    {
      name: "Expert Tier",
      level: "Lv 26+",
      description: "Exclusive Areas • Special Events • Advanced Features",
      icon: Crown,
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const rarityTiers = [
    { name: "Uncommon", description: "Foundation", color: "bg-gray-500" },
    { name: "Unusual", description: "Variations", color: "bg-green-500" },
    { name: "Rare", description: "Sought-after", color: "bg-blue-500" },
    { name: "Legendary", description: "Premium", color: "bg-purple-500" },
    { name: "Mythical", description: "Elite", color: "bg-pink-500" }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Master Grow a Garden</h2>
          <p className="text-gray-300 text-lg">Discover advanced techniques and strategies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Game Overview */}
          <div className="space-y-8">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Sprout className="text-green-400 mr-3" />
                  Game Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Welcome to <strong className="text-purple-400">Grow a Garden</strong>, where strategic farming meets dynamic trading. 
                  This revolutionary game combines <strong className="text-blue-400">immersive gameplay mechanics</strong> with a 
                  sophisticated <strong className="text-green-400">trading ecosystem</strong>, creating an unparalleled gaming 
                  experience for both casual gardeners and serious collectors.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
                    <h4 className="font-semibold mb-2 text-purple-400">Core Elements</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Dynamic Weather System</li>
                      <li>• Time-Based Events</li>
                      <li>• Season Changes</li>
                      <li>• Location Discovery</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
                    <h4 className="font-semibold mb-2 text-blue-400">Farming Techniques</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Precision Planting</li>
                      <li>• Seed Selection</li>
                      <li>• Equipment Mastery</li>
                      <li>• Skill Progression</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progression System */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Trophy className="text-yellow-400 mr-3" />
                  Progression System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressionTiers.map((tier) => {
                  const Icon = tier.icon;
                  return (
                    <div key={tier.name} className="flex items-center space-x-4 p-4 bg-black/30 rounded-xl border border-gray-700/50">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center`}>
                        <Icon className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{tier.name}</h4>
                        <p className="text-sm text-gray-400">{tier.description}</p>
                      </div>
                      <div className="text-purple-400 font-bold">{tier.level}</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Trading Strategies */}
          <div className="space-y-8">
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <TrendingUp className="text-blue-400 mr-3" />
                  Trading Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
                  <h4 className="font-semibold mb-3 text-green-400">Market Analysis</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="text-green-400" size={16} />
                      <span className="text-gray-300">Value Trends</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-blue-400" size={16} />
                      <span className="text-gray-300">Demand Patterns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-purple-400" size={16} />
                      <span className="text-gray-300">Seasonal Impact</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="text-pink-400" size={16} />
                      <span className="text-gray-300">Rarity Analysis</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-gray-700/50">
                  <h4 className="font-semibold mb-3 text-purple-400">Trading Techniques</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Value Trading</span>
                      <span className="text-green-400">Profit Optimization</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Collection Trading</span>
                      <span className="text-blue-400">Set Completion</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Event Trading</span>
                      <span className="text-purple-400">Seasonal Opportunities</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collection System */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Star className="text-pink-400 mr-3" />
                  Collection Mastery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {rarityTiers.map((tier) => (
                    <div key={tier.name} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${tier.color} rounded-full flex items-center justify-center`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="font-medium text-white">{tier.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{tier.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
