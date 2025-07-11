import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bike, Eye, EyeOff, User } from "lucide-react";
import BusinessCard from "@/components/business-card";
import { useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";


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
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  
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

  // Forgot password mutations
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => apiRequest("POST", "/api/auth/forgot-password", { email }),
    onSuccess: () => {
      toast({
        title: "Reset code sent",
        description: "If an account exists, a reset code will be sent to your email",
      });
      setShowResetForm(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { email: string; resetCode: string; newPassword: string }) => 
      apiRequest("POST", "/api/auth/reset-password", data),
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password",
      });
      setShowForgotPassword(false);
      setShowResetForm(false);
      setForgotEmail("");
      setResetCode("");
      setNewPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(forgotEmail);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetPasswordMutation.mutate({
      email: forgotEmail,
      resetCode,
      newPassword,
    });
  };

  // Visual side component
  const VisualSide = ({ title, subtitle, features }: { title: string; subtitle: string; features: string[] }) => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 relative overflow-hidden">
      {/* Business Card Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          title="Meet the Owner - Shubham Pujari"
          onClick={() => setShowBusinessCard(true)}
        >
          <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </Button>
      </div>
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
            "Start buying and selling bikes immediately"
          ]}
        />

        {/* Right Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-4">
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

  // Show forgot password form if needed
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex">
        <VisualSide 
          title="Password Reset"
          subtitle="Recover your account access quickly and securely"
          features={[
            "Enter your email address to receive a reset code",
            "Check your email for the 6-digit verification code",
            "Create a new secure password for your account"
          ]}
        />

        {/* Right Side - Forgot Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-4">
          <Card className="w-full max-w-md border-none shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                  <Bike className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {showResetForm ? "Reset Password" : "Forgot Password"}
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                {showResetForm 
                  ? "Enter the reset code from your email and create a new password"
                  : "Enter your email address and we'll send you a reset code"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResetForm ? (
                // Step 1: Email input
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="rider@bikemail.com"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hema-orange hover:bg-hema-orange/90"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? "Sending Reset Code..." : "Send Reset Code"}
                  </Button>
                </form>
              ) : (
                // Step 2: Reset code and new password
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-code">Reset Code</Label>
                    <Input
                      id="reset-code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hema-orange hover:bg-hema-orange/90"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>
              )}
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowResetForm(false);
                    setForgotEmail("");
                    setResetCode("");
                    setNewPassword("");
                  }}
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

  // Show business card if needed
  if (showBusinessCard) {
    return (
      <BusinessCard onClose={() => setShowBusinessCard(false)} />
    );
  }

  // Main login/signup form
  return (
    <div className="min-h-screen flex">
      <VisualSide 
        title="Hema Motors"
        subtitle="Your gateway to premium two-wheelers"
        features={[
          "Browse thousands of premium motorcycles & bikes",
          "Connect directly with bike sellers",
          "Secure and transparent transactions",
          "Verified two-wheeler listings",
          "Real-time chat with sellers"
        ]}
      />

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                <Bike className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">Welcome to Hema Motors</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="rider@bikemail.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="login-password">Password</Label>
                      <Button 
                        variant="link" 
                        className="text-xs p-0 h-auto" 
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hema-orange hover:bg-hema-orange/90"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">First Name</Label>
                      <Input
                        id="signup-firstname"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        placeholder="Bike"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Last Name</Label>
                      <Input
                        id="signup-lastname"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        placeholder="Rider"
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
                      placeholder="bikerider@mail.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="Create strong password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hema-orange hover:bg-hema-orange/90"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Create Account"}
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