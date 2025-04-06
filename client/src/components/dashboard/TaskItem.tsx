import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, TaskStatus } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [isCompleted, setIsCompleted] = useState(task.status === TaskStatus.COMPLETED);
  const { toast } = useToast();

  const getPriorityBadgeClasses = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      case 'medium':
        return 'bg-amber-500 bg-opacity-20 text-amber-400';
      case 'low':
        return 'bg-blue-500 bg-opacity-20 text-blue-400';
      default:
        return 'bg-green-500 bg-opacity-20 text-green-400';
    }
  };

  const toggleTaskCompletion = async () => {
    const newStatus = isCompleted ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    
    try {
      await apiRequest('PUT', `/api/tasks/${task.id}`, {
        status: newStatus
      });
      
      setIsCompleted(!isCompleted);
      queryClient.invalidateQueries({ queryKey: ['/api/restaurants', task.restaurantId, 'tasks'] });
      
      toast({
        title: isCompleted ? "Task marked as pending" : "Task completed",
        variant: isCompleted ? "default" : "default",
      });
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "An error occurred while updating the task status.",
        variant: "destructive",
      });
    }
  };

  const formatDueDate = (date: Date | null) => {
    if (!date) return 'No due date';
    
    const taskDate = new Date(date);
    const hours = taskDate.getHours();
    const minutes = taskDate.getMinutes();
    
    // Format to 12-hour clock with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <div className="flex items-center p-3 bg-gray-800 rounded-md">
      <Checkbox 
        checked={isCompleted} 
        onCheckedChange={toggleTaskCompletion} 
        className="h-5 w-5 rounded border-gray-600 text-primary focus:ring-primary"
      />
      
      <div className="ml-4 flex-1">
        <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </p>
        <p className="text-sm text-gray-400">
          {isCompleted 
            ? <span className="text-gray-500">Completed</span>
            : `Due: ${formatDueDate(task.dueDate)}`
          }
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs rounded-md ${
          isCompleted 
            ? 'bg-green-500 bg-opacity-20 text-green-400' 
            : getPriorityBadgeClasses(task.priority)
        }`}>
          {isCompleted ? 'Completed' : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        
        <button className="p-1 hover:bg-gray-700 rounded">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
