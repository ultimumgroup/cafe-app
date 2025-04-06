import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  color?: string; // Optional color for theming
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
  enableColorTransition?: boolean; // New prop to control color transition
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  className = "",
  onChange,
  enableColorTransition = true, // Default to true
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);
  const [tabColor, setTabColor] = useState<string | undefined>(
    tabs.find(t => t.id === (defaultTab || tabs[0].id))?.color
  );

  // Set initial tab
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      
      // Set initial color if available
      const tab = tabs.find(t => t.id === defaultTab);
      if (tab?.color && enableColorTransition) {
        setTabColor(tab.color);
      }
    }
  }, [defaultTab, tabs, enableColorTransition]);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update color if available
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.color && enableColorTransition) {
      setTabColor(tab.color);
    }
    
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <div 
      className={`w-full ${className}`}
      style={
        enableColorTransition && tabColor
          ? { 
              // Apply subtle background color transition using CSS variables
              "--tab-color": tabColor,
              transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out"
            } as React.CSSProperties
          : undefined
      }
    >
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 relative flex items-center space-x-2 text-sm font-medium transition-colors duration-300 ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon && (
              <span className={activeTab === tab.id ? "text-primary" : ""}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            
            {/* Active indicator with glow effect */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow"
                layoutId="activeTabIndicator"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  boxShadow: '0 0 4px 0px var(--primary)' 
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                }}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content with Animation */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => {
            if (tab.id !== activeTab) return null;
            
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                  duration: 0.2
                }}
              >
                {tab.content}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

