import { Log } from "@shared/schema";

interface ActivityItemProps {
  log: Log;
  isLast?: boolean;
}

const ActivityItem = ({ log, isLast = false }: ActivityItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_created':
        return 'bg-primary';
      case 'task_completed':
        return 'bg-green-500';
      case 'schedule_update':
        return 'bg-amber-500';
      case 'issue_reported':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return 'New task assigned';
      case 'task_created':
        return 'New task created';
      case 'task_completed':
        return 'Task completed';
      case 'schedule_update':
        return 'Schedule update';
      case 'issue_reported':
        return 'Issue reported';
      case 'resource_uploaded':
        return 'Resource uploaded';
      case 'feedback_submitted':
        return 'Feedback submitted';
      default:
        return 'Activity logged';
    }
  };

  const getActivityDescription = (log: Log) => {
    const details = log.details as any;
    
    switch (log.type) {
      case 'task_assigned':
        return `${details?.taskName || 'A task'} assigned to ${details?.assignedTo || 'a staff member'}.`;
      case 'task_completed':
        return `${details?.taskName || 'A task'} was completed.`;
      case 'schedule_update':
        return `${details?.event || 'An event'} rescheduled to ${details?.time || 'a new time'}.`;
      case 'issue_reported':
        return `${details?.issue || 'An issue'} was reported.`;
      default:
        return details?.message || 'An activity was logged.';
    }
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className={`relative pl-6 ${isLast ? '' : 'pb-5 border-l border-gray-700'}`}>
      <div className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${getTypeColor(log.type)}`}></div>
      <div>
        <p className="font-medium">{getActivityTitle(log.type)}</p>
        <p className="text-sm text-gray-400 mt-1">{getActivityDescription(log)}</p>
        <p className="text-xs text-gray-500 mt-1">{getTimeSince(log.createdAt)}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
