import React, { useState, useRef } from 'react';
import {
  Upload, X, Check, Sparkles, ShoppingBag, User, Video,
  Camera, Package, ChevronRight, Download, ArrowLeft, Crown, Loader2,
  Play, Eye, Grid3X3, LayoutGrid, Zap, Star, TrendingUp, Minus, Plus, Lock,
  FileImage, FileArchive, ChevronDown, Wand2, RefreshCw
} from 'lucide-react';
import { Button, Badge, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { AssetPickerModal } from '../Editor/AssetPickerModal';
import { RecreateView } from '../Marketplace/RecreateView';

// Image count limits by tier
const IMAGE_LIMITS = {
  free: { min: 3, max: 6, default: 4 },
  plus: { min: 3, max: 12, default: 8 },
  pro: { min: 3, max: 20, default: 12 }
};

type StyleCategory = 'ecommerce' | 'personal' | 'social' | 'professional';
type PlatformType = 'amazon' | 'shopee' | 'alibaba' | 'instagram' | 'tiktok' | 'linkedin' | 'portrait' | 'headshot';

// Demo data với ảnh thực tế - 1 ảnh gốc -> bộ ảnh output (số lượng khác nhau: 3, 5, 7, 9, 11, 15)
const demoSets = {
  // 3 ảnh - Headphones (đơn giản, nhanh)
  headphones: {
    original: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    title: 'Headphones',
    category: 'ecommerce',
    outputs: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=500&fit=crop',
    ]
  },
  // 5 ảnh - Watch (cơ bản)
  watch: {
    original: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    title: 'Smart Watch',
    category: 'ecommerce',
    outputs: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=500&fit=crop',
    ]
  },
  // 7 ảnh - Sneaker (tiêu chuẩn)
  sneaker: {
    original: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    title: 'Nike Sneaker',
    category: 'ecommerce',
    outputs: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=500&fit=crop',
    ]
  },
  // 9 ảnh - Portrait (chuyên nghiệp)
  portrait: {
    original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    title: 'Business Portrait',
    category: 'personal',
    outputs: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    ]
  },
  // 11 ảnh - Fashion (đa dạng)
  fashion: {
    original: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    title: 'Fashion Model',
    category: 'social',
    outputs: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1485968579169-a6b287a9c663?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=500&fit=crop',
    ]
  },
  // 15 ảnh - Cosmetics (đầy đủ nhất)
  cosmetics: {
    original: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    title: 'Cosmetics Pro',
    category: 'ecommerce',
    outputs: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583241475880-083f84372725?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1599733589046-10c7c1b4d7e8?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400&h=500&fit=crop',
    ]
  }
};

export interface SmartPhotoshootViewProps {
  onNavigateToEditor?: (imageUrl: string) => void;
}

export const SmartPhotoshootView: React.FC<SmartPhotoshootViewProps> = ({ onNavigateToEditor }) => {
  const { language } = useLanguage();
  const { currentPlan } = useSubscription();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedOutputs, setSelectedOutputs] = useState<number[]>([]);
  const [activeDemo, setActiveDemo] = useState<keyof typeof demoSets | null>(null);
  const [viewingDemo, setViewingDemo] = useState<keyof typeof demoSets | null>(null); // For preview only
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showRecreateModal, setShowRecreateModal] = useState(false);
  const [selectedImageForRecreate, setSelectedImageForRecreate] = useState<{ src: string; index: number; prompt: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get tier limits based on subscription plan
  const tierKey = currentPlan === 'pro' ? 'pro' : currentPlan === 'plus' ? 'plus' : 'free';
  const limits = IMAGE_LIMITS[tierKey];
  const [imageCount, setImageCount] = useState(limits.default);

  const categories = [
    {
      id: 'ecommerce' as StyleCategory,
      icon: ShoppingBag,
      label: language === 'vi' ? 'Thương mại điện tử' : 'E-Commerce',
      desc: language === 'vi' ? 'Amazon, Shopee, Alibaba, Lazada' : 'Amazon, Shopee, Alibaba, Lazada',
      color: 'from-blue-500 to-cyan-500',
      platforms: ['amazon', 'shopee', 'alibaba']
    },
    {
      id: 'personal' as StyleCategory,
      icon: User,
      label: language === 'vi' ? 'Chân dung cá nhân' : 'Personal Portrait',
      desc: language === 'vi' ? 'Ảnh profile, headshot chuyên nghiệp' : 'Profile photos, professional headshots',
      color: 'from-purple-500 to-pink-500',
      platforms: ['portrait', 'headshot']
    },
    {
      id: 'social' as StyleCategory,
      icon: Video,
      label: language === 'vi' ? 'Mạng xã hội' : 'Social Media',
      desc: language === 'vi' ? 'Instagram, TikTok, Facebook' : 'Instagram, TikTok, Facebook',
      color: 'from-pink-500 to-rose-500',
      platforms: ['instagram', 'tiktok']
    },
    {
      id: 'professional' as StyleCategory,
      icon: Camera,
      label: language === 'vi' ? 'Doanh nghiệp' : 'Business',
      desc: language === 'vi' ? 'LinkedIn, Website công ty' : 'LinkedIn, Company website',
      color: 'from-slate-600 to-zinc-700',
      platforms: ['linkedin']
    }
  ];

  const platforms: Record<StyleCategory, { id: PlatformType; label: string; icon: React.ElementType; outputs: number; tier: string; desc: string }[]> = {
    ecommerce: [
      { id: 'amazon', label: 'Amazon', icon: Package, outputs: 12, tier: 'free', desc: language === 'vi' ? '7 góc chụp + 5 lifestyle' : '7 angles + 5 lifestyle shots' },
      { id: 'shopee', label: 'Shopee', icon: ShoppingBag, outputs: 10, tier: 'free', desc: language === 'vi' ? '5 góc + 5 background' : '5 angles + 5 backgrounds' },
      { id: 'alibaba', label: 'Alibaba B2B', icon: Package, outputs: 15, tier: 'plus', desc: language === 'vi' ? 'Bộ ảnh chuyên nghiệp đầy đủ' : 'Complete professional set' },
    ],
    personal: [
      { id: 'portrait', label: language === 'vi' ? 'Chân dung' : 'Portrait', icon: User, outputs: 8, tier: 'free', desc: language === 'vi' ? '4 góc + 4 background' : '4 angles + 4 backgrounds' },
      { id: 'headshot', label: 'Headshot Pro', icon: Camera, outputs: 12, tier: 'plus', desc: language === 'vi' ? 'Ảnh CV, LinkedIn chuyên nghiệp' : 'CV, LinkedIn professional photos' },
    ],
    social: [
      { id: 'instagram', label: 'Instagram', icon: Camera, outputs: 9, tier: 'free', desc: language === 'vi' ? '3 feed + 3 story + 3 reel' : '3 feed + 3 story + 3 reel covers' },
      { id: 'tiktok', label: 'TikTok', icon: Video, outputs: 12, tier: 'plus', desc: language === 'vi' ? 'Thumbnail + cover đa dạng' : 'Diverse thumbnails & covers' },
    ],
    professional: [
      { id: 'linkedin', label: 'LinkedIn', icon: User, outputs: 6, tier: 'free', desc: language === 'vi' ? 'Profile + banner + bài đăng' : 'Profile + banner + post images' },
    ]
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage({ file, preview: URL.createObjectURL(file) });
      setStep(2);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setStep(4);
    
    setTimeout(() => {
      // Use imageCount from user selection
      const count = imageCount;
      
      // Extended mock images pool for generating up to 20 images
      const allMockImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop',
      ];
      
      // Generate exactly the number of images user selected
      const mockImages = allMockImages.slice(0, count);
      setGeneratedImages(mockImages);
      setIsGenerating(false);
    }, 3000);
  };

  const toggleImageSelection = (index: number) => {
    setSelectedOutputs(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleReset = () => {
    setStep(1);
    setUploadedImage(null);
    setSelectedCategory(null);
    setSelectedPlatform(null);
    setGeneratedImages([]);
    setSelectedOutputs([]);
  };

  const handleUseDemo = (demoKey: keyof typeof demoSets) => {
    setActiveDemo(demoKey);
    setUploadedImage({ 
      file: new File([], demoSets[demoKey].title), 
      preview: demoSets[demoKey].original 
    });
    setStep(2);
  };

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 2xl:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/30">
              <Camera size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Bộ Ảnh Thông Minh' : 'Smart Photoshoot'}
              </h1>
              <p className="text-zinc-500 mt-1">
                {language === 'vi' ? 'Tạo bộ ảnh chuyên nghiệp cho mọi nền tảng' : 'Create professional photo sets for any platform'}
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-full px-4 py-2 shadow-sm">
            {['Upload', 'Category', 'Platform', 'Result'].map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-green-500 text-white' :
                  step === i + 1 ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 
                  'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
                }`}>
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </div>
                {i < 3 && <div className={`w-6 h-0.5 mx-1 ${step > i + 1 ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8">
          
          {/* Left: Upload / Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Camera size={18} className="text-purple-500" />
                {language === 'vi' ? 'Ảnh gốc' : 'Original Image'}
              </h3>
              
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage.preview} 
                    alt="Uploaded" 
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  
                  {activeDemo && (
                    <div className="absolute bottom-2 left-2 px-3 py-1.5 rounded-full bg-purple-500 text-white text-xs font-bold">
                      Demo: {demoSets[activeDemo].title}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Upload from device */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-purple-500 transition-all bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={22} className="text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {language === 'vi' ? 'Tải ảnh lên' : 'Upload Image'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">PNG, JPG (max 10MB)</p>
                    </div>
                  </button>

                  {/* Choose from Assets */}
                  <button
                    onClick={() => setShowAssetPicker(true)}
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                      <Package size={18} className="text-zinc-500 group-hover:text-purple-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">
                        {language === 'vi' ? 'Chọn từ Assets' : 'Choose from Assets'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {language === 'vi' ? 'Thư viện ảnh của bạn' : 'Your image library'}
                      </p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-zinc-400 group-hover:text-purple-500" />
                  </button>
                </div>
              )}
              
              {/* Quick stats */}
              {selectedPlatform && (
                <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      {language === 'vi' ? 'Sẽ tạo' : 'Will generate'}
                    </span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {imageCount} {language === 'vi' ? 'ảnh' : 'images'}
                    </span>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!uploadedImage}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Sparkles size={16} className="mr-2" />
                    {language === 'vi' ? 'Tạo bộ ảnh' : 'Generate Set'}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right: Steps / Results */}
          <div className="lg:col-span-2">
            
            {/* Step 2: Select Category */}
            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {language === 'vi' ? 'Chọn mục đích sử dụng' : 'Select Purpose'}
                </h3>
                <p className="text-zinc-500 mb-6">
                  {language === 'vi' ? 'Bộ ảnh sẽ được tối ưu cho nền tảng bạn chọn' : 'Photos will be optimized for your selected platform'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setStep(3); }}
                      className={`p-5 rounded-2xl border-2 transition-all text-left group hover:shadow-lg ${
                        selectedCategory === cat.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color}`}>
                          <cat.icon size={22} className="text-white" />
                        </div>
                        <ChevronRight size={18} className="text-zinc-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{cat.label}</h4>
                      <p className="text-sm text-zinc-500">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select Platform */}
            {step === 3 && selectedCategory && (
              <div>
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-zinc-500 hover:text-purple-500 mb-4">
                  <ArrowLeft size={18} /> {language === 'vi' ? 'Quay lại' : 'Back'}
                </button>
                
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {language === 'vi' ? 'Chọn nền tảng cụ thể' : 'Select Specific Platform'}
                </h3>
                <p className="text-zinc-500 mb-6">
                  {language === 'vi' ? 'Mỗi nền tảng có yêu cầu ảnh khác nhau' : 'Each platform has different image requirements'}
                </p>

                <div className="space-y-3">
                  {platforms[selectedCategory].map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                        selectedPlatform === platform.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <platform.icon size={24} className="text-purple-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-zinc-900 dark:text-white">{platform.label}</h4>
                          {platform.tier === 'plus' && (
                            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-[10px]">
                              <Crown size={8} className="mr-1" /> PLUS
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500">{platform.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Image Count Selector */}
                {selectedPlatform && (
                  <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Grid3X3 size={18} className="text-purple-500" />
                          {language === 'vi' ? 'Số lượng ảnh' : 'Number of Images'}
                        </h4>
                        <p className="text-sm text-zinc-500 mt-0.5">
                          {language === 'vi' 
                            ? `Gói ${tierKey.toUpperCase()}: ${limits.min}-${limits.max} ảnh` 
                            : `${tierKey.toUpperCase()} plan: ${limits.min}-${limits.max} images`}
                        </p>
                      </div>
                      
                      {/* Counter */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setImageCount(prev => Math.max(limits.min, prev - 1))}
                          disabled={imageCount <= limits.min}
                          className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus size={18} className="text-zinc-600 dark:text-zinc-400" />
                        </button>
                        
                        <div className="w-20 text-center">
                          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{imageCount}</span>
                          <p className="text-[10px] text-zinc-500 -mt-1">{language === 'vi' ? 'ảnh' : 'images'}</p>
                        </div>
                        
                        <button
                          onClick={() => setImageCount(prev => Math.min(limits.max, prev + 1))}
                          disabled={imageCount >= limits.max}
                          className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus size={18} className="text-zinc-600 dark:text-zinc-400" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Select Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {[3, 5, 8, 12, 15, 20].map((num) => {
                        const isLocked = num > limits.max;
                        const isActive = imageCount === num;
                        return (
                          <button
                            key={num}
                            onClick={() => !isLocked && setImageCount(num)}
                            disabled={isLocked}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                              isActive
                                ? 'bg-purple-500 text-white'
                                : isLocked
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            {isLocked && <Lock size={10} />}
                            {num}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Upgrade hint */}
                    {tierKey !== 'pro' && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                        <Crown size={12} />
                        <span>
                          {language === 'vi' 
                            ? `Nâng cấp lên ${tierKey === 'free' ? 'PLUS' : 'PRO'} để tạo tới ${tierKey === 'free' ? '12' : '20'} ảnh`
                            : `Upgrade to ${tierKey === 'free' ? 'PLUS' : 'PRO'} for up to ${tierKey === 'free' ? '12' : '20'} images`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}


            {/* Step 4: Results */}
            {step === 4 && (
              <div>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <Loader2 size={56} className="text-purple-500 animate-spin" />
                      <Sparkles size={20} className="text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-6 mb-2">
                      {language === 'vi' ? 'AI đang tạo bộ ảnh...' : 'AI is generating your photo set...'}
                    </h3>
                    <p className="text-zinc-500">
                      {language === 'vi' ? 'Quá trình này mất khoảng 10-30 giây' : 'This takes about 10-30 seconds'}
                    </p>
                    
                    {/* Progress animation */}
                    <div className="w-64 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-6 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <Check size={20} className="text-green-500" />
                          {language === 'vi' ? 'Bộ ảnh hoàn thành!' : 'Photo Set Complete!'}
                        </h3>
                        <p className="text-zinc-500">
                          {generatedImages.length} {language === 'vi' ? 'ảnh đã tạo' : 'images generated'}
                          {selectedOutputs.length > 0 && ` • ${selectedOutputs.length} ${language === 'vi' ? 'đã chọn' : 'selected'}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleReset}>
                          <Zap size={16} className="mr-2" />
                          {language === 'vi' ? 'Tạo mới' : 'New Set'}
                        </Button>
                        
                        {/* Regenerate Button - Only show when 1 image selected */}
                        {selectedOutputs.length === 1 && (
                          <Button 
                            variant="outline"
                            onClick={() => {
                              console.log('Regenerate clicked', selectedOutputs[0], generatedImages[selectedOutputs[0]]);
                              const img = generatedImages[selectedOutputs[0]];
                              if (img) {
                                setSelectedImageForRecreate({ 
                                  src: img, 
                                  index: selectedOutputs[0],
                                  prompt: `Generated image ${selectedOutputs[0] + 1} from Smart Photoshoot`
                                });
                                setShowRecreateModal(true);
                              }
                            }}
                            className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
                          >
                            <Wand2 size={16} className="mr-2" />
                            {language === 'vi' ? 'Tạo lại' : 'Regenerate'}
                          </Button>
                        )}
                        
                        {/* Export Button with dropdown */}
                        <div className="relative group">
                          <Button
                            disabled={selectedOutputs.length === 0}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 pr-3"
                          >
                            <Download size={16} className="mr-2" />
                            {language === 'vi' ? 'Xuất' : 'Export'} 
                            {selectedOutputs.length > 0 ? ` (${selectedOutputs.length})` : ''}
                            <ChevronDown size={14} className="ml-2" />
                          </Button>
                          
                          {/* Dropdown Menu */}
                          {selectedOutputs.length > 0 && (
                            <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                              {selectedOutputs.length === 1 ? (
                                <>
                                  {/* Single image export options */}
                                  <button
                                    onClick={() => {
                                      const img = generatedImages[selectedOutputs[0]];
                                      const link = document.createElement('a');
                                      link.href = img;
                                      link.download = `repix-photo-${Date.now()}.jpg`;
                                      link.click();
                                    }}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                                  >
                                    <FileImage size={18} className="text-blue-500" />
                                    <div>
                                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                        {language === 'vi' ? 'Xuất JPG' : 'Export as JPG'}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        {language === 'vi' ? 'Ảnh chất lượng cao' : 'High quality image'}
                                      </p>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const img = generatedImages[selectedOutputs[0]];
                                      const link = document.createElement('a');
                                      link.href = img.replace('.jpg', '.png');
                                      link.download = `repix-photo-${Date.now()}.png`;
                                      link.click();
                                    }}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                                  >
                                    <FileImage size={18} className="text-green-500" />
                                    <div>
                                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                        {language === 'vi' ? 'Xuất PNG' : 'Export as PNG'}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        {language === 'vi' ? 'Hỗ trợ nền trong suốt' : 'Supports transparency'}
                                      </p>
                                    </div>
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* Multiple images export options */}
                                  <button
                                    onClick={() => {
                                      // Simulate ZIP download
                                      console.log('Exporting ZIP with images:', selectedOutputs.map(i => generatedImages[i]));
                                      alert(language === 'vi' 
                                        ? `Đang tải ${selectedOutputs.length} ảnh dưới dạng ZIP...` 
                                        : `Downloading ${selectedOutputs.length} images as ZIP...`);
                                    }}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                                  >
                                    <FileArchive size={18} className="text-purple-500" />
                                    <div>
                                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                        {language === 'vi' ? 'Xuất ZIP (JPG)' : 'Export as ZIP (JPG)'}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        {selectedOutputs.length} {language === 'vi' ? 'ảnh trong 1 file' : 'images in one file'}
                                      </p>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Exporting ZIP PNG with images:', selectedOutputs.map(i => generatedImages[i]));
                                      alert(language === 'vi' 
                                        ? `Đang tải ${selectedOutputs.length} ảnh PNG dưới dạng ZIP...` 
                                        : `Downloading ${selectedOutputs.length} PNG images as ZIP...`);
                                    }}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                                  >
                                    <FileArchive size={18} className="text-green-500" />
                                    <div>
                                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                        {language === 'vi' ? 'Xuất ZIP (PNG)' : 'Export as ZIP (PNG)'}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        {language === 'vi' ? 'Hỗ trợ nền trong suốt' : 'Supports transparency'}
                                      </p>
                                    </div>
                                  </button>
                                  <div className="border-t border-zinc-200 dark:border-zinc-700 my-2" />
                                  <button
                                    onClick={() => {
                                      // Download each image separately
                                      selectedOutputs.forEach((idx, i) => {
                                        setTimeout(() => {
                                          const link = document.createElement('a');
                                          link.href = generatedImages[idx];
                                          link.download = `repix-photo-${i + 1}-${Date.now()}.jpg`;
                                          link.click();
                                        }, i * 500);
                                      });
                                    }}
                                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left"
                                  >
                                    <Download size={18} className="text-zinc-500" />
                                    <div>
                                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                        {language === 'vi' ? 'Tải từng ảnh' : 'Download separately'}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        {language === 'vi' ? 'Tải riêng từng file' : 'Download each file'}
                                      </p>
                                    </div>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {generatedImages.map((img, index) => (
                        <div
                          key={index}
                          className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all group ${
                            selectedOutputs.includes(index)
                              ? 'border-purple-500 ring-4 ring-purple-500/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Generated ${index + 1}`} 
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => toggleImageSelection(index)}
                          />
                          
                          {/* Selection overlay */}
                          <div 
                            className={`absolute inset-0 transition-all pointer-events-none ${
                              selectedOutputs.includes(index) ? 'bg-purple-500/20' : 'bg-black/0 group-hover:bg-black/20'
                            }`}
                          />
                          
                          {/* Top right - Selection checkbox */}
                          <button
                            onClick={() => toggleImageSelection(index)}
                            className="absolute top-3 right-3 z-10"
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              selectedOutputs.includes(index)
                                ? 'bg-purple-500 text-white scale-110'
                                : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-400 group-hover:scale-110'
                            }`}>
                              {selectedOutputs.includes(index) ? <Check size={16} /> : <span className="text-xs font-bold">{index + 1}</span>}
                            </div>
                          </button>

                          {/* Top left - Regenerate button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageForRecreate({ 
                                src: img, 
                                index: index,
                                prompt: `Generated image ${index + 1} from Smart Photoshoot`
                              });
                              setShowRecreateModal(true);
                            }}
                            className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-white opacity-0 group-hover:opacity-100 transition-all"
                            title={language === 'vi' ? 'Tạo lại' : 'Regenerate'}
                          >
                            <RefreshCw size={14} />
                          </button>

                          {/* Label */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                            <p className="text-white text-sm font-medium">
                              {index === 0 ? (language === 'vi' ? 'Góc chính' : 'Main angle') :
                               index === 1 ? (language === 'vi' ? 'Góc bên' : 'Side view') :
                               index === 2 ? (language === 'vi' ? 'Lifestyle' : 'Lifestyle') :
                               index === 3 ? (language === 'vi' ? 'Chi tiết' : 'Detail') :
                               index === 4 ? (language === 'vi' ? 'Bối cảnh' : 'Context') :
                               `Variation ${index + 1}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                        <Star size={16} className="shrink-0 mt-0.5" />
                        <span>
                          {language === 'vi' 
                            ? 'Tip: Click vào ảnh để chọn, sau đó nhấn "Xuất" để tải về. Chọn 1 ảnh sẽ xuất file ảnh, chọn nhiều ảnh sẽ xuất file ZIP.'
                            : 'Tip: Click on images to select them, then click "Export". Single image exports as image file, multiple images export as ZIP.'}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Welcome / Instructions */}
            {step === 1 && (
              <div>
                <Card className="p-6 mb-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-500" />
                    {language === 'vi' ? 'Cách hoạt động' : 'How it works'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { step: 1, title: language === 'vi' ? 'Tải ảnh lên' : 'Upload Image', desc: language === 'vi' ? 'Chọn 1 ảnh sản phẩm hoặc chân dung' : 'Select 1 product or portrait photo' },
                      { step: 2, title: language === 'vi' ? 'Chọn nền tảng' : 'Select Platform', desc: language === 'vi' ? 'Amazon, Shopee, Instagram...' : 'Amazon, Shopee, Instagram...' },
                      { step: 3, title: language === 'vi' ? 'Nhận bộ ảnh' : 'Get Photo Set', desc: language === 'vi' ? '6-15 ảnh đa góc độ, đa bối cảnh' : '6-15 multi-angle, multi-context photos' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-zinc-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-4 gap-4">
                  {[
                    { icon: Grid3X3, label: language === 'vi' ? 'Đa góc chụp' : 'Multi-angle', color: 'text-blue-500' },
                    { icon: LayoutGrid, label: language === 'vi' ? 'Đa bối cảnh' : 'Multi-context', color: 'text-green-500' },
                    { icon: Zap, label: language === 'vi' ? 'Siêu nhanh' : 'Super fast', color: 'text-amber-500' },
                    { icon: Star, label: language === 'vi' ? 'Chất lượng cao' : 'High quality', color: 'text-purple-500' },
                  ].map((feat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
                      <feat.icon size={24} className={`mx-auto mb-2 ${feat.color}`} />
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Try Examples Section - Professional Masonry */}
        {step === 1 && (
          <div className="mt-10 pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Thử với ví dụ' : 'Try with examples'}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {language === 'vi' ? 'Click để xem kết quả AI tạo ra' : 'Click to see AI-generated results'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {language === 'vi' ? 'Kết quả thực tế' : 'Real results'}
              </div>
            </div>
            
            <div className="relative pb-12">
              {/* Professional Masonry Grid */}
              <div className="grid grid-cols-4 gap-4">
                {/* Column 1 - Tall + Short */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setViewingDemo('headphones')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[300px]"
                  >
                    <img src={demoSets.headphones.original} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">{demoSets.headphones.title}</p>
                      <p className="text-white/70 text-xs mt-1">{demoSets.headphones.outputs.length} variations</p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                      <Play size={16} className="text-white ml-0.5" />
                    </div>
                  </button>
                  <button
                    onClick={() => setViewingDemo('portrait')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[180px]"
                  >
                    <img src={demoSets.portrait.original} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">{demoSets.portrait.title}</p>
                      <p className="text-white/70 text-xs mt-1">{demoSets.portrait.outputs.length} variations</p>
                    </div>
                  </button>
                </div>

                {/* Column 2 - Short + Tall */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setViewingDemo('watch')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[160px]"
                  >
                    <img src={demoSets.watch.original} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">{demoSets.watch.title}</p>
                      <p className="text-white/70 text-xs mt-1">{demoSets.watch.outputs.length} variations</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewingDemo('fashion')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[220px]"
                  >
                    <img src={demoSets.fashion.original} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">{demoSets.fashion.title}</p>
                      <p className="text-white/70 text-xs mt-1">{demoSets.fashion.outputs.length} variations</p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                      <Play size={16} className="text-white ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Column 3 - Full Height */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setViewingDemo('sneaker')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[396px]"
                  >
                    <img src={demoSets.sneaker.original} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">{demoSets.sneaker.title}</p>
                      <p className="text-white/70 text-xs mt-1">{demoSets.sneaker.outputs.length} variations</p>
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                      Popular
                    </div>
                  </button>
                </div>

                {/* Column 4 - Medium + Medium */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setViewingDemo('cosmetics')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[200px]"
                  >
                    <img src={demoSets.cosmetics.original} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">{demoSets.cosmetics.title}</p>
                      <p className="text-white/70 text-xs mt-1">{demoSets.cosmetics.outputs.length} variations</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewingDemo('watch')}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-[180px]"
                  >
                    <img src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-sm">Landscape</p>
                      <p className="text-white/70 text-xs mt-1">8 variations</p>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Show More Button - Centered */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 rounded-full shadow-xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700 hover:scale-105">
                  <Plus size={18} />
                  {language === 'vi' ? 'Xem thêm' : 'Show more'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Preview Modal - Professional Design */}
      {viewingDemo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setViewingDemo(null)}
        >
          <div 
            className="bg-zinc-950 rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{demoSets[viewingDemo].title}</h2>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">1 INPUT</span>
                    <ChevronRight size={12} />
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">{demoSets[viewingDemo].outputs.length} OUTPUT</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingDemo(null)}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
              <div className="flex gap-6">
                {/* Left: Original Image */}
                <div className="w-56 shrink-0">
                  <div className="sticky top-0">
                    <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img 
                        src={demoSets[viewingDemo].original} 
                        alt="Original" 
                        className="w-full aspect-square object-cover"
                      />
                      {/* Glow effect */}
                      <div className="absolute inset-0 ring-2 ring-purple-500/50 rounded-2xl pointer-events-none" />
                      <div className="absolute -inset-1 bg-purple-500/20 blur-xl -z-10" />
                      
                      {/* Label */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1.5 rounded-full bg-purple-500 text-white text-xs font-bold shadow-lg">
                            INPUT
                          </span>
                          <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                            1:1
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex justify-center my-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-xs font-medium text-purple-300">AI Magic</span>
                        <ChevronRight size={14} className="text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Output Grid */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                      <Grid3X3 size={14} />
                      {language === 'vi' ? 'Bộ ảnh được tạo' : 'Generated Photo Set'}
                    </h3>
                    <span className="text-xs text-zinc-500">
                      {demoSets[viewingDemo].outputs.length} {language === 'vi' ? 'biến thể' : 'variations'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {demoSets[viewingDemo].outputs.map((img, index) => {
                      const labels = [
                        { en: 'Hero Shot', vi: 'Ảnh chính' },
                        { en: 'Side Angle', vi: 'Góc nghiêng' },
                        { en: 'Lifestyle', vi: 'Lifestyle' },
                        { en: 'Close-up', vi: 'Cận cảnh' },
                        { en: 'In Context', vi: 'Bối cảnh' },
                        { en: 'Alternative', vi: 'Biến thể' },
                        { en: 'Variation 7', vi: 'Biến thể 7' },
                        { en: 'Variation 8', vi: 'Biến thể 8' },
                        { en: 'Variation 9', vi: 'Biến thể 9' },
                      ];
                      const label = labels[index] || { en: `Var ${index + 1}`, vi: `Biến thể ${index + 1}` };
                      
                      return (
                        <div 
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group hover:border-zinc-600 transition-all hover:shadow-xl hover:shadow-purple-500/10"
                        >
                          <img 
                            src={img} 
                            alt={`Output ${index + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Number badge */}
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                            {index + 1}
                          </div>
                          
                          {/* Label */}
                          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium truncate">
                              {language === 'vi' ? label.vi : label.en}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900 shrink-0 rounded-b-3xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {language === 'vi' ? 'Kết quả demo thực tế' : 'Real demo result'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setViewingDemo(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </Button>
                <Button 
                  onClick={() => {
                    handleUseDemo(viewingDemo);
                    setViewingDemo(null);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25"
                >
                  <Sparkles size={14} className="mr-2" />
                  {language === 'vi' ? 'Tạo bộ ảnh của tôi' : 'Create My Set'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <AssetPickerModal
          isOpen={showAssetPicker}
          onClose={() => setShowAssetPicker(false)}
          onSelectAsset={(asset) => {
            setUploadedImage({
              file: new File([], asset.name || 'asset.jpg'),
              preview: asset.src
            });
            setStep(2);
            setShowAssetPicker(false);
          }}
          multiSelect={false}
          maxSelection={1}
        />
      )}

      {/* Recreate Modal */}
      {showRecreateModal && selectedImageForRecreate && (
        <RecreateView
          onClose={() => {
            console.log('Closing RecreateView');
            setShowRecreateModal(false);
            setSelectedImageForRecreate(null);
          }}
          originalImage={selectedImageForRecreate.src}
          originalPrompt={selectedImageForRecreate.prompt}
          generationInfo={{
            model: 'Higgsfield Soul',
            style: 'Photograph',
            ratio: '4:5',
          }}
          autoGenerate={true}
        />
      )}
      
      {/* Debug: Show modal state */}
      {showRecreateModal && !selectedImageForRecreate && (
        <div className="fixed inset-0 z-[99999] bg-red-500/50 flex items-center justify-center">
          <p className="text-white text-2xl">Error: No image selected for recreate</p>
        </div>
      )}
    </div>
  );
};
