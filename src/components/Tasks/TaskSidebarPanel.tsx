import React, { useState } from 'react';
import {
  X, Clock, CheckCircle2, AlertCircle, Loader2, Trash2, RefreshCw,
  Image as ImageIcon, Video, Zap, Eye, Download, ChevronDown, ChevronUp,
  Play, Pause, XCircle, ExternalLink, Layers, TrendingUp, Wand2
} from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Task, TaskStatus, TaskType } from '../../types/task';

interface TaskSidebarPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filterType?: TaskType[]; // Filter to show only specific types (e.g., video tasks)
}

export const TaskSidebarPanel: React.FC<TaskSidebarPanelProps> = ({
  isOpen,
  onToggle,
  filterType,
}) => {
  const { language } = useLanguage();
  const { tasks, stats, cancelTask, retryTask, deleteTask } = useTask();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Filter tasks based on type if provided
  const filteredTasks = filterType 
    ? tasks.filter(t => filterType.includes(t.type))
    : tasks;

  // Sort: processing first, then queued, then completed/failed
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const order: Record<TaskStatus, number> = {
      processing: 0,
      queued: 1,
      completed: 2,
      failed: 3,
      cancelled: 4,
    };
    return order[a.status] - order[b.status];
  });

  const t = {
    vi: {
      title: 'Hàng đợi',
      processing: 'Đang xử lý',
      queued: 'Đang chờ',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      cancelled: 'Đã hủy',
      noTasks: 'Chưa có tác vụ',
      noTasksDesc: 'Tác vụ sẽ hiển thị ở đây',
      cancel: 'Hủy',
      retry: 'Thử lại',
      delete: 'Xóa',
      view: 'Xem',
      remaining: 'còn lại',
      credits: 'credits',
      expand: 'Mở rộng',
      collapse: 'Thu gọn',
      activeJobs: 'công việc đang chạy',
      inQueue: 'trong hàng đợi',
    },
    en: {
      title: 'Queue',
      processing: 'Processing',
      queued: 'Queued',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
      noTasks: 'No tasks yet',
      noTasksDesc: 'Tasks will appear here',
      cancel: 'Cancel',
      retry: 'Retry',
      delete: 'Delete',
      view: 'View',
      remaining: 'remaining',
      credits: 'credits',
      expand: 'Expand',
      collapse: 'Collapse',
      activeJobs: 'active jobs',
      inQueue: 'in queue',
    }
  };
  const trans = t[language] || t.en;

  const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; bgColor: string; borderColor: string; label: string }> = {
    processing: { icon: Loader2, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', label: trans.processing },
    queued: { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', label: trans.queued },
    completed: { icon: CheckCircle2, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', label: trans.completed },
    failed: { icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', label: trans.failed },
    cancelled: { icon: XCircle, color: 'text-zinc-400', bgColor: 'bg-zinc-500/10', borderColor: 'border-zinc-500/30', label: trans.cancelled },
  };

  const typeConfig: Record<TaskType, { icon: React.ElementType; label: string }> = {
    image: { icon: ImageIcon, label: 'Image' },
    video: { icon: Video, label: 'Video' },
    upscale: { icon: TrendingUp, label: 'Upscale' },
    'face-swap': { icon: Wand2, label: 'Face Swap' },
    'background-removal': { icon: Wand2, label: 'BG Remove' },
    'style-transfer': { icon: Wand2, label: 'Style' },
  };

  const processingCount = filteredTasks.filter(t => t.status === 'processing').length;
  const queuedCount = filteredTasks.filter(t => t.status === 'queued').length;


  const renderTaskItem = (task: Task) => {
    const statusInfo = statusConfig[task.status];
    const typeInfo = typeConfig[task.type];
    const StatusIcon = statusInfo.icon;
    const TypeIcon = typeInfo.icon;
    const isExpanded = expandedTaskId === task.id;

    return (
      <div
        key={task.id}
        className={`group rounded-xl border transition-all duration-300 overflow-hidden animate-slide-in-right ${statusInfo.borderColor} ${
          task.status === 'processing' ? 'bg-blue-500/5 animate-glow-pulse' : 'bg-zinc-800/30 hover:bg-zinc-800/50 hover-scale'
        }`}
      >
        {/* Main Row */}
        <div className="p-3">
          <div className="flex items-start gap-3">
            {/* Thumbnail with status overlay */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
              {task.input.thumbnail || task.input.url ? (
                <img src={task.input.thumbnail || task.input.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
                  <TypeIcon size={18} className="text-zinc-500" />
                </div>
              )}
              
              {/* Status overlay */}
              <div className={`absolute inset-0 flex items-center justify-center ${
                task.status === 'processing' ? 'bg-black/50' : 
                task.status === 'completed' ? 'bg-green-500/20' : 
                task.status === 'failed' ? 'bg-red-500/20' : ''
              }`}>
                {task.status === 'processing' && (
                  <div className="relative">
                    <svg className="w-8 h-8 -rotate-90">
                      <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                      <circle 
                        cx="16" cy="16" r="12" fill="none" stroke="url(#gradient)" strokeWidth="3"
                        strokeDasharray={`${task.progress * 0.75} 100`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                      {Math.round(task.progress)}%
                    </span>
                  </div>
                )}
                {task.status === 'completed' && (
                  <CheckCircle2 size={20} className="text-green-400" />
                )}
                {task.status === 'failed' && (
                  <AlertCircle size={20} className="text-red-400" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-sm text-white truncate">
                  {language === 'vi' ? task.toolNameVi : task.toolName}
                </span>
              </div>
              
              {/* Progress info for processing */}
              {task.status === 'processing' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400 font-medium">{Math.round(task.progress)}%</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">{task.estimatedTime - task.elapsedTime}s {trans.remaining}</span>
                </div>
              )}

              {/* Status badge for non-processing */}
              {task.status !== 'processing' && (
                <span className={`inline-flex items-center gap-1 text-xs ${statusInfo.color}`}>
                  <StatusIcon size={10} />
                  {statusInfo.label}
                </span>
              )}

              {/* Prompt preview */}
              {task.prompt && (
                <p className="text-[11px] text-zinc-500 truncate mt-1">{task.prompt}</p>
              )}
            </div>

            {/* Expand/Actions toggle */}
            <button
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
              className="p-1 rounded-md hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Progress bar for processing */}
          {task.status === 'processing' && (
            <div className="mt-3 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Expanded Actions */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-zinc-700/50">
            <div className="flex items-center gap-2">
              {task.status === 'completed' && task.output && (
                <>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors">
                    <Eye size={12} />
                    {trans.view}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium transition-colors">
                    <Download size={12} />
                    Download
                  </button>
                </>
              )}
              {(task.status === 'queued' || task.status === 'processing') && (
                <button
                  onClick={() => cancelTask(task.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                >
                  <XCircle size={12} />
                  {trans.cancel}
                </button>
              )}
              {(task.status === 'failed' || task.status === 'cancelled') && (
                <button
                  onClick={() => retryTask(task.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors"
                >
                  <RefreshCw size={12} />
                  {trans.retry}
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            {/* Credits info */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-700/30 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-purple-400" />
                {task.creditCost} {trans.credits}
              </span>
              <span>{task.estimatedTime}s est.</span>
            </div>
          </div>
        )}
      </div>
    );
  };


  // Collapsed state - just show a floating button
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[99998] flex items-center gap-2 px-3 py-2 bg-zinc-800/90 hover:bg-zinc-700 backdrop-blur-sm border border-zinc-700 rounded-xl shadow-xl transition-all hover:scale-105"
      >
        <div className="relative">
          <Layers size={18} className="text-purple-400" />
          {processingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-left">
          <p className="text-xs font-medium text-white">{trans.title}</p>
          <p className="text-[10px] text-zinc-400">
            {processingCount > 0 ? `${processingCount} ${trans.activeJobs}` : `${queuedCount} ${trans.inQueue}`}
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="w-80 flex flex-col bg-zinc-900/95 backdrop-blur-sm border-l border-zinc-800 h-full animate-slide-in-right">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-zinc-800 animate-fade-in animate-delay-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Layers size={18} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">{trans.title}</h3>
              <p className="text-[10px] text-zinc-500">
                {processingCount > 0 && `${processingCount} ${trans.activeJobs}`}
                {processingCount > 0 && queuedCount > 0 && ' • '}
                {queuedCount > 0 && `${queuedCount} ${trans.inQueue}`}
                {processingCount === 0 && queuedCount === 0 && trans.noTasks}
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center animate-zoom-in animate-delay-150 hover-scale cursor-default">
            <p className="text-lg font-bold text-blue-400">{processingCount}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{trans.processing}</p>
          </div>
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center animate-zoom-in animate-delay-200 hover-scale cursor-default">
            <p className="text-lg font-bold text-yellow-400">{queuedCount}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{trans.queued}</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center animate-zoom-in animate-delay-250 hover-scale cursor-default">
            <p className="text-lg font-bold text-green-400">{filteredTasks.filter(t => t.status === 'completed').length}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{trans.completed}</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-3">
              <Video size={24} className="text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-400">{trans.noTasks}</p>
            <p className="text-xs text-zinc-600 mt-1">{trans.noTasksDesc}</p>
          </div>
        ) : (
          sortedTasks.map(renderTaskItem)
        )}
      </div>

      {/* Footer - Total Credits */}
      {sortedTasks.length > 0 && (
        <div className="flex-shrink-0 p-3 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Total credits used</span>
            <span className="flex items-center gap-1 font-medium text-purple-400">
              <Zap size={12} />
              {filteredTasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.creditCost, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSidebarPanel;
