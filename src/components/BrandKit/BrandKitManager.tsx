import React, { useState } from 'react';
import { Palette, Plus, Edit, Trash2, Check, Lock, Crown } from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useBrandKit } from '../../contexts/BrandKitContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BrandKit } from '../../types/brandKit';
import { BatchProcessor } from './BatchProcessor';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { FeatureGate } from '../Subscription/FeatureGate';

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
