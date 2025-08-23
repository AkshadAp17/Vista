import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Eye, Users, Lock, Database, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PrivacySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showOnlineStatus: true,
    allowMessages: true,
    shareActivity: false,
    dataCollection: true,
    thirdPartySharing: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "We'll process your request within 30 days. You'll receive an email confirmation.",
      variant: "destructive",
    });
  };

  const privacyOptions = [
    {
      key: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Allow other users to see your profile information',
      icon: Eye,
    },
    {
      key: 'showOnlineStatus',
      title: 'Online Status',
      description: 'Show when you\'re online to other users',
      icon: Users,
    },
    {
      key: 'allowMessages',
      title: 'Allow Messages',
      description: 'Let other users send you messages about vehicles',
      icon: Lock,
    },
    {
      key: 'shareActivity',
      title: 'Share Activity',
      description: 'Share your browsing activity to improve recommendations',
      icon: Database,
    },
    {
      key: 'dataCollection',
      title: 'Analytics Data',
      description: 'Help us improve our service with anonymous usage data',
      icon: Database,
    },
    {
      key: 'thirdPartySharing',
      title: 'Third-party Sharing',
      description: 'Share data with trusted partners for better service',
      icon: Users,
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
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-hema-secondary">Privacy Settings</h1>
                <p className="text-gray-600 text-sm">Control your privacy and data preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Privacy Controls */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Privacy Controls</span>
                <Badge variant="secondary" className="bg-hema-orange/10 text-hema-orange">
                  {user?.firstName} {user?.lastName}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {privacyOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div key={option.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-green-600" />
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

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button className="bg-hema-orange hover:bg-hema-orange/90" onClick={handleSave}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="text-red-600">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">Download Your Data</h3>
                <p className="text-sm text-red-700 mb-3">
                  Request a copy of all data we have about you, including your profile, messages, and activity.
                </p>
                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                  Request Data Export
                </Button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                <p className="text-sm text-red-700 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers including your profile, messages,
                        favorites, and chat history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteAccount}
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}