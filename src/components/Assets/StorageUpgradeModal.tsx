import React, { useState } from 'react';
import {
  X, Check, HardDrive, Cloud, Sparkles, Crown, Building2, Zap,
  Plus, ShoppingCart, Star, TrendingUp, Package
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PlanType, PLANS } from '../../types/subscription';

interface StorageUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsed: number; // in GB
  currentTotal: number; // in GB
  onUpgrade?: (newTotal: number) => void; // callback when storage is upgraded
}

interface StoragePlan {
  id: PlanType;
  storage: number; // in GB
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface StorageAddon {
  id: string;
  amount: number; // in GB
  price: number;
  priceVND: number;
  popular?: boolean;
}

export const StorageUpgradeModal: React.FC<StorageUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentUsed,
  currentTotal,
  onUpgrade,
}) => {
  const { language } = useLanguage();
  const { currentPlan, upgradePlan } = useSubscription();
  const [activeTab, setActiveTab] = useState<'plans' | 'addon'>('plans');
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const storagePlans: StoragePlan[] = [
    { id: 'free', storage: 5, icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'plus', storage: 50, icon: Sparkles, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { id: 'pro', storage: 200, icon: Crown, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { id: 'team', storage: -1, icon: Building2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' }, // -1 = unlimited
  ];

  const storageAddons: StorageAddon[] = [
    { id: 'addon-10', amount: 10, price: 2, priceVND: 49000 },
    { id: 'addon-50', amount: 50, price: 8, priceVND: 179000, popular: true },
    { id: 'addon-100', amount: 100, price: 14, priceVND: 319000 },
    { id: 'addon-500', amount: 500, price: 59, priceVND: 1299000 },
  ];

  const usagePercent = Math.round((currentUsed / currentTotal) * 100);

  const handleUpgradePlan = async (planId: PlanType) => {
    if (planId === currentPlan) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    upgradePlan(planId);
    
    // Get new storage based on plan
    const newPlanStorage = storagePlans.find(p => p.id === planId)?.storage || currentTotal;
    const newTotal = newPlanStorage === -1 ? 999999 : newPlanStorage; // -1 = unlimited
    onUpgrade?.(newTotal);
    
    setIsProcessing(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  const handlePurchaseAddon = async () => {
    if (!selectedAddon) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate new total storage
    const addonAmount = storageAddons.find(a => a.id === selectedAddon)?.amount || 0;
    const newTotal = currentTotal + addonAmount;
    onUpgrade?.(newTotal);
    
    setIsProcessing(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedAddon(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={20} className="text-zinc-500" />
        </button>

        {/* Success Animation */}
        {showSuccess && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 dark:bg-zinc-900/95 rounded-2xl">
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Check className="text-white" size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Thành công!' : 'Success!'}
              </h2>
              <p className="text-zinc-500">
                {language === 'vi' ? 'Dung lượng đã được nâng cấp' : 'Storage has been upgraded'}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <Cloud size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Nâng cấp dung lượng' : 'Upgrade Storage'}
              </h2>
              <p className="text-sm text-zinc-500">
                {language === 'vi' ? 'Mở rộng không gian lưu trữ của bạn' : 'Expand your storage space'}
              </p>
            </div>
          </div>

          {/* Current Usage */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {language === 'vi' ? 'Đang sử dụng' : 'Current usage'}
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {currentUsed} GB / {currentTotal} GB
              </span>
            </div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-repix-500 to-pink-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent > 80 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <TrendingUp size={12} />
                {language === 'vi' ? 'Dung lượng sắp đầy! Hãy nâng cấp ngay.' : 'Storage almost full! Upgrade now.'}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'plans'
                ? 'text-repix-600 dark:text-repix-400'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package size={16} />
              {language === 'vi' ? 'Nâng cấp gói' : 'Upgrade Plan'}
            </div>
            {activeTab === 'plans' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-repix-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('addon')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'addon'
                ? 'text-repix-600 dark:text-repix-400'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={16} />
              {language === 'vi' ? 'Mua thêm dung lượng' : 'Buy Extra Storage'}
            </div>
            {activeTab === 'addon' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-repix-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'plans' ? (
            /* Plans Tab */
            <div className="space-y-3">
              <p className="text-sm text-zinc-500 mb-4">
                {language === 'vi' 
                  ? 'Nâng cấp gói để nhận thêm dung lượng và nhiều tính năng khác'
                  : 'Upgrade your plan to get more storage and features'}
              </p>
              
              {storagePlans.map((plan) => {
                const planData = PLANS[plan.id];
                const Icon = plan.icon;
                const isCurrentPlan = plan.id === currentPlan;
                const isUpgrade = storagePlans.findIndex(p => p.id === plan.id) > storagePlans.findIndex(p => p.id === currentPlan);

                return (
                  <div
                    key={plan.id}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isCurrentPlan
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {/* Plan Icon */}
                    <div className={`p-3 rounded-xl ${plan.bgColor}`}>
                      <Icon size={24} className={plan.color} />
                    </div>

                    {/* Plan Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-zinc-900 dark:text-white">
                          {planData.name}
                        </h4>
                        {isCurrentPlan && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                            {language === 'vi' ? 'HIỆN TẠI' : 'CURRENT'}
                          </span>
                        )}
                        {planData.isPopular && !isCurrentPlan && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500 text-white rounded-full flex items-center gap-1">
                            <Star size={8} fill="currentColor" /> POPULAR
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <HardDrive size={14} />
                          {plan.storage === -1 
                            ? (language === 'vi' ? 'Không giới hạn' : 'Unlimited')
                            : `${plan.storage} GB`
                          }
                        </span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-sm text-zinc-500">
                          {planData.price === 'custom' 
                            ? (language === 'vi' ? 'Liên hệ' : 'Custom')
                            : planData.price === 0 
                              ? 'Free'
                              : `$${planData.price}/${language === 'vi' ? 'tháng' : 'mo'}`
                          }
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    {isCurrentPlan ? (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <Check size={16} />
                        {language === 'vi' ? 'Đang dùng' : 'Active'}
                      </div>
                    ) : isUpgrade ? (
                      <Button
                        size="sm"
                        onClick={() => handleUpgradePlan(plan.id)}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-repix-500 to-pink-500 hover:from-repix-600 hover:to-pink-600"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          language === 'vi' ? 'Nâng cấp' : 'Upgrade'
                        )}
                      </Button>
                    ) : (
                      <span className="text-xs text-zinc-400">
                        {language === 'vi' ? 'Gói thấp hơn' : 'Lower tier'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Addon Tab */
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 mb-4">
                {language === 'vi' 
                  ? 'Mua thêm dung lượng mà không cần nâng cấp gói. Dung lượng mua thêm không hết hạn.'
                  : 'Buy extra storage without upgrading your plan. Add-on storage never expires.'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {storageAddons.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => setSelectedAddon(addon.id)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAddon === addon.id
                        ? 'border-repix-500 bg-repix-50 dark:bg-repix-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    {addon.popular && (
                      <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-repix-500 to-pink-500 text-white rounded-full">
                        {language === 'vi' ? 'PHỔ BIẾN' : 'POPULAR'}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive size={20} className={selectedAddon === addon.id ? 'text-repix-500' : 'text-zinc-400'} />
                      <span className="text-xl font-bold text-zinc-900 dark:text-white">
                        +{addon.amount} GB
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-repix-600 dark:text-repix-400">
                      ${addon.price}
                      <span className="text-xs text-zinc-400 font-normal ml-1">
                        ({addon.priceVND.toLocaleString()}đ)
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      ${(addon.price / addon.amount).toFixed(2)}/GB
                    </div>
                  </button>
                ))}
              </div>

              {/* Purchase Summary */}
              {selectedAddon && (
                <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {language === 'vi' ? 'Dung lượng sau khi mua' : 'Storage after purchase'}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {currentTotal + (storageAddons.find(a => a.id === selectedAddon)?.amount || 0)} GB
                    </span>
                  </div>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-repix-500 to-pink-500 hover:from-repix-600 hover:to-pink-600"
                    onClick={handlePurchaseAddon}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        {language === 'vi' ? 'Mua ngay' : 'Purchase Now'} - ${storageAddons.find(a => a.id === selectedAddon)?.price}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-zinc-400">
            {language === 'vi'
              ? '🔒 Thanh toán an toàn • Hỗ trợ 24/7 • Hoàn tiền trong 7 ngày'
              : '🔒 Secure payment • 24/7 support • 7-day money back guarantee'}
          </p>
        </div>
      </div>
    </div>
  );
};
