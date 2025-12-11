import React from 'react';
import {
  Layout, Star, Download, Eye, Copy, MoreHorizontal, Plus,
  Instagram, Facebook, Youtube, Twitter, Smartphone, Monitor
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: 'social' | 'print' | 'web' | 'video';
  platform?: string;
  dimensions: string;
  uses: number;
  starred: boolean;
}

export const TemplatesView: React.FC = () => {
  const { language } = useLanguage();

  const templates: Template[] = [
    { id: '1', name: 'Instagram Post', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', category: 'social', platform: 'Instagram', dimensions: '1080x1080', uses: 24, starred: true },
    { id: '2', name: 'Facebook Cover', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', category: 'social', platform: 'Facebook', dimensions: '820x312', uses: 12, starred: false },
    { id: '3', name: 'YouTube Thumbnail', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', category: 'video', platform: 'YouTube', dimensions: '1280x720', uses: 18, starred: true },
    { id: '4', name: 'Story Template', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', category: 'social', platform: 'Instagram', dimensions: '1080x1920', uses: 32, starred: false },
    { id: '5', name: 'Web Banner', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', category: 'web', dimensions: '1200x628', uses: 8, starred: false },
    { id: '6', name: 'A4 Flyer', thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300', category: 'print', dimensions: '210x297mm', uses: 5, starred: false },
  ];

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram size={12} />;
      case 'Facebook': return <Facebook size={12} />;
      case 'YouTube': return <Youtube size={12} />;
      case 'Twitter': return <Twitter size={12} />;
      default: return <Monitor size={12} />;
    }
  };

  const getCategoryColor = (category: Template['category']) => {
    switch (category) {
      case 'social': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      case 'print': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'web': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'video': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Layout size={24} className="text-amber-500" />
              {language === 'vi' ? 'Templates' : 'Templates'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {language === 'vi' ? 'Các mẫu thiết kế có sẵn và đã lưu' : 'Pre-made and saved design templates'}
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus size={16} />
            {language === 'vi' ? 'Tạo template' : 'Create Template'}
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: language === 'vi' ? 'Tất cả' : 'All' },
            { key: 'social', label: 'Social Media' },
            { key: 'web', label: 'Web' },
            { key: 'print', label: 'Print' },
            { key: 'video', label: 'Video' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab.key === 'all'
                  ? 'bg-repix-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="group bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                
                {/* Star */}
                {template.starred && (
                  <div className="absolute top-2 right-2 p-1.5 bg-amber-500 rounded-full">
                    <Star size={10} className="text-white" fill="currentColor" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={`${getCategoryColor(template.category)} text-[10px]`}>
                    {template.category}
                  </Badge>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">
                    <Eye size={14} className="mr-1" />
                    {language === 'vi' ? 'Xem' : 'View'}
                  </Button>
                  <Button size="sm" className="h-8 px-3 text-xs">
                    <Copy size={14} className="mr-1" />
                    {language === 'vi' ? 'Dùng' : 'Use'}
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {template.platform && (
                    <span className="text-zinc-400">{getPlatformIcon(template.platform)}</span>
                  )}
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">{template.name}</h4>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{template.dimensions}</span>
                  <span>{template.uses} {language === 'vi' ? 'lần dùng' : 'uses'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
