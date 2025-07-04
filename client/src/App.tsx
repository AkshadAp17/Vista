import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import AuthForm from "@/components/auth-form";
import Home from "@/pages/home";
import AdminDashboard from "@/pages/admin-dashboard";
import UserDashboard from "@/pages/user-dashboard";
import VehicleDetail from "@/pages/vehicle-detail";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/*" component={AuthForm} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/admin">
            {user?.isAdmin ? <AdminDashboard /> : <UserDashboard />}
          </Route>
          <Route path="/dashboard">
            {user?.isAdmin ? <AdminDashboard /> : <UserDashboard />}
          </Route>
          <Route path="/vehicle/:id" component={VehicleDetail} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
