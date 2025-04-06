import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface InteractiveQuoteProps {
  quotes: string[];
  interval?: number; // in milliseconds
  className?: string;
  showIcon?: boolean;
  isWhite?: boolean; // To use white text on dark backgrounds
  onInteraction?: (quoteIndex: number, quoteText: string) => void;
}

export function InteractiveQuote({
  quotes,
  interval = 6000, // Set to 6 seconds as per user requirements
  className = "",
  showIcon = true,
  isWhite = false,
  onInteraction,
}: InteractiveQuoteProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Reset like state when quote changes
    setIsLiked(false);
    
    // Set up rotation
    const timer = setInterval(() => {
      setIsVisible(false);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsVisible(true);
      }, 400); // Slightly longer for a smoother transition
    }, interval);

    // Add CSS for the quote highlight animation
    const style = document.createElement('style');
    style.innerHTML = `
      .quote-highlight {
        font-weight: 600 !important;
        transform: scale(1.05) !important;
        text-shadow: 0 0 8px ${isWhite ? 'rgba(255,255,255,0.5)' : 'var(--primary)'} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, [quotes, interval, isWhite]);

  const handleInteraction = async () => {
    if (isLiked) return;
    
    setIsLiked(true);
    
    // Trigger animation
    const quoteElement = document.getElementById(`quote-${currentQuoteIndex}`);
    if (quoteElement) {
      quoteElement.classList.add("quote-highlight");
      setTimeout(() => {
        quoteElement.classList.remove("quote-highlight");
      }, 1000);
    }
    
    // Call the provided callback if it exists
    if (onInteraction) {
      onInteraction(currentQuoteIndex, quotes[currentQuoteIndex]);
    }
    
    // Record the interaction in the database
    try {
      const payload = {
        quoteIndex: currentQuoteIndex,
        quoteText: quotes[currentQuoteIndex],
        userId: user?.id,
        restaurantId: user?.restaurantId
      };
      
      await apiRequest("POST", "/api/quote-interactions", payload);
      
      toast({
        title: "Quote appreciated!",
        description: "We'll remember you liked this one.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to record quote interaction:", error);
    }
  };

  return (
    <div className={`overflow-hidden relative h-auto min-h-[1.5rem] ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {isVisible && (
          <motion.div 
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
              duration: 0.4
            }}
            className="flex items-center justify-start text-left w-full"
          >
            <div className="flex items-center gap-2 group">
              {showIcon && <Quote className={`w-3.5 h-3.5 ${isWhite ? 'text-white/70' : ''}`} />}
              <span 
                id={`quote-${currentQuoteIndex}`}
                className={`text-sm font-medium transition-all duration-300 ${isWhite ? 'text-white italic' : 'text-primary-foreground'}`}
              >
                {quotes[currentQuoteIndex]}
              </span>
              {showIcon && <Quote className={`w-3.5 h-3.5 rotate-180 ${isWhite ? 'text-white/70' : ''}`} />}
              
              <motion.button
                onClick={handleInteraction}
                disabled={isLiked}
                whileTap={{ scale: 0.9 }}
                className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${isLiked ? 'text-primary' : isWhite ? 'text-white' : 'text-foreground'}`}
                aria-label="Like this quote"
              >
                {isLiked ? (
                  <Heart className="w-4 h-4 fill-current" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS styles injected via useEffect instead of style jsx */}
    </div>
  );
}