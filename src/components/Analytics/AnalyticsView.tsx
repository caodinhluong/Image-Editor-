import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Zap, Clock, CheckCircle, Download,
  Image as ImageIcon, Wand2, Scissors, Maximize2, Sparkles,
  Calendar, ArrowUpRight, ArrowDownRight, Activity, Target
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button, Card, Badge } from '../ui/UIComponents';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

type Period = '7d' | '30d' | '90d' | 'all';

export const AnalyticsView: React.FC = () => {
  const { trans } = useLanguage();
  const [period, setPeriod] = useState<Period>('30d');

  // Mock Data - Generation Trend
  const generationData = [
    { date: 'Mon', generations: 45, credits: 180 },
    { date: 'Tue', generations: 52, credits: 208 },
    { date: 'Wed', generations: 38, credits: 152 },
    { date: 'Thu', generations: 65, credits: 260 },
    { date: 'Fri', generations: 58, credits: 232 },
    { date: 'Sat', generations: 72, credits: 288 },
    { date: 'Sun', generations: 48, credits: 192 },
  ];

  // Mock Data - Tool Usage
  const toolUsageData = [
    { name: 'Text to Image', value: 35, color: '#3b82f6' },
    { name: 'Remove BG', value: 28, color: '#ec4899' },
    { name: 'Upscale 4K', value: 20, color: '#f59e0b' },
    { name: 'Gen Fill', value: 12, color: '#a855f7' },
    { name: 'Others', value: 5, color: '#6b7280' },
  ];

  // Mock Data - Recent Activity
  const recentActivity = [
    { id: 1, tool: 'Text to Image', prompt: 'Futuristic city skyline', time: '2 mins ago', status: 'success', credits: 4 },
    { id: 2, tool: 'Remove BG', prompt: 'Product photo cleanup', time: '15 mins ago', status: 'success', credits: 2 },
    { id: 3, tool: 'Upscale 4K', prompt: 'Portrait enhancement', time: '1 hour ago', status: 'success', credits: 8 },
    { id: 4, tool: 'Gen Fill', prompt: 'Add sunset background', time: '2 hours ago', status: 'success', credits: 5 },
    { id: 5, tool: 'Text to Image', prompt: 'Abstract art pattern', time: '3 hours ago', status: 'failed', credits: 0 },
  ];

  // Stats Cards Data
  const stats = [
    {
      label: trans.analytics.totalGenerations,
      value: '378',
      change: '+12.5%',
      trend: 'up',
      icon: Sparkles,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: trans.analytics.creditsUsed,
      value: '1,512',
      change: '+8.3%',
      trend: 'up',
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      label: trans.analytics.avgProcessTime,
      value: '3.2s',
      change: '-15.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: trans.analytics.successRate,
      value: '98.7%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-repix-500',
      bgColor: 'bg-repix-500/10'
    },
  ];

  const periodOptions = [
    { value: '7d', label: trans.analytics.last7days },
    { value: '30d', label: trans.analytics.last30days },
    { value: '90d', label: trans.analytics.last90days },
    { value: 'all', label: trans.analytics.allTime },
  ];

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
              <Activity className="text-repix-500" size={32} />
              {trans.analytics.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">{trans.analytics.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* Period Selector */}
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
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
              {trans.analytics.exportReport}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <Badge 
                  variant={stat.trend === 'up' ? 'success' : 'default'}
                  className="flex items-center gap-1"
                >
                  {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Generation Trend Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-repix-500" />
                {trans.analytics.generationTrend}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="generations" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="credits" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Tool Usage Pie Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Target size={20} className="text-repix-500" />
              {trans.analytics.topTools}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={toolUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {toolUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
              {toolUsageData.map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tool.color }}
                    />
                    <span className="text-zinc-600 dark:text-zinc-400">{tool.name}</span>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">{tool.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-repix-500" />
            {trans.analytics.recentActivity}
          </h2>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 transition-all group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {activity.status === 'success' ? <CheckCircle size={20} /> : <Activity size={20} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-zinc-900 dark:text-white">{activity.tool}</span>
                      <Badge variant="outline" className="text-xs">{activity.credits} credits</Badge>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{activity.prompt}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};
