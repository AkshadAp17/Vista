import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner, DashboardStatsSkeleton, VehicleCardSkeleton } from "@/components/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Bike, Settings, Home } from "lucide-react";
import VehicleCard from "@/components/vehicle-card";
import ChatWidget from "@/components/chat-widget";
import FloatingBusinessCard from "@/components/floating-business-card";
import SettingsForm from "@/components/settings-form";
import logoIcon from "@assets/image_1752002668870.png";

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

  const { data: favoriteVehicles = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 sm:space-x-4">
{/*               <img src={logoIcon} alt="Hema Motor" className="h-8 w-8 sm:h-10 sm:w-10" /> */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Bike className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-hema-secondary">
                  Welcome, {user?.firstName || 'User'}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Manage your vehicle interests and messages</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-wrap">
              <SettingsForm isAdmin={false} />
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm touch-target"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Browse Vehicles</span>
                <span className="sm:hidden">Browse</span>
              </Button>
              <Button 
                size="sm"
                className="bg-hema-orange hover:bg-hema-orange/90 text-xs sm:text-sm touch-target"
                onClick={() => window.location.href = '/api/auth/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  <p className="text-2xl font-bold text-hema-secondary">{favoriteVehicles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Bike className="h-6 w-6" />
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
                          <Bike className="h-8 w-8 text-gray-500" />
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
                            onClick={() => {
                              // Open chat widget and navigate to this specific chat
                              const chatWidget = document.querySelector('[data-chat-widget]') as HTMLElement;
                              if (chatWidget) {
                                chatWidget.click();
                              }
                              // Store the selected chat ID for the widget to open
                              localStorage.setItem('selectedChatId', chat.id);
                            }}
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
                {favoritesLoading ? (
                  <div className="text-center py-8">Loading favorites...</div>
                ) : favoriteVehicles.length === 0 ? (
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteVehicles.map((vehicle: any) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                )}
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
                      <SettingsForm isAdmin={false} />
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
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2">{(user as any)?.phoneNumber || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Member since:</span>
                          <span className="ml-2">
                            {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Recent member'}
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
      
      {/* Business Card positioned opposite to chat button */}
      <FloatingBusinessCard className="fixed bottom-4 left-4 z-50" />
    </div>
  );
}
