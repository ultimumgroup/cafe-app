import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, Library, Settings } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { useState } from "react";
import { SquareChevronDown } from "lucide-react";

interface SidebarProps {
  user: AuthUser | null;
}

const Sidebar = ({ user }: SidebarProps) => {
  const [location] = useLocation();
  const [restaurantName, setRestaurantName] = useState("Pasta Paradise");

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playbook", href: "/playbook", icon: BookOpen },
    { name: "Library", href: "/library", icon: Library },
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-dark border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white">Dishwasher's Guide</h1>
        <p className="text-sm text-gray-400">Restaurant Staff OS</p>
      </div>
      
      {user && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-medium">
                {user.username.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-xs text-gray-400">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <a 
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    location === item.href 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Restaurant Selector */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Current Restaurant</p>
            <p className="font-medium">{restaurantName}</p>
          </div>
          <button className="p-1 rounded-md hover:bg-gray-700">
            <SquareChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
