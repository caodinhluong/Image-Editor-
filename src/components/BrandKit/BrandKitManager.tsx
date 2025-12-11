import React, { useState } from 'react';
import { Palette, Plus, Edit, Trash2, Check, Lock, Crown, Sparkles, Eye, Copy, Star, ArrowRight, X } from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useBrandKit } from '../../contexts/BrandKitContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BrandKit } from '../../types/brandKit';
import { BatchProcessor } from './BatchProcessor';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { FeatureGate } from '../Subscription/FeatureGate';

// Demo Brand Kits Component
const DemoBrandKits: React.FC<{ language: string; onCreateNew: () => void }> = ({ language, onCreateNew }) => {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [showAllDemos, setShowAllDemos] = useState(false);

  const demoBrandKits = [
    {
      id: 'nike',
      name: 'Nike',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png',
      colors: ['#000000', '#FFFFFF', '#FF6B00', '#7C7C7C'],
      keywords: ['Bold', 'Athletic', 'Dynamic', 'Inspiring'],
      font: 'Futura Bold',
      style: language === 'vi' ? 'Thể thao, năng động, mạnh mẽ' : 'Athletic, dynamic, powerful',
      preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      category: 'Sports'
    },
    {
      id: 'apple',
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/100px-Apple_logo_black.svg.png',
      colors: ['#000000', '#FFFFFF', '#86868B', '#F5F5F7'],
      keywords: ['Minimal', 'Premium', 'Clean', 'Innovative'],
      font: 'SF Pro Display',
      style: language === 'vi' ? 'Tối giản, cao cấp, tinh tế' : 'Minimal, premium, sophisticated',
      preview: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400&h=300&fit=crop',
      category: 'Tech'
    },
    {
      id: 'coca-cola',
      name: 'Coca-Cola',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png',
      colors: ['#F40009', '#FFFFFF', '#000000', '#FFC20E'],
      keywords: ['Classic', 'Joyful', 'Refreshing', 'Iconic'],
      font: 'Spencerian Script',
      style: language === 'vi' ? 'Cổ điển, vui vẻ, sảng khoái' : 'Classic, joyful, refreshing',
      preview: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
      category: 'Beverage'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/100px-Spotify_logo_without_text.svg.png',
      colors: ['#1DB954', '#191414', '#FFFFFF', '#535353'],
      keywords: ['Modern', 'Vibrant', 'Musical', 'Connected'],
      font: 'Circular',
      style: language === 'vi' ? 'Hiện đại, sôi động, kết nối' : 'Modern, vibrant, connected',
      preview: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop',
      category: 'Music'
    },
    {
      id: 'gucci',
      name: 'Gucci',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/200px-1960s_Gucci_Logo.svg.png',
      colors: ['#000000', '#D4AF37', '#FFFFFF', '#8B0000'],
      keywords: ['Luxury', 'Elegant', 'Bold', 'Heritage'],
      font: 'Granjon',
      style: language === 'vi' ? 'Xa xỉ, sang trọng, di sản' : 'Luxury, elegant, heritage',
      preview: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
      category: 'Fashion'
    },
    {
      id: 'starbucks',
      name: 'Starbucks',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/100px-Starbucks_Corporation_Logo_2011.svg.png',
      colors: ['#00704A', '#FFFFFF', '#1E3932', '#D4E9E2'],
      keywords: ['Warm', 'Inviting', 'Premium', 'Community'],
      font: 'Freight Sans',
      style: language === 'vi' ? 'Ấm áp, thân thiện, cộng đồng' : 'Warm, inviting, community',
      preview: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&h=300&fit=crop',
      category: 'Coffee'
    },
  ];

  const displayedDemos = showAllDemos ? demoBrandKits : demoBrandKits.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            {language === 'vi' ? 'Brand Kit Mẫu' : 'Demo Brand Kits'}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {language === 'vi' ? 'Tham khảo các brand kit từ thương hiệu nổi tiếng' : 'Get inspired by famous brand identities'}
          </p>
        </div>
        <button
          onClick={() => setShowAllDemos(!showAllDemos)}
          className="text-sm text-repix-500 hover:text-repix-600 font-medium flex items-center gap-1"
        >
          {showAllDemos 
            ? (language === 'vi' ? 'Thu gọn' : 'Show less')
            : (language === 'vi' ? 'Xem tất cả' : 'View all')
          }
          <ArrowRight size={14} className={`transition-transform ${showAllDemos ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedDemos.map((demo) => (
          <Card 
            key={demo.id}
            className={`overflow-hidden group cursor-pointer transition-all hover:shadow-xl ${
              selectedDemo === demo.id ? 'ring-2 ring-repix-500' : ''
            }`}
            onClick={() => setSelectedDemo(selectedDemo === demo.id ? null : demo.id)}
          >
            {/* Preview Image */}
            <div className="relative h-40 overflow-hidden">
              <img 
                src={demo.preview} 
                alt={demo.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Logo overlay */}
              <div className="absolute top-3 left-3 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-lg backdrop-blur-sm">
                <img src={demo.logo} alt={demo.name} className="h-6 w-auto object-contain" />
              </div>

              {/* Category badge */}
              <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 text-[10px]">
                {demo.category}
              </Badge>

              {/* Brand name */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xl font-bold text-white">{demo.name}</h3>
                <p className="text-white/80 text-xs mt-0.5">{demo.style}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Colors */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 w-16">
                  {language === 'vi' ? 'Màu sắc' : 'Colors'}
                </span>
                <div className="flex gap-1.5">
                  {demo.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Font */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 w-16">
                  {language === 'vi' ? 'Font' : 'Font'}
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{demo.font}</span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {demo.keywords.map((keyword, idx) => (
                  <Badge key={idx} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {keyword}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDemo(demo.id);
                  }}
                >
                  <Eye size={14} />
                  {language === 'vi' ? 'Xem' : 'Preview'}
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNew();
                  }}
                >
                  <Copy size={14} />
                  {language === 'vi' ? 'Dùng mẫu' : 'Use Template'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Demo Detail Modal */}
      {selectedDemo && (
        <DemoDetailModal 
          demo={demoBrandKits.find(d => d.id === selectedDemo)!}
          language={language}
          onClose={() => setSelectedDemo(null)}
          onUseTemplate={onCreateNew}
        />
      )}
    </div>
  );
};

// Demo Detail Modal
const DemoDetailModal: React.FC<{
  demo: {
    id: string;
    name: string;
    logo: string;
    colors: string[];
    keywords: string[];
    font: string;
    style: string;
    preview: string;
    category: string;
  };
  language: string;
  onClose: () => void;
  onUseTemplate: () => void;
}> = ({ demo, language, onClose, onUseTemplate }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Preview */}
        <div className="relative h-48 shrink-0">
          <img src={demo.preview} alt={demo.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Brand info */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <img src={demo.logo} alt={demo.name} className="h-10 w-auto object-contain" />
              </div>
              <div>
                <Badge className="mb-2 bg-white/20 text-white border-white/30">{demo.category}</Badge>
                <h2 className="text-3xl font-bold text-white">{demo.name}</h2>
                <p className="text-white/80 text-sm">{demo.style}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Color Palette */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                {language === 'vi' ? 'Bảng màu' : 'Color Palette'}
              </h3>
              <div className="space-y-2">
                {demo.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                    <div 
                      className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{color}</p>
                      <p className="text-xs text-zinc-500">
                        {idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : `Accent ${idx - 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Keywords */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  {language === 'vi' ? 'Typography' : 'Typography'}
                </h3>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{demo.font}</p>
                  <p className="text-sm text-zinc-500">{language === 'vi' ? 'Font chính' : 'Primary Font'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  {language === 'vi' ? 'Từ khóa phong cách' : 'Style Keywords'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {demo.keywords.map((keyword, idx) => (
                    <Badge 
                      key={idx} 
                      className="px-3 py-1.5 bg-gradient-to-r from-repix-500/10 to-pink-500/10 text-repix-600 dark:text-repix-400 border-repix-500/20"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {language === 'vi' ? 'Đóng' : 'Close'}
            </Button>
            <Button className="flex-1 gap-2" onClick={onUseTemplate}>
              <Sparkles size={16} />
              {language === 'vi' ? 'Tạo Brand Kit tương tự' : 'Create Similar Brand Kit'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BrandKitManagerProps {
  onCreateNew: () => void;
  onEdit: (brandKit: BrandKit) => void;
}

export const BrandKitManager: React.FC<BrandKitManagerProps> = ({ onCreateNew, onEdit }) => {
  const { brandKits, activeBrandKit, setActiveBrandKit, deleteBrandKit, isLoading } = useBrandKit();
  const { trans, language } = useLanguage();
  const { getBrandKitLimit, canAccess, triggerUpgradeModal, currentPlan } = useSubscription();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'kits' | 'batch'>('kits');

  const brandKitLimit = getBrandKitLimit();
  const canCreateMore = brandKitLimit === -1 || brandKits.length < brandKitLimit;
  const canAccessBatch = canAccess('batchProcess');

  const handleCreateNew = () => {
    if (!canCreateMore) {
      triggerUpgradeModal('multipleBrandKits');
      return;
    }
    onCreateNew();
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await deleteBrandKit(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleUse = (brandKit: BrandKit) => {
    setActiveBrandKit(brandKit);
  };

  if (isLoading && brandKits.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-repix-500 mx-auto mb-4"></div>
          <p className="text-zinc-500 dark:text-zinc-400">Loading brand kits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <Palette size={32} className="text-repix-500" />
              {trans.brandkit.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              {trans.brandkit.subtitle}
            </p>
          </div>
          {activeTab === 'kits' && (
            <div className="flex items-center gap-3">
              {/* Brand kit limit indicator */}
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {brandKits.length}/{brandKitLimit === -1 ? '∞' : brandKitLimit} {language === 'vi' ? 'brand kits' : 'brand kits'}
              </div>
              <Button onClick={handleCreateNew} size="lg" className="gap-2">
                {!canCreateMore && <Lock size={16} />}
                <Plus size={20} />
                {trans.brandkit.createNew}
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('kits')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'kits'
                ? 'text-repix-600 dark:text-repix-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            My Brand Kits
            {activeTab === 'kits' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-repix-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'batch'
                ? 'text-repix-600 dark:text-repix-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Batch Processing
            <Badge variant="pro" className="text-[10px] px-1.5">PRO</Badge>
            {activeTab === 'batch' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-repix-500" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'batch' ? (
          <FeatureGate feature="batchProcess" showLockOverlay={true} blurContent={true}>
            <BatchProcessor />
          </FeatureGate>
        ) : (
          <>
            {/* Active Brand Kit Banner */}
            {activeBrandKit && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-repix-500/10 to-pink-500/10 border-repix-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center">
                  <Check size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.brandkit.activeBrand}</p>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{activeBrandKit.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {activeBrandKit.profile.primaryColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg border-2 border-white dark:border-zinc-800 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveBrandKit(null)}>
                  {trans.brandkit.clearActive}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Demo Brand Kits Section */}
        <DemoBrandKits language={language} onCreateNew={handleCreateNew} />

        {/* Empty State */}
        {brandKits.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center mx-auto mb-6">
              <Palette size={40} className="text-repix-500" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
              {trans.brandkit.noBrandKits}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              {trans.brandkit.noBrandKitsDesc}
            </p>
            <Button onClick={onCreateNew} size="lg" className="gap-2">
              <Plus size={20} />
              {trans.brandkit.createFirst}
            </Button>
          </Card>
        )}

        {/* Brand Kits Grid */}
            {brandKits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandKits.map((brandKit) => (
              <div
                key={brandKit.id}
                className="relative"
              >
                {/* Rotating border for active brand kit */}
                {activeBrandKit?.id === brandKit.id && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div 
                      className="absolute inset-0 animate-spin-slow" 
                      style={{
                        background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #a855f7)',
                        animation: 'spin 3s linear infinite',
                        filter: 'blur(8px)',
                        opacity: 0.7
                      }} 
                    />
                    <div 
                      className="absolute inset-0 animate-spin-slow" 
                      style={{
                        background: 'conic-gradient(from 0deg, #a855f7, #ec4899, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #a855f7)',
                        animation: 'spin 3s linear infinite'
                      }} 
                    />
                    <div className="absolute inset-[3px] rounded-2xl bg-white dark:bg-zinc-900" />
                  </div>
                )}
              <Card
                className={`relative p-6 hover:shadow-xl transition-all cursor-pointer group ${
                  activeBrandKit?.id === brandKit.id
                    ? 'bg-white dark:bg-zinc-900'
                    : ''
                }`}
              >
                {/* Logo or Icon */}
                <div className="mb-4">
                  {brandKit.profile.logo ? (
                    <img
                      src={brandKit.profile.logo.url}
                      alt={brandKit.name}
                      className="w-16 h-16 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center">
                      <Palette size={32} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Brand Name */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {brandKit.name}
                </h3>

                {/* Colors */}
                <div className="flex gap-2 mb-4">
                  {brandKit.profile.primaryColors.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg border-2 border-white dark:border-zinc-800 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {brandKit.profile.primaryColors.length > 5 && (
                    <div className="w-8 h-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                      +{brandKit.profile.primaryColors.length - 5}
                    </div>
                  )}
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {brandKit.profile.styleKeywords.slice(0, 3).map((keyword, idx) => (
                    <Badge key={idx} className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                  <span>{trans.brandkit.used} {brandKit.metadata.usageCount}x</span>
                  <span>
                    {brandKit.learnedStyle.mood.alignment}% {trans.brandkit.consistency}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {activeBrandKit?.id === brandKit.id ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      <Check size={16} className="mr-1" />
                      {trans.brandkit.active}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleUse(brandKit)}
                    >
                      {trans.brandkit.use}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(brandKit)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant={deleteConfirm === brandKit.id ? 'destructive' : 'ghost'}
                    size="sm"
                    onClick={() => handleDelete(brandKit.id)}
                    disabled={activeBrandKit?.id === brandKit.id}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {deleteConfirm === brandKit.id && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
                    {trans.brandkit.confirmDelete}
                  </p>
                )}
              </Card>
              </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add keyframes for rotating border */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
