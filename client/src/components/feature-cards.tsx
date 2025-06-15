import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRightLeft, 
  Shield, 
  List, 
  ThumbsUp, 
  Gift 
} from "lucide-react";

const features = [
  {
    icon: ArrowRightLeft,
    title: "Trade Ads",
    description: "Advertise your trade",
    gradient: "from-purple-500 to-blue-500"
  },
  {
    icon: Shield,
    title: "MiddleMan",
    description: "Find a middleman",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: List,
    title: "Item List", 
    description: "Check current values",
    gradient: "from-green-400 to-emerald-500"
  },
  {
    icon: ThumbsUp,
    title: "Vouch",
    description: "Rep other players",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    icon: Gift,
    title: "Giveaways",
    description: "Win awesome prizes",
    gradient: "from-pink-500 to-red-500"
  }
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="gaming-card">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-2xl text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
