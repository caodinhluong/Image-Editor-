import React, { ReactNode } from 'react';
import { Lock, Crown, Sparkles, Building2 } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { FeatureKey, PlanType, PLANS } from '../../types/subscription';
import { useLanguage } from '../../contexts/LanguageContext';

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  showLockOverlay?: boolean;
  blurContent?: boolean;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showLockOverlay = true,
  blurContent = true
}) => {
  const { canAccess, getRequiredPlan, triggerUpgradeModal } = useSubscription();
  const { language } = useLanguage();
  
  const hasAccess = canAccess(feature);
  const requiredPlan = getRequiredPlan(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const planName = language === 'vi' ? PLANS[requiredPlan].nameVi : PLANS[requiredPlan].name;

  return (
    <div className="relative">
      {/* Blurred/disabled content */}
      <div className={`${blurContent ? 'blur-sm pointer-events-none select-none' : 'opacity-50 pointer-events-none'}`}>
        {children}
      </div>
      
      {/* Lock overlay */}
      {showLockOverlay && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg cursor-pointer z-10"
          onClick={() => triggerUpgradeModal(feature)}
        >
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Lock className="text-white" size={24} />
            </div>
            <p className="text-white font-bold text-sm mb-1">
              {language === 'vi' ? 'Tính năng Premium' : 'Premium Feature'}
            </p>
            <p className="text-white/80 text-xs">
              {language === 'vi' ? `Yêu cầu gói ${planName}` : `Requires ${planName}`}
            </p>
            <button className="mt-3 px-4 py-1.5 bg-white text-zinc-900 rounded-full text-xs font-bold hover:bg-zinc-100 transition-colors">
              {language === 'vi' ? 'Nâng cấp ngay' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Pro Badge Component
interface ProBadgeProps {
  plan?: PlanType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProBadge: React.FC<ProBadgeProps> = ({ 
  plan = 'pro', 
  size = 'sm',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const planConfig = {
    pro: {
      icon: Crown,
      label: 'PRO',
      gradient: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-900'
    },
    team: {
      icon: Sparkles,
      label: 'TEAM',
      gradient: 'from-purple-400 to-indigo-500',
      textColor: 'text-purple-900'
    },
    enterprise: {
      icon: Building2,
      label: 'ENT',
      gradient: 'from-zinc-600 to-zinc-800',
      textColor: 'text-white'
    }
  };

  const config = planConfig[plan as keyof typeof planConfig] || planConfig.pro;
  const Icon = config.icon;

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-bold
      bg-gradient-to-r ${config.gradient} ${config.textColor}
      ${sizeClasses[size]} ${className}
    `}>
      <Icon size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />
      {config.label}
    </span>
  );
};

// Lock Icon for tools
interface LockIconProps {
  feature: FeatureKey;
  size?: number;
  className?: string;
}

export const FeatureLockIcon: React.FC<LockIconProps> = ({ 
  feature, 
  size = 12,
  className = '' 
}) => {
  const { canAccess, triggerUpgradeModal } = useSubscription();
  
  if (canAccess(feature)) return null;

  return (
    <div 
      className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        triggerUpgradeModal(feature);
      }}
      title="Premium feature"
    >
      <Lock size={size} className="text-white" />
    </div>
  );
};

// Credits indicator
export const CreditsIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { credits, subscription, currentPlan } = useSubscription();
  const { language } = useLanguage();
  
  const percentage = currentPlan === 'team' 
    ? 100 
    : (credits / subscription.maxCredits) * 100;
  
  const isLow = percentage < 20;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5">
        <Sparkles size={14} className={isLow ? 'text-red-500' : 'text-amber-500'} />
        <span className={`text-sm font-bold ${isLow ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
          {currentPlan === 'team' ? '∞' : credits.toLocaleString()}
        </span>
        <span className="text-xs text-zinc-500">
          {language === 'vi' ? 'credits' : 'credits'}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
