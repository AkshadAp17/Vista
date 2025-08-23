import { useAuth } from "@/hooks/useAuth";
import SettingsForm from "@/components/settings-form";
import Header from "@/components/header";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            <SettingsForm isAdmin={(user as any)?.isAdmin} />
          </div>
        </div>
      </div>
    </div>
  );
}