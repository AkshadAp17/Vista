import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, IndianRupee } from "lucide-react";

interface SearchBarProps {
  onFiltersChange: (filters: any) => void;
}

export default function SearchBar({ onFiltersChange }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [fuelType, setFuelType] = useState("");

  const handleSearch = () => {
    const filters: any = {};

    if (search.trim()) filters.search = search.trim();
    if (location && location !== "all") filters.location = location;
    if (priceRange && priceRange !== "all") {
      filters.priceRange = priceRange;
    }
    if (vehicleType && vehicleType !== "all") filters.vehicleType = vehicleType;
    if (brand && brand !== "all") filters.brand = brand;
    if (fuelType && fuelType !== "all") filters.fuelType = fuelType;

    console.log('Search filters being sent:', filters);
    onFiltersChange(filters);
  };

  // Trigger search when filters change (for auto-search on select changes)
  const handleLocationChange = (value: string) => {
    setLocation(value);
    setTimeout(() => {
      const filters: any = {};
      if (search.trim()) filters.search = search.trim();
      if (value && value !== "all") filters.location = value;
      if (priceRange && priceRange !== "all") {
        filters.priceRange = priceRange;
      }
      if (vehicleType) filters.vehicleType = vehicleType;
      onFiltersChange(filters);
    }, 100);
  };

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    setTimeout(() => {
      const filters: any = {};
      if (search.trim()) filters.search = search.trim();
      if (location && location !== "all") filters.location = location;
      if (value && value !== "all") filters.priceRange = value;
      if (vehicleType && vehicleType !== "all") filters.vehicleType = vehicleType;
      if (brand && brand !== "all") filters.brand = brand;
      if (fuelType && fuelType !== "all") filters.fuelType = fuelType;
      onFiltersChange(filters);
    }, 100);
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    setTimeout(() => {
      const filters: any = {};
      if (search.trim()) filters.search = search.trim();
      if (location && location !== "all") filters.location = location;
      if (priceRange && priceRange !== "all") filters.priceRange = priceRange;
      if (vehicleType && vehicleType !== "all") filters.vehicleType = vehicleType;
      if (value && value !== "all") filters.brand = value;
      if (fuelType && fuelType !== "all") filters.fuelType = fuelType;
      onFiltersChange(filters);
    }, 100);
  };

  const handleFuelTypeChange = (value: string) => {
    setFuelType(value);
    setTimeout(() => {
      const filters: any = {};
      if (search.trim()) filters.search = search.trim();
      if (location && location !== "all") filters.location = location;
      if (priceRange && priceRange !== "all") filters.priceRange = priceRange;
      if (vehicleType && vehicleType !== "all") filters.vehicleType = vehicleType;
      if (brand && brand !== "all") filters.brand = brand;
      if (value && value !== "all") filters.fuelType = value;
      onFiltersChange(filters);
    }, 100);
  };

  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value);
    setTimeout(() => {
      const filters: any = {};
      if (search.trim()) filters.search = search.trim();
      if (location && location !== "all") filters.location = location;
      if (priceRange && priceRange !== "all") filters.priceRange = priceRange;
      if (value && value !== "all") filters.vehicleType = value;
      if (brand && brand !== "all") filters.brand = brand;
      if (fuelType && fuelType !== "all") filters.fuelType = fuelType;
      onFiltersChange(filters);
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 backdrop-blur-sm bg-opacity-95">
        <div className="space-y-4">
          {/* Main search row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            <div className="relative sm:col-span-2 md:col-span-2 lg:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by brand, model, vehicle ID..."
                className="pl-12 py-4 border-2 border-gray-200 focus:ring-2 focus:ring-hema-orange focus:border-hema-orange rounded-xl text-gray-800 placeholder-gray-500 text-base font-medium shadow-sm transition-all duration-200 hover:border-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="search-input"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Select onValueChange={handleLocationChange} value={location}>
                <SelectTrigger className="pl-12 py-4 border-2 border-gray-200 focus:ring-2 focus:ring-hema-orange focus:border-hema-orange rounded-xl text-gray-800 data-[placeholder]:text-gray-500 text-base font-medium shadow-sm transition-all duration-200 hover:border-gray-300">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select onValueChange={handleBrandChange} value={brand}>
                <SelectTrigger className="py-4 border-2 border-gray-200 focus:ring-2 focus:ring-hema-orange focus:border-hema-orange rounded-xl text-gray-800 data-[placeholder]:text-gray-500 text-base font-medium shadow-sm transition-all duration-200 hover:border-gray-300">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="suzuki">Suzuki</SelectItem>
                  <SelectItem value="yamaha">Yamaha</SelectItem>
                  <SelectItem value="bajaj">Bajaj</SelectItem>
                  <SelectItem value="tvs">TVS</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="royal enfield">Royal Enfield</SelectItem>
                  <SelectItem value="ktm">KTM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select onValueChange={handleVehicleTypeChange} value={vehicleType}>
                <SelectTrigger className="py-4 border-2 border-gray-200 focus:ring-2 focus:ring-hema-orange focus:border-hema-orange rounded-xl text-gray-800 data-[placeholder]:text-gray-500 text-base font-medium shadow-sm transition-all duration-200 hover:border-gray-300">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cruiser">Cruiser</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select onValueChange={handleFuelTypeChange} value={fuelType}>
                <SelectTrigger className="py-4 border-2 border-gray-200 focus:ring-2 focus:ring-hema-orange focus:border-hema-orange rounded-xl text-gray-800 data-[placeholder]:text-gray-500 text-base font-medium shadow-sm transition-all duration-200 hover:border-gray-300">
                  <SelectValue placeholder="Fuel" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                  <SelectItem value="all">All Fuel</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Select onValueChange={handlePriceRangeChange} value={priceRange}>
                <SelectTrigger className="pl-12 py-4 border-2 border-gray-200 focus:ring-2 focus:ring-hema-orange focus:border-hema-orange rounded-xl text-gray-800 data-[placeholder]:text-gray-500 text-base font-medium shadow-sm transition-all duration-200 hover:border-gray-300">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50000">Under ₹50,000</SelectItem>
                  <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                  <SelectItem value="200000-500000">₹2,00,000 - ₹5,00,000</SelectItem>
                  <SelectItem value="500000-999999">Above ₹5,00,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Centered search button */}
          <div className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-hema-orange to-orange-600 text-white py-4 px-12 hover:from-hema-orange/90 hover:to-orange-600/90 font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={handleSearch}
              data-testid="search-button"
            >
              <Search className="h-5 w-5 mr-3" />
              <span className="text-lg">Search</span>
            </Button>
          </div>
        </div>

        {/* Quick filter buttons */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newType = vehicleType === "motorcycle" ? "" : "motorcycle";
              setVehicleType(newType);
              handleVehicleTypeChange(newType || "all");
            }}
            className={
              vehicleType === "motorcycle" 
                ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90 rounded-full px-6 py-2 font-medium shadow-md" 
                : "text-gray-700 border-gray-300 hover:border-hema-orange hover:text-hema-orange rounded-full px-6 py-2 font-medium shadow-sm transition-all duration-200"
            }
          >
            🏍️ Motorcycles
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newType = vehicleType === "scooter" ? "" : "scooter";
              setVehicleType(newType);
              handleVehicleTypeChange(newType || "all");
            }}
            className={
              vehicleType === "scooter" 
                ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90 rounded-full px-6 py-2 font-medium shadow-md" 
                : "text-gray-700 border-gray-300 hover:border-hema-orange hover:text-hema-orange rounded-full px-6 py-2 font-medium shadow-sm transition-all duration-200"
            }
          >
            🛴 Scooters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newType = vehicleType === "electric" ? "" : "electric";
              setVehicleType(newType);
              handleVehicleTypeChange(newType || "all");
            }}
            className={
              vehicleType === "electric" 
                ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90 rounded-full px-6 py-2 font-medium shadow-md" 
                : "text-gray-700 border-gray-300 hover:border-hema-orange hover:text-hema-orange rounded-full px-6 py-2 font-medium shadow-sm transition-all duration-200"
            }
          >
            ⚡ Electric
          </Button>
        </div>
      </div>
    </div>
  );
}
