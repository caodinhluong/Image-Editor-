import React from 'react';
import { ChevronRight, Sparkles, Crown } from 'lucide-react';
import { Station } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';

// Sample images for each station to showcase capabilities
const stationShowcaseImages: Record<string, { before: string; after: string; samples: string[] }> = {
  smoothie: {
    before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
    after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    samples: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    ]
  },
  cosplay: {
    before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    after: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=200&fit=crop',
    samples: [
      'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=100&h=100&fit=crop',
    ]
  },
  toy: {
    before: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    after: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    samples: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100&h=100&fit=crop',
    ]
  },
  'film-art': {
    before: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
    after: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop',
    samples: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=100&h=100&fit=crop',
    ]
  },
  kitchen: {
    before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    after: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=200&fit=crop',
    samples: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=100&h=100&fit=crop',
    ]
  },
  'self-service': {
    before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    after: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200&h=200&fit=crop',
    samples: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
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

  const name = language === 'vi' ? station.nameVi : station.name;
  const description = language === 'vi' ? station.descriptionVi : station.description;
  const toolCount = station.tools.length;
  const showcase = stationShowcaseImages[station.id];
  
  // Count premium tools
  const premiumCount = station.tools.filter(t => t.tier !== 'free').length;

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
      {/* Background Image Collage */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
          <img 
            src={showcase?.samples[0]} 
            alt="" 
            className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-125 transition-transform duration-700"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden">
          <img 
            src={showcase?.samples[1]} 
            alt="" 
            className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-125 transition-transform duration-700"
          />
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
              <span className="text-2xl filter drop-shadow-lg">{station.icon}</span>
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

        {/* Sample Images Preview */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {showcase?.samples.slice(0, 3).map((img, idx) => (
              <div 
                key={idx}
                className="w-8 h-8 rounded-lg overflow-hidden border-2 border-zinc-800 group-hover:border-purple-500/50 transition-colors"
                style={{ zIndex: 3 - idx }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
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
