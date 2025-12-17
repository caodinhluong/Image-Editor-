import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskType, TaskStats, TaskFilter, TaskInput } from '../types/task';

interface CreateTaskParams {
  type: TaskType;
  toolId: string;
  toolName: string;
  toolNameVi: string;
  stationId: string;
  stationName: string;
  stationIcon: string;
  stationColor: string;
  input: TaskInput;
  prompt?: string;
  creditCost: number;
  estimatedTime: number;
}

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  
  // Actions
  createTask: (params: CreateTaskParams) => Task;
  cancelTask: (taskId: string) => void;
  retryTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  
  // Filters
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  filteredTasks: Task[];
  
  // Active processing
  activeTasksCount: number;
  maxConcurrentTasks: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Generate unique ID
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const maxConcurrentTasks = 3;
  const processingIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Calculate stats
  const stats: TaskStats = {
    total: tasks.length,
    queued: tasks.filter(t => t.status === 'queued').length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    totalCreditsUsed: tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.creditCost, 0),
  };

  const activeTasksCount = stats.processing;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter.status?.length && !filter.status.includes(task.status)) return false;
    if (filter.type?.length && !filter.type.includes(task.type)) return false;
    if (filter.dateRange) {
      const taskDate = new Date(task.createdAt);
      if (taskDate < filter.dateRange.start || taskDate > filter.dateRange.end) return false;
    }
    return true;
  });


  // Simulate task processing
  const simulateProcessing = useCallback((taskId: string) => {
    const interval = setInterval(() => {
      setTasks(prev => {
        const taskIndex = prev.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
          clearInterval(interval);
          processingIntervals.current.delete(taskId);
          return prev;
        }

        const task = prev[taskIndex];
        if (task.status !== 'processing') {
          clearInterval(interval);
          processingIntervals.current.delete(taskId);
          return prev;
        }

        const newElapsed = task.elapsedTime + 1;
        const newProgress = Math.min(99, (newElapsed / task.estimatedTime) * 100);

        // Check if completed
        if (newElapsed >= task.estimatedTime) {
          clearInterval(interval);
          processingIntervals.current.delete(taskId);
          
          // Simulate success/failure (90% success rate)
          const isSuccess = Math.random() > 0.1;
          
          const updated = [...prev];
          updated[taskIndex] = {
            ...task,
            status: isSuccess ? 'completed' : 'failed',
            progress: isSuccess ? 100 : task.progress,
            elapsedTime: newElapsed,
            completedAt: new Date(),
            output: isSuccess ? {
              type: task.type === 'video' ? 'video' : 'image',
              url: task.input.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
              thumbnail: task.input.thumbnail || task.input.url,
            } : undefined,
            error: isSuccess ? undefined : 'Processing failed. Please try again.',
          };
          return updated;
        }

        const updated = [...prev];
        updated[taskIndex] = {
          ...task,
          progress: newProgress,
          elapsedTime: newElapsed,
        };
        return updated;
      });
    }, 1000);

    processingIntervals.current.set(taskId, interval);
  }, []);

  // Start queued tasks when slots available
  useEffect(() => {
    const processingCount = tasks.filter(t => t.status === 'processing').length;
    const availableSlots = maxConcurrentTasks - processingCount;
    
    if (availableSlots > 0) {
      const queuedTasks = tasks
        .filter(t => t.status === 'queued')
        .sort((a, b) => {
          // Priority order: high > normal > low
          const priorityOrder = { high: 0, normal: 1, low: 2 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        })
        .slice(0, availableSlots);

      if (queuedTasks.length > 0) {
        setTasks(prev => prev.map(task => {
          if (queuedTasks.find(q => q.id === task.id)) {
            return { ...task, status: 'processing' as TaskStatus, startedAt: new Date() };
          }
          return task;
        }));

        queuedTasks.forEach(task => {
          simulateProcessing(task.id);
        });
      }
    }
  }, [tasks, simulateProcessing]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      processingIntervals.current.forEach(interval => clearInterval(interval));
    };
  }, []);

  const createTask = useCallback((params: CreateTaskParams): Task => {
    const newTask: Task = {
      id: generateId(),
      type: params.type,
      status: 'queued',
      priority: 'normal',
      toolId: params.toolId,
      toolName: params.toolName,
      toolNameVi: params.toolNameVi,
      stationId: params.stationId,
      stationName: params.stationName,
      stationIcon: params.stationIcon,
      stationColor: params.stationColor,
      input: params.input,
      prompt: params.prompt,
      progress: 0,
      estimatedTime: params.estimatedTime,
      elapsedTime: 0,
      creditCost: params.creditCost,
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3,
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const cancelTask = useCallback((taskId: string) => {
    const interval = processingIntervals.current.get(taskId);
    if (interval) {
      clearInterval(interval);
      processingIntervals.current.delete(taskId);
    }

    setTasks(prev => prev.map(task => 
      task.id === taskId && (task.status === 'queued' || task.status === 'processing')
        ? { ...task, status: 'cancelled' as TaskStatus }
        : task
    ));
  }, []);

  const retryTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && (task.status === 'failed' || task.status === 'cancelled')) {
        return {
          ...task,
          status: 'queued' as TaskStatus,
          progress: 0,
          elapsedTime: 0,
          error: undefined,
          retryCount: task.retryCount + 1,
        };
      }
      return task;
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    const interval = processingIntervals.current.get(taskId);
    if (interval) {
      clearInterval(interval);
      processingIntervals.current.delete(taskId);
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => t.status !== 'completed'));
  }, []);

  const clearAll = useCallback(() => {
    processingIntervals.current.forEach(interval => clearInterval(interval));
    processingIntervals.current.clear();
    setTasks([]);
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      stats,
      createTask,
      cancelTask,
      retryTask,
      deleteTask,
      clearCompleted,
      clearAll,
      filter,
      setFilter,
      filteredTasks,
      activeTasksCount,
      maxConcurrentTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
