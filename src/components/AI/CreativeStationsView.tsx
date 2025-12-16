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
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Wand2 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              {language === 'vi' ? 'Quầy Sáng Tạo AI' : 'AI Creative Stations'}
              <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full">
                34 Tools
              </span>
            </h1>
            <p className="text-zinc-500 mt-1">
              {language === 'vi' 
                ? '6 quầy sáng tạo với 34 công cụ AI mạnh mẽ' 
                : '6 creative stations with 34 powerful AI tools'}
            </p>
          </div>
        </div>

        {/* Creative Stations Component */}
        <CreativeStations
          onSaveToAssets={handleSaveToAssets}
          onNavigateToEditor={onNavigateToEditor}
        />
      </div>
    </div>
  );
};
