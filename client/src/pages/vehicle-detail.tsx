import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Calendar,
  Gauge,
  Fuel,
  User,
  Shield,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function VehicleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSellerProfile, setShowSellerProfile] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: [`/api/vehicles/${id}`],
    enabled: !!id,
  });

  const createChatMutation = useMutation({
    mutationFn: (vehicleId: number) => 
      apiRequest("POST", "/api/chat-rooms", { vehicleId }),
    onSuccess: (response) => {
      toast({
        title: "Chat Started",
        description: "Redirecting to your conversations...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chat-rooms"] });
      // Redirect to dashboard with chat focus
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to chat with sellers",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
            <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.location.href = '/'}>
              Browse Vehicles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartChat = () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to login to chat with sellers",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (user.id === vehicle.sellerId) {
      toast({
        title: "Cannot Chat",
        description: "You cannot start a chat with yourself",
        variant: "destructive",
      });
      return;
    }

    createChatMutation.mutate(vehicle.id);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Images */}
          <div className="space-y-4">
            <div className="relative">
              {vehicle?.images && vehicle.images.length > 0 ? (
                <>
                  <img 
                    src={vehicle.images[currentImageIndex] || vehicle.images[0]} 
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {vehicle.images.length > 1 && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === 0 ? vehicle.images.length - 1 : prev - 1
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === vehicle.images.length - 1 ? 0 : prev + 1
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {currentImageIndex + 1} / {vehicle.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No images available</p>
                  </div>
                </div>
              )}
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button size="sm" variant="outline" className="bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {vehicle?.images && vehicle.images.length > 0 ? (
                vehicle.images.slice(0, 4).map((image: string, i: number) => (
                  <div 
                    key={i} 
                    className={`w-full h-16 bg-gray-200 rounded cursor-pointer hover:ring-2 hover:ring-hema-orange overflow-hidden ${
                      currentImageIndex === i ? 'ring-2 ring-hema-orange' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(i)}
                  >
                    <img 
                      src={image} 
                      alt={`${vehicle.brand} ${vehicle.model} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-16 bg-gray-200 rounded cursor-pointer hover:ring-2 hover:ring-hema-orange">
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-hema-secondary mb-2">
                {vehicle.brand} {vehicle.model}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {vehicle.year}
                </span>
                <span className="flex items-center">
                  <Gauge className="h-4 w-4 mr-1" />
                  {vehicle.kmDriven.toLocaleString()} km
                </span>
                <span className="flex items-center">
                  <Fuel className="h-4 w-4 mr-1" />
                  {vehicle.fuelType}
                </span>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-hema-orange">
                    ₹{parseFloat(vehicle.price.toString()).toLocaleString()}
                  </span>
                  {(() => {
                    const getStatusInfo = (status: "available" | "pending" | "sold") => {
                      switch (status) {
                        case 'available':
                          return { label: 'Available', color: 'bg-green-100 text-green-800', icon: Check };
                        case 'pending':
                          return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
                        case 'sold':
                          return { label: 'Sold', color: 'bg-red-100 text-red-800', icon: X };
                        default:
                          return { label: 'Available', color: 'bg-green-100 text-green-800', icon: Check };
                      }
                    };
                    const statusInfo = getStatusInfo(vehicle.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusInfo.label}</span>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Engine:</span>
                    <span className="font-medium ml-2">{vehicle.engineCapacity || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium ml-2 capitalize">{vehicle.condition}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium ml-2 capitalize">{vehicle.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="font-medium ml-2 capitalize">{vehicle.fuelType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-hema-orange" />
                <div>
                  <p className="text-gray-600 text-sm">Vehicle Number</p>
                  <p className="font-medium">{vehicle.vehicleNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-hema-orange" />
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-medium">{vehicle.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-hema-orange" />
                <div>
                  <p className="text-gray-600 text-sm">Seller</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={vehicle.seller?.profileImageUrl || ""} />
                      <AvatarFallback className="text-xs">
                        {vehicle.seller?.firstName?.[0]}{vehicle.seller?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">
                        {vehicle.seller?.firstName} {vehicle.seller?.lastName}
                      </span>
                      {vehicle.seller?.phoneNumber && (
                        <p className="text-xs text-gray-500">
                          {vehicle.seller.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {vehicle.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 text-sm">{vehicle.description}</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Show Start Chat button only for non-admin users */}
              {!user?.isAdmin && (
                <Button 
                  size="lg" 
                  className="w-full bg-hema-orange hover:bg-hema-orange/90"
                  onClick={handleStartChat}
                  disabled={createChatMutation.isPending || !vehicle.isActive}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {createChatMutation.isPending ? "Starting Chat..." : "Start Chat"}
                </Button>
              )}
              
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                disabled={!vehicle?.isActive}
                onClick={() => setShowSellerProfile(true)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
              
              {/* Show vehicle ID for admin users */}
              {user?.isAdmin && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">Vehicle ID: <span className="font-mono font-medium">#{vehicle.id}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Vehicle Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium">{vehicle.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">{vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">KM Driven</span>
                  <span className="font-medium">{vehicle.kmDriven.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine Capacity</span>
                  <span className="font-medium">{vehicle.engineCapacity || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="font-medium capitalize">{vehicle.fuelType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Safety & Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Verified Vehicle Number</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Trusted Seller</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Detailed Vehicle History</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Secure Communication</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seller Profile Dialog */}
        <Dialog open={showSellerProfile} onOpenChange={setShowSellerProfile}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Seller Information</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={vehicle?.seller?.profileImageUrl || ""} />
                  <AvatarFallback>
                    {vehicle?.seller?.firstName?.[0]}{vehicle?.seller?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {vehicle?.seller?.firstName} {vehicle?.seller?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">Vehicle Seller</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{vehicle?.seller?.email || 'Not provided'}</span>
                </div>
                
                {vehicle?.seller?.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{vehicle.seller.phoneNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{vehicle?.brand} {vehicle?.model}</span>
                </div>
              </div>

              <div className="space-y-2">
                {vehicle?.seller?.phoneNumber && (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      window.open(`tel:${vehicle.seller.phoneNumber}`, '_self');
                      setShowSellerProfile(false);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {vehicle.seller.firstName}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const subject = `Inquiry about ${vehicle?.brand} ${vehicle?.model}`;
                    const body = `Hi ${vehicle?.seller?.firstName},\n\nI'm interested in your ${vehicle?.brand} ${vehicle?.model} listed for ₹${parseFloat(vehicle?.price.toString()).toLocaleString()}. Could you please provide more details?\n\nThanks!`;
                    window.open(`mailto:${vehicle?.seller?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
                    setShowSellerProfile(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
