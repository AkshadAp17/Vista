import { useAuth } from "@/hooks/useAuth";
import SettingsContent from "@/components/settings-content";
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-white/50">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                  Account Settings
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your account information and security preferences
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Settings Content */}
          <SettingsContent isAdmin={(user as any)?.isAdmin} />
        </div>
      </div>
    </div>
  );
}