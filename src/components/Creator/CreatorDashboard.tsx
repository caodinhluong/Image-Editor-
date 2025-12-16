import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, Download, Star, Eye, ShoppingCart,
  Upload, Edit3, Trash2, MoreVertical, Calendar, ArrowUpRight,
  ArrowDownRight, Package, Award, Target, Wallet, Crown
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Button, Card, Badge } from '../ui/UIComponents';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { PayoutSettings } from './PayoutSettings';
import { AnalyticsDeepDive } from './AnalyticsDeepDive';
import { TemplateEditor } from './TemplateEditor';

interface Template {
  id: string;
  name: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  downloads: number;
  rating: number;
  reviews: number;
  status: 'published' | 'draft' | 'pending' | 'rejected';
  thumbnail: string;
  createdAt: Date;
}

interface Sale {
  id: string;
  template: string;
  buyer: string;
  amount: number;
  date: Date;
}

interface Review {
  id: string;
  template: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: Date;
}

export const CreatorDashboard: React.FC = () => {
  const { trans, language } = useLanguage();
  const { canAccess, triggerUpgradeModal } = useSubscription();
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'earnings' | 'reviews' | 'payout' | 'analytics'>('overview');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Check if user has access to Creator Studio (Pro or higher)
  const hasCreatorAccess = canAccess('creatorStudio');

  // If no access, show upgrade prompt
  if (!hasCreatorAccess) {
    return (
      <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Crown className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            {language === 'vi' ? 'Creator Studio' : 'Creator Studio'}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">
            {language === 'vi' 
              ? 'Tính năng Creator Studio chỉ dành cho người dùng Pro trở lên. Nâng cấp để bán template, theo dõi doanh thu và xây dựng thương hiệu của bạn.'
              : 'Creator Studio is available for Pro users and above. Upgrade to sell templates, track earnings, and build your brand.'}
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">
              {language === 'vi' ? 'Với Creator Studio, bạn có thể:' : 'With Creator Studio, you can:'}
            </h3>
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-3">
                <Upload size={18} className="text-repix-500" />
                {language === 'vi' ? 'Tải lên và bán template của bạn' : 'Upload and sell your templates'}
              </li>
              <li className="flex items-center gap-3">
                <DollarSign size={18} className="text-emerald-500" />
                {language === 'vi' ? 'Kiếm tiền từ sáng tạo của bạn' : 'Earn money from your creations'}
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp size={18} className="text-blue-500" />
                {language === 'vi' ? 'Theo dõi doanh số và phân tích' : 'Track sales and analytics'}
              </li>
              <li className="flex items-center gap-3">
                <Star size={18} className="text-amber-500" />
                {language === 'vi' ? 'Nhận đánh giá từ người dùng' : 'Get reviews from users'}
              </li>
            </ul>
          </div>
          <Button 
            onClick={() => triggerUpgradeModal('creatorStudio')}
            className="gap-2 px-8 py-3 text-lg"
          >
            <Crown size={20} />
            {language === 'vi' ? 'Nâng cấp lên Pro' : 'Upgrade to Pro'}
          </Button>
        </div>
      </div>
    );
  }

  // Mock data
  const stats = {
    totalEarnings: 12450,
    thisMonth: 2340,
    totalSales: 1247,
    avgRating: 4.8,
    totalDownloads: 5632,
    activeTemplates: 24
  };

  const revenueData = [
    { month: 'Jan', revenue: 1200, sales: 45 },
    { month: 'Feb', revenue: 1800, sales: 67 },
    { month: 'Mar', revenue: 1500, sales: 52 },
    { month: 'Apr', revenue: 2200, sales: 78 },
    { month: 'May', revenue: 1900, sales: 65 },
    { month: 'Jun', revenue: 2340, sales: 82 }
  ];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Cyberpunk City Pack',
      category: 'Urban',
      price: 29,
      sales: 234,
      revenue: 6786,
      downloads: 456,
      rating: 4.9,
      reviews: 89,
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Nature Landscape Set',
      category: 'Nature',
      price: 19,
      sales: 189,
      revenue: 3591,
      downloads: 312,
      rating: 4.7,
      reviews: 67,
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
      createdAt: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Portrait Retouch Presets',
      category: 'Portrait',
      price: 15,
      sales: 156,
      revenue: 2340,
      downloads: 245,
      rating: 4.8,
      reviews: 54,
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      createdAt: new Date('2024-03-10')
    },
    {
      id: '4',
      name: 'Product Photography Bundle',
      category: 'E-commerce',
      price: 39,
      sales: 98,
      revenue: 3822,
      downloads: 178,
      rating: 4.9,
      reviews: 42,
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
      createdAt: new Date('2024-04-05')
    },
    {
      id: '5',
      name: 'Minimalist Design Pack',
      category: 'Design',
      price: 0,
      sales: 0,
      revenue: 0,
      downloads: 892,
      rating: 4.6,
      reviews: 123,
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop',
      createdAt: new Date('2024-05-12')
    }
  ];

  const recentSales: Sale[] = [
    { id: '1', template: 'Cyberpunk City Pack', buyer: 'John Doe', amount: 29, date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', template: 'Nature Landscape Set', buyer: 'Jane Smith', amount: 19, date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: '3', template: 'Product Photography Bundle', buyer: 'Mike Johnson', amount: 39, date: new Date(Date.now() - 8 * 60 * 60 * 1000) },
    { id: '4', template: 'Portrait Retouch Presets', buyer: 'Sarah Chen', amount: 15, date: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    { id: '5', template: 'Cyberpunk City Pack', buyer: 'Tom Wilson', amount: 29, date: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  ];

  const recentReviews: Review[] = [
    {
      id: '1',
      template: 'Cyberpunk City Pack',
      user: 'Alex Creative',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      rating: 5,
      comment: 'Amazing quality! Exactly what I needed for my project.',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: '2',
      template: 'Nature Landscape Set',
      user: 'Emma Wilson',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      rating: 5,
      comment: 'Beautiful templates, very easy to use!',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '3',
      template: 'Portrait Retouch Presets',
      user: 'David Lee',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      rating: 4,
      comment: 'Good presets, would love more variety.',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusColor = (status: Template['status']) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'draft': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 2xl:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
              <Award className="text-repix-500" size={32} />
              {trans.creator.dashboard}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your templates and track earnings</p>
          </div>
          
          <Button className="mt-4 md:mt-0 gap-2">
            <Upload size={18} />
            {trans.creator.uploadTemplate}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          {(['overview', 'templates', 'analytics', 'earnings', 'reviews', 'payout'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab
                  ? 'text-repix-500 border-b-2 border-repix-500'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'templates' && trans.creator.myTemplates}
              {tab === 'analytics' && '📊 Analytics'}
              {tab === 'earnings' && trans.creator.earnings}
              {tab === 'reviews' && trans.creator.reviews}
              {tab === 'payout' && <><Wallet size={16} /> Payout</>}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-6">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <DollarSign className="text-emerald-500" size={24} />
                  </div>
                  <Badge className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    <ArrowUpRight size={12} />
                    +12.5%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  ${stats.totalEarnings.toLocaleString()}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.creator.totalEarnings}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  ${stats.thisMonth} {trans.creator.thisMonth}
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <ShoppingCart className="text-blue-500" size={24} />
                  </div>
                  <Badge variant="default" className="flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    +8.3%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {stats.totalSales.toLocaleString()}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.creator.totalSales}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Star className="text-amber-500" size={24} />
                  </div>
                  <Badge variant="default" className="flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    +0.2
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {stats.avgRating}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.creator.avgRating}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Download className="text-purple-500" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {stats.totalDownloads.toLocaleString()}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.creator.totalDownloads}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-pink-500/10">
                    <Package className="text-pink-500" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  {stats.activeTemplates}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.creator.activeTemplates}</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10">
                    <Target className="text-cyan-500" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                  22.1%
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.creator.conversionRate}</p>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-repix-500" />
                {trans.creator.revenue} & {trans.creator.sales}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#71717a" style={{ fontSize: '12px' }} />
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
                  <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#3b82f6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Recent Sales & Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 2xl:gap-6">
              {/* Recent Sales */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.creator.recentSales}</h2>
                <div className="space-y-3">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-zinc-900 dark:text-white">{sale.template}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{sale.buyer} • {formatTimeAgo(sale.date)}</p>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">${sale.amount}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Reviews */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.creator.recentReviews}</h2>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-start gap-3 mb-2">
                        <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-zinc-900 dark:text-white">{review.user}</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">{review.comment}</p>
                          <p className="text-[10px] text-zinc-500">{review.template} • {formatTimeAgo(review.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 2xl:gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                      {trans.creator[template.status]}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{template.category}</p>
                    
                    <div className="flex items-center gap-4 mb-3 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <ShoppingCart size={12} />
                        {template.sales}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download size={12} />
                        {template.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {template.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-zinc-900 dark:text-white">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingTemplateId(template.id)}>
                          <Edit3 size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{trans.creator.balance}</h3>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">${stats.totalEarnings.toLocaleString()}</p>
                <Button className="w-full">{trans.creator.withdraw}</Button>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{trans.creator.pendingBalance}</h3>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white">$1,234</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">{trans.creator.nextPayout}</h3>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">Dec 15, 2024</p>
              </Card>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-zinc-900 dark:text-white">{review.user}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-zinc-500">• {formatTimeAgo(review.date)}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 mb-2">{review.comment}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{review.template}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDeepDive />
        )}

        {/* Payout Tab */}
        {activeTab === 'payout' && (
          <PayoutSettings />
        )}
      </div>

      {/* Template Editor Modal */}
      {editingTemplateId && (
        <TemplateEditor
          templateId={editingTemplateId}
          onClose={() => setEditingTemplateId(null)}
          onSave={() => setEditingTemplateId(null)}
        />
      )}
    </div>
  );
};
