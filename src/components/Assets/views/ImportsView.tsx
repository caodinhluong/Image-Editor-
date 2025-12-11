import React, { useState } from 'react';
import {
  Upload, Link2, Smartphone, Cloud, Calendar, MoreHorizontal,
  Download, Trash2, Eye, CheckCircle2, Clock, Globe, HardDrive
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ImportedAsset {
  id: string;
  name: string;
  thumbnail: string;
  size: string;
  importedAt: string;
  source: 'local' | 'url' | 'phone' | 'cloud';
  sourceName?: string;
  status: 'completed' | 'processing' | 'failed';
}

interface ImportsViewProps {
  onOpenImportManager: () => void;
  onOpenPhoneSync: () => void;
}

export const ImportsView: React.FC<ImportsViewProps> = ({
  onOpenImportManager,
  onOpenPhoneSync,
}) => {
  const { language } = useLanguage();
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [filterSource, setFilterSource] = useState<'all' | 'phone' | 'url' | 'cloud' | 'local'>('all');

  const imports: ImportedAsset[] = [
    { id: '1', name: 'photo_001.jpg', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', size: '2.4 MB', importedAt: '2024-12-10', source: 'phone', status: 'completed' },
    { id: '2', name: 'product_shot.png', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', size: '1.8 MB', importedAt: '2024-12-09', source: 'local', status: 'completed' },
    { id: '3', name: 'banner_design.jpg', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', size: '3.1 MB', importedAt: '2024-12-08', source: 'url', sourceName: 'unsplash.com', status: 'completed' },
    { id: '4', name: 'team_photo.png', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', size: '4.2 MB', importedAt: '2024-12-07', source: 'cloud', sourceName: 'Google Drive', status: 'completed' },
    { id: '5', name: 'logo_v2.svg', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', size: '0.5 MB', importedAt: '2024-12-06', source: 'local', status: 'processing' },
    { id: '6', name: 'selfie_beach.jpg', thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300', size: '3.8 MB', importedAt: '2024-12-05', source: 'phone', status: 'completed' },
    { id: '7', name: 'vacation_01.jpg', thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300', size: '2.9 MB', importedAt: '2024-12-04', source: 'phone', status: 'completed' },
    { id: '8', name: 'stock_image.jpg', thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300', size: '1.5 MB', importedAt: '2024-12-03', source: 'url', sourceName: 'pexels.com', status: 'completed' },
    { id: '9', name: 'dropbox_file.png', thumbnail: 'https://images.unsplash.com/photo-1491553895911-0055uj6e?w=300', size: '2.1 MB', importedAt: '2024-12-02', source: 'cloud', sourceName: 'Dropbox', status: 'completed' },
    { id: '10', name: 'camera_roll.jpg', thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', size: '4.5 MB', importedAt: '2024-12-01', source: 'phone', status: 'completed' },
  ];

  const getSourceIcon = (source: ImportedAsset['source']) => {
    switch (source) {
      case 'local': return <HardDrive size={12} />;
      case 'url': return <Globe size={12} />;
      case 'phone': return <Smartphone size={12} />;
      case 'cloud': return <Cloud size={12} />;
    }
  };

  const getSourceLabel = (source: ImportedAsset['source'], sourceName?: string) => {
    if (sourceName) return sourceName;
    switch (source) {
      case 'local': return language === 'vi' ? 'Máy tính' : 'Computer';
      case 'url': return 'URL';
      case 'phone': return language === 'vi' ? 'Điện thoại' : 'Phone';
      case 'cloud': return 'Cloud';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Upload size={24} className="text-cyan-500" />
              {language === 'vi' ? 'Ảnh đã Import' : 'Imported Images'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {language === 'vi' ? 'Quản lý ảnh được tải lên từ các nguồn khác nhau' : 'Manage images uploaded from various sources'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onOpenPhoneSync}>
              <Smartphone size={16} />
              {language === 'vi' ? 'Từ điện thoại' : 'From Phone'}
            </Button>
            <Button size="sm" className="gap-2" onClick={onOpenImportManager}>
              <Upload size={16} />
              {language === 'vi' ? 'Import mới' : 'New Import'}
            </Button>
          </div>
        </div>

        {/* Quick Stats - Clickable Filters */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { key: 'all', label: language === 'vi' ? 'Tổng import' : 'Total Imports', value: '28', icon: Upload, color: 'text-cyan-500', bgActive: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-500' },
            { key: 'phone', label: language === 'vi' ? 'Từ điện thoại' : 'From Phone', value: '12', icon: Smartphone, color: 'text-purple-500', bgActive: 'bg-purple-100 dark:bg-purple-900/30 border-purple-500' },
            { key: 'url', label: language === 'vi' ? 'Từ URL' : 'From URL', value: '8', icon: Link2, color: 'text-blue-500', bgActive: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500' },
            { key: 'cloud', label: language === 'vi' ? 'Từ Cloud' : 'From Cloud', value: '8', icon: Cloud, color: 'text-green-500', bgActive: 'bg-green-100 dark:bg-green-900/30 border-green-500' },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilterSource(stat.key as any)}
              className={`rounded-xl p-4 text-left transition-all border-2 ${
                filterSource === stat.key
                  ? `${stat.bgActive}`
                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Active Filter Indicator */}
        {filterSource !== 'all' && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-zinc-500">
              {language === 'vi' ? 'Đang lọc:' : 'Filtering:'}
            </span>
            <Badge className="bg-repix-100 text-repix-600 dark:bg-repix-900/30 dark:text-repix-400">
              {filterSource === 'phone' && (language === 'vi' ? 'Từ điện thoại' : 'From Phone')}
              {filterSource === 'url' && 'From URL'}
              {filterSource === 'cloud' && 'From Cloud'}
              {filterSource === 'local' && (language === 'vi' ? 'Từ máy tính' : 'From Computer')}
            </Badge>
            <button 
              onClick={() => setFilterSource('all')}
              className="text-xs text-zinc-500 hover:text-zinc-700 underline"
            >
              {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filter'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {imports
            .filter(asset => filterSource === 'all' || asset.source === filterSource)
            .map(asset => (
            <div
              key={asset.id}
              className="group relative bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                
                {/* Source Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 text-[10px] gap-1">
                    {getSourceIcon(asset.source)}
                    {getSourceLabel(asset.source, asset.sourceName)}
                  </Badge>
                </div>

                {/* Status */}
                {asset.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-xs flex items-center gap-2">
                      <Clock size={14} className="animate-spin" />
                      {language === 'vi' ? 'Đang xử lý...' : 'Processing...'}
                    </div>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">
                    <Eye size={14} />
                  </Button>
                  <Button size="sm" className="h-8 px-3 text-xs">
                    <Download size={14} />
                  </Button>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">{asset.name}</h4>
                <div className="flex items-center justify-between mt-1 text-xs text-zinc-500">
                  <span>{asset.size}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {asset.importedAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
