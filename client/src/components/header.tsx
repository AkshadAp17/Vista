import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bike, Plus, User, Settings, LogOut, Menu } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Bike className="text-hema-orange h-8 w-8" />
              <h1 className="text-2xl font-bold text-hema-secondary">Hema Motor</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-700 hover:text-hema-orange font-medium">
                Home
              </a>
              <a href="/?type=motorcycle" className="text-gray-700 hover:text-hema-orange font-medium">
                Motorcycles
              </a>
              <a href="/?type=scooter" className="text-gray-700 hover:text-hema-orange font-medium">
                Scooters
              </a>
              <a href="/?type=electric" className="text-gray-700 hover:text-hema-orange font-medium">
                Electric
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user && (user as any)?.isAdmin && (
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/admin'}
                  >
                    Admin Panel
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any)?.profileImageUrl || ""} alt="Profile" />
                        <AvatarFallback>
                          {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/api/auth/logout'}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                className="bg-hema-orange hover:bg-hema-orange/90 text-white"
                onClick={() => window.location.href = '/api/login'}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
            
            <Button 
              className="md:hidden text-hema-secondary"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-gray-700 hover:text-hema-orange font-medium py-2">
                Home
              </a>
              <a href="/?type=motorcycle" className="text-gray-700 hover:text-hema-orange font-medium py-2">
                Motorcycles
              </a>
              <a href="/?type=scooter" className="text-gray-700 hover:text-hema-orange font-medium py-2">
                Scooters
              </a>
              <a href="/?type=electric" className="text-gray-700 hover:text-hema-orange font-medium py-2">
                Electric
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
