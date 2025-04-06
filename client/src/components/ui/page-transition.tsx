import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.2
      }}
      className="min-h-screen flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;