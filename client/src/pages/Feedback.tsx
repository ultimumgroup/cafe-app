import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare, Lightbulb, Bug } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("feedback");
  const { toast } = useToast();
  
  const tabs = [
    { id: "feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "suggestions", label: "Suggestions", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "bugs", label: "Report Bugs", icon: <Bug className="h-4 w-4" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      setFeedback("");
      setSubmitting(false);
    }, 1000);
  };

  // Different form placeholders based on active tab
  const getPlaceholder = () => {
    switch (activeTab) {
      case "feedback":
        return "Share your thoughts on your experience with Dishwasher's Guide...";
      case "suggestions":
        return "Have ideas for new features or improvements? Let us know...";
      case "bugs":
        return "Please describe the issue, steps to reproduce, and where it occurred...";
      default:
        return "Type your message here...";
    }
  };
  
  // Different submission button text based on active tab
  const getButtonText = () => {
    if (submitting) return "Submitting...";
    
    switch (activeTab) {
      case "feedback":
        return "Submit Feedback";
      case "suggestions":
        return "Submit Suggestion";
      case "bugs":
        return "Report Bug";
      default:
        return "Submit";
    }
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 md:mb-6">Submit Feedback</h1>
      
      <div className="grid gap-6">
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-0">
            <AnimatedTabs 
              tabs={tabs} 
              defaultTab="feedback" 
              onChange={setActiveTab}
              variant="underline"
              className="mb-4"
            />
            <CardDescription className="mt-2">
              Your input helps us make Dishwasher's Guide better for everyone.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmit}>
                  <Textarea
                    placeholder={getPlaceholder()}
                    className="min-h-32 mb-3"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={submitting}
                    >
                      {getButtonText()}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5" /> Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Be specific about what you liked or disliked</li>
                  <li>Suggest features that would help your daily workflow</li>
                  <li>Report any bugs or issues you encountered</li>
                  <li>Share ideas for new tools or improvements</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <motion.li 
                    className="pb-2 border-b border-border"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="font-medium">Mobile improvements</span>
                    <p className="text-muted-foreground">Better navigation and layout for small screens</p>
                  </motion.li>
                  <motion.li 
                    className="pb-2 border-b border-border"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="font-medium">Dark mode</span>
                    <p className="text-muted-foreground">Toggle between light and dark themes</p>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="font-medium">Task management</span>
                    <p className="text-muted-foreground">New task assignment and tracking features</p>
                  </motion.li>
                </ul>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Last updated: April 6, 2025
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}