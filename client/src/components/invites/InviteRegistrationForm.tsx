import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Invite, User } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

// Create a more specific schema for registration with an invite
const registrationFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  inviteToken: z.string().min(1, "Invite token is required"),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

interface InviteRegistrationFormProps {
  token?: string;
  onRegistrationComplete?: (user: User) => void;
}

export function InviteRegistrationForm({ token: initialToken, onRegistrationComplete }: InviteRegistrationFormProps) {
  const { toast } = useToast();
  const [token, setToken] = useState(initialToken || "");
  
  // Fetch invite details if token is provided
  const {
    data: invite,
    isLoading: inviteLoading,
    error: inviteError,
    refetch: refetchInvite,
  } = useQuery<Invite>({
    queryKey: ["/api/invites/validate", token],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch(`/api/invites/validate?token=${token}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Invalid invite token");
      }
      return res.json();
    },
    enabled: !!token, // Only run query if token exists
  });
  
  // Update the token state if the prop changes
  useEffect(() => {
    if (initialToken && initialToken !== token) {
      setToken(initialToken);
    }
  }, [initialToken, token]);
  
  // Set up form with default values
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      username: "",
      email: invite?.email || "",
      password: "",
      confirmPassword: "",
      inviteToken: token,
    },
  });
  
  // Update email form field when invite data is loaded
  useEffect(() => {
    if (invite?.email) {
      form.setValue("email", invite.email);
    }
  }, [invite, form]);
  
  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (values: RegistrationFormValues) => {
      const res = await apiRequest("POST", "/api/register/invite", values);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return res.json();
    },
    onSuccess: (user: User) => {
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now login.",
      });
      
      if (onRegistrationComplete) {
        onRegistrationComplete(user);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle the token input change
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    form.setValue("inviteToken", newToken);
    
    // If a valid looking token, validate it immediately
    if (newToken.length > 10) {
      refetchInvite();
    }
  };
  
  // Handle form submission
  function onSubmit(values: RegistrationFormValues) {
    registerMutation.mutate(values);
  }
  
  // Invite status message
  const renderInviteStatus = () => {
    if (inviteLoading) {
      return (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Validating invite...
        </div>
      );
    }
    
    if (inviteError) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid invite</AlertTitle>
          <AlertDescription>
            {(inviteError as Error).message || "This invite token is invalid or has expired."}
          </AlertDescription>
        </Alert>
      );
    }
    
    if (invite) {
      if (invite.used) {
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invite already used</AlertTitle>
            <AlertDescription>
              This invitation has already been used. Please request a new invite.
            </AlertDescription>
          </Alert>
        );
      } else {
        return (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Valid Invite</AlertTitle>
            <AlertDescription>
              Invitation for role: <span className="font-semibold">{invite.role}</span>
              {invite.email && (
                <>
                  {" "}
                  for <span className="font-semibold">{invite.email}</span>
                </>
              )}
            </AlertDescription>
          </Alert>
        );
      }
    }
    
    return null;
  };
  
  return (
    <div>
      {!initialToken && (
        <FormItem className="mb-6">
          <FormLabel>Invite Token</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter your invite token"
              value={token}
              onChange={handleTokenChange}
            />
          </FormControl>
          <FormDescription>
            The invite token from your invitation email or link
          </FormDescription>
        </FormItem>
      )}
      
      {renderInviteStatus()}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="inviteToken"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your-email@example.com"
                    {...field}
                    disabled={!!invite?.email}
                  />
                </FormControl>
                {invite?.email && (
                  <FormDescription>
                    Email is set by the invite
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What you'll be known as in the system
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters long
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={registerMutation.isPending || !invite || invite.used}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}