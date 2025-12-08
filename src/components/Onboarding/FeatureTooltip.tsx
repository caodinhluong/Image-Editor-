import React, { useState, useEffect } from 'react';
import { X, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '../ui/UIComponents';

interface FeatureTooltipProps {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  targetElement?: string; // CSS selector
  onDismiss?: () => void;
  showOnce?: boolean;
}

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  id,
  title,
  description,
  position = 'bottom',
  onDismiss,
  showOnce = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if tooltip has been dismissed before
    const dismissed = localStorage.getItem(`tooltip_dismissed_${id}`);
    if (!dismissed || !showOnce) {
      // Show tooltip after a short delay
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [id, showOnce]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      localStorage.setItem(`tooltip_dismissed_${id}`, 'true');
    }
    onDismiss?.();
  };

  if (!isVisible) return null;

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div 
      className={`
        absolute ${positionClasses[position]} z-50 w-72
        animate-in fade-in slide-in-from-bottom-2 duration-300
      `}
    >
      {/* Arrow */}
      <div className={`
        absolute w-3 h-3 bg-gradient-to-br from-repix-500 to-pink-500 rotate-45
        ${position === 'bottom' ? '-top-1.5 left-6' : ''}
        ${position === 'top' ? '-bottom-1.5 left-6' : ''}
        ${position === 'left' ? '-right-1.5 top-6' : ''}
        ${position === 'right' ? '-left-1.5 top-6' : ''}
      `} />

      {/* Content */}
      <div className="relative bg-gradient-to-br from-repix-500 to-pink-500 p-[2px] rounded-2xl shadow-2xl shadow-repix-500/30">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-repix-500 to-pink-500 shrink-0">
              <Lightbulb className="text-white" size={16} />
            </div>
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="w-full justify-center gap-2 text-repix-600 dark:text-repix-400 hover:bg-repix-50 dark:hover:bg-repix-900/20"
          >
            Got it
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook to manage multiple tooltips
export const useFeatureDiscovery = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const showTooltip = (id: string) => {
    const dismissed = localStorage.getItem(`tooltip_dismissed_${id}`);
    if (!dismissed) {
      setActiveTooltip(id);
    }
  };

  const dismissTooltip = (id: string) => {
    localStorage.setItem(`tooltip_dismissed_${id}`, 'true');
    setActiveTooltip(null);
  };

  const resetAllTooltips = () => {
    // Clear all tooltip dismissals (useful for testing or reset feature)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tooltip_dismissed_')) {
        localStorage.removeItem(key);
      }
    });
  };

  return {
    activeTooltip,
    showTooltip,
    dismissTooltip,
    resetAllTooltips
  };
};
