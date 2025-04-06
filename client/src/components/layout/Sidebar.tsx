import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, Library, Settings, Home, ClipboardList, MessageSquare, LogOut } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { useState } from "react";
import { SquareChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  user: AuthUser | null;
  mobile?: boolean;
}

const Sidebar = ({ user, mobile = false }: SidebarProps) => {
  const [location] = useLocation();
  const [restaurantName, setRestaurantName] = useState("Pasta Paradise");
  const { logout } = useAuth();
  
  // Staff users see a simplified navigation
  const staffNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings }
  ];
  
  // Other roles see the standard navigation
  const standardNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playbook", href: "/playbook", icon: BookOpen },
    { name: "Library", href: "/library", icon: Library },
    { name: "Settings", href: "/settings", icon: Settings }
  ];
  
  // Add admin for superadmin users
  const adminNavigation = user?.role === 'superadmin' 
    ? [...standardNavigation.slice(0, -1), { name: "Admin", href: "/admin", icon: LayoutDashboard }, standardNavigation[standardNavigation.length - 1]] 
    : standardNavigation;
  
  // Choose navigation based on user role
  const navigation = user?.role === 'staff' ? staffNavigation : adminNavigation;

  // If on mobile, we render a different version of the sidebar
  if (mobile) {
    return (
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <a 
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                    location === item.href 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
          <li>
            <button 
              onClick={() => logout()}
              className="w-full flex items-center space-x-3 p-3 rounded-md text-foreground hover:bg-muted transition-colors mt-4"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
        
        {/* Restaurant Selector */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Restaurant</p>
              <p className="font-medium">{restaurantName}</p>
            </div>
            <button className="p-1 rounded-md hover:bg-muted">
              <SquareChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Dishwasher's Guide</h1>
        <p className="text-sm text-muted-foreground">Restaurant Staff OS</p>
      </div>
      
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-medium">
                {user.username.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <button 
                  className={`flex items-center w-full space-x-3 p-2 rounded-md transition-colors ${
                    location === item.href 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Restaurant Selector */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Restaurant</p>
            <p className="font-medium">{restaurantName}</p>
          </div>
          <button className="p-1 rounded-md hover:bg-muted">
            <SquareChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
