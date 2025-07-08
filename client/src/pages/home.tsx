import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import VehicleCard from "@/components/vehicle-card";
import SearchBar from "@/components/search-bar";
import ChatWidget from "@/components/chat-widget";
import FloatingBusinessCard from "@/components/floating-business-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [searchFilters, setSearchFilters] = useState({});

  const { data: featuredVehicles = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/vehicles/featured"],
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles", searchFilters],
  });

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Ride</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover thousands of verified two-wheelers from trusted sellers across the country
            </p>
          </div>
          
          <SearchBar onFiltersChange={setSearchFilters} />
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-hema-secondary mb-4">Featured Vehicles</h3>
            <p className="text-gray-600 text-lg">Handpicked premium two-wheelers from verified sellers</p>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle: any) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-hema-secondary">All Vehicles</h3>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{vehicles.length} vehicles found</Badge>
              {user?.isAdmin && (
                <Button 
                  className="bg-hema-orange hover:bg-hema-orange/90"
                  onClick={() => window.location.href = '/admin'}
                >
                  Admin Dashboard
                </Button>
              )}
            </div>
          </div>
          
          {vehiclesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No vehicles found matching your criteria.</p>
              <Button 
                className="mt-4 bg-hema-orange hover:bg-hema-orange/90"
                onClick={() => setSearchFilters({})}
              >
                Show All Vehicles
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle: any) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
      
      {/* Business Card positioned opposite to chat button */}
      <FloatingBusinessCard className="fixed bottom-4 left-4 z-50" />

    </div>
  );
}
