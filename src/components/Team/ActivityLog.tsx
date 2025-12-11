import React, { useState } from 'react';
import {
  X, Activity, Filter, Search, Download, Calendar,
  User, FolderPlus, Upload, Edit3, Trash2, UserPlus,
  Settings, CreditCard, Eye, MessageSquare, CheckCircle,
  Clock, ChevronDown
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActivityItem {
  id: string;
  type: 'project' | 'asset' | 'member' | 'settings' | 'billing' | 'comment';
  action: string;
  user: { name: string; avatar: string };
  target?: string;
  timestamp: string;
  details?: string;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const trans = {
    title: language === 'vi' ? 'Lịch sử hoạt động' : 'Activity Log',
    search: language === 'vi' ? 'Tìm kiếm...' : 'Search activities...',
    filter: language === 'vi' ? 'Lọc' : 'Filter',
    export: language === 'vi' ? 'Xuất' : 'Export',
    all: language === 'vi' ? 'Tất cả' : 'All',
    projects: language === 'vi' ? 'Dự án' : 'Projects',
    assets: language === 'vi' ? 'Assets' : 'Assets',
    members: language === 'vi' ? 'Thành viên' : 'Members',
    settings: language === 'vi' ? 'Cài đặt' : 'Settings',
    today: language === 'vi' ? 'Hôm nay' : 'Today',
    yesterday: language === 'vi' ? 'Hôm qua' : 'Yesterday',
    thisWeek: language === 'vi' ? 'Tuần này' : 'This Week',
  };

  const activities: ActivityItem[] = [
    { id: '1', type: 'project', action: 'created', user: { name: 'Sarah Designer', avatar: 'https://picsum.photos/seed/u1/40' }, target: 'Nike Summer Campaign', timestamp: '10 minutes ago' },
    { id: '2', type: 'asset', action: 'uploaded', user: { name: 'Mike Product', avatar: 'https://picsum.photos/seed/u2/40' }, target: 'Hero_Banner_v2.png', timestamp: '25 minutes ago', details: '2.4 MB • PNG' },
    { id: '3', type: 'comment', action: 'commented', user: { name: 'Jessica Marketing', avatar: 'https://picsum.photos/seed/u3/40' }, target: 'Product Shot Collection', timestamp: '1 hour ago', details: '"Love the new color scheme!"' },
    { id: '4', type: 'member', action: 'invited', user: { name: 'Sarah Designer', avatar: 'https://picsum.photos/seed/u1/40' }, target: 'alex@company.com', timestamp: '2 hours ago' },
    { id: '5', type: 'asset', action: 'approved', user: { name: 'Tom Dev', avatar: 'https://picsum.photos/seed/u4/40' }, target: 'Instagram_Post_Final.jpg', timestamp: '3 hours ago' },
    { id: '6', type: 'settings', action: 'updated', user: { name: 'Sarah Designer', avatar: 'https://picsum.photos/seed/u1/40' }, target: 'workspace settings', timestamp: '5 hours ago', details: 'Changed workspace name' },
    { id: '7', type: 'project', action: 'archived', user: { name: 'Mike Product', avatar: 'https://picsum.photos/seed/u2/40' }, target: 'Old Campaign 2023', timestamp: '1 day ago' },
    { id: '8', type: 'billing', action: 'purchased', user: { name: 'Sarah Designer', avatar: 'https://picsum.photos/seed/u1/40' }, target: '10,000 credits', timestamp: '1 day ago', details: '$59.99' },
    { id: '9', type: 'asset', action: 'deleted', user: { name: 'Jessica Marketing', avatar: 'https://picsum.photos/seed/u3/40' }, target: 'draft_unused.psd', timestamp: '2 days ago' },
    { id: '10', type: 'member', action: 'role_changed', user: { name: 'Sarah Designer', avatar: 'https://picsum.photos/seed/u1/40' }, target: 'Tom Dev', timestamp: '3 days ago', details: 'Viewer → Editor' },
  ];

  const getActionIcon = (type: string, action: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'project_created': <FolderPlus size={16} className="text-green-500" />,
      'project_archived': <FolderPlus size={16} className="text-zinc-500" />,
      'asset_uploaded': <Upload size={16} className="text-blue-500" />,
      'asset_approved': <CheckCircle size={16} className="text-green-500" />,
      'asset_deleted': <Trash2 size={16} className="text-red-500" />,
      'member_invited': <UserPlus size={16} className="text-violet-500" />,
      'member_role_changed': <Edit3 size={16} className="text-amber-500" />,
      'settings_updated': <Settings size={16} className="text-zinc-500" />,
      'billing_purchased': <CreditCard size={16} className="text-green-500" />,
      'comment_commented': <MessageSquare size={16} className="text-blue-500" />,
    };
    return iconMap[`${type}_${action}`] || <Activity size={16} className="text-zinc-400" />;
  };

  const getActionText = (item: ActivityItem) => {
    const actionTexts: Record<string, string> = {
      'created': language === 'vi' ? 'đã tạo' : 'created',
      'uploaded': language === 'vi' ? 'đã tải lên' : 'uploaded',
      'approved': language === 'vi' ? 'đã duyệt' : 'approved',
      'deleted': language === 'vi' ? 'đã xóa' : 'deleted',
      'invited': language === 'vi' ? 'đã mời' : 'invited',
      'role_changed': language === 'vi' ? 'đã thay đổi quyền của' : 'changed role of',
      'updated': language === 'vi' ? 'đã cập nhật' : 'updated',
      'purchased': language === 'vi' ? 'đã mua' : 'purchased',
      'commented': language === 'vi' ? 'đã bình luận trên' : 'commented on',
      'archived': language === 'vi' ? 'đã lưu trữ' : 'archived',
    };
    return actionTexts[item.action] || item.action;
  };

  const filteredActivities = activities.filter(a => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (searchQuery && !a.target?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !a.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const groupedActivities = {
    today: filteredActivities.filter(a => a.timestamp.includes('minute') || a.timestamp.includes('hour')),
    yesterday: filteredActivities.filter(a => a.timestamp.includes('1 day')),
    thisWeek: filteredActivities.filter(a => a.timestamp.includes('2 day') || a.timestamp.includes('3 day')),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Activity size={20} className="text-violet-600" />
              </div>
              <div>
                <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
                <p className="text-xs text-zinc-500">{filteredActivities.length} activities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download size={14} className="mr-2" /> {trans.export}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder={trans.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm outline-none focus:ring-2 focus:ring-repix-500"
              />
            </div>
            <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              {[
                { id: 'all', label: trans.all },
                { id: 'project', label: trans.projects },
                { id: 'asset', label: trans.assets },
                { id: 'member', label: trans.members },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === f.id
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedActivities).map(([period, items]) => (
            items.length > 0 && (
              <div key={period} className="mb-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <Calendar size={12} />
                  {period === 'today' ? trans.today : period === 'yesterday' ? trans.yesterday : trans.thisWeek}
                </h3>
                <div className="space-y-2">
                  {items.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                      <img src={activity.user.avatar} className="w-8 h-8 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="font-medium text-zinc-900 dark:text-white">{activity.user.name}</span>
                          {' '}{getActionText(activity)}{' '}
                          <span className="font-medium text-zinc-900 dark:text-white">{activity.target}</span>
                        </p>
                        {activity.details && (
                          <p className="text-xs text-zinc-500 mt-0.5">{activity.details}</p>
                        )}
                        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                          <Clock size={10} /> {activity.timestamp}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        {getActionIcon(activity.type, activity.action)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Activity size={48} className="mx-auto mb-4 opacity-30" />
              <p>{language === 'vi' ? 'Không có hoạt động nào' : 'No activities found'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
