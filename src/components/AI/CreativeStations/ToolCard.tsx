import React, { useState } from 'react';
import { 
  Lock, Crown, Sparkles, Zap, ArrowRight,
  // Tool icons
  Wand2, Palette, Camera, Newspaper, Drama, Pencil, Grid3X3, Zap as ZapIcon, 
  PenTool, MapPin, Box, ToyBrick, Blocks, Cat, Clapperboard, Package, Building2,
  Image, Film, Tv, Layers, Search, Flower2, Droplets, Video, Aperture, Timer, ChefHat,
  FileText, PersonStanding, Smile, Paintbrush, Scissors, Disc
} from 'lucide-react';
import { Tool, TierType } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';

// Map tool icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'wand': Wand2,
  'palette': Palette,
  'camera': Camera,
  'newspaper': Newspaper,
  'drama': Drama,
  'pencil': Pencil,
  'grid': Grid3X3,
  'zap': ZapIcon,
  'pen': PenTool,
  'map': MapPin,
  'box': Box,
  'toy': ToyBrick,
  'blocks': Blocks,
  'cat': Cat,
  'clapperboard': Clapperboard,
  'package': Package,
  'building': Building2,
  'image': Image,
  'film': Film,
  'tv': Tv,
  'layers': Layers,
  'search': Search,
  'flower': Flower2,
  'droplets': Droplets,
  'video': Video,
  'aperture': Aperture,
  'timer': Timer,
  'chef': ChefHat,
  'file': FileText,
  'person': PersonStanding,
  'smile': Smile,
  'paintbrush': Paintbrush,
  'scissors': Scissors,
  'disc': Disc,
  'sparkles': Sparkles,
};

// Video tools (Video Studio only)
const VIDEO_TOOL_IDS = ['video-kitchen', 'dynamic-polaroid', 'instant-noodle-video', 'long-video-cooking'];

// Video URLs for Video Studio tools only
const toolVideos: Record<string, string> = {
  'video-kitchen': 'https://cdn.higgsfield.ai/kling_video_sample/1308a1ac-d626-4178-b6d5-0e2bb676f194.mp4',
  'dynamic-polaroid': 'https://cdn.higgsfield.ai/kling_video_sample/cf9c9837-4383-4edf-898e-7f85b687eea5.mp4',
  'instant-noodle-video': 'https://cdn.higgsfield.ai/kling_video_sample/383a6e99-f88d-41c1-8b62-e2181cae3406.mp4',
  'long-video-cooking': 'https://cdn.higgsfield.ai/kling_video_sample/377e5f89-37b7-4d72-8a22-2802faabf4e5.mp4',
};

// Before/After images for image tools
const toolShowcaseImages: Record<string, { before: string; after: string }> = {
  'hd-enhance': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/8e01375d-fb78-4fa1-a86b-8b76e0611bd6.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/756115e7-19fb-42ab-9cbd-6cc5e368573e.webp',
  },
  'makeup': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ad991c4a-fedd-48ae-9547-963efa8d7fe5.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/13befca3-12d0-42af-a204-88a2c24c9dd7.webp',
  },
  'photorealistic': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/4ff53f89-bf23-4177-b8e8-787ca4a34170.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/fd775d81-cda8-485d-8b71-8fb703132217.webp',
  },
  'fashion-magazine': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/dae082fa-208c-4eb1-b3c8-52c5b3bbfec2.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/18b44f18-748a-4773-a2f7-e7a99ebb2cd4.webp',
  },
  'cosplay-character': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/29dd0ed6-dccb-4613-a7ee-5d4a3a50030f.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b3c0baf6-0daa-4335-938d-8e94a8a02859.webp',
  },
  'minimalist-illustration': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/8e943561-e24c-4d9f-8bd5-7944bd58c41e.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/0f17100b-5653-48fa-8a05-c4bd48556e49.webp',
  },
  'pixel-art': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ce66cd00-04fa-4eae-8e00-26cb3c8f0741.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/9b16279d-d27b-47ee-baa8-1a88a085a2dc.webp',
  },
  'comic-book': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/20256686-8ca5-48c1-873c-f774003721b8.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/e4f25ab5-b2b4-41bc-be8b-8aa267cba5a3.webp',
  },
  'line-art': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/9ab2e413-f100-446a-b268-a35519a60b91.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/09799f33-d9a7-4798-8e60-2cdc4a971e13.webp',
  },
  'ukiyo-e': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/94012a24-b9ca-410c-bd50-ca54796a18ae.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/0874cdfe-d552-46d2-8d6b-b170d11bdb02.webp',
  },
  '3d-figurine': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/271027b1-8173-4da8-a671-e10bb6175386.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/8a53bff0-df10-422c-b86f-25599201df5a.webp',
  },
  'funko-pop': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/e1f8c4a5-7609-418b-b145-bd3348411286.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/aba71caa-2b02-43e2-a033-e2f57b4fdfb9.webp',
  },
  'lego-minifig': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/789c32e9-9154-447f-8b0b-1d38b4a22e39.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/1a498a11-9bb5-4391-9628-6e474590fb6b.webp',
  },
  'plushie-toy': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/15ea5f5d-da5a-4e74-971c-02665d637034.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/c4b2c862-8959-4c61-8599-7ec614cf77b3.webp',
  },
  'claymation': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a9056a89-571a-4253-bdeb-a29cf39f9b59.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/d7d16ea7-6baf-48d0-8045-bde6a9ac74a2.webp',
  },
  'product-render': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b23138fe-96da-410f-b6c1-7f5acc0e02e1.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b3a94a99-63a9-418f-ad5a-2a99ef17d021.webp',
  },
  'architecture-model': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/83038b92-dd2a-4c67-a12c-38b669c077e1.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/7ad31f0a-0e72-4255-acbd-308a3b56af5e.webp',
  },
  'party-polaroid': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/868d8d8a-a99c-49de-b0a8-7696b775818f.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/89b4cda5-67e6-4b73-bedd-eef85682a5ba.webp',
  },
  'vintage-photo': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/1ac2852f-6685-4d56-be47-32c5a3c7bc64.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/6ae68cf4-9c54-4e19-b667-f1d6465f4285.webp',
  },
  'glitch-art': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/0ba9c161-de17-4d8e-a510-9d20d94892b1.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/59dc00c8-3c7f-4b6f-975c-c4d01ed46e2a.webp',
  },
  'double-exposure': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b7447e5a-d757-4a7d-a374-5f89937d3790.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/410afb51-1c71-4ba8-99a1-6b4625783a92.webp',
  },
  'hyper-realistic': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b021a2b1-712e-4da5-8280-ae6eb6d6b38f.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a772e960-8e79-480c-8e5b-ee98420f4a5a.webp',
  },
  'van-gogh': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ac35431a-5b85-451f-8b9a-096dd73441e8.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/3e5d3afe-03c1-436f-ae86-d0d3aa237b26.webp',
  },
  'watercolor': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/321674b6-e8e3-4648-ae22-92549d2c993b.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/ceaa2856-628f-45f1-a36d-dec7257a3913.webp',
  },
  'custom-recipe': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/2573f7f8-9e66-491d-a6a1-a3b9a562c6df.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/1c7ca8ad-48fc-4ba2-9810-8c8874ba309c.webp',
  },
  'pose-copy': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/66eb2ff7-5a7b-4d10-8a27-fdeb0ee5e265.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/3aaebabb-2044-4267-9290-201912b8a60d.webp',
  },
  'expression-copy': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/18/d2a76b63-b6af-4041-b669-4dad4a8d472c.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/18/8718731d-73c2-4ce1-a21e-847ade6d452f.webp',
  },
  'color-swap': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/18/0fc1024b-103b-46a1-b5b4-c3aef958ba4e.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/18/4ad5e65a-1183-4971-86ab-7380d64032a1.webp',
  },
  'isolate-subject': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/b9590a7d-130f-4d6e-88b7-ef1793aa2c04.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/23c2ed77-f95e-40fe-919c-dfb37bd48907.webp',
  },
  'y2k-background': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a7ef91cf-2d13-4425-a48c-3c213a07ab84.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/f273586c-cf36-4ed2-b76b-61ee7bf22321.webp',
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
    // Check if icon is a Lucide icon name
    const IconComponent = iconMap[tool.icon];
    if (IconComponent) {
      return <IconComponent size={24} className="text-white" />;
    }
    // Fallback to emoji if it's an emoji
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
          /* Video Preview for Video Studio tools */
          <video
            src={videoUrl}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Before/After Image Preview with wipe effect */
          <>
            {/* Before Image - Always visible as base */}
            <img 
              src={showcase.before} 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* After Image - Revealed with clip-path wipe effect */}
            <div 
              className="absolute inset-0 transition-all duration-700 ease-in-out"
              style={{
                clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
              }}
            >
              <img 
                src={showcase.after} 
                alt="After" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

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
