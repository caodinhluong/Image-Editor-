import React from 'react';
import {
  X, Clock, CheckCircle2, AlertCircle, Loader2, Download, Share2,
  RefreshCw, Trash2, Zap, Image as ImageIcon, Video, ExternalLink,
  Copy, Heart, Bookmark
} from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTask } from '../../contexts/TaskContext';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { language } = useLanguage();
  const { cancelTask, retryTask, deleteTask } = useTask();

  const t = {
    vi: {
      taskDetails: 'Chi tiết tác vụ',
      status: 'Trạng thái',
      queued: 'Đang chờ',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      cancelled: 'Đã hủy',
      input: 'Đầu vào',
      output: 'Kết quả',
      prompt: 'Prompt',
      tool: 'Công cụ',
      station: 'Station',
      credits: 'Credits',
      estimatedTime: 'Thời gian ước tính',
      elapsedTime: 'Thời gian đã chạy',
      createdAt: 'Tạo lúc',
      completedAt: 'Hoàn thành lúc',
      error: 'Lỗi',
      retry: 'Thử lại',
      cancel: 'Hủy',
      delete: 'Xóa',
      download: 'Tải xuống',
      share: 'Chia sẻ',
      copyPrompt: 'Sao chép prompt',
      openInEditor: 'Mở trong Editor',
      seconds: 'giây',
    },
    en: {
      taskDetails: 'Task Details',
      status: 'Status',
      queued: 'Queued',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
      input: 'Input',
      output: 'Output',
      prompt: 'Prompt',
      tool: 'Tool',
      station: 'Station',
      credits: 'Credits',
      estimatedTime: 'Estimated time',
      elapsedTime: 'Elapsed time',
      createdAt: 'Created at',
      completedAt: 'Completed at',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      delete: 'Delete',
      download: 'Download',
      share: 'Share',
      copyPrompt: 'Copy prompt',
      openInEditor: 'Open in Editor',
      seconds: 'sec',
    }
  };
  const trans = t[language] || t.en;

  const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
    queued: { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: trans.queued },
    processing: { icon: Loader2, color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: trans.processing },
    completed: { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500/10', label: trans.completed },
    failed: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', label: trans.failed },
    cancelled: { icon: X, color: 'text-zinc-500', bgColor: 'bg-zinc-500/10', label: trans.cancelled },
  };

  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleDownload = () => {
    if (task.output?.url) {
      const link = document.createElement('a');
      link.href = task.output.url;
      link.download = `${task.toolId}-${task.id}.${task.output.type === 'video' ? 'mp4' : 'png'}`;
      link.click();
    }
  };

  const handleCopyPrompt = () => {
    if (task.prompt) {
      navigator.clipboard.writeText(task.prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${task.stationColor}`}>
              <span className="text-xl">{task.stationIcon === 'coffee' ? '☕' : task.stationIcon === 'chef' ? '👨‍🍳' : task.stationIcon === 'drama' ? '🎭' : '✨'}</span>
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? task.toolNameVi : task.toolName}
              </h2>
              <p className="text-xs text-zinc-500">{task.stationName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Status */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}>
              <StatusIcon size={16} className={`${statusInfo.color} ${task.status === 'processing' ? 'animate-spin' : ''}`} />
              <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            {task.status === 'processing' && (
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                  <span>{Math.round(task.progress)}%</span>
                  <span>{task.estimatedTime - task.elapsedTime}s {language === 'vi' ? 'còn lại' : 'remaining'}</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Input/Output Preview */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Input */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">{trans.input}</p>
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                {task.input.url || task.input.thumbnail ? (
                  <img 
                    src={task.input.url || task.input.thumbnail} 
                    alt="Input" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {task.input.type === 'text' ? (
                      <p className="text-sm text-zinc-500 p-4 text-center">{task.input.text || task.prompt}</p>
                    ) : (
                      <ImageIcon size={32} className="text-zinc-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Output */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">{trans.output}</p>
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                {task.output?.url ? (
                  task.output.type === 'video' ? (
                    <video 
                      src={task.output.url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={task.output.url} 
                      alt="Output" 
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {task.status === 'processing' ? (
                      <Loader2 size={32} className="text-blue-500 animate-spin" />
                    ) : task.status === 'failed' ? (
                      <AlertCircle size={32} className="text-red-500" />
                    ) : (
                      <ImageIcon size={32} className="text-zinc-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt */}
          {task.prompt && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-zinc-500">{trans.prompt}</p>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <Copy size={12} />
                  {trans.copyPrompt}
                </button>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                {task.prompt}
              </p>
            </div>
          )}

          {/* Error */}
          {task.error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{task.error}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-500">{trans.credits}</span>
              <span className="font-medium text-zinc-900 dark:text-white flex items-center gap-1">
                <Zap size={14} className="text-purple-500" />
                {task.creditCost}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-500">{trans.estimatedTime}</span>
              <span className="font-medium text-zinc-900 dark:text-white">{task.estimatedTime}s</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-500">{trans.createdAt}</span>
              <span className="font-medium text-zinc-900 dark:text-white text-xs">{formatDate(task.createdAt)}</span>
            </div>
            {task.completedAt && (
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <span className="text-zinc-500">{trans.completedAt}</span>
                <span className="font-medium text-zinc-900 dark:text-white text-xs">{formatDate(task.completedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2">
            {(task.status === 'failed' || task.status === 'cancelled') && (
              <button
                onClick={() => { retryTask(task.id); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <RefreshCw size={14} />
                {trans.retry}
              </button>
            )}
            {(task.status === 'queued' || task.status === 'processing') && (
              <button
                onClick={() => { cancelTask(task.id); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                <X size={14} />
                {trans.cancel}
              </button>
            )}
            <button
              onClick={() => { deleteTask(task.id); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
              {trans.delete}
            </button>
          </div>

          {task.status === 'completed' && task.output && (
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                <Heart size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                <Bookmark size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                <Share2 size={18} />
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
              >
                <Download size={14} />
                {trans.download}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
