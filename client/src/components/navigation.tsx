import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { RobloxAuth } from "@/components/roblox-auth";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Trade Ads", path: "/trade-ads" },
    { label: "MiddleMan", path: "/middleman" }, 
    { label: "Stocks", path: "/stocks" },
    { label: "Weather", path: "/status" },
    { label: "Item List", path: "/value-list" },
    { label: "Vouch", path: "/status" },
    { label: "Search", path: "/status" },
    { label: "Giveaways", path: "#" }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-purple-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold gradient-text">
              Grow a Garden
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.label === "Giveaways") {
                return (
                  <a
                    key={item.label}
                    href="https://discord.com/invite/wdMqEBAB4Z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`text-gray-300 hover:text-purple-400 transition-colors ${
                    location === item.path ? 'text-purple-400 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <RobloxAuth />
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
              if (item.label === "Giveaways") {
                return (
                  <a
                    key={item.label}
                    href="https://discord.com/invite/wdMqEBAB4Z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`block py-2 text-gray-300 hover:text-purple-400 transition-colors ${
                    location === item.path ? 'text-purple-400 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-4">
              <RobloxAuth />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
