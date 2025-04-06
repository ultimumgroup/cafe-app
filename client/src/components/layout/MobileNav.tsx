import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, Library, Settings, Home, ClipboardList, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MobileNav = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Staff users see a simplified navigation with Home, Tasks, Feedback
  const staffNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Feedback", href: "/feedback", icon: MessageSquare }
  ];
  
  // Other roles see the standard navigation
  const standardNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playbook", href: "/playbook", icon: BookOpen },
    { name: "Library", href: "/library", icon: Library },
    { name: "Settings", href: "/settings", icon: Settings }
  ];
  
  // Choose navigation based on user role
  const navigation = user?.role === 'staff' ? staffNavigation : standardNavigation;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-gray-700 flex justify-around z-50">
      {navigation.map((item) => (
        <Link key={item.name} href={item.href}>
          <button 
            className={`flex flex-col items-center py-3 px-4 w-full transition-colors ${
              location === item.href ? 'text-primary' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.name}</span>
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
