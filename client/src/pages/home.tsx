import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import VehicleCard from "@/components/vehicle-card";
import SearchBar from "@/components/search-bar";

import ChatWidget from "@/components/chat-widget";
import FloatingBusinessCard from "@/components/floating-business-card";
import { LoadingSpinner, VehicleCardSkeleton } from "@/components/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";


export default function Home() {
  const { user } = useAuth();
  const [searchFilters, setSearchFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(12);

  // Handle search parameters from landing page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters: any = {};
    
    if (urlParams.get('search')) initialFilters.search = urlParams.get('search');
    if (urlParams.get('location')) initialFilters.location = urlParams.get('location');
    if (urlParams.get('priceRange')) initialFilters.priceRange = urlParams.get('priceRange');
    
    if (Object.keys(initialFilters).length > 0) {
      setSearchFilters(initialFilters);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Reset to first page when search filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters]);

  const { data: featuredVehicles = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/vehicles/featured"],
  });

  const { data: allVehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (searchFilters.search) params.append('search', searchFilters.search);
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.priceRange) params.append('priceRange', searchFilters.priceRange);
      if (searchFilters.vehicleType) params.append('vehicleType', searchFilters.vehicleType);
      if (searchFilters.brand) params.append('brand', searchFilters.brand);
      if (searchFilters.fuelType) params.append('fuelType', searchFilters.fuelType);
      
      const url = `/api/vehicles${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Making API request to:', url, 'with filters:', searchFilters);
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  // Calculate pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const vehicles = (allVehicles as any[]).slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil((allVehicles as any[]).length / vehiclesPerPage);

  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
    setSearchFilters(filters);
    setCurrentPage(1);
  };



  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results
    const resultsSection = document.getElementById('search-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-orange-500 text-white rounded-full p-2 sm:p-3 md:p-4 mr-2 sm:mr-3 md:mr-4">
                <Bike className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Hema Motor</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Find Your Perfect Ride</h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto px-2">
              Discover thousands of verified two-wheelers from trusted sellers across the country
            </p>
          </div>
          
          <SearchBar onFiltersChange={handleFiltersChange} />
        </div>
      </section>



{/* Featured Vehicles - Only show when no search filters */}
      {Object.keys(searchFilters).length === 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-hema-secondary mb-3 sm:mb-4">Featured Vehicles</h3>
              <p className="text-gray-600 text-base sm:text-lg px-2">Handpicked premium two-wheelers from verified sellers</p>
            </div>
            
            {featuredLoading ? (
              <div className="space-y-6">
                <LoadingSpinner size="lg" text="Loading featured vehicles..." className="py-12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <VehicleCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : (featuredVehicles as any[]).length === 0 ? (
              <div className="text-center py-12">
                <Bike className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No featured vehicles available</p>
                <p className="text-gray-400">Check back later for new featured listings</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {(featuredVehicles as any[]).map((vehicle: any) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

{/* Search Results / All Vehicles */}
      <section id="search-results" className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-3 sm:space-y-0">
            <h3 className="text-2xl sm:text-3xl font-bold text-hema-secondary">
              {Object.keys(searchFilters).length > 0 ? 'Search Results' : 'All Vehicles'}
            </h3>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {(allVehicles as any[]).length} vehicles found
              </Badge>
              {Object.keys(searchFilters).length > 0 && (
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleFiltersChange({})}
                  className="text-xs sm:text-sm"
                >
                  Clear Filters
                </Button>
              )}
              {(user as any)?.isAdmin && (
                <Button 
                  size="sm"
                  className="bg-hema-orange hover:bg-hema-orange/90 text-xs sm:text-sm touch-target"
                  onClick={() => window.location.href = '/admin'}
                >
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              )}
            </div>
          </div>
          
          {vehiclesLoading ? (
            <div className="space-y-6">
              <LoadingSpinner size="lg" text="Searching for vehicles..." className="py-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (allVehicles as any[]).length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2 px-4">No vehicles found matching your criteria.</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your search filters or browse all vehicles</p>
              <Button 
                className="mt-4 bg-hema-orange hover:bg-hema-orange/90 touch-target"
                onClick={() => handleFiltersChange({})}
              >
                Show All Vehicles
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                {vehicles.map((vehicle: any) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstVehicle + 1} to {Math.min(indexOfLastVehicle, (allVehicles as any[]).length)} of {(allVehicles as any[]).length} results
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-xs sm:text-sm"
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNumber)}
                            className={`w-8 h-8 text-xs ${
                              currentPage === pageNumber ? "bg-hema-orange hover:bg-hema-orange/90" : ""
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-xs sm:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
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
