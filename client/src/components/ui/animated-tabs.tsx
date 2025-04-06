import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  className = "",
  onChange,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  // Set initial tab
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 relative flex items-center space-x-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTabIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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

