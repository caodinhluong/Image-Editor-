import React, { useState } from 'react';
import {
  X, Clock, CheckCircle2, AlertCircle, Loader2, Trash2,
  RefreshCw, Image as ImageIcon, Video, Wand2,
  Download, Eye, Zap, LayoutGrid, List, Table2,
  TrendingUp, Coffee, XCircle
} from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Task, TaskStatus, TaskType } from '../../types/task';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskManagerProps {
  onClose?: () => void;
  isFullView?: boolean;
}

// Demo button component for testing
const DemoTaskButton: React.FC = () => {
  const { language } = useLanguage();
  const { createTask } = useTask();
  
  const demoTasks = [
    {
      type: 'image' as TaskType,
      toolId: 'hd-enhance',
      toolName: 'HD Enhance',
      toolNameVi: 'Nâng cấp HD',
      stationId: 'cafe',
      stationName: 'AI Café',
      stationIcon: 'coffee',
      stationColor: 'from-amber-500 to-orange-500',
      input: { type: 'image' as const, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
      prompt: 'Upscale to 4K resolution',
      creditCost: 2,
      estimatedTime: 8,
    },
    {
      type: 'video' as TaskType,
      toolId: 'video-kitchen',
      toolName: 'Video Generator',
      toolNameVi: 'Tạo Video AI',
      stationId: 'kitchen',
      stationName: 'Kitchen',
      stationIcon: 'chef',
      stationColor: 'from-purple-500 to-pink-500',
      input: { type: 'text' as const, text: 'A sneaker floating in space' },
      prompt: 'A sneaker floating in space with dramatic lighting',
      creditCost: 5,
      estimatedTime: 15,
    },
    {
      type: 'face-swap' as TaskType,
      toolId: 'face-swap',
      toolName: 'Face Swap',
      toolNameVi: 'Hoán đổi khuôn mặt',
      stationId: 'drama',
      stationName: 'Drama Studio',
      stationIcon: 'drama',
      stationColor: 'from-pink-500 to-rose-500',
      input: { type: 'image' as const, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      creditCost: 3,
      estimatedTime: 10,
    },
  ];

  const handleCreateDemo = () => {
    const randomTask = demoTasks[Math.floor(Math.random() * demoTasks.length)];
    createTask(randomTask);
  };

  return (
    <button
      onClick={handleCreateDemo}
      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity flex items-center gap-1.5"
    >
      <Zap size={12} />
      {language === 'vi' ? 'Tạo task demo' : 'Add demo task'}
    </button>
  );
};

export const TaskManager: React.FC<TaskManagerProps> = ({ onClose, isFullView = true }) => {
  const { language } = useLanguage();
  const { 
    tasks, stats, filteredTasks, filter, setFilter,
    cancelTask, retryTask, deleteTask, clearCompleted, clearAll,
    activeTasksCount, maxConcurrentTasks
  } = useTask();
  
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const t = {
    vi: {
      title: 'Quản lý tác vụ',
      subtitle: 'Theo dõi tiến trình tạo ảnh & video',
      allTasks: 'Tất cả',
      queued: 'Đang chờ',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      noTasks: 'Chưa có tác vụ nào',
      noTasksDesc: 'Bắt đầu tạo ảnh hoặc video để xem tiến trình ở đây',
      clearCompleted: 'Xóa đã hoàn thành',
      clearAll: 'Xóa tất cả',
      cancel: 'Hủy',
      retry: 'Thử lại',
      delete: 'Xóa',
      view: 'Xem',
      download: 'Tải xuống',
      estimatedTime: 'Thời gian ước tính',
      elapsedTime: 'Đã chạy',
      credits: 'credits',
      activeSlots: 'Slot đang chạy',
      totalCredits: 'Tổng credits đã dùng',
      filterByStatus: 'Lọc theo trạng thái',
      filterByType: 'Lọc theo loại',
      image: 'Ảnh',
      video: 'Video',
      seconds: 'giây',
      justNow: 'Vừa xong',
      minutesAgo: 'phút trước',
      hoursAgo: 'giờ trước',
      // Table headers
      taskName: 'Tên tác vụ',
      type: 'Loại',
      progress: 'Tiến trình',
      status: 'Trạng thái',
      actions: 'Thao tác',
    },
    en: {
      title: 'Task Manager',
      subtitle: 'Track your image & video generation progress',
      allTasks: 'All',
      queued: 'Queued',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      noTasks: 'No tasks yet',
      noTasksDesc: 'Start generating images or videos to see progress here',
      clearCompleted: 'Clear completed',
      clearAll: 'Clear all',
      cancel: 'Cancel',
      retry: 'Retry',
      delete: 'Delete',
      view: 'View',
      download: 'Download',
      estimatedTime: 'Estimated time',
      elapsedTime: 'Elapsed',
      credits: 'credits',
      activeSlots: 'Active slots',
      totalCredits: 'Total credits used',
      filterByStatus: 'Filter by status',
      filterByType: 'Filter by type',
      image: 'Image',
      video: 'Video',
      seconds: 'sec',
      justNow: 'Just now',
      minutesAgo: 'min ago',
      hoursAgo: 'hours ago',
      // Table headers
      taskName: 'Task Name',
      type: 'Type',
      progress: 'Progress',
      status: 'Status',
      actions: 'Actions',
    }
  };
  const trans = t[language] || t.en;

  const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
    queued: { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: trans.queued },
    processing: { icon: Loader2, color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: trans.processing },
    completed: { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500/10', label: trans.completed },
    failed: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', label: trans.failed },
    cancelled: { icon: XCircle, color: 'text-zinc-500', bgColor: 'bg-zinc-500/10', label: trans.cancel },
  };

  const typeConfig: Record<TaskType, { icon: React.ElementType; label: string }> = {
    image: { icon: ImageIcon, label: trans.image },
    video: { icon: Video, label: trans.video },
    upscale: { icon: TrendingUp, label: 'Upscale' },
    'face-swap': { icon: Wand2, label: 'Face Swap' },
    'background-removal': { icon: Wand2, label: 'BG Remove' },
    'style-transfer': { icon: Wand2, label: 'Style' },
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return trans.justNow;
    if (diff < 3600) return `${Math.floor(diff / 60)} ${trans.minutesAgo}`;
    return `${Math.floor(diff / 3600)} ${trans.hoursAgo}`;
  };

  const handleStatusFilter = (status: TaskStatus | null) => {
    if (status === null) {
      setFilter({ ...filter, status: undefined });
    } else {
      setFilter({ ...filter, status: [status] });
    }
  };


  // Render Table View
  const renderTableView = () => {
    return (
      <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{trans.taskName}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{trans.type}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-48">{trans.progress}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{trans.status}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{trans.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
            {filteredTasks.map(task => {
              const statusInfo = statusConfig[task.status];
              const typeInfo = typeConfig[task.type];
              const StatusIcon = statusInfo.icon;
              const TypeIcon = typeInfo.icon;

              return (
                <tr 
                  key={task.id} 
                  className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
                  onClick={() => setDetailTask(task)}
                >
                  {/* Task Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-700 flex-shrink-0">
                        {task.input.thumbnail || task.input.url ? (
                          <img src={task.input.thumbnail || task.input.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <TypeIcon size={16} className="text-zinc-400" />
                          </div>
                        )}
                        {task.status === 'processing' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 size={14} className="text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                          {language === 'vi' ? task.toolNameVi : task.toolName}
                        </p>
                        {task.prompt && (
                          <p className="text-xs text-zinc-500 truncate max-w-[200px]">{task.prompt}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon size={14} className="text-zinc-400" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{typeInfo.label}</span>
                    </div>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-3">
                    {task.status === 'processing' ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-500 font-medium">{Math.round(task.progress)}%</span>
                          <span className="text-zinc-400">{task.estimatedTime - task.elapsedTime}s</span>
                        </div>
                        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : task.status === 'completed' ? (
                      <div className="h-1.5 bg-green-500 rounded-full w-full" />
                    ) : task.status === 'queued' ? (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full flex-1" />
                        <span className="text-xs text-zinc-400">{language === 'vi' ? 'Chờ' : 'Waiting'}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                      <StatusIcon size={12} className={task.status === 'processing' ? 'animate-spin' : ''} />
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      {task.status === 'completed' && task.output && (
                        <>
                          <button
                            onClick={() => setDetailTask(task)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-blue-500 transition-colors"
                            title={trans.view}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-green-500 transition-colors"
                            title={trans.download}
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                      {(task.status === 'queued' || task.status === 'processing') && (
                        <button
                          onClick={() => cancelTask(task.id)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors"
                          title={trans.cancel}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      {(task.status === 'failed' || task.status === 'cancelled') && (
                        <button
                          onClick={() => retryTask(task.id)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-blue-500 transition-colors"
                          title={trans.retry}
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors"
                        title={trans.delete}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTaskCard = (task: Task) => {
    const statusInfo = statusConfig[task.status];
    const typeInfo = typeConfig[task.type];
    const StatusIcon = statusInfo.icon;
    const TypeIcon = typeInfo.icon;
    const isExpanded = expandedTaskId === task.id;

    return (
      <div
        key={task.id}
        className={`group bg-white dark:bg-zinc-800/50 rounded-xl border transition-all duration-200 ${
          task.status === 'processing' 
            ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' 
            : 'border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-700 flex-shrink-0">
              {task.input.thumbnail || task.input.url ? (
                <img 
                  src={task.input.thumbnail || task.input.url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TypeIcon size={20} className="text-zinc-400" />
                </div>
              )}
              {task.status === 'processing' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 size={20} className="text-white animate-spin" />
                </div>
              )}
              {task.status === 'completed' && task.output && (
                <div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setDetailTask(task)}
                >
                  <button className="p-1 bg-white/20 rounded hover:bg-white/30">
                    <Eye size={12} className="text-white" />
                  </button>
                  <button className="p-1 bg-white/20 rounded hover:bg-white/30">
                    <Download size={12} className="text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                  {language === 'vi' ? task.toolNameVi : task.toolName}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              
              {task.prompt && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-2">
                  {task.prompt}
                </p>
              )}

              {/* Progress bar for processing */}
              {task.status === 'processing' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                    <span>{Math.round(task.progress)}%</span>
                    <span>{task.estimatedTime - task.elapsedTime}s {language === 'vi' ? 'còn lại' : 'remaining'}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {task.status === 'failed' && task.error && (
                <p className="text-xs text-red-500 mt-1">{task.error}</p>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {formatTime(task.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={10} />
                  {task.creditCost} {trans.credits}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {(task.status === 'queued' || task.status === 'processing') && (
                <button
                  onClick={() => cancelTask(task.id)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors"
                  title={trans.cancel}
                >
                  <XCircle size={16} />
                </button>
              )}
              {(task.status === 'failed' || task.status === 'cancelled') && (
                <button
                  onClick={() => retryTask(task.id)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-blue-500 transition-colors"
                  title={trans.retry}
                >
                  <RefreshCw size={16} />
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors"
                title={trans.delete}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className={`flex flex-col h-full bg-light-bg dark:bg-dark-bg ${isFullView ? '' : 'rounded-2xl border border-zinc-200 dark:border-zinc-700'}`}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{trans.title}</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{trans.subtitle}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Loader2 size={16} className="text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{activeTasksCount}/{maxConcurrentTasks}</span>
            </div>
            <p className="text-xs text-zinc-500">{trans.activeSlots}</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock size={16} className="text-yellow-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.queued}</span>
            </div>
            <p className="text-xs text-zinc-500">{trans.queued}</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-green-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.completed}</span>
            </div>
            <p className="text-xs text-zinc-500">{trans.completed}</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap size={16} className="text-purple-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalCreditsUsed}</span>
            </div>
            <p className="text-xs text-zinc-500">{trans.totalCredits}</p>
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          {[
            { status: null, label: trans.allTasks, count: stats.total },
            { status: 'processing' as TaskStatus, label: trans.processing, count: stats.processing },
            { status: 'queued' as TaskStatus, label: trans.queued, count: stats.queued },
            { status: 'completed' as TaskStatus, label: trans.completed, count: stats.completed },
            { status: 'failed' as TaskStatus, label: trans.failed, count: stats.failed },
          ].map(tab => (
            <button
              key={tab.status || 'all'}
              onClick={() => handleStatusFilter(tab.status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                (filter.status?.[0] || null) === tab.status
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-600 text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              title="Table view"
            >
              <Table2 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              title="List view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {trans.clearCompleted}
            </button>
          )}
          
          {/* Demo button - for testing */}
          <DemoTaskButton />
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Coffee size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{trans.noTasks}</h3>
            <p className="text-sm text-zinc-500 max-w-sm">{trans.noTasksDesc}</p>
          </div>
        ) : viewMode === 'table' ? (
          renderTableView()
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredTasks.map(renderTaskCard)}
          </div>
        )}
      </div>
      
      {/* Task Detail Modal */}
      {detailTask && (
        <TaskDetailModal 
          task={detailTask} 
          onClose={() => setDetailTask(null)} 
        />
      )}
    </div>
  );
};

export default TaskManager;
