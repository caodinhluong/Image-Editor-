import React, { useState, useMemo } from 'react';
import { X, Zap, Check, CreditCard, Sparkles, Gift, TrendingUp, Lock, ArrowUp } from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PaymentModal } from './PaymentModal';
import { PLANS, PlanType } from '../../types/subscription';

interface CreditTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  bonus: number;
  popular?: boolean;
  bestValue?: boolean;
  minPlan: PlanType; // Minimum plan required to purchase this package
}

export const CreditTopUpModal: React.FC<CreditTopUpModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { credits, currentPlan, addCredits, setShowUpgradeModal } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Credit packages with plan restrictions
  // Max credits purchasable = plan's max credits
  // Free: 50, Plus: 300, Pro: 1000, Team: unlimited
  const creditPackages: CreditPackage[] = [
    { id: 'starter', credits: 50, price: 4.99, bonus: 0, minPlan: 'free' },
    { id: 'basic', credits: 100, price: 8.99, bonus: 10, popular: true, minPlan: 'plus' },
    { id: 'standard', credits: 250, price: 19.99, bonus: 30, minPlan: 'plus' },
    { id: 'premium', credits: 500, price: 34.99, bonus: 75, bestValue: true, minPlan: 'pro' },
    { id: 'pro', credits: 1000, price: 59.99, bonus: 200, minPlan: 'pro' },
  ];

  // Plan hierarchy for comparison
  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    plus: 1,
    pro: 2,
    team: 3,
  };

  // Check if package is available for current plan
  const isPackageAvailable = (pkg: CreditPackage): boolean => {
    return planHierarchy[currentPlan] >= planHierarchy[pkg.minPlan];
  };

  // Get max credits allowed for current plan
  const maxCreditsForPlan = useMemo(() => {
    return PLANS[currentPlan].credits;
  }, [currentPlan]);

  // Filter available packages based on current plan
  const availablePackages = useMemo(() => {
    return creditPackages.filter(pkg => isPackageAvailable(pkg));
  }, [currentPlan]);

  const lockedPackages = useMemo(() => {
    return creditPackages.filter(pkg => !isPackageAvailable(pkg));
  }, [currentPlan]);

  const selectedPkg = creditPackages.find(p => p.id === selectedPackage);

  const handleProceedToPayment = () => {
    if (!selectedPackage) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPkg) {
      const totalCredits = selectedPkg.credits + selectedPkg.bonus;
      addCredits(totalCredits);
    }
    setShowPaymentModal(false);
    onClose();
  };

  if (!isOpen) return null;

  const trans = {
    title: language === 'vi' ? 'Nạp thêm Credit' : 'Top Up Credits',
    subtitle: language === 'vi' 
      ? 'Mua thêm credit để tiếp tục sử dụng các tính năng AI' 
      : 'Purchase additional credits to continue using AI features',
    currentCredits: language === 'vi' ? 'Credit hiện tại' : 'Current Credits',
    currentPlan: language === 'vi' ? 'Gói hiện tại' : 'Current Plan',
    selectPackage: language === 'vi' ? 'Chọn gói credit' : 'Select Credit Package',
    credits: language === 'vi' ? 'credits' : 'credits',
    bonus: language === 'vi' ? 'Bonus' : 'Bonus',
    popular: language === 'vi' ? 'Phổ biến' : 'Popular',
    bestValue: language === 'vi' ? 'Tiết kiệm nhất' : 'Best Value',
    total: language === 'vi' ? 'Tổng credit nhận được' : 'Total credits you\'ll receive',
    purchase: language === 'vi' ? 'Thanh toán' : 'Purchase',
    cancel: language === 'vi' ? 'Hủy' : 'Cancel',
    securePayment: language === 'vi' ? 'Thanh toán an toàn với' : 'Secure payment with',
    instantDelivery: language === 'vi' ? 'Credit được cộng ngay lập tức' : 'Credits added instantly',
    noExpiry: language === 'vi' ? 'Credit không hết hạn' : 'Credits never expire',
    maxCredits: language === 'vi' ? 'Tối đa cho gói' : 'Max for plan',
    upgradeToUnlock: language === 'vi' ? 'Nâng cấp để mở khóa' : 'Upgrade to unlock',
    lockedPackages: language === 'vi' ? 'Gói yêu cầu nâng cấp' : 'Packages requiring upgrade',
    requiresPlan: language === 'vi' ? 'Yêu cầu gói' : 'Requires',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="relative p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
              <p className="text-sm text-zinc-500">{trans.subtitle}</p>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex gap-4">
            <div className="flex-1 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 mb-1">{trans.currentCredits}</p>
              <p className="text-2xl font-bold text-amber-500">{credits}</p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 mb-1">{trans.currentPlan}</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-white capitalize">{currentPlan}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {/* Plan limit info */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{trans.selectPackage}</p>
            {maxCreditsForPlan > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                {trans.maxCredits}: {maxCreditsForPlan}
              </span>
            )}
          </div>
          
          {/* Available packages */}
          <div className="space-y-3">
            {availablePackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                  selectedPackage === pkg.id
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {/* Badges */}
                <div className="absolute -top-2 right-3 flex gap-2">
                  {pkg.popular && (
                    <Badge className="bg-blue-500 text-white border-0 text-[10px]">
                      {trans.popular}
                    </Badge>
                  )}
                  {pkg.bestValue && (
                    <Badge className="bg-green-500 text-white border-0 text-[10px]">
                      {trans.bestValue}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackage === pkg.id
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}>
                      {selectedPackage === pkg.id && <Check size={12} className="text-white" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">
                          {pkg.credits} {trans.credits}
                        </span>
                        {pkg.bonus > 0 && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Gift size={12} /> +{pkg.bonus} {trans.bonus}
                          </span>
                        )}
                      </div>
                      {pkg.bonus > 0 && (
                        <p className="text-xs text-zinc-500">
                          = {pkg.credits + pkg.bonus} {trans.credits} {trans.total.toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">${pkg.price}</p>
                    <p className="text-xs text-zinc-500">
                      ${(pkg.price / (pkg.credits + pkg.bonus)).toFixed(3)}/credit
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Locked packages - require upgrade */}
          {lockedPackages.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium text-zinc-500 mb-3 flex items-center gap-2">
                <Lock size={12} />
                {trans.lockedPackages}
              </p>
              <div className="space-y-2">
                {lockedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="w-full p-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                          <Lock size={10} className="text-zinc-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-medium text-zinc-500">
                              {pkg.credits} {trans.credits}
                            </span>
                            {pkg.bonus > 0 && (
                              <span className="text-xs text-zinc-400">
                                +{pkg.bonus} {trans.bonus}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">
                            {trans.requiresPlan} {PLANS[pkg.minPlan].name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-zinc-400">${pkg.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Upgrade CTA */}
              <button
                onClick={() => {
                  onClose();
                  setShowUpgradeModal(true);
                }}
                className="w-full mt-3 p-3 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowUp size={16} className="text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  {trans.upgradeToUnlock}
                </span>
              </button>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Sparkles size={14} className="text-amber-500" />
              <span>{trans.instantDelivery}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <TrendingUp size={14} className="text-green-500" />
              <span>{trans.noExpiry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <CreditCard size={14} className="text-blue-500" />
              <span>{trans.securePayment} Stripe</span>
            </div>
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex-shrink-0">
          {selectedPkg && (
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-amber-100 dark:bg-amber-500/20">
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {trans.total}:
              </span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {selectedPkg.credits + selectedPkg.bonus} {trans.credits}
              </span>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {trans.cancel}
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0"
              onClick={handleProceedToPayment}
              disabled={!selectedPackage}
            >
              <CreditCard size={16} className="mr-2" />
              {trans.purchase} ${selectedPkg?.price || 0}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPkg && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={selectedPkg.price}
          description={`${selectedPkg.credits + selectedPkg.bonus} credits`}
          credits={selectedPkg.credits + selectedPkg.bonus}
        />
      )}
    </div>
  );
};
