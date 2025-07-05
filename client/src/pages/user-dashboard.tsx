import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Car, Settings, Home } from "lucide-react";
import VehicleCard from "@/components/vehicle-card";
import ChatWidget from "@/components/chat-widget";
import SettingsForm from "@/components/settings-form";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: chatRooms = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["/api/chat-rooms"],
    enabled: !!user,
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles"],
    enabled: !!user,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profileImageUrl || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-hema-secondary">
                  Welcome, {user?.firstName || 'User'}
                </h1>
                <p className="text-gray-600">Manage your vehicle interests and messages</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SettingsForm isAdmin={false} />
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-4 w-4 mr-2" />
                Browse Vehicles
              </Button>
              <Button 
                className="bg-hema-orange hover:bg-hema-orange/90"
                onClick={() => window.location.href = '/api/auth/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-hema-secondary">
                    {chatRooms.filter((chat: any) => chat.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-hema-secondary">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Vehicles Viewed</p>
                  <p className="text-2xl font-bold text-hema-secondary">
                    {chatRooms.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chats">My Chats</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Active Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {chatsLoading ? (
                  <div className="text-center py-8">Loading chats...</div>
                ) : chatRooms.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 mb-4">Start chatting with sellers about vehicles you're interested in</p>
                    <Button 
                      className="bg-hema-orange hover:bg-hema-orange/90"
                      onClick={() => window.location.href = '/'}
                    >
                      Browse Vehicles
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatRooms.map((chat: any) => (
                      <div key={chat.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{chat.vehicle?.brand} {chat.vehicle?.model}</h4>
                            <Badge variant="secondary">{chat.vehicle?.vehicleNumber}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Seller: {chat.seller?.firstName} {chat.seller?.lastName}
                          </p>
                          <p className="text-sm text-hema-orange font-medium">
                            ₹{chat.vehicle?.price ? parseFloat(chat.vehicle.price.toString()).toLocaleString() : 'N/A'}
                          </p>
                          {chat.messages?.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                              Last message: {chat.messages[chat.messages.length - 1]?.content}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/vehicle/${chat.vehicle?.id}`}
                          >
                            View Vehicle
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-hema-orange hover:bg-hema-orange/90"
                          >
                            Continue Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Favorite Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-4">Save vehicles you're interested in to view them later</p>
                  <Button 
                    className="bg-hema-orange hover:bg-hema-orange/90"
                    onClick={() => window.location.href = '/'}
                  >
                    Browse Vehicles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="text-xl">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Account Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2">{user?.firstName} {user?.lastName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2">{user?.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Member since:</span>
                          <span className="ml-2">
                            {new Date(user?.createdAt || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Preferences</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Notification Settings
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Privacy Settings
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Location Preferences
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ChatWidget />
    </div>
  );
}
