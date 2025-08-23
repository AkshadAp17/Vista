import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Mail, MessageSquare, Heart, Bike } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    chatMessages: true,
    newFavorites: false,
    vehicleUpdates: true,
    marketingEmails: false,
    pushNotifications: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const settingOptions = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive important updates via email',
      icon: Mail,
    },
    {
      key: 'chatMessages',
      title: 'Chat Messages',
      description: 'Get notified when you receive new messages',
      icon: MessageSquare,
    },
    {
      key: 'newFavorites',
      title: 'Favorite Vehicle Updates',
      description: 'Updates about vehicles you\'ve favorited',
      icon: Heart,
    },
    {
      key: 'vehicleUpdates',
      title: 'Vehicle Status Changes',
      description: 'When vehicles you\'re interested in are sold or updated',
      icon: Bike,
    },
    {
      key: 'marketingEmails',
      title: 'Marketing Communications',
      description: 'Promotional emails and special offers',
      icon: Mail,
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Browser notifications for real-time updates',
      icon: Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-hema-orange"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-hema-orange rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-hema-secondary">Notification Settings</h1>
                <p className="text-gray-600 text-sm">Manage your notification preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="bg-white shadow-sm border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notification Preferences</span>
              <Badge variant="secondary" className="bg-hema-orange/10 text-hema-orange">
                {user?.firstName} {user?.lastName}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {settingOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[option.key as keyof typeof settings]}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, [option.key]: checked }))
                    }
                    className="data-[state=checked]:bg-hema-orange"
                  />
                </div>
              );
            })}

            <div className="pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email Frequency</h3>
                  <p className="text-sm text-gray-600">How often would you like to receive email summaries?</p>
                </div>
                <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-hema-orange focus:border-hema-orange">
                  <option>Immediately</option>
                  <option>Daily Digest</option>
                  <option>Weekly Summary</option>
                  <option>Never</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button className="bg-hema-orange hover:bg-hema-orange/90" onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}