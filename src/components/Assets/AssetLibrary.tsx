import React, { useState } from 'react';
import {
  FolderOpen, Image, Download, Trash2, Search, Filter, Grid, List,
  Clock, Star, Tag, MoreHorizontal, Eye, Share2, Copy, ExternalLink,
  CheckCircle2, XCircle, Loader2, Cloud, HardDrive, Sparkles, Palette,
  Calendar, SortAsc, SortDesc, ChevronDown, Plus, Upload, FolderPlus,
  Smartphone, RefreshCw, Layers, Wand2
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { StorageUpgradeModal } from './StorageUpgradeModal';
import { ImportManager } from './ImportManager';
import { PhoneSyncView } from './PhoneSyncView';
import {
  ImportsView,
  AIGeneratedView,
  TrashView,
} from './views';

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
  icon: React.ReactNode;
}

export const AssetLibrary: React.FC = () => {
  const { trans, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'project' | 'template'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showImportView, setShowImportView] = useState(false);
  const [showPhoneSyncView, setShowPhoneSyncView] = useState(false);
  const [storageTotal, setStorageTotal] = useState(10); // GB
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  
  // Phone sync state from localStorage
  const [phoneSyncData, setPhoneSyncData] = useState<{
    synced: boolean;
    deviceName: string;
    lastSync: string;
    photosCount: number;
  } | null>(() => {
    const saved = localStorage.getItem('repix_phone_sync');
    return saved ? JSON.parse(saved) : null;
  });

  // Mock storage data
  const storageUsed = 2.4; // GB

  // Handle phone sync complete
  const handlePhoneSyncComplete = (deviceName: string, photosCount: number) => {
    const syncData = {
      synced: true,
      deviceName,
      lastSync: new Date().toLocaleString('vi-VN'),
      photosCount,
    };
    setPhoneSyncData(syncData);
    localStorage.setItem('repix_phone_sync', JSON.stringify(syncData));
  };

  // Handle phone disconnect
  const handlePhoneDisconnect = () => {
    setShowDisconnectConfirm(false);
    setPhoneSyncData(null);
    localStorage.removeItem('repix_phone_sync');
  };

  // Handle storage upgrade
  const handleStorageUpgrade = (newTotal: number) => {
    setStorageTotal(newTotal);
  };

  // Handle import complete
  const handleImportComplete = (importedFiles: any[]) => {
    console.log('Imported files:', importedFiles);
    // Here you would add the imported files to your assets list
  };

  // AI Tools for filtering
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const aiTools = [
    { id: 'all', name: trans.assets.allTools || 'All Tools' },
    { id: 'text-to-image', name: 'Text to Image' },
    { id: 'remove-bg', name: 'Remove Background' },
    { id: 'upscale', name: 'Upscale 4K' },
    { id: 'magic-replace', name: 'Magic Replace' },
    { id: 'gen-fill', name: 'Generative Fill' },
    { id: 'magic-erase', name: 'Magic Erase' },
  ];

  // Folders with translations
  const folders: Folder[] = [
    { id: 'all', name: trans.assets.allAssets, count: 156, color: 'bg-zinc-500', icon: <Layers size={16} className="text-zinc-500" /> },
    { id: 'my-resources', name: trans.assets.myResources || 'My Resources', count: 89, color: 'bg-blue-500', icon: <Image size={16} className="text-blue-500" /> },
    { id: 'generated', name: trans.assets.generated, count: 67, color: 'bg-purple-500', icon: <Wand2 size={16} className="text-purple-500" /> },
    { id: 'trash', name: trans.assets.trash || 'Trash', count: 5, color: 'bg-red-500', icon: <Trash2 size={16} className="text-red-500" /> },
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
            <span className="text-xs font-medium text-zinc-900 dark:text-white">{storageUsed} GB / {storageTotal} GB</span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-repix-500 to-pink-500 rounded-full transition-all" 
              style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
            />
          </div>
          <button 
            onClick={() => setShowStorageModal(true)}
            className="mt-3 w-full text-xs text-repix-500 hover:text-repix-600 font-medium flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-repix-50 dark:hover:bg-repix-900/20 transition-colors"
          >
            <Cloud size={12} />
            {trans.assets.upgradeStorage} →
          </button>
        </div>

        {/* Folders List */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => {
                setSelectedFolder(folder.id === 'all' ? null : folder.id);
                setShowImportView(false);
                setShowPhoneSyncView(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                (selectedFolder === folder.id || (folder.id === 'all' && !selectedFolder)) && !showImportView && !showPhoneSyncView
                  ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600 dark:text-repix-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {folder.icon}
              <span className="flex-1 text-left font-medium">{folder.name}</span>
              <span className="text-xs text-zinc-400">{folder.count}</span>
            </button>
          ))}
        </nav>

        {/* Phone Sync Section */}
        {phoneSyncData ? (
          /* Synced State */
          <div className="mx-3 mb-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500 rounded-lg">
                  <Smartphone size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{phoneSyncData.deviceName}</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 size={8} />
                    {trans.assets?.connected || 'Connected'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPhoneSyncView(true)}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <MoreHorizontal size={14} className="text-zinc-500" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {phoneSyncData.lastSync}
              </span>
              <span>{phoneSyncData.photosCount} {trans.assets?.photos || 'photos'}</span>
            </div>
            
            <div className="flex gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-7 text-[10px] gap-1"
                onClick={() => setShowPhoneSyncView(true)}
              >
                <RefreshCw size={10} />
                Sync
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] text-zinc-500"
                onClick={() => setShowDisconnectConfirm(true)}
              >
                {trans.assets?.disconnect || 'Disconnect'}
              </Button>
            </div>

            {/* Disconnect Confirmation Modal */}
            {showDisconnectConfirm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-sm p-6">
                  <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
                    <Smartphone size={28} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white text-center mb-2">
                    {language === 'vi' ? 'Ngắt kết nối thiết bị?' : 'Disconnect Device?'}
                  </h3>
                  <p className="text-sm text-zinc-500 text-center mb-6">
                    {language === 'vi' 
                      ? `Bạn có chắc muốn ngắt kết nối ${phoneSyncData?.deviceName}? Bạn sẽ cần quét mã QR lại để kết nối.`
                      : `Are you sure you want to disconnect ${phoneSyncData?.deviceName}? You'll need to scan QR code again to reconnect.`}
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowDisconnectConfirm(false)}
                    >
                      {language === 'vi' ? 'Hủy' : 'Cancel'}
                    </Button>
                    <Button 
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                      onClick={handlePhoneDisconnect}
                    >
                      {language === 'vi' ? 'Ngắt kết nối' : 'Disconnect'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Not Synced State */
          <div className="mx-3 mb-3 p-3 bg-gradient-to-br from-repix-500/10 to-pink-500/10 dark:from-repix-900/30 dark:to-pink-900/30 rounded-xl border border-repix-200 dark:border-repix-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-repix-500 to-pink-500 rounded-lg">
                <Smartphone size={14} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                {trans.assets.syncPhone || 'Sync from Phone'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
              {trans.assets.syncPhoneDesc || 'Sync photos from your phone with just one click!'}
            </p>
            <Button 
              size="sm" 
              className="w-full h-8 text-xs bg-gradient-to-r from-repix-500 to-pink-500 hover:from-repix-600 hover:to-pink-600 gap-1.5"
              onClick={() => setShowPhoneSyncView(true)}
            >
              <RefreshCw size={12} />
              {trans.assets.syncNow || 'Sync Now'}
            </Button>
          </div>
        )}

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-dark-surface">
        {/* Global Header Bar with Cloud + Actions */}
        {!showImportView && !showPhoneSyncView && (
          <div className="px-6 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
            {/* Cloud Services */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Cloud size={14} />
                <span>Cloud:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Google Drive */}
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                  <svg viewBox="0 0 87.3 78" className="w-4 h-4">
                    <path fill="#0066DA" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H1c0 1.55.4 3.1 1.2 4.5l4.4 9.35z"/>
                    <path fill="#00AC47" d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 52.35c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z"/>
                    <path fill="#EA4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85L73.55 76.8z"/>
                    <path fill="#00832D" d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.45-4.5 1.2L43.65 25z"/>
                    <path fill="#2684FC" d="M59.85 53H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2L59.85 53z"/>
                    <path fill="#FFBA00" d="M73.4 26.5L60.1 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28h27.45c0-1.55-.4-3.1-1.2-4.5l-12.7-22z"/>
                  </svg>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Google Drive</span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-8" onClick={() => setShowPhoneSyncView(true)}>
                <Smartphone size={14} />
                {trans.assets.syncPhone || 'From Phone'}
              </Button>
              <Button size="sm" className="gap-2 h-8" onClick={() => setShowImportView(true)}>
                <Upload size={14} />
                {trans.assets.upload || 'New Import'}
              </Button>
            </div>
          </div>
        )}

        {/* Render Views */}
        {showPhoneSyncView ? (
          <PhoneSyncView
            onBack={() => setShowPhoneSyncView(false)}
            onSyncComplete={handlePhoneSyncComplete}
          />
        ) : showImportView ? (
          <ImportManager 
            onBack={() => setShowImportView(false)}
            onImportComplete={(files) => {
              handleImportComplete(files);
              setShowImportView(false);
            }}
          />
        ) : selectedFolder === 'my-resources' ? (
          <ImportsView 
            onOpenImportManager={() => setShowImportView(true)}
            onOpenPhoneSync={() => setShowPhoneSyncView(true)}
          />
        ) : selectedFolder === 'generated' ? (
          <AIGeneratedView 
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            aiTools={aiTools}
          />
        ) : selectedFolder === 'trash' ? (
          <TrashView />
        ) : (
          /* Default All Assets View */
          <>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 2xl:gap-4">
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
          </>
        )}
      </main>

      {/* Storage Upgrade Modal */}
      <StorageUpgradeModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        currentUsed={storageUsed}
        currentTotal={storageTotal}
        onUpgrade={handleStorageUpgrade}
      />
    </div>
  );
};
