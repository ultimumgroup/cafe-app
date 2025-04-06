import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

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
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Mobile Menu (only shown when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div 
            className="bg-surface-dark w-64 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Content */}
            {/* This would be a mobile version of the sidebar */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;
