import React, { useState } from 'react';
import {
  X, ArrowRight, Play, Sparkles, Eraser, Aperture, Maximize2,
  Palette, Crop, ScanFace, Move, ChevronLeft, ChevronRight, Zap,
  Info, CheckCircle2, Clock, Star, EyeOff
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ToolDemoPanelProps {
  toolId: string | null;
  onClose: () => void;
  onApply: () => void;
  onDontShowAgain: () => void;
}

interface ToolDemoData {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  beforeImage: string;
  afterImage: string;
  icon: React.ElementType;
  gradient: string;
  credits: number;
  processingTime: string;
  features: string[];
  featuresVi: string[];
}

const toolDemos: ToolDemoData[] = [
  {
    id: 'generative',
    name: 'Generative Fill',
    nameVi: 'Tô màu AI',
    description: 'Select an area and describe what you want. AI fills it seamlessly.',
    descriptionVi: 'Chọn vùng và mô tả. AI sẽ tô màu liền mạch.',
    beforeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop',
    icon: Sparkles,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    credits: 5,
    processingTime: '~5s',
    features: ['Context-aware fill', 'Text-guided generation', 'Seamless blending'],
    featuresVi: ['Tô màu theo ngữ cảnh', 'Tạo theo mô tả', 'Hòa trộn liền mạch']
  },
  {
    id: 'magic-erase',
    name: 'Magic Erase',
    nameVi: 'Xóa thông minh',
    description: 'Remove unwanted objects. AI fills the background intelligently.',
    descriptionVi: 'Xóa đối tượng không mong muốn. AI tự động điền nền.',
    beforeImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
    icon: Eraser,
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    credits: 3,
    processingTime: '~3s',
    features: ['One-click removal', 'Smart inpainting', 'Preserve details'],
    featuresVi: ['Xóa một chạm', 'Tô nền thông minh', 'Giữ chi tiết']
  },
  {
    id: 'remove-bg',
    name: 'Remove Background',
    nameVi: 'Xóa nền',
    description: 'Instantly remove background from any image with one click.',
    descriptionVi: 'Xóa nền ảnh ngay lập tức chỉ với một cú click.',
    beforeImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    icon: Aperture,
    gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
    credits: 2,
    processingTime: '~2s',
    features: ['Edge detection', 'Hair & fur support', 'Transparent export'],
    featuresVi: ['Phát hiện viền', 'Hỗ trợ tóc & lông', 'Xuất trong suốt']
  },
  {
    id: 'upscale-4k',
    name: 'Upscale 4K',
    nameVi: 'Nâng cấp 4K',
    description: 'Enhance resolution up to 4K while preserving details.',
    descriptionVi: 'Nâng độ phân giải lên 4K, giữ nguyên chi tiết.',
    beforeImage: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop&q=30',
    afterImage: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop&q=100',
    icon: Maximize2,
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
    credits: 8,
    processingTime: '~10s',
    features: ['4x upscaling', 'Noise reduction', 'Detail enhancement'],
    featuresVi: ['Phóng to 4x', 'Giảm nhiễu', 'Tăng chi tiết']
  },
  {
    id: 'style-transfer',
    name: 'Style Transfer',
    nameVi: 'Chuyển phong cách',
    description: 'Apply artistic styles. Transform photos into art.',
    descriptionVi: 'Áp dụng phong cách nghệ thuật cho ảnh.',
    beforeImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&h=500&fit=crop',
    icon: Palette,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    credits: 3,
    processingTime: '~4s',
    features: ['50+ art styles', 'Adjustable intensity', 'Custom presets'],
    featuresVi: ['50+ phong cách', 'Điều chỉnh cường độ', 'Preset tùy chỉnh']
  },
  {
    id: 'object-select',
    name: 'Smart Select',
    nameVi: 'Chọn thông minh',
    description: 'AI detects and selects objects automatically.',
    descriptionVi: 'AI tự động phát hiện và chọn đối tượng.',
    beforeImage: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=500&fit=crop',
    icon: ScanFace,
    gradient: 'from-indigo-500 via-blue-500 to-sky-500',
    credits: 0,
    processingTime: '~1s',
    features: ['Auto detection', 'Multi-object', 'Refine edges'],
    featuresVi: ['Tự động phát hiện', 'Nhiều đối tượng', 'Tinh chỉnh viền']
  },
  {
    id: 'crop',
    name: 'Smart Crop',
    nameVi: 'Cắt thông minh',
    description: 'Crop with smart guides and aspect ratio presets.',
    descriptionVi: 'Cắt ảnh với hướng dẫn và tỷ lệ có sẵn.',
    beforeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=350&fit=crop',
    icon: Crop,
    gradient: 'from-slate-500 via-zinc-500 to-neutral-500',
    credits: 0,
    processingTime: 'Instant',
    features: ['Rule of thirds', 'Social presets', 'Free transform'],
    featuresVi: ['Quy tắc 1/3', 'Preset mạng xã hội', 'Tự do biến đổi']
  },
];

export const ToolDemoPanel: React.FC<ToolDemoPanelProps> = ({
  toolId,
  onClose,
  onApply,
  onDontShowAgain,
}) => {
  const { language } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const demo = toolDemos.find(t => t.id === toolId);
  
  if (!demo) return null;

  const Icon = demo.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-700/50 animate-in zoom-in-95 duration-200">
        
        {/* Header - Compact */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${demo.gradient} opacity-10`} />
          
          <div className="relative flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${demo.gradient} shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {language === 'vi' ? demo.nameVi : demo.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'vi' ? demo.descriptionVi : demo.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={18} className="text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Main Content - Compact horizontal layout */}
        <div className="p-4 pt-2">
          <div className="flex gap-4">
            {/* Image Compare Section - Smaller */}
            <div className="w-64 flex-shrink-0">
              <div 
                className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-ew-resize shadow-inner"
                onMouseMove={handleMouseMove}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <img
                  src={demo.beforeImage}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  draggable={false}
                />
                
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={demo.afterImage}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </div>

                {/* Slider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="flex items-center text-zinc-600">
                      <ChevronLeft size={12} strokeWidth={2.5} />
                      <ChevronRight size={12} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-[10px] font-semibold">
                  {language === 'vi' ? 'Trước' : 'Before'}
                </div>
                <div className={`absolute top-2 right-2 px-2 py-1 bg-gradient-to-r ${demo.gradient} rounded-full text-white text-[10px] font-semibold`}>
                  {language === 'vi' ? 'Sau' : 'After'}
                </div>

                {/* Drag Hint */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white/80 text-[10px] flex items-center gap-1">
                  <ArrowRight size={10} className="rotate-180" />
                  {language === 'vi' ? 'Kéo' : 'Drag'}
                  <ArrowRight size={10} />
                </div>
              </div>
            </div>

            {/* Info Section - Compact */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Stats - Inline */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mb-0.5">
                    <Zap size={12} />
                    <span className="text-[10px]">Credits</span>
                  </div>
                  <p className={`text-sm font-bold ${demo.credits === 0 ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`}>
                    {demo.credits === 0 ? (language === 'vi' ? 'Miễn phí' : 'Free') : demo.credits}
                  </p>
                </div>
                <div className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mb-0.5">
                    <Clock size={12} />
                    <span className="text-[10px]">{language === 'vi' ? 'Thời gian' : 'Time'}</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{demo.processingTime}</p>
                </div>
              </div>

              {/* Features - Compact */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Star size={12} className="text-amber-500" />
                  {language === 'vi' ? 'Tính năng' : 'Features'}
                </h4>
                <div className="space-y-1">
                  {(language === 'vi' ? demo.featuresVi : demo.features).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip - Compact */}
              <div className="p-2 bg-gradient-to-br from-repix-50 to-pink-50 dark:from-repix-900/20 dark:to-pink-900/20 rounded-lg border border-repix-200/50 dark:border-repix-800/50">
                <div className="flex items-start gap-1.5">
                  <Info size={12} className="text-repix-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-repix-700 dark:text-repix-300">
                    {language === 'vi' 
                      ? 'Mẹo: Kết hợp nhiều công cụ để có kết quả tốt nhất!'
                      : 'Tip: Combine tools for best results!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/80 dark:bg-zinc-800/50 border-t border-zinc-200/50 dark:border-zinc-700/50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              {language === 'vi' ? 'Đóng' : 'Close'}
            </button>
            <button
              onClick={onDontShowAgain}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <EyeOff size={12} />
              {language === 'vi' ? 'Không hiện lại' : "Don't show"}
            </button>
          </div>
          <Button
            onClick={onApply}
            size="sm"
            className={`px-4 py-1.5 bg-gradient-to-r ${demo.gradient} hover:opacity-90 text-white font-semibold rounded-lg shadow-lg gap-1.5 text-xs`}
          >
            <Play size={14} fill="currentColor" />
            {language === 'vi' ? 'Sử dụng' : 'Use Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
