import React, { useState } from 'react';
import { 
  X, ArrowRight, Clock, Coins, Crown, Zap, Lock, Columns, SlidersHorizontal,
  Image, Wand2, CheckCircle2, Info, Lightbulb
} from 'lucide-react';
import { Tool, TierType } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';

// Extended tool details with more descriptions
const toolExtendedInfo: Record<string, { 
  features: { en: string[]; vi: string[] };
  bestFor: { en: string; vi: string };
  tips: { en: string; vi: string };
}> = {
  'hd-enhance': {
    features: {
      en: ['Upscale images up to 4x resolution', 'AI noise reduction', 'Sharpen details automatically', 'Preserve original colors'],
      vi: ['Phóng to ảnh lên đến 4x độ phân giải', 'Giảm nhiễu bằng AI', 'Tự động làm nét chi tiết', 'Giữ nguyên màu sắc gốc']
    },
    bestFor: { en: 'Low-resolution photos, old images, screenshots', vi: 'Ảnh độ phân giải thấp, ảnh cũ, ảnh chụp màn hình' },
    tips: { en: 'Works best with images at least 256x256 pixels', vi: 'Hoạt động tốt nhất với ảnh ít nhất 256x256 pixels' }
  },
  'makeup': {
    features: {
      en: ['Natural makeup application', 'Skin smoothing & enhancement', 'Eye & lip color adjustment', 'Face contouring'],
      vi: ['Trang điểm tự nhiên', 'Làm mịn & cải thiện da', 'Điều chỉnh màu mắt & môi', 'Tạo khối khuôn mặt']
    },
    bestFor: { en: 'Portrait photos, selfies, profile pictures', vi: 'Ảnh chân dung, selfie, ảnh đại diện' },
    tips: { en: 'Use front-facing photos with good lighting for best results', vi: 'Sử dụng ảnh chụp thẳng với ánh sáng tốt để có kết quả tốt nhất' }
  },
  'photorealistic': {
    features: {
      en: ['Convert sketches to photos', 'Enhance realism in images', 'Add natural lighting', 'Improve texture details'],
      vi: ['Chuyển phác thảo thành ảnh', 'Tăng độ chân thực', 'Thêm ánh sáng tự nhiên', 'Cải thiện chi tiết kết cấu']
    },
    bestFor: { en: 'Artistic sketches, illustrations, concept art', vi: 'Phác thảo nghệ thuật, minh họa, concept art' },
    tips: { en: 'Clear line art produces the most realistic results', vi: 'Nét vẽ rõ ràng cho kết quả chân thực nhất' }
  },
  'fashion-magazine': {
    features: {
      en: ['Professional magazine styling', 'High-fashion aesthetics', 'Editorial lighting effects', 'Glamour retouching'],
      vi: ['Phong cách tạp chí chuyên nghiệp', 'Thẩm mỹ thời trang cao cấp', 'Hiệu ứng ánh sáng editorial', 'Chỉnh sửa glamour']
    },
    bestFor: { en: 'Fashion photos, model shots, editorial content', vi: 'Ảnh thời trang, ảnh người mẫu, nội dung editorial' },
    tips: { en: 'Full-body or half-body shots work best', vi: 'Ảnh toàn thân hoặc nửa người cho kết quả tốt nhất' }
  },
  'y2k-background': {
    features: {
      en: ['Retro Y2K aesthetic backgrounds', '3D geometric shapes', 'Neon color gradients', 'Futuristic elements'],
      vi: ['Nền thẩm mỹ Y2K retro', 'Hình học 3D', 'Gradient màu neon', 'Yếu tố tương lai']
    },
    bestFor: { en: 'Social media posts, profile pictures, creative content', vi: 'Bài đăng mạng xã hội, ảnh đại diện, nội dung sáng tạo' },
    tips: { en: 'Subject should be clearly separated from background', vi: 'Chủ thể nên tách biệt rõ ràng với nền' }
  },
  'pixel-art': {
    features: {
      en: ['Convert photos to pixel art', 'Retro game aesthetics', 'Customizable pixel density', '8-bit color palette'],
      vi: ['Chuyển ảnh thành pixel art', 'Thẩm mỹ game retro', 'Tùy chỉnh mật độ pixel', 'Bảng màu 8-bit']
    },
    bestFor: { en: 'Gaming content, retro designs, avatars', vi: 'Nội dung game, thiết kế retro, avatar' },
    tips: { en: 'Simple compositions with clear subjects work best', vi: 'Bố cục đơn giản với chủ thể rõ ràng cho kết quả tốt nhất' }
  },
  'comic-book': {
    features: {
      en: ['Comic book style conversion', 'Bold outlines & halftone', 'Dynamic color effects', 'Speech bubble ready'],
      vi: ['Chuyển đổi phong cách truyện tranh', 'Viền đậm & halftone', 'Hiệu ứng màu động', 'Sẵn sàng thêm bong bóng hội thoại']
    },
    bestFor: { en: 'Action shots, portraits, storytelling content', vi: 'Ảnh hành động, chân dung, nội dung kể chuyện' },
    tips: { en: 'High contrast images produce more dramatic results', vi: 'Ảnh tương phản cao cho kết quả ấn tượng hơn' }
  },
};

// Default extended info for tools not in the list
const defaultExtendedInfo = {
  features: {
    en: ['AI-powered transformation', 'High-quality output', 'Fast processing', 'Easy to use'],
    vi: ['Chuyển đổi bằng AI', 'Đầu ra chất lượng cao', 'Xử lý nhanh', 'Dễ sử dụng']
  },
  bestFor: { en: 'Various creative projects', vi: 'Các dự án sáng tạo đa dạng' },
  tips: { en: 'Use high-quality input images for best results', vi: 'Sử dụng ảnh đầu vào chất lượng cao để có kết quả tốt nhất' }
};

// Before/After images
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
  'y2k-background': {
    before: 'https://imgcdn.stablediffusionweb.com/2025/12/16/a7ef91cf-2d13-4425-a48c-3c213a07ab84.webp',
    after: 'https://imgcdn.stablediffusionweb.com/2025/12/16/f273586c-cf36-4ed2-b76b-61ee7bf22321.webp',
  },
};

const defaultShowcase = {
  before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
  after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
};

// Video showcase for video tools - using same videos as ToolCard
const videoToolShowcase: Record<string, { inputImage: string; outputVideo: string }> = {
  'video-kitchen': {
    inputImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop',
    outputVideo: 'https://cdn.higgsfield.ai/kling_video_sample/1308a1ac-d626-4178-b6d5-0e2bb676f194.mp4',
  },
  'dynamic-polaroid': {
    inputImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    outputVideo: 'https://cdn.higgsfield.ai/kling_video_sample/cf9c9837-4383-4edf-898e-7f85b687eea5.mp4',
  },
  'instant-noodle-video': {
    inputImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    outputVideo: 'https://cdn.higgsfield.ai/kling_video_sample/383a6e99-f88d-41c1-8b62-e2181cae3406.mp4',
  },
  'long-video-cooking': {
    inputImage: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop',
    outputVideo: 'https://cdn.higgsfield.ai/kling_video_sample/377e5f89-37b7-4d72-8a22-2802faabf4e5.mp4',
  },
};

// Check if tool is a video tool
const isVideoTool = (toolId: string): boolean => {
  return ['video-kitchen', 'dynamic-polaroid', 'instant-noodle-video', 'long-video-cooking'].includes(toolId);
};

type CompareMode = 'side-by-side' | 'slider';

interface ToolDetailModalProps {
  tool: Tool;
  stationColor: string;
  onClose: () => void;
  onStartUsing: () => void;
}

const TierBadge: React.FC<{ tier: TierType }> = ({ tier }) => {
  if (tier === 'free') {
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        FREE
      </span>
    );
  }
  if (tier === 'plus') {
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
        <Crown size={11} />
        PLUS
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
      <Zap size={11} />
      PRO
    </span>
  );
};

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  stationColor,
  onClose,
  onStartUsing,
}) => {
  const { language } = useLanguage();
  const { currentPlan } = useSubscription();
  const [compareMode, setCompareMode] = useState<CompareMode>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);

  const name = language === 'vi' ? tool.nameVi : tool.name;
  const description = language === 'vi' ? tool.descriptionVi : tool.description;
  const showcase = toolShowcaseImages[tool.id] || defaultShowcase;
  const extendedInfo = toolExtendedInfo[tool.id] || defaultExtendedInfo;

  const planLevel = (plan: string): number => {
    const levels: Record<string, number> = { free: 0, plus: 1, pro: 2, team: 3 };
    return levels[plan] || 0;
  };
  const isLocked = planLevel(currentPlan) < planLevel(tool.tier);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const features = language === 'vi' ? extendedInfo.features.vi : extendedInfo.features.en;
  const bestFor = language === 'vi' ? extendedInfo.bestFor.vi : extendedInfo.bestFor.en;
  const tips = language === 'vi' ? extendedInfo.tips.vi : extendedInfo.tips.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stationColor} shadow-lg`}>
              <Wand2 size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{name}</h2>
                <TierBadge tier={tool.tier} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Left: Image comparison */}
          <div className="lg:w-[55%] p-5 border-b lg:border-b-0 lg:border-r border-zinc-800">
            {/* Compare mode tabs - hide for video tools */}
            {!isVideoTool(tool.id) && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCompareMode('side-by-side')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    compareMode === 'side-by-side'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <Columns size={14} />
                  {language === 'vi' ? 'Song song' : 'Side by Side'}
                </button>
                <button
                  onClick={() => setCompareMode('slider')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    compareMode === 'slider'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  {language === 'vi' ? 'So sánh' : 'Compare'}
                </button>
              </div>
            )}

            {/* Image/Video comparison area */}
            <div className="relative rounded-xl overflow-hidden bg-zinc-800">
              {isVideoTool(tool.id) ? (
                /* Video tool showcase - Input image + Output video */
                <div className="flex gap-2 p-2">
                  <div className="flex-1 relative">
                    <img 
                      src={videoToolShowcase[tool.id]?.inputImage || showcase.before} 
                      alt="Input" 
                      className="w-full aspect-[4/3] object-cover rounded-lg" 
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/70 text-white/90 backdrop-blur-sm">
                      {language === 'vi' ? 'Đầu vào' : 'Input'}
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <video 
                      src={videoToolShowcase[tool.id]?.outputVideo || 'https://static.higgsfield.ai/explore/create-video.mp4'} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      {language === 'vi' ? 'Đầu ra' : 'Output'}
                    </div>
                  </div>
                </div>
              ) : compareMode === 'side-by-side' ? (
                <div className="flex gap-2 p-2">
                  <div className="flex-1 relative">
                    <img src={showcase.before} alt="Before" className="w-full aspect-[4/3] object-cover rounded-lg" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/70 text-white/90 backdrop-blur-sm">
                      {language === 'vi' ? 'Đầu vào' : 'Input'}
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <img src={showcase.after} alt="After" className="w-full aspect-[4/3] object-cover rounded-lg" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[11px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm">
                      {language === 'vi' ? 'Đầu ra' : 'Output'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3]">
                  <img src={showcase.before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                    <img src={showcase.after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <SlidersHorizontal size={14} className="text-zinc-800" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/70 text-white/90 backdrop-blur-sm">
                    {language === 'vi' ? 'Đầu vào' : 'Input'}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm">
                    {language === 'vi' ? 'Đầu ra' : 'Output'}
                  </div>
                  <input type="range" min="0" max="100" value={sliderPosition} onChange={handleSliderChange} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
                </div>
              )}
            </div>
          </div>

          {/* Right: Tool info */}
          <div className="lg:w-[45%] p-5 flex flex-col">
            {/* Description */}
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">{description}</p>

            {/* Features */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {language === 'vi' ? 'Tính năng' : 'Features'}
              </div>
              <ul className="space-y-1.5">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="text-purple-400 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best for */}
            <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
                <Info size={14} />
                {language === 'vi' ? 'Phù hợp nhất cho' : 'Best for'}
              </div>
              <p className="text-sm text-zinc-300">{bestFor}</p>
            </div>

            {/* Tips */}
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <Lightbulb size={14} />
                {language === 'vi' ? 'Mẹo' : 'Pro tip'}
              </div>
              <p className="text-sm text-zinc-300">{tips}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-500 text-[10px] mb-0.5">
                  <Coins size={12} />
                  {language === 'vi' ? 'Chi phí' : 'Cost'}
                </div>
                <div className="text-white font-bold text-sm">{tool.creditCost} credits</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-500 text-[10px] mb-0.5">
                  <Clock size={12} />
                  {language === 'vi' ? 'Thời gian' : 'Time'}
                </div>
                <div className="text-white font-bold text-sm">~{tool.estimatedTime}s</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-500 text-[10px] mb-0.5">
                  <Image size={12} />
                  {language === 'vi' ? 'Đầu vào' : 'Input'}
                </div>
                <div className="text-white font-bold text-sm capitalize">
                  {tool.inputType === 'image' ? (language === 'vi' ? 'Ảnh' : 'Image') : tool.inputType === 'video' ? 'Video' : 'Both'}
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1 min-h-2" />

            {/* Action button */}
            {isLocked ? (
              <button onClick={onStartUsing} className="w-full py-3.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors">
                <Lock size={16} />
                {language === 'vi' ? `Nâng cấp lên ${tool.tier.toUpperCase()}` : `Upgrade to ${tool.tier.toUpperCase()}`}
              </button>
            ) : (
              <button onClick={onStartUsing} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5">
                {language === 'vi' ? 'Bắt đầu sử dụng' : 'Start Using'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailModal;
