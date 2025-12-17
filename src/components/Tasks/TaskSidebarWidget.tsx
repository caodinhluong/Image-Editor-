import React from 'react';
import { Loader2, CheckCircle2, Clock, AlertCircle, ChevronRight, Zap } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Task } from '../../types/task';

interface TaskSidebarWidgetProps {
  onClick: () => void;
  isCollapsed?: boolean;
}

export const TaskSidebarWidget: React.FC<TaskSidebarWidgetProps> = ({ onClick, isCollapsed }) => {
  const { language } = useLanguage();
  const { tasks, stats, activeTasksCount, maxConcurrentTasks } = useTask();

  // Get the most recent active tasks (processing first, then queued)
  const activeTasks = tasks
    .filter(t => t.status === 'processing' || t.status === 'queued')
    .slice(0, 3);

  const hasActiveTasks = activeTasks.length > 0;

  if (isCollapsed) {
    return (
      <button
        onClick={onClick}
        className={`relative w-full p-3 rounded-lg transition-colors ${
          hasActiveTasks 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20' 
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
        title={language === 'vi' ? 'Quản lý tác vụ' : 'Task Manager'}
      >
        <div className="relative">
          {hasActiveTasks ? (
            <Loader2 size={20} className="text-blue-500 animate-spin mx-auto" />
          ) : (
            <CheckCircle2 size={20} className="text-zinc-400 mx-auto" />
          )}
          {stats.processing > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {stats.processing}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer rounded-xl transition-all ${
        hasActiveTasks 
          ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 hover:border-blue-500/40' 
          : 'bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-200/50 dark:border-zinc-700/50">
        <div className="flex items-center gap-2">
          {hasActiveTasks ? (
            <div className="relative">
              <Loader2 size={16} className="text-blue-500 animate-spin" />
            </div>
          ) : (
            <CheckCircle2 size={16} className="text-green-500" />
          )}
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {language === 'vi' ? 'Tác vụ' : 'Tasks'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveTasks && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-medium">
              {activeTasksCount}/{maxConcurrentTasks}
            </span>
          )}
          <ChevronRight size={14} className="text-zinc-400" />
        </div>
      </div>

      {/* Active Tasks Preview */}
      {hasActiveTasks ? (
        <div className="p-2 space-y-2">
          {activeTasks.map(task => (
            <TaskMiniCard key={task.id} task={task} language={language} />
          ))}
          {stats.queued + stats.processing > 3 && (
            <p className="text-[10px] text-zinc-500 text-center py-1">
              +{stats.queued + stats.processing - 3} {language === 'vi' ? 'tác vụ khác' : 'more tasks'}
            </p>
          )}
        </div>
      ) : (
        <div className="p-3 text-center">
          <p className="text-xs text-zinc-500">
            {stats.completed > 0 
              ? `${stats.completed} ${language === 'vi' ? 'đã hoàn thành' : 'completed'}`
              : language === 'vi' ? 'Không có tác vụ' : 'No active tasks'
            }
          </p>
        </div>
      )}
    </div>
  );
};

const TaskMiniCard: React.FC<{ task: Task; language: string }> = ({ task, language }) => {
  const isProcessing = task.status === 'processing';

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-800/80">
      {/* Thumbnail */}
      <div className="relative w-8 h-8 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-700 flex-shrink-0">
        {task.input.thumbnail || task.input.url ? (
          <img src={task.input.thumbnail || task.input.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap size={12} className="text-zinc-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-zinc-900 dark:text-white truncate">
          {language === 'vi' ? task.toolNameVi : task.toolName}
        </p>
        {isProcessing ? (
          <div className="mt-1">
            <div className="h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-yellow-500 flex items-center gap-1">
            <Clock size={10} />
            {language === 'vi' ? 'Đang chờ' : 'Queued'}
          </p>
        )}
      </div>

      {/* Progress % */}
      {isProcessing && (
        <span className="text-[10px] font-medium text-blue-500">{Math.round(task.progress)}%</span>
      )}
    </div>
  );
};

export default TaskSidebarWidget;
