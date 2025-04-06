import { Bell, Moon, Sun, Menu } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface TopBarProps {
  toggleMobileMenu: () => void;
  user: AuthUser | null;
}

const TopBar = ({ toggleMobileMenu, user }: TopBarProps) => {
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // Set page title based on current route
  useEffect(() => {
    if (location === "/dashboard") setPageTitle("Dashboard");
    else if (location === "/playbook") setPageTitle("Playbook");
    else if (location === "/library") setPageTitle("Library");
    else if (location === "/settings") setPageTitle("Settings");
    else if (location === "/tasks") setPageTitle("Tasks");
    else if (location === "/admin") setPageTitle("Admin");
    else if (location === "/feedback") setPageTitle("Feedback");
    else setPageTitle("Dishwasher's Guide");
  }, [location]);

  const handleLogout = () => {
    logout();
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Toggle class on document element
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Set up initial theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setDarkMode(savedTheme === 'dark');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between md:justify-end shadow-sm">
      {/* Mobile Menu Toggle */}
      <button 
        className="p-1 rounded-md hover:bg-muted md:hidden focus:outline-none"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      {/* Mobile Title */}
      <h1 className="text-lg font-semibold md:hidden">{pageTitle}</h1>
      
      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button 
          className="p-2 rounded-md hover:bg-muted relative focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* Dark Mode Toggle */}
        <button 
          className="p-2 rounded-md hover:bg-muted focus:outline-none"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        {/* User Menu (Mobile) */}
        {user && (
          <div className="md:hidden">
            <button 
              className="p-2 rounded-md hover:bg-muted focus:outline-none"
              aria-label="User menu"
            >
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user.username.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            </button>
          </div>
        )}
        
        {/* Logout Button (Desktop) */}
        <div className="hidden md:block">
          <Button variant="ghost" onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
