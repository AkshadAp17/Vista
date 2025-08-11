import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Shield, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface VerifyAccountProps {
  email?: string;
  onVerified?: () => void;
}

export default function VerifyAccount({ email, onVerified }: VerifyAccountProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState(email || "");
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const verifyMutation = useMutation({
    mutationFn: async (data: { email: string; verificationCode: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-email", data);
      return response.json();
    },
    onSuccess: () => {
      setIsVerified(true);
      toast({
        title: "Account Verified!",
        description: "Your account has been successfully verified. You can now login.",
      });
      setTimeout(() => {
        onVerified?.();
        navigate("/login");
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/resend-verification", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification code.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !verificationCode) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and verification code.",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate({ email: userEmail, verificationCode });
  };

  const handleResendCode = () => {
    if (!userEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend verification code.",
        variant: "destructive",
      });
      return;
    }
    resendCodeMutation.mutate(userEmail);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Account Verified!
            </CardTitle>
            <CardDescription>
              Your account has been successfully verified. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
          <CardDescription>
            Please enter the verification code sent to your email to activate your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="verificationCode" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
                data-testid="input-verification-code"
              />
            </div>

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Check your email for the 6-digit verification code. It may take a few minutes to arrive.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyMutation.isPending}
              data-testid="button-verify"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify Account"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={resendCodeMutation.isPending}
                data-testid="button-resend-code"
              >
                {resendCodeMutation.isPending ? "Sending..." : "Resend Code"}
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
                data-testid="link-back-to-login"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}