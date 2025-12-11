import React, { useState } from 'react';
import {
  X, ImagePlus, Upload, Smartphone, Link2, Cloud,
  HardDrive, Globe, Calendar
} from 'lucide-react';
import { Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface Asset {
  id: string;
  src: string;
  name: string;
  source?: 'local' | 'phone' | 'url' | 'cloud';
  size?: string;
  date?: string;
}

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'phone' | 'url' | 'cloud'>('all');

  // Mock imported assets with source info
  const allAssets: Asset[] = [
    { id: 'asset-1', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', name: 'Product_001.jpg', source: 'local', size: '2.4 MB', date: '2024-12-10' },
    { id: 'asset-2', src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop', name: 'Sneaker_white.png', source: 'phone', size: '1.8 MB', date: '2024-12-09' },
    { id: 'asset-3', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', name: 'Watch_hero.jpg', source: 'url', size: '3.1 MB', date: '2024-12-08' },
    { id: 'asset-4', src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop', name: 'Perfume_shot.jpg', source: 'cloud', size: '4.2 MB', date: '2024-12-07' },
    { id: 'asset-5', src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop', name: 'Cosmetics_flat.jpg', source: 'phone', size: '2.9 MB', date: '2024-12-06' },
    { id: 'asset-6', src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop', name: 'Nike_running.png', source: 'local', size: '1.5 MB', date: '2024-12-05' },
    { id: 'asset-7', src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop', name: 'Sneaker_red.jpg', source: 'url', size: '2.1 MB', date: '2024-12-04' },
    { id: 'asset-8', src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop', name: 'Shoes_studio.jpg', source: 'cloud', size: '3.8 MB', date: '2024-12-03' },
    { id: 'asset-9', src: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop', name: 'Product_flat.jpg', source: 'phone', size: '2.2 MB', date: '2024-12-02' },
    { id: 'asset-10', src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop', name: 'Bag_luxury.jpg', source: 'local', size: '4.5 MB', date: '2024-12-01' },
    { id: 'asset-11', src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', name: 'Headphones.jpg', source: 'url', size: '1.9 MB', date: '2024-11-30' },
    { id: 'asset-12', src: 'https://images.unsplash.com/photo-1491553895911-0055uj6e?w=300&h=300&fit=crop', name: 'Camera_shot.jpg', source: 'cloud', size: '3.3 MB', date: '2024-11-29' },
  ];

  const filteredAssets = activeFilter === 'all' 
    ? allAssets 
    : allAssets.filter(a => a.source === activeFilter);

  const getSourceIcon = (source?: Asset['source']) => {
    switch (source) {
      case 'local': return <HardDrive size={10} />;
      case 'phone': return <Smartphone size={10} />;
      case 'url': return <Globe size={10} />;
      case 'cloud': return <Cloud size={10} />;
      default: return <HardDrive size={10} />;
    }
  };

  const stats = [
    { key: 'all', label: language === 'vi' ? 'Tất cả' : 'All', value: allAssets.length, icon: Upload, color: 'text-cyan-500', bgActive: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-500' },
    { key: 'local', label: language === 'vi' ? 'Thiết bị này' : 'This Device', value: allAssets.filter(a => a.source === 'local').length, icon: HardDrive, color: 'text-orange-500', bgActive: 'bg-orange-100 dark:bg-orange-900/30 border-orange-500' },
    { key: 'phone', label: language === 'vi' ? 'Điện thoại' : 'Phone', value: allAssets.filter(a => a.source === 'phone').length, icon: Smartphone, color: 'text-purple-500', bgActive: 'bg-purple-100 dark:bg-purple-900/30 border-purple-500' },
    { key: 'url', label: 'URL', value: allAssets.filter(a => a.source === 'url').length, icon: Link2, color: 'text-blue-500', bgActive: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500' },
    { key: 'cloud', label: 'Cloud', value: allAssets.filter(a => a.source === 'cloud').length, icon: Cloud, color: 'text-green-500', bgActive: 'bg-green-100 dark:bg-green-900/30 border-green-500' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <ImagePlus size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Chọn từ My Assets' : 'Select from My Assets'}
              </h2>
              <p className="text-sm text-zinc-500">
                {language === 'vi' ? 'Chọn ảnh từ thư viện đã import' : 'Choose images from your imported library'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={22} className="text-zinc-500" />
          </button>
        </div>

        {/* Filter Stats - 4 Categories */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
          <div className="grid grid-cols-5 gap-3">
            {stats.map((stat) => (
              <button
                key={stat.key}
                onClick={() => setActiveFilter(stat.key as typeof activeFilter)}
                className={`rounded-xl p-3 text-left transition-all border-2 ${
                  activeFilter === stat.key
                    ? `${stat.bgActive}`
                    : 'bg-white dark:bg-zinc-800 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} className={stat.color} />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content - Image Grid */}
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-220px)]">
          {filteredAssets.length > 0 ? (
            <>
              {/* Active Filter Indicator */}
              {activeFilter !== 'all' && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-zinc-500">
                    {language === 'vi' ? 'Đang lọc:' : 'Filtering:'}
                  </span>
                  <Badge className="bg-repix-100 text-repix-600 dark:bg-repix-900/30 dark:text-repix-400">
                    {stats.find(s => s.key === activeFilter)?.label}
                  </Badge>
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className="text-xs text-zinc-500 hover:text-zinc-700 underline"
                  >
                    {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filter'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="group relative bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg hover:border-repix-500 transition-all"
                  >
                    <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <img 
                        src={asset.src} 
                        alt={asset.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Source Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 text-[9px] gap-1 px-1.5 py-0.5">
                          {getSourceIcon(asset.source)}
                        </Badge>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <ImagePlus size={18} className="text-repix-500" />
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5">
                      <h4 className="text-xs font-medium text-zinc-900 dark:text-white truncate">{asset.name}</h4>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-500">
                        <span>{asset.size}</span>
                        <span className="flex items-center gap-0.5">
                          <Calendar size={8} />
                          {asset.date}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <ImagePlus size={32} className="text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Không có ảnh nào' : 'No images found'}
              </h3>
              <p className="text-zinc-500 text-sm">
                {language === 'vi' ? 'Thử chọn bộ lọc khác' : 'Try selecting a different filter'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            {language === 'vi' ? 'Vào My Assets để import thêm ảnh' : 'Go to My Assets to import more images'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
