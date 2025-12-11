import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  Sparkles,
  Building2,
  Zap,
  Rocket,
  Star,
  Image,
  Layers,
  Palette,
  Brain,
  Code,
  Headphones,
  Users,
  Shield,
  Lock,
  Share2,
  Plug,
  Infinity,
  Upload,
  Info,
} from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlanType, PLANS } from '../../types/subscription';
import { Button } from '../ui/UIComponents';
import { PlanDetailModal } from './PlanDetailModal';

const iconMap: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  image: Image,
  palette: Palette,
  folder: Layers,
  zap: Zap,
  upload: Upload,
  layers: Layers,
  star: Star,
  rocket: Rocket,
  brain: Brain,
  code: Code,
  headphones: Headphones,
  infinity: Infinity,
  users: Users,
  shield: Shield,
  lock: Lock,
  share: Share2,
  plug: Plug,
};

export const UpgradeModal: React.FC = () => {
  const { showUpgradeModal, setShowUpgradeModal, currentPlan, upgradePlan } =
    useSubscription();
  const { language } = useLanguage();

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPlanDetail, setShowPlanDetail] = useState<PlanType | null>(null);

  if (!showUpgradeModal) return null;

  const planIcons: Record<PlanType, React.ElementType> = {
    free: Zap,
    plus: Sparkles,
    pro: Crown,
    team: Building2,
  };

  const planColors: Record<PlanType, string> = {
    free: 'text-blue-500',
    plus: 'text-purple-500',
    pro: 'text-amber-500',
    team: 'text-zinc-500',
  };

  const handleUpgrade = async (planId: PlanType) => {
    if (planId === currentPlan) return;
    
    setSelectedPlan(planId);
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    upgradePlan(planId);
    setIsProcessing(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    }, 2000);
  };

  const handleClose = () => {
    setShowUpgradeModal(false);
    setSelectedPlan(null);
    setShowSuccess(false);
  };

  const formatPrice = (plan: (typeof PLANS)[PlanType]) => {
    if (plan.price === 'custom') return language === 'vi' ? 'Liên hệ' : 'Custom';
    if (plan.price === 0) return 'Free';
    return `$${plan.price}`;
  };

  const allPlans: PlanType[] = ['free', 'plus', 'pro', 'team'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-zinc-900 to-black rounded-3xl shadow-2xl border border-zinc-800">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>

        {/* Success Animation */}
        {showSuccess && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-900/95 rounded-3xl">
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Check className="text-white" size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {language === 'vi' ? 'Nâng cấp thành công!' : 'Upgrade Successful!'}
              </h2>
              <p className="text-zinc-400">
                {language === 'vi'
                  ? `Bạn đã nâng cấp lên ${PLANS[selectedPlan!].name}`
                  : `You've upgraded to ${PLANS[selectedPlan!].name}`}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-10 pb-6 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full text-white text-xs font-bold mb-4">
            <Sparkles size={12} />
            {language === 'vi' ? 'Nâng cấp' : 'Upgrade'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {language === 'vi' ? 'Chọn gói phù hợp với bạn' : 'Choose your plan'}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            {language === 'vi' 
              ? 'Nâng cấp để mở khóa tất cả tính năng AI mạnh mẽ' 
              : 'Upgrade to unlock all powerful AI features'}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="p-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {allPlans.map((planId) => {
              const plan = PLANS[planId];
              const Icon = planIcons[planId];
              const isCurrentPlan = planId === currentPlan;
              const isPopular = plan.isPopular;
              const isProcessingThis = isProcessing && selectedPlan === planId;

              return (
                <div
                  key={planId}
                  className={`
                    group relative rounded-2xl p-6 flex flex-col h-full transition-all duration-300
                    ${isPopular 
                      ? 'bg-zinc-800 border-2 border-purple-500/50 shadow-xl shadow-purple-500/20 scale-[1.02]' 
                      : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Current plan badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Check size={10} /> {language === 'vi' ? 'Gói hiện tại' : 'Current'}
                      </div>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className={`p-2.5 rounded-xl bg-zinc-800 ${planColors[planId]} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                      <p className="text-[11px] text-zinc-500">
                        {language === 'vi' ? plan.taglineVi : plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">
                        {formatPrice(plan)}
                      </span>
                      {plan.price !== 'custom' && plan.price > 0 && (
                        <span className="text-sm text-zinc-500">
                          /{language === 'vi' ? 'tháng' : 'mo'}
                        </span>
                      )}
                    </div>
                    {plan.credits !== -1 && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {plan.credits} credits/{language === 'vi' ? 'tháng' : 'month'}
                      </p>
                    )}
                    {plan.credits === -1 && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {language === 'vi' ? 'Credits không giới hạn' : 'Unlimited credits'}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-6 flex-1">
                    {plan.features.slice(0, 6).map((feature, idx) => {
                      const FeatureIcon = iconMap[feature.icon] || Sparkles;
                      return (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-0.5 rounded-full bg-purple-500/20">
                            <Check size={10} className="text-purple-400" />
                          </div>
                          <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {language === 'vi' ? feature.textVi : feature.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2">
                    {isCurrentPlan ? (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full h-11 rounded-xl font-bold border-zinc-700 text-zinc-500"
                      >
                        {language === 'vi' ? 'Gói hiện tại' : 'Current Plan'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => setShowPlanDetail(planId)}
                          disabled={isProcessing}
                          className={`w-full h-11 rounded-xl font-bold transition-all ${
                            isPopular
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                          }`}
                        >
                          {plan.price === 'custom' ? (
                            language === 'vi' ? 'Liên hệ' : 'Contact Sales'
                          ) : (
                            language === 'vi' ? `Nâng cấp lên ${plan.name}` : `Upgrade to ${plan.name}`
                          )}
                        </Button>
                        <button
                          onClick={() => setShowPlanDetail(planId)}
                          className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1"
                        >
                          <Info size={12} />
                          {language === 'vi' ? 'Xem chi tiết gói' : 'View plan details'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 text-center">
          <p className="text-xs text-zinc-500">
            {language === 'vi'
              ? '🔒 Thanh toán an toàn • Hủy bất cứ lúc nào • Hoàn tiền trong 7 ngày'
              : '🔒 Secure payment • Cancel anytime • 7-day money back guarantee'}
          </p>
        </div>
      </div>

      {/* Plan Detail Modal */}
      {showPlanDetail && (
        <PlanDetailModal
          isOpen={!!showPlanDetail}
          onClose={() => setShowPlanDetail(null)}
          planId={showPlanDetail}
          onUpgrade={(planId) => {
            setShowPlanDetail(null);
            handleUpgrade(planId);
          }}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};
