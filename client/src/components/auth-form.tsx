import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bike } from "lucide-react";
import { useLocation } from "wouter";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function AuthForm() {
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
  const [signupData, setSignupData] = useState<SignupData>({ 
    email: "", 
    password: "", 
    firstName: "", 
    lastName: "" 
  });
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: (response: any) => {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Navigate based on user role
      if (response.user?.isAdmin) {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Invalid email or password";
      
      // Check if error is about email verification
      if (errorMessage.includes("verify your email")) {
        setVerificationEmail(loginData.email);
        setShowVerification(true);
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => apiRequest("POST", "/api/auth/signup", data),
    onSuccess: (response: any) => {
      toast({
        title: "Account created",
        description: "Please check your email for verification code",
      });
      setVerificationEmail(signupData.email);
      setShowVerification(true);
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: { email: string; verificationCode: string }) => 
      apiRequest("POST", "/api/auth/verify-email", data),
    onSuccess: () => {
      toast({
        title: "Email verified",
        description: "You can now login with your account",
      });
      setShowVerification(false);
      setVerificationCode("");
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => apiRequest("POST", "/api/auth/resend-verification", { email }),
    onSuccess: () => {
      toast({
        title: "Verification email sent",
        description: "Please check your email for new verification code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(signupData);
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmailMutation.mutate({
      email: verificationEmail,
      verificationCode: verificationCode
    });
  };

  const handleResendVerification = () => {
    resendVerificationMutation.mutate(verificationEmail);
  };



  // Show verification form if needed
  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bike className="text-hema-orange h-8 w-8" />
              <h1 className="text-3xl font-bold text-hema-secondary">Hema Motor</h1>
            </div>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              We sent a verification code to {verificationEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-hema-orange hover:bg-hema-orange/90"
                disabled={verifyEmailMutation.isPending}
              >
                {verifyEmailMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
              >
                {resendVerificationMutation.isPending ? "Sending..." : "Resend Code"}
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowVerification(false)}
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bike className="text-hema-orange h-8 w-8" />
            <span className="text-2xl font-bold text-hema-secondary">Hema Motor</span>
          </div>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
            <br />
            <small className="text-xs text-muted-foreground">
              Note: The first user to sign up will automatically become an admin
            </small>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-hema-orange hover:bg-hema-orange/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstName">First Name</Label>
                    <Input
                      id="signup-firstName"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastName">Last Name</Label>
                    <Input
                      id="signup-lastName"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-hema-orange hover:bg-hema-orange/90"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}