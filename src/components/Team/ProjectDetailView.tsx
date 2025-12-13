import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Upload,
  Plus,
  Wand2,
  MoreVertical,
  LayoutGrid,
  ListTodo,
  Users,
  Settings,
  FolderOpen,
  Image,
  FileText,
  Video,
  Music,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Download,
  Trash2,
  Share2,
  Copy,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Crown,
  User,
  Mail,
  Link2,
  ExternalLink,
  Palette,
  Layers,
  Tag,
  Calendar,
  BarChart3,
  X,
  Check,
  ChevronDown,
  FolderPlus,
  Move,
  Star,
  StarOff,
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { Project } from '../../types';

interface ProjectDetailViewProps {
  project: Partial<Project>;
  onBack: () => void;
}

type TabType = 'assets' | 'kanban' | 'members' | 'settings';
type AssetCategory = 'all' | 'images' | 'videos' | 'documents' | 'audio';
type ViewMode = 'grid' | 'list';

interface ProjectAsset {
  id: string;
  name: string;
  src: string;
  type: 'image' | 'video' | 'document' | 'audio';
  status: 'approved' | 'in_review' | 'draft' | 'rejected';
  size: string;
  sizeBytes: number;
  format: string;
  uploadedBy: string;
  uploadedAt: Date;
  folder?: string;
  starred: boolean;
  comments: number;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'lead' | 'member';
  joinedAt: string;
  isOnline: boolean;
  tasksCompleted: number;
  assetsUploaded: number;
}

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

// Mock data with actual timestamps
const mockAssets: ProjectAsset[] = [
  { id: '1', name: 'Hero_Banner.jpg', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', type: 'image', status: 'approved', size: '2.4 MB', sizeBytes: 2516582, format: 'JPG', uploadedBy: 'Sarah', uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), folder: 'Banners', starred: true, comments: 3 },
  { id: '2', name: 'Instagram_Post.png', src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop', type: 'image', status: 'in_review', size: '1.8 MB', sizeBytes: 1887436, format: 'PNG', uploadedBy: 'Mike', uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), folder: 'Social', starred: false, comments: 1 },
  { id: '3', name: 'Email_Header.jpg', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', type: 'image', status: 'draft', size: '1.2 MB', sizeBytes: 1258291, format: 'JPG', uploadedBy: 'You', uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), folder: 'Email', starred: false, comments: 0 },
  { id: '4', name: 'Product_Shot.png', src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop', type: 'image', status: 'approved', size: '3.1 MB', sizeBytes: 3250585, format: 'PNG', uploadedBy: 'Sarah', uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), folder: 'Products', starred: true, comments: 5 },
  { id: '5', name: 'Brand_Video.mp4', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', type: 'video', status: 'in_review', size: '45 MB', sizeBytes: 47185920, format: 'MP4', uploadedBy: 'Mike', uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), folder: 'Videos', starred: false, comments: 2 },
  { id: '6', name: 'Guidelines.pdf', src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=300&fit=crop', type: 'document', status: 'approved', size: '2.8 MB', sizeBytes: 2936012, format: 'PDF', uploadedBy: 'You', uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), folder: 'Documents', starred: false, comments: 0 },
];

const mockMembers: ProjectMember[] = [
  { id: 'u1', name: 'Sarah Designer', email: 'sarah@company.com', avatar: 'https://picsum.photos/seed/sarah/50', role: 'lead', joinedAt: '15/01/2024', isOnline: true, tasksCompleted: 24, assetsUploaded: 45 },
  { id: 'u2', name: 'Mike Product', email: 'mike@company.com', avatar: 'https://picsum.photos/seed/mike/50', role: 'member', joinedAt: '20/01/2024', isOnline: true, tasksCompleted: 18, assetsUploaded: 32 },
  { id: 'u3', name: 'Jessica Marketing', email: 'jessica@company.com', avatar: 'https://picsum.photos/seed/jessica/50', role: 'member', joinedAt: '25/01/2024', isOnline: false, tasksCompleted: 12, assetsUploaded: 15 },
  { id: 'u0', name: 'Bạn', email: 'you@repix.ai', avatar: 'https://picsum.photos/seed/you/50', role: 'member', joinedAt: '01/02/2024', isOnline: true, tasksCompleted: 8, assetsUploaded: 20 },
];

const mockKanbanTasks: Record<string, KanbanTask[]> = {
  todo: [
    { id: 't1', title: 'Design hero banner for homepage', assignee: 'Sarah', assigneeAvatar: 'https://picsum.photos/seed/sarah/30', dueDate: '15/12', priority: 'high', tags: ['Design', 'Urgent'] },
    { id: 't2', title: 'Create Instagram carousel', assignee: 'Mike', assigneeAvatar: 'https://picsum.photos/seed/mike/30', dueDate: '18/12', priority: 'medium', tags: ['Social'] },
  ],
  in_progress: [
    { id: 't3', title: 'Email campaign assets', assignee: 'You', assigneeAvatar: 'https://picsum.photos/seed/you/30', dueDate: '16/12', priority: 'high', tags: ['Email', 'Marketing'] },
  ],
  review: [
    { id: 't4', title: 'Product photography editing', assignee: 'Sarah', assigneeAvatar: 'https://picsum.photos/seed/sarah/30', dueDate: '14/12', priority: 'medium', tags: ['Product'] },
  ],
  done: [
    { id: 't5', title: 'Brand guidelines document', assignee: 'Jessica', assigneeAvatar: 'https://picsum.photos/seed/jessica/30', dueDate: '10/12', priority: 'low', tags: ['Docs'] },
  ],
};

const folders = ['All', 'Banners', 'Social', 'Email', 'Products', 'Videos', 'Documents'];

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onBack }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('assets');
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getStatusBadge = (status: ProjectAsset['status']) => {
    const styles = {
      approved: 'bg-green-500 text-white',
      in_review: 'bg-amber-500 text-white',
      draft: 'bg-zinc-500 text-white',
      rejected: 'bg-red-500 text-white',
    };
    const labels = {
      approved: language === 'vi' ? 'Đã duyệt' : 'Approved',
      in_review: language === 'vi' ? 'Đang xét' : 'In Review',
      draft: language === 'vi' ? 'Nháp' : 'Draft',
      rejected: language === 'vi' ? 'Từ chối' : 'Rejected',
    };
    return <Badge className={`${styles[status]} border-0 text-[10px] px-1.5`}>{labels[status]}</Badge>;
  };

  const getTypeIcon = (type: ProjectAsset['type']) => {
    const icons = { image: Image, video: Video, document: FileText, audio: Music };
    const Icon = icons[type];
    return <Icon size={14} />;
  };

  // Format date to detailed time
  const formatDateTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    // If less than 24 hours, show relative time
    if (days < 1) {
      if (minutes < 1) return language === 'vi' ? 'Vừa xong' : 'Just now';
      if (minutes < 60) return `${minutes} ${language === 'vi' ? 'phút trước' : 'min ago'}`;
      return `${hours} ${language === 'vi' ? 'giờ trước' : 'hours ago'}`;
    }
    
    // Otherwise show full date time
    return date.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle column sort
  const handleSort = (column: 'name' | 'date' | 'size') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder(column === 'date' ? 'desc' : 'asc');
    }
  };

  // Filter and sort assets
  const filteredAssets = mockAssets
    .filter(asset => {
      if (assetCategory !== 'all' && asset.type !== assetCategory.slice(0, -1)) return false;
      if (selectedFolder !== 'All' && asset.folder !== selectedFolder) return false;
      if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
          break;
        case 'size':
          comparison = a.sizeBytes - b.sizeBytes;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  // Sort indicator component
  const SortIndicator = ({ column }: { column: 'name' | 'date' | 'size' }) => {
    if (sortBy !== column) return <ChevronDown size={14} className="text-zinc-300" />;
    return sortOrder === 'asc' 
      ? <SortAsc size={14} className="text-repix-500" />
      : <SortAsc size={14} className="text-repix-500 rotate-180" />;
  };

  return (
    <div className="flex flex-col h-full bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-dark-surface">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-500">
            <ArrowLeft size={16} className="mr-2" /> {language === 'vi' ? 'Quay lại' : 'Back'}
          </Button>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <h2 className="font-bold text-zinc-900 dark:text-white">{project.name}</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Settings size={10} />
              <span>{project.status}</span>
              <span>•</span>
              <span>{project.lastEdited}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Settings size={16} />
          </Button>
          <Button size="sm" className="shadow-lg shadow-repix-500/20">
            <Wand2 size={16} className="mr-2" />
            {language === 'vi' ? 'Mở Editor' : 'Open Editor'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface">
        <div className="flex gap-1">
          {[
            { id: 'assets', label: language === 'vi' ? 'Tài sản' : 'Assets', icon: LayoutGrid },
            { id: 'kanban', label: 'Kanban', icon: ListTodo },
            { id: 'members', label: language === 'vi' ? 'Thành viên' : 'Members', icon: Users },
            { id: 'settings', label: language === 'vi' ? 'Cài đặt' : 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-repix-500 text-repix-600 dark:text-repix-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>


      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* ==================== ASSETS TAB ==================== */}
        {activeTab === 'assets' && (
          <>
            {/* Sidebar - Folders */}
            <div className="w-56 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Thư mục' : 'Folders'}
                </h3>
                <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                  <FolderPlus size={16} className="text-zinc-500" />
                </button>
              </div>
              <nav className="space-y-1 flex-1">
                {folders.map(folder => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFolder === folder
                        ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600 dark:text-repix-400'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <FolderOpen size={16} />
                    {folder}
                    <span className="ml-auto text-xs text-zinc-400">
                      {folder === 'All' ? mockAssets.length : mockAssets.filter(a => a.folder === folder).length}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Storage Info */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                  <span>{language === 'vi' ? 'Dung lượng' : 'Storage'}</span>
                  <span>2.4 GB / 10 GB</span>
                </div>
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-gradient-to-r from-repix-500 to-pink-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="h-14 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === 'vi' ? 'Tìm kiếm...' : 'Search...'}
                      className="pl-9 pr-4 h-9 w-64 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-repix-500"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                    {[
                      { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All' },
                      { id: 'images', label: language === 'vi' ? 'Ảnh' : 'Images' },
                      { id: 'videos', label: 'Video' },
                      { id: 'documents', label: 'Docs' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setAssetCategory(cat.id as AssetCategory)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          assetCategory === cat.id
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode */}
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
                    >
                      <Grid3X3 size={16} className={viewMode === 'grid' ? 'text-repix-500' : 'text-zinc-500'} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}
                    >
                      <List size={16} className={viewMode === 'list' ? 'text-repix-500' : 'text-zinc-500'} />
                    </button>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
                    <Upload size={14} className="mr-2" />
                    Upload
                  </Button>
                  <Button size="sm">
                    <Plus size={14} className="mr-2" />
                    {language === 'vi' ? 'Tạo mới' : 'New'}
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedAssets.length > 0 && (
                <div className="h-12 px-6 bg-repix-50 dark:bg-repix-900/20 border-b border-repix-200 dark:border-repix-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-repix-500" />
                    <span className="text-sm font-medium text-repix-700 dark:text-repix-300">
                      {selectedAssets.length} {language === 'vi' ? 'đã chọn' : 'selected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-repix-600">
                      <Download size={14} className="mr-1" /> Download
                    </Button>
                    <Button variant="ghost" size="sm" className="text-repix-600">
                      <Move size={14} className="mr-1" /> Move
                    </Button>
                    <Button variant="ghost" size="sm" className="text-repix-600">
                      <Share2 size={14} className="mr-1" /> Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                    <button onClick={() => setSelectedAssets([])} className="ml-2 text-xs text-zinc-500 hover:text-zinc-700">
                      {language === 'vi' ? 'Bỏ chọn' : 'Clear'}
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
                        onClick={() => toggleAssetSelection(asset.id)}
                        className={`group relative bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                          selectedAssets.includes(asset.id)
                            ? 'border-repix-500 ring-2 ring-repix-500/20'
                            : 'border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative">
                          <img src={asset.src} alt={asset.name} className="w-full h-full object-cover" />
                          
                          {/* Selection Checkbox */}
                          <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedAssets.includes(asset.id)
                              ? 'bg-repix-500 border-repix-500'
                              : 'bg-white/80 border-zinc-300 opacity-0 group-hover:opacity-100'
                          }`}>
                            {selectedAssets.includes(asset.id) && <Check size={12} className="text-white" />}
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            {getStatusBadge(asset.status)}
                          </div>

                          {/* Star */}
                          <button className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${
                            asset.starred
                              ? 'bg-amber-500 text-white'
                              : 'bg-black/30 text-white opacity-0 group-hover:opacity-100'
                          }`}>
                            {asset.starred ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
                          </button>

                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                              <Eye size={14} />
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                              <Wand2 size={14} />
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                              <MoreVertical size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate text-zinc-900 dark:text-white">{asset.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-zinc-500">{asset.size} • {asset.format}</span>
                            {asset.comments > 0 && (
                              <span className="flex items-center gap-1 text-xs text-zinc-400">
                                <MessageSquare size={10} /> {asset.comments}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Card */}
                    <div
                      onClick={() => setShowUploadModal(true)}
                      className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:border-repix-500 hover:text-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/10 transition-colors cursor-pointer aspect-square"
                    >
                      <Plus size={32} className="mb-2" />
                      <span className="text-sm font-medium">{language === 'vi' ? 'Thêm mới' : 'Add New'}</span>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                        <tr className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3 w-8"></th>
                          <th className="px-4 py-3">
                            <button 
                              onClick={() => handleSort('name')}
                              className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                              {language === 'vi' ? 'Tên' : 'Name'}
                              <SortIndicator column="name" />
                            </button>
                          </th>
                          <th className="px-4 py-3">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                          <th className="px-4 py-3">
                            <button 
                              onClick={() => handleSort('size')}
                              className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                              {language === 'vi' ? 'Kích thước' : 'Size'}
                              <SortIndicator column="size" />
                            </button>
                          </th>
                          <th className="px-4 py-3">{language === 'vi' ? 'Người tải' : 'Uploaded by'}</th>
                          <th className="px-4 py-3">
                            <button 
                              onClick={() => handleSort('date')}
                              className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                              {language === 'vi' ? 'Thời gian' : 'Time'}
                              <SortIndicator column="date" />
                            </button>
                          </th>
                          <th className="px-4 py-3 w-20"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedAssets.includes(asset.id)}
                                onChange={() => toggleAssetSelection(asset.id)}
                                className="rounded border-zinc-300 text-repix-500 focus:ring-repix-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={asset.src} className="w-10 h-10 rounded object-cover" />
                                <div>
                                  <p className="font-medium text-zinc-900 dark:text-white">{asset.name}</p>
                                  <p className="text-xs text-zinc-500">{asset.format}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(asset.status)}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{asset.size}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{asset.uploadedBy}</td>
                            <td className="px-4 py-3 text-sm text-zinc-500">{formatDateTime(asset.uploadedAt)}</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}


        {/* ==================== KANBAN TAB ==================== */}
        {activeTab === 'kanban' && (
          <div className="flex-1 overflow-x-auto p-6">
            <div className="flex gap-4 min-w-max">
              {[
                { id: 'todo', label: language === 'vi' ? 'Cần làm' : 'To Do', color: 'bg-zinc-500' },
                { id: 'in_progress', label: language === 'vi' ? 'Đang làm' : 'In Progress', color: 'bg-blue-500' },
                { id: 'review', label: language === 'vi' ? 'Đang xét' : 'Review', color: 'bg-amber-500' },
                { id: 'done', label: language === 'vi' ? 'Hoàn thành' : 'Done', color: 'bg-green-500' },
              ].map(column => (
                <div key={column.id} className="w-72 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{column.label}</h3>
                    <Badge className="ml-auto">{mockKanbanTasks[column.id]?.length || 0}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {mockKanbanTasks[column.id]?.map(task => (
                      <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-zinc-900 dark:text-white text-sm mb-3">{task.title}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map(tag => (
                            <Badge key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={task.assigneeAvatar} className="w-6 h-6 rounded-full" />
                            <span className="text-xs text-zinc-500">{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-400">
                            <Calendar size={12} />
                            {task.dueDate}
                          </div>
                        </div>
                        {task.priority === 'high' && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle size={12} />
                            {language === 'vi' ? 'Ưu tiên cao' : 'High Priority'}
                          </div>
                        )}
                      </Card>
                    ))}
                    
                    {/* Add Task Button */}
                    <button className="w-full p-3 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-400 hover:border-repix-500 hover:text-repix-500 transition-colors flex items-center justify-center gap-2">
                      <Plus size={16} />
                      <span className="text-sm">{language === 'vi' ? 'Thêm task' : 'Add Task'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== MEMBERS TAB ==================== */}
        {activeTab === 'members' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {language === 'vi' ? 'Thành viên dự án' : 'Project Members'}
                  </h3>
                  <p className="text-sm text-zinc-500">{mockMembers.length} {language === 'vi' ? 'thành viên' : 'members'}</p>
                </div>
                <Button size="sm" onClick={() => setShowInviteModal(true)}>
                  <Mail size={14} className="mr-2" />
                  {language === 'vi' ? 'Mời thành viên' : 'Invite Member'}
                </Button>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockMembers.map(member => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img src={member.avatar} className="w-12 h-12 rounded-full" />
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-white">{member.name}</h4>
                          <Badge className={member.role === 'lead'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }>
                            {member.role === 'lead' ? <><Crown size={10} className="mr-1" /> Lead</> : <><User size={10} className="mr-1" /> Member</>}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-500">{member.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            {member.tasksCompleted} tasks
                          </span>
                          <span className="flex items-center gap-1">
                            <Upload size={12} />
                            {member.assetsUploaded} assets
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {member.joinedAt}
                          </span>
                        </div>
                      </div>
                      {member.role !== 'lead' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                          <MoreVertical size={14} />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Invite Card */}
              <Card className="mt-6 p-6 border-dashed border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center">
                    <Users size={24} className="text-repix-500" />
                  </div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">
                    {language === 'vi' ? 'Mời thêm thành viên' : 'Invite more members'}
                  </h4>
                  <p className="text-sm text-zinc-500 mb-4">
                    {language === 'vi' ? 'Cộng tác với team để hoàn thành dự án nhanh hơn' : 'Collaborate with your team to complete projects faster'}
                  </p>
                  <Button variant="outline" onClick={() => setShowInviteModal(true)}>
                    <Link2 size={14} className="mr-2" />
                    {language === 'vi' ? 'Sao chép link mời' : 'Copy Invite Link'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS TAB ==================== */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Project Info */}
              <Card className="p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                  {language === 'vi' ? 'Thông tin dự án' : 'Project Information'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      {language === 'vi' ? 'Tên dự án' : 'Project Name'}
                    </label>
                    <Input defaultValue={project.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      {language === 'vi' ? 'Mô tả' : 'Description'}
                    </label>
                    <textarea
                      className="w-full h-24 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-repix-500"
                      placeholder={language === 'vi' ? 'Mô tả dự án...' : 'Project description...'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      {language === 'vi' ? 'Trạng thái' : 'Status'}
                    </label>
                    <select className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-repix-500">
                      <option value="draft">{language === 'vi' ? 'Nháp' : 'Draft'}</option>
                      <option value="in_review">{language === 'vi' ? 'Đang xét duyệt' : 'In Review'}</option>
                      <option value="approved">{language === 'vi' ? 'Đã duyệt' : 'Approved'}</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                  {language === 'vi' ? 'Thông báo' : 'Notifications'}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: language === 'vi' ? 'Thông báo khi có asset mới' : 'Notify when new asset uploaded', enabled: true },
                    { label: language === 'vi' ? 'Thông báo khi có comment' : 'Notify on new comments', enabled: true },
                    { label: language === 'vi' ? 'Thông báo khi task được giao' : 'Notify when task assigned', enabled: false },
                    { label: language === 'vi' ? 'Tóm tắt hàng tuần' : 'Weekly summary', enabled: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.label}</span>
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-repix-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-red-200 dark:border-red-900/50">
                <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {language === 'vi' ? 'Vùng nguy hiểm' : 'Danger Zone'}
                </h3>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {language === 'vi' ? 'Xóa dự án' : 'Delete Project'}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {language === 'vi' ? 'Hành động này không thể hoàn tác' : 'This action cannot be undone'}
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                    <Trash2 size={14} className="mr-2" />
                    {language === 'vi' ? 'Xóa' : 'Delete'}
                  </Button>
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onBack}>
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </Button>
                <Button>
                  {language === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Tải lên tài sản' : 'Upload Assets'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
                <X size={18} />
              </Button>
            </div>
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-repix-500 transition-colors cursor-pointer">
              <Upload size={40} className="mx-auto mb-4 text-zinc-400" />
              <p className="font-medium text-zinc-900 dark:text-white mb-1">
                {language === 'vi' ? 'Kéo thả file vào đây' : 'Drag and drop files here'}
              </p>
              <p className="text-sm text-zinc-500 mb-4">
                {language === 'vi' ? 'hoặc click để chọn file' : 'or click to browse'}
              </p>
              <Button variant="outline">
                {language === 'vi' ? 'Chọn file' : 'Browse Files'}
              </Button>
            </div>
            <p className="text-xs text-zinc-400 mt-4 text-center">
              {language === 'vi' ? 'Hỗ trợ: JPG, PNG, GIF, MP4, PDF (tối đa 100MB)' : 'Supported: JPG, PNG, GIF, MP4, PDF (max 100MB)'}
            </p>
          </Card>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Mời thành viên' : 'Invite Member'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}>
                <X size={18} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Email
                </label>
                <Input placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {language === 'vi' ? 'Vai trò' : 'Role'}
                </label>
                <select className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm">
                  <option value="member">Member</option>
                </select>
              </div>
              <Button className="w-full">
                <Mail size={14} className="mr-2" />
                {language === 'vi' ? 'Gửi lời mời' : 'Send Invite'}
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-2">{language === 'vi' ? 'Hoặc chia sẻ link' : 'Or share link'}</p>
              <div className="flex gap-2">
                <Input value="https://repix.ai/project/abc123" readOnly className="flex-1" />
                <Button variant="outline" size="icon">
                  <Copy size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
