// AI Creative Stations Configuration Data
import { Station, Tool, ProcessingError, ProcessingErrorType } from '../types/stations';

// ============================================
// STATION 1: Smoothie Station (Beauty & Enhancement)
// ============================================
const smoothieTools: Tool[] = [
  {
    id: 'hd-enhance',
    name: 'HD Enhance',
    nameVi: 'Nâng cấp HD',
    description: 'Upscale image resolution by 2x-4x with AI sharpening',
    descriptionVi: 'Nâng cấp độ phân giải 2x-4x với AI làm nét',
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
    name: 'Makeup',
    nameVi: 'Trang điểm',
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
    name: 'To Photorealistic',
    nameVi: 'Siêu thực',
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
    name: 'Fashion Magazine',
    nameVi: 'Tạp chí thời trang',
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
// STATION 2: Cosplay Station (Anime & Art)
// ============================================
const cosplayTools: Tool[] = [
  {
    id: 'cosplay-character',
    name: 'Cosplay Character',
    nameVi: 'Nhân vật Cosplay',
    description: 'Transform photo into anime/cosplay character style',
    descriptionVi: 'Biến đổi ảnh thành phong cách nhân vật anime/cosplay',
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
    name: 'Minimalist Illustration',
    nameVi: 'Minh họa tối giản',
    description: 'Create clean minimalist illustration from photo',
    descriptionVi: 'Tạo minh họa tối giản từ ảnh',
    icon: 'pencil',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    nameVi: 'Pixel Art',
    description: 'Convert image to 8-bit pixel art style',
    descriptionVi: 'Chuyển đổi ảnh sang phong cách pixel 8-bit',
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
    name: 'Comic Book',
    nameVi: 'Truyện tranh',
    description: 'Apply Western comic book style with halftone dots',
    descriptionVi: 'Áp dụng phong cách truyện tranh phương Tây',
    icon: 'zap',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image'
  },
  {
    id: 'line-art',
    name: 'Line Art',
    nameVi: 'Nét vẽ',
    description: 'Extract clean line drawings from photos',
    descriptionVi: 'Trích xuất nét vẽ sạch từ ảnh',
    icon: 'pen',
    creditCost: 1,
    tier: 'free',
    estimatedTime: 6,
    inputType: 'image'
  },
  {
    id: 'ukiyo-e',
    name: 'Ukiyo-e',
    nameVi: 'Ukiyo-e',
    description: 'Transform to Japanese woodblock print style',
    descriptionVi: 'Chuyển đổi sang phong cách tranh khắc gỗ Nhật Bản',
    icon: 'map',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 12,
    inputType: 'image'
  }
];

// ============================================
// STATION 3: Toy Station (3D & Models)
// ============================================
const toyTools: Tool[] = [
  {
    id: '3d-figurine',
    name: '3D Figurine',
    nameVi: 'Mô hình 3D',
    description: 'Create 3D figurine style from portrait',
    descriptionVi: 'Tạo phong cách mô hình 3D từ ảnh chân dung',
    icon: 'box',
    creditCost: 4,
    tier: 'plus',
    estimatedTime: 20,
    inputType: 'image'
  },
  {
    id: 'funko-pop',
    name: 'Funko Pop',
    nameVi: 'Funko Pop',
    description: 'Transform portrait into Funko Pop vinyl figure style',
    descriptionVi: 'Biến đổi chân dung thành phong cách Funko Pop',
    icon: 'toy',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'lego-minifig',
    name: 'Lego Minifig',
    nameVi: 'Lego Minifig',
    description: 'Convert image to Lego minifigure style',
    descriptionVi: 'Chuyển đổi ảnh sang phong cách Lego',
    icon: 'blocks',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 12,
    inputType: 'image'
  },
  {
    id: 'plushie-toy',
    name: 'Plushie Toy',
    nameVi: 'Thú nhồi bông',
    description: 'Transform subject into plush toy style',
    descriptionVi: 'Biến đổi đối tượng thành phong cách thú nhồi bông',
    icon: 'cat',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'claymation',
    name: 'Claymation',
    nameVi: 'Claymation',
    description: 'Apply clay animation style to images',
    descriptionVi: 'Áp dụng phong cách hoạt hình đất sét',
    icon: 'clapperboard',
    creditCost: 3,
    tier: 'plus',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'product-render',
    name: 'Product Render',
    nameVi: 'Render sản phẩm',
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
    name: 'Architecture Model',
    nameVi: 'Mô hình kiến trúc',
    description: 'Create architectural model/miniature style rendering',
    descriptionVi: 'Tạo phong cách mô hình kiến trúc thu nhỏ',
    icon: 'building',
    creditCost: 4,
    tier: 'pro',
    estimatedTime: 20,
    inputType: 'image'
  }
];

// ============================================
// STATION 4: Film & Art Station
// ============================================
const filmArtTools: Tool[] = [
  {
    id: 'party-polaroid',
    name: 'Party Polaroid',
    nameVi: 'Polaroid tiệc tùng',
    description: 'Apply instant camera effect with party atmosphere',
    descriptionVi: 'Áp dụng hiệu ứng máy ảnh lấy liền với không khí tiệc tùng',
    icon: 'image',
    creditCost: 1,
    tier: 'free',
    estimatedTime: 5,
    inputType: 'image'
  },
  {
    id: 'vintage-photo',
    name: 'Vintage Photo',
    nameVi: 'Ảnh cổ điển',
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
    name: 'Glitch Art',
    nameVi: 'Nghệ thuật Glitch',
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
    name: 'Hyper-realistic',
    nameVi: 'Siêu thực',
    description: 'Enhance photos to hyper-realistic quality',
    descriptionVi: 'Nâng cao ảnh lên chất lượng siêu thực',
    icon: 'search',
    creditCost: 4,
    tier: 'pro',
    estimatedTime: 20,
    inputType: 'image'
  },
  {
    id: 'van-gogh',
    name: 'Van Gogh',
    nameVi: 'Van Gogh',
    description: 'Apply impressionist painting style like Van Gogh',
    descriptionVi: 'Áp dụng phong cách hội họa ấn tượng như Van Gogh',
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
// STATION 5: Kitchen Station (Video)
// ============================================
const kitchenTools: Tool[] = [
  {
    id: 'video-kitchen',
    name: 'Video Kitchen',
    nameVi: 'Bếp Video',
    description: 'General video creation interface',
    descriptionVi: 'Giao diện tạo video tổng hợp',
    icon: 'video',
    creditCost: 5,
    tier: 'plus',
    estimatedTime: 30,
    inputType: 'both'
  },
  {
    id: 'dynamic-polaroid',
    name: 'Dynamic Polaroid',
    nameVi: 'Polaroid động',
    description: 'Bring the polaroid memory to life.',
    descriptionVi: 'Mang ký ức polaroid trở nên sống động.',
    icon: 'aperture',
    creditCost: 3,
    tier: 'free',
    estimatedTime: 15,
    inputType: 'image'
  },
  {
    id: 'instant-noodle-video',
    name: 'Instant Noodle Video',
    nameVi: 'Video mì ăn liền',
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
    name: 'Long Video Cooking',
    nameVi: 'Nấu video dài',
    description: 'Support video creation up to 60 seconds',
    descriptionVi: 'Hỗ trợ tạo video lên đến 60 giây',
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
// STATION 6: Self-Service Station (Tools)
// ============================================
const selfServiceTools: Tool[] = [
  {
    id: 'custom-recipe',
    name: 'Custom Recipe',
    nameVi: 'Công thức tùy chỉnh',
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
    name: 'Pose Copy',
    nameVi: 'Sao chép tư thế',
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
    name: 'Expression Copy',
    nameVi: 'Sao chép biểu cảm',
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
    name: 'Color Swap',
    nameVi: 'Đổi màu',
    description: 'Swap colors in specific regions of the image',
    descriptionVi: 'Đổi màu trong các vùng cụ thể của ảnh',
    icon: 'paintbrush',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 8,
    inputType: 'image'
  },
  {
    id: 'isolate-subject',
    name: 'Isolate Subject',
    nameVi: 'Tách đối tượng',
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
    name: 'Y2K Background',
    nameVi: 'Nền Y2K',
    description: 'Generate Y2K aesthetic backgrounds (2000s style)',
    descriptionVi: 'Tạo nền phong cách Y2K (thập niên 2000)',
    icon: 'disc',
    creditCost: 2,
    tier: 'free',
    estimatedTime: 10,
    inputType: 'image',
    options: [
      {
        id: 'style',
        label: 'Y2K Style',
        labelVi: 'Phong cách Y2K',
        type: 'select',
        values: ['Cyber', 'Bubblegum', 'Chrome', 'Holographic'],
        valuesVi: ['Cyber', 'Kẹo cao su', 'Chrome', 'Holographic'],
        default: 'Cyber'
      }
    ]
  }
];


// ============================================
// STATIONS CONFIGURATION
// ============================================
export const STATIONS: Station[] = [
  {
    id: 'smoothie',
    name: 'Smoothie Station',
    nameVi: 'Quầy Smoothie',
    icon: 'coffee',
    description: 'Beauty & Enhancement',
    descriptionVi: 'Làm đẹp & Nâng cấp',
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    tools: smoothieTools
  },
  {
    id: 'cosplay',
    name: 'Cosplay Station',
    nameVi: 'Quầy Cosplay',
    icon: 'drama',
    description: 'Anime & Art',
    descriptionVi: 'Anime & Nghệ thuật',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    tools: cosplayTools
  },
  {
    id: 'toy',
    name: 'Toy Station',
    nameVi: 'Quầy Đồ chơi',
    icon: 'bot',
    description: '3D & Models',
    descriptionVi: '3D & Mô hình',
    color: 'from-emerald-500 to-purple-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    tools: toyTools
  },
  {
    id: 'film-art',
    name: 'Film & Art Station',
    nameVi: 'Phim & Nghệ thuật',
    icon: 'film',
    description: 'Cinematic & Artistic',
    descriptionVi: 'Điện ảnh & Nghệ thuật',
    color: 'from-pink-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    tools: filmArtTools
  },
  {
    id: 'kitchen',
    name: 'Kitchen Station',
    nameVi: 'Nhà bếp',
    icon: 'chef',
    description: 'Video Kitchen',
    descriptionVi: 'Bếp Video',
    color: 'from-orange-500 to-pink-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    tools: kitchenTools
  },
  {
    id: 'self-service',
    name: 'Self-Service Station',
    nameVi: 'Tự phục vụ',
    icon: 'cart',
    description: 'Custom Tools',
    descriptionVi: 'Công cụ tùy chỉnh',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    tools: selfServiceTools
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
