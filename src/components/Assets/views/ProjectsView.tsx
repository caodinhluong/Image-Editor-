import React from 'react';
import {
  FolderOpen, Calendar, Clock, Edit3, Trash2, Copy, MoreHorizontal,
  Layers, Users, Star, Play
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  layers: number;
  lastEdited: string;
  createdAt: string;
  collaborators?: number;
  starred: boolean;
}

export const ProjectsView: React.FC = () => {
  const { language } = useLanguage();

  const projects: Project[] = [
    { id: '1', name: 'Summer Campaign 2024', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', layers: 12, lastEdited: '2 giờ trước', createdAt: '2024-12-01', collaborators: 3, starred: true },
    { id: '2', name: 'Product Catalog', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', layers: 8, lastEdited: '1 ngày trước', createdAt: '2024-11-28', starred: false },
    { id: '3', name: 'Social Media Kit', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', layers: 24, lastEdited: '3 ngày trước', createdAt: '2024-11-20', collaborators: 2, starred: true },
    { id: '4', name: 'Brand Guidelines', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', layers: 15, lastEdited: '1 tuần trước', createdAt: '2024-11-15', starred: false },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FolderOpen size={24} className="text-blue-500" />
              {language === 'vi' ? 'Dự án' : 'Projects'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {language === 'vi' ? 'Các dự án đang làm việc' : 'Your working projects'}
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <FolderOpen size={16} />
            {language === 'vi' ? 'Tạo dự án mới' : 'New Project'}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: language === 'vi' ? 'Tổng dự án' : 'Total Projects', value: '23', icon: FolderOpen, color: 'text-blue-500' },
            { label: language === 'vi' ? 'Đánh dấu sao' : 'Starred', value: '5', icon: Star, color: 'text-amber-500' },
            { label: language === 'vi' ? 'Cộng tác' : 'Collaborative', value: '8', icon: Users, color: 'text-green-500' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="group bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                
                {/* Star */}
                {project.starred && (
                  <div className="absolute top-2 right-2 p-1.5 bg-amber-500 rounded-full">
                    <Star size={12} className="text-white" fill="currentColor" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="gap-2">
                    <Play size={16} />
                    {language === 'vi' ? 'Mở dự án' : 'Open Project'}
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{project.name}</h4>
                  <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded">
                    <MoreHorizontal size={14} className="text-zinc-500" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Layers size={12} />
                    {project.layers} layers
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {project.lastEdited}
                  </span>
                  {project.collaborators && (
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {project.collaborators}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
