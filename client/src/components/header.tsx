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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bike, Plus, User, Settings, LogOut, Menu, Bell } from "lucide-react";
import SettingsForm from "@/components/settings-form";
import { Logo } from "@/components/ui/logo";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("GET", "/api/auth/logout");
      
      // Clear the user data from the cache
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Redirect to home page
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Small delay to allow the toast to show
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-orange-100">
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <Logo size="md" animated={true} />
            </a>
            <nav className="hidden lg:flex space-x-3 xl:space-x-4">
              <a href="/" className="text-gray-700 hover:text-hema-orange font-medium text-sm xl:text-base transition-colors">
                Home
              </a>
              <a href="/?type=motorcycle" className="text-gray-700 hover:text-hema-orange font-medium text-sm xl:text-base transition-colors">
                Motorcycles
              </a>
              <a href="/?type=scooter" className="text-gray-700 hover:text-hema-orange font-medium text-sm xl:text-base transition-colors">
                Scooters
              </a>
              <a href="/?type=electric" className="text-gray-700 hover:text-hema-orange font-medium text-sm xl:text-base transition-colors">
                Electric
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {isAuthenticated ? (
              <>
                {user && (user as any)?.isAdmin && (
                  <>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="hidden md:inline-flex text-xs md:text-sm touch-target"
                      onClick={() => window.location.href = '/admin'}
                    >
                      <span className="hidden sm:inline">Admin Panel</span>
                      <span className="sm:hidden">Admin</span>
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="hidden md:inline-flex text-xs md:text-sm touch-target"
                      onClick={() => window.location.href = '/users'}
                    >
                      <span className="hidden sm:inline">All Users</span>
                      <span className="sm:hidden">Users</span>
                    </Button>
                  </>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 md:h-11 md:w-11 rounded-full touch-target border-2 border-orange-200 hover:border-orange-300 transition-colors">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10">
                        <AvatarImage src={(user as any)?.profileImageUrl || ""} alt="Profile" />
                        <AvatarFallback className="text-xs md:text-sm bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold border-2 border-white">
                          {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 md:w-56 mr-2" align="end" forceMount>
                    <DropdownMenuItem onClick={() => {
                      if ((user as any)?.isAdmin) {
                        window.location.href = '/admin';
                      } else {
                        window.location.href = '/dashboard';
                      }
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    {user && (user as any)?.isAdmin && (
                      <DropdownMenuItem className="md:hidden" onClick={() => window.location.href = '/admin'}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    {user && (user as any)?.isAdmin && (
                      <DropdownMenuItem onClick={() => window.location.href = '/users'}>
                        <User className="mr-2 h-4 w-4" />
                        <span>All Users</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
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
              className="lg:hidden text-hema-secondary"
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-gray-700 hover:text-hema-orange font-medium py-2 px-2 rounded-md hover:bg-orange-50">
                Home
              </a>
              <a href="/?type=motorcycle" className="text-gray-700 hover:text-hema-orange font-medium py-2 px-2 rounded-md hover:bg-orange-50">
                Motorcycles
              </a>
              <a href="/?type=scooter" className="text-gray-700 hover:text-hema-orange font-medium py-2 px-2 rounded-md hover:bg-orange-50">
                Scooters
              </a>
              <a href="/?type=electric" className="text-gray-700 hover:text-hema-orange font-medium py-2 px-2 rounded-md hover:bg-orange-50">
                Electric
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <SettingsForm isAdmin={(user as any)?.isAdmin} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
