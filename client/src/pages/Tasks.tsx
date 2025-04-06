import { useState, useEffect } from 'react';
import { Task } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import TaskItem from '@/components/dashboard/TaskItem';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/tasks/assigned', user?.id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/tasks/assigned/${user?.id}`);
      return await res.json() as Task[];
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error loading your tasks. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground mt-2">Manage your assigned tasks and track your progress</p>
      </div>

      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">You have no assigned tasks right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}