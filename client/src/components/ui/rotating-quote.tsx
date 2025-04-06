import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingQuoteProps {
  quotes: string[];
  interval?: number; // in milliseconds
  className?: string;
}

export function RotatingQuote({
  quotes,
  interval = 6000, // default to 6 seconds
  className = "",
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
      }, 300); // This should match the exit animation duration
    }, interval);

    return () => clearInterval(timer);
  }, [quotes, interval]);

  return (
    <div className={`overflow-hidden relative h-6 ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {isVisible && (
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
              duration: 0.3
            }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-sm font-medium text-primary-foreground">
              {quotes[currentQuoteIndex]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}