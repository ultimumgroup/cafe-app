import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  id: string;
  icon?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pills" | "boxed";
  className?: string;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  onChange,
  variant = "underline",
  className,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Variants for different tab styles
  const tabStyles = {
    underline: {
      container: "border-b border-border",
      tab: "px-4 py-2 relative",
      indicator: {
        bottom: -1,
        height: "2px",
        background: "var(--primary)",
      },
    },
    pills: {
      container: "p-1 bg-muted rounded-lg",
      tab: "px-4 py-2 rounded-md relative",
      indicator: {
        borderRadius: "0.375rem",
        background: "var(--card)",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      },
    },
    boxed: {
      container: "border border-border rounded-lg overflow-hidden",
      tab: "px-4 py-2 relative",
      indicator: {
        background: "var(--primary-foreground)",
        opacity: 0.1,
      },
    },
  };

  // Get current style based on variant
  const currentStyle = tabStyles[variant];

  return (
    <div className={cn("flex", currentStyle.container, className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={cn(
              "flex items-center transition-colors relative z-10",
              currentStyle.tab,
              isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-selected={isActive}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            <span>{tab.label}</span>
            {isActive && variant === "underline" && (
              <motion.div
                className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
                layoutId="underline"
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ 
                  duration: 0.15, 
                  type: "spring",
                  stiffness: 450,
                  damping: 22,
                  mass: 0.5,
                  velocity: 2
                }}
              />
            )}
          </button>
        );
      })}
      {variant !== "underline" && (
        <motion.div
          className="absolute z-0"
          layoutId="background"
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25, 
            mass: 0.6,
            velocity: 2,
            restDelta: 0.001
          }}
          style={currentStyle.indicator}
          initial={false}
          animate={{
            width: (tabs.find((tab) => tab.id === activeTab)?.label.length || 5) * 10 + 40,
            x: tabs.findIndex((tab) => tab.id === activeTab) * 100,
          }}
        />
      )}
    </div>
  );
}