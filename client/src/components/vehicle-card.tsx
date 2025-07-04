import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, MessageCircle, MapPin, Calendar, Gauge, Camera } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: string;
    vehicleNumber: string;
    location: string;
    kmDriven: number;
    condition: string;
    isFeatured: boolean;
    isActive: boolean;
    fuelType: string;
    seller: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const handleViewDetails = () => {
    window.location.href = `/vehicle/${vehicle.id}`;
  };

  const handleStartChat = () => {
    // This will be handled by the vehicle detail page
    window.location.href = `/vehicle/${vehicle.id}`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <Camera className="h-12 w-12 text-gray-400" />
        </div>
        
        {vehicle.isFeatured && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-medium">
            Featured
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-white text-red-500 p-2 rounded-full hover:bg-red-50 cursor-pointer">
          <Heart className="h-4 w-4" />
        </div>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-lg text-hema-secondary mb-2">
          {vehicle.brand} {vehicle.model}
        </h4>
        
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
            ₹{vehicle.price.toLocaleString()}
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
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-hema-orange text-white hover:bg-hema-orange/90 text-sm"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            className="bg-hema-secondary text-white hover:bg-hema-secondary/90 text-sm"
            onClick={handleStartChat}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
