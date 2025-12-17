import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Sparkles, Crown,
  // Station icons
  Coffee, Drama, Bot, Film, ChefHat, ShoppingCart
} from 'lucide-react';
import { Station } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';

// Map station icon names to Lucide components
const stationIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'coffee': Coffee,
  'drama': Drama,
  'bot': Bot,
  'film': Film,
  'chef': ChefHat,
  'cart': ShoppingCart,
};

// Sample images/videos for each station to showcase capabilities
const stationShowcaseData: Record<string, { 
  samples: string[]; 
  isVideo?: boolean;
}> = {
  smoothie: {
    samples: [
      'https://imgcdn.stablediffusionweb.com/2025/12/16/756115e7-19fb-42ab-9cbd-6cc5e368573e.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/13befca3-12d0-42af-a204-88a2c24c9dd7.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/fd775d81-cda8-485d-8b71-8fb703132217.webp',
    ]
  },
  cosplay: {
    samples: [
      'https://imgcdn.stablediffusionweb.com/2025/12/16/b3c0baf6-0daa-4335-938d-8e94a8a02859.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/0f17100b-5653-48fa-8a05-c4bd48556e49.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/9b16279d-d27b-47ee-baa8-1a88a085a2dc.webp',
    ]
  },
  toy: {
    samples: [
      'https://imgcdn.stablediffusionweb.com/2025/12/16/8a53bff0-df10-422c-b86f-25599201df5a.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/aba71caa-2b02-43e2-a033-e2f57b4fdfb9.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/1a498a11-9bb5-4391-9628-6e474590fb6b.webp',
    ]
  },
  'film-art': {
    samples: [
      'https://imgcdn.stablediffusionweb.com/2025/12/16/89b4cda5-67e6-4b73-bedd-eef85682a5ba.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/6ae68cf4-9c54-4e19-b667-f1d6465f4285.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/3e5d3afe-03c1-436f-ae86-d0d3aa237b26.webp',
    ]
  },
  kitchen: {
    isVideo: true,
    samples: [
      'https://cdn.higgsfield.ai/user_3262uqBpOaCby92z8zqMPv0oYEr/8ca56b11-d7fc-43b1-9098-7272f59956af_min.mp4',
      'https://cdn.higgsfield.ai/user_2zXu7DqFkwehcyw88RKxU8RZnH2/18127fe7-bae9-4f7a-b52f-c00195b09088_min.mp4',
      'https://cdn.higgsfield.ai/user_2zXu7DqFkwehcyw88RKxU8RZnH2/1a4f97fd-89d5-4a2f-b3f4-681b448f11e9_min.mp4',
    ]
  },
  'self-service': {
    samples: [
      'https://imgcdn.stablediffusionweb.com/2025/12/16/1c7ca8ad-48fc-4ba2-9810-8c8874ba309c.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/3aaebabb-2044-4267-9290-201912b8a60d.webp',
      'https://imgcdn.stablediffusionweb.com/2025/12/16/23c2ed77-f95e-40fe-919c-dfb37bd48907.webp',
    ]
  },
};

interface StationCardProps {
  station: Station;
  isExpanded: boolean;
  onSelect: () => void;
}


export const StationCard: React.FC<StationCardProps> = ({
  station,
  isExpanded,
  onSelect,
}) => {
  const { language } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const name = language === 'vi' ? station.nameVi : station.name;
  const description = language === 'vi' ? station.descriptionVi : station.description;
  const toolCount = station.tools.length;
  const showcase = stationShowcaseData[station.id];
  const isVideoStation = showcase?.isVideo;
  
  // Count premium tools
  const premiumCount = station.tools.filter(t => t.tier !== 'free').length;

  // Auto-rotate images for non-video stations
  useEffect(() => {
    if (isVideoStation || !showcase?.samples.length) return;
    
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % showcase.samples.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isVideoStation, showcase?.samples.length]);

  return (
    <button
      onClick={onSelect}
      className={`
        relative w-full overflow-hidden rounded-2xl border transition-all duration-500 text-left group
        hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1
        ${isExpanded
          ? 'border-purple-500 shadow-xl shadow-purple-500/20'
          : 'border-zinc-200/50 dark:border-zinc-800 hover:border-purple-400/50'
        }
        bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800
      `}
    >
      {/* Background Image/Video Collage */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
          {isVideoStation ? (
            <video 
              src={showcase?.samples[0]} 
              className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-125 transition-transform duration-700"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={showcase?.samples[0]} 
              alt="" 
              className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-125 transition-transform duration-700"
            />
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden">
          {isVideoStation ? (
            <video 
              src={showcase?.samples[1]} 
              className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-125 transition-transform duration-700"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={showcase?.samples[1]} 
              alt="" 
              className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-125 transition-transform duration-700"
            />
          )}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon with glow effect */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${station.color} blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />
            <div 
              className={`
                relative p-3 rounded-2xl bg-gradient-to-br ${station.color}
                shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
              `}
            >
              {(() => {
                const IconComponent = stationIconMap[station.icon];
                if (IconComponent) {
                  return <IconComponent size={28} className="text-white drop-shadow-lg" />;
                }
                return <span className="text-2xl filter drop-shadow-lg">{station.icon}</span>;
              })()}
            </div>
          </div>
          
          {/* Arrow indicator */}
          <div className={`
            p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50
            transition-all duration-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/50
          `}>
            <ChevronRight 
              size={16} 
              className={`
                text-zinc-500 transition-all duration-300
                group-hover:text-purple-400 group-hover:translate-x-0.5
                ${isExpanded ? 'rotate-90 text-purple-400' : ''}
              `}
            />
          </div>
        </div>

        {/* Name and description */}
        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
          {name}
        </h4>
        <p className="text-sm text-zinc-400 mb-4 line-clamp-1">
          {description}
        </p>

        {/* Sample Images/Videos Preview */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {showcase?.samples.slice(0, 3).map((src, idx) => (
              <div 
                key={idx}
                className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  !isVideoStation && activeImageIndex === idx 
                    ? 'border-purple-500 scale-110 z-10' 
                    : 'border-zinc-800 group-hover:border-purple-500/50'
                }`}
                style={{ zIndex: !isVideoStation && activeImageIndex === idx ? 10 : 3 - idx }}
              >
                {isVideoStation ? (
                  <video 
                    src={src} 
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img 
                    src={src} 
                    alt="" 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      activeImageIndex === idx ? 'opacity-100' : 'opacity-70'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Sparkles size={10} className="text-purple-400" />
            <span>{language === 'vi' ? 'Xem mẫu' : 'See samples'}</span>
          </div>
        </div>

        {/* Footer: Tool count and premium badge */}
        <div className="flex items-center justify-between">
          {/* Progress bar style tool count */}
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-zinc-400">
                {toolCount} {language === 'vi' ? 'công cụ' : 'tools'}
              </span>
              {premiumCount > 0 && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                  <Crown size={8} />
                  {premiumCount} PRO
                </span>
              )}
            </div>
            <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${station.color} transition-all duration-500 group-hover:opacity-100 opacity-60`}
                style={{ width: `${Math.min(100, toolCount * 15)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </button>
  );
};

export default StationCard;
