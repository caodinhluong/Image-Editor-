import React from 'react';
import {
  Activity, MessageSquare, CheckCircle, Share2, Upload,
  Edit3, Trash2, UserPlus, Eye, Download
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ActivityItem {
  id: string;
  type: 'comment' | 'edit' | 'share' | 'upload' | 'delete' | 'resolve' | 'view' | 'export' | 'invite';
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target?: string;
  timestamp: Date;
  icon: React.ElementType;
  color: string;
}

export const ActivityFeed: React.FC = () => {
  const { trans } = useLanguage();

  // Mock activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'comment',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://picsum.photos/seed/sarah/100/100'
      },
      action: trans.collaboration.commentedOn,
      target: 'Product Shot',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    {
      id: '2',
      type: 'resolve',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://picsum.photos/seed/mike/100/100'
      },
      action: trans.collaboration.resolvedComment,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      icon: CheckCircle,
      color: 'text-emerald-500'
    },
    {
      id: '3',
      type: 'edit',
      user: {
        name: 'Alex Creative',
        avatar: 'https://picsum.photos/seed/user/100/100'
      },
      action: 'adjusted color temperature',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: Edit3,
      color: 'text-purple-500'
    },
    {
      id: '4',
      type: 'share',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://picsum.photos/seed/emma/100/100'
      },
      action: trans.collaboration.sharedWith,
      target: 'Client Team',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: Share2,
      color: 'text-pink-500'
    },
    {
      id: '5',
      type: 'upload',
      user: {
        name: 'David Lee',
        avatar: 'https://picsum.photos/seed/david/100/100'
      },
      action: 'uploaded new version',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      icon: Upload,
      color: 'text-amber-500'
    },
    {
      id: '6',
      type: 'view',
      user: {
        name: 'Lisa Park',
        avatar: 'https://picsum.photos/seed/lisa/100/100'
      },
      action: 'viewed project',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: Eye,
      color: 'text-zinc-500'
    },
    {
      id: '7',
      type: 'export',
      user: {
        name: 'Tom Anderson',
        avatar: 'https://picsum.photos/seed/tom/100/100'
      },
      action: 'exported final version',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: Download,
      color: 'text-cyan-500'
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return trans.collaboration.justNow;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${trans.collaboration.minutesAgo}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${trans.collaboration.hoursAgo}`;
    return `${Math.floor(seconds / 86400)} ${trans.collaboration.daysAgo}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Activity className="text-purple-500" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{trans.collaboration.activity}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Real-time project updates</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Activity className="text-zinc-400" size={24} />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.collaboration.noActivity}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
                )}

                {/* Activity Item */}
                <div className="flex items-start gap-3 group">
                  {/* Avatar with Icon Badge */}
                  <div className="relative shrink-0">
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800`}>
                      <activity.icon className={activity.color} size={10} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {activity.user.name}
                        </span>
                        {' '}
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {activity.action}
                        </span>
                        {activity.target && (
                          <>
                            {' '}
                            <span className="font-medium text-zinc-900 dark:text-white">
                              {activity.target}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <button className="w-full text-sm text-blue-500 hover:text-blue-600 font-medium">
          {trans.collaboration.viewAll}
        </button>
      </div>
    </div>
  );
};
