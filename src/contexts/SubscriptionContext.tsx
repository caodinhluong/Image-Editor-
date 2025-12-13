import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PlanType, 
  SubscriptionState, 
  PLANS, 
  CREDIT_COSTS, 
  FEATURE_REQUIREMENTS,
  FeatureKey 
} from '../types/subscription';

interface SubscriptionContextType {
  // State
  subscription: SubscriptionState;
  currentPlan: PlanType;
  credits: number;
  teamCredits: number;
  
  // Plan checks
  isPlus: boolean;
  isPro: boolean;
  isTeam: boolean;
  
  // Feature access
  canAccess: (feature: FeatureKey) => boolean;
  getRequiredPlan: (feature: FeatureKey) => PlanType;
  
  // Limits
  getBrandKitLimit: () => number;
  getBatchLimit: () => number;
  hasWatermark: () => boolean;
  
  // Credits
  useCredits: (operation: string, amount?: number) => boolean;
  useTeamCredits: (operation: string, amount?: number) => boolean;
  hasEnoughCredits: (operation: string, amount?: number) => boolean;
  hasEnoughTeamCredits: (operation: string, amount?: number) => boolean;
  getCreditCost: (operation: string) => number;
  
  // Actions
  upgradePlan: (plan: PlanType) => void;
  resetCredits: () => void;
  addCredits: (amount: number) => void;
  addTeamCredits: (amount: number) => void;
  
  // UI
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeModalFeature: FeatureKey | null;
  triggerUpgradeModal: (feature: FeatureKey) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'repix_subscription';

const getInitialState = (): SubscriptionState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        renewalDate: new Date(parsed.renewalDate)
      };
    }
  }
  
  // Default: Free plan
  return {
    currentPlan: 'free',
    credits: 50,
    maxCredits: 50,
    usedCredits: 0,
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    teamCredits: 0,
    maxTeamCredits: 0,
    usedTeamCredits: 0
  };
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionState>(getInitialState);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState<FeatureKey | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
  }, [subscription]);

  const currentPlan = subscription.currentPlan;
  const credits = subscription.credits;
  const teamCredits = subscription.teamCredits || 0;

  // Plan level checks
  const planLevel = (plan: PlanType): number => {
    const levels: Record<PlanType, number> = { free: 0, plus: 1, pro: 2, team: 3 };
    return levels[plan];
  };

  const isPlus = planLevel(currentPlan) >= planLevel('plus');
  const isPro = planLevel(currentPlan) >= planLevel('pro');
  const isTeam = planLevel(currentPlan) >= planLevel('team');

  // Feature access check
  const canAccess = (feature: FeatureKey): boolean => {
    const requiredPlan = FEATURE_REQUIREMENTS[feature];
    return planLevel(currentPlan) >= planLevel(requiredPlan);
  };

  const getRequiredPlan = (feature: FeatureKey): PlanType => {
    return FEATURE_REQUIREMENTS[feature];
  };

  // Limits
  const getBrandKitLimit = (): number => {
    return PLANS[currentPlan].limits.brandKits;
  };

  const getBatchLimit = (): number => {
    return PLANS[currentPlan].limits.batchImages;
  };

  const hasWatermark = (): boolean => {
    return PLANS[currentPlan].limits.watermark;
  };

  // Credits
  const getCreditCost = (operation: string): number => {
    return CREDIT_COSTS[operation]?.cost || 1;
  };

  const hasEnoughCredits = (operation: string, amount: number = 1): boolean => {
    const cost = getCreditCost(operation) * amount;
    // Team plan has unlimited personal credits
    return subscription.credits >= cost || currentPlan === 'team';
  };

  const hasEnoughTeamCredits = (operation: string, amount: number = 1): boolean => {
    if (currentPlan !== 'team') return false;
    const cost = getCreditCost(operation) * amount;
    return (subscription.teamCredits || 0) >= cost;
  };

  const useCredits = (operation: string, amount: number = 1): boolean => {
    // Team plan has unlimited personal credits
    if (currentPlan === 'team') return true;
    
    const cost = getCreditCost(operation) * amount;
    if (subscription.credits < cost) return false;

    setSubscription(prev => ({
      ...prev,
      credits: prev.credits - cost,
      usedCredits: prev.usedCredits + cost
    }));
    return true;
  };

  const useTeamCredits = (operation: string, amount: number = 1): boolean => {
    if (currentPlan !== 'team') return false;
    
    const cost = getCreditCost(operation) * amount;
    if ((subscription.teamCredits || 0) < cost) return false;

    setSubscription(prev => ({
      ...prev,
      teamCredits: (prev.teamCredits || 0) - cost,
      usedTeamCredits: (prev.usedTeamCredits || 0) + cost
    }));
    return true;
  };

  // Actions
  const upgradePlan = (plan: PlanType) => {
    const newPlan = PLANS[plan];
    const isTeamPlan = plan === 'team';
    
    setSubscription(prev => ({
      ...prev,
      currentPlan: plan,
      // Personal credits: unlimited for team plan
      credits: newPlan.credits === -1 ? 999999 : newPlan.credits,
      maxCredits: newPlan.credits === -1 ? 999999 : newPlan.credits,
      usedCredits: 0,
      // Team credits: 2000 for team plan
      teamCredits: isTeamPlan ? (newPlan.teamCredits || 2000) : 0,
      maxTeamCredits: isTeamPlan ? (newPlan.teamCredits || 2000) : 0,
      usedTeamCredits: 0,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    }));
    setShowUpgradeModal(false);
  };

  const resetCredits = () => {
    const plan = PLANS[currentPlan];
    const isTeamPlan = currentPlan === 'team';
    
    setSubscription(prev => ({
      ...prev,
      credits: plan.credits === -1 ? 999999 : plan.credits,
      usedCredits: 0,
      teamCredits: isTeamPlan ? (plan.teamCredits || 2000) : 0,
      usedTeamCredits: 0
    }));
  };

  const addCredits = (amount: number) => {
    setSubscription(prev => ({
      ...prev,
      credits: prev.credits + amount,
      maxCredits: prev.maxCredits + amount
    }));
  };

  const addTeamCredits = (amount: number) => {
    if (currentPlan !== 'team') return;
    setSubscription(prev => ({
      ...prev,
      teamCredits: (prev.teamCredits || 0) + amount,
      maxTeamCredits: (prev.maxTeamCredits || 0) + amount
    }));
  };

  // UI triggers
  const triggerUpgradeModal = (feature: FeatureKey) => {
    setUpgradeModalFeature(feature);
    setShowUpgradeModal(true);
  };

  const value: SubscriptionContextType = {
    subscription,
    currentPlan,
    credits,
    teamCredits,
    isPlus,
    isPro,
    isTeam,
    canAccess,
    getRequiredPlan,
    getBrandKitLimit,
    getBatchLimit,
    hasWatermark,
    useCredits,
    useTeamCredits,
    hasEnoughCredits,
    hasEnoughTeamCredits,
    getCreditCost,
    upgradePlan,
    resetCredits,
    addCredits,
    addTeamCredits,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeModalFeature,
    triggerUpgradeModal
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
