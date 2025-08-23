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
import { MessageCircle, Heart, Bike, Settings, Home, User, Bell } from "lucide-react";
import VehicleCard from "@/components/vehicle-card";
import ChatWidget from "@/components/chat-widget";
import FloatingBusinessCard from "@/components/floating-business-card";
import SettingsForm from "@/components/settings-form";
// import logoIcon from "@assets/image_1752002668870.png";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Check for chat parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat');
    if (chatId && isAuthenticated) {
      // Automatically open chat widget and select the chat
      setTimeout(() => {
        const chatWidget = document.querySelector('[data-chat-widget]') as HTMLButtonElement;
        if (chatWidget) {
          chatWidget.click();
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('selectChat', { 
              detail: { chatRoomId: chatId } 
            }));
          }, 500);
        }
      }, 1000);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [isAuthenticated]);

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

  const { data: chatRooms = [], isLoading: chatsLoading } = useQuery<any[]>({
    queryKey: ["/api/chat-rooms"],
    enabled: !!user,
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery<any[]>({
    queryKey: ["/api/vehicles"],
    enabled: !!user,
  });

  const { data: favoriteVehicles = [], isLoading: favoritesLoading } = useQuery<any[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-hema-orange rounded-lg flex items-center justify-center">
                <Bike className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-hema-secondary">
                  Welcome, {user?.firstName || 'User'}
                </h1>
                <p className="text-gray-600 text-sm">Manage your vehicles and messages</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => window.location.href = '/settings'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                size="sm"
                className="bg-hema-orange hover:bg-hema-orange/90 text-white text-xs sm:text-sm"
                onClick={() => window.location.href = '/api/auth/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="bg-white shadow-sm border">
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
          
          <Card className="bg-white shadow-sm border">
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
          
          <Card className="bg-white shadow-sm border">
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
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="chats" className="data-[state=active]:bg-hema-orange data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              My Chats
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-hema-orange data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-hema-orange data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chats" className="space-y-6">
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-hema-orange" />
                  Your Active Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="md" text="Loading your chats..." />
                  </div>
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
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-hema-orange" />
                  Your Favorite Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="md" text="Loading your favorites..." />
                  </div>
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
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-hema-orange" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-100">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                          <AvatarImage src={user?.profileImageUrl || ""} />
                          <AvatarFallback className="text-2xl bg-hema-orange text-white font-bold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-hema-secondary">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-gray-600 text-lg">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <Button 
                            className="bg-hema-orange hover:bg-hema-orange/90 text-white"
                            size="sm"
                            onClick={() => window.location.href = '/settings'}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Online
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-4 bg-white border border-gray-200">
                      <h4 className="font-semibold text-hema-secondary mb-4 flex items-center">
                        <User className="h-4 w-4 mr-2 text-hema-orange" />
                        Account Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Name</span>
                          <span className="font-semibold">{user?.firstName} {user?.lastName}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Email</span>
                          <span className="font-semibold">{user?.email}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Phone</span>
                          <span className="font-semibold">{(user as any)?.phoneNumber || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600 font-medium">Member since</span>
                          <span className="font-semibold">
                            {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Recent member'}
                          </span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-white border border-gray-200">
                      <h4 className="font-semibold text-hema-secondary mb-4 flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-hema-orange" />
                        Quick Actions
                      </h4>
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start border-hema-orange/20 hover:bg-hema-orange hover:text-white transition-all"
                          onClick={() => window.location.href = '/settings'}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Account Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start border-blue-200 hover:bg-blue-500 hover:text-white transition-all"
                          onClick={() => window.location.href = '/settings/notifications'}
                        >
                          <Bell className="h-4 w-4 mr-3" />
                          Notification Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start border-green-200 hover:bg-green-500 hover:text-white transition-all"
                          onClick={() => window.location.href = '/settings/privacy'}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Privacy Settings
                        </Button>
                      </div>
                    </Card>
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
