import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Invite } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy, ExternalLink, Search } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";

interface InvitesListProps {
  restaurantId: number;
}

export function InvitesList({ restaurantId }: InvitesListProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: invites, isLoading, error } = useQuery<Invite[]>({
    queryKey: ["/api/invites", restaurantId],
    queryFn: async () => {
      const res = await fetch(`/api/invites?restaurantId=${restaurantId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch invites");
      }
      return res.json();
    }
  });
  
  const copyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/register/${token}`;
    navigator.clipboard.writeText(inviteLink).then(
      () => {
        toast({
          title: "Link copied",
          description: "Invitation link copied to clipboard",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive",
        });
      }
    );
  };
  
  const filteredInvites = invites
    ? invites.filter((invite) => {
        if (!searchQuery) return true;
        const emailMatch = invite.email && invite.email.toLowerCase().includes(searchQuery.toLowerCase());
        const roleMatch = invite.role.toLowerCase().includes(searchQuery.toLowerCase());
        return emailMatch || roleMatch;
      })
    : [];
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-4/5" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24 mr-2" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
        <p className="font-semibold">Error loading invites</p>
        <p className="text-sm mt-1">{(error as Error).message || "Unknown error occurred"}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invites by email or role..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredInvites.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {invites && invites.length > 0
              ? "No invites match your search criteria"
              : "No invites found. Create an invite to get started."}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredInvites.map((invite) => (
          <Card key={invite.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{invite.email || "No Email Specified"}</CardTitle>
                  <CardDescription>
                    Created {formatDistanceToNow(new Date(invite.createdAt || new Date()), { addSuffix: true })}
                  </CardDescription>
                </div>
                <Badge variant={invite.used ? "outline" : "default"}>
                  {invite.used ? "Used" : "Active"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium">{invite.role}</p>
                </div>
                {invite.expiresAt && (
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p className="font-medium">{format(new Date(invite.expiresAt || new Date()), "PPP")}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyInviteLink(invite.token)}
                  disabled={invite.used}
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`/register/${invite.token}`, "_blank")}
                  disabled={invite.used}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}