import { Bell, Moon, Sun, Menu, LaptopIcon } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface TopBarProps {
  toggleMobileMenu: () => void;
  user: AuthUser | null;
}

type ThemeMode = 'light' | 'dark' | 'system';

const TopBar = ({ toggleMobileMenu, user }: TopBarProps) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
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

  const applyTheme = (mode: ThemeMode) => {
    // Apply the theme mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (mode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else if (mode === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      
      // Listen for changes in system preference
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
          if (localStorage.getItem('theme') === 'system') {
            if (e.matches) {
              document.documentElement.classList.add('dark');
              document.documentElement.classList.remove('light');
            } else {
              document.documentElement.classList.add('light');
              document.documentElement.classList.remove('dark');
            }
          }
        });
    }
    
    // Save theme preference
    localStorage.setItem('theme', mode);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
    
    const messages = {
      light: "☀️ Light mode activated!",
      dark: "🌙 Dark mode activated!",
      system: "💻 Using system preference!"
    };
    
    toast({
      title: "Theme Changed",
      description: messages[mode],
      duration: 2000,
    });
  };

  // Set up initial theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode || 'dark';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Toggle function for quick toggle button
  const toggleDarkMode = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setTheme(newMode);
  };

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
        
        {/* Dark Mode Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 rounded-md hover:bg-muted focus:outline-none"
              aria-label="Theme options"
            >
              <motion.div 
                initial={false}
                animate={{ rotate: themeMode === 'dark' ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {themeMode === 'light' && <Sun className="h-5 w-5" />}
                {themeMode === 'dark' && <Moon className="h-5 w-5" />}
                {themeMode === 'system' && <LaptopIcon className="h-5 w-5" />}
              </motion.div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
              <LaptopIcon className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
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
