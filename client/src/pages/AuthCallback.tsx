import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState("Processing authentication...");
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth callback result from URL
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus("Authentication failed. Please try again.");
          toast({
            title: "Authentication Failed",
            description: error.message,
            variant: "destructive",
          });
          
          // Redirect to login after a short delay
          setTimeout(() => {
            setLocation("/login");
          }, 3000);
          
          return;
        }
        
        // If we have a session, redirect to dashboard
        setStatus("Authentication successful! Redirecting...");
        toast({
          title: "Authentication Successful",
          description: "You have been successfully signed in.",
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("An unexpected error occurred. Please try again.");
        
        // Redirect to login after a short delay
        setTimeout(() => {
          setLocation("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [setLocation, toast]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-75"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
        </div>
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;