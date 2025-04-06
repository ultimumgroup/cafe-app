import { ToastProps, toast as showToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedToastProps extends ToastProps {
  icon?: ReactNode;
}

// Wrap the toast functionality with animation
export function animatedToast({
  title,
  description,
  variant = "default",
  icon,
  ...props
}: AnimatedToastProps) {
  return showToast({
    title,
    description,
    variant,
    ...props,
    // Custom component for the toast with animation
    // This assumes your toast implementation supports custom components
    // You may need to modify this to fit your specific toast system
    renderContent: (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 40,
          mass: 1,
          duration: 0.2
        }}
        className="flex w-full p-4 rounded-lg bg-card"
      >
        <div className="flex items-start">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div>
            {title && <div className="font-medium">{title}</div>}
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>
        </div>
      </motion.div>
    ),
  });
}

// Success toast with check icon
export function successToast({
  title = "Success",
  description,
  ...props
}: Omit<AnimatedToastProps, "variant">) {
  return animatedToast({
    title,
    description,
    variant: "success",
    icon: (
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    ...props,
  });
}

// Error toast with X icon
export function errorToast({
  title = "Error",
  description,
  ...props
}: Omit<AnimatedToastProps, "variant">) {
  return animatedToast({
    title,
    description,
    variant: "destructive",
    icon: (
      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    ...props,
  });
}

// Info toast with info icon
export function infoToast({
  title = "Info",
  description,
  ...props
}: Omit<AnimatedToastProps, "variant">) {
  return animatedToast({
    title,
    description,
    variant: "default",
    icon: (
      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    ...props,
  });
}