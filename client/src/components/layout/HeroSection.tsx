import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { InteractiveQuote } from "@/components/ui/interactive-quote";
import { useToast } from "@/hooks/use-toast";

// Restaurant and kitchen-related quotes
const quotes = [
  "The kitchen is the heart of the restaurant.",
  "Clean as you go, success will follow.",
  "Great food comes from a happy kitchen.",
  "Teamwork makes the dream work.",
  "A good dishwasher is the backbone of the kitchen.",
  "Order through chaos, perfection through repetition.",
  "Every dish tells a story.",
  "A great meal starts with clean plates.",
  "From chaos comes order, from order comes excellence.",
];

interface HeroSectionProps {
  title: string;
  image: string;
  subtitle?: string;
  children?: ReactNode;
}

const HeroSection = ({ title, image, subtitle, children }: HeroSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative mb-24 md:mb-20">
      {/* Hero Image Container with Enhanced Gradient Overlay - Adjusted to 30-40% of screen */}
      <div className="relative h-[35vh] min-h-[220px] md:h-[30vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />
        
        {/* Hero Content - Moved to top with padding */}
        <div className="relative z-10 h-full flex flex-col px-4 md:px-6 pt-6">
          {/* Title and subtitle at the top */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={isMobile ? "text-white/80 text-sm mt-1" : "text-white/80 text-lg mt-2"}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          {/* Spacer to push quote to bottom */}
          <div className="flex-grow"></div>
          
          {/* Interactive quote - left-justified with margin and moved up */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16 md:mb-24 ml-[15px] md:ml-[30px]"
          >
            <InteractiveQuote 
              quotes={quotes} 
              interval={6000}
              showIcon={true}
              isWhite={true}
              className="h-auto text-left justify-start"
            />
          </motion.div>
        </div>
      </div>

      {/* Cards Section that floats halfway down the hero image */}
      {children && (
        <div className={isMobile 
          ? "absolute bottom-0 transform translate-y-1/2 w-full px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent" 
          : "absolute bottom-0 transform translate-y-1/2 w-full px-4 md:px-6"
        }>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.3,
              staggerChildren: 0.1,
              type: "spring",
              stiffness: 100
            }}
            className="flex flex-nowrap justify-start gap-2 md:gap-4 pb-2 md:pb-0 overflow-x-auto snap-x"
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;