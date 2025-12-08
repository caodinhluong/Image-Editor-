import React, { useState } from 'react';
import {
  Bell, Check, X, AtSign, MessageSquare, UserPlus,
  Share2, CheckCircle, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button, Badge } from '../ui/UIComponents';

interface Notification {
  id: string;
  type: 'mention' | 'comment' | 'share' | 'resolve' | 'assign' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon: React.ElementType;
  color: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { trans } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'mention',
      title: 'Sarah Chen mentioned you',
      message: 'Can @Alex review the color adjustments?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      icon: AtSign,
      color: 'text-blue-500'
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment on Product Shot',
      message: 'Mike Johnson: "Looks great! Ready to approve."',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      icon: MessageSquare,
      color: 'text-purple-500'
    },
    {
      id: '3',
      type: 'resolve',
      title: 'Comment resolved',
      message: 'Emma Wilson resolved your comment',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      icon: CheckCircle,
      color: 'text-emerald-500'
    },
    {
      id: '4',
      type: 'share',
      title: 'Project shared with you',
      message: 'David Lee shared "Summer Campaign 2024"',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true,
      icon: Share2,
      color: 'text-pink-500'
    },
    {
      id: '5',
      type: 'assign',
      title: 'New task assigned',
      message: 'Lisa Park assigned you to review final edits',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      icon: UserPlus,
      color: 'text-amber-500'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return trans.collaboration.justNow;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${trans.collaboration.minutesAgo}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${trans.collaboration.hoursAgo}`;
    return `${Math.floor(seconds / 86400)} ${trans.collaboration.daysAgo}`;
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-dark-surface border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg bg-amber-500/10">
              <Bell className="text-amber-500" size={20} />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{trans.collaboration.notifications}</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {unreadCount} unread
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <Button
              size="sm"
              variant="ghost"
              onClick={markAllAsRead}
              className="w-full gap-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Check size={14} />
              {trans.collaboration.markAllRead}
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Bell className="text-zinc-400" size={24} />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.collaboration.noNotifications}</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group border-b border-zinc-200 dark:border-zinc-800 transition-colors ${
                    notification.isRead
                      ? 'bg-white dark:bg-dark-surface'
                      : 'bg-blue-50 dark:bg-blue-900/10'
                  } hover:bg-zinc-50 dark:hover:bg-zinc-900/50`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${
                        notification.isRead
                          ? 'bg-zinc-100 dark:bg-zinc-800'
                          : 'bg-white dark:bg-zinc-900'
                      }`}>
                        <notification.icon className={notification.color} size={16} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`text-sm font-semibold ${
                            notification.isRead
                              ? 'text-zinc-700 dark:text-zinc-300'
                              : 'text-zinc-900 dark:text-white'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-500"
                          title="Delete"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
