import React, { useState, useCallback, useEffect } from 'react';
import { Station, Tool, ProcessingResult } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { StationGrid } from './StationGrid';
import { AIToolExecutionView } from './AIToolExecutionView';
import { X, ImageIcon, Sparkles } from 'lucide-react';

export interface CreativeStationsProps {
  onSaveToAssets?: (result: ProcessingResult) => void;
  onNavigateToEditor?: (imageUrl: string) => void;
  initialImage?: string;
  onClearInitialImage?: () => void;
}

export const CreativeStations: React.FC<CreativeStationsProps> = ({
  onSaveToAssets,
  onNavigateToEditor,
  initialImage,
  onClearInitialImage,
}) => {
  const { language } = useLanguage();
  const { currentPlan, triggerUpgradeModal } = useSubscription();
  
  // State for selected station and tool
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Check if user can access tool based on tier
  const canAccessTool = useCallback((tool: Tool): boolean => {
    const planLevel = (plan: string): number => {
      const levels: Record<string, number> = { free: 0, plus: 1, pro: 2, team: 3 };
      return levels[plan] || 0;
    };
    return planLevel(currentPlan) >= planLevel(tool.tier);
  }, [currentPlan]);

  // Handle tool selection from StationGrid
  const handleToolSelect = useCallback((station: Station, tool: Tool) => {
    // Check if user can access this tool
    if (!canAccessTool(tool)) {
      // Show upgrade modal based on required tier
      const featureKey = tool.tier === 'pro' ? 'advancedAI' : 'textToImage';
      triggerUpgradeModal(featureKey);
      return;
    }

    setSelectedStation(station);
    setSelectedTool(tool);
    setShowModal(true);
  }, [canAccessTool, triggerUpgradeModal]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedTool(null);
    setSelectedStation(null);
    // Clear initial image when closing modal
    if (onClearInitialImage) {
      onClearInitialImage();
    }
  }, [onClearInitialImage]);

  // Handle processing complete
  const handleProcessingComplete = useCallback((result: ProcessingResult) => {
    if (result.success && onSaveToAssets) {
      onSaveToAssets(result);
    }
  }, [onSaveToAssets]);

  return (
    <div className="w-full">
      {/* Initial Image Banner - Show when there's an image from text-to-image */}
      {initialImage && !showModal && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-500/30 flex-shrink-0">
              <img src={initialImage} alt="Input" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Ảnh đầu vào đã sẵn sàng' : 'Input Image Ready'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {language === 'vi' 
                  ? 'Chọn một công cụ AI bên dưới để áp dụng hiệu ứng cho ảnh này'
                  : 'Select an AI tool below to apply effects to this image'}
              </p>
            </div>
            
            {/* Clear button */}
            <button
              onClick={onClearInitialImage}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              title={language === 'vi' ? 'Xóa ảnh' : 'Clear image'}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Station Grid */}
      <StationGrid onToolSelect={handleToolSelect} />

      {/* AI Tool Execution View - Full Screen */}
      {showModal && selectedTool && selectedStation && (
        <AIToolExecutionView
          tool={selectedTool}
          station={selectedStation}
          onClose={handleCloseModal}
          onComplete={handleProcessingComplete}
          initialImage={initialImage}
        />
      )}
    </div>
  );
};

export default CreativeStations;
