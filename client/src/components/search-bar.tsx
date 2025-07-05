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

    if (search) filters.search = search;
    if (location) filters.location = location;
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filters.priceRange = `${min},${max}`;
    }
    if (vehicleType) filters.vehicleType = vehicleType;

    onFiltersChange(filters);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by brand, model, vehicle ID..."
            className="pl-10 py-3 border-gray-300 focus:ring-2 focus:ring-hema-orange focus:border-transparent text-black dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Select onValueChange={setLocation}>
            <SelectTrigger className="pl-10 py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
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
          <Select onValueChange={setPriceRange}>
            <SelectTrigger className="pl-10 py-3 border-gray-300 text-black dark:text-white data-[placeholder]:text-gray-800 dark:data-[placeholder]:text-gray-200">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
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
          className="bg-hema-orange text-white py-3 px-6 hover:bg-hema-orange/90 font-medium"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setVehicleType(vehicleType === "motorcycle" ? "" : "motorcycle")
          }
          className={
            vehicleType === "motorcycle" ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90" : "text-gray-700"
          }
        >
          Motorcycles
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setVehicleType(vehicleType === "scooter" ? "" : "scooter")
          }
          className={
            vehicleType === "scooter" ? "bg-hema-orange text-white border-hema-orange hover:bg-hema-orange/90" : "text-gray-700"
          }
        >
          Scooters
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setVehicleType(vehicleType === "electric" ? "" : "electric")
          }
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
