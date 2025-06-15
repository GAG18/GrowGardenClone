import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <section className="py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center">
                <Settings className="mr-3" size={36} />
                Admin Panel
              </h1>
              <p className="text-gray-400">Manage trading items and platform settings.</p>
            </div>
          </section>

          {/* Admin Tools */}
          <section className="py-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Database Stats */}
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-purple-400 flex items-center">
                    <Database className="mr-2" size={18} />
                    Database Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/30 rounded-xl p-6 border border-gray-700/50">
                      <div className="text-2xl font-bold text-white mb-2">Loading...</div>
                      <div className="text-gray-400 text-sm">Total Trading Items</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-6 border border-gray-700/50">
                      <div className="text-2xl font-bold text-white mb-2">Loading...</div>
                      <div className="text-gray-400 text-sm">Active Trade Ads</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-6 border border-gray-700/50">
                      <div className="text-2xl font-bold text-white mb-2">Loading...</div>
                      <div className="text-gray-400 text-sm">Registered Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card className="gaming-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-purple-400 flex items-center">
                    <Database className="mr-2" size={18} />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Platform is connected to MongoDB Atlas cloud database with 136 authentic trading items.
                    </p>
                    <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                      <ul className="space-y-2 text-sm">
                        <li className="text-white"><strong>Database:</strong> MongoDB Atlas (Cloud)</li>
                        <li className="text-white"><strong>Items:</strong> 136 authentic Roblox trading items</li>
                        <li className="text-white"><strong>Authentication:</strong> Roblox OAuth integration</li>
                        <li className="text-white"><strong>Images:</strong> GridFS storage with proxy server</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}