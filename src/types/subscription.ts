// Subscription Types for Repix AI - ChatGPT-style Plans

export type PlanType = 'free' | 'plus' | 'pro' | 'team';

export interface Plan {
  id: PlanType;
  name: string;
  nameVi: string;
  price: number | 'custom';
  priceVND: number | 'custom';
  priceLabel: string;
  tagline: string;
  taglineVi: string;
  credits: number;
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular?: boolean;
  badge?: string;
}

export interface PlanFeature {
  icon: string;
  text: string;
  textVi: string;
}

export interface PlanLimits {
  brandKits: number;
  batchImages: number;
  maxResolution: '1080p' | '4K' | '8K';
  watermark: boolean;
  teamMembers: number;
  apiAccess: boolean;
  prioritySupport: boolean;
  customTraining: boolean;
  advancedAI: boolean;
  unlimitedProjects: boolean;
}

export interface SubscriptionState {
  currentPlan: PlanType;
  credits: number;
  maxCredits: number;
  usedCredits: number;
  renewalDate: Date;
  isActive: boolean;
}

export interface CreditCost {
  operation: string;
  cost: number;
}

export type FeatureKey =
  | 'textToImage'
  | 'removeBg'
  | 'upscale4K'
  | 'upscale8K'
  | 'genFill'
  | 'batchProcess'
  | 'brandKit'
  | 'multipleBrandKits'
  | 'teamWorkspace'
  | 'comments'
  | 'apiAccess'
  | 'customTraining'
  | 'proTemplates'
  | 'noWatermark'
  | 'prioritySupport'
  | 'styleTransfer'
  | 'magicErase'
  | 'advancedAI'
  | 'unlimitedProjects';

// Plan definitions - ChatGPT style
export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    nameVi: 'Miễn phí',
    price: 0,
    priceVND: 0,
    priceLabel: 'Free',
    tagline: 'See what AI can do',
    taglineVi: 'Khám phá sức mạnh AI',
    credits: 50,
    features: [
      { icon: 'sparkles', text: 'Basic AI editing tools', textVi: 'Công cụ AI cơ bản' },
      { icon: 'image', text: 'Standard resolution (1080p)', textVi: 'Độ phân giải chuẩn (1080p)' },
      { icon: 'palette', text: 'Try out AI generation', textVi: 'Thử nghiệm tạo ảnh AI' },
      { icon: 'folder', text: 'Save limited projects', textVi: 'Lưu dự án giới hạn' },
    ],
    limits: {
      brandKits: 1,
      batchImages: 5,
      maxResolution: '1080p',
      watermark: true,
      teamMembers: 1,
      apiAccess: false,
      prioritySupport: false,
      customTraining: false,
      advancedAI: false,
      unlimitedProjects: false,
    },
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    nameVi: 'Plus',
    price: 9,
    priceVND: 199000,
    priceLabel: '$9/mo',
    tagline: 'Do more with smarter AI',
    taglineVi: 'Làm nhiều hơn với AI thông minh',
    credits: 300,
    badge: 'POPULAR',
    isPopular: true,
    features: [
      { icon: 'zap', text: 'Advanced AI models', textVi: 'Mô hình AI nâng cao' },
      { icon: 'upload', text: 'Upload & edit more content', textVi: 'Tải lên & chỉnh sửa nhiều hơn' },
      { icon: 'image', text: '4K resolution output', textVi: 'Xuất ảnh độ phân giải 4K' },
      { icon: 'layers', text: 'Batch processing (50 images)', textVi: 'Xử lý hàng loạt (50 ảnh)' },
      { icon: 'palette', text: '3 Brand Kits', textVi: '3 Brand Kits' },
      { icon: 'star', text: 'No watermark', textVi: 'Không watermark' },
    ],
    limits: {
      brandKits: 3,
      batchImages: 50,
      maxResolution: '4K',
      watermark: false,
      teamMembers: 1,
      apiAccess: false,
      prioritySupport: false,
      customTraining: false,
      advancedAI: true,
      unlimitedProjects: true,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameVi: 'Pro',
    price: 29,
    priceVND: 649000,
    priceLabel: '$29/mo',
    tagline: 'Maximize your productivity',
    taglineVi: 'Tối đa hóa năng suất',
    credits: 1000,
    features: [
      { icon: 'rocket', text: 'Unlimited AI generations', textVi: 'Tạo ảnh AI không giới hạn' },
      { icon: 'zap', text: 'Priority processing queue', textVi: 'Ưu tiên xử lý nhanh' },
      { icon: 'image', text: '8K ultra resolution', textVi: 'Độ phân giải 8K siêu nét' },
      { icon: 'layers', text: 'Batch processing (200 images)', textVi: 'Xử lý hàng loạt (200 ảnh)' },
      { icon: 'palette', text: 'Unlimited Brand Kits', textVi: 'Brand Kits không giới hạn' },
      { icon: 'brain', text: 'Advanced style transfer', textVi: 'Chuyển đổi phong cách nâng cao' },
      { icon: 'code', text: 'API access', textVi: 'Truy cập API' },
      { icon: 'headphones', text: 'Priority support', textVi: 'Hỗ trợ ưu tiên' },
    ],
    limits: {
      brandKits: -1,
      batchImages: 200,
      maxResolution: '8K',
      watermark: false,
      teamMembers: 1,
      apiAccess: true,
      prioritySupport: true,
      customTraining: false,
      advancedAI: true,
      unlimitedProjects: true,
    },
  },
  team: {
    id: 'team',
    name: 'Team',
    nameVi: 'Doanh nghiệp',
    price: 'custom',
    priceVND: 'custom',
    priceLabel: 'Custom',
    tagline: 'Get more work done with AI for teams',
    taglineVi: 'Làm việc nhóm hiệu quả với AI',
    credits: -1,
    features: [
      { icon: 'infinity', text: 'Unlimited everything', textVi: 'Mọi thứ không giới hạn' },
      { icon: 'users', text: 'Team workspace & collaboration', textVi: 'Không gian làm việc nhóm' },
      { icon: 'shield', text: 'SSO, MFA & enterprise security', textVi: 'SSO, MFA & bảo mật doanh nghiệp' },
      { icon: 'lock', text: 'Data privacy guarantee', textVi: 'Cam kết bảo mật dữ liệu' },
      { icon: 'share', text: 'Share projects & custom presets', textVi: 'Chia sẻ dự án & preset' },
      { icon: 'plug', text: 'Integrate with your tools', textVi: 'Tích hợp với công cụ của bạn' },
      { icon: 'brain', text: 'Custom AI model training', textVi: 'Huấn luyện AI theo brand' },
      { icon: 'headphones', text: 'Dedicated account manager', textVi: 'Quản lý tài khoản riêng' },
    ],
    limits: {
      brandKits: -1,
      batchImages: -1,
      maxResolution: '8K',
      watermark: false,
      teamMembers: -1,
      apiAccess: true,
      prioritySupport: true,
      customTraining: true,
      advancedAI: true,
      unlimitedProjects: true,
    },
  },
};

// Credit costs for AI operations
export const CREDIT_COSTS: Record<string, CreditCost> = {
  textToImage: { operation: 'Text to Image', cost: 4 },
  removeBg: { operation: 'Remove Background', cost: 2 },
  upscale: { operation: 'Upscale 4K', cost: 8 },
  genFill: { operation: 'Generative Fill', cost: 5 },
  styleTransfer: { operation: 'Style Transfer', cost: 3 },
  magicErase: { operation: 'Magic Erase', cost: 3 },
  batchItem: { operation: 'Batch Item', cost: 1 },
};

// Feature to minimum plan mapping
export const FEATURE_REQUIREMENTS: Record<FeatureKey, PlanType> = {
  textToImage: 'free',
  removeBg: 'free',
  magicErase: 'free',
  upscale4K: 'plus',
  upscale8K: 'pro',
  genFill: 'free',
  batchProcess: 'plus',
  brandKit: 'free',
  multipleBrandKits: 'plus',
  teamWorkspace: 'team',
  comments: 'team',
  apiAccess: 'pro',
  customTraining: 'team',
  proTemplates: 'plus',
  noWatermark: 'plus',
  prioritySupport: 'pro',
  styleTransfer: 'plus',
  advancedAI: 'plus',
  unlimitedProjects: 'plus',
};
