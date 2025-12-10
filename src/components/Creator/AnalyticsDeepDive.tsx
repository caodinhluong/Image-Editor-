import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Eye, ShoppingCart, Download,
  Globe, Users, MousePointer, ArrowRight, Calendar, Filter,
  BarChart3, PieChart, Activity, Layers, ChevronDown, ArrowUpRight,
  ArrowDownRight, Target, Zap, Clock, MapPin, ExternalLink
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  AreaChart, Area, ComposedChart, Funnel, FunnelChart, LabelList
} from 'recharts';

interface TemplateStats {
  id: string;
  name: string;
  thumbnail: string;
  revenue: number;
  sales: number;
  views: number;
  conversionRate: number;
  trend: number;
}

export const AnalyticsDeepDive: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTemplates, setCompareTemplates] = useState<string[]>([]);

  // Mock data - Revenue over time
  const revenueData = [
    { date: 'Dec 1', revenue: 245, sales: 12, views: 890 },
    { date: 'Dec 2', revenue: 312, sales: 15, views: 1020 },
    { date: 'Dec 3', revenue: 189, sales: 9, views: 756 },
    { date: 'Dec 4', revenue: 423, sales: 21, views: 1340 },
    { date: 'Dec 5', revenue: 367, sales: 18, views: 1180 },
    { date: 'Dec 6', revenue: 298, sales: 14, views: 945 },
    { date: 'Dec 7', revenue: 456, sales: 23, views: 1520 },
    { date: 'Dec 8', revenue: 389, sales: 19, views: 1290 },
    { date: 'Dec 9', revenue: 512, sales: 26, views: 1680 },
    { date: 'Dec 10', revenue: 478, sales: 24, views: 1450 },
  ];

  // Geographic data
  const geoData = [
    { country: 'United States', code: 'US', sales: 456, revenue: 8920, percentage: 38 },
    { country: 'United Kingdom', code: 'GB', sales: 234, revenue: 4560, percentage: 19 },
    { country: 'Germany', code: 'DE', sales: 189, revenue: 3680, percentage: 16 },
    { country: 'France', code: 'FR', sales: 145, revenue: 2830, percentage: 12 },
    { country: 'Canada', code: 'CA', sales: 98, revenue: 1910, percentage: 8 },
    { country: 'Others', code: 'OT', sales: 85, revenue: 1660, percentage: 7 },
  ];

  // Traffic sources
  const trafficData = [
    { name: 'Organic Search', value: 42, color: '#10b981' },
    { name: 'Direct', value: 28, color: '#3b82f6' },
    { name: 'Social Media', value: 18, color: '#8b5cf6' },
    { name: 'Referral', value: 8, color: '#f59e0b' },
    { name: 'Email', value: 4, color: '#ec4899' },
  ];

  // Conversion funnel
  const funnelData = [
    { name: 'Page Views', value: 12450, fill: '#3b82f6' },
    { name: 'Template Views', value: 8320, fill: '#6366f1' },
    { name: 'Add to Cart', value: 2840, fill: '#8b5cf6' },
    { name: 'Checkout', value: 1560, fill: '#a855f7' },
    { name: 'Purchase', value: 1247, fill: '#10b981' },
  ];

  // Template performance
  const templateStats: TemplateStats[] = [
    { id: '1', name: 'Nike Sneaker Studio', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', revenue: 6786, sales: 234, views: 4520, conversionRate: 5.2, trend: 12.5 },
    { id: '2', name: 'Luxury Handbag Shot', thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop', revenue: 3591, sales: 189, views: 3210, conversionRate: 5.9, trend: 8.3 },
    { id: '3', name: 'Watch Macro Pro', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', revenue: 2340, sales: 156, views: 2890, conversionRate: 5.4, trend: -2.1 },
    { id: '4', name: 'Perfume Elegance', thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=100&h=100&fit=crop', revenue: 3822, sales: 98, views: 1560, conversionRate: 6.3, trend: 15.7 },
    { id: '5', name: 'Sunglasses Reflect', thumbnail: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop', revenue: 0, sales: 0, views: 2340, conversionRate: 0, trend: 0 },
  ];

  // Compare data
  const compareData = [
    { date: 'Week 1', template1: 1200, template2: 890, template3: 650 },
    { date: 'Week 2', template1: 1450, template2: 1020, template3: 780 },
    { date: 'Week 3', template1: 1320, template2: 1150, template3: 920 },
    { date: 'Week 4', template1: 1680, template2: 1340, template3: 1050 },
  ];

  const totalRevenue = templateStats.reduce((sum, t) => sum + t.revenue, 0);
  const totalSales = templateStats.reduce((sum, t) => sum + t.sales, 0);
  const totalViews = templateStats.reduce((sum, t) => sum + t.views, 0);
  const avgConversion = (totalSales / totalViews * 100).toFixed(1);

  const toggleCompareTemplate = (id: string) => {
    if (compareTemplates.includes(id)) {
      setCompareTemplates(prev => prev.filter(t => t !== id));
    } else if (compareTemplates.length < 3) {
      setCompareTemplates(prev => [...prev, id]);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-blue-500" size={28} />
            Analytics Deep Dive
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Detailed insights into your template performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {range === '7d' && '7 Days'}
                {range === '30d' && '30 Days'}
                {range === '90d' && '90 Days'}
                {range === '1y' && '1 Year'}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Calendar size={14} className="mr-2" />
            Custom
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <DollarSign className="text-emerald-500" size={18} />
            </div>
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-0 flex items-center gap-1">
              <ArrowUpRight size={10} />
              +12.5%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">${totalRevenue.toLocaleString()}</h3>
          <p className="text-xs text-zinc-500 mt-1">Total Revenue</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <ShoppingCart className="text-blue-500" size={18} />
            </div>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-0 flex items-center gap-1">
              <ArrowUpRight size={10} />
              +8.3%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{totalSales.toLocaleString()}</h3>
          <p className="text-xs text-zinc-500 mt-1">Total Sales</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Eye className="text-purple-500" size={18} />
            </div>
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-0 flex items-center gap-1">
              <ArrowUpRight size={10} />
              +15.2%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{totalViews.toLocaleString()}</h3>
          <p className="text-xs text-zinc-500 mt-1">Total Views</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Target className="text-amber-500" size={18} />
            </div>
            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-0 flex items-center gap-1">
              <ArrowUpRight size={10} />
              +0.3%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{avgConversion}%</h3>
          <p className="text-xs text-zinc-500 mt-1">Conversion Rate</p>
        </Card>
      </div>

      {/* Revenue & Sales Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            Revenue & Sales Trend
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-zinc-500">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-zinc-500">Sales</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
            <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '11px' }} />
            <YAxis yAxisId="left" stroke="#71717a" style={{ fontSize: '11px' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#71717a" style={{ fontSize: '11px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
            <Bar yAxisId="right" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Globe size={18} className="text-blue-500" />
            Sales by Country
          </h3>
          <div className="space-y-4">
            {geoData.map((country, idx) => (
              <div key={country.code} className="flex items-center gap-4">
                <div className="w-8 text-center">
                  <span className="text-lg">{['🇺🇸', '🇬🇧', '🇩🇪', '🇫🇷', '🇨🇦', '🌍'][idx]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{country.country}</span>
                    <span className="text-sm text-zinc-500">{country.percentage}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">${country.revenue.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">{country.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <MousePointer size={18} className="text-purple-500" />
            Traffic Sources
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {trafficData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{source.name}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>


      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
          <Layers size={18} className="text-purple-500" />
          Conversion Funnel
        </h3>
        <div className="flex items-center justify-between gap-4">
          {funnelData.map((step, idx) => (
            <div key={step.name} className="flex-1 text-center relative">
              <div 
                className="mx-auto mb-3 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                style={{ 
                  backgroundColor: step.fill + '20',
                  width: `${100 - idx * 15}%`,
                  height: '80px'
                }}
              >
                <span className="text-xl font-bold" style={{ color: step.fill }}>
                  {step.value.toLocaleString()}
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{step.name}</p>
              {idx < funnelData.length - 1 && (
                <div className="absolute top-8 -right-2 text-zinc-400">
                  <ArrowRight size={16} />
                </div>
              )}
              {idx > 0 && (
                <p className="text-[10px] text-zinc-500 mt-1">
                  {((step.value / funnelData[idx - 1].value) * 100).toFixed(1)}% from prev
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="text-emerald-500" size={18} />
              <span className="font-medium text-emerald-700 dark:text-emerald-300">Overall Conversion Rate</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </Card>

      {/* Template Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            Template Performance
          </h3>
          <Button 
            variant={compareMode ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              if (compareMode) setCompareTemplates([]);
            }}
          >
            {compareMode ? `Compare (${compareTemplates.length}/3)` : 'Compare Templates'}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {compareMode && <th className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase">Select</th>}
                <th className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase">Template</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase">Sales</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase">Views</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase">Conv. Rate</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {templateStats.map((template) => (
                <tr 
                  key={template.id} 
                  className={`hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors ${
                    compareTemplates.includes(template.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  {compareMode && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={compareTemplates.includes(template.id)}
                        onChange={() => toggleCompareTemplate(template.id)}
                        disabled={!compareTemplates.includes(template.id) && compareTemplates.length >= 3}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={template.thumbnail} alt={template.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-zinc-900 dark:text-white">{template.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-zinc-900 dark:text-white">
                    ${template.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-400">
                    {template.sales}
                  </td>
                  <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-400">
                    {template.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-400">
                    {template.conversionRate}%
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                      template.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 
                      template.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-500'
                    }`}>
                      {template.trend > 0 ? <TrendingUp size={14} /> : template.trend < 0 ? <TrendingDown size={14} /> : null}
                      {template.trend > 0 ? '+' : ''}{template.trend}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Compare Chart (shown when templates selected) */}
      {compareMode && compareTemplates.length >= 2 && (
        <Card className="p-6">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-500" />
            Template Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={compareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: '11px' }} />
              <YAxis stroke="#71717a" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend />
              {compareTemplates[0] && (
                <Bar dataKey="template1" name={templateStats.find(t => t.id === compareTemplates[0])?.name || 'Template 1'} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              )}
              {compareTemplates[1] && (
                <Bar dataKey="template2" name={templateStats.find(t => t.id === compareTemplates[1])?.name || 'Template 2'} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              )}
              {compareTemplates[2] && (
                <Bar dataKey="template3" name={templateStats.find(t => t.id === compareTemplates[2])?.name || 'Template 3'} fill="#10b981" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Insights & Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          AI Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/80 dark:bg-zinc-900/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-emerald-500" size={16} />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Top Performer</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>Cyberpunk City Pack</strong> is your best seller with 5.2% conversion rate. Consider creating similar themed templates.
            </p>
          </div>
          <div className="p-4 bg-white/80 dark:bg-zinc-900/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="text-blue-500" size={16} />
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Market Opportunity</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              38% of sales come from US. Consider localizing content for <strong>Germany</strong> and <strong>France</strong> to grow EU market.
            </p>
          </div>
          <div className="p-4 bg-white/80 dark:bg-zinc-900/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-purple-500" size={16} />
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Conversion Tip</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Your cart-to-checkout rate is <strong>54.9%</strong>. Adding more preview images could improve this by 10-15%.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
