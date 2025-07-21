import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VehicleCard from "@/components/vehicle-card";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function useQueryParams() {
  const { search } = useLocation();
  return Object.fromEntries(new URLSearchParams(search));
}

export default function SearchResults() {
  const filters = useQueryParams();
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["/api/vehicles", filters],
  });

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-hema-secondary">Search Results</h3>
            <Badge variant="secondary">{vehicles.length} vehicles found</Badge>
          </div>
          {isLoading ? (
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
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No vehicles found matching your criteria.</p>
              <Button 
                className="mt-4 bg-hema-orange hover:bg-hema-orange/90"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
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
    </div>
  );
} 