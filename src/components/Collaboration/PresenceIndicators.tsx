import React from 'react';
import { Eye, Edit3, MousePointer } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'viewing' | 'editing' | 'idle';
  color: string;
  cursor?: { x: number; y: number };
}

export const PresenceIndicators: React.FC = () => {
  const { trans } = useLanguage();

  // Mock active users
  const activeUsers: User[] = [
    {
      id: '1',
      name: 'Trang âu díu',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      status: 'editing',
      color: '#3b82f6' // blue
    },
    {
      id: '2',
      name: 'Xuân Ngoo',
      avatar: 'https://picsum.photos/seed/mike/100/100',
      status: 'viewing',
      color: '#ec4899' // pink
    },
    {
      id: '3',
      name: 'Chu Đức Thanh',
      avatar: 'https://picsum.photos/seed/emma/100/100',
      status: 'viewing',
      color: '#10b981' // emerald
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Active Users Avatars */}
      <div className="flex -space-x-2">
        {activeUsers.map((user, index) => (
          <div
            key={user.id}
            className="relative group"
            style={{ zIndex: activeUsers.length - index }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden cursor-pointer transition-transform hover:scale-110"
              style={{ borderColor: user.color }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status Indicator */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center"
              style={{ backgroundColor: user.color }}
            >
              {user.status === 'editing' ? (
                <Edit3 size={6} className="text-white" />
              ) : (
                <Eye size={6} className="text-white" />
              )}
            </div>

            {/* Tooltip - Shows below */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="font-medium">{user.name}</div>
              <div className="text-[10px] opacity-75">
                {user.status === 'editing' ? trans.collaboration.editing : trans.collaboration.viewing}
              </div>
              {/* Arrow pointing up */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '4px solid rgb(24 24 27)'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Active Count */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {activeUsers.length} {trans.collaboration.online}
      </div>
    </div>
  );
};

// Collaborative Cursor Component (for real-time cursor tracking)
interface CollaborativeCursorProps {
  user: User;
  position: { x: number; y: number };
}

export const CollaborativeCursor: React.FC<CollaborativeCursorProps> = ({ user, position }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-100"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-2px, -2px)'
      }}
    >
      {/* Cursor */}
      <MousePointer
        size={20}
        style={{ color: user.color }}
        className="drop-shadow-lg"
      />
      
      {/* Name Tag */}
      <div
        className="absolute top-5 left-5 px-2 py-1 rounded-md text-white text-xs font-medium whitespace-nowrap shadow-lg"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </div>
  );
};
