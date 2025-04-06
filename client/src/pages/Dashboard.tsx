import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import StatsCard from "@/components/dashboard/StatsCard";
import TaskItem from "@/components/dashboard/TaskItem";
import ActivityItem from "@/components/dashboard/ActivityItem";
import StaffTable from "@/components/dashboard/StaffTable";
import HeroSection from "@/components/layout/HeroSection";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Star,
  Plus,
  Download,
  DollarSign,
  UserIcon,
  TrendingUp,
} from "lucide-react";
import { Task, Log, User } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RestaurantKitchenSVG } from "@/assets";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');
  
  // Default to restaurant ID 1 for the demo
  const restaurantId = user?.restaurantId || 1;
  
  // Fetch tasks for the current restaurant
  const { 
    data: tasks = [], 
    isLoading: isLoadingTasks 
  } = useQuery<Task[]>({ 
    queryKey: ['/api/restaurants', restaurantId, 'tasks'] 
  });
  
  // Fetch activity logs for the current restaurant
  const { 
    data: logs = [], 
    isLoading: isLoadingLogs 
  } = useQuery<Log[]>({ 
    queryKey: ['/api/restaurants', restaurantId, 'logs'] 
  });
  
  // Fetch staff members for the current restaurant
  const { 
    data: staff = [], 
    isLoading: isLoadingStaff 
  } = useQuery<User[]>({ 
    queryKey: ['/api/restaurants', restaurantId, 'users'] 
  });
  
  const handleStaffDetailsClick = (userId: number) => {
    toast({
      title: "Staff Details",
      description: `Viewing details for staff member ID: ${userId}`,
    });
  };
  
  const handleAddTask = () => {
    toast({
      title: "Add Task",
      description: "Task creation form would open here",
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <div className="mb-8">
        {/* Hero Section with overlaid cards */}
        <HeroSection 
          title="Kitchen Dashboard"
          subtitle="Today's performance metrics at a glance"
          image="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1280"
        >
          {/* Overlay Cards */}
          <div className="flex flex-wrap gap-4 w-full justify-center">
            <StatsCard 
              value="65%"
              label="Prime Cost"
              icon={<DollarSign className="h-6 w-6" />}
              iconColor="text-green-400"
              bgColor="bg-card/90"
              delay={0.1}
            />
            <StatsCard 
              value="24%"
              label="Labor"
              icon={<UserIcon className="h-6 w-6" />}
              iconColor="text-blue-400"
              bgColor="bg-card/90"
              delay={0.2}
            />
            <StatsCard 
              value="12k"
              label="Sales"
              icon={<TrendingUp className="h-6 w-6" />}
              iconColor="text-purple-400"
              bgColor="bg-card/90"
              delay={0.3}
            />
          </div>
        </HeroSection>
      </div>

      <div className="flex items-center justify-between mt-16">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex space-x-2">
          <Button 
            size="sm"
            variant={timeFilter === 'today' ? 'default' : 'secondary'}
            className={timeFilter === 'today' ? '' : 'bg-surface-dark hover:bg-gray-700'}
            onClick={() => setTimeFilter('today')}
          >
            Today
          </Button>
          <Button 
            size="sm"
            variant={timeFilter === 'week' ? 'default' : 'secondary'}
            className={timeFilter === 'week' ? '' : 'bg-surface-dark hover:bg-gray-700'}
            onClick={() => setTimeFilter('week')}
          >
            This Week
          </Button>
          <Button 
            size="sm"
            variant={timeFilter === 'month' ? 'default' : 'secondary'}
            className={timeFilter === 'month' ? '' : 'bg-surface-dark hover:bg-gray-700'}
            onClick={() => setTimeFilter('month')}
          >
            This Month
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Staff"
          value={`${staff.length}/15`}
          change={{ value: "2 more", positive: true, text: "from yesterday" }}
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-blue-500"
          iconColor="text-primary"
        />
        
        <StatCard 
          title="Tasks Completed"
          value={`${tasks.filter(t => t.status === 'completed').length}/${tasks.length}`}
          change={{ value: "80%", positive: true, text: "completion rate" }}
          icon={<CheckSquare className="h-5 w-5" />}
          iconBgColor="bg-green-500"
          iconColor="text-secondary"
        />
        
        <StatCard 
          title="Open Issues"
          value="3"
          change={{ value: "1 new", positive: false, text: "since yesterday" }}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBgColor="bg-red-500"
          iconColor="text-red-500"
        />
        
        <StatCard 
          title="Staff Satisfaction"
          value="4.2/5.0"
          change={{ value: "0.3", positive: true, text: "from last month" }}
          icon={<Star className="h-5 w-5" />}
          iconBgColor="bg-amber-500"
          iconColor="text-amber-500"
        />
      </div>
      
      {/* Task Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Tasks */}
        <div className="col-span-2 bg-surface-dark rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-medium">Today's Tasks</h3>
            <Button variant="link" className="text-primary hover:text-blue-400 p-0">
              View All
            </Button>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {isLoadingTasks ? (
                <div className="text-center p-4">Loading tasks...</div>
              ) : tasks.length > 0 ? (
                tasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center p-4 text-gray-400">No tasks available</div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4 w-full py-2 border border-dashed border-gray-600 rounded-md text-gray-400 hover:bg-gray-800"
              onClick={handleAddTask}
            >
              <Plus className="h-5 w-5 mr-1" />
              Add New Task
            </Button>
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="bg-surface-dark rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-medium">Recent Activity</h3>
            <Button variant="link" className="text-primary hover:text-blue-400 p-0">
              View All
            </Button>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {isLoadingLogs ? (
                <div className="text-center p-4">Loading activity...</div>
              ) : logs.length > 0 ? (
                logs.slice(0, 4).map((log, index) => (
                  <ActivityItem 
                    key={log.id} 
                    log={log} 
                    isLast={index === logs.slice(0, 4).length - 1} 
                  />
                ))
              ) : (
                <div className="text-center p-4 text-gray-400">No activity logs available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Staff Overview Section */}
      <div className="bg-surface-dark rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-medium">Staff Overview</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" className="bg-surface-dark hover:bg-gray-700">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm">Manage</Button>
          </div>
        </div>
        
        {isLoadingStaff ? (
          <div className="text-center p-8">Loading staff...</div>
        ) : staff.length > 0 ? (
          <StaffTable staff={staff} onViewDetails={handleStaffDetailsClick} />
        ) : (
          <div className="text-center p-8 text-gray-400">No staff members available</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
