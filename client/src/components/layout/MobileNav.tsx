import { Link, useLocation } from "wouter";
import type { LucideIcon } from "lucide-react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  Settings, 
  Home, 
  ClipboardList, 
  MessageSquare, 
  UserCircle,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Define a type for navigation items
interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const MobileNav = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Staff users see a specialized navigation with Home, Tasks, Feedback
  const staffNavigation: NavigationItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
    { name: "Help", href: "/library", icon: HelpCircle, highlight: true },
    { name: "Profile", href: "/settings", icon: UserCircle }
  ];
  
  // Other roles see the standard navigation
  const standardNavigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playbook", href: "/playbook", icon: BookOpen },
    { name: "Library", href: "/library", icon: Library },
    { name: "Settings", href: "/settings", icon: Settings }
  ];
  
  // Choose navigation based on user role
  const navigation = user?.role === 'staff' ? staffNavigation : standardNavigation;

  // Animation variants for the icons
  const iconVariants = {
    active: { 
      scale: 1.2, 
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    },
    inactive: { 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    }
  };

  // Animation variants for the text
  const textVariants = {
    active: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    },
    inactive: { 
      opacity: 0.7, 
      y: 1,
      transition: { type: "spring", stiffness: 400, damping: 10 } 
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around z-50 px-1 py-1">
      {navigation.map((item) => {
        const isActive = location === item.href;
        
        return (
          <Link key={item.name} href={item.href}>
            <motion.button 
              className={`relative flex flex-col items-center py-2 px-1 w-full transition-colors rounded-md ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              } ${item.highlight ? 'bg-primary/10' : ''}`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ backgroundColor: "rgba(var(--muted), 0.2)" }}
            >
              {/* Active state indicator with glow */}
              {isActive && (
                <motion.div 
                  className="absolute inset-0 rounded-md border border-primary/30 shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    boxShadow: '0 0 8px 1px rgba(var(--primary), 0.2)'
                  }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <motion.div
                variants={iconVariants}
                initial="inactive"
                animate={isActive ? "active" : "inactive"}
                className={`${item.highlight ? 'text-primary' : ''} z-10`}
              >
                <item.icon className="h-5 w-5 mb-1" />
              </motion.div>
              
              <motion.span 
                className="text-xs font-medium z-10"
                variants={textVariants}
                initial="inactive"
                animate={isActive ? "active" : "inactive"}
              >
                {item.name}
              </motion.span>
            </motion.button>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
