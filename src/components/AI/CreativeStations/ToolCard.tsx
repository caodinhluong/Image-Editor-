import React, { useState } from 'react';
import { Lock, Crown, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Tool, TierType } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';

// Video tools (Kitchen Station only)
const VIDEO_TOOL_IDS = ['video-kitchen', 'dynamic-polaroid', 'instant-noodle-video', 'long-video-cooking'];

// Video URLs for Kitchen Station tools only
const toolVideos: Record<string, string> = {
  'video-kitchen': 'https://cdn.higgsfield.ai/kling_video_sample/1308a1ac-d626-4178-b6d5-0e2bb676f194.mp4',
  'dynamic-polaroid': 'https://cdn.higgsfield.ai/kling_video_sample/cf9c9837-4383-4edf-898e-7f85b687eea5.mp4',
  'instant-noodle-video': 'https://cdn.higgsfield.ai/kling_video_sample/383a6e99-f88d-41c1-8b62-e2181cae3406.mp4',
  'long-video-cooking': 'https://cdn.higgsfield.ai/kling_video_sample/377e5f89-37b7-4d72-8a22-2802faabf4e5.mp4',
};

// Before/After images for image tools
const toolShowcaseImages: Record<string, { before: string; after: string }> = {
  'hd-enhance': {
    before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&q=50',
    after: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&q=95',
  },
  'makeup': {
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop',
  },
  'photorealistic': {
    before: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
  },
  'fashion-magazine': {
    before: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop',
  },
  'cosplay-character': {
    before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop',
  },
  'minimalist-illustration': {
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=300&fit=crop',
  },
  'pixel-art': {
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  },
  'comic-book': {
    before: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400&h=300&fit=crop',
  },
  'line-art': {
    before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=300&fit=crop',
  },
  'ukiyo-e': {
    before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400&h=300&fit=crop',
  },
  '3d-figurine': {
    before: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
  'funko-pop': {
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
  },
  'lego-minifig': {
    before: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
  },
  'plushie-toy': {
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop',
  },
  'claymation': {
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
  'product-render': {
    before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  },
  'architecture-model': {
    before: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
  },
  'party-polaroid': {
    before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
  },
  'vintage-photo': {
    before: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=300&fit=crop',
  },
  'glitch-art': {
    before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  },
  'double-exposure': {
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&h=300&fit=crop',
  },
  'hyper-realistic': {
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
  },
  'van-gogh': {
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop',
  },
  'watercolor': {
    before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=300&fit=crop',
  },
  'custom-recipe': {
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=300&fit=crop',
  },
  'pose-copy': {
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
  },
  'expression-copy': {
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
  },
  'color-swap': {
    before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
  },
  'isolate-subject': {
    before: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop',
  },
  'y2k-background': {
    before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop',
    after: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  },
};

const defaultShowcase = {
  before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
  after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
};

interface ToolCardProps {
  tool: Tool;
  stationColor: string;
  onSelect: () => void;
}


const TierBadge: React.FC<{ tier: TierType }> = ({ tier }) => {
  if (tier === 'free') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        FREE
      </span>
    );
  }
  
  if (tier === 'plus') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-0.5">
        <Crown size={9} />
        PLUS
      </span>
    );
  }
  
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
      <Zap size={9} />
      PRO
    </span>
  );
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, stationColor, onSelect }) => {
  const { language } = useLanguage();
  const { currentPlan } = useSubscription();
  const [isHovered, setIsHovered] = useState(false);

  const name = language === 'vi' ? tool.nameVi : tool.name;
  const isVideoTool = VIDEO_TOOL_IDS.includes(tool.id);
  const showcase = toolShowcaseImages[tool.id] || defaultShowcase;
  const videoUrl = toolVideos[tool.id];
  
  const planLevel = (plan: string): number => {
    const levels: Record<string, number> = { free: 0, plus: 1, pro: 2, team: 3 };
    return levels[plan] || 0;
  };
  
  const isLocked = planLevel(currentPlan) < planLevel(tool.tier);

  const renderIcon = () => {
    if (tool.icon.length <= 2 || /^\p{Emoji}/u.test(tool.icon)) {
      return <span className="text-2xl">{tool.icon}</span>;
    }
    return <Sparkles size={24} className="text-white" />;
  };

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-full overflow-hidden rounded-2xl border transition-all duration-300 text-left group
        bg-zinc-900 hover:bg-zinc-800/80
        ${isLocked 
          ? 'border-zinc-800 opacity-75 hover:opacity-100' 
          : 'border-zinc-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20'
        }
        hover:-translate-y-1
      `}
    >
      {/* Preview Container */}
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        {isVideoTool && videoUrl ? (
          /* Video Preview for Kitchen Station tools */
          <video
            src={videoUrl}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Before/After Image Preview for other tools */
          <>
            <img 
              src={showcase.before} 
              alt="Before" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            />
            <img 
              src={showcase.after} 
              alt="After" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
        
        {/* Before/After labels for image tools */}
        {!isVideoTool && (
          <>
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold bg-black/60 text-white/90 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
              {language === 'vi' ? 'Trước' : 'Before'}
            </div>
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {language === 'vi' ? 'Sau' : 'After'}
            </div>
          </>
        )}
        
        {/* Video badge for video tools */}
        {isVideoTool && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold bg-pink-500/80 text-white backdrop-blur-sm flex items-center gap-1">
            🎬 Video
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-[3px] flex items-center justify-center">
            <div className="p-3 rounded-full bg-zinc-800/90 border border-zinc-600 shadow-xl">
              <Lock size={20} className="text-zinc-400" />
            </div>
          </div>
        )}
        
        {/* Icon badge */}
        <div className={`absolute bottom-3 left-3 p-2.5 rounded-xl bg-gradient-to-br ${stationColor} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
          {renderIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h5 className={`font-bold text-base leading-tight ${isLocked ? 'text-zinc-500' : 'text-white group-hover:text-purple-200'} transition-colors`}>
            {name}
          </h5>
          <TierBadge tier={tool.tier} />
        </div>

        <div className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${isLocked ? 'text-zinc-600' : 'text-zinc-500 group-hover:text-purple-400'}`}>
          {isLocked ? (
            <>
              <Lock size={12} />
              <span>{language === 'vi' ? `Cần ${tool.tier.toUpperCase()}` : `Requires ${tool.tier.toUpperCase()}`}</span>
            </>
          ) : (
            <>
              <span>{language === 'vi' ? 'Thử ngay' : 'Try now'}</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </div>
      </div>

      {/* Hover glow */}
      {!isLocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-purple-500/15 via-transparent to-transparent" />
      )}
    </button>
  );
};

export default ToolCard;
