import React, { useState } from 'react';
import {
  X, Bell, Check, CheckCheck, Trash2, Settings,
  MessageSquare, UserPlus, FolderPlus, AlertCircle,
  CreditCard, Upload, Star, Clock, Filter
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'comment' | 'invite' | 'project' | 'alert' | 'billing' | 'asset' | 'mention';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'comment', title: 'New comment', message: 'Sarah commented on "Nike Banner v2"', timestamp: '5 min ago', read: false, avatar: 'https://picsum.photos/seed/u1/40' },
    { id: '2', type: 'mention', title: 'You were mentioned', message: 'Mike mentioned you in "Product Launch"', timestamp: '15 min ago', read: false, avatar: 'https://picsum.photos/seed/u2/40' },
    { id: '3', type: 'invite', title: 'Team invitation', message: 'You\'ve been invited to "Marketing Team"', timestamp: '1 hour ago', read: false },
    { id: '4', type: 'asset', title: 'Asset approved', message: 'Your asset "Hero_Banner.png" was approved', timestamp: '2 hours ago', read: true },
    { id: '5', type: 'alert', title: 'Credit low', message: 'Your team credits are running low (500 remaining)', timestamp: '3 hours ago', read: true },
    { id: '6', type: 'project', title: 'Project completed', message: '"Summer Campaign" has been marked as complete', timestamp: '5 hours ago', read: true },
    { id: '7', type: 'billing', title: 'Payment successful', message: 'Your payment of $59.99 was processed', timestamp: '1 day ago', read: true },
    { id: '8', type: 'comment', title: 'New reply', message: 'Jessica replied to your comment', timestamp: '1 day ago', read: true, avatar: 'https://picsum.photos/seed/u3/40' },
  ]);

  const trans = {
    title: language === 'vi' ? 'Thông báo' : 'Notifications',
    all: language === 'vi' ? 'Tất cả' : 'All',
    unread: language === 'vi' ? 'Chưa đọc' : 'Unread',
    markAllRead: language === 'vi' ? 'Đánh dấu đã đọc' : 'Mark all read',
    clearAll: language === 'vi' ? 'Xóa tất cả' : 'Clear all',
    noNotifications: language === 'vi' ? 'Không có thông báo' : 'No notifications',
    settings: language === 'vi' ? 'Cài đặt' : 'Settings',
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      comment: <MessageSquare size={16} className="text-blue-500" />,
      mention: <Star size={16} className="text-amber-500" />,
      invite: <UserPlus size={16} className="text-violet-500" />,
      project: <FolderPlus size={16} className="text-green-500" />,
      alert: <AlertCircle size={16} className="text-red-500" />,
      billing: <CreditCard size={16} className="text-emerald-500" />,
      asset: <Upload size={16} className="text-cyan-500" />,
    };
    return icons[type] || <Bell size={16} className="text-zinc-400" />;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh] mt-16 mr-4 animate-in slide-in-from-right-8 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-xs px-1.5 py-0.5">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Filter & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                {trans.all}
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                {trans.unread} {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={markAllAsRead}
                className="text-xs text-repix-600 hover:text-repix-700 font-medium"
              >
                {trans.markAllRead}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p>{trans.noNotifications}</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-repix-50/50 dark:bg-repix-900/10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {notification.avatar ? (
                      <img src={notification.avatar} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-zinc-900 dark:text-white' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-zinc-500 line-clamp-2">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-repix-500 flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock size={10} /> {notification.timestamp}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <button 
              onClick={clearAll}
              className="w-full text-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {trans.clearAll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
