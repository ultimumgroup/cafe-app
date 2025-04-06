import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
        mass: 0.8,
        duration: 0.3
      }}
    >
      {children}
    </motion.div>
  );
}

export function createPageTransition(Component: React.ComponentType<any>) {
  return function PageWithTransition(props: any) {
    return (
      <PageTransition>
        <Component {...props} />
      </PageTransition>
    );
  };
}