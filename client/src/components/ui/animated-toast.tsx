import { toast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ToastProps } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";

type ToastVariant = "default" | "success" | "error" | "info";

interface AnimatedToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

// Custom toast function with animations
export function animatedToast(props: AnimatedToastProps) {
  const { title, description, variant = "default" } = props;
  
  return toast({
    title,
    description,
    duration: 4000,
    className: cn(
      "border rounded-lg shadow-lg",
      variant === "success" && "border-green-600 bg-green-50 dark:bg-green-950/50 dark:border-green-800",
      variant === "error" && "border-red-600 bg-red-50 dark:bg-red-950/50 dark:border-red-800",
      variant === "info" && "border-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800",
    ),
  });
}

function AnimatedToast({ 
  title, 
  description, 
  variant = "default" 
}: AnimatedToastProps) {
  const isMobile = useIsMobile();
  
  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className={isMobile ? "h-4 w-4 text-green-500" : "h-5 w-5 text-green-500"} />;
      case "error":
        return <AlertTriangle className={isMobile ? "h-4 w-4 text-red-500" : "h-5 w-5 text-red-500"} />;
      case "info":
        return <Info className={isMobile ? "h-4 w-4 text-blue-500" : "h-5 w-5 text-blue-500"} />;
      default:
        return null;
    }
  };

  // Use simpler animations on mobile for better performance
  const transitionSettings = isMobile 
    ? { type: "tween", duration: 0.2 } 
    : { type: "spring", damping: 20, stiffness: 300 };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={transitionSettings}
      className={isMobile ? "flex w-full items-start gap-1.5 p-3" : "flex w-full items-start gap-2 p-4"}
    >
      {/* Icon */}
      {getIcon() && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {getIcon()}
        </motion.div>
      )}
      
      {/* Content */}
      <div className="flex-1">
        {title && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              isMobile ? "text-xs font-medium" : "text-sm font-medium",
              variant === "success" && "text-green-800 dark:text-green-300",
              variant === "error" && "text-red-800 dark:text-red-300",
              variant === "info" && "text-blue-800 dark:text-blue-300"
            )}
          >
            {title}
          </motion.div>
        )}
        
        {description && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className={cn(
              isMobile ? "text-[10px] mt-0.5" : "text-xs mt-1",
              variant === "success" && "text-green-700 dark:text-green-400",
              variant === "error" && "text-red-700 dark:text-red-400",
              variant === "info" && "text-blue-700 dark:text-blue-400"
            )}
          >
            {description}
          </motion.div>
        )}
      </div>
      
      {/* Close button */}
      <motion.button 
        whileHover={{ scale: isMobile ? 1.05 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="text-foreground/50 hover:text-foreground"
      >
        <X className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
      </motion.button>
    </motion.div>
  );
}

export function successToast({ title, description }: Omit<AnimatedToastProps, "variant">) {
  return animatedToast({
    title,
    description,
    variant: "success",
  });
}

export function errorToast({ title, description }: Omit<AnimatedToastProps, "variant">) {
  return animatedToast({
    title,
    description,
    variant: "error",
  });
}

export function infoToast({ title, description }: Omit<AnimatedToastProps, "variant">) {
  return animatedToast({
    title,
    description,
    variant: "info",
  });
}