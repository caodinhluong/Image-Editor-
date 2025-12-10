import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Users, Zap, ArrowRight, Check, 
  X, ChevronLeft, ChevronRight, Play, Target, Rocket
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  image?: string;
  features?: string[];
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const { trans, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const steps: Step[] = [
    {
      id: 0,
      title: language === 'vi' ? 'Chào mừng đến Repix AI! 🎨' : 'Welcome to Repix AI! 🎨',
      description: language === 'vi' 
        ? 'Trình chỉnh sửa ảnh AI thế hệ mới cho creators, agencies và businesses'
        : 'Next-gen AI photo editor for creators, agencies, and businesses',
      icon: Sparkles,
      color: 'text-repix-500',
      bgGradient: 'from-pink-500 via-repix-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
      features: [
        language === 'vi' ? '✨ AI tạo ảnh từ text' : '✨ Text-to-image generation',
        language === 'vi' ? '🎨 Chỉnh sửa chuyên nghiệp' : '🎨 Professional editing tools',
        language === 'vi' ? '👥 Cộng tác real-time' : '👥 Real-time collaboration',
        language === 'vi' ? '🚀 Xuất 4K chất lượng cao' : '🚀 4K high-quality export'
      ]
    },
    {
      id: 1,
      title: language === 'vi' ? 'Bạn là ai?' : 'Who are you?',
      description: language === 'vi' 
        ? 'Chọn vai trò để chúng tôi tùy chỉnh trải nghiệm cho bạn'
        : 'Select your role so we can customize your experience',
      icon: Target,
      color: 'text-blue-500',
      bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: language === 'vi' ? 'Công cụ AI mạnh mẽ' : 'Powerful AI Tools',
      description: language === 'vi'
        ? 'Khám phá các công cụ AI giúp bạn sáng tạo nhanh hơn'
        : 'Discover AI tools that help you create faster',
      icon: Wand2,
      color: 'text-purple-500',
      bgGradient: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop',
      features: [
        language === 'vi' ? '🖼️ Generative Fill - Thêm/xóa elements' : '🖼️ Generative Fill - Add/remove elements',
        language === 'vi' ? '✂️ Remove BG - Xóa nền tự động' : '✂️ Remove BG - Auto background removal',
        language === 'vi' ? '📐 Smart Crop - Cắt thông minh' : '📐 Smart Crop - Intelligent cropping',
        language === 'vi' ? '⬆️ 4K Upscale - Nâng cấp độ phân giải' : '⬆️ 4K Upscale - Resolution enhancement'
      ]
    },
    {
      id: 3,
      title: language === 'vi' ? 'Sẵn sàng bắt đầu!' : 'Ready to Start!',
      description: language === 'vi'
        ? 'Bạn đã sẵn sàng tạo ra những tác phẩm tuyệt vời'
        : "You're all set to create amazing work",
      icon: Rocket,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
    }
  ];

  const personas = [
    {
      id: 'creator',
      title: language === 'vi' ? 'Content Creator' : 'Content Creator',
      desc: language === 'vi' ? 'Social media, YouTube, TikTok' : 'Social media, YouTube, TikTok',
      icon: '🎬',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'photographer',
      title: language === 'vi' ? 'Nhiếp ảnh gia' : 'Photographer',
      desc: language === 'vi' ? 'Chân dung, sự kiện, thương mại' : 'Portrait, events, commercial',
      icon: '📸',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ecommerce',
      title: language === 'vi' ? 'E-commerce' : 'E-commerce',
      desc: language === 'vi' ? 'Ảnh sản phẩm, catalog' : 'Product photos, catalogs',
      icon: '🛍️',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'agency',
      title: language === 'vi' ? 'Agency / Team' : 'Agency / Team',
      desc: language === 'vi' ? 'Dự án lớn, cộng tác' : 'Large projects, collaboration',
      icon: '🏢',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'hobbyist',
      title: language === 'vi' ? 'Người dùng cá nhân' : 'Hobbyist',
      desc: language === 'vi' ? 'Chỉnh sửa ảnh cá nhân' : 'Personal photo editing',
      icon: '✨',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedPersona) {
      return; // Require persona selection
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-dark-bg flex items-center justify-center p-4 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl ${currentStepData.bgGradient} opacity-10 blur-[120px] rounded-full animate-pulse`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr ${currentStepData.bgGradient} opacity-10 blur-[100px] rounded-full animate-pulse`} style={{ animationDelay: '1s' }} />
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 z-10 px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        {language === 'vi' ? 'Bỏ qua' : 'Skip'}
      </button>

      {/* Main Content */}
      <div className="relative w-full max-w-4xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${currentStepData.bgGradient} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{language === 'vi' ? 'Bước' : 'Step'} {currentStep + 1}/{steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          
          {/* Step Content */}
          <div className="p-8 md:p-12">
            
            {/* Icon */}
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${currentStepData.bgGradient} mb-6`}>
              <currentStepData.icon className="text-white" size={32} />
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              {currentStepData.title}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              {currentStepData.description}
            </p>

            {/* Step-specific Content */}
            {currentStep === 0 && currentStepData.features && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentStepData.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Check className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Persona Selection */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`
                      relative p-6 rounded-2xl border-2 transition-all text-left group
                      ${selectedPersona === persona.id
                        ? 'border-repix-500 bg-repix-50 dark:bg-repix-500/10 shadow-lg shadow-repix-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 hover:shadow-md'
                      }
                    `}
                  >
                    {selectedPersona === persona.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-repix-500 flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                    )}
                    
                    <div className="text-4xl mb-3">{persona.icon}</div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">
                      {persona.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {persona.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Tools Preview */}
            {currentStep === 2 && currentStepData.features && (
              <div className="space-y-3 mb-8">
                {currentStepData.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentStepData.bgGradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Zap className="text-white" size={20} />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex-1">{feature}</span>
                    <ChevronRight className="text-zinc-400 group-hover:text-repix-500 transition-colors" size={20} />
                  </div>
                ))}
              </div>
            )}

            {/* Final Step */}
            {currentStep === 3 && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                  <Check size={16} />
                  <span className="text-sm font-medium">
                    {language === 'vi' ? 'Thiết lập hoàn tất!' : 'Setup Complete!'}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  {language === 'vi' 
                    ? 'Bạn đã sẵn sàng khám phá sức mạnh của AI. Hãy bắt đầu tạo tác phẩm đầu tiên!'
                    : "You're ready to explore the power of AI. Let's create your first masterpiece!"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft size={18} />
              {language === 'vi' ? 'Quay lại' : 'Back'}
            </Button>

            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? `bg-gradient-to-r ${currentStepData.bgGradient} w-8`
                      : idx < currentStep
                      ? 'bg-repix-500'
                      : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedPersona}
              className={`gap-2 bg-gradient-to-r ${currentStepData.bgGradient} border-0 shadow-lg`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Play size={18} />
                  {language === 'vi' ? 'Bắt đầu ngay' : 'Get Started'}
                </>
              ) : (
                <>
                  {language === 'vi' ? 'Tiếp theo' : 'Next'}
                  <ChevronRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
