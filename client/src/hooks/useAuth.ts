import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Console log for debugging
  console.log("Auth state:", { user, isLoading, error, isAuthenticated: !!user });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
