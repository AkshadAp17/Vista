import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div className={cn("bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-spin border-4 border-transparent", sizeClasses[size])}>
            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
              <Loader2 className={cn("text-orange-500 animate-spin", 
                size === "sm" ? "h-2 w-2" : 
                size === "md" ? "h-3 w-3" : "h-4 w-4"
              )} />
            </div>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
        </div>
        {text && (
          <p className="text-sm text-gray-600 animate-pulse font-medium">{text}</p>
        )}
      </div>
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-48 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 h-4 rounded w-24"></div>
          <div className="bg-orange-200 h-5 rounded-full w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-5 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="bg-gray-200 h-6 rounded w-20"></div>
          <div className="bg-gray-200 h-8 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 animate-pulse">
      <div className="flex items-center">
        <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
        <div className="ml-4 space-y-2">
          <div className="bg-gray-200 h-4 rounded w-16"></div>
          <div className="bg-gray-200 h-6 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-start space-x-3">
        <div className="bg-gray-200 h-8 w-8 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-200 h-4 rounded w-3/4 animate-pulse"></div>
          <div className="bg-gray-200 h-3 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-start space-x-3 justify-end">
        <div className="flex-1 space-y-2 flex flex-col items-end">
          <div className="bg-orange-200 h-4 rounded w-2/3 animate-pulse"></div>
          <div className="bg-gray-200 h-3 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="bg-gray-200 h-8 w-8 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export function VehicleDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-200 h-64 sm:h-80 rounded-lg"></div>
      <div className="space-y-4">
        <div className="bg-gray-200 h-8 rounded w-3/4"></div>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 h-6 rounded w-24"></div>
          <div className="bg-gray-200 h-6 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-200 h-4 rounded w-full"></div>
          <div className="bg-gray-200 h-4 rounded w-5/6"></div>
          <div className="bg-gray-200 h-4 rounded w-4/6"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="bg-gray-200 h-10 rounded w-32"></div>
          <div className="bg-gray-200 h-10 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}