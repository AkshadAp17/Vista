import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bike, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import FloatingBusinessCard from "@/components/floating-business-card";

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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
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
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-400/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Animated motorcycle path */}
      <div className="absolute w-full h-full">
        <div className="absolute top-[15%] left-0 w-full opacity-20 animate-[slideRight_15s_linear_infinite]">
          <svg viewBox="0 0 800 120" className="w-full">
            <path d="M-200,80 C100,120 300,50 800,100" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="0" cy="80" r="10" fill="white" className="animate-ping">
              <animateMotion
                dur="15s"
                repeatCount="indefinite"
                path="M-200,80 C100,120 300,50 800,100"
              />
            </circle>
            <path d="M0,0 L-30,0 L-20,-15 L0,-15 Z" fill="white">
              <animateMotion
                dur="15s"
                repeatCount="indefinite"
                path="M-200,80 C100,120 300,50 800,100"
                rotate="auto"
              />
            </path>
          </svg>
        </div>
        <div className="absolute top-[65%] left-0 w-full opacity-20 animate-[slideLeft_20s_linear_infinite]" style={{ animationDelay: '5s' }}>
          <svg viewBox="0 0 800 120" className="w-full">
            <path d="M800,40 C500,0 300,80 -200,30" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="800" cy="40" r="8" fill="white" className="animate-ping" style={{ animationDelay: '1s' }}>
              <animateMotion
                dur="20s"
                repeatCount="indefinite"
                path="M800,40 C500,0 300,80 -200,30"
              />
            </circle>
            <path d="M0,0 L-25,0 L-15,-12 L0,-12 Z" fill="white">
              <animateMotion
                dur="20s"
                repeatCount="indefinite"
                path="M800,40 C500,0 300,80 -200,30"
                rotate="auto"
              />
            </path>
          </svg>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col justify-center items-center text-white p-8 h-full">
        <div className="text-center space-y-8 max-w-lg backdrop-blur-sm bg-black/20 p-10 rounded-3xl border border-white/20 shadow-2xl animate-in fade-in-50 duration-700">
          <div className="bg-white/15 backdrop-blur-sm p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto relative group shadow-2xl">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping opacity-50 duration-2000 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Bike className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-700">{title}</h1>
            <p className="text-lg lg:text-xl text-white/90 animate-in slide-in-from-bottom-5 duration-700 delay-150">{subtitle}</p>
          </div>
          <div className="space-y-4 text-white/85 animate-in slide-in-from-bottom-6 duration-700 delay-300">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 transition-all hover:translate-x-1 duration-300 text-left">
                <div className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0"></div>
                <span className="text-sm lg:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative motorcycle silhouettes */}
      <div className="absolute bottom-10 right-10 opacity-10 animate-in slide-in-from-right duration-1000 delay-500">
        <svg viewBox="0 0 400 200" className="w-96 h-48">
          <path d="M50 150 Q100 120 150 130 Q200 140 250 120 Q300 100 350 110" 
                stroke="white" strokeWidth="3" fill="none"/>
          <circle cx="80" cy="160" r="25" fill="white"/>
          <circle cx="280" cy="130" r="25" fill="white"/>
          <path d="M80 140 L120 110 L180 110 L220 130 L280 130" 
                stroke="white" strokeWidth="4" fill="none"/>
          <path d="M180 110 L190 90 L210 90 L220 110" 
                stroke="white" strokeWidth="3" fill="white"/>
        </svg>
      </div>
      
      <div className="absolute top-20 left-20 opacity-10 animate-in slide-in-from-left duration-1000 delay-700">
        <svg viewBox="0 0 300 150" className="w-72 h-36">
          <circle cx="60" cy="120" r="20" fill="white"/>
          <circle cx="200" cy="110" r="20" fill="white"/>
          <path d="M60 100 L90 80 L140 80 L170 100 L200 100" 
                stroke="white" strokeWidth="3" fill="none"/>
          <path d="M140 80 L145 60 L165 60 L170 80"
                stroke="white" strokeWidth="2" fill="white"/>
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
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
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-4 relative">
          {/* Floating Business Card */}
          <div className="absolute top-6 right-6 z-10">
            <FloatingBusinessCard />
          </div>
          
          <Card className="w-full max-w-md border-none shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                  <Bike className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">Email Verification</CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 relative">
        {/* Floating Business Card */}
        <div className="absolute top-6 right-6 z-10">
          <FloatingBusinessCard />
        </div>
        
        <Card className="w-full max-w-lg border border-gray-200 dark:border-slate-700 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                <Bike className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">Welcome</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              Sign in to your account or create a new one
              <br />
              <small className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                Note: The first user to sign up will automatically become an admin
              </small>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="h-11 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="h-11 pr-12 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg transition-all duration-300"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500 hover:text-orange-500 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500 hover:text-orange-500 transition-colors" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-lg font-semibold"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-first-name" className="text-gray-700 dark:text-gray-300 font-medium">First Name</Label>
                      <Input
                        id="signup-first-name"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        required
                        className="h-11 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg transition-all duration-300"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-last-name" className="text-gray-700 dark:text-gray-300 font-medium">Last Name</Label>
                      <Input
                        id="signup-last-name"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                        className="h-11 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg transition-all duration-300"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="h-11 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        className="h-11 pr-12 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg transition-all duration-300"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500 hover:text-orange-500 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500 hover:text-orange-500 transition-colors" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] rounded-lg font-semibold"
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
      
      {/* Floating Business Card */}
      <FloatingBusinessCard />
    </div>
  );
}