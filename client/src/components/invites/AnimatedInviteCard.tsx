import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Invite } from "@shared/schema";
import { Copy, CheckCircle2, Clock, Mail } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AnimatedInviteCardProps {
  invite: Invite;
  onResend?: (invite: Invite) => void;
}

export function AnimatedInviteCard({ invite, onResend }: AnimatedInviteCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Format date to be more readable
  const formattedDate = invite.createdAt ? new Date(invite.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : "Unknown date";
  
  // Status based styling and icons
  const getStatusInfo = () => {
    if (invite.used) {
      return { 
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, 
        text: "Used", 
        className: "text-green-500 bg-green-50 dark:bg-green-950/30" 
      };
    }
    return { 
      icon: <Clock className="h-4 w-4 text-amber-500" />, 
      text: "Pending", 
      className: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" 
    };
  };
  
  const statusInfo = getStatusInfo();
  
  // Copy invite URL to clipboard
  const copyToClipboard = () => {
    const inviteUrl = `${window.location.origin}/register-invite/${invite.token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
      variant: "default",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle resend invitation
  const handleResend = () => {
    if (onResend) {
      onResend(invite);
      
      toast({
        title: "Invitation Resent",
        description: `Invitation has been resent to ${invite.email}`,
        variant: "default",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-medium">{invite.email}</CardTitle>
              <CardDescription className="text-xs mt-1">
                Invited on {formattedDate}
              </CardDescription>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.className}`}>
              {statusInfo.icon}
              {statusInfo.text}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-sm text-muted-foreground">
            <p>Role: <span className="text-foreground font-medium capitalize">{invite.role}</span></p>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={copyToClipboard}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Copied
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy Link
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy invite link to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!invite.used && onResend && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResend}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resend invitation email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}