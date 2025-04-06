import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface StaffTableProps {
  staff: User[];
  onViewDetails: (userId: number) => void;
}

const StaffTable = ({ staff, onViewDetails }: StaffTableProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getRandomColor = (userId: number) => {
    const colors = ['blue-500', 'green-500', 'amber-500', 'red-500', 'purple-500', 'pink-500'];
    return colors[userId % colors.length];
  };
  
  const formatLastActivityTime = (user: User) => {
    // In a real app, this would come from the user's last activity timestamp
    const times = ['15 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago'];
    return times[user.id % times.length];
  };
  
  const getStatusBadge = (user: User) => {
    // In a real app, this would be determined by the user's actual status
    const isOnDuty = user.id % 3 !== 0; // Just for demonstration
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${
        isOnDuty 
          ? 'bg-green-500 bg-opacity-20 text-green-400' 
          : 'bg-gray-500 bg-opacity-20 text-gray-400'
      }`}>
        {isOnDuty ? 'On Duty' : 'Off Duty'}
      </span>
    );
  };
  
  const getTaskCompletion = (user: User) => {
    // In a real app, this would be calculated from actual task data
    const completedTasks = user.id % 3;
    const totalTasks = 2;
    const percentage = completedTasks / totalTasks * 100;
    
    return (
      <div>
        <div className="text-sm">{completedTasks}/{totalTasks} Completed</div>
        <div className="w-full h-1 mt-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tasks</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Activity</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface-dark divide-y divide-gray-700">
          {staff.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-${getRandomColor(user.id)} flex items-center justify-center text-white`}>
                    {getInitials(user.username)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTaskCompletion(user)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {formatLastActivityTime(user)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-blue-400 p-0"
                  onClick={() => onViewDetails(user.id)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
