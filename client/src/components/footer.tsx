import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const footerSections = [
    {
      title: "Trading",
      links: ["Trade Ads", "MiddleMan", "Item Values", "Live Stocks"]
    },
    {
      title: "Community", 
      links: ["Discord", "Vouch System", "Giveaways", "Guides"]
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"]
    }
  ];

  return (
    <footer className="bg-black/50 border-t border-purple-800/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold gradient-text mb-4">
              Grow a Garden
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The most trusted trading platform for Grow a Garden players worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                🎮
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                📺
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Grow a Garden Trading Platform. All rights reserved. Not affiliated with Roblox Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
