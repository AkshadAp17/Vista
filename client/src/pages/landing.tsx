import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, IndianRupee, Bike, Users, Shield, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bike className="text-hema-orange h-8 w-8" />
              <h1 className="text-2xl font-bold text-hema-secondary">Hema Motor</h1>
            </div>
            <Button 
              className="bg-hema-orange hover:bg-hema-orange/90 text-white"
              onClick={() => window.location.href = '/api/login'}
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Ride</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover thousands of verified two-wheelers from trusted sellers across the country
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by brand, model..." 
                  className="pl-10 py-3 border-gray-300 focus:ring-2 focus:ring-hema-orange focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select>
                  <SelectTrigger className="pl-10 py-3 border-gray-300">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select>
                  <SelectTrigger className="pl-10 py-3 border-gray-300">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">Under ₹50,000</SelectItem>
                    <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                    <SelectItem value="200000-999999">Above ₹2,00,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-hema-orange text-white py-3 px-6 hover:bg-hema-orange/90">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-hema-secondary mb-4">Why Choose Hema Motor?</h3>
            <p className="text-gray-600 text-lg">Your trusted partner in finding the perfect two-wheeler</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 card-hover">
              <CardContent className="pt-6">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Verified Sellers</h4>
                <p className="text-gray-600">All our sellers are verified and trusted. Buy with confidence.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 card-hover">
              <CardContent className="pt-6">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Quality Vehicles</h4>
                <p className="text-gray-600">Every vehicle is inspected and comes with detailed specifications.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 card-hover">
              <CardContent className="pt-6">
                <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Easy Communication</h4>
                <p className="text-gray-600">Chat directly with sellers and get all your questions answered.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-hema-secondary mb-4">Ready to Find Your Perfect Ride?</h3>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied customers who found their dream two-wheeler</p>
          <Button 
            size="lg" 
            className="bg-hema-orange hover:bg-hema-orange/90 text-white px-8 py-4 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hema-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bike className="text-hema-orange h-6 w-6" />
                <h3 className="text-xl font-bold">Hema Motor</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Your trusted marketplace for premium two-wheelers. Find your perfect ride with verified sellers and transparent pricing.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Browse Motorcycles</li>
                <li>Browse Scooters</li>
                <li>Electric Vehicles</li>
                <li>Buying Guide</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Sell Your Vehicle</li>
                <li>Pricing Guide</li>
                <li>Seller Dashboard</li>
                <li>Success Stories</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Hema Motor. All rights reserved. Built with care for the two-wheeler community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
