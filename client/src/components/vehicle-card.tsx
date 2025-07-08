import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Eye, MessageCircle, MapPin, Calendar, Gauge, Camera, Share2, Check, Clock, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import VehicleChatDialog from "./vehicle-chat-dialog";
import vehicleIcon from "@assets/image_1752002668870.png";

interface FavoriteStatus {
  isFavorite: boolean;
}

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    vehicleNumber: string;
    location: string;
    kmDriven: number;
    condition: string;
    isFeatured: boolean;
    isActive: boolean;
    status: "available" | "pending" | "sold";
    soldAt?: Date;
    fuelType: string;
    sellerId: string;
    seller: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [chatOpen, setChatOpen] = useState(false);

  // Check if vehicle is favorited
  const { data: favoriteStatus } = useQuery<FavoriteStatus>({
    queryKey: [`/api/favorites/${vehicle.id}/status`],
    enabled: isAuthenticated,
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/favorites/${vehicle.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${vehicle.id}/status`] });
      toast({
        title: "Added to favorites",
        description: "Vehicle added to your favorites.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', `/api/favorites/${vehicle.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${vehicle.id}/status`] });
      toast({
        title: "Removed from favorites",
        description: "Vehicle removed from your favorites.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: "available" | "pending" | "sold") => 
      apiRequest('PATCH', `/api/vehicles/${vehicle.id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles/featured'] });
      toast({
        title: "Status Updated",
        description: "Vehicle status updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

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

  const isOwner = user?.id === vehicle.sellerId || user?.isAdmin;

  const handleViewDetails = () => {
    window.location.href = `/vehicle/${vehicle.id}`;
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to start a chat with the seller.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create or get existing chat room
      const response = await apiRequest('POST', '/api/chat-rooms', {
        vehicleId: vehicle.id,
      });

      // Get the floating chat widget to open
      const chatWidget = document.querySelector('[data-chat-widget]') as HTMLButtonElement;
      if (chatWidget) {
        chatWidget.click();
        
        // Wait a bit for the widget to open, then trigger a manual selection
        setTimeout(() => {
          // Trigger a custom event to select this chat
          window.dispatchEvent(new CustomEvent('selectChat', { 
            detail: { chatRoomId: (response as any).id } 
          }));
        }, 300);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to like vehicles.",
        variant: "destructive",
      });
      return;
    }

    const isCurrentlyFavorited = favoriteStatus?.isFavorite;
    
    if (isCurrentlyFavorited) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };

  const handleShare = () => {
    const vehicleUrl = `${window.location.origin}/vehicle/${vehicle.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model}`,
        text: `Check out this ${vehicle.brand} ${vehicle.model} for ₹${parseFloat(vehicle.price.toString()).toLocaleString()}`,
        url: vehicleUrl,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(vehicleUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Vehicle link has been copied to your clipboard.",
        });
      });
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
      <div className="relative">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img 
            src={vehicle.images[0]} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-48 object-cover"
            onError={(e) => {
              // Fallback to placeholder on image load error
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.querySelector('.fallback-placeholder')!.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-48 bg-gray-200 flex items-center justify-center ${vehicle.images && vehicle.images.length > 0 ? 'hidden fallback-placeholder' : ''}`}>
          <Camera className="h-12 w-12 text-gray-400" />
        </div>
        
        {vehicle.isFeatured && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-medium">
            Featured
          </div>
        )}
        
        <div 
          className={`absolute top-3 right-3 bg-white p-2 rounded-full hover:bg-red-50 cursor-pointer ${favoriteStatus?.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${favoriteStatus?.isFavorite ? 'fill-current' : ''}`} />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-lg text-hema-secondary">
            {vehicle.brand} {vehicle.model}
          </h4>
          <img src={vehicleIcon} alt="Hema Motor" className="h-6 w-6 opacity-80" />
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {vehicle.year}
          </span>
          <span className="flex items-center">
            <Gauge className="h-3 w-3 mr-1" />
            {vehicle.kmDriven.toLocaleString()} km
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-hema-orange">
            ₹{parseFloat(vehicle.price.toString()).toLocaleString()}
          </span>
          <span className="text-gray-600 text-sm flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {vehicle.location}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="font-medium">{vehicle.vehicleNumber}</span>
          </div>
          <Badge variant={vehicle.condition === 'excellent' ? 'default' : 'secondary'}>
            {vehicle.condition}
          </Badge>
        </div>
        
        {/* Status display and controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {(() => {
              const statusInfo = getStatusInfo(vehicle.status);
              const StatusIcon = statusInfo.icon;
              return (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{statusInfo.label}</span>
                </div>
              );
            })()}
          </div>
          
          {isOwner && (
            <Select 
              value={vehicle.status} 
              onValueChange={(value) => updateStatusMutation.mutate(value as "available" | "pending" | "sold")}
            >
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 mb-3">
          <Button 
            className="flex-1 bg-hema-orange text-white hover:bg-hema-orange/90 text-sm"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          {vehicle.status !== 'sold' && !isOwner && (
            <Button 
              className="bg-hema-secondary text-white hover:bg-hema-secondary/90 text-sm"
              onClick={handleStartChat}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
          )}
          {vehicle.status === 'sold' && (
            <Button 
              disabled
              variant="outline"
              className="bg-gray-100 text-gray-400 border-gray-300 text-sm cursor-not-allowed"
            >
              <X className="h-4 w-4 mr-1" />
              Sold Out
            </Button>
          )}
        </div>
        
        {/* Like and Share buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            className={`flex-1 ${favoriteStatus?.isFavorite ? 'text-red-500 border-red-500' : 'text-gray-600'}`}
            onClick={handleLike}
            disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
          >
            <Heart className={`h-4 w-4 mr-1 ${favoriteStatus?.isFavorite ? 'fill-current' : ''}`} />
            {favoriteStatus?.isFavorite ? 'Liked' : 'Like'}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 text-gray-600"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
      
      {/* Chat Dialog */}
      <VehicleChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        vehicle={vehicle}
      />
    </Card>
  );
}
