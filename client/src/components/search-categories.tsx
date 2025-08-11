import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bike, 
  Zap, 
  Car, 
  MapPin, 
  Filter,
  Grid3X3,
  List,
  Search,
  DollarSign,
  Calendar,
  Fuel
} from "lucide-react";
import { useState } from "react";

interface SearchCategoriesProps {
  onCategorySelect: (category: string) => void;
  onPriceRangeSelect: (range: string) => void;
  onVehicleTypeSelect: (type: string) => void;
}

export default function SearchCategories({ 
  onCategorySelect, 
  onPriceRangeSelect, 
  onVehicleTypeSelect 
}: SearchCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    {
      id: 'motorcycles',
      name: 'Motorcycles',
      icon: Bike,
      color: 'bg-blue-500',
      count: '2,450+',
      description: 'Sport bikes, cruisers, touring'
    },
    {
      id: 'scooters',
      name: 'Scooters',
      icon: Car,
      color: 'bg-green-500',
      count: '1,890+',
      description: 'Urban commuting, gearless'
    },
    {
      id: 'electric',
      name: 'Electric',
      icon: Zap,
      color: 'bg-orange-500',
      count: '850+',
      description: 'Eco-friendly, zero emission'
    },
    {
      id: 'vintage',
      name: 'Vintage',
      icon: Calendar,
      color: 'bg-purple-500',
      count: '320+',
      description: 'Classic, restored bikes'
    }
  ];

  const priceRanges = [
    { label: 'Under ₹50K', value: '0-50000', count: '1,200+' },
    { label: '₹50K - ₹1L', value: '50000-100000', count: '2,100+' },
    { label: '₹1L - ₹3L', value: '100000-300000', count: '1,800+' },
    { label: '₹3L - ₹5L', value: '300000-500000', count: '650+' },
    { label: 'Above ₹5L', value: '500000-9999999', count: '250+' }
  ];

  const vehicleTypes = [
    { name: 'Sport', color: 'bg-red-100 text-red-800', count: '540+' },
    { name: 'Cruiser', color: 'bg-blue-100 text-blue-800', count: '430+' },
    { name: 'Commuter', color: 'bg-green-100 text-green-800', count: '1,890+' },
    { name: 'Adventure', color: 'bg-orange-100 text-orange-800', count: '320+' },
    { name: 'Touring', color: 'bg-purple-100 text-purple-800', count: '180+' },
    { name: 'Off-road', color: 'bg-yellow-100 text-yellow-800', count: '290+' }
  ];

  const popularSearches = [
    'Honda Activa', 'Royal Enfield Classic', 'Bajaj Pulsar',
    'TVS Apache', 'Yamaha FZ', 'Hero Splendor',
    'KTM Duke', 'Suzuki Access'
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <section className="py-8 sm:py-12 bg-gray-50" data-testid="search-categories">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Browse by Category
          </h3>
          <p className="text-gray-600 text-base sm:text-lg">
            Find exactly what you're looking for
          </p>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isSelected ? 'ring-2 ring-orange-500 shadow-lg' : ''
                }`}
                onClick={() => handleCategoryClick(category.id)}
                data-testid={`category-${category.id}`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`${category.color} text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{category.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Price Ranges */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-lg">Price Range</h4>
              </div>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant="ghost"
                    className="w-full justify-between hover:bg-green-50"
                    onClick={() => onPriceRangeSelect(range.value)}
                    data-testid={`price-range-${range.value}`}
                  >
                    <span>{range.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {range.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Types */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-lg">Vehicle Type</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {vehicleTypes.map((type) => (
                  <Badge
                    key={type.name}
                    className={`${type.color} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => onVehicleTypeSelect(type.name.toLowerCase())}
                    data-testid={`vehicle-type-${type.name.toLowerCase()}`}
                  >
                    {type.name} ({type.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Search className="h-5 w-5 text-orange-600 mr-2" />
                <h4 className="font-semibold text-lg">Popular Searches</h4>
              </div>
              <div className="space-y-2">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-orange-50 text-sm"
                    onClick={() => onCategorySelect(search)}
                    data-testid={`popular-search-${search.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <h5 className="text-2xl font-bold text-gray-900">5,690+</h5>
                <p className="text-gray-600 text-sm">Total Vehicles</p>
              </div>
              <div>
                <h5 className="text-2xl font-bold text-gray-900">2,340+</h5>
                <p className="text-gray-600 text-sm">Verified Sellers</p>
              </div>
              <div>
                <h5 className="text-2xl font-bold text-gray-900">890+</h5>
                <p className="text-gray-600 text-sm">Sold This Month</p>
              </div>
              <div>
                <h5 className="text-2xl font-bold text-gray-900">4.8★</h5>
                <p className="text-gray-600 text-sm">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Quick Filter */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-semibold text-lg">Popular Locations</h4>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'].map((city) => (
              <Badge
                key={city}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onCategorySelect(city)}
                data-testid={`location-${city.toLowerCase()}`}
              >
                {city}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}