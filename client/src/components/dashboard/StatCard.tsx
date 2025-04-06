import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    positive: boolean;
    text: string;
  };
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const StatCard = ({ title, value, change, icon, iconBgColor, iconColor }: StatCardProps) => {
  return (
    <div className="bg-surface-dark p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className={`${iconBgColor} bg-opacity-20 p-2 rounded-md`}>
          <div className={`h-5 w-5 ${iconColor}`}>{icon}</div>
        </div>
      </div>
      
      <p className="text-2xl font-semibold mt-2">{value}</p>
      
      <div className="flex items-center mt-2 text-sm">
        <span className={change.positive ? 'text-green-500 flex items-center' : 'text-red-500 flex items-center'}>
          {change.positive ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          {change.value}
        </span>
        <span className="text-gray-400 ml-2">{change.text}</span>
      </div>
    </div>
  );
};

export default StatCard;
