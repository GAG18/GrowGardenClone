import { Settings } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-6">
      <div className="bg-gray-900/90 rounded-xl p-16 max-w-2xl w-full text-center border border-gray-700">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-8">
          <Settings className="w-10 h-10 text-gray-800" />
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-white mb-6">
          We'll Be Back Soon!
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-blue-400 font-semibold mb-8">
          Site Temporarily Unavailable
        </p>
        
        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed mb-12">
          We're currently working on some updates to improve your experience. 
          We'll be back online shortly. Thank you for your patience!
        </p>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-10">
          {/* Stay Connected Section */}
          <h3 className="text-2xl font-semibold text-white mb-4">
            Stay Connected
          </h3>
          
          <p className="text-gray-300 mb-6">
            Join our community for updates and announcements.
          </p>
          
          {/* Discord Button */}
          <a 
            href="https://discord.com/invite/wdMqEBAB4Z" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-lg"
          >
            💬 Join Our Discord
          </a>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <p className="text-gray-400">
            Thank you for your patience and understanding.
          </p>
        </div>
      </div>
    </div>
  );
}