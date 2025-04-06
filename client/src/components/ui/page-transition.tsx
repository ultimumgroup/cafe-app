import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type PageTransitionProps = {
  children: ReactNode;
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const isMobile = useIsMobile();
  
  // Use simpler, faster transitions on mobile for better performance
  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ 
        type: isMobile ? "tween" : "spring", 
        stiffness: isMobile ? undefined : 300, 
        damping: isMobile ? undefined : 30,
        duration: isMobile ? 0.15 : 0.2
      }}
      className="min-h-screen flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;