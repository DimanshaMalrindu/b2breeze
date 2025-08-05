export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags: string[];
  reminders: TaskReminder[];
  order: number;
}

export interface TaskReminder {
  id: string;
  type: 'email' | 'notification' | 'sms';
  triggerAt: Date;
  message?: string;
  sent: boolean;
}

export interface TaskFilter {
  status?: Task['status'][];
  priority?: Task['priority'][];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TaskSort {
  field: 'title' | 'deadline' | 'priority' | 'createdAt' | 'status';
  order: 'asc' | 'desc';
}

export interface TaskPlannerState {
  tasks: Task[];
  viewMode: 'list' | 'kanban';
  filter: TaskFilter;
  sort: TaskSort;
  searchQuery: string;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
