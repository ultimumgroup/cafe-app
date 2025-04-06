import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 md:mb-6">Submit Feedback</h1>
      
      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>How can we improve?</CardTitle>
            <CardDescription>
              Your feedback helps us make Dishwasher's Guide better for everyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Share your thoughts, suggestions, or report issues..."
                className="min-h-32 mb-3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-sm">
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

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="pb-2 border-b border-border">
                  <span className="font-medium">Mobile improvements</span>
                  <p className="text-muted-foreground">Better navigation and layout for small screens</p>
                </li>
                <li className="pb-2 border-b border-border">
                  <span className="font-medium">Dark mode</span>
                  <p className="text-muted-foreground">Toggle between light and dark themes</p>
                </li>
                <li>
                  <span className="font-medium">Task management</span>
                  <p className="text-muted-foreground">New task assignment and tracking features</p>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Last updated: April 6, 2025
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}