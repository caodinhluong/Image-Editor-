import React, { useState } from 'react';
import {
  X, Check, Crown, Sparkles, Building2, Zap, Rocket, Star,
  Image, Layers, Palette, Brain, Code, Headphones, Users, Shield,
  Lock, Share2, Plug, Infinity, Upload, ArrowRight, ChevronRight,
  Clock, Globe, Cpu, HardDrive, Gauge, Award, Gift, CreditCard,
  Calendar, TrendingUp, CheckCircle2, Play
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlanType, PLANS } from '../../types/subscription';
import { Button } from '../ui/UIComponents';

interface PlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: PlanType;
  onUpgrade: (planId: PlanType) => void;
  isProcessing?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  sparkles: Sparkles, image: Image, palette: Palette, folder: Layers,
  zap: Zap, upload: Upload, layers: Layers, star: Star, rocket: Rocket,
  brain: Brain, code: Code, headphones: Headphones, infinity: Infinity,
  users: Users, shield: Shield, lock: Lock, share: Share2, plug: Plug,
};

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  isOpen,
  onClose,
  planId,
  onUpgrade,
  isProcessing = false,
}) => {
  const { language } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  if (!isOpen) return null;

  const plan = PLANS[planId];
  
  const planIcons: Record<PlanType, React.ElementType> = {
    free: Zap, plus: Sparkles, pro: Crown, team: Building2,
  };

  const planGradients: Record<PlanType, string> = {
    free: 'from-blue-500 to-cyan-500',
    plus: 'from-purple-500 to-pink-500',
    pro: 'from-amber-500 to-orange-500',
    team: 'from-slate-600 to-zinc-700',
  };

  const planBgGradients: Record<PlanType, string> = {
    free: 'from-blue-500/10 to-cyan-500/10',
    plus: 'from-purple-500/10 to-pink-500/10',
    pro: 'from-amber-500/10 to-orange-500/10',
    team: 'from-slate-500/10 to-zinc-500/10',
  };

  const Icon = planIcons[planId];
  const yearlyPrice = typeof plan.price === 'number' ? Math.round(plan.price * 10) : 'custom';
  const yearlySavings = typeof plan.price === 'number' ? Math.round(plan.price * 12 - plan.price * 10) : 0;

  // Extended features for detail view
  const detailedFeatures = [
    {
      category: language === 'vi' ? 'Công cụ AI' : 'AI Tools',
      icon: Brain,
      items: planId === 'free' ? [
        { text: language === 'vi' ? 'Xóa nền cơ bản' : 'Basic background removal', included: true },
        { text: language === 'vi' ? 'Tạo ảnh AI (giới hạn)' : 'AI image generation (limited)', included: true },
        { text: language === 'vi' ? 'Magic Erase' : 'Magic Erase', included: true },
        { text: language === 'vi' ? 'Style Transfer nâng cao' : 'Advanced Style Transfer', included: false },
        { text: language === 'vi' ? 'Generative Fill' : 'Generative Fill', included: false },
      ] : planId === 'plus' ? [
        { text: language === 'vi' ? 'Xóa nền HD' : 'HD background removal', included: true },
        { text: language === 'vi' ? 'Tạo ảnh AI không giới hạn' : 'Unlimited AI generation', included: true },
        { text: language === 'vi' ? 'Magic Erase Pro' : 'Magic Erase Pro', included: true },
        { text: language === 'vi' ? 'Style Transfer nâng cao' : 'Advanced Style Transfer', included: true },
        { text: language === 'vi' ? 'Generative Fill' : 'Generative Fill', included: true },
      ] : [
        { text: language === 'vi' ? 'Xóa nền 8K' : '8K background removal', included: true },
        { text: language === 'vi' ? 'Tạo ảnh AI ưu tiên' : 'Priority AI generation', included: true },
        { text: language === 'vi' ? 'Magic Erase Ultra' : 'Magic Erase Ultra', included: true },
        { text: language === 'vi' ? 'Style Transfer Pro' : 'Style Transfer Pro', included: true },
        { text: language === 'vi' ? 'Generative Fill Pro' : 'Generative Fill Pro', included: true },
      ],
    },
    {
      category: language === 'vi' ? 'Chất lượng xuất' : 'Export Quality',
      icon: Image,
      items: planId === 'free' ? [
        { text: language === 'vi' ? 'Độ phân giải 1080p' : '1080p resolution', included: true },
        { text: language === 'vi' ? 'Có watermark' : 'With watermark', included: true },
        { text: language === 'vi' ? 'Xuất 4K' : '4K export', included: false },
        { text: language === 'vi' ? 'Xuất 8K' : '8K export', included: false },
      ] : planId === 'plus' ? [
        { text: language === 'vi' ? 'Độ phân giải 4K' : '4K resolution', included: true },
        { text: language === 'vi' ? 'Không watermark' : 'No watermark', included: true },
        { text: language === 'vi' ? 'Xuất PNG/JPG/WebP' : 'PNG/JPG/WebP export', included: true },
        { text: language === 'vi' ? 'Xuất 8K' : '8K export', included: false },
      ] : [
        { text: language === 'vi' ? 'Độ phân giải 8K' : '8K resolution', included: true },
        { text: language === 'vi' ? 'Không watermark' : 'No watermark', included: true },
        { text: language === 'vi' ? 'Tất cả định dạng' : 'All formats', included: true },
        { text: language === 'vi' ? 'RAW export' : 'RAW export', included: true },
      ],
    },
    {
      category: language === 'vi' ? 'Năng suất' : 'Productivity',
      icon: Rocket,
      items: planId === 'free' ? [
        { text: language === 'vi' ? 'Xử lý hàng loạt 5 ảnh' : 'Batch 5 images', included: true },
        { text: language === 'vi' ? '1 Brand Kit' : '1 Brand Kit', included: true },
        { text: language === 'vi' ? 'Lưu 10 dự án' : 'Save 10 projects', included: true },
        { text: language === 'vi' ? 'Xử lý ưu tiên' : 'Priority processing', included: false },
      ] : planId === 'plus' ? [
        { text: language === 'vi' ? 'Xử lý hàng loạt 50 ảnh' : 'Batch 50 images', included: true },
        { text: language === 'vi' ? '3 Brand Kits' : '3 Brand Kits', included: true },
        { text: language === 'vi' ? 'Dự án không giới hạn' : 'Unlimited projects', included: true },
        { text: language === 'vi' ? 'Xử lý nhanh hơn 2x' : '2x faster processing', included: true },
      ] : [
        { text: language === 'vi' ? 'Xử lý hàng loạt 200 ảnh' : 'Batch 200 images', included: true },
        { text: language === 'vi' ? 'Brand Kits không giới hạn' : 'Unlimited Brand Kits', included: true },
        { text: language === 'vi' ? 'Dự án không giới hạn' : 'Unlimited projects', included: true },
        { text: language === 'vi' ? 'Xử lý ưu tiên cao nhất' : 'Highest priority', included: true },
      ],
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: language === 'vi' ? 'Nhà thiết kế' : 'Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: language === 'vi' 
        ? 'Repix AI đã giúp tôi tiết kiệm hàng giờ mỗi ngày. Công cụ xóa nền tuyệt vời!'
        : 'Repix AI saved me hours every day. The background removal is amazing!',
    },
    {
      name: 'Mike Johnson',
      role: language === 'vi' ? 'Nhiếp ảnh gia' : 'Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: language === 'vi'
        ? 'Chất lượng 8K thực sự ấn tượng. Khách hàng của tôi rất hài lòng.'
        : 'The 8K quality is truly impressive. My clients love the results.',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <X size={20} className="text-zinc-500" />
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Left Side - Plan Info */}
          <div className={`lg:w-2/5 p-8 bg-gradient-to-br ${planBgGradients[planId]} flex flex-col`}>
            {/* Plan Header */}
            <div className="mb-8">
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${planGradients[planId]} mb-4`}>
                <Icon size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                {plan.name}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {language === 'vi' ? plan.taglineVi : plan.tagline}
              </p>
            </div>

            {/* Billing Toggle */}
            {plan.price !== 'custom' && plan.price > 0 && (
              <div className="mb-6">
                <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    {language === 'vi' ? 'Hàng tháng' : 'Monthly'}
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      billingCycle === 'yearly'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    {language === 'vi' ? 'Hàng năm' : 'Yearly'}
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded">
                      -{Math.round((yearlySavings as number) / (plan.price as number) / 12 * 100)}%
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">
                  {plan.price === 'custom' 
                    ? (language === 'vi' ? 'Liên hệ' : 'Custom')
                    : plan.price === 0 
                      ? 'Free'
                      : `$${billingCycle === 'yearly' ? yearlyPrice : plan.price}`
                  }
                </span>
                {plan.price !== 'custom' && plan.price > 0 && (
                  <span className="text-zinc-500">
                    /{billingCycle === 'yearly' ? (language === 'vi' ? 'năm' : 'year') : (language === 'vi' ? 'tháng' : 'mo')}
                  </span>
                )}
              </div>
              {billingCycle === 'yearly' && plan.price !== 'custom' && plan.price > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <Gift size={14} />
                  {language === 'vi' ? `Tiết kiệm $${yearlySavings}/năm` : `Save $${yearlySavings}/year`}
                </p>
              )}
              {plan.credits !== -1 && (
                <p className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-500" />
                  {plan.credits} credits/{language === 'vi' ? 'tháng' : 'month'}
                </p>
              )}
              {plan.credits === -1 && (
                <p className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                  <Infinity size={14} className="text-purple-500" />
                  {language === 'vi' ? 'Credits không giới hạn' : 'Unlimited credits'}
                </p>
              )}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => onUpgrade(planId)}
              disabled={isProcessing}
              className={`w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r ${planGradients[planId]} hover:opacity-90 text-white shadow-lg transition-all`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'vi' ? 'Đang xử lý...' : 'Processing...'}
                </span>
              ) : plan.price === 'custom' ? (
                <span className="flex items-center gap-2">
                  {language === 'vi' ? 'Liên hệ tư vấn' : 'Contact Sales'}
                  <ArrowRight size={20} />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {language === 'vi' ? 'Bắt đầu ngay' : 'Get Started'}
                  <ArrowRight size={20} />
                </span>
              )}
            </Button>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Shield size={12} /> {language === 'vi' ? 'Bảo mật' : 'Secure'}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {language === 'vi' ? 'Hủy bất cứ lúc nào' : 'Cancel anytime'}
              </span>
            </div>

            {/* Testimonial */}
            <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <img 
                  src={testimonials[planId === 'pro' || planId === 'team' ? 1 : 0].avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 italic mb-2">
                    "{testimonials[planId === 'pro' || planId === 'team' ? 1 : 0].text}"
                  </p>
                  <p className="text-xs font-medium text-zinc-900 dark:text-white">
                    {testimonials[planId === 'pro' || planId === 'team' ? 1 : 0].name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {testimonials[planId === 'pro' || planId === 'team' ? 1 : 0].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Features Detail */}
          <div className="lg:w-3/5 p-8 overflow-y-auto max-h-[90vh] lg:max-h-none">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              {language === 'vi' ? 'Tất cả tính năng bao gồm' : 'Everything included'}
            </h3>

            {/* Feature Categories */}
            <div className="space-y-6">
              {detailedFeatures.map((category, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${planGradients[planId]}`}>
                      <category.icon size={16} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">
                      {category.category}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx}
                        className={`flex items-center gap-2 ${
                          item.included ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600'
                        }`}
                      >
                        {item.included ? (
                          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        ) : (
                          <X size={16} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                        )}
                        <span className={`text-sm ${!item.included && 'line-through'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Features List */}
            <div className="mt-8">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">
                {language === 'vi' ? 'Tính năng nổi bật' : 'Highlights'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {plan.features.map((feature, idx) => {
                  const FeatureIcon = iconMap[feature.icon] || Sparkles;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <FeatureIcon size={14} className="text-purple-500 shrink-0" />
                      {language === 'vi' ? feature.textVi : feature.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison hint */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <TrendingUp size={16} className="text-purple-500" />
                </div>
                <div>
                  <h5 className="font-semibold text-zinc-900 dark:text-white mb-1">
                    {language === 'vi' ? 'Tại sao chọn ' + plan.name + '?' : 'Why choose ' + plan.name + '?'}
                  </h5>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {planId === 'free' && (language === 'vi' 
                      ? 'Hoàn hảo để bắt đầu và khám phá sức mạnh của AI trong chỉnh sửa ảnh.'
                      : 'Perfect to get started and explore the power of AI in photo editing.'
                    )}
                    {planId === 'plus' && (language === 'vi'
                      ? 'Lý tưởng cho freelancer và creator muốn nâng cao chất lượng công việc.'
                      : 'Ideal for freelancers and creators who want to elevate their work quality.'
                    )}
                    {planId === 'pro' && (language === 'vi'
                      ? 'Dành cho chuyên gia cần công cụ mạnh mẽ nhất và hỗ trợ ưu tiên.'
                      : 'For professionals who need the most powerful tools and priority support.'
                    )}
                    {planId === 'team' && (language === 'vi'
                      ? 'Giải pháp toàn diện cho doanh nghiệp với bảo mật và tùy chỉnh cao cấp.'
                      : 'Complete solution for businesses with enterprise security and customization.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Money back guarantee */}
            <div className="mt-6 text-center text-sm text-zinc-500 flex items-center justify-center gap-2">
              <Award size={16} className="text-amber-500" />
              {language === 'vi' 
                ? 'Hoàn tiền 100% trong 7 ngày nếu không hài lòng'
                : '100% money back guarantee within 7 days'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
