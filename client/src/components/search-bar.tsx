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
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
        <div className="relative sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by brand, model, vehicle ID..."
            className="pl-10 py-3 border-gray-300 focus:ring-2 focus:ring-hema-orange focus:border-transparent text-black dark:text-white text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            data-testid="search-input"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Select onValueChange={handleLocationChange} value={location}>
            <SelectTrigger className="pl-10 py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200 text-sm md:text-base">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
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

        {/* Brand Filter */}
        <div className="relative">
          <Select onValueChange={handleBrandChange} value={brand}>
            <SelectTrigger className="py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200 text-sm md:text-base">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
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

        {/* Vehicle Type Filter */}
        <div className="relative">
          <Select onValueChange={handleVehicleTypeChange} value={vehicleType}>
            <SelectTrigger className="py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200 text-sm md:text-base">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="scooter">Scooter</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="cruiser">Cruiser</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type Filter */}
        <div className="relative">
          <Select onValueChange={handleFuelTypeChange} value={fuelType}>
            <SelectTrigger className="py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200 text-sm md:text-base">
              <SelectValue placeholder="Fuel" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
              <SelectItem value="all">All Fuel</SelectItem>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Select onValueChange={handlePriceRangeChange} value={priceRange}>
            <SelectTrigger className="pl-10 py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200 text-sm md:text-base">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-50000">Under ₹50,000</SelectItem>
              <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
              <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
              <SelectItem value="200000-500000">₹2,00,000 - ₹5,00,000</SelectItem>
              <SelectItem value="500000-999999">Above ₹5,00,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-hema-orange text-white py-3 px-4 md:px-6 hover:bg-hema-orange/90 font-medium xl:col-span-1"
          onClick={handleSearch}
          data-testid="search-button"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden lg:inline">Search</span>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newType = vehicleType === "motorcycle" ? "" : "motorcycle";
            setVehicleType(newType);
            // Trigger search automatically when vehicle type changes
            const filters: any = {};
            if (search) filters.search = search;
            if (location) filters.location = location;
            if (priceRange) {
              const [min, max] = priceRange.split("-").map(Number);
              filters.priceRange = `${min},${max}`;
            }
            if (newType) filters.vehicleType = newType;
            onFiltersChange(filters);
          }}
          className={
            vehicleType === "motorcycle" ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90" : "text-gray-700"
          }
        >
          Motorcycles
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newType = vehicleType === "scooter" ? "" : "scooter";
            setVehicleType(newType);
            // Trigger search automatically when vehicle type changes
            const filters: any = {};
            if (search) filters.search = search;
            if (location) filters.location = location;
            if (priceRange) {
              const [min, max] = priceRange.split("-").map(Number);
              filters.priceRange = `${min},${max}`;
            }
            if (newType) filters.vehicleType = newType;
            onFiltersChange(filters);
          }}
          className={
            vehicleType === "scooter" ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90" : "text-gray-700"
          }
        >
          Scooters
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newType = vehicleType === "electric" ? "" : "electric";
            setVehicleType(newType);
            // Trigger search automatically when vehicle type changes
            const filters: any = {};
            if (search) filters.search = search;
            if (location) filters.location = location;
            if (priceRange) {
              const [min, max] = priceRange.split("-").map(Number);
              filters.priceRange = `${min},${max}`;
            }
            if (newType) filters.vehicleType = newType;
            onFiltersChange(filters);
          }}
          className={
            vehicleType === "electric" ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90" : "text-gray-700"
          }
        >
          Electric
        </Button>
      </div>
    </div>
  );
}
