// Task Management Types for AI Generation Tasks

export type TaskType = 'image' | 'video' | 'upscale' | 'face-swap' | 'background-removal' | 'style-transfer';
export type TaskStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface TaskInput {
  type: 'image' | 'text' | 'video';
  url?: string;
  text?: string;
  thumbnail?: string;
}

export interface TaskOutput {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number; // For video in seconds
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  
  // Tool info
  toolId: string;
  toolName: string;
  toolNameVi: string;
  stationId: string;
  stationName: string;
  stationIcon: string;
  stationColor: string;
  
  // Input/Output
  input: TaskInput;
  output?: TaskOutput;
  prompt?: string;
  
  // Progress
  progress: number; // 0-100
  estimatedTime: number; // seconds
  elapsedTime: number; // seconds
  
  // Credits
  creditCost: number;
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Error handling
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface TaskFilter {
  status?: TaskStatus[];
  type?: TaskType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TaskStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  totalCreditsUsed: number;
}
