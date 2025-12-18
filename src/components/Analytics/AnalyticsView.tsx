import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Zap, Clock, CheckCircle, Download,
  Image as ImageIcon, Wand2, Sparkles, Video, Palette, Box,
  Calendar, ArrowUpRight, ArrowDownRight, Activity, Target,
  FolderOpen, ListTodo, Play, Eye, Share2, Heart, BarChart3,
  Layers, Film, Bot, Coffee, ShoppingCart, Camera
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button, Card, Badge } from '../ui/UIComponents';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

type Period = '7d' | '30d' | '90d' | 'all';
type TabType = 'overview' | 'studios' | 'tasks' | 'assets';

export const AnalyticsView: React.FC = () => {
  const { trans, language } = useLanguage();
  const [period, setPeriod] = useState<Period>('30d');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mock Data - Daily Activity Trend
  const dailyActivityData = [
    { date: 'Mon', images: 45, videos: 12, tasks: 8 },
    { date: 'Tue', images: 52, videos: 18, tasks: 12 },
    { date: 'Wed', images: 38, videos: 8, tasks: 6 },
    { date: 'Thu', images: 65, videos: 22, tasks: 15 },
    { date: 'Fri', images: 58, videos: 15, tasks: 10 },
    { date: 'Sat', images: 72, videos: 28, tasks: 18 },
    { date: 'Sun', images: 48, videos: 10, tasks: 7 },
  ];

  // Mock Data - Studio Usage
  const studioUsageData = [
    { name: language === 'vi' ? 'Nâng cấp' : 'Enhancement', value: 35, color: '#ec4899', icon: Coffee },
    { name: language === 'vi' ? 'Minh họa' : 'Illustration', value: 25, color: '#a855f7', icon: Palette },
    { name: '3D Studio', value: 15, color: '#10b981', icon: Box },
    { name: language === 'vi' ? 'Nghệ thuật' : 'Artistic', value: 12, color: '#f59e0b', icon: Film },
    { name: 'Video Studio', value: 8, color: '#3b82f6', icon: Video },
    { name: 'Pro Tools', value: 5, color: '#6366f1', icon: Wand2 },
  ];

  // Mock Data - Top Tools
  const topToolsData = [
    { id: 'hd-enhance', name: language === 'vi' ? 'Nâng cấp AI' : 'AI Upscaler', uses: 156, credits: 156, trend: '+23%' },
    { id: 'cosplay-character', name: language === 'vi' ? 'Anime Transform' : 'Anime Transform', uses: 98, credits: 294, trend: '+18%' },
    { id: 'isolate-subject', name: language === 'vi' ? 'Xóa nền' : 'Background Remove', uses: 87, credits: 174, trend: '+12%' },
    { id: 'video-kitchen', name: language === 'vi' ? 'Tạo Video AI' : 'Video Generator', uses: 45, credits: 225, trend: '+45%' },
    { id: 'funko-pop', name: language === 'vi' ? 'Mô hình Vinyl' : 'Vinyl Figure', uses: 42, credits: 126, trend: '+8%' },
  ];

  // Mock Data - Task Stats
  const taskStatsData = {
    total: 156,
    completed: 142,
    processing: 8,
    failed: 6,
    avgTime: '12.5s'
  };

  // Mock Data - Asset Stats
  const assetStatsData = {
    totalAssets: 1247,
    images: 892,
    videos: 156,
    aiGenerated: 199,
    storageUsed: '2.4 GB',
    storageLimit: '10 GB'
  };

  // Mock Data - Credit Usage by Category
  const creditUsageData = [
    { category: language === 'vi' ? 'Tạo ảnh' : 'Image Gen', credits: 450, percentage: 35 },
    { category: language === 'vi' ? 'Tạo video' : 'Video Gen', credits: 320, percentage: 25 },
    { category: language === 'vi' ? 'Nâng cấp' : 'Enhancement', credits: 256, percentage: 20 },
    { category: language === 'vi' ? 'Chuyển đổi' : 'Transform', credits: 180, percentage: 14 },
    { category: language === 'vi' ? 'Khác' : 'Others', credits: 78, percentage: 6 },
  ];

  // Mock Data - Recent Generations
  const recentGenerations = [
    { id: 1, type: 'image', tool: 'AI Upscaler', preview: 'https://picsum.photos/seed/gen1/100/100', time: '2 mins ago', status: 'success', credits: 1 },
    { id: 2, type: 'video', tool: 'Video Generator', preview: 'https://picsum.photos/seed/gen2/100/100', time: '15 mins ago', status: 'success', credits: 5 },
    { id: 3, type: 'image', tool: 'Anime Transform', preview: 'https://picsum.photos/seed/gen3/100/100', time: '1 hour ago', status: 'success', credits: 3 },
    { id: 4, type: 'image', tool: 'Background Remove', preview: 'https://picsum.photos/seed/gen4/100/100', time: '2 hours ago', status: 'success', credits: 2 },
    { id: 5, type: 'image', tool: 'Vinyl Figure', preview: 'https://picsum.photos/seed/gen5/100/100', time: '3 hours ago', status: 'failed', credits: 0 },
  ];

  // Stats Cards Data
  const overviewStats = [
    {
      label: language === 'vi' ? 'Tổng tạo sinh' : 'Total Generations',
      value: '1,284',
      change: '+18.5%',
      trend: 'up',
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: language === 'vi' ? 'Credits đã dùng' : 'Credits Used',
      value: '2,847',
      change: '+12.3%',
      trend: 'up',
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      label: language === 'vi' ? 'Tác vụ hoàn thành' : 'Tasks Completed',
      value: '142',
      change: '+24.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: language === 'vi' ? 'Tỷ lệ thành công' : 'Success Rate',
      value: '97.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
  ];

  const periodOptions = [
    { value: '7d', label: language === 'vi' ? '7 ngày' : '7 Days' },
    { value: '30d', label: language === 'vi' ? '30 ngày' : '30 Days' },
    { value: '90d', label: language === 'vi' ? '90 ngày' : '90 Days' },
    { value: 'all', label: language === 'vi' ? 'Tất cả' : 'All Time' },
  ];

  const tabs = [
    { id: 'overview', label: language === 'vi' ? 'Tổng quan' : 'Overview', icon: BarChart3 },
    { id: 'studios', label: language === 'vi' ? 'AI Studios' : 'AI Studios', icon: Wand2 },
    { id: 'tasks', label: language === 'vi' ? 'Tác vụ' : 'Tasks', icon: ListTodo },
    { id: 'assets', label: language === 'vi' ? 'Tài sản' : 'Assets', icon: FolderOpen },
  ];

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 2xl:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
              <Activity className="text-repix-500" size={32} />
              {language === 'vi' ? 'Phân tích & Thống kê' : 'Analytics & Insights'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {language === 'vi' ? 'Theo dõi hiệu suất sáng tạo và sử dụng của bạn' : 'Track your creative performance and usage'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* Period Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value as Period)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    period === opt.value
                      ? 'bg-repix-500 text-white shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              {language === 'vi' ? 'Xuất báo cáo' : 'Export'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-repix-500 text-white shadow-lg shadow-repix-500/25'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6 mb-8">
              {overviewStats.map((stat, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={stat.color} size={24} />
                    </div>
                    <span 
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        stat.trend === 'up' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 2xl:gap-6 mb-8">
              
              {/* Activity Trend Chart */}
              <Card className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-repix-500" />
                    {language === 'vi' ? 'Xu hướng hoạt động' : 'Activity Trend'}
                  </h2>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                      {language === 'vi' ? 'Ảnh' : 'Images'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      {language === 'vi' ? 'Video' : 'Videos'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      {language === 'vi' ? 'Tác vụ' : 'Tasks'}
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailyActivityData}>
                    <defs>
                      <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#18181b', 
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="images" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorImages)" />
                    <Area type="monotone" dataKey="videos" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVideos)" />
                    <Line type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Credit Usage Pie Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                  <Zap size={20} className="text-amber-500" />
                  {language === 'vi' ? 'Sử dụng Credits' : 'Credit Usage'}
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={creditUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="credits"
                    >
                      {creditUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#6b7280'][index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#18181b', 
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="mt-4 space-y-2">
                  {creditUsageData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#6b7280'][idx] }} />
                        <span className="text-zinc-600 dark:text-zinc-400">{item.category}</span>
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-white">{item.credits}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Generations */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-repix-500" />
                {language === 'vi' ? 'Tạo sinh gần đây' : 'Recent Generations'}
              </h2>
              
              <div className="space-y-3">
                {recentGenerations.map((gen) => (
                  <div 
                    key={gen.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <img 
                          src={gen.preview} 
                          alt={gen.tool}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {gen.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            <Play size={16} className="text-white fill-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-zinc-900 dark:text-white">{gen.tool}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            gen.type === 'video' 
                              ? 'bg-gradient-to-r from-pink-500 to-repix-600 text-white' 
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {gen.type === 'video' ? 'Video' : 'Image'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Zap size={12} className="text-amber-500" />
                            {gen.credits} credits
                          </span>
                          <span>{gen.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      gen.status === 'success' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {gen.status === 'success' 
                        ? (language === 'vi' ? 'Thành công' : 'Success')
                        : (language === 'vi' ? 'Thất bại' : 'Failed')
                      }
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Studios Tab */}
        {activeTab === 'studios' && (
          <>
            {/* Studio Usage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {studioUsageData.map((studio, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${studio.color}20` }}>
                      <studio.icon size={24} style={{ color: studio.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{studio.name}</h3>
                      <p className="text-sm text-zinc-500">{studio.value}% {language === 'vi' ? 'sử dụng' : 'usage'}</p>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${studio.value}%`, backgroundColor: studio.color }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Top Tools */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Target size={20} className="text-repix-500" />
                {language === 'vi' ? 'Công cụ được dùng nhiều nhất' : 'Most Used Tools'}
              </h2>
              
              <div className="space-y-4">
                {topToolsData.map((tool, idx) => (
                  <div key={tool.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-zinc-900 dark:text-white">{tool.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">{tool.trend}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span>{tool.uses} {language === 'vi' ? 'lần dùng' : 'uses'}</span>
                        <span className="flex items-center gap-1">
                          <Zap size={12} className="text-amber-500" />
                          {tool.credits} credits
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <>
            {/* Task Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{taskStatsData.total}</div>
                <p className="text-sm text-zinc-500">{language === 'vi' ? 'Tổng tác vụ' : 'Total Tasks'}</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-500 mb-1">{taskStatsData.completed}</div>
                <p className="text-sm text-zinc-500">{language === 'vi' ? 'Hoàn thành' : 'Completed'}</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{taskStatsData.processing}</div>
                <p className="text-sm text-zinc-500">{language === 'vi' ? 'Đang xử lý' : 'Processing'}</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">{taskStatsData.failed}</div>
                <p className="text-sm text-zinc-500">{language === 'vi' ? 'Thất bại' : 'Failed'}</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-500 mb-1">{taskStatsData.avgTime}</div>
                <p className="text-sm text-zinc-500">{language === 'vi' ? 'Thời gian TB' : 'Avg Time'}</p>
              </Card>
            </div>

            {/* Task Success Rate Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                {language === 'vi' ? 'Tỷ lệ thành công theo ngày' : 'Daily Success Rate'}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <>
            {/* Asset Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card className="p-6 text-center">
                <FolderOpen size={24} className="mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{assetStatsData.totalAssets}</div>
                <p className="text-xs text-zinc-500">{language === 'vi' ? 'Tổng tài sản' : 'Total Assets'}</p>
              </Card>
              <Card className="p-6 text-center">
                <ImageIcon size={24} className="mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{assetStatsData.images}</div>
                <p className="text-xs text-zinc-500">{language === 'vi' ? 'Hình ảnh' : 'Images'}</p>
              </Card>
              <Card className="p-6 text-center">
                <Video size={24} className="mx-auto mb-2 text-pink-500" />
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{assetStatsData.videos}</div>
                <p className="text-xs text-zinc-500">Videos</p>
              </Card>
              <Card className="p-6 text-center">
                <Sparkles size={24} className="mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{assetStatsData.aiGenerated}</div>
                <p className="text-xs text-zinc-500">{language === 'vi' ? 'AI tạo' : 'AI Generated'}</p>
              </Card>
              <Card className="p-6 text-center col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-500">{language === 'vi' ? 'Dung lượng' : 'Storage'}</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">{assetStatsData.storageUsed} / {assetStatsData.storageLimit}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '24%' }} />
                </div>
                <p className="text-xs text-zinc-500 mt-2">24% {language === 'vi' ? 'đã sử dụng' : 'used'}</p>
              </Card>
            </div>

            {/* Asset Type Distribution */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Layers size={20} className="text-repix-500" />
                {language === 'vi' ? 'Phân bố loại tài sản' : 'Asset Type Distribution'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageIcon size={20} className="text-blue-500" />
                    <span className="font-medium text-zinc-900 dark:text-white">{language === 'vi' ? 'Hình ảnh' : 'Images'}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">71.5%</div>
                  <p className="text-sm text-zinc-500">{assetStatsData.images} {language === 'vi' ? 'tệp' : 'files'}</p>
                </div>
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Video size={20} className="text-pink-500" />
                    <span className="font-medium text-zinc-900 dark:text-white">Videos</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-500">12.5%</div>
                  <p className="text-sm text-zinc-500">{assetStatsData.videos} {language === 'vi' ? 'tệp' : 'files'}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles size={20} className="text-amber-500" />
                    <span className="font-medium text-zinc-900 dark:text-white">{language === 'vi' ? 'AI tạo' : 'AI Generated'}</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-500">16%</div>
                  <p className="text-sm text-zinc-500">{assetStatsData.aiGenerated} {language === 'vi' ? 'tệp' : 'files'}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Share2 size={20} className="text-purple-500" />
                    <span className="font-medium text-zinc-900 dark:text-white">{language === 'vi' ? 'Đã chia sẻ' : 'Shared'}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-500">8.2%</div>
                  <p className="text-sm text-zinc-500">102 {language === 'vi' ? 'tệp' : 'files'}</p>
                </div>
              </div>
            </Card>
          </>
        )}

      </div>
    </div>
  );
};
