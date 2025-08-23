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
// import logoIcon from "@assets/image_1752002668870.png";

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
      <div className="flex items-center justify-center min-h-screen bg-neutral">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-xl border-b-2 border-orange-100 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50">
                <Bike className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-medium">Your personalized dashboard awaits</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm border-2 border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 font-semibold"
                onClick={() => window.location.href = '/settings'}
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm border-2 border-gray-300 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-200"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Browse Vehicles</span>
                <span className="sm:hidden">Browse</span>
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.location.href = '/api/auth/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Chats</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {chatRooms.filter((chat: any) => chat.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Favorites</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{favoriteVehicles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50">
                  <Bike className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Vehicles Viewed</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {chatRooms.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chats" className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 border-2 border-white/50">
            <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
              <TabsTrigger 
                value="chats" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-200 font-semibold py-3 rounded-xl"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                My Chats
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-200 font-semibold py-3 rounded-xl"
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-200 font-semibold py-3 rounded-xl"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chats" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Your Active Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {chatsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your conversations...</p>
                  </div>
                ) : chatRooms.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                    <MessageCircle className="mx-auto h-20 w-20 text-blue-400 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No conversations yet</h3>
                    <p className="text-gray-600 mb-6 text-lg">Start chatting with sellers about vehicles you're interested in</p>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => window.location.href = '/'}
                    >
                      <Bike className="h-5 w-5 mr-2" />
                      Browse Vehicles
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {chatRooms.map((chat: any) => (
                      <div key={chat.id} className="flex items-center space-x-6 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Bike className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-xl font-bold text-gray-900">{chat.vehicle?.brand} {chat.vehicle?.model}</h4>
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-sm font-semibold">{chat.vehicle?.vehicleNumber}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 font-medium">
                            Seller: {chat.seller?.firstName} {chat.seller?.lastName}
                          </p>
                          <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ₹{chat.vehicle?.price ? parseFloat(chat.vehicle.price.toString()).toLocaleString() : 'N/A'}
                          </p>
                          {chat.messages?.length > 0 && (
                            <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-2 rounded-lg italic">
                              "{chat.messages[chat.messages.length - 1]?.content}"
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-2 border-gray-300 hover:border-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-200 font-semibold"
                            onClick={() => window.location.href = `/vehicle/${chat.vehicle?.id}`}
                          >
                            View Vehicle
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Heart className="h-6 w-6 mr-3" />
                  Your Favorite Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {favoritesLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your favorites...</p>
                  </div>
                ) : favoriteVehicles.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-100">
                    <Heart className="mx-auto h-20 w-20 text-red-400 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No favorites yet</h3>
                    <p className="text-gray-600 mb-6 text-lg">Save vehicles you're interested in to view them later</p>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => window.location.href = '/'}
                    >
                      <Bike className="h-5 w-5 mr-2" />
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
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <User className="h-6 w-6 mr-3" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div className="flex items-center space-x-6 bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-100">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-gray-600 text-lg font-medium">{user?.email}</p>
                      <Button 
                        className="mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => window.location.href = '/settings'}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Name:</span>
                          <span className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Email:</span>
                          <span className="font-semibold text-gray-900">{user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Phone:</span>
                          <span className="font-semibold text-gray-900">{(user as any)?.phoneNumber || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 font-medium">Member since:</span>
                          <span className="font-semibold text-gray-900">
                            {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Recent member'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-100 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start border-2 border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 font-semibold"
                          onClick={() => window.location.href = '/settings'}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start border-2 border-gray-200 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-all duration-200 font-semibold"
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Notification Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start border-2 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 font-semibold"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Privacy Settings
                        </Button>
                      </CardContent>
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
