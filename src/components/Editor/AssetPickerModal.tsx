import React, { useState, useMemo } from 'react';
import {
  X, ImagePlus, Upload, Smartphone, Link2, Cloud,
  HardDrive, Globe, Calendar, Search, Grid3X3, List,
  ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Check,
  SlidersHorizontal, Filter
} from 'lucide-react';
import { Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface Asset {
  id: string;
  src: string;
  name: string;
  source?: 'local' | 'phone' | 'url' | 'cloud';
  size?: string;
  sizeBytes?: number;
  date?: string;
  dateTimestamp?: number;
}

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
  onSelectMultiple?: (assets: Asset[]) => void;
  maxSelection?: number;
  multiSelect?: boolean;
}

type SortField = 'name' | 'date' | 'size' | 'source';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

const MAX_SELECTION = 5;

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  onSelectMultiple,
  maxSelection = MAX_SELECTION,
  multiSelect = true,
}) => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'phone' | 'url' | 'cloud'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  // Mock imported assets with source info
  const allAssets: Asset[] = [
    { id: 'asset-1', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', name: 'Product_001.jpg', source: 'local', size: '2.4 MB', sizeBytes: 2516582, date: '2024-12-10', dateTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { id: 'asset-2', src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop', name: 'Sneaker_white.png', source: 'phone', size: '1.8 MB', sizeBytes: 1887436, date: '2024-12-09', dateTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    { id: 'asset-3', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', name: 'Watch_hero.jpg', source: 'url', size: '3.1 MB', sizeBytes: 3250585, date: '2024-12-08', dateTimestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    { id: 'asset-4', src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop', name: 'Perfume_shot.jpg', source: 'cloud', size: '4.2 MB', sizeBytes: 4404019, date: '2024-12-07', dateTimestamp: Date.now() - 6 * 24 * 60 * 60 * 1000 },
    { id: 'asset-5', src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop', name: 'Cosmetics_flat.jpg', source: 'phone', size: '2.9 MB', sizeBytes: 3040870, date: '2024-12-06', dateTimestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 },
    { id: 'asset-6', src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop', name: 'Nike_running.png', source: 'local', size: '1.5 MB', sizeBytes: 1572864, date: '2024-12-05', dateTimestamp: Date.now() - 8 * 24 * 60 * 60 * 1000 },
    { id: 'asset-7', src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop', name: 'Sneaker_red.jpg', source: 'url', size: '2.1 MB', sizeBytes: 2202009, date: '2024-12-04', dateTimestamp: Date.now() - 9 * 24 * 60 * 60 * 1000 },
    { id: 'asset-8', src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop', name: 'Shoes_studio.jpg', source: 'cloud', size: '3.8 MB', sizeBytes: 3984588, date: '2024-12-03', dateTimestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 },
    { id: 'asset-9', src: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop', name: 'Product_flat.jpg', source: 'phone', size: '2.2 MB', sizeBytes: 2306867, date: '2024-12-02', dateTimestamp: Date.now() - 11 * 24 * 60 * 60 * 1000 },
    { id: 'asset-10', src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop', name: 'Bag_luxury.jpg', source: 'local', size: '4.5 MB', sizeBytes: 4718592, date: '2024-12-01', dateTimestamp: Date.now() - 12 * 24 * 60 * 60 * 1000 },
    { id: 'asset-11', src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', name: 'Headphones.jpg', source: 'url', size: '1.9 MB', sizeBytes: 1992294, date: '2024-11-30', dateTimestamp: Date.now() - 13 * 24 * 60 * 60 * 1000 },
    { id: 'asset-12', src: 'https://images.unsplash.com/photo-1491553895911-0055uj6e?w=300&h=300&fit=crop', name: 'Camera_shot.jpg', source: 'cloud', size: '3.3 MB', sizeBytes: 3460300, date: '2024-11-29', dateTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000 },
  ];

  const filterOptions = [
    { key: 'all', label: language === 'vi' ? 'Tất cả' : 'All', icon: Upload, count: allAssets.length },
    { key: 'local', label: language === 'vi' ? 'Thiết bị này' : 'This Device', icon: HardDrive, count: allAssets.filter(a => a.source === 'local').length },
    { key: 'phone', label: language === 'vi' ? 'Điện thoại' : 'Phone', icon: Smartphone, count: allAssets.filter(a => a.source === 'phone').length },
    { key: 'url', label: 'URL', icon: Link2, count: allAssets.filter(a => a.source === 'url').length },
    { key: 'cloud', label: 'Cloud', icon: Cloud, count: allAssets.filter(a => a.source === 'cloud').length },
  ];

  const getSourceIcon = (source?: Asset['source'], size = 12) => {
    switch (source) {
      case 'local': return <HardDrive size={size} />;
      case 'phone': return <Smartphone size={size} />;
      case 'url': return <Globe size={size} />;
      case 'cloud': return <Cloud size={size} />;
      default: return <HardDrive size={size} />;
    }
  };

  const getSourceLabel = (source?: Asset['source']) => {
    switch (source) {
      case 'local': return language === 'vi' ? 'Thiết bị' : 'Device';
      case 'phone': return language === 'vi' ? 'Điện thoại' : 'Phone';
      case 'url': return 'URL';
      case 'cloud': return 'Cloud';
      default: return 'Unknown';
    }
  };

  // Filter and sort assets
  const processedAssets = useMemo(() => {
    let result = [...allAssets];

    // Apply source filter
    if (activeFilter !== 'all') {
      result = result.filter(a => a.source === activeFilter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(query));
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = (a.dateTimestamp || 0) - (b.dateTimestamp || 0);
          break;
        case 'size':
          comparison = (a.sizeBytes || 0) - (b.sizeBytes || 0);
          break;
        case 'source':
          comparison = (a.source || '').localeCompare(b.source || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [allAssets, activeFilter, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-zinc-400" />;
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-repix-500" />
      : <ArrowDown size={14} className="text-repix-500" />;
  };

  const currentFilter = filterOptions.find(f => f.key === activeFilter);

  const isSelected = (assetId: string) => selectedAssets.some(a => a.id === assetId);
  const canSelectMore = selectedAssets.length < maxSelection;

  const toggleAssetSelection = (asset: Asset, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!multiSelect) {
      onSelectAsset(asset);
      return;
    }

    if (isSelected(asset.id)) {
      setSelectedAssets(prev => prev.filter(a => a.id !== asset.id));
    } else if (canSelectMore) {
      setSelectedAssets(prev => [...prev, asset]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAssets.length > 0) {
      if (onSelectMultiple) {
        onSelectMultiple(selectedAssets);
      } else {
        // Fallback: call onSelectAsset for each
        selectedAssets.forEach(asset => onSelectAsset(asset));
      }
      setSelectedAssets([]);
      onClose();
    }
  };

  const clearSelection = () => {
    setSelectedAssets([]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <ImagePlus size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Chọn từ My Assets' : 'Select from My Assets'}
              </h2>
              <p className="text-sm text-zinc-500">
                {processedAssets.length} {language === 'vi' ? 'ảnh' : 'images'}
                {activeFilter !== 'all' && ` • ${currentFilter?.label}`}
                {multiSelect && (
                  <span className="ml-2">
                    • {language === 'vi' ? `Tối đa ${maxSelection} ảnh` : `Max ${maxSelection} images`}
                  </span>
                )}
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

        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm kiếm ảnh...' : 'Search images...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-repix-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
              >
                <Filter size={16} className="text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {currentFilter?.label}
                </span>
                {activeFilter !== 'all' && (
                  <Badge className="bg-repix-100 text-repix-600 dark:bg-repix-900/30 dark:text-repix-400 text-xs px-1.5 py-0">
                    {currentFilter?.count}
                  </Badge>
                )}
                <ChevronDown size={16} className="text-zinc-400" />
              </button>

              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl z-20 overflow-hidden">
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        {language === 'vi' ? 'Nguồn' : 'Source'}
                      </p>
                      {filterOptions.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setActiveFilter(option.key as typeof activeFilter);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            activeFilter === option.key
                              ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600 dark:text-repix-400'
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <option.icon size={16} />
                          <span className="flex-1 text-left text-sm">{option.label}</span>
                          <span className="text-xs text-zinc-500">{option.count}</span>
                          {activeFilter === option.key && (
                            <Check size={16} className="text-repix-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-repix-100 dark:bg-repix-900/30 text-repix-600'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-repix-100 dark:bg-repix-900/30 text-repix-600'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {processedAssets.length > 0 ? (
            viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {processedAssets.map((asset) => {
                  const selected = isSelected(asset.id);
                  const selectionIndex = selectedAssets.findIndex(a => a.id === asset.id) + 1;
                  const disabled = !selected && !canSelectMore;
                  
                  return (
                    <button
                      key={asset.id}
                      onClick={() => toggleAssetSelection(asset)}
                      disabled={disabled}
                      className={`group relative bg-white dark:bg-zinc-800/50 rounded-xl border-2 overflow-hidden transition-all ${
                        selected 
                          ? 'border-repix-500 shadow-lg ring-2 ring-repix-500/20' 
                          : disabled
                            ? 'border-zinc-200 dark:border-zinc-700 opacity-50 cursor-not-allowed'
                            : 'border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:border-repix-500'
                      }`}
                    >
                      <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <img 
                          src={asset.src} 
                          alt={asset.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${!disabled && 'group-hover:scale-105'}`}
                        />
                        
                        {/* Selection Checkbox */}
                        {multiSelect && (
                          <div className="absolute top-2 right-2 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              selected 
                                ? 'bg-repix-500 text-white' 
                                : 'bg-white/80 dark:bg-zinc-800/80 border-2 border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {selected ? (
                                <span className="text-xs font-bold">{selectionIndex}</span>
                              ) : (
                                <Check size={12} className="text-zinc-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Source Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 text-[9px] gap-1 px-1.5 py-0.5">
                            {getSourceIcon(asset.source, 10)}
                          </Badge>
                        </div>

                        {/* Selected Overlay */}
                        {selected && (
                          <div className="absolute inset-0 bg-repix-500/10 pointer-events-none" />
                        )}

                        {/* Hover Overlay */}
                        {!selected && !disabled && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <ImagePlus size={18} className="text-repix-500" />
                            </div>
                          </div>
                        )}
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
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                      {multiSelect && (
                        <th className="w-12 px-4 py-3">
                          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">#</span>
                        </th>
                      )}
                      <th className="text-left px-4 py-3">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          {language === 'vi' ? 'Tên' : 'Name'}
                          {getSortIcon('name')}
                        </button>
                      </th>
                      <th className="text-left px-4 py-3">
                        <button
                          onClick={() => handleSort('source')}
                          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          {language === 'vi' ? 'Nguồn' : 'Source'}
                          {getSortIcon('source')}
                        </button>
                      </th>
                      <th className="text-left px-4 py-3">
                        <button
                          onClick={() => handleSort('size')}
                          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          {language === 'vi' ? 'Kích thước' : 'Size'}
                          {getSortIcon('size')}
                        </button>
                      </th>
                      <th className="text-left px-4 py-3">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          {language === 'vi' ? 'Ngày' : 'Date'}
                          {getSortIcon('date')}
                        </button>
                      </th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedAssets.map((asset, index) => {
                      const selected = isSelected(asset.id);
                      const selectionIndex = selectedAssets.findIndex(a => a.id === asset.id) + 1;
                      const disabled = !selected && !canSelectMore;
                      
                      return (
                        <tr
                          key={asset.id}
                          onClick={() => !disabled && toggleAssetSelection(asset)}
                          className={`transition-colors ${
                            selected 
                              ? 'bg-repix-50 dark:bg-repix-900/20' 
                              : disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-repix-50 dark:hover:bg-repix-900/10'
                          } ${index !== processedAssets.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                        >
                          {multiSelect && (
                            <td className="px-4 py-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                selected 
                                  ? 'bg-repix-500 text-white' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600'
                              }`}>
                                {selected && <span className="text-xs font-bold">{selectionIndex}</span>}
                              </div>
                            </td>
                          )}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 ${selected ? 'ring-2 ring-repix-500' : ''}`}>
                                <img 
                                  src={asset.src} 
                                  alt={asset.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium text-sm text-zinc-900 dark:text-white truncate max-w-[200px]">
                                {asset.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              {getSourceIcon(asset.source, 14)}
                              <span>{getSourceLabel(asset.source)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                            {asset.size}
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                            {asset.date}
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={(e) => toggleAssetSelection(asset, e)}
                              disabled={disabled}
                              className={`p-2 rounded-lg transition-colors ${
                                selected 
                                  ? 'bg-repix-500 text-white' 
                                  : disabled
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                    : 'bg-repix-100 dark:bg-repix-900/30 text-repix-600 hover:bg-repix-200 dark:hover:bg-repix-900/50'
                              }`}
                            >
                              {selected ? <Check size={16} /> : <ImagePlus size={16} />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <ImagePlus size={32} className="text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Không tìm thấy ảnh' : 'No images found'}
              </h3>
              <p className="text-zinc-500 text-sm">
                {searchQuery 
                  ? (language === 'vi' ? 'Thử từ khóa khác' : 'Try a different search term')
                  : (language === 'vi' ? 'Thử chọn bộ lọc khác' : 'Try selecting a different filter')
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 shrink-0">
          {multiSelect && selectedAssets.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Selected thumbnails */}
                <div className="flex items-center -space-x-2">
                  {selectedAssets.slice(0, 5).map((asset, idx) => (
                    <div 
                      key={asset.id}
                      className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm"
                      style={{ zIndex: 5 - idx }}
                    >
                      <img src={asset.src} alt={asset.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {selectedAssets.length} {language === 'vi' ? 'ảnh đã chọn' : 'images selected'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {language === 'vi' ? `Còn ${maxSelection - selectedAssets.length} slot` : `${maxSelection - selectedAssets.length} slots remaining`}
                  </p>
                </div>
                <button
                  onClick={clearSelection}
                  className="text-xs text-zinc-500 hover:text-red-500 underline ml-2"
                >
                  {language === 'vi' ? 'Bỏ chọn tất cả' : 'Clear all'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmSelection}
                  className="px-5 py-2.5 bg-gradient-to-r from-repix-500 to-pink-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Check size={16} />
                  {language === 'vi' ? `Chọn ${selectedAssets.length} ảnh` : `Select ${selectedAssets.length} images`}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                {multiSelect 
                  ? (language === 'vi' ? 'Click vào ảnh để chọn (tối đa 5 ảnh)' : 'Click on images to select (max 5 images)')
                  : (language === 'vi' ? 'Vào My Assets để import thêm ảnh' : 'Go to My Assets to import more images')
                }
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
