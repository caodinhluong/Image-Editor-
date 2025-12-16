import React, { useState, useCallback } from 'react';
import { Station, Tool, ProcessingResult } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { StationGrid } from './StationGrid';
import { AIToolExecutionView } from './AIToolExecutionView';

export interface CreativeStationsProps {
  onSaveToAssets?: (result: ProcessingResult) => void;
  onNavigateToEditor?: (imageUrl: string) => void;
}

export const CreativeStations: React.FC<CreativeStationsProps> = ({
  onSaveToAssets,
  onNavigateToEditor,
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
  }, []);

  // Handle processing complete
  const handleProcessingComplete = useCallback((result: ProcessingResult) => {
    if (result.success && onSaveToAssets) {
      onSaveToAssets(result);
    }
  }, [onSaveToAssets]);

  return (
    <div className="w-full">
      {/* Station Grid */}
      <StationGrid onToolSelect={handleToolSelect} />

      {/* AI Tool Execution View - Full Screen */}
      {showModal && selectedTool && selectedStation && (
        <AIToolExecutionView
          tool={selectedTool}
          station={selectedStation}
          onClose={handleCloseModal}
          onComplete={handleProcessingComplete}
        />
      )}
    </div>
  );
};

export default CreativeStations;
