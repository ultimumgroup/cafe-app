import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateInviteForm, InvitesList } from "@/components/invites";
import { Loader2 } from "lucide-react";

// Simple container component
const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto px-4">{children}</div>;
};

export default function InvitesPage() {
  const { user, loading: isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user || !user.restaurantId) {
    return (
      <div className="py-10 text-center">
        <Container>
          <div className="py-10 text-center">
            <h1 className="text-2xl font-bold mb-4">No Restaurant Access</h1>
            <p>You need to be assigned to a restaurant to manage invites.</p>
          </div>
        </Container>
      </div>
    );
  }

  const canCreateInvites = user.role === "owner" || user.role === "gm";
  
  return (
    <div>
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-6">Staff Invites</h1>
          
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="list">Invites List</TabsTrigger>
              {canCreateInvites && (
                <TabsTrigger value="create">Create Invite</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="list" className="mt-0">
              <InvitesList restaurantId={user.restaurantId} />
            </TabsContent>
            
            {canCreateInvites && (
              <TabsContent value="create" className="mt-0">
                <div className="max-w-md mx-auto">
                  <CreateInviteForm 
                    restaurantId={user.restaurantId} 
                    userId={user.id}
                    onInviteCreated={() => setActiveTab("list")} 
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Container>
    </div>
  );
}