import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  const [showMobileNav, setShowMobileNav] = useState(true);
  
  // Decide whether to show mobile navigation based on route
  useEffect(() => {
    // Only hide on specific routes like login or register
    const routesToHideNav = ['/auth', '/login', '/register'];
    setShowMobileNav(!routesToHideNav.includes(location));
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar user={user} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav Bar */}
        <TopBar 
          toggleMobileMenu={toggleMobileMenu} 
          user={user}
        />
        
        {/* Content Area - Add bottom padding on mobile to account for bottom nav */}
        <div className={`flex-1 overflow-auto p-4 md:p-6 space-y-6 ${showMobileNav ? 'pb-20 md:pb-6' : 'pb-4 md:pb-6'}`}>
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation - Only show on appropriate routes */}
      {showMobileNav && <MobileNav />}
      
      {/* Mobile Menu (only shown when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div 
            className="bg-card w-72 h-full overflow-y-auto shadow-xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
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
            
            {/* Mobile Menu Content - Show the same links as sidebar */}
            <Sidebar user={user} mobile={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;
