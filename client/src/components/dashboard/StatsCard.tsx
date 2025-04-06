import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "flex flex-col rounded-lg shadow-lg p-6 min-w-[120px] w-full max-w-[180px]",
        "backdrop-blur-sm backdrop-filter",
        "border border-white/10",
        bgColor,
        textColor,
        className
      )}
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        className={cn("mb-4", iconColor)}
      >
        {icon}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.3 }}
        className="text-3xl font-bold mb-1"
      >
        {value}
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: delay + 0.4, duration: 0.3 }}
        className="text-sm"
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;