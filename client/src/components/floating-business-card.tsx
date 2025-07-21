import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User, X, Sparkles } from "lucide-react";
import BusinessCard from "@/components/business-card";

interface FloatingBusinessCardProps {
  className?: string;
}

export default function FloatingBusinessCard({ className = '' }: FloatingBusinessCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className}`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative overflow-hidden"
              title="Meet the Owner - Shubham Pujari"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
              <User className="h-7 w-7 group-hover:scale-110 transition-transform relative z-10" />
              <Sparkles className="absolute top-1 right-1 h-3 w-3 text-yellow-300 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </Button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Click to view owner info
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 z-50 bg-white hover:bg-gray-100 rounded-full w-8 h-8 p-0 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <BusinessCard variant="full" className="animate-in fade-in-50 scale-in-95 duration-300" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}