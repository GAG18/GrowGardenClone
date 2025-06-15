import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 rounded-full blur-xl animate-float" style={{animationDelay: '-2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-500 rounded-full blur-xl animate-float" style={{animationDelay: '-4s'}}></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="mb-8 animate-slide-up">
          {/* Garden scene hero banner */}
          <div className="relative mx-auto w-full max-w-4xl h-80 mb-8 rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-green-300 to-blue-400 flex items-center justify-center relative overflow-hidden">
              {/* Decorative garden elements */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-green-600 rounded-b-2xl"></div>
              <div className="absolute bottom-16 left-12 w-16 h-16 bg-orange-600 rounded-lg transform rotate-12"></div>
              <div className="absolute bottom-16 right-16 w-20 h-20 bg-orange-700 rounded-lg transform -rotate-12"></div>
              <div className="absolute top-8 left-1/4 w-12 h-12 bg-green-500 rounded-full"></div>
              <div className="absolute top-12 right-1/3 w-10 h-10 bg-green-400 rounded-full"></div>
              
              <div className="text-center z-10">
                <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl mb-4">
                  Grow a Garden
                </h1>
                <p className="text-2xl text-white/90 font-semibold">
                  ✨ #1 Trusted Trading Hub and Stocks
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          The Official Grow a Garden Trading Website: Advertise your items, discover official values, 
          connect with Middlemen, Vouch for traders, and chat with fellow Grow a Garden traders. 
          Find trades, make offers, and trade confidently!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="gaming-button text-lg animate-glow">
            Start Trading Now
          </Button>
          <Button className="gaming-button-outline text-lg">
            Join Discord
          </Button>
        </div>
      </div>
    </section>
  );
}
