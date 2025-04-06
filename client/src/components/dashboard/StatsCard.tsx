import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const StatsCard = ({ 
  value, 
  label, 
  icon, 
  iconColor = "text-primary", 
  bgColor = "bg-card",
  textColor = "text-card-foreground",
  className 
}: StatsCardProps) => {
  return (
    <div className={cn(
      "flex flex-col rounded-lg shadow-lg p-6 min-w-[120px] w-full max-w-[180px]",
      bgColor,
      textColor,
      className
    )}>
      <div className={cn("mb-4", iconColor)}>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
};

export default StatsCard;