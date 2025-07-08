import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Mail, User, Building2, Crown } from "lucide-react";

interface BusinessCardProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function BusinessCard({ variant = 'full', className = '' }: BusinessCardProps) {
  const compactMode = variant === 'compact';

  return (
    <Card className={`bg-gradient-to-br from-orange-50 via-white to-red-50 border-2 border-orange-300 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm mx-auto ${className}`}>
      <CardContent className={`${compactMode ? 'p-6' : 'p-8'} text-center space-y-4`}>
        {/* Live Status Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">● LIVE</span>
        </div>
        
        {/* Company Logo/Icon with Premium Look */}
        <div className={`relative bg-gradient-to-r from-orange-500 to-red-500 rounded-full ${compactMode ? 'w-16 h-16' : 'w-20 h-20'} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
          <Building2 className={`${compactMode ? 'h-8 w-8' : 'h-10 w-10'} text-white relative z-10`} />
          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
        </div>

        {/* Company Name */}
        <div className="space-y-3 mb-6">
          <h2 className={`font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ${compactMode ? 'text-xl' : 'text-2xl'} tracking-wide`}>
            Hema Motor
          </h2>
          
          {/* Owner Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full py-2 px-4">
              <User className={`${compactMode ? 'h-4 w-4' : 'h-5 w-5'} text-orange-600`} />
              <span className={`font-bold text-gray-800 ${compactMode ? 'text-base' : 'text-lg'}`}>
                Shubham Pujari
              </span>
            </div>
            <p className={`text-orange-700 ${compactMode ? 'text-sm' : 'text-base'} font-semibold italic`}>
              Owner & Managing Director
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className={`space-y-2 ${compactMode ? 'text-xs' : 'text-sm'} text-gray-700`}>
          <div className="flex items-center justify-center space-x-2">
            <Phone className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} text-orange-500`} />
            <a 
              href="tel:+917447434350" 
              className="hover:text-orange-600 transition-colors"
            >
              +91 7447434350
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <MapPin className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} text-orange-500`} />
            <span className="text-center">
              Moshi Silver 9 Apartment
              {!compactMode && <br />}
              {compactMode ? ', ' : ''}Pune, Maharashtra
            </span>
          </div>

          {!compactMode && (
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-4 w-4 text-orange-500" />
              <a 
                href="mailto:info@hemamotor.com" 
                className="hover:text-orange-600 transition-colors"
              >
                info@hemamotor.com
              </a>
            </div>
          )}
        </div>

        {/* Tagline */}
        <div className="mt-4 pt-3 border-t border-orange-200">
          <p className={`text-gray-600 italic ${compactMode ? 'text-xs' : 'text-sm'}`}>
            "Your Trusted Two-Wheeler Marketplace"
          </p>
          {!compactMode && (
            <p className="text-xs text-gray-500 mt-1">
              Quality • Trust • Excellence
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}