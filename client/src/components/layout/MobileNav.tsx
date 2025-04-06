import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, Library, Settings } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playbook", href: "/playbook", icon: BookOpen },
    { name: "Library", href: "/library", icon: Library },
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-gray-700 flex justify-around">
      {navigation.map((item) => (
        <Link key={item.name} href={item.href}>
          <a 
            className={`flex flex-col items-center py-2 px-4 ${
              location === item.href ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
