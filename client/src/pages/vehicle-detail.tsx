import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function VehicleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        description: "You can now chat with the seller about this vehicle",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/chat-rooms"] });
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
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
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
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-16 bg-gray-200 rounded cursor-pointer hover:ring-2 hover:ring-hema-orange">
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
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
                    ₹{vehicle.price.toLocaleString()}
                  </span>
                  <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                    {vehicle.isActive ? "Available" : "Sold"}
                  </Badge>
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
                disabled={!vehicle.isActive}
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
      </div>
    </div>
  );
}
