import React, { useState } from 'react';
import {
  FolderOpen, Image, Download, Trash2, Search, Filter, Grid, List,
  Clock, Star, Tag, MoreHorizontal, Eye, Share2, Copy, ExternalLink,
  CheckCircle2, XCircle, Loader2, Cloud, HardDrive, Sparkles, Palette,
  Calendar, SortAsc, SortDesc, ChevronDown, Plus, Upload, FolderPlus
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'project' | 'template';
  thumbnail: string;
  size: string;
  dimensions: string;
  createdAt: string;
  modifiedAt: string;
  status: 'synced' | 'local' | 'processing' | 'error';
  tags: string[];
  starred: boolean;
  brandKit?: string;
  source: 'generated' | 'uploaded' | 'edited' | 'batch';
}

interface Folder {
  id: string;
  name: string;
  count: number;
  color: string;
}

export const AssetLibrary: React.FC = () => {
  const { trans } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'project' | 'template'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock folders with translations
  const folders: Folder[] = [
    { id: 'all', name: trans.assets.allAssets, count: 156, color: 'bg-zinc-500' },
    { id: 'exports', name: trans.assets.exports, count: 48, color: 'bg-green-500' },
    { id: 'projects', name: trans.assets.projects, count: 23, color: 'bg-blue-500' },
    { id: 'generated', name: trans.assets.generated, count: 67, color: 'bg-purple-500' },
    { id: 'templates', name: trans.assets.templates, count: 12, color: 'bg-amber-500' },
    { id: 'batch', name: trans.assets.batchProcessed, count: 34, color: 'bg-pink-500' },
  ];

 
 // Mock assets data
  const assets: Asset[] = [
    {
      id: '1', name: 'Product_Hero_Final.png', type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      size: '2.4 MB', dimensions: '2048x2048', createdAt: '2024-12-08', modifiedAt: '2024-12-08',
      status: 'synced', tags: ['product', 'hero', 'nike'], starred: true, brandKit: 'Nike Brand', source: 'edited'
    },
    {
      id: '2', name: 'Summer_Campaign_01.jpg', type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
      size: '1.8 MB', dimensions: '1920x1080', createdAt: '2024-12-07', modifiedAt: '2024-12-08',
      status: 'synced', tags: ['campaign', 'summer'], starred: false, source: 'generated'
    },
    {
      id: '3', name: 'AI_Generated_Sneaker.png', type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      size: '3.1 MB', dimensions: '2048x2048', createdAt: '2024-12-06', modifiedAt: '2024-12-06',
      status: 'synced', tags: ['ai', 'sneaker', 'generated'], starred: true, source: 'generated'
    },
    {
      id: '4', name: 'Batch_Export_001.jpg', type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      size: '1.2 MB', dimensions: '1080x1080', createdAt: '2024-12-05', modifiedAt: '2024-12-05',
      status: 'synced', tags: ['batch', 'instagram'], starred: false, brandKit: 'Adidas Style', source: 'batch'
    },
    {
      id: '5', name: 'Social_Post_Template.psd', type: 'project',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      size: '15.4 MB', dimensions: '1080x1920', createdAt: '2024-12-04', modifiedAt: '2024-12-07',
      status: 'synced', tags: ['template', 'social', 'story'], starred: true, source: 'edited'
    },
    {
      id: '6', name: 'Product_Lifestyle.jpg', type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
      size: '2.8 MB', dimensions: '2400x1600', createdAt: '2024-12-03', modifiedAt: '2024-12-03',
      status: 'processing', tags: ['lifestyle', 'watch'], starred: false, source: 'uploaded'
    },
    {
      id: '7', name: 'Banner_Holiday_Sale.png', type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop',
      size: '1.5 MB', dimensions: '1200x628', createdAt: '2024-12-02', modifiedAt: '2024-12-02',
      status: 'synced', tags: ['banner', 'sale', 'holiday'], starred: false, source: 'edited'
    },
    {
      id: '8', name: 'Instagram_Carousel.zip', type: 'project',
      thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
      size: '8.2 MB', dimensions: '1080x1080', createdAt: '2024-12-01', modifiedAt: '2024-12-01',
      status: 'local', tags: ['instagram', 'carousel'], starred: false, source: 'batch'
    },
  ];

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleStar = (id: string) => {
    // Mock toggle star
    console.log('Toggle star:', id);
  };

  const filteredAssets = assets.filter(asset => {
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== 'all' && asset.type !== filterType) return false;
    return true;
  });

  const getStatusIcon = (status: Asset['status']) => {
    switch (status) {
      case 'synced': return <Cloud size={14} className="text-green-500" />;
      case 'local': return <HardDrive size={14} className="text-zinc-500" />;
      case 'processing': return <Loader2 size={14} className="text-amber-500 animate-spin" />;
      case 'error': return <XCircle size={14} className="text-red-500" />;
    }
  };

  const getSourceBadge = (source: Asset['source']) => {
    switch (source) {
      case 'generated': return <Badge className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-[10px]"><Sparkles size={10} className="mr-1" />AI</Badge>;
      case 'edited': return <Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px]">Edited</Badge>;
      case 'batch': return <Badge className="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 text-[10px]">Batch</Badge>;
      case 'uploaded': return <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px]">Upload</Badge>;
    }
  };


  return (
    <div className="flex h-full bg-light-bg dark:bg-dark-bg">
      {/* Sidebar - Folders */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FolderOpen size={20} className="text-repix-500" />
            {trans.assets.title}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">{trans.assets.subtitle}</p>
        </div>

        {/* Storage Info */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500">{trans.assets.storageUsed}</span>
            <span className="text-xs font-medium text-zinc-900 dark:text-white">2.4 GB / 10 GB</span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full w-[24%] bg-gradient-to-r from-repix-500 to-pink-500 rounded-full" />
          </div>
          <button className="mt-3 w-full text-xs text-repix-500 hover:text-repix-600 font-medium">
            {trans.assets.upgradeStorage} →
          </button>
        </div>

        {/* Folders List */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id === 'all' ? null : folder.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                (selectedFolder === folder.id || (folder.id === 'all' && !selectedFolder))
                  ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600 dark:text-repix-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${folder.color}`} />
              <span className="flex-1 text-left font-medium">{folder.name}</span>
              <span className="text-xs text-zinc-400">{folder.count}</span>
            </button>
          ))}
        </nav>

        {/* Create Folder */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="outline" className="w-full gap-2 text-sm">
            <FolderPlus size={16} />
            {trans.assets.newFolder}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface px-6 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={trans.assets.search}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-repix-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {trans.assets.filter}
                <ChevronDown size={14} />
              </Button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 z-50">
                  {[
                    { key: 'all', label: trans.assets.allTypes },
                    { key: 'image', label: trans.assets.images },
                    { key: 'project', label: trans.assets.projects },
                    { key: 'template', label: trans.assets.templates }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => { setFilterType(item.key as any); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterType === item.key 
                          ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              {sortBy === 'date' ? trans.assets.modified : sortBy === 'name' ? trans.assets.name : trans.assets.size}
            </Button>

            {/* View Mode */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
              >
                <Grid size={16} className={viewMode === 'grid' ? 'text-repix-500' : 'text-zinc-500'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
              >
                <List size={16} className={viewMode === 'list' ? 'text-repix-500' : 'text-zinc-500'} />
              </button>
            </div>

            {/* Upload */}
            <Button className="gap-2">
              <Upload size={16} />
              {trans.assets.upload}
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedAssets.length > 0 && (
          <div className="h-12 bg-repix-50 dark:bg-repix-900/20 border-b border-repix-200 dark:border-repix-800 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-repix-500" />
              <span className="text-sm font-medium text-repix-700 dark:text-repix-300">
                {selectedAssets.length} {trans.assets.selected}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-repix-600 hover:bg-repix-100 dark:hover:bg-repix-900/30">
                <Download size={16} className="mr-1" /> {trans.assets.download}
              </Button>
              <Button variant="ghost" size="sm" className="text-repix-600 hover:bg-repix-100 dark:hover:bg-repix-900/30">
                <Share2 size={16} className="mr-1" /> {trans.assets.share}
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30">
                <Trash2 size={16} className="mr-1" /> {trans.assets.delete}
              </Button>
              <button 
                onClick={() => setSelectedAssets([])}
                className="ml-2 text-xs text-zinc-500 hover:text-zinc-700"
              >
                {trans.assets.clearSelection}
              </button>
            </div>
          </div>
        )}

        {/* Assets Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  className={`group relative bg-white dark:bg-zinc-800/50 rounded-xl border overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    selectedAssets.includes(asset.id)
                      ? 'border-repix-500 ring-2 ring-repix-500/20'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                  onClick={() => toggleAssetSelection(asset.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Selection Checkbox */}
                    <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedAssets.includes(asset.id)
                        ? 'bg-repix-500 border-repix-500'
                        : 'bg-white/80 border-zinc-300 opacity-0 group-hover:opacity-100'
                    }`}>
                      {selectedAssets.includes(asset.id) && <CheckCircle2 size={12} className="text-white" />}
                    </div>

                    {/* Star */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStar(asset.id); }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                        asset.starred
                          ? 'bg-amber-500 text-white'
                          : 'bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50'
                      }`}
                    >
                      <Star size={12} fill={asset.starred ? 'currentColor' : 'none'} />
                    </button>

                    {/* Source Badge */}
                    <div className="absolute bottom-2 left-2">
                      {getSourceBadge(asset.source)}
                    </div>

                    {/* Status */}
                    <div className="absolute bottom-2 right-2 p-1 bg-white/90 dark:bg-zinc-800/90 rounded-full">
                      {getStatusIcon(asset.status)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate mb-1">
                      {asset.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{asset.dimensions}</span>
                      <span>{asset.size}</span>
                    </div>
                    {asset.brandKit && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-repix-500">
                        <Palette size={10} />
                        {asset.brandKit}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="h-8 px-3 text-xs" onClick={(e) => e.stopPropagation()}>
                      <Eye size={14} className="mr-1" /> {trans.assets.preview}
                    </Button>
                    <Button size="sm" className="h-8 px-3 text-xs" onClick={(e) => e.stopPropagation()}>
                      <Download size={14} className="mr-1" /> {trans.assets.download}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="w-10 p-3"></th>
                    <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{trans.assets.name}</th>
                    <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{trans.assets.type}</th>
                    <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{trans.assets.size}</th>
                    <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{trans.assets.modified}</th>
                    <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{trans.assets.status}</th>
                    <th className="w-20 p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(asset => (
                    <tr 
                      key={asset.id}
                      className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer ${
                        selectedAssets.includes(asset.id) ? 'bg-repix-50 dark:bg-repix-900/10' : ''
                      }`}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <td className="p-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedAssets.includes(asset.id)
                            ? 'bg-repix-500 border-repix-500'
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}>
                          {selectedAssets.includes(asset.id) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={asset.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{asset.name}</p>
                            <p className="text-xs text-zinc-500">{asset.dimensions}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{getSourceBadge(asset.source)}</td>
                      <td className="p-3 text-sm text-zinc-600 dark:text-zinc-400">{asset.size}</td>
                      <td className="p-3 text-sm text-zinc-600 dark:text-zinc-400">{asset.modifiedAt}</td>
                      <td className="p-3">{getStatusIcon(asset.status)}</td>
                      <td className="p-3">
                        <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg">
                          <MoreHorizontal size={16} className="text-zinc-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
