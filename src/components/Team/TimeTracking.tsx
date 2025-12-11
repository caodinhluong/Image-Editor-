import React, { useState } from 'react';
import {
  X, Clock, Play, Pause, Square, Calendar, BarChart3,
  User, FolderGit2, ChevronDown, Plus, Edit3, Trash2
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimeTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  user: { name: string; avatar: string };
  duration: number; // in minutes
  date: string;
  status: 'running' | 'completed';
}

export const TimeTracking: React.FC<TimeTrackingProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState('Nike Summer Campaign');
  const [selectedTask, setSelectedTask] = useState('Banner Design');

  const trans = {
    title: language === 'vi' ? 'Theo dõi thời gian' : 'Time Tracking',
    subtitle: language === 'vi' ? 'Quản lý thời gian làm việc của team' : 'Track team working hours',
    start: language === 'vi' ? 'Bắt đầu' : 'Start',
    stop: language === 'vi' ? 'Dừng' : 'Stop',
    pause: language === 'vi' ? 'Tạm dừng' : 'Pause',
    today: language === 'vi' ? 'Hôm nay' : 'Today',
    thisWeek: language === 'vi' ? 'Tuần này' : 'This Week',
    thisMonth: language === 'vi' ? 'Tháng này' : 'This Month',
    totalHours: language === 'vi' ? 'Tổng giờ' : 'Total Hours',
    project: language === 'vi' ? 'Dự án' : 'Project',
    task: language === 'vi' ? 'Công việc' : 'Task',
    member: language === 'vi' ? 'Thành viên' : 'Member',
    duration: language === 'vi' ? 'Thời lượng' : 'Duration',
    recentEntries: language === 'vi' ? 'Gần đây' : 'Recent Entries',
    teamOverview: language === 'vi' ? 'Tổng quan team' : 'Team Overview',
    hours: language === 'vi' ? 'giờ' : 'hours',
    minutes: language === 'vi' ? 'phút' : 'min',
  };

  const [entries] = useState<TimeEntry[]>([
    { id: '1', project: 'Nike Summer Campaign', task: 'Banner Design', user: { name: 'Sarah', avatar: 'https://picsum.photos/seed/u1/40' }, duration: 180, date: 'Today', status: 'completed' },
    { id: '2', project: 'Nike Summer Campaign', task: 'Social Media Posts', user: { name: 'Mike', avatar: 'https://picsum.photos/seed/u2/40' }, duration: 120, date: 'Today', status: 'completed' },
    { id: '3', project: 'Gucci Product Launch', task: 'Product Photography', user: { name: 'Jessica', avatar: 'https://picsum.photos/seed/u3/40' }, duration: 240, date: 'Today', status: 'completed' },
    { id: '4', project: 'Watch Collection', task: 'Video Editing', user: { name: 'Tom', avatar: 'https://picsum.photos/seed/u4/40' }, duration: 90, date: 'Yesterday', status: 'completed' },
    { id: '5', project: 'Nike Summer Campaign', task: 'Review & Feedback', user: { name: 'Sarah', avatar: 'https://picsum.photos/seed/u1/40' }, duration: 45, date: 'Yesterday', status: 'completed' },
  ]);

  const teamStats = [
    { name: 'Sarah', avatar: 'https://picsum.photos/seed/u1/40', hours: 32, projects: 3 },
    { name: 'Mike', avatar: 'https://picsum.photos/seed/u2/40', hours: 28, projects: 2 },
    { name: 'Jessica', avatar: 'https://picsum.photos/seed/u3/40', hours: 35, projects: 4 },
    { name: 'Tom', avatar: 'https://picsum.photos/seed/u4/40', hours: 24, projects: 2 },
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalToday = entries.filter(e => e.date === 'Today').reduce((acc, e) => acc + e.duration, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
                <p className="text-xs text-zinc-500">{trans.subtitle}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Timer Section */}
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-6">
            {/* Timer Display */}
            <div className="flex-1">
              <div className="text-5xl font-mono font-bold text-zinc-900 dark:text-white mb-4">
                {formatTimer(currentTime)}
              </div>
              <div className="flex gap-3">
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                >
                  <option>Nike Summer Campaign</option>
                  <option>Gucci Product Launch</option>
                  <option>Watch Collection</option>
                </select>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                >
                  <option>Banner Design</option>
                  <option>Social Media Posts</option>
                  <option>Video Editing</option>
                  <option>Review & Feedback</option>
                </select>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-3">
              {!isTracking ? (
                <Button 
                  size="lg" 
                  className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
                  onClick={() => setIsTracking(true)}
                >
                  <Play size={24} fill="white" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-16 w-16 rounded-full"
                    onClick={() => setIsTracking(false)}
                  >
                    <Pause size={24} />
                  </Button>
                  <Button 
                    size="lg" 
                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={() => { setIsTracking(false); setCurrentTime(0); }}
                  >
                    <Square size={20} fill="white" />
                  </Button>
                </>
              )}
            </div>

            {/* Today Stats */}
            <Card className="p-4 min-w-[160px]">
              <p className="text-xs text-zinc-500 mb-1">{trans.today}</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{formatDuration(totalToday)}</p>
              <p className="text-xs text-green-600">+2h from yesterday</p>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Recent Entries */}
          <div className="flex-1 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900">
              <h3 className="font-bold text-zinc-900 dark:text-white">{trans.recentEntries}</h3>
            </div>
            <div className="p-4 space-y-3">
              {entries.map(entry => (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group">
                  <img src={entry.user.avatar} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-zinc-900 dark:text-white truncate">{entry.task}</p>
                    <p className="text-xs text-zinc-500">{entry.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">{formatDuration(entry.duration)}</p>
                    <p className="text-xs text-zinc-400">{entry.date}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 size={12} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"><Trash2 size={12} /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Overview */}
          <div className="w-72 overflow-y-auto">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900">
              <h3 className="font-bold text-zinc-900 dark:text-white">{trans.teamOverview}</h3>
              <p className="text-xs text-zinc-500">{trans.thisWeek}</p>
            </div>
            <div className="p-4 space-y-4">
              {teamStats.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={member.avatar} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">{member.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                          style={{ width: `${(member.hours / 40) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{member.hours}h</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Weekly Summary */}
              <Card className="p-4 mt-6 bg-zinc-50 dark:bg-zinc-800/50">
                <h4 className="font-medium text-sm text-zinc-900 dark:text-white mb-3">Weekly Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Total Hours</span>
                    <span className="font-medium text-zinc-900 dark:text-white">119h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Projects</span>
                    <span className="font-medium text-zinc-900 dark:text-white">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Avg/Member</span>
                    <span className="font-medium text-zinc-900 dark:text-white">29.75h</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
