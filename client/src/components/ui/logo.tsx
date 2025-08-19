import { useState, useEffect } from "react";
import { Bike } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "default" | "white";
  animated?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showTagline = true,
  variant = "default",
  animated = true,
  className,
}: LogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [animated]);
  
  const sizes = {
    sm: {
      container: "space-x-1",
      icon: "h-5 w-5",
      title: "text-lg font-bold",
      tagline: "text-[8px]",
    },
    md: {
      container: "space-x-2",
      icon: "h-8 w-8",
      title: "text-2xl font-bold",
      tagline: "text-xs",
    },
    lg: {
      container: "space-x-3",
      icon: "h-10 w-10",
      title: "text-3xl font-bold",
      tagline: "text-sm",
    },
    xl: {
      container: "space-x-4",
      icon: "h-12 w-12",
      title: "text-4xl font-bold",
      tagline: "text-base",
    },
  };
  
  const variants = {
    default: {
      icon: "text-orange-500",
      title: "text-gray-900",
      tagline: "text-orange-500",
      titleGradient: "from-orange-600 to-red-600",
    },
    white: {
      icon: "text-white",
      title: "text-white",
      tagline: "text-white/80",
      titleGradient: "from-white to-orange-100",
    },
  };
  
  return (
    <div className={cn("flex items-center", sizes[size].container, className)}>
      <div className="relative">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-2 border-2 border-orange-200 shadow-lg">
          <Bike 
            className={cn(
              sizes[size].icon, 
              "text-white",
              isAnimating && "transform transition-transform duration-700",
              isAnimating && "animate-bounce"
            )}
          />
        </div>
        {animated && (
          <div className={cn(
            "absolute -top-1 -right-1 rounded-full animate-pulse border-2 border-white",
            size === "lg" || size === "xl" ? "w-4 h-4" : "w-3 h-3",
            "bg-green-500"
          )}></div>
        )}
      </div>
      
      <div>
        <h1 
          className={cn(
            sizes[size].title,
            isAnimating ? "bg-gradient-to-r bg-clip-text text-transparent transition-all duration-700" : variants[variant].title,
            isAnimating && `bg-gradient-to-r ${variants[variant].titleGradient} bg-clip-text text-transparent`
          )}
        >
          Hema Motor
        </h1>
        
        {showTagline && (
          <p className={cn(sizes[size].tagline, variants[variant].tagline, "font-medium")}>
            Your Dream Ride Awaits
          </p>
        )}
      </div>
    </div>
  );
} 