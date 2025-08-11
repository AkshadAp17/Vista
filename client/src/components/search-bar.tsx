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

  const handleSearch = () => {
    const filters: any = {};

    if (search.trim()) filters.search = search.trim();
    if (location && location !== "all") filters.location = location;
    if (priceRange && priceRange !== "all") {
      filters.priceRange = priceRange; // Send the raw format like "50000-100000"
    }
    if (vehicleType) filters.vehicleType = vehicleType;

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
      if (value && value !== "all") {
        filters.priceRange = value;
      }
      if (vehicleType) filters.vehicleType = vehicleType;
      onFiltersChange(filters);
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="relative sm:col-span-2 md:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by brand, model, vehicle ID..."
            className="pl-10 py-3 border-gray-300 focus:ring-2 focus:ring-hema-orange focus:border-transparent text-black dark:text-white text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              <SelectItem value="100000-200000">
                ₹1,00,000 - ₹2,00,000
              </SelectItem>
              <SelectItem value="200000-500000">
                ₹2,00,000 - ₹5,00,000
              </SelectItem>
              <SelectItem value="500000-999999">Above ₹5,00,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-hema-orange text-white py-3 px-4 md:px-6 hover:bg-hema-orange/90 font-medium sm:col-span-2 md:col-span-1 lg:col-span-1"
          onClick={handleSearch}
          data-testid="search-button"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
          <span className="hidden sm:inline">Search</span>
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
