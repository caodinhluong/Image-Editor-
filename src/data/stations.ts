// AI Creative Studios Configuration Data
import { Station, Tool, ProcessingError, ProcessingErrorType } from '../types/stations';

// ============================================
// STUDIO 1: Enhancement Studio (Image Quality & Beauty)
// ============================================
const enhancementTools: Tool[] = [
  {
    id: 'hd-enhance',
    name: 'AI Upscaler',
    nameVi: 'Nâng cấp AI',
    description: 'Upscale image resolution by 2x-4x with AI enhancement',
    descriptionVi: 'Nâng cấp độ phân giải 2x-4x với AI tăng cường',
    icon: 'wand',
    creditCost: 1,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image',
    options: [
      {
        id: 'scale',
        label: 'Scale Factor',
        labelVi: 'Hệ số phóng đại',
        type: 'select',
        values: ['2x', '4x'],
        valuesVi: ['2x', '4x'],
        default: '2x'
      }
    ]
  },
  {
    id: 'makeup',
    name: 'AI Makeup',
    nameVi: 'Trang điểm AI',
    description: 'Apply virtual makeup effects to portraits',
    descriptionVi: 'Áp dụng hiệu ứng trang điểm ảo cho ảnh chân dung',
    icon: 'palette',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 8,
    inputType: 'image',
    options: [
      {
        id: 'style',
        label: 'Makeup Style',
        labelVi: 'Phong cách trang điểm',
        type: 'select',
        values: ['Natural', 'Glamour', 'Party', 'Bridal'],
        valuesVi: ['Tự nhiên', 'Quyến rũ', 'Tiệc tùng', 'Cô dâu'],
        default: 'Natural'
      },
      {
        id: 'intensity',
        label: 'Intensity',
        labelVi: 'Cường độ',
        type: 'slider',
        min: 0,
        max: 100,
        step: 10,
        default: 50
      }
    ]
  },
  {
    id: 'photorealistic',
    name: 'Photo Realism',
    nameVi: 'Ảnh siêu thực',
    description: 'Convert stylized images to photorealistic style',
    descriptionVi: 'Chuyển đổi ảnh cách điệu sang phong cách siêu thực',
    icon: 'camera',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'fashion-magazine',
    name: 'Magazine Cover',
    nameVi: 'Bìa tạp chí',
    description: 'Apply magazine cover styling with filters',
    descriptionVi: 'Áp dụng phong cách bìa tạp chí với bộ lọc',
    icon: 'newspaper',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 12,
    inputType: 'image',
    options: [
      {
        id: 'magazine',
        label: 'Magazine Style',
        labelVi: 'Phong cách tạp chí',
        type: 'select',
        values: ['Vogue', 'Elle', 'GQ', 'Cosmopolitan'],
        valuesVi: ['Vogue', 'Elle', 'GQ', 'Cosmopolitan'],
        default: 'Vogue'
      }
    ]
  }
];

// ============================================
// STUDIO 2: Illustration Studio (Anime & Digital Art)
// ============================================
const illustrationTools: Tool[] = [
  {
    id: 'cosplay-character',
    name: 'Anime Transform',
    nameVi: 'Chuyển đổi Anime',
    description: 'Transform photo into anime/manga character style',
    descriptionVi: 'Biến đổi ảnh thành phong cách nhân vật anime/manga',
    icon: 'drama',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 15,
    inputType: 'image',
    options: [
      {
        id: 'style',
        label: 'Character Style',
        labelVi: 'Phong cách nhân vật',
        type: 'select',
        values: ['Anime', 'Manga', 'Chibi', 'Realistic Anime'],
        valuesVi: ['Anime', 'Manga', 'Chibi', 'Anime thực tế'],
        default: 'Anime'
      }
    ]
  },
  {
    id: 'minimalist-illustration',
    name: 'Minimal Vector',
    nameVi: 'Vector tối giản',
    description: 'Create clean minimalist illustration from photo',
    descriptionVi: 'Tạo minh họa vector tối giản từ ảnh',
    icon: 'pencil',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    nameVi: 'Nghệ thuật Pixel',
    description: 'Convert image to retro 8-bit pixel art style',
    descriptionVi: 'Chuyển đổi ảnh sang phong cách pixel retro 8-bit',
    icon: 'grid',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 8,
    inputType: 'image',
    options: [
      {
        id: 'resolution',
        label: 'Pixel Resolution',
        labelVi: 'Độ phân giải pixel',
        type: 'select',
        values: ['16x16', '32x32', '64x64', '128x128', '256x256'],
        valuesVi: ['16x16', '32x32', '64x64', '128x128', '256x256'],
        default: '64x64'
      }
    ]
  },
  {
    id: 'comic-book',
    name: 'Comic Style',
    nameVi: 'Phong cách Comic',
    description: 'Apply comic book style with halftone effects',
    descriptionVi: 'Áp dụng phong cách truyện tranh với hiệu ứng halftone',
    icon: 'zap',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image'
  },
  {
    id: 'line-art',
    name: 'Line Drawing',
    nameVi: 'Nét vẽ tay',
    description: 'Extract clean line drawings from photos',
    descriptionVi: 'Trích xuất nét vẽ tay sạch từ ảnh',
    icon: 'pen',
    creditCost: 1,
    tier: 'free',
    estimatedTime: 6,
    inputType: 'image'
  },
  {
    id: 'ukiyo-e',
    name: 'Japanese Woodblock',
    nameVi: 'Tranh khắc gỗ Nhật',
    description: 'Transform to traditional Japanese woodblock print style',
    descriptionVi: 'Chuyển đổi sang phong cách tranh khắc gỗ truyền thống Nhật Bản',
    icon: 'map',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 12,
    inputType: 'image'
  }
];

// ============================================
// STUDIO 3: 3D Studio (3D Rendering & Models)
// ============================================
const studio3DTools: Tool[] = [
  {
    id: '3d-figurine',
    name: '3D Character',
    nameVi: 'Nhân vật 3D',
    description: 'Create 3D character model from portrait',
    descriptionVi: 'Tạo mô hình nhân vật 3D từ ảnh chân dung',
    icon: 'box',
    creditCost: 4,
    tier: 'plus',
    estimatedTime: 20,
    inputType: 'image'
  },
  {
    id: 'funko-pop',
    name: 'Vinyl Figure',
    nameVi: 'Mô hình Vinyl',
    description: 'Transform portrait into collectible vinyl figure style',
    descriptionVi: 'Biến đổi chân dung thành phong cách mô hình vinyl sưu tầm',
    icon: 'toy',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'lego-minifig',
    name: 'Block Figure',
    nameVi: 'Mô hình khối',
    description: 'Convert image to block-style minifigure',
    descriptionVi: 'Chuyển đổi ảnh sang phong cách mô hình khối',
    icon: 'blocks',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 12,
    inputType: 'image'
  },
  {
    id: 'plushie-toy',
    name: 'Plush Toy',
    nameVi: 'Thú bông 3D',
    description: 'Transform subject into 3D plush toy style',
    descriptionVi: 'Biến đổi đối tượng thành phong cách thú bông 3D',
    icon: 'cat',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'claymation',
    name: 'Clay Model',
    nameVi: 'Mô hình đất sét',
    description: 'Apply clay/stop-motion animation style',
    descriptionVi: 'Áp dụng phong cách hoạt hình đất sét stop-motion',
    icon: 'clapperboard',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'product-render',
    name: 'Product 3D',
    nameVi: 'Sản phẩm 3D',
    description: 'Generate professional 3D product visualization',
    descriptionVi: 'Tạo hình ảnh 3D sản phẩm chuyên nghiệp',
    icon: 'package',
    creditCost: 4,
    tier: 'pro',
    estimatedTime: 25,
    inputType: 'image',
    options: [
      {
        id: 'background',
        label: 'Background',
        labelVi: 'Nền',
        type: 'select',
        values: ['Studio White', 'Gradient', 'Environment', 'Transparent'],
        valuesVi: ['Studio trắng', 'Gradient', 'Môi trường', 'Trong suốt'],
        default: 'Studio White'
      }
    ]
  },
  {
    id: 'architecture-model',
    name: 'Architectural 3D',
    nameVi: 'Kiến trúc 3D',
    description: 'Create architectural miniature style rendering',
    descriptionVi: 'Tạo phong cách mô hình kiến trúc thu nhỏ',
    icon: 'building',
    creditCost: 4,
    tier: 'pro',
    estimatedTime: 20,
    inputType: 'image'
  }
];

// ============================================
// STUDIO 4: Artistic Studio (Film & Fine Art Effects)
// ============================================
const artisticTools: Tool[] = [
  {
    id: 'party-polaroid',
    name: 'Instant Film',
    nameVi: 'Phim lấy liền',
    description: 'Apply instant camera effect with retro atmosphere',
    descriptionVi: 'Áp dụng hiệu ứng máy ảnh lấy liền với không khí retro',
    icon: 'image',
    creditCost: 1,
    tier: 'free',
    estimatedTime: 5,
    inputType: 'image'
  },
  {
    id: 'vintage-photo',
    name: 'Vintage Film',
    nameVi: 'Phim cổ điển',
    description: 'Apply vintage film photography effects',
    descriptionVi: 'Áp dụng hiệu ứng ảnh phim cổ điển',
    icon: 'film',
    creditCost: 1,
    tier: 'free',
    estimatedTime: 5,
    inputType: 'image',
    options: [
      {
        id: 'era',
        label: 'Era',
        labelVi: 'Thời kỳ',
        type: 'select',
        values: ['1920s', '1950s', '1970s', '1990s'],
        valuesVi: ['Thập niên 20', 'Thập niên 50', 'Thập niên 70', 'Thập niên 90'],
        default: '1970s'
      }
    ]
  },
  {
    id: 'glitch-art',
    name: 'Digital Glitch',
    nameVi: 'Hiệu ứng Glitch',
    description: 'Apply digital distortion and RGB shift effects',
    descriptionVi: 'Áp dụng hiệu ứng méo kỹ thuật số và dịch chuyển RGB',
    icon: 'tv',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 6,
    inputType: 'image',
    options: [
      {
        id: 'intensity',
        label: 'Glitch Intensity',
        labelVi: 'Cường độ Glitch',
        type: 'slider',
        min: 0,
        max: 100,
        step: 10,
        default: 50
      }
    ]
  },
  {
    id: 'double-exposure',
    name: 'Double Exposure',
    nameVi: 'Phơi sáng kép',
    description: 'Blend two images with artistic overlay effect',
    descriptionVi: 'Kết hợp hai ảnh với hiệu ứng chồng nghệ thuật',
    icon: 'layers',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 12,
    inputType: 'image'
  },
  {
    id: 'hyper-realistic',
    name: 'Ultra Realism',
    nameVi: 'Siêu chi tiết',
    description: 'Enhance photos to hyper-realistic quality',
    descriptionVi: 'Nâng cao ảnh lên chất lượng siêu chi tiết',
    icon: 'search',
    creditCost: 4,
    tier: 'pro',
    estimatedTime: 20,
    inputType: 'image'
  },
  {
    id: 'van-gogh',
    name: 'Impressionist',
    nameVi: 'Ấn tượng',
    description: 'Apply impressionist painting style',
    descriptionVi: 'Áp dụng phong cách hội họa ấn tượng',
    icon: 'flower',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    nameVi: 'Màu nước',
    description: 'Transform image to watercolor painting style',
    descriptionVi: 'Chuyển đổi ảnh sang phong cách tranh màu nước',
    icon: 'droplets',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image'
  }
];

// ============================================
// STUDIO 5: Video Studio (AI Video Generation)
// ============================================
const videoTools: Tool[] = [
  {
    id: 'video-kitchen',
    name: 'Video Generator',
    nameVi: 'Tạo Video AI',
    description: 'AI-powered video creation from images',
    descriptionVi: 'Tạo video bằng AI từ hình ảnh',
    icon: 'video',
    creditCost: 5,
    tier: 'plus',
    estimatedTime: 30,
    inputType: 'both'
  },
  {
    id: 'dynamic-polaroid',
    name: 'Living Photo',
    nameVi: 'Ảnh sống động',
    description: 'Bring still photos to life with subtle motion',
    descriptionVi: 'Làm sống động ảnh tĩnh với chuyển động tinh tế',
    icon: 'aperture',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'instant-noodle-video',
    name: 'Quick Clip',
    nameVi: 'Video nhanh',
    description: 'Generate quick short-form videos (15s)',
    descriptionVi: 'Tạo video ngắn nhanh chóng (15 giây)',
    icon: 'timer',
    creditCost: 4,
    tier: 'plus',
    estimatedTime: 20,
    inputType: 'image'
  },
  {
    id: 'long-video-cooking',
    name: 'Extended Video',
    nameVi: 'Video dài',
    description: 'Create extended videos up to 60 seconds',
    descriptionVi: 'Tạo video dài lên đến 60 giây',
    icon: 'chef',
    creditCost: 8,
    tier: 'pro',
    estimatedTime: 60,
    inputType: 'both',
    options: [
      {
        id: 'duration',
        label: 'Duration',
        labelVi: 'Thời lượng',
        type: 'select',
        values: ['8s', '12s', '15s', '23s'],
        valuesVi: ['8 giây', '12 giây', '15 giây', '23 giây'],
        default: '8s'
      }
    ]
  }
];


// ============================================
// STUDIO 6: Pro Tools Studio (Advanced Editing)
// ============================================
const proTools: Tool[] = [
  {
    id: 'custom-recipe',
    name: 'Custom Prompt',
    nameVi: 'Prompt tùy chỉnh',
    description: 'Text prompt input for custom AI generation',
    descriptionVi: 'Nhập prompt văn bản để tạo AI tùy chỉnh',
    icon: 'file',
    creditCost: 4,
    tier: 'plus',
    estimatedTime: 20,
    inputType: 'image',
    options: [
      {
        id: 'prompt',
        label: 'Custom Prompt',
        labelVi: 'Prompt tùy chỉnh',
        type: 'text',
        default: ''
      }
    ]
  },
  {
    id: 'pose-copy',
    name: 'Pose Transfer',
    nameVi: 'Chuyển tư thế',
    description: 'Transfer pose from reference image to target',
    descriptionVi: 'Chuyển tư thế từ ảnh tham chiếu sang ảnh đích',
    icon: 'person',
    creditCost: 5,
    tier: 'pro',
    estimatedTime: 25,
    inputType: 'image'
  },
  {
    id: 'expression-copy',
    name: 'Face Expression',
    nameVi: 'Biểu cảm khuôn mặt',
    description: 'Transfer facial expression from reference to target',
    descriptionVi: 'Chuyển biểu cảm khuôn mặt từ ảnh tham chiếu sang đích',
    icon: 'smile',
    creditCost: 4,
    tier: 'pro',
    estimatedTime: 20,
    inputType: 'image'
  },
  {
    id: 'color-swap',
    name: 'Color Replace',
    nameVi: 'Thay đổi màu',
    description: 'Replace colors in specific regions of the image',
    descriptionVi: 'Thay đổi màu trong các vùng cụ thể của ảnh',
    icon: 'paintbrush',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 8,
    inputType: 'image'
  },
  {
    id: 'isolate-subject',
    name: 'Background Remove',
    nameVi: 'Xóa nền',
    description: 'Remove background and isolate main subject',
    descriptionVi: 'Xóa nền và tách đối tượng chính',
    icon: 'scissors',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 3,
    inputType: 'image'
  },
  {
    id: 'y2k-background',
    name: 'Retro Background',
    nameVi: 'Nền Retro',
    description: 'Generate retro aesthetic backgrounds (Y2K style)',
    descriptionVi: 'Tạo nền phong cách retro (kiểu Y2K)',
    icon: 'disc',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image',
    options: [
      {
        id: 'style',
        label: 'Retro Style',
        labelVi: 'Phong cách Retro',
        type: 'select',
        values: ['Cyber', 'Bubblegum', 'Chrome', 'Holographic'],
        valuesVi: ['Cyber', 'Kẹo cao su', 'Chrome', 'Holographic'],
        default: 'Cyber'
      }
    ]
  }
];


// ============================================
// STUDIOS CONFIGURATION
// ============================================
export const STATIONS: Station[] = [
  {
    id: 'smoothie',
    name: 'Enhancement Studio',
    nameVi: 'Studio Nâng cấp',
    icon: 'coffee',
    description: 'Image Quality & Beauty',
    descriptionVi: 'Chất lượng ảnh & Làm đẹp',
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    tools: enhancementTools
  },
  {
    id: 'cosplay',
    name: 'Illustration Studio',
    nameVi: 'Studio Minh họa',
    icon: 'drama',
    description: 'Anime & Digital Art',
    descriptionVi: 'Anime & Nghệ thuật số',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    tools: illustrationTools
  },
  {
    id: 'toy',
    name: '3D Studio',
    nameVi: 'Studio 3D',
    icon: 'bot',
    description: '3D Rendering & Models',
    descriptionVi: 'Render 3D & Mô hình',
    color: 'from-emerald-500 to-purple-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    tools: studio3DTools
  },
  {
    id: 'film-art',
    name: 'Artistic Studio',
    nameVi: 'Studio Nghệ thuật',
    icon: 'film',
    description: 'Film & Fine Art Effects',
    descriptionVi: 'Hiệu ứng phim & Mỹ thuật',
    color: 'from-pink-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    tools: artisticTools
  },
  {
    id: 'kitchen',
    name: 'Video Studio',
    nameVi: 'Studio Video',
    icon: 'chef',
    description: 'AI Video Generation',
    descriptionVi: 'Tạo Video AI',
    color: 'from-orange-500 to-pink-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    tools: videoTools
  },
  {
    id: 'self-service',
    name: 'Pro Tools',
    nameVi: 'Công cụ Pro',
    icon: 'cart',
    description: 'Advanced Editing',
    descriptionVi: 'Chỉnh sửa nâng cao',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    tools: proTools
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get station by ID
 */
export const getStationById = (stationId: string): Station | undefined => {
  return STATIONS.find(station => station.id === stationId);
};

/**
 * Get tool by ID across all stations
 */
export const getToolById = (toolId: string): { station: Station; tool: Tool } | undefined => {
  for (const station of STATIONS) {
    const tool = station.tools.find(t => t.id === toolId);
    if (tool) {
      return { station, tool };
    }
  }
  return undefined;
};

/**
 * Get all tools from all stations
 */
export const getAllTools = (): Tool[] => {
  return STATIONS.flatMap(station => station.tools);
};

/**
 * Get tools by tier
 */
export const getToolsByTier = (tier: 'free' | 'plus' | 'pro'): Tool[] => {
  return getAllTools().filter(tool => tool.tier === tier);
};

/**
 * Get total tool count
 */
export const getTotalToolCount = (): number => {
  return STATIONS.reduce((count, station) => count + station.tools.length, 0);
};


// ============================================
// ERROR MESSAGES
// ============================================
export const PROCESSING_ERRORS: Record<ProcessingErrorType, ProcessingError> = {
  upload_failed: {
    type: 'upload_failed',
    message: 'Failed to upload image. Please try again.',
    messageVi: 'Tải ảnh thất bại. Vui lòng thử lại.',
    retryable: true,
    refundCredits: false
  },
  processing_failed: {
    type: 'processing_failed',
    message: 'Processing failed. Your credits have been refunded.',
    messageVi: 'Xử lý thất bại. Credits đã được hoàn lại.',
    retryable: true,
    refundCredits: true
  },
  insufficient_credits: {
    type: 'insufficient_credits',
    message: 'Not enough credits. Upgrade to continue.',
    messageVi: 'Không đủ credits. Nâng cấp để tiếp tục.',
    retryable: false,
    refundCredits: false
  },
  file_too_large: {
    type: 'file_too_large',
    message: 'File size exceeds 10MB limit.',
    messageVi: 'Kích thước file vượt quá 10MB.',
    retryable: true,
    refundCredits: false
  },
  unsupported_format: {
    type: 'unsupported_format',
    message: 'Please upload JPG, PNG, or WebP images.',
    messageVi: 'Vui lòng tải ảnh JPG, PNG hoặc WebP.',
    retryable: true,
    refundCredits: false
  },
  timeout: {
    type: 'timeout',
    message: 'Processing timed out. Please try again.',
    messageVi: 'Xử lý quá thời gian. Vui lòng thử lại.',
    retryable: true,
    refundCredits: true
  },
  unknown: {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    messageVi: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
    retryable: true,
    refundCredits: true
  }
};

// ============================================
// SUPPORTED FILE FORMATS
// ============================================
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
