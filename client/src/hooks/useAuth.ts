import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
