import React, { useState } from 'react';
import {
  Upload, Link2, Smartphone, Cloud, Calendar, MoreHorizontal,
  Download, Trash2, Eye, CheckCircle2, Clock, Globe, HardDrive,
  Check, Plus, Settings, ExternalLink, RefreshCw, Search, Filter,
  ChevronDown, ArrowUpDown, SortAsc, SortDesc, FileText, Grid, List
} from 'lucide-react';
import { Button, Badge, Card } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

// Cloud service icons as components
const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M12 11L7.5 3h9L12 11z"/>
    <path fill="#FBBC05" d="M7.5 3L3 11l4.5 8h9l-4.5-8L7.5 3z"/>
    <path fill="#34A853" d="M16.5 11L12 19h9l-4.5-8z"/>
    <path fill="#EA4335" d="M3 11l4.5 8h9L12 11 7.5 3 3 11z" opacity="0"/>
  </svg>
);

const DropboxIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#0061FF" d="M6 2l6 4-6 4 6 4-6 4-6-4 6-4-6-4 6-4zm12 0l6 4-6 4 6 4-6 4-6-4 6-4-6-4 6-4z"/>
  </svg>
);

const OneDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#0078D4" d="M12.5 6C9.5 6 7 8.5 7 11.5c0 .2 0 .3.1.5C4.2 12.3 2 14.7 2 17.5 2 20.5 4.5 23 7.5 23h12c2.8 0 5-2.2 5-5 0-2.5-1.8-4.5-4.2-4.9C19.5 9.3 16.3 6 12.5 6z"/>
  </svg>
);

const iCloudIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#3693F3" d="M19.5 11c-.2-3.3-2.9-6-6-6-2.6 0-4.8 1.6-5.7 4-.4-.1-.8-.1-1.3-.1C3.5 8.9 1 11.4 1 14.5S3.5 20 6.5 20h12c2.5 0 4.5-2 4.5-4.5 0-2.3-1.8-4.2-4-4.5h.5z"/>
  </svg>
);

interface CloudService {
  id: string;
  name: string;
  icon: React.FC;
  connected: boolean;
  email?: string;
  color: string;
}

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
  const [showCloudPanel, setShowCloudPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Cloud services state
  const [cloudServices, setCloudServices] = useState<CloudService[]>([
    { id: 'gdrive', name: 'Google Drive', icon: GoogleDriveIcon, connected: true, email: 'user@gmail.com', color: 'bg-blue-500' },
    { id: 'dropbox', name: 'Dropbox', icon: DropboxIcon, connected: false, color: 'bg-blue-600' },
    { id: 'onedrive', name: 'OneDrive', icon: OneDriveIcon, connected: true, email: 'user@outlook.com', color: 'bg-sky-500' },
    { id: 'icloud', name: 'iCloud', icon: iCloudIcon, connected: false, color: 'bg-blue-400' },
  ]);

  const toggleCloudConnection = (serviceId: string) => {
    setCloudServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, connected: !s.connected, email: !s.connected ? 'user@example.com' : undefined } : s
    ));
  };

  const connectedCount = cloudServices.filter(s => s.connected).length;

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
      {/* Search & Sort Toolbar */}
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-white dark:bg-dark-surface">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm ảnh...' : 'Search images...'}
            className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-repix-500"
          />
        </div>

        {/* Filter & Sort */}
        <div className="flex items-center gap-2">
          {/* Source Filter */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowSourceFilter(!showSourceFilter)}
            >
              <Filter size={14} />
              {filterSource === 'all' 
                ? (language === 'vi' ? 'Tất cả nguồn' : 'All Sources')
                : filterSource === 'phone' ? (language === 'vi' ? 'Điện thoại' : 'Phone')
                : filterSource === 'cloud' ? 'Cloud'
                : filterSource === 'url' ? 'URL'
                : (language === 'vi' ? 'Máy tính' : 'Computer')
              }
              <ChevronDown size={14} />
            </Button>
            
            {showSourceFilter && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSourceFilter(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 z-50">
                  {[
                    { key: 'all', label: language === 'vi' ? 'Tất cả nguồn' : 'All Sources', icon: Upload },
                    { key: 'local', label: language === 'vi' ? 'Máy tính' : 'Computer', icon: HardDrive },
                    { key: 'phone', label: language === 'vi' ? 'Điện thoại' : 'Phone', icon: Smartphone },
                    { key: 'url', label: 'URL', icon: Link2 },
                    { key: 'cloud', label: 'Cloud', icon: Cloud },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => { setFilterSource(item.key as any); setShowSourceFilter(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        filterSource === item.key 
                          ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort By */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <ArrowUpDown size={14} />
              {sortBy === 'date' 
                ? (language === 'vi' ? 'Ngày' : 'Date')
                : sortBy === 'size' 
                ? (language === 'vi' ? 'Kích thước' : 'Size')
                : (language === 'vi' ? 'Tên' : 'Name')
              }
              <ChevronDown size={14} />
            </Button>
            
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 z-50">
                  {[
                    { key: 'date', label: language === 'vi' ? 'Ngày import' : 'Import Date', icon: Calendar },
                    { key: 'size', label: language === 'vi' ? 'Kích thước' : 'File Size', icon: HardDrive },
                    { key: 'name', label: language === 'vi' ? 'Tên file' : 'File Name', icon: FileText },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => { setSortBy(item.key as any); setShowSortMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        sortBy === item.key 
                          ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Order */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 px-2"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? (language === 'vi' ? 'Tăng dần' : 'Ascending') : (language === 'vi' ? 'Giảm dần' : 'Descending')}
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
              title={language === 'vi' ? 'Dạng lưới' : 'Grid view'}
            >
              <Grid size={16} className={viewMode === 'grid' ? 'text-repix-500' : 'text-zinc-500'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
              title={language === 'vi' ? 'Dạng danh sách' : 'List view'}
            >
              <List size={16} className={viewMode === 'list' ? 'text-repix-500' : 'text-zinc-500'} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">
              {imports.filter(a => (filterSource === 'all' || a.source === filterSource) && (!searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()))).length} {language === 'vi' ? 'ảnh' : 'images'}
            </span>
            {(filterSource !== 'all' || searchQuery) && (
              <button 
                onClick={() => { setFilterSource('all'); setSearchQuery(''); }}
                className="text-xs text-repix-500 hover:text-repix-600 underline"
              >
                {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
              </button>
            )}
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {imports
              .filter(asset => {
                if (filterSource !== 'all' && asset.source !== filterSource) return false;
                if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
              })
              .sort((a, b) => {
                let comparison = 0;
                if (sortBy === 'date') {
                  comparison = new Date(a.importedAt).getTime() - new Date(b.importedAt).getTime();
                } else if (sortBy === 'size') {
                  comparison = parseFloat(a.size) - parseFloat(b.size);
                } else if (sortBy === 'name') {
                  comparison = a.name.localeCompare(b.name);
                }
                return sortOrder === 'asc' ? comparison : -comparison;
              })
              .map(asset => (
              <div
                key={asset.id}
                className="group relative bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 text-[10px] gap-1">
                      {getSourceIcon(asset.source)}
                      {getSourceLabel(asset.source, asset.sourceName)}
                    </Badge>
                  </div>

                  {asset.status === 'processing' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-xs flex items-center gap-2">
                        <Clock size={14} className="animate-spin" />
                        {language === 'vi' ? 'Đang xử lý...' : 'Processing...'}
                      </div>
                    </div>
                  )}

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
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase w-12"></th>
                  <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Tên file' : 'Name'}</th>
                  <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Nguồn' : 'Source'}</th>
                  <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Kích thước' : 'Size'}</th>
                  <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Ngày import' : 'Imported'}</th>
                  <th className="text-left p-3 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                  <th className="w-20 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {imports
                  .filter(asset => {
                    if (filterSource !== 'all' && asset.source !== filterSource) return false;
                    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  })
                  .sort((a, b) => {
                    let comparison = 0;
                    if (sortBy === 'date') {
                      comparison = new Date(a.importedAt).getTime() - new Date(b.importedAt).getTime();
                    } else if (sortBy === 'size') {
                      comparison = parseFloat(a.size) - parseFloat(b.size);
                    } else if (sortBy === 'name') {
                      comparison = a.name.localeCompare(b.name);
                    }
                    return sortOrder === 'asc' ? comparison : -comparison;
                  })
                  .map(asset => (
                  <tr 
                    key={asset.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="p-3">
                      <img src={asset.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{asset.name}</p>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] gap-1">
                        {getSourceIcon(asset.source)}
                        {getSourceLabel(asset.source, asset.sourceName)}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-zinc-600 dark:text-zinc-400">{asset.size}</td>
                    <td className="p-3 text-sm text-zinc-600 dark:text-zinc-400">{asset.importedAt}</td>
                    <td className="p-3">
                      {asset.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px]">
                          <CheckCircle2 size={10} className="mr-1" />
                          {language === 'vi' ? 'Hoàn tất' : 'Done'}
                        </Badge>
                      ) : asset.status === 'processing' ? (
                        <Badge className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-[10px]">
                          <Clock size={10} className="mr-1 animate-spin" />
                          {language === 'vi' ? 'Đang xử lý' : 'Processing'}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px]">
                          {language === 'vi' ? 'Lỗi' : 'Failed'}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
