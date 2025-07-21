import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, IndianRupee, Bike, Users, Shield, Star, ArrowRight, CheckCircle, Zap, Award, Bell } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import BusinessCard from "@/components/business-card";
import FloatingBusinessCard from "@/components/floating-business-card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-2xl sticky top-0 z-50 border-b border-orange-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="lg" animated={true} className="animate-in fade-in-50 duration-500" />
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {/* Notification Badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">3</span>
                  </span>
                </Button>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-full font-semibold"
                onClick={() => window.location.href = '/api/login'}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative text-white py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 mb-6 px-4 py-2 text-sm font-medium">
                🚀 India's Fastest Growing Two-Wheeler Marketplace
              </Badge>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Find Your
                <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Dream Ride
                </span>
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Discover thousands of verified two-wheelers from trusted sellers across India.
                <span className="block mt-2 text-orange-300">Safe, secure, and hassle-free.</span>
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Your Search</h3>
                <p className="text-gray-600">Find exactly what you're looking for</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-orange-500 transition-colors group-hover:text-orange-600" />
                  <Input 
                    placeholder="Search by brand, model..." 
                    className="pl-12 py-4 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl text-lg transition-all duration-300 text-black dark:text-white"
                  />
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-orange-500 transition-colors group-hover:text-orange-600" />
                  <Select>
                    <SelectTrigger className="pl-12 py-4 border-2 border-gray-200 focus:border-orange-500 rounded-xl text-lg text-black dark:text-white">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-4 h-5 w-5 text-orange-500 transition-colors group-hover:text-orange-600" />
                  <Select>
                    <SelectTrigger className="pl-12 py-4 border-2 border-gray-200 focus:border-orange-500 rounded-xl text-lg text-black dark:text-white">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      <SelectItem value="0-50000">Under ₹50,000</SelectItem>
                      <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="200000-999999">Above ₹2,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.location.href = '/api/login'}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Now
                </Button>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  🔥 <strong>10,000+</strong> verified vehicles • <strong>5,000+</strong> happy customers • <strong>50+</strong> cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Hema Motor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most trusted and convenient way to buy and sell two-wheelers in India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Verified</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every vehicle goes through our rigorous verification process. Only genuine sellers with authentic documents.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with buyers and sellers instantly through our secure chat system. No waiting, no delays.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Best Deals</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find the best prices in the market. Compare multiple options and negotiate directly with sellers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Ride?
          </h3>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream two-wheeler with Hema Motor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/api/login'}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              onClick={() => window.location.href = '/api/login'}
            >
              <Users className="h-5 w-5 mr-2" />
              Join as Seller
            </Button>
          </div>
        </div>
      </section>

      {/* Business Card Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Meet Our Founder</h3>
            <p className="text-gray-300 text-lg">
              Connecting buyers and sellers with trust and excellence
            </p>
          </div>
          <div className="flex justify-center">
            <BusinessCard variant="full" className="max-w-md animate-in fade-in-50 duration-700" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-6">
                <Logo size="md" variant="white" animated={true} />
              </div>
              <p className="text-gray-400 leading-relaxed">
                India's most trusted two-wheeler marketplace. Find, buy, and sell with confidence.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Buy Vehicles</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Sell Vehicle</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Connect</h5>
              <p className="text-gray-400 mb-4">
                Follow us for the latest updates and deals
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">i</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Hema Motor. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
      
      {/* Floating Business Card */}
      <FloatingBusinessCard />
    </div>
  );
}
