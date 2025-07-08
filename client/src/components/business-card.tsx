import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Mail, User, Building2 } from "lucide-react";

interface BusinessCardProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function BusinessCard({ variant = 'full', className = '' }: BusinessCardProps) {
  const compactMode = variant === 'compact';

  return (
    <Card className={`bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardContent className={`${compactMode ? 'p-4' : 'p-6'} text-center`}>
        {/* Company Logo/Icon */}
        <div className={`bg-gradient-to-r from-orange-500 to-red-500 rounded-full ${compactMode ? 'w-12 h-12' : 'w-16 h-16'} flex items-center justify-center mx-auto mb-4`}>
          <Building2 className={`${compactMode ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
        </div>

        {/* Company Name */}
        <h2 className={`font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ${compactMode ? 'text-lg' : 'text-xl'} mb-2`}>
          Hema Motor
        </h2>
        
        {/* Owner Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center space-x-2">
            <User className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'} text-orange-600`} />
            <span className={`font-semibold text-gray-800 ${compactMode ? 'text-sm' : 'text-base'}`}>
              Shubham Pujari
            </span>
          </div>
          <p className={`text-gray-600 ${compactMode ? 'text-xs' : 'text-sm'} font-medium`}>
            Owner & Managing Director
          </p>
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