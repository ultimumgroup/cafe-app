import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { InviteRegistrationForm } from "@/components/invites";
import { Loader2 } from "lucide-react";

export default function RegisterWithInvitePage() {
  const { user, loading: isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/register/:token");
  const token = params?.token;
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Join Your Team</h1>
            <p className="text-gray-500 mt-2">
              Register using your invitation token
            </p>
          </div>
          
          <InviteRegistrationForm 
            token={token} 
            onRegistrationComplete={(user) => {
              // Redirect to login page after successful registration
              setLocation("/login");
            }}
          />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gray-900 text-white p-12 items-center justify-center">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Dishwasher's Guide to the Universe</h2>
          <p className="text-xl mb-8">
            Join your restaurant team and access the powerful tools designed to streamline your operations.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Centralized Task Management</h3>
                <p className="text-gray-300">Keep track of all your responsibilities in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Resource Library</h3>
                <p className="text-gray-300">Access training materials and important restaurant documents.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Efficient Communication</h3>
                <p className="text-gray-300">Stay connected with your team and get real-time updates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}