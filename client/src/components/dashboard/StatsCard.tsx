import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  delay?: number;
}

const StatsCard = ({ 
  value, 
  label, 
  icon, 
  iconColor = "text-primary", 
  bgColor = "bg-card",
  textColor = "text-card-foreground",
  className,
  delay = 0
}: StatsCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: isMobile ? -2 : -5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "flex flex-col rounded-lg shadow-lg border border-white/10",
        "backdrop-blur-sm backdrop-filter",
        // Adjust size and padding based on screen size
        isMobile 
          ? "p-3 min-w-[110px] w-[110px] shrink-0" 
          : "p-6 min-w-[120px] w-full max-w-[180px]",
        bgColor,
        textColor,
        className
      )}
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        className={cn(
          isMobile ? "mb-2" : "mb-4", 
          iconColor
        )}
      >
        <div className={isMobile ? "h-4 w-4" : "h-6 w-6"}>
          {icon}
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.3 }}
        className={cn(
          "font-bold mb-0.5",
          isMobile ? "text-lg" : "text-3xl"
        )}
      >
        {value}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: delay + 0.4, duration: 0.3 }}
        className={isMobile ? "text-xs leading-tight" : "text-sm"}
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;