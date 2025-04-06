import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

interface RotatingQuoteProps {
  quotes: string[];
  interval?: number; // in milliseconds
  className?: string;
  showIcon?: boolean;
  isWhite?: boolean; // To use white text on dark backgrounds
}

export function RotatingQuote({
  quotes,
  interval = 8000, // Increased to 8 seconds for better readability
  className = "",
  showIcon = true,
  isWhite = false,
}: RotatingQuoteProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set up rotation
    const timer = setInterval(() => {
      setIsVisible(false);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsVisible(true);
      }, 400); // Slightly longer for a smoother transition
    }, interval);

    return () => clearInterval(timer);
  }, [quotes, interval]);

  return (
    <div className={`overflow-hidden relative h-6 ${className}`}>
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
            className="absolute inset-0 flex items-center justify-center text-center w-full"
          >
            <span className={`text-sm font-medium flex items-center gap-2 ${isWhite ? 'text-white italic' : 'text-primary-foreground'}`}>
              {showIcon && <Quote className={`w-3.5 h-3.5 ${isWhite ? 'text-white/70' : ''}`} />}
              <span>{quotes[currentQuoteIndex]}</span>
              {showIcon && <Quote className={`w-3.5 h-3.5 rotate-180 ${isWhite ? 'text-white/70' : ''}`} />}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}