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
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => apiRequest("POST", "/api/auth/signup", data),
    onSuccess: (response: any) => {
      setVerificationEmail(signupData.email);
      setShowVerification(true);
      toast({
        title: "Account created successfully",
        description: "Please check your email for verification code",
      });
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
        title: "Email verified successfully",
        description: "You can now log in to your account",
      });
      setShowVerification(false);
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
        title: "Verification code sent",
        description: "Please check your email for the new code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend code",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with data:", loginData);
    loginMutation.mutate(loginData);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(signupData);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmailMutation.mutate({
      email: verificationEmail,
      verificationCode,
    });
  };

  const handleResendVerification = () => {
    resendVerificationMutation.mutate(verificationEmail);
  };

  // Visual side component
  const VisualSide = ({ title, subtitle, features }: { title: string; subtitle: string; features: string[] }) => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-hema-orange to-orange-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
            <Bike className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-xl text-white/90">{subtitle}</p>
          <div className="space-y-4 text-white/80">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative motorcycle silhouettes */}
      <div className="absolute bottom-10 right-10 opacity-10">
        <svg viewBox="0 0 400 200" className="w-96 h-48">
          <path d="M50 150 Q100 120 150 130 Q200 140 250 120 Q300 100 350 110" 
                stroke="white" strokeWidth="3" fill="none"/>
          <circle cx="80" cy="160" r="25" fill="white"/>
          <circle cx="280" cy="130" r="25" fill="white"/>
          <path d="M80 140 L120 110 L180 110 L220 130 L280 130" 
                stroke="white" strokeWidth="4" fill="none"/>
        </svg>
      </div>
      
      <div className="absolute top-20 left-20 opacity-10">
        <svg viewBox="0 0 300 150" className="w-72 h-36">
          <circle cx="60" cy="120" r="20" fill="white"/>
          <circle cx="200" cy="110" r="20" fill="white"/>
          <path d="M60 100 L90 80 L140 80 L170 100 L200 100" 
                stroke="white" strokeWidth="3" fill="none"/>
        </svg>
      </div>
    </div>
  );

  // Show verification form if needed
  if (showVerification) {
    return (
      <div className="min-h-screen flex">
        <VisualSide 
          title="Email Verification"
          subtitle="Almost there! Just verify your email to get started"
          features={[
            "Check your email for the verification code",
            "Enter the 6-digit code to activate your account",
            "Start buying and selling immediately"
          ]}
        />

        {/* Right Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-4">
          <Card className="w-full max-w-md border-none shadow-2xl">
            <CardHeader className="text-center">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <Bike className="text-hema-orange h-8 w-8" />
                <h1 className="text-2xl font-bold text-hema-secondary">Hema Motor</h1>
              </div>
              <CardTitle className="text-2xl lg:text-3xl font-bold">Email Verification</CardTitle>
              <CardDescription className="text-base">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <VisualSide 
        title="Hema Motor"
        subtitle="Your trusted two-wheeler marketplace"
        features={[
          "Buy & Sell motorcycles, scooters, and electric vehicles",
          "Real-time chat with sellers and buyers",
          "Secure transactions and verified listings"
        ]}
      />

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="text-center">
            {/* Mobile header for small screens */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
              <Bike className="text-hema-orange h-8 w-8" />
              <span className="text-2xl font-bold text-hema-secondary">Hema Motor</span>
            </div>
            <CardTitle className="text-2xl lg:text-3xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-base">
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
                      <Label htmlFor="signup-first-name">First Name</Label>
                      <Input
                        id="signup-first-name"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-last-name">Last Name</Label>
                      <Input
                        id="signup-last-name"
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
    </div>
  );
}