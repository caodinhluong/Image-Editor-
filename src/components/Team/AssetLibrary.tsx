import React, { useState } from 'react';
import {
  X, FolderOpen, Search, Filter, Grid, List, Upload,
  Download, Trash2, Star, StarOff, MoreVertical, Image,
  FileText, Video, Music, Archive, Eye, Copy, FolderPlus
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface AssetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'archive';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  thumbnail?: string;
  starred: boolean;
  folder: string;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const trans = {
    title: language === 'vi' ? 'Thư viện Asset' : 'Asset Library',
    subtitle: language === 'vi' ? 'Tài nguyên dùng chung của team' : 'Shared team resources',
    search: language === 'vi' ? 'Tìm kiếm assets...' : 'Search assets...',
    upload: language === 'vi' ? 'Tải lên' : 'Upload',
    newFolder: language === 'vi' ? 'Thư mục mới' : 'New Folder',
    all: language === 'vi' ? 'Tất cả' : 'All Assets',
    images: language === 'vi' ? 'Hình ảnh' : 'Images',
    videos: language === 'vi' ? 'Video' : 'Videos',
    documents: language === 'vi' ? 'Tài liệu' : 'Documents',
    starred: language === 'vi' ? 'Đánh dấu' : 'Starred',
    recent: language === 'vi' ? 'Gần đây' : 'Recent',
    selected: language === 'vi' ? 'đã chọn' : 'selected',
    download: language === 'vi' ? 'Tải xuống' : 'Download',
    delete: language === 'vi' ? 'Xóa' : 'Delete',
  };

  const folders = [
    { id: 'all', name: trans.all, icon: FolderOpen, count: 156 },
    { id: 'images', name: trans.images, icon: Image, count: 89 },
    { id: 'videos', name: trans.videos, icon: Video, count: 23 },
    { id: 'documents', name: trans.documents, icon: FileText, count: 34 },
    { id: 'starred', name: trans.starred, icon: Star, count: 12 },
  ];

  const [assets] = useState<Asset[]>([
    { id: '1', name: 'Hero_Banner_Summer.png', type: 'image', size: '2.4 MB', uploadedBy: 'Sarah', uploadedAt: '2 hours ago', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', starred: true, folder: 'images' },
    { id: '2', name: 'Product_Showcase.mp4', type: 'video', size: '45 MB', uploadedBy: 'Mike', uploadedAt: '5 hours ago', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', starred: false, folder: 'videos' },
    { id: '3', name: 'Brand_Guidelines.pdf', type: 'document', size: '8.2 MB', uploadedBy: 'Jessica', uploadedAt: '1 day ago', starred: true, folder: 'documents' },
    { id: '4', name: 'Instagram_Post_01.jpg', type: 'image', size: '1.8 MB', uploadedBy: 'Tom', uploadedAt: '1 day ago', thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200', starred: false, folder: 'images' },
    { id: '5', name: 'Logo_Animation.mp4', type: 'video', size: '12 MB', uploadedBy: 'Sarah', uploadedAt: '2 days ago', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200', starred: true, folder: 'videos' },
    { id: '6', name: 'Campaign_Brief.docx', type: 'document', size: '245 KB', uploadedBy: 'Mike', uploadedAt: '3 days ago', starred: false, folder: 'documents' },
    { id: '7', name: 'Product_Shot_Watch.png', type: 'image', size: '3.1 MB', uploadedBy: 'Jessica', uploadedAt: '3 days ago', thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200', starred: false, folder: 'images' },
    { id: '8', name: 'Background_Music.mp3', type: 'audio', size: '4.5 MB', uploadedBy: 'Tom', uploadedAt: '4 days ago', starred: false, folder: 'all' },
  ]);

  const getFileIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      image: <Image size={20} className="text-blue-500" />,
      video: <Video size={20} className="text-pink-500" />,
      document: <FileText size={20} className="text-amber-500" />,
      audio: <Music size={20} className="text-green-500" />,
      archive: <Archive size={20} className="text-zinc-500" />,
    };
    return icons[type] || <FileText size={20} />;
  };

  const filteredAssets = assets.filter(asset => {
    if (selectedFolder === 'starred' && !asset.starred) return false;
    if (selectedFolder !== 'all' && selectedFolder !== 'starred' && asset.folder !== selectedFolder) return false;
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <FolderOpen size={20} className="text-cyan-600" />
              </div>
              <div>
                <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
                <p className="text-xs text-zinc-500">{trans.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FolderPlus size={14} className="mr-2" /> {trans.newFolder}
              </Button>
              <Button size="sm">
                <Upload size={14} className="mr-2" /> {trans.upload}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder={trans.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <Button variant="outline" size="sm"><Filter size={14} className="mr-2" /> Filter</Button>
            <div className="flex border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 p-3 overflow-y-auto">
            <nav className="space-y-1">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <folder.icon size={16} />
                    {folder.name}
                  </span>
                  <span className="text-xs text-zinc-400">{folder.count}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Assets Grid/List */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Selection Bar */}
            {selectedAssets.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between">
                <span className="text-sm text-cyan-700 dark:text-cyan-300">
                  {selectedAssets.length} {trans.selected}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> {trans.download}</Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200"><Trash2 size={14} className="mr-1" /> {trans.delete}</Button>
                </div>
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-4 gap-4">
                {filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => toggleAssetSelection(asset.id)}
                    className={`group relative bg-white dark:bg-zinc-800 border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedAssets.includes(asset.id)
                        ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                        : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 relative">
                      {asset.thumbnail ? (
                        <img src={asset.thumbnail} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(asset.type)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full"><Eye size={14} /></Button>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full"><Download size={14} /></Button>
                      </div>
                      <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 dark:bg-zinc-800/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.starred ? <Star size={14} className="text-amber-500 fill-amber-500" /> : <StarOff size={14} className="text-zinc-400" />}
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate text-zinc-900 dark:text-white">{asset.name}</p>
                      <p className="text-xs text-zinc-500">{asset.size} • {asset.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => toggleAssetSelection(asset.id)}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAssets.includes(asset.id)
                        ? 'bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      {asset.thumbnail ? (
                        <img src={asset.thumbnail} className="w-full h-full object-cover" />
                      ) : (
                        getFileIcon(asset.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-white truncate">{asset.name}</p>
                      <p className="text-xs text-zinc-500">{asset.uploadedBy} • {asset.uploadedAt}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{asset.size}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={14} /></Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
