import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{
        duration: 0.15,
        type: "spring",
        stiffness: 400,
        damping: 22,
        mass: 0.8,
        velocity: 2
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}