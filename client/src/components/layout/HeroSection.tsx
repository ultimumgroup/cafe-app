import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
      {/* Hero Image Container with Enhanced Gradient Overlay */}
      <div className="relative h-[40vh] min-h-[240px] md:h-[35vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        
        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end z-10 px-4 md:px-6 py-6">
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
      </div>

      {/* Cards Section that overlays the hero image */}
      {children && (
        <div className={isMobile ? "absolute bottom-0 transform translate-y-1/2 w-full px-2 overflow-x-auto" : "absolute bottom-0 transform translate-y-1/2 w-full px-4 md:px-6"}>
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
            className="flex flex-nowrap justify-start gap-2 md:gap-4 pb-2 md:pb-0 overflow-x-auto"
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;