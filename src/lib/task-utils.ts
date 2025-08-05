import type { Task, TaskFilter, TaskSort } from '@/types/task';

const TASKS_STORAGE_KEY = 'b2breeze_tasks';

// Sample task data
export const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Follow up with Mr. Ivan on quotation',
    description: 'Send follow-up email regarding the tea export quotation submitted last week. Discuss pricing and delivery terms.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    priority: 'high',
    status: 'todo',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['follow-up', 'quotation', 'client'],
    reminders: [],
    order: 1
  },
  {
    id: '2',
    title: 'Send updated price list to Dubai lead',
    description: 'Prepare and send the latest price list with seasonal discounts to the potential client in Dubai.',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    priority: 'urgent',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    tags: ['price-list', 'dubai', 'lead'],
    reminders: [],
    order: 2
  },
  {
    id: '3',
    title: 'Prepare samples for German distributor',
    description: 'Package and ship tea samples to the German distributor for quality evaluation.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: 'medium',
    status: 'todo',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['samples', 'germany', 'distributor'],
    reminders: [],
    order: 3
  },
  {
    id: '4',
    title: 'Update website with new product catalog',
    description: 'Upload new product images and descriptions to the company website.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: 'low',
    status: 'todo',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['website', 'catalog', 'marketing'],
    reminders: [],
    order: 4
  },
  {
    id: '5',
    title: 'Review contract with supplier',
    description: 'Review and negotiate terms with the new tea supplier from Assam.',
    deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day overdue
    priority: 'high',
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['contract', 'supplier', 'legal'],
    reminders: [],
    order: 5
  }
];

// Storage functions
export const getTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored).map((task: any) => ({
      ...task,
      deadline: new Date(task.deadline),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      reminders: task.reminders.map((reminder: any) => ({
        ...reminder,
        triggerAt: new Date(reminder.triggerAt)
      }))
    })) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Initialize sample data
export const initializeSampleTasks = (): void => {
  const existingTasks = getTasks();
  if (existingTasks.length === 0) {
    saveTasks(SAMPLE_TASKS);
  }
};

// Search and filter functions
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.description.toLowerCase().includes(lowercaseQuery) ||
    task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  let filtered = tasks;

  if (filter.status && filter.status.length > 0) {
    filtered = filtered.filter(task => filter.status!.includes(task.status));
  }

  if (filter.priority && filter.priority.length > 0) {
    filtered = filtered.filter(task => filter.priority!.includes(task.priority));
  }

  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter(task =>
      filter.tags!.some(tag => task.tags.includes(tag))
    );
  }

  if (filter.dateRange) {
    filtered = filtered.filter(task =>
      task.deadline >= filter.dateRange!.start &&
      task.deadline <= filter.dateRange!.end
    );
  }

  return filtered;
};

export const sortTasks = (tasks: Task[], sort: TaskSort): Task[] => {
  return [...tasks].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sort.field) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'deadline':
        aValue = a.deadline;
        bValue = b.deadline;
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'createdAt':
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      case 'status':
        const statusOrder = { todo: 1, 'in-progress': 2, completed: 3 };
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Task management functions
export const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Task => {
  const existingTasks = getTasks();
  const maxOrder = existingTasks.length > 0 ? Math.max(...existingTasks.map(t => t.order)) : 0;
  
  return {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    order: maxOrder + 1
  };
};

export const updateTask = (taskId: string, updates: Partial<Task>): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task =>
    task.id === taskId
      ? { ...task, ...updates, updatedAt: new Date() }
      : task
  );
  saveTasks(updatedTasks);
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(updatedTasks);
};

export const toggleTaskStatus = (taskId: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  let newStatus: Task['status'];
  let completedAt: Date | undefined;

  switch (task.status) {
    case 'todo':
      newStatus = 'in-progress';
      break;
    case 'in-progress':
      newStatus = 'completed';
      completedAt = new Date();
      break;
    case 'completed':
      newStatus = 'todo';
      completedAt = undefined;
      break;
  }

  updateTask(taskId, { status: newStatus, completedAt });
};

export const reorderTasks = (tasks: Task[]): void => {
  const reorderedTasks = tasks.map((task, index) => ({
    ...task,
    order: index + 1,
    updatedAt: new Date()
  }));
  saveTasks(reorderedTasks);
};

// Priority and status helpers
export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

export const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
  }
};

export const isOverdue = (task: Task): boolean => {
  return task.status !== 'completed' && task.deadline < new Date();
};

export const formatDeadline = (deadline: Date): string => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return deadline.toLocaleDateString();
  }
};
