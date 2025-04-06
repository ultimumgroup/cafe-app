import { Bell, Moon, Menu } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  toggleMobileMenu: () => void;
  user: AuthUser | null;
}

const TopBar = ({ toggleMobileMenu, user }: TopBarProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-surface-dark border-b border-gray-700 p-4 flex items-center justify-between md:justify-end">
      {/* Mobile Menu Toggle */}
      <button 
        className="p-1 rounded-md hover:bg-gray-700 md:hidden"
        onClick={toggleMobileMenu}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Mobile Title */}
      <h1 className="text-lg font-semibold md:hidden">Dashboard</h1>
      
      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-1 rounded-md hover:bg-gray-700 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* Dark Mode Toggle */}
        <button className="p-1 rounded-md hover:bg-gray-700">
          <Moon className="h-6 w-6" />
        </button>
        
        {/* User Menu (Mobile) */}
        {user && (
          <div className="md:hidden">
            <button className="p-1 rounded-md hover:bg-gray-700">
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
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
