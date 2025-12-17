import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CreativeStations } from './CreativeStations';
import { ProcessingResult } from '../../types/stations';

export interface CreativeStationsViewProps {
  onNavigateToEditor?: (imageUrl: string) => void;
}

export const CreativeStationsView: React.FC<CreativeStationsViewProps> = ({ onNavigateToEditor }) => {
  const { language } = useLanguage();

  // Handle save to assets
  const handleSaveToAssets = (result: ProcessingResult) => {
    console.log('Saving to assets:', result);
    // In a real app, this would save to the user's asset library
  };

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 2xl:px-8 py-8">
        {/* Creative Stations Component */}
        <CreativeStations
          onSaveToAssets={handleSaveToAssets}
          onNavigateToEditor={onNavigateToEditor}
        />
      </div>
    </div>
  );
};
