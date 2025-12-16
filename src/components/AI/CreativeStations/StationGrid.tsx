import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Station, Tool } from '../../../types/stations';
import { STATIONS } from '../../../data/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StationCard } from './StationCard';
import { ToolCard } from './ToolCard';

interface StationGridProps {
  onToolSelect: (station: Station, tool: Tool) => void;
}

export const StationGrid: React.FC<StationGridProps> = ({ onToolSelect }) => {
  const { language } = useLanguage();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const handleBackToStations = () => {
    setSelectedStation(null);
  };

  const handleToolClick = (tool: Tool) => {
    if (selectedStation) {
      onToolSelect(selectedStation, tool);
    }
  };

  // Expanded station view - show tools
  if (selectedStation) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Station Header */}
        <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${selectedStation.color} opacity-10`} />
          
          <div className="relative z-10">
            <button
              onClick={handleBackToStations}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">
                {language === 'vi' ? 'Quay lại tất cả quầy' : 'Back to all stations'}
              </span>
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedStation.color} blur-xl opacity-50`} />
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${selectedStation.color} shadow-2xl`}>
                  <span className="text-4xl">{selectedStation.icon}</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {language === 'vi' ? selectedStation.nameVi : selectedStation.name}
                </h2>
                <p className="text-zinc-400">
                  {language === 'vi' ? selectedStation.descriptionVi : selectedStation.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-zinc-500">
                    {selectedStation.tools.length} {language === 'vi' ? 'công cụ' : 'tools'}
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-sm text-purple-400">
                    {selectedStation.tools.filter(t => t.tier === 'free').length} {language === 'vi' ? 'miễn phí' : 'free'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools grid - larger cards with video previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 2xl:gap-5">
          {selectedStation.tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              stationColor={selectedStation.color}
              onSelect={() => handleToolClick(tool)}
            />
          ))}
        </div>

        {/* Tip section */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles size={20} className="text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">
                {language === 'vi' ? 'Mẹo sử dụng' : 'Pro Tip'}
              </h4>
              <p className="text-sm text-zinc-400">
                {language === 'vi'
                  ? 'Hover vào mỗi công cụ để xem trước hiệu ứng Before/After. Tải ảnh chân dung chất lượng cao để có kết quả tốt nhất!'
                  : 'Hover over each tool to preview the Before/After effect. Upload high-quality portrait photos for best results!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main station grid view
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-zinc-900 to-pink-900/20 border border-purple-500/20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {language === 'vi' ? '34 công cụ AI mạnh mẽ' : '34 Powerful AI Tools'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {language === 'vi' ? 'Quầy Sáng Tạo AI' : 'AI Creative Stations'}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            {language === 'vi' 
              ? 'Khám phá 6 quầy sáng tạo với các công cụ AI tiên tiến. Biến ý tưởng thành hiện thực chỉ với vài cú click.' 
              : 'Explore 6 creative stations with cutting-edge AI tools. Transform your ideas into reality with just a few clicks.'
            }
          </p>
        </div>
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4 2xl:gap-6">
        {STATIONS.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            isExpanded={selectedStation?.id === station.id}
            onSelect={() => handleStationSelect(station)}
          />
        ))}
      </div>
    </div>
  );
};

export default StationGrid;
