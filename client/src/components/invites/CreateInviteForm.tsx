import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Invite, insertInviteSchema, UserRole } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";

// Add client-side validation
const createInviteSchema = z.object({
  email: z.union([z.string().email("Please enter a valid email address"), z.literal("")]),
  expiresAt: z.date().optional().nullable(),
  role: z.enum([UserRole.STAFF, UserRole.GENERAL_MANAGER, UserRole.OWNER, UserRole.SUPER_ADMIN]),
  restaurantId: z.number(),
  createdBy: z.number(),
});

type InviteFormValues = z.infer<typeof createInviteSchema>;

interface CreateInviteFormProps {
  restaurantId: number;
  userId: number;
  onInviteCreated?: (invite: Invite) => void;
}

export function CreateInviteForm({ restaurantId, userId, onInviteCreated }: CreateInviteFormProps) {
  const { toast } = useToast();
  const [showCalendar, setShowCalendar] = useState(false);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      restaurantId,
      createdBy: userId,
      role: UserRole.STAFF,
      email: "",
      expiresAt: addDays(new Date(), 7), // Default expiration 7 days
    },
  });
  
  const inviteMutation = useMutation({
    mutationFn: async (values: InviteFormValues) => {
      const res = await apiRequest("POST", "/api/invites", values);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create invite");
      }
      return res.json();
    },
    onSuccess: (invite: Invite) => {
      // Reset form and invalidate queries
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/invites", restaurantId] });
      
      // Show success toast
      toast({
        title: "Invite created",
        description: "The invitation was created successfully",
      });
      
      // Call the callback if provided
      if (onInviteCreated) {
        onInviteCreated(invite);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(values: InviteFormValues) {
    inviteMutation.mutate(values);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="team@restaurant.com" {...field} />
                </FormControl>
                <FormDescription>
                  Optional, but recommended to send the invite directly
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                    <SelectItem value={UserRole.GENERAL_MANAGER}>General Manager</SelectItem>
                    <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determines what permissions the user will have
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => {
              // Convert the field value to a Date object if it exists
              const date = field.value ? new Date(field.value) : undefined;
              
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Expires At</FormLabel>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(date as Date, "PPP")
                          ) : (
                            <span>Never expires</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          field.onChange(date);
                          setShowCalendar(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <div className="border-t p-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            field.onChange(null);
                            setShowCalendar(false);
                          }}
                        >
                          No expiration
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When this invite link expires. Default is 7 days from now.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={inviteMutation.isPending}>
          {inviteMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Invite...
            </>
          ) : (
            "Create Invite"
          )}
        </Button>
      </form>
    </Form>
  );
}