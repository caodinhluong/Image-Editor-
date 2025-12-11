import React from 'react';
import {
  Layers, Calendar, Clock, Download, Eye, MoreHorizontal, Play,
  CheckCircle2, XCircle, Loader2, Image, Zap, FolderOpen
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface BatchJob {
  id: string;
  name: string;
  thumbnail: string;
  totalImages: number;
  completedImages: number;
  status: 'completed' | 'processing' | 'failed' | 'queued';
  operation: string;
  createdAt: string;
  duration?: string;
  credits: number;
}

export const BatchProcessedView: React.FC = () => {
  const { language } = useLanguage();

  const batchJobs: BatchJob[] = [
    { id: '1', name: 'Product Photos Batch', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', totalImages: 50, completedImages: 50, status: 'completed', operation: 'Remove Background', createdAt: '2024-12-10', duration: '5m 32s', credits: 50 },
    { id: '2', name: 'Social Media Resize', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', totalImages: 24, completedImages: 18, status: 'processing', operation: 'Resize & Crop', createdAt: '2024-12-10', credits: 24 },
    { id: '3', name: 'Watermark Addition', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', totalImages: 100, completedImages: 100, status: 'completed', operation: 'Add Watermark', createdAt: '2024-12-09', duration: '8m 15s', credits: 100 },
    { id: '4', name: 'Image Enhancement', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', totalImages: 30, completedImages: 0, status: 'failed', operation: 'AI Enhance', createdAt: '2024-12-08', credits: 0 },
    { id: '5', name: 'Format Conversion', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', totalImages: 45, completedImages: 0, status: 'queued', operation: 'Convert to WebP', createdAt: '2024-12-08', credits: 45 },
  ];

  const getStatusBadge = (status: BatchJob['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px] gap-1"><CheckCircle2 size={10} />{language === 'vi' ? 'Hoàn thành' : 'Completed'}</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] gap-1"><Loader2 size={10} className="animate-spin" />{language === 'vi' ? 'Đang xử lý' : 'Processing'}</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] gap-1"><XCircle size={10} />{language === 'vi' ? 'Thất bại' : 'Failed'}</Badge>;
      case 'queued':
        return <Badge className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] gap-1"><Clock size={10} />{language === 'vi' ? 'Đang chờ' : 'Queued'}</Badge>;
    }
  };

  const totalProcessed = batchJobs.reduce((acc, job) => acc + job.completedImages, 0);
  const totalCredits = batchJobs.reduce((acc, job) => acc + job.credits, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers size={24} className="text-pink-500" />
              {language === 'vi' ? 'Xử lý hàng loạt' : 'Batch Processed'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {language === 'vi' ? 'Lịch sử các batch đã xử lý' : 'History of batch processing jobs'}
            </p>
          </div>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500">
            <Layers size={16} />
            {language === 'vi' ? 'Batch mới' : 'New Batch'}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: language === 'vi' ? 'Tổng batch' : 'Total Batches', value: '34', icon: Layers, color: 'text-pink-500' },
            { label: language === 'vi' ? 'Ảnh đã xử lý' : 'Images Processed', value: totalProcessed.toString(), icon: Image, color: 'text-blue-500' },
            { label: language === 'vi' ? 'Đang chạy' : 'Running', value: '1', icon: Loader2, color: 'text-amber-500' },
            { label: language === 'vi' ? 'Credits dùng' : 'Credits Used', value: totalCredits.toString(), icon: Zap, color: 'text-green-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {batchJobs.map(job => (
            <div
              key={job.id}
              className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                  <img src={job.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{job.name}</h4>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">{job.operation}</p>
                  
                  {/* Progress */}
                  {job.status === 'processing' && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>{job.completedImages} / {job.totalImages}</span>
                        <span>{Math.round((job.completedImages / job.totalImages) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${(job.completedImages / job.totalImages) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Image size={10} />
                      {job.totalImages} {language === 'vi' ? 'ảnh' : 'images'}
                    </span>
                    {job.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {job.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Zap size={10} />
                      {job.credits} credits
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {job.createdAt}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {job.status === 'completed' && (
                    <>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <FolderOpen size={14} />
                        {language === 'vi' ? 'Xem' : 'View'}
                      </Button>
                      <Button size="sm" className="h-8 gap-1">
                        <Download size={14} />
                        {language === 'vi' ? 'Tải' : 'Download'}
                      </Button>
                    </>
                  )}
                  {job.status === 'failed' && (
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-red-500 border-red-200 hover:bg-red-50">
                      <Play size={14} />
                      {language === 'vi' ? 'Thử lại' : 'Retry'}
                    </Button>
                  )}
                  {job.status === 'queued' && (
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <XCircle size={14} />
                      {language === 'vi' ? 'Hủy' : 'Cancel'}
                    </Button>
                  )}
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg">
                    <MoreHorizontal size={16} className="text-zinc-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
