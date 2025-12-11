import React, { useState } from 'react';
import { Crown, Sparkles, Building2, Zap, Plus } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlanType, PLANS } from '../../types/subscription';
import { CreditTopUpModal } from './CreditTopUpModal';

interface PlanBadgeProps {
  showCredits?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({
  showCredits = true,
  onClick,
  className = '',
}) => {
  const { currentPlan, credits, subscription, setShowUpgradeModal } =
    useSubscription();
  const { language } = useLanguage();
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const planConfig: Record<
    PlanType,
    { icon: React.ElementType; gradient: string; textColor: string }
  > = {
    free: {
      icon: Zap,
      gradient: 'from-zinc-500 to-zinc-600',
      textColor: 'text-white',
    },
    plus: {
      icon: Sparkles,
      gradient: 'from-purple-500 to-indigo-600',
      textColor: 'text-white',
    },
    pro: {
      icon: Crown,
      gradient: 'from-amber-400 to-orange-500',
      textColor: 'text-white',
    },
    team: {
      icon: Building2,
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-white',
    },
  };

  const config = planConfig[currentPlan];
  const Icon = config.icon;
  const plan = PLANS[currentPlan];
  const percentage =
    currentPlan === 'team'
      ? 100
      : (credits / subscription.maxCredits) * 100;
  const isLow = percentage < 20;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Plan badge - Click to upgrade */}
        <div
          className="flex items-center gap-2 p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/50 transition-colors flex-1"
          onClick={handleClick}
        >
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${config.gradient} ${config.textColor} shadow-lg`}
          >
            <Icon size={14} />
            <span className="text-xs font-bold whitespace-nowrap">
              {plan.name}
            </span>
          </div>

          {/* Credits */}
          {showCredits && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Sparkles
                  size={12}
                  className={isLow ? 'text-red-500' : 'text-amber-500'}
                />
                <span
                  className={`text-sm font-bold ${isLow ? 'text-red-500' : 'text-white'}`}
                >
                  {currentPlan === 'team' ? '∞' : credits}
                </span>
              </div>

              {/* Mini progress bar */}
              {currentPlan !== 'team' && (
                <div className="flex-1 h-1.5 bg-zinc-600 rounded-full overflow-hidden min-w-[40px]">
                  <div
                    className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Up Button - Only show for non-team plans */}
        {currentPlan !== 'team' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTopUpModal(true);
            }}
            className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-colors shadow-lg shadow-amber-500/20"
            title={language === 'vi' ? 'Nạp thêm credit' : 'Top up credits'}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Credit Top Up Modal */}
      <CreditTopUpModal 
        isOpen={showTopUpModal} 
        onClose={() => setShowTopUpModal(false)} 
      />
    </>
  );
};

// Compact version for header
export const PlanBadgeCompact: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { currentPlan, credits, setShowUpgradeModal } = useSubscription();

  const planConfig: Record<PlanType, { icon: React.ElementType; color: string }> =
    {
      free: { icon: Zap, color: 'text-zinc-400' },
      plus: { icon: Sparkles, color: 'text-purple-500' },
      pro: { icon: Crown, color: 'text-amber-500' },
      team: { icon: Building2, color: 'text-blue-500' },
    };

  const config = planConfig[currentPlan];
  const Icon = config.icon;

  return (
    <button
      onClick={() => setShowUpgradeModal(true)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${className}`}
    >
      <Icon size={16} className={config.color} />
      <span className="text-sm font-bold text-zinc-900 dark:text-white">
        {currentPlan === 'team' ? '∞' : credits}
      </span>
      <Sparkles size={12} className="text-amber-500" />
    </button>
  );
};
