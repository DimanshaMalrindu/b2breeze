import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    Grid3X3,
    List,
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    PlayCircle,
    AlertCircle,
    ArrowLeft,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task, TaskPlannerState } from '@/types/task';
import {
    getTasks,
    initializeSampleTasks,
    searchTasks,
    filterTasks,
    sortTasks,
    toggleTaskStatus,
    deleteTask,
    getPriorityColor,
    getStatusColor,
    isOverdue,
    formatDeadline
} from '@/lib/task-utils';

interface TaskPlannerPageProps {
    onNavigate: (page: string) => void;
}

interface TaskCardProps {
    task: Task;
    viewMode: 'list' | 'kanban';
    onToggleStatus: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, viewMode, onToggleStatus, onEdit, onDelete }) => {
    const overdue = isOverdue(task);

    const getStatusIcon = (status: Task['status']) => {
        switch (status) {
            case 'todo':
                return <Circle className="w-4 h-4" />;
            case 'in-progress':
                return <PlayCircle className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    const getPriorityIcon = (priority: Task['priority']) => {
        if (priority === 'urgent' || priority === 'high') {
            return <AlertCircle className="w-4 h-4" />;
        }
        return null;
    };

    if (viewMode === 'list') {
        return (
            <Card className={`hover:shadow-md transition-shadow ${overdue ? 'border-red-200' : ''}`}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onToggleStatus(task.id)}
                            className={`flex-shrink-0 ${getStatusColor(task.status)} p-2 rounded-full`}
                        >
                            {getStatusIcon(task.status)}
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold text-foreground truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                    }`}>
                                    {task.title}
                                </h3>
                                {getPriorityIcon(task.priority)}
                                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </Badge>
                                <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                                    {task.status.replace('-', ' ')}
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {task.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span className={overdue ? 'text-red-600 font-medium' : ''}>
                                        {formatDeadline(task.deadline)}
                                    </span>
                                </div>
                                {task.tags.length > 0 && (
                                    <div className="flex gap-1">
                                        {task.tags.slice(0, 2).map((tag, index) => (
                                            <span key={index} className="bg-secondary px-2 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                        {task.tags.length > 2 && (
                                            <span className="bg-secondary px-2 py-1 rounded-full">
                                                +{task.tags.length - 2}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(task)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(task.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${overdue ? 'border-red-200' : ''
            }`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onToggleStatus(task.id)}
                            className={`flex-shrink-0 ${getStatusColor(task.status)} p-1 rounded-full`}
                        >
                            {getStatusIcon(task.status)}
                        </button>
                        <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </Badge>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>

                <CardTitle className={`text-lg ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                    }`}>
                    {task.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {task.description}
                </p>

                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className={overdue ? 'text-red-600 font-medium' : ''}>
                        {formatDeadline(task.deadline)}
                    </span>
                </div>

                {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEdit(task)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const TaskPlannerPage: React.FC<TaskPlannerPageProps> = ({ onNavigate }) => {
    const [state, setState] = useState<TaskPlannerState>({
        tasks: [],
        viewMode: 'list',
        filter: {},
        sort: { field: 'deadline', order: 'asc' },
        searchQuery: ''
    });

    useEffect(() => {
        initializeSampleTasks();
        loadTasks();
    }, []);

    const loadTasks = () => {
        const tasks = getTasks();
        setState(prev => ({ ...prev, tasks }));
    };

    const filteredAndSortedTasks = useMemo(() => {
        let tasks = searchTasks(state.tasks, state.searchQuery);
        tasks = filterTasks(tasks, state.filter);
        tasks = sortTasks(tasks, state.sort);
        return tasks;
    }, [state.tasks, state.searchQuery, state.filter, state.sort]);

    const handleToggleStatus = (taskId: string) => {
        toggleTaskStatus(taskId);
        loadTasks();
    };

    const handleEditTask = (task: Task) => {
        alert(`Edit task feature coming soon! Task: ${task.title}`);
    };

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            // deleteTask(taskId);
            // loadTasks();
            alert('Delete task feature coming soon!');
        }
    };

    const handleBackToHome = () => {
        onNavigate('home');
    };

    const taskStats = useMemo(() => {
        const total = state.tasks.length;
        const completed = state.tasks.filter(t => t.status === 'completed').length;
        const inProgress = state.tasks.filter(t => t.status === 'in-progress').length;
        const overdue = state.tasks.filter(t => isOverdue(t)).length;

        return { total, completed, inProgress, overdue };
    }, [state.tasks]);

    const kanbanColumns = useMemo(() => {
        const columns = {
            todo: filteredAndSortedTasks.filter(t => t.status === 'todo'),
            'in-progress': filteredAndSortedTasks.filter(t => t.status === 'in-progress'),
            completed: filteredAndSortedTasks.filter(t => t.status === 'completed')
        };
        return columns;
    }, [filteredAndSortedTasks]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Task Planner</h1>
                        <p className="text-muted-foreground">
                            Stay organized with your business tasks and deadlines - B2BBreeze keeps it smooth
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => alert('Add Task feature coming soon!')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <List className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{taskStats.total}</p>
                                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-100">
                                    <PlayCircle className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{taskStats.inProgress}</p>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{taskStats.completed}</p>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-100">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{taskStats.overdue}</p>
                                    <p className="text-sm text-muted-foreground">Overdue</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={state.searchQuery}
                                    onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <Button
                                    variant={!state.filter.status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setState(prev => ({ ...prev, filter: { ...prev.filter, status: undefined } }))}
                                >
                                    All Status
                                </Button>
                                <Button
                                    variant={state.filter.status?.includes('todo') ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setState(prev => ({
                                        ...prev,
                                        filter: { ...prev.filter, status: ['todo'] }
                                    }))}
                                >
                                    To Do
                                </Button>
                                <Button
                                    variant={state.filter.status?.includes('in-progress') ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setState(prev => ({
                                        ...prev,
                                        filter: { ...prev.filter, status: ['in-progress'] }
                                    }))}
                                >
                                    In Progress
                                </Button>
                                <Button
                                    variant={state.filter.status?.includes('completed') ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setState(prev => ({
                                        ...prev,
                                        filter: { ...prev.filter, status: ['completed'] }
                                    }))}
                                >
                                    Completed
                                </Button>
                            </div>

                            {/* View Mode */}
                            <div className="flex gap-1 border rounded-md p-1">
                                <Button
                                    size="sm"
                                    variant={state.viewMode === 'list' ? 'default' : 'ghost'}
                                    onClick={() => setState(prev => ({ ...prev, viewMode: 'list' }))}
                                    className="px-2"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant={state.viewMode === 'kanban' ? 'default' : 'ghost'}
                                    onClick={() => setState(prev => ({ ...prev, viewMode: 'kanban' }))}
                                    className="px-2"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks Display */}
                {filteredAndSortedTasks.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                            <p className="text-muted-foreground mb-4">
                                {state.searchQuery || Object.keys(state.filter).length > 0
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Start by adding your first task'
                                }
                            </p>
                            <Button onClick={() => alert('Add Task feature coming soon!')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Task
                            </Button>
                        </CardContent>
                    </Card>
                ) : state.viewMode === 'list' ? (
                    <div className="space-y-4">
                        {filteredAndSortedTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                viewMode="list"
                                onToggleStatus={handleToggleStatus}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* To Do Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Circle className="w-5 h-5 text-gray-500" />
                                <h3 className="font-semibold text-lg">To Do ({kanbanColumns.todo.length})</h3>
                            </div>
                            <div className="space-y-4">
                                {kanbanColumns.todo.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        viewMode="kanban"
                                        onToggleStatus={handleToggleStatus}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <PlayCircle className="w-5 h-5 text-blue-500" />
                                <h3 className="font-semibold text-lg">In Progress ({kanbanColumns['in-progress'].length})</h3>
                            </div>
                            <div className="space-y-4">
                                {kanbanColumns['in-progress'].map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        viewMode="kanban"
                                        onToggleStatus={handleToggleStatus}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Completed Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <h3 className="font-semibold text-lg">Completed ({kanbanColumns.completed.length})</h3>
                            </div>
                            <div className="space-y-4">
                                {kanbanColumns.completed.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        viewMode="kanban"
                                        onToggleStatus={handleToggleStatus}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
