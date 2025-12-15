import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { EditorView } from './components/Editor/EditorView';
import { MarketplaceView } from './components/Marketplace/MarketplaceView';
import { TeamView } from './components/Team/TeamView';
import { ProfileView } from './components/Profile/ProfileView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
// Creator features integrated into ProfileView
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { LandingPage } from './components/Landing/LandingPage';
import { AuthPage } from './components/Auth/AuthPage';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { ViewState } from './types';
import { 
  Sparkles, ArrowRight, Image as ImageIcon, Scissors, Layers, Maximize2, Wand2, Search, Play,
  ShoppingBag, Camera, Briefcase, Zap, Crown, Check, ShieldCheck, Building2, Star,
  Paperclip, X, ImagePlus, Download, Upload, ChevronRight, ChevronDown, RefreshCw, Edit3, Heart
} from 'lucide-react';
import { Button, Card, Badge } from './components/ui/UIComponents';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrandKitProvider } from './contexts/BrandKitContext';
import { BrandKitView } from './components/BrandKit/BrandKitView';
import { AssetLibrary } from './components/Assets/AssetLibrary';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { UpgradeModal } from './components/Subscription/UpgradeModal';
import { AssetPickerModal } from './components/Editor/AssetPickerModal';
import { SmartPhotoshootView } from './components/AI/SmartPhotoshootView';
import { RecreateView } from './components/Marketplace/RecreateView';

import { useSubscription } from './contexts/SubscriptionContext';

// --- Modern Home Dashboard View ---
const HomeView: React.FC<{ onStartEditing: (image?: string, ratio?: string) => void }> = ({ onStartEditing }) => {
  const { trans, language } = useLanguage();
  const { currentPlan, triggerUpgradeModal } = useSubscription();
  const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  
  // Image Upload States
  const MAX_PROMPT_IMAGES = 5;
  const [uploadedImages, setUploadedImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [showMaxImagesWarning, setShowMaxImagesWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generation Options States
  const [selectedModel, setSelectedModel] = useState('higgsfield-soul'); // Default to first free model
  const [selectedStyle, setSelectedStyle] = useState('photograph');
  const [selectedRatio, setSelectedRatio] = useState('3:2');
  const [imageCount, setImageCount] = useState(2);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);
  const [showRefImageDropdown, setShowRefImageDropdown] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  
  // Example Preview Modal State
  const [selectedExample, setSelectedExample] = useState<{ title: string; src: string; prompt: string } | null>(null);
  const [showMoreExamples, setShowMoreExamples] = useState(false);
  const [selectedTool, setSelectedTool] = useState('nano-banana-pro');
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  
  // Tools data for Example Modal
  const toolOptions = [
    { id: 'soul-character', name: 'Soul ID Character', desc: 'Create unique character', icon: '😊' },
    { id: 'inpaint', name: 'Inpaint', desc: 'Select an area, describe the change', icon: '🖌️', isNew: true },
    { id: 'upscale', name: 'Image Upscale', desc: 'Enhance image quality', icon: '📐' },
    { id: 'face-swap', name: 'Face Swap', desc: 'Create Realistic Face Swaps', icon: '👥' },
    { id: 'character-swap', name: 'Character Swap', desc: 'Create Realistic Character Swaps', icon: '🎭' },
    { id: 'draw-to-edit', name: 'Draw to Edit', desc: 'From sketch to picture', icon: '✏️' },
    { id: 'instadump', name: 'Instadump', desc: 'Turn a selfie into a full content library', icon: '📷' },
    { id: 'photodump', name: 'Photodump Studio', desc: 'Generate Your Aesthetic', icon: '🖼️' },
    { id: 'fashion', name: 'Fashion Factory', desc: 'Create fashion sets', icon: '👗' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', desc: 'Best 4K image model ever', icon: '🍌', isNew: true },
    { id: 'seedream-45', name: 'Seedream 4.5', desc: 'Next-gen 4K image model', icon: '📊', isNew: true },
    { id: 'flux-2', name: 'FLUX.2', desc: 'Ultra-fast, detailed images', icon: '⚡', isNew: true },
    { id: 'z-image', name: 'Z-Image', desc: 'Ultra-fast photorealistic images', icon: '🔷', isNew: true },
    { id: 'kling-o1', name: 'Kling O1 Image', desc: 'Photorealistic, prompt-accurate', icon: '🎯', isNew: true },
    { id: 'wan-22', name: 'Wan 2.2 Image', desc: 'Realistic images', icon: '🌊' },
    { id: 'gpt-image', name: 'GPT Image', desc: 'Advanced OpenAI model', icon: '🤖' },
    { id: 'topaz', name: 'Topaz', desc: 'High-resolution upscaler', icon: '💎' },
  ];
  
  // Recreate View State
  const [showRecreateView, setShowRecreateView] = useState(false);
  const [recreateData, setRecreateData] = useState<{ image: string; prompt: string; model: string; style: string; ratio: string } | null>(null);
  
  // Full screen preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; index: number } | null>(null);
  
  
  
  // Options Data - Real AI Models with descriptions
  const modelOptions = [
    // Free Models
    { id: 'higgsfield-soul', label: 'Higgsfield Soul', labelVi: 'Higgsfield Soul', desc: 'Ultra-Realistic Fashion Visuals', descVi: 'Hình ảnh thời trang siêu thực', tier: 'free', icon: '✨' },
    { id: 'nano-banana-pro', label: 'Nano Banana Pro', labelVi: 'Nano Banana Pro', desc: "Google's Flagship Generation Model", descVi: 'Model tạo ảnh hàng đầu của Google', tier: 'free', icon: 'G' },
    { id: 'z-image', label: 'Z-Image', labelVi: 'Z-Image', desc: 'Ultra-Fast Photorealistic Images', descVi: 'Ảnh siêu thực cực nhanh', tier: 'free', icon: '⚡' },
    { id: 'flux-pro', label: 'FLUX.2 Pro', labelVi: 'FLUX.2 Pro', desc: 'Lightning-Fast Precision', descVi: 'Độ chính xác siêu nhanh', tier: 'free', icon: '△' },
    { id: 'wan-22', label: 'WAN 2.2', labelVi: 'WAN 2.2', desc: 'High-Fidelity Cinematic Visuals', descVi: 'Hình ảnh điện ảnh chất lượng cao', tier: 'free', icon: '🎬' },
    // Plus Models
    { id: 'higgsfield-faceswap', label: 'Higgsfield Face Swap', labelVi: 'Higgsfield Face Swap', desc: 'Seamless Face Swapping', descVi: 'Hoán đổi khuôn mặt liền mạch', tier: 'plus', icon: '👤' },
    { id: 'higgsfield-character', label: 'Higgsfield Character Swap', labelVi: 'Higgsfield Character Swap', desc: 'Seamless Character Swapping', descVi: 'Hoán đổi nhân vật liền mạch', tier: 'plus', icon: '🎭' },
    { id: 'nano-banana', label: 'Nano Banana', labelVi: 'Nano Banana', desc: "Google's Standard Generation Model", descVi: 'Model tạo ảnh tiêu chuẩn của Google', tier: 'plus', icon: 'G' },
    { id: 'seedream-45', label: 'Seedream 4.5', labelVi: 'Seedream 4.5', desc: "ByteDance's Next-Gen 4K Image Model", descVi: 'Model ảnh 4K thế hệ mới của ByteDance', tier: 'plus', icon: '📊' },
    { id: 'kling-o1', label: 'Kling O1', labelVi: 'Kling O1', desc: "Kling's Photorealistic Image Model", descVi: 'Model ảnh siêu thực của Kling', tier: 'plus', icon: '◎' },
    { id: 'flux-flex', label: 'FLUX.2 Flex', labelVi: 'FLUX.2 Flex', desc: 'Next-Gen Image Generation', descVi: 'Tạo ảnh thế hệ mới', tier: 'plus', icon: '△' },
    // Pro Models (highest tier)
    { id: 'seedream-40', label: 'Seedream 4.0', labelVi: 'Seedream 4.0', desc: "ByteDance's Advanced Image Editing Model", descVi: 'Model chỉnh sửa ảnh nâng cao của ByteDance', tier: 'pro', icon: '📊' },
    { id: 'reve', label: 'Reve', labelVi: 'Reve', desc: 'Advanced Image Editing Model', descVi: 'Model chỉnh sửa ảnh nâng cao', tier: 'pro', icon: '❋' },
    { id: 'flux-kontext', label: 'Flux Kontext Max', labelVi: 'Flux Kontext Max', desc: 'Edit With Accuracy', descVi: 'Chỉnh sửa chính xác', tier: 'pro', icon: '⟁' },
    { id: 'gpt-image', label: 'GPT Image', labelVi: 'GPT Image', desc: "OpenAI's Powerful Image Tool", descVi: 'Công cụ ảnh mạnh mẽ của OpenAI', tier: 'pro', icon: '◈' },
    { id: 'multi-reference', label: 'Multi Reference', labelVi: 'Multi Reference', desc: 'Multiple Edits In One Shot', descVi: 'Nhiều chỉnh sửa trong một lần', tier: 'pro', icon: '⊞' },
  ];
  
  const styleOptions = [
    { id: 'photograph', label: 'Photograph', labelVi: 'Ảnh chụp' },
    { id: 'illustration', label: 'Illustration', labelVi: 'Minh họa' },
    { id: 'digital-art', label: 'Digital Art', labelVi: 'Nghệ thuật số' },
    { id: '3d-render', label: '3D Render', labelVi: '3D Render' },
    { id: 'painting', label: 'Painting', labelVi: 'Tranh vẽ' },
  ];
  
  const ratioOptions = [
    { id: '1:1', label: '1:1', width: 1, height: 1 },
    { id: '16:9', label: '16:9', width: 16, height: 9 },
    { id: '9:16', label: '9:16', width: 9, height: 16 },
    { id: '3:2', label: '3:2', width: 3, height: 2 },
    { id: '2:3', label: '2:3', width: 2, height: 3 },
    { id: '4:3', label: '4:3', width: 4, height: 3 },
    { id: '3:4', label: '3:4', width: 3, height: 4 },
  ];
  
  const countOptions = [1, 2, 4];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    const remainingSlots = MAX_PROMPT_IMAGES - uploadedImages.length;
    
    if (files.length > remainingSlots) {
      setShowMaxImagesWarning(true);
      setTimeout(() => setShowMaxImagesWarning(false), 3000);
    }
    
    const newImages = files.slice(0, remainingSlots).map((file: File, idx: number) => ({
      id: `upload-${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    
    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages].slice(0, MAX_PROMPT_IMAGES));
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (id: string) => {
    setUploadedImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  // Handle paste image
  const handlePasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (uploadedImages.length >= MAX_PROMPT_IMAGES) {
            setShowMaxImagesWarning(true);
            setTimeout(() => setShowMaxImagesWarning(false), 3000);
          } else {
            const newImage = {
              id: `paste-${Date.now()}`,
              file,
              preview: URL.createObjectURL(file)
            };
            setUploadedImages(prev => [...prev, newImage].slice(0, MAX_PROMPT_IMAGES));
          }
        }
        break;
      }
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim() && uploadedImages.length === 0) return;
    setIsGenerating(true);
    setShowGenerateModal(true);
    setGenerateProgress(0);
    setSelectedImage(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerateProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Simulate AI Generation with correct ratio and count
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerateProgress(100);
      setIsGenerating(false);
      
      // Get ratio dimensions for image URLs
      const currentRatio = ratioOptions.find(r => r.id === selectedRatio) || ratioOptions[0];
      const baseWidth = 600;
      const baseHeight = Math.round(baseWidth * currentRatio.height / currentRatio.width);
      
      // Sample images pool
      const sampleImages = [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      ];
      
      // Generate correct number of images with correct ratio
      const generatedUrls = sampleImages
        .slice(0, imageCount)
        .map(url => `${url}?w=${baseWidth}&h=${baseHeight}&fit=crop&q=90`);
      
      setGeneratedImages(generatedUrls);
    }, 3000);
  };

  const handleApplyAndEdit = () => {
    if (selectedImage === null) return;
    setShowEditConfirm(true);
  };

  const handleConfirmEdit = () => {
    if (selectedImage === null) return;
    onStartEditing(generatedImages[selectedImage], selectedRatio);
    setShowGenerateModal(false);
    setShowEditConfirm(false);
    setGeneratedImages([]);
    setPrompt('');
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `repix-generated-v${index + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSelected = () => {
    if (selectedImage === null) return;
    handleDownloadImage(generatedImages[selectedImage], selectedImage);
  };

  const handleCloseModal = () => {
    setShowGenerateModal(false);
    setGeneratedImages([]);
    setSelectedImage(null);
    setIsGenerating(false);
    setGenerateProgress(0);
  };
  
  // Mock Inspiration Data - Product Photography
  const inspirationImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop", prompt: "Nike Air Max product shot with dramatic lighting", author: "@sneaker_studio" },
    { id: 2, src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", prompt: "Louis Vuitton leather bag on marble", author: "@luxury_shots" },
    { id: 3, src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop", prompt: "Chanel perfume with soft studio lighting", author: "@fragrance_art" },
    { id: 4, src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop", prompt: "Adidas sneakers minimalist white background", author: "@clean_product" },
    { id: 5, src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop", prompt: "Gucci handbag lifestyle photography", author: "@fashion_lens" },
    { id: 6, src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", prompt: "Apple Watch product photography", author: "@tech_visuals" },
    { id: 7, src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=600&fit=crop", prompt: "Jordan sneakers floating effect", author: "@kicks_daily" },
    { id: 8, src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop", prompt: "Dior perfume elegant composition", author: "@scent_studio" },
    { id: 9, src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop", prompt: "Nike running shoes dynamic angle", author: "@sport_shots" },
    { id: 10, src: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop", prompt: "Designer sunglasses on reflective surface", author: "@eyewear_pro" },
    { id: 11, src: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop", prompt: "Luxury watch macro photography", author: "@time_pieces" },
    { id: 12, src: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=600&fit=crop", prompt: "Converse sneakers vintage style", author: "@retro_kicks" },
  ];

  // Quick Tools (Persona: Casual User)
  const tools = [
    { icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10", label: trans.home.toolTextToImage },
    { icon: Scissors, color: "text-pink-500", bg: "bg-pink-500/10", label: trans.home.toolRemoveBg },
    { icon: Maximize2, color: "text-amber-500", bg: "bg-amber-500/10", label: trans.home.toolUpscale },
    { icon: Wand2, color: "text-repix-500", bg: "bg-repix-500/10", label: trans.home.toolReplace },
  ];

  // Workflows (Persona: E-commerce, Creator, Agency)
  const workflows = [
    { 
      id: 'product', icon: ShoppingBag, 
      title: trans.home.workflowProduct, desc: trans.home.workflowProductDesc,
      color: "from-orange-400 to-pink-500",
      persona: "E-Commerce"
    },
    { 
      id: 'portrait', icon: Camera, 
      title: trans.home.workflowPortrait, desc: trans.home.workflowPortraitDesc,
      color: "from-purple-400 to-blue-500",
      persona: "Photographer"
    },
    { 
      id: 'social', icon: Zap, 
      title: trans.home.workflowSocial, desc: trans.home.workflowSocialDesc,
      color: "from-pink-500 to-rose-500",
      persona: "Creator"
    },
    { 
      id: 'restore', icon: Sparkles, 
      title: trans.home.workflowRestore, desc: trans.home.workflowRestoreDesc,
      color: "from-emerald-400 to-teal-500",
      persona: "General"
    },
  ];

  // Pricing Plans (Monetization Strategy)
  const plans = [
    {
      name: "Free",
      price: "Free",
      userType: language === 'vi' ? "Người dùng mới" : "Getting Started",
      icon: Zap,
      features: language === 'vi' 
        ? ["5 ảnh/tháng", "Công cụ cơ bản", "Xuất 1080p", "Bộ lọc tiêu chuẩn"]
        : ["5 images/month", "Basic tools", "1080p export", "Standard filters"],
      cta: trans.home.currentPlan,
      primary: false,
      color: "text-zinc-500"
    },
    {
      name: "Plus",
      price: "$9",
      userType: language === 'vi' ? "Người sáng tạo" : "Creator",
      icon: Sparkles,
      features: language === 'vi'
        ? ["50 ảnh/tháng", "AI xóa phông nền", "Xuất 4K", "Bộ lọc cao cấp", "Không watermark"]
        : ["50 images/month", "AI background removal", "4K export", "Premium filters", "No watermark"],
      cta: trans.home.upgrade,
      primary: true, // Highlight this
      color: "text-purple-500"
    },
    {
      name: "Pro",
      price: "$19",
      userType: language === 'vi' ? "Chuyên nghiệp" : "Professional",
      icon: Crown,
      features: language === 'vi'
        ? ["Không giới hạn ảnh", "Tất cả công cụ AI", "Brand Kit", "Xử lý hàng loạt", "Hỗ trợ ưu tiên"]
        : ["Unlimited images", "All AI tools", "Brand Kit", "Batch processing", "Priority support"],
      cta: trans.home.upgrade,
      primary: false,
      color: "text-amber-500"
    },
    {
      name: "Team",
      price: language === 'vi' ? "Liên hệ" : "Custom",
      userType: language === 'vi' ? "Doanh nghiệp" : "Enterprise",
      icon: Building2,
      features: language === 'vi'
        ? ["Tất cả tính năng Pro", "5 thành viên", "Cộng tác thời gian thực", "Quản lý thương hiệu", "Hỗ trợ chuyên biệt"]
        : ["Everything in Pro", "5 team members", "Real-time collaboration", "Brand management", "Dedicated support"],
      cta: trans.home.contactSales,
      primary: false,
      color: "text-blue-500"
    }
  ];

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto transition-colors duration-300">
       <div className="relative">
          {/* Hero Background Gradient */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-repix-500/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10">
            
            {/* --- SECTION 1: HERO & PROMPT (The Core) --- */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="pro" className="mb-4">Repix AI 2.0</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                {trans.home.heroTitle}
              </h1>
              
              <div className="relative group animated-border rounded-2xl">
                <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-2xl transition-colors">
                   
                   {/* Uploaded Images Preview */}
                   {uploadedImages.length > 0 && (
                     <div className="mb-3 flex flex-wrap gap-2 px-2">
                       {uploadedImages.map((img) => (
                         <div key={img.id} className="relative group/img">
                           <img 
                             src={img.preview} 
                             alt="Upload" 
                             className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border-2 border-zinc-200 dark:border-zinc-700"
                           />
                           <button
                             onClick={() => handleRemoveImage(img.id)}
                             className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                           >
                             <X size={12} className="text-white" />
                           </button>
                           <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-white font-medium">
                             {img.file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                           </div>
                         </div>
                       ))}
                       {uploadedImages.length < MAX_PROMPT_IMAGES && (
                         <button
                           onClick={() => fileInputRef.current?.click()}
                           className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:text-repix-500 hover:border-repix-400 transition-colors"
                         >
                           <ImagePlus size={20} />
                           <span className="text-[9px] mt-1">Add</span>
                         </button>
                       )}
                     </div>
                   )}

                   {/* Textarea Row */}
                   <div className="relative">
                     <textarea 
                       placeholder={uploadedImages.length > 0 ? "Describe what to do with these images..." : trans.home.placeholder}
                       value={prompt}
                       onChange={(e) => {
                         setPrompt(e.target.value);
                         const textarea = e.target;
                         textarea.style.height = 'auto';
                         const maxH = window.innerWidth < 768 ? 100 : 120;
                         const newHeight = Math.max(44, Math.min(textarea.scrollHeight, maxH));
                         textarea.style.height = newHeight + 'px';
                       }}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleGenerate();
                         }
                       }}
                       onPaste={handlePasteImage}
                       className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none overflow-y-auto"
                       style={{ minHeight: '44px', maxHeight: window.innerWidth < 768 ? '100px' : '120px' }}
                       rows={1}
                     />

                   </div>

                   {/* Options Row */}
                   <div className="flex items-center justify-between gap-2 px-2 py-2 border-t border-zinc-100 dark:border-zinc-800">
                     <div className="flex items-center gap-1.5 flex-wrap">
                       {/* Hidden File Input */}
                       <input
                         ref={fileInputRef}
                         type="file"
                         accept="image/*"
                         multiple
                         onChange={handleImageUpload}
                         className="hidden"
                       />
                       
                       {/* Reference Image Button with Dropdown */}
                       <div className="relative">
                         <button
                           onClick={() => { setShowRefImageDropdown(!showRefImageDropdown); setShowModelDropdown(false); setShowStyleDropdown(false); setShowRatioDropdown(false); }}
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/20 transition-colors"
                         >
                           <ImagePlus size={14} />
                           {language === 'vi' ? 'Ảnh tham chiếu' : 'Reference image'}
                         </button>
                         {/* Dropdown Menu */}
                         {showRefImageDropdown && (
                           <div className="absolute top-full left-0 mt-1 py-1 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-20 min-w-[180px]">
                             <button
                               onClick={() => { fileInputRef.current?.click(); setShowRefImageDropdown(false); }}
                               className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                             >
                               <Upload size={16} />
                               {language === 'vi' ? 'Tải lên từ thiết bị' : 'Upload from device'}
                             </button>
                             <button
                               onClick={() => { setShowAssetPicker(true); setShowRefImageDropdown(false); }}
                               className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                             >
                               <Paperclip size={16} />
                               {language === 'vi' ? 'Từ My Assets' : 'From My Assets'}
                             </button>
                           </div>
                         )}
                       </div>

                       {/* Model Dropdown */}
                       <div className="relative">
                         <button 
                           onClick={() => { setShowModelDropdown(!showModelDropdown); setShowStyleDropdown(false); setShowRatioDropdown(false); setShowRefImageDropdown(false); }}
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                         >
                           Model: {modelOptions.find(m => m.id === selectedModel)?.[language === 'vi' ? 'labelVi' : 'label']}
                           {modelOptions.find(m => m.id === selectedModel)?.tier === 'plus' && (
                             <Crown size={10} className="text-purple-500" />
                           )}
                           {modelOptions.find(m => m.id === selectedModel)?.tier === 'pro' && (
                             <Crown size={10} className="text-amber-500" />
                           )}
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                         </button>
                         {showModelDropdown && (
                           <div className="absolute top-full left-0 mt-1 py-2 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 z-20 w-[320px] max-h-[400px] overflow-y-auto">
                             <p className="px-4 py-2 text-xs font-medium text-zinc-500">
                               {language === 'vi' ? 'Chọn model' : 'Select model'}
                             </p>
                             {modelOptions.map(opt => {
                               // Check if user can access this model based on their plan
                               const canAccess = opt.tier === 'free' || 
                                 (opt.tier === 'plus' && (currentPlan === 'plus' || currentPlan === 'pro')) ||
                                 (opt.tier === 'pro' && currentPlan === 'pro');
                               
                               return (
                                 <button
                                   key={opt.id}
                                   onClick={() => {
                                     if (canAccess) {
                                       setSelectedModel(opt.id);
                                       setShowModelDropdown(false);
                                     } else {
                                       setShowModelDropdown(false);
                                       triggerUpgradeModal('advancedAI');
                                     }
                                   }}
                                   className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800 transition-colors ${selectedModel === opt.id ? 'bg-zinc-800' : ''}`}
                                 >
                                   {/* Icon with gradient colors */}
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                                     selectedModel === opt.id 
                                       ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white' 
                                       : 'bg-zinc-800 border border-zinc-700'
                                   }`}>
                                     <span className={selectedModel === opt.id ? 'text-white' : 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent'}>
                                       {opt.icon}
                                     </span>
                                   </div>
                                   {/* Content */}
                                   <div className="flex-1 min-w-0">
                                     <div className="flex items-center gap-2">
                                       <span className={`text-sm font-medium ${selectedModel === opt.id ? 'text-white' : 'text-zinc-200'}`}>
                                         {opt.label}
                                       </span>
                                       {opt.tier === 'plus' && (
                                         <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold border border-purple-500/30">
                                           <Crown size={8} /> PLUS
                                         </span>
                                       )}
                                       {opt.tier === 'pro' && (
                                         <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/30">
                                           <Crown size={8} /> PRO
                                         </span>
                                       )}
                                     </div>
                                     <p className="text-xs text-zinc-500 truncate">
                                       {language === 'vi' ? opt.descVi : opt.desc}
                                     </p>
                                   </div>
                                   {/* Check mark with gradient */}
                                   {selectedModel === opt.id && (
                                     <Check size={18} className="text-pink-500 shrink-0" />
                                   )}
                                 </button>
                               );
                             })}
                           </div>
                         )}
                       </div>

                       {/* Style Dropdown */}
                       <div className="relative">
                         <button 
                           onClick={() => { setShowStyleDropdown(!showStyleDropdown); setShowModelDropdown(false); setShowRatioDropdown(false); setShowRefImageDropdown(false); }}
                           className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                         >
                           Style: {styleOptions.find(s => s.id === selectedStyle)?.[language === 'vi' ? 'labelVi' : 'label']}
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                         </button>
                         {showStyleDropdown && (
                           <div className="absolute top-full left-0 mt-1 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-20 min-w-[140px]">
                             {styleOptions.map(opt => (
                               <button
                                 key={opt.id}
                                 onClick={() => { setSelectedStyle(opt.id); setShowStyleDropdown(false); }}
                                 className={`w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${selectedStyle === opt.id ? 'text-repix-500 font-medium' : 'text-zinc-600 dark:text-zinc-400'}`}
                               >
                                 {language === 'vi' ? opt.labelVi : opt.label}
                               </button>
                             ))}
                           </div>
                         )}
                       </div>

                       {/* Ratio & Count Dropdown */}
                       <div className="relative">
                         <button 
                           onClick={() => { setShowRatioDropdown(!showRatioDropdown); setShowModelDropdown(false); setShowStyleDropdown(false); setShowRefImageDropdown(false); }}
                           className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                         >
                           {selectedRatio} · {imageCount} {language === 'vi' ? 'ảnh' : 'images'}
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                         </button>
                         {showRatioDropdown && (
                           <div className="absolute top-full right-0 mt-1 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 z-20 min-w-[280px]">
                             {/* Aspect Ratio */}
                             <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                               {language === 'vi' ? 'Tỷ lệ khung hình' : 'Aspect Ratio'}
                             </p>
                             <div className="flex gap-2 mb-4">
                               {ratioOptions.map(ratio => (
                                 <button
                                   key={ratio.id}
                                   onClick={() => { setSelectedRatio(ratio.id); setShowRatioDropdown(false); }}
                                   className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                                     selectedRatio === ratio.id 
                                       ? 'bg-blue-500 text-white' 
                                       : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                                   }`}
                                 >
                                   <div 
                                     className={`border-2 ${selectedRatio === ratio.id ? 'border-white' : 'border-current'}`}
                                     style={{ 
                                       width: `${Math.min(ratio.width / Math.max(ratio.width, ratio.height) * 24, 24)}px`,
                                       height: `${Math.min(ratio.height / Math.max(ratio.width, ratio.height) * 24, 24)}px`
                                     }}
                                   />
                                   <span className="text-[10px] font-medium">{ratio.label}</span>
                                 </button>
                               ))}
                             </div>
                             
                             {/* Count */}
                             <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                               {language === 'vi' ? 'Số lượng' : 'Count'}
                             </p>
                             <div className="flex gap-2">
                               {countOptions.map(count => (
                                 <button
                                   key={count}
                                   onClick={() => { setImageCount(count); setShowRatioDropdown(false); }}
                                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                     imageCount === count 
                                       ? 'bg-blue-500 text-white' 
                                       : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                                   }`}
                                 >
                                   {count}
                                 </button>
                               ))}
                               <button
                                 disabled
                                 className="flex-1 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed flex items-center justify-center gap-1"
                               >
                                 4 <Crown size={10} />
                               </button>
                             </div>
                             
                             <button 
                               onClick={() => setShowRatioDropdown(false)}
                               className="w-full mt-3 py-2 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                             >
                               {language === 'vi' ? 'Đóng' : 'Close'}
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                     
                     {/* Generate Button */}
                       <Button 
                         size="sm" 
                         className="rounded-lg px-5 shadow-lg shadow-repix-500/20 shrink-0 gap-1.5" 
                         onClick={handleGenerate} 
                         disabled={!prompt.trim() && uploadedImages.length === 0}
                       >
                         <Sparkles size={14} />
                         {trans.home.generate}
                       </Button>
                     </div>
                     
                     {/* Max Images Warning */}
                     {showMaxImagesWarning && (
                       <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                         <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                           {language === 'vi' ? `Tối đa ${MAX_PROMPT_IMAGES} ảnh được phép` : `Maximum ${MAX_PROMPT_IMAGES} images allowed`}
                         </span>
                       </div>
                     )}
                  </div>
                </div>

              </div>

            {/* --- QUICK ACTIONS SECTION --- */}
            <div className="mb-16">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Zap size={20} className="text-amber-500" /> {trans.home.tools}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{trans.home.quickActionsDesc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tools.map((tool, idx) => (
                  <button 
                    key={idx}
                    onClick={() => onStartEditing()}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                       <tool.icon className={tool.color} size={28} />
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- TRY AN EXAMPLE SECTION --- */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-8">
                {language === 'vi' ? 'THỬ MỘT VÍ DỤ' : 'TRY AN EXAMPLE'}
              </h2>
              
              {/* Masonry Grid with Fade Effect */}
              <div className="relative">
                <div 
                  className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
                    showMoreExamples ? 'max-h-[2000px]' : 'max-h-[420px] md:max-h-[500px]'
                  }`}
                >
                {/* Column 1 */}
                <div className="space-y-3 md:space-y-4">
                  <button
                    onClick={() => setSelectedExample({ title: 'Fantasy Bedroom Portal', src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=750&fit=crop', prompt: 'Cozy bedroom with magical glowing forest portal on the wall, fantasy art' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=500&fit=crop" 
                      alt="Fantasy bedroom"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Golden Hour Tram', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=450&fit=crop', prompt: 'Golden hour street photography with vintage tram, cinematic lighting' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop" 
                      alt="Street tram"
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  {/* Extra for column 1 */}
                  <button
                    onClick={() => setSelectedExample({ title: 'Mountain Lake', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop', prompt: 'Serene mountain lake at sunrise, mirror reflection, landscape photography' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop" alt="Mountain lake" className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Vintage Camera', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop', prompt: 'Vintage film camera on wooden table, nostalgic product photography' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop" alt="Camera" className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>

                {/* Column 2 */}
                <div className="space-y-3 md:space-y-4">
                  <button
                    onClick={() => setSelectedExample({ title: 'Vintage Chalkboard', src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=450&fit=crop', prompt: 'Vintage chalkboard with motivational quote, classroom aesthetic' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop" 
                      alt="Chalkboard"
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Space Astronaut Egg', src: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=750&fit=crop', prompt: 'Cute astronaut character hatching from egg on moon surface, 3D render' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=500&fit=crop" 
                      alt="Astronaut"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Cozy Rainy Window', src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=450&fit=crop', prompt: 'Cozy window with fairy lights and rain outside, warm atmosphere' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop" 
                      alt="Cozy window"
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  {/* Extra for column 2 */}
                  <button
                    onClick={() => setSelectedExample({ title: 'Cute Robot', src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=600&fit=crop', prompt: 'Adorable small robot with big eyes, friendly expression, 3D render' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop" alt="Robot" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Coffee Art', src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop', prompt: 'Artistic latte art in ceramic cup, cozy cafe atmosphere, food photography' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" alt="Coffee" className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>

                {/* Column 3 */}
                <div className="space-y-3 md:space-y-4">
                  <button
                    onClick={() => setSelectedExample({ title: 'Vaporwave Fashion Dog', src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=900&fit=crop', prompt: 'Adorable white dog wearing pink sunglasses and outfit on beach, fashion photography' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=600&fit=crop" 
                      alt="Dog with sunglasses"
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Natural Portrait', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop', prompt: 'Beautiful female portrait with soft natural lighting, professional headshot' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" 
                      alt="Portrait"
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  {/* Extra for column 3 */}
                  <button
                    onClick={() => setSelectedExample({ title: 'Aurora Borealis', src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=750&fit=crop', prompt: 'Northern lights dancing over snowy mountains, aurora borealis, night sky' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=500&fit=crop" alt="Aurora" className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>

                {/* Column 4 */}
                <div className="space-y-3 md:space-y-4">
                  <button
                    onClick={() => setSelectedExample({ title: 'Fairy Flower Village', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop', prompt: 'Miniature fairy village on pink flower petal, macro photography, tilt-shift' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop" 
                      alt="Flower village"
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Cosmic Sky Whale', src: 'https://images.unsplash.com/photo-1454991727061-be514eae86f7?w=600&h=750&fit=crop', prompt: 'Majestic whale swimming through starry night sky, surreal digital art' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1454991727061-be514eae86f7?w=400&h=500&fit=crop" 
                      alt="Sky whale"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  {/* Extra images for this column when expanded */}
                  <button
                    onClick={() => setSelectedExample({ title: 'Neon City Night', src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&h=450&fit=crop', prompt: 'Cyberpunk neon city at night, rain reflections, blade runner style' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=300&fit=crop" alt="Neon city" className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button
                    onClick={() => setSelectedExample({ title: 'Tropical Paradise', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=450&fit=crop', prompt: 'Tropical beach with crystal clear water, palm trees, paradise island' })}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop" alt="Beach" className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
                </div>

                {/* Gradient Fade Overlay - only show when collapsed */}
                {!showMoreExamples && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light-bg dark:from-dark-bg to-transparent pointer-events-none" />
                )}

                {/* Show More Button - positioned over the fade when collapsed */}
                {!showMoreExamples && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <button
                      onClick={() => setShowMoreExamples(true)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      {language === 'vi' ? 'Xem thêm' : 'Show more'}
                    </button>
                  </div>
                )}
              </div>

              {/* Show Less Button - centered below grid when expanded */}
              {showMoreExamples && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowMoreExamples(false)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    {language === 'vi' ? 'Thu gọn' : 'Show less'}
                  </button>
                </div>
              )}
            </div>

            {/* Example Preview Modal - Professional Design */}
            {selectedExample && (
              <div 
                className="fixed inset-0 z-[100] flex bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
                onClick={() => setSelectedExample(null)}
              >
                {/* Background blur image */}
                <div 
                  className="absolute inset-0 opacity-20 blur-3xl scale-125"
                  style={{ 
                    backgroundImage: `url(${selectedExample.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Center: Image Preview - Takes remaining space */}
                <div 
                  className="flex-1 flex items-center justify-center p-6 md:p-10 pr-[360px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative group animate-in zoom-in-95 duration-200">
                    <img
                      src={selectedExample.src}
                      alt={selectedExample.title}
                      className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl shadow-black/60 ring-1 ring-white/10"
                    />
                    {/* Subtle glow effect */}
                    <div className="absolute -inset-6 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 blur-3xl -z-10 rounded-[40px] opacity-60" />
                  </div>
                </div>

                {/* Right: Info Panel - Fixed to right edge */}
                <div 
                  className="fixed right-0 top-0 bottom-0 w-[340px] bg-zinc-900/98 backdrop-blur-2xl border-l border-zinc-800/80 flex flex-col shadow-2xl shadow-black/50 animate-in slide-in-from-right duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-[15px] leading-tight">{selectedExample.title}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">AI Generated</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedExample(null)}
                      className="p-2 rounded-xl hover:bg-zinc-800/80 transition-all duration-200"
                    >
                      <X size={18} className="text-zinc-500 hover:text-zinc-300" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
                    {/* Tool Selector Section */}
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mb-3">
                        <Layers size={12} className="text-green-400" />
                        <span>TOOL</span>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => { setShowToolDropdown(!showToolDropdown); setShowModelDropdown(false); setShowStyleDropdown(false); setShowRatioDropdown(false); }}
                          className="w-full flex items-center gap-3 p-2.5 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 rounded-xl transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-zinc-600 flex items-center justify-center text-lg">
                            {toolOptions.find(t => t.id === selectedTool)?.icon || '🔧'}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-white">{toolOptions.find(t => t.id === selectedTool)?.name || 'Select Tool'}</span>
                              {toolOptions.find(t => t.id === selectedTool)?.isNew && <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-[9px] font-bold rounded">NEW</span>}
                            </div>
                            <span className="text-[11px] text-zinc-500">{toolOptions.find(t => t.id === selectedTool)?.desc}</span>
                          </div>
                          <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showToolDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showToolDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-30 shadow-2xl max-h-[280px] overflow-y-auto">
                            {toolOptions.map(tool => (
                              <button
                                key={tool.id}
                                onClick={() => { setSelectedTool(tool.id); setShowToolDropdown(false); }}
                                className={`w-full flex items-center gap-3 p-2.5 hover:bg-zinc-700 transition-colors ${selectedTool === tool.id ? 'bg-zinc-700' : ''}`}
                              >
                                <div className="w-8 h-8 rounded-lg bg-zinc-600 flex items-center justify-center text-base">
                                  {tool.icon}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-medium text-white">{tool.name}</span>
                                    {tool.isNew && <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-[9px] font-bold rounded">NEW</span>}
                                  </div>
                                  <span className="text-[10px] text-zinc-500">{tool.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Prompt Section */}
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                          <Sparkles size={12} />
                          <span>PROMPT</span>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(selectedExample.prompt)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-zinc-700/80 hover:bg-zinc-600 text-zinc-300 rounded-lg transition-all duration-200"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[13px] text-zinc-300 leading-relaxed">
                        {selectedExample.prompt}
                      </p>
                    </div>

                    {/* Information Section - Clickable Options */}
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mb-4">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>INFORMATION</span>
                      </div>
                      <div className="space-y-3">
                        {/* Model - Clickable with Dropdown */}
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-zinc-500">Model</span>
                            <button
                              onClick={() => { setShowModelDropdown(!showModelDropdown); setShowStyleDropdown(false); setShowRatioDropdown(false); setShowToolDropdown(false); }}
                              className="text-[13px] text-white font-medium bg-zinc-700/80 hover:bg-zinc-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              {modelOptions.find(m => m.id === selectedModel)?.label || 'Higgsfield Soul'}
                              <ChevronDown size={12} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          {showModelDropdown && (
                            <div className="absolute top-full right-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-30 shadow-2xl max-h-[200px] overflow-y-auto">
                              {modelOptions.map(model => (
                                <button
                                  key={model.id}
                                  onClick={() => { setSelectedModel(model.id); setShowModelDropdown(false); }}
                                  className={`w-full px-3 py-2 text-left hover:bg-zinc-700 transition-colors ${selectedModel === model.id ? 'bg-zinc-700' : ''}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-white">{model.label}</span>
                                    {model.tier === 'plus' && <Crown size={10} className="text-purple-400" />}
                                    {model.tier === 'pro' && <Crown size={10} className="text-amber-400" />}
                                  </div>
                                  <span className="text-[10px] text-zinc-500">{model.desc}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Style - Clickable with Dropdown */}
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-zinc-500">Style</span>
                            <button
                              onClick={() => { setShowStyleDropdown(!showStyleDropdown); setShowModelDropdown(false); setShowRatioDropdown(false); setShowToolDropdown(false); }}
                              className="text-[13px] text-zinc-300 bg-zinc-700/50 hover:bg-zinc-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              {language === 'vi' 
                                ? styleOptions.find(s => s.id === selectedStyle)?.labelVi 
                                : styleOptions.find(s => s.id === selectedStyle)?.label || 'Photograph'}
                              <ChevronDown size={12} className={`transition-transform ${showStyleDropdown ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          {showStyleDropdown && (
                            <div className="absolute top-full right-0 mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-30 shadow-2xl max-h-[200px] overflow-y-auto">
                              {styleOptions.map(style => (
                                <button
                                  key={style.id}
                                  onClick={() => { setSelectedStyle(style.id); setShowStyleDropdown(false); }}
                                  className={`w-full px-3 py-2 text-left text-[12px] hover:bg-zinc-700 transition-colors ${selectedStyle === style.id ? 'bg-zinc-700 text-purple-400' : 'text-white'}`}
                                >
                                  {language === 'vi' ? style.labelVi : style.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Ratio - Clickable with Dropdown */}
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-zinc-500">{language === 'vi' ? 'Tỉ lệ' : 'Ratio'}</span>
                            <button
                              onClick={() => { setShowRatioDropdown(!showRatioDropdown); setShowModelDropdown(false); setShowStyleDropdown(false); setShowToolDropdown(false); }}
                              className="text-[13px] text-zinc-300 bg-zinc-700/50 hover:bg-zinc-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              {selectedRatio}
                              <ChevronDown size={12} className={`transition-transform ${showRatioDropdown ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          {showRatioDropdown && (
                            <div className="absolute top-full right-0 mt-1 w-32 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-30 shadow-2xl">
                              {ratioOptions.map(ratio => (
                                <button
                                  key={ratio.id}
                                  onClick={() => { setSelectedRatio(ratio.id); setShowRatioDropdown(false); }}
                                  className={`w-full px-3 py-2 text-left text-[12px] hover:bg-zinc-700 transition-colors ${selectedRatio === ratio.id ? 'bg-zinc-700 text-purple-400' : 'text-white'}`}
                                >
                                  {ratio.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 border-t border-zinc-800/50 space-y-3 bg-zinc-900/50">
                    {/* Primary Action - Recreate with app gradient colors */}
                    <button
                      onClick={() => {
                        // Open RecreateView with example data
                        setRecreateData({
                          image: selectedExample.src,
                          prompt: selectedExample.prompt,
                          model: modelOptions.find(m => m.id === selectedModel)?.label || 'Higgsfield Soul',
                          style: styleOptions.find(s => s.id === selectedStyle)?.label || 'Photograph',
                          ratio: selectedRatio
                        });
                        setShowRecreateView(true);
                        setSelectedExample(null);
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-[1.02]"
                    >
                      <RefreshCw size={16} />
                      {language === 'vi' ? 'Tạo lại' : 'Recreate'}
                    </button>

                    {/* Secondary Actions Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedExample.src;
                          link.download = `${selectedExample.title.replace(/\s+/g, '-')}.jpg`;
                          link.click();
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-all duration-200"
                      >
                        <Download size={15} />
                        Download
                      </button>
                      <button 
                        onClick={() => {
                          // Open editor with example image
                          const imgSrc = selectedExample.src;
                          setSelectedExample(null);
                          onStartEditing(imgSrc);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-all duration-200"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Preview Modal */}
            {showGenerateModal && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
                  {/* Header - Fixed */}
                  <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-pink-500 to-repix-600 rounded-xl shadow-lg shadow-repix-500/20">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-zinc-900 dark:text-white">AI Generation</h2>
                        <p className="text-zinc-500 text-sm truncate max-w-[300px]">"{prompt}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Info badge */}
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400">
                        <span>{selectedRatio}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span>{imageCount} {imageCount === 1 ? 'image' : 'images'}</span>
                      </div>
                      <button 
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                      >
                        <ArrowRight size={20} className="rotate-45 text-zinc-500" />
                      </button>
                    </div>
                  </div>

                  {/* Content - Scrollable */}
                  <div className="p-6 overflow-y-auto flex-1 min-h-0">
                    {isGenerating ? (
                      <div className="text-center py-16 space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-repix-500 animate-spin"></div>
                          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500/20 to-repix-600/20 flex items-center justify-center">
                            <Sparkles size={24} className="text-repix-500 animate-pulse" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white mb-2">
                            {language === 'vi' ? 'Đang tạo ảnh...' : 'Generating variations...'}
                          </p>
                          <p className="text-zinc-500 text-sm mb-4">
                            {language === 'vi' 
                              ? `Đang tạo ${imageCount} ${imageCount === 1 ? 'ảnh' : 'ảnh'} với tỷ lệ ${selectedRatio}` 
                              : `Creating ${imageCount} unique ${imageCount === 1 ? 'image' : 'images'} at ${selectedRatio}`}
                          </p>
                          <div className="w-48 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mx-auto">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-repix-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(generateProgress, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-zinc-400 text-xs mt-3">{Math.round(Math.min(generateProgress, 100))}%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-center text-zinc-500 text-sm">
                          {language === 'vi' ? 'Chọn phiên bản yêu thích để chỉnh sửa' : 'Select your favorite variation to edit'}
                        </p>
                        {/* Dynamic grid based on image count - optimized for different ratios */}
                        <div className={`grid gap-3 sm:gap-4 ${
                          generatedImages.length === 1 
                            ? 'grid-cols-1 max-w-sm mx-auto' 
                            : generatedImages.length === 2 
                              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' 
                              : 'grid-cols-2 lg:grid-cols-4'
                        }`}>
                          {generatedImages.map((img, index) => {
                            // Get current ratio for aspect ratio styling
                            const currentRatio = ratioOptions.find(r => r.id === selectedRatio) || ratioOptions[0];
                            const aspectRatioStyle = `${currentRatio.width}/${currentRatio.height}`;
                            // Limit max height for tall ratios
                            const isPortrait = currentRatio.height > currentRatio.width;
                            const maxHeightClass = isPortrait ? 'max-h-[300px] sm:max-h-[400px]' : '';
                            
                            return (
                              <div
                                key={index}
                                className={`relative rounded-2xl overflow-hidden group transition-all duration-300 cursor-pointer ${maxHeightClass} ${
                                  selectedImage === index 
                                    ? 'ring-4 ring-repix-500 shadow-xl shadow-repix-500/20 scale-[1.02]' 
                                    : 'ring-2 ring-zinc-200 dark:ring-zinc-700 hover:ring-repix-300 hover:shadow-lg'
                                }`}
                                style={{ aspectRatio: aspectRatioStyle }}
                                onClick={() => setSelectedImage(index)}
                              >
                                <img 
                                  src={img} 
                                  alt={`Variation ${index + 1}`} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                                {/* Overlay */}
                                <div className={`absolute inset-0 transition-all duration-300 ${
                                  selectedImage === index 
                                    ? 'bg-gradient-to-t from-repix-600/40 via-transparent to-transparent' 
                                    : 'bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100'
                                }`}></div>
                                
                                {/* Top badges */}
                                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md transition-all ${
                                    selectedImage === index 
                                      ? 'bg-repix-500 text-white shadow-lg' 
                                      : 'bg-black/40 text-white'
                                  }`}>
                                    {selectedImage === index ? '✓ Selected' : `V${index + 1}`}
                                  </div>
                                  <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-medium">
                                    {selectedRatio}
                                  </div>
                                </div>
                                
                                {/* Bottom info */}
                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                  <div className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-medium">
                                    {['Best Match', 'Creative', 'Vibrant', 'Minimal'][index] || `Style ${index + 1}`}
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    {/* Preview Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewImage({ url: img, index });
                                      }}
                                      className="p-2 rounded-lg bg-white/90 hover:bg-white text-zinc-700 hover:text-repix-600 transition-all shadow-lg backdrop-blur-md"
                                      title={language === 'vi' ? 'Xem toàn màn hình' : 'View fullscreen'}
                                    >
                                      <Maximize2 size={14} />
                                    </button>
                                    {/* Download Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadImage(img, index);
                                      }}
                                      className="p-2 rounded-lg bg-white/90 hover:bg-white text-zinc-700 hover:text-repix-600 transition-all shadow-lg backdrop-blur-md"
                                      title="Download"
                                    >
                                      <Download size={14} />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Selection indicator */}
                                {selectedImage === index && (
                                  <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-repix-500/20 animate-ping"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Selection hint */}
                        {selectedImage === null && (
                          <p className="text-center text-zinc-400 text-xs animate-pulse">
                            {language === 'vi' ? '👆 Nhấn vào ảnh để chọn' : '👆 Click on an image to select'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer - Fixed */}
                  {!isGenerating && generatedImages.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex-shrink-0">
                      <Button variant="outline" onClick={handleCloseModal} className="w-full sm:w-auto">
                        {language === 'vi' ? 'Hủy' : 'Cancel'}
                      </Button>
                      <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          onClick={handleDownloadSelected}
                          disabled={selectedImage === null}
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Download size={14} className="mr-1.5" /> 
                          <span className="hidden sm:inline">Download</span>
                          <span className="sm:hidden">Save</span>
                        </Button>
                        <Button variant="outline" onClick={handleGenerate} size="sm" className="flex-1 sm:flex-none">
                          <Sparkles size={14} className="mr-1.5" /> 
                          <span className="hidden sm:inline">Regenerate</span>
                          <span className="sm:hidden">Redo</span>
                        </Button>
                        <Button 
                          disabled={selectedImage === null}
                          onClick={handleApplyAndEdit}
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-repix-600 flex-1 sm:flex-none min-w-[120px]"
                        >
                          <Wand2 size={14} className="mr-1.5" /> 
                          {language === 'vi' ? 'Chỉnh sửa' : 'Edit in Studio'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit Confirm Dialog */}
                {showEditConfirm && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/20 to-repix-600/20 flex items-center justify-center">
                          <Wand2 size={28} className="text-repix-500" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                          {language === 'vi' ? 'Chỉnh sửa nâng cao?' : 'Advanced Editing?'}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                          {language === 'vi' 
                            ? 'Bạn có muốn mở ảnh này trong Studio để chỉnh sửa nâng cao với đầy đủ công cụ AI?' 
                            : 'Do you want to open this image in Studio for advanced editing with full AI tools?'}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowEditConfirm(false)}
                        >
                          {language === 'vi' ? 'Hủy' : 'Cancel'}
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-pink-500 to-repix-600"
                          onClick={handleConfirmEdit}
                        >
                          <Wand2 size={16} className="mr-2" />
                          {language === 'vi' ? 'Vào Studio' : 'Open Studio'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Screen Preview Modal */}
                {previewImage && (
                  <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-[70] flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                    >
                      <X size={24} />
                    </button>

                    {/* Navigation arrows */}
                    {generatedImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newIndex = previewImage.index === 0 ? generatedImages.length - 1 : previewImage.index - 1;
                            setPreviewImage({ url: generatedImages[newIndex], index: newIndex });
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                        >
                          <ArrowRight size={24} className="rotate-180" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newIndex = previewImage.index === generatedImages.length - 1 ? 0 : previewImage.index + 1;
                            setPreviewImage({ url: generatedImages[newIndex], index: newIndex });
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                        >
                          <ArrowRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Image */}
                    <div 
                      className="relative max-w-[90vw] max-h-[85vh] animate-in zoom-in-95 duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img 
                        src={previewImage.url} 
                        alt={`Preview ${previewImage.index + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                      />
                      
                      {/* Bottom toolbar */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-md">
                              V{previewImage.index + 1} • {['Best Match', 'Creative', 'Vibrant', 'Minimal'][previewImage.index] || `Style ${previewImage.index + 1}`}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-md">
                              {selectedRatio}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedImage(previewImage.index);
                                setPreviewImage(null);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-repix-500 hover:bg-repix-600 text-white text-sm font-medium transition-colors"
                            >
                              <Check size={16} />
                              {language === 'vi' ? 'Chọn ảnh này' : 'Select this'}
                            </button>
                            <button
                              onClick={() => handleDownloadImage(previewImage.url, previewImage.index)}
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium backdrop-blur-md transition-colors"
                            >
                              <Download size={16} />
                              {language === 'vi' ? 'Tải xuống' : 'Download'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Image counter */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-md">
                        {previewImage.index + 1} / {generatedImages.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- SECTION: COMMUNITY FEED --- */}
            <div className="mb-20">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    {language === 'vi' ? 'Cộng đồng sáng tạo' : 'Community Creations'}
                  </h2>
               </div>

               {/* --- SIMPLE IMAGES (Single) --- */}
               <div className="mb-12">
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                       <ImageIcon size={18} className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                         {language === 'vi' ? 'Ảnh đơn' : 'Single Images'}
                       </h3>
                       <p className="text-sm text-zinc-500">{language === 'vi' ? 'Tác phẩm nổi bật từ cộng đồng' : 'Featured works from community'}</p>
                     </div>
                   </div>
                   <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                     {language === 'vi' ? 'Xem tất cả' : 'View all'} <ArrowRight size={14} className="ml-1" />
                   </Button>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                   {[
                     { id: 1, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=500&q=80', prompt: 'Fashion portrait with natural lighting', author: '@studio_pro', likes: '2.4k' },
                     { id: 2, src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=400&q=80', prompt: 'Product shot with dramatic shadows', author: '@product_master', likes: '1.8k' },
                     { id: 3, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=500&q=80', prompt: 'Lifestyle portrait outdoor', author: '@lifestyle_vn', likes: '3.1k' },
                     { id: 4, src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=400&q=80', prompt: 'Minimalist watch photography', author: '@minimal_shots', likes: '1.5k' },
                     { id: 5, src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=500&q=80', prompt: 'Beauty portrait studio', author: '@beauty_art', likes: '2.9k' },
                     { id: 6, src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=400&h=400&q=80', prompt: 'Sneaker product photography', author: '@kicks_studio', likes: '2.2k' },
                   ].map((img) => (
                     <div 
                       key={img.id} 
                       className="relative group rounded-2xl overflow-hidden cursor-pointer bg-zinc-100 dark:bg-zinc-800 aspect-[4/5]"
                       onClick={() => onStartEditing()}
                     >
                       <img 
                         src={img.src} 
                         alt={img.prompt} 
                         className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                         <div className="absolute bottom-0 left-0 right-0 p-3">
                           <p className="text-white text-xs font-medium line-clamp-2 mb-2">{img.prompt}</p>
                           <div className="flex items-center justify-between">
                             <span className="text-white/70 text-[10px]">{img.author}</span>
                             <span className="flex items-center gap-1 text-white/70 text-[10px]">
                               <Heart size={10} /> {img.likes}
                             </span>
                           </div>
                         </div>
                       </div>
                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-zinc-700 shadow-lg">
                           <Download size={12} />
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* --- COLLECTIONS (Multiple Images) --- */}
               <div>
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                       <Layers size={18} className="text-white" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                         {language === 'vi' ? 'Bộ sưu tập' : 'Collections'}
                       </h3>
                       <p className="text-sm text-zinc-500">{language === 'vi' ? 'Bộ ảnh theo chủ đề từ creators' : 'Themed photo sets from creators'}</p>
                     </div>
                   </div>
                   <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                     {language === 'vi' ? 'Xem tất cả' : 'View all'} <ArrowRight size={14} className="ml-1" />
                   </Button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {[
                     { 
                       id: 1, 
                       title: language === 'vi' ? 'Thời trang mùa hè' : 'Summer Fashion',
                       author: '@fashion_studio',
                       count: 12,
                       images: [
                         'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&h=400&q=80',
                         'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&h=400&q=80',
                         'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&h=400&q=80',
                         'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&h=400&q=80',
                       ],
                       likes: '5.2k'
                     },
                     { 
                       id: 2, 
                       title: language === 'vi' ? 'Sản phẩm công nghệ' : 'Tech Products',
                       author: '@tech_visuals',
                       count: 8,
                       images: [
                         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&h=300&q=80',
                         'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&h=300&q=80',
                         'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=300&h=300&q=80',
                         'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=300&h=300&q=80',
                       ],
                       likes: '3.8k'
                     },
                     { 
                       id: 3, 
                       title: language === 'vi' ? 'Chân dung nghệ thuật' : 'Artistic Portraits',
                       author: '@portrait_art',
                       count: 15,
                       images: [
                         'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&h=400&q=80',
                         'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=400&q=80',
                         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400&q=80',
                         'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=400&q=80',
                       ],
                       likes: '7.1k'
                     },
                   ].map((collection) => (
                     <div 
                       key={collection.id}
                       className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-repix-500/50 hover:shadow-xl hover:shadow-repix-500/10 transition-all duration-300 cursor-pointer"
                       onClick={() => onStartEditing()}
                     >
                       {/* Image Grid Preview */}
                       <div className="grid grid-cols-4 gap-0.5 p-1">
                         {collection.images.map((img, idx) => (
                           <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                             <img 
                               src={img} 
                               alt="" 
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                             />
                           </div>
                         ))}
                       </div>
                       
                       {/* Collection Info */}
                       <div className="p-4">
                         <div className="flex items-start justify-between mb-2">
                           <div>
                             <h4 className="font-bold text-zinc-900 dark:text-white group-hover:text-repix-500 transition-colors">
                               {collection.title}
                             </h4>
                             <p className="text-sm text-zinc-500">{collection.author}</p>
                           </div>
                           <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                             <Layers size={12} />
                             {collection.count}
                           </div>
                         </div>
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-1 text-zinc-500 text-sm">
                             <Heart size={14} /> {collection.likes}
                           </div>
                           <Button size="sm" variant="ghost" className="h-7 text-xs px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             {language === 'vi' ? 'Xem bộ sưu tập' : 'View collection'} <ArrowRight size={12} className="ml-1" />
                           </Button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            {/* --- SECTION 5: PRICING (Monetization - Enhanced) --- */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">{trans.home.pricingTitle}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">{trans.home.pricingDesc}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 px-4">
                 {plans.map((plan, i) => (
                   <div 
                     key={i} 
                     className={`
                       group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500
                       ${plan.primary 
                         ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 scale-105 z-10 shadow-2xl shadow-repix-500/30' 
                         : 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:border-repix-500/30 hover:shadow-repix-500/10'
                       }
                     `}
                   >
                      {/* Pro Plan Animated Background */}
                      {plan.primary && (
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-repix-500/20 blur-[80px] rounded-full group-hover:bg-pink-500/30 transition-colors duration-500"></div>
                           <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/20 blur-[80px] rounded-full group-hover:bg-repix-500/30 transition-colors duration-500"></div>
                        </div>
                      )}

                      {/* "Most Popular" Badge */}
                      {plan.primary && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <div className="bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                            <Star size={12} fill="currentColor" /> Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${plan.primary ? 'bg-white/10 dark:bg-zinc-900/10 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 ' + plan.color}`}>
                             <plan.icon size={24} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${plan.primary ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>{plan.name}</h3>
                            <p className={`text-xs font-medium ${plan.primary ? 'text-white/60 dark:text-zinc-500' : 'text-zinc-400'}`}>{plan.userType}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                           <div className="flex items-baseline gap-1">
                             <span className={`text-4xl font-extrabold tracking-tight ${plan.primary ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>{plan.price}</span>
                             {plan.price !== 'Custom' && plan.price !== 'Free' && <span className={`text-sm font-medium ${plan.primary ? 'text-white/60 dark:text-zinc-500' : 'text-zinc-500'}`}>{trans.home.month}</span>}
                           </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 mb-8 flex-1">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-3 group/item">
                               <div className={`mt-0.5 p-0.5 rounded-full ${plan.primary ? 'bg-white/20 dark:bg-zinc-900/10' : 'bg-repix-100 dark:bg-repix-900/30'}`}>
                                 <Check size={12} className={`shrink-0 ${plan.primary ? 'text-white dark:text-zinc-900' : 'text-repix-600 dark:text-repix-400'}`} />
                               </div>
                               <span className={`text-sm transition-colors ${plan.primary ? 'text-white/80 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-zinc-900' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <Button 
                          variant={plan.primary ? 'primary' : 'outline'} 
                          className={`w-full h-12 rounded-xl font-bold transition-transform duration-300 group-hover:scale-[1.02] active:scale-95 ${
                            plan.primary 
                              ? 'bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border-0 shadow-lg' 
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:border-zinc-700'
                          }`}
                        >
                           {plan.cta}
                        </Button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

          </div>
       </div>
       
       {/* Asset Picker Modal */}
       {showAssetPicker && (
         <AssetPickerModal
           isOpen={showAssetPicker}
           onClose={() => setShowAssetPicker(false)}
           maxSelection={MAX_PROMPT_IMAGES - uploadedImages.length}
           onSelectMultiple={(assets) => {
             const remainingSlots = MAX_PROMPT_IMAGES - uploadedImages.length;
             if (assets.length > remainingSlots) {
               setShowMaxImagesWarning(true);
               setTimeout(() => setShowMaxImagesWarning(false), 3000);
             }
             const newImages = assets.slice(0, remainingSlots).map((asset, idx) => ({
               id: `asset-${Date.now()}-${idx}`,
               file: new File([], asset.name),
               preview: asset.src,
             }));
             if (newImages.length > 0) {
               setUploadedImages(prev => [...prev, ...newImages].slice(0, MAX_PROMPT_IMAGES));
             }
             setShowAssetPicker(false);
           }}
           onSelectAsset={(asset) => {
             if (uploadedImages.length >= MAX_PROMPT_IMAGES) {
               setShowMaxImagesWarning(true);
               setTimeout(() => setShowMaxImagesWarning(false), 3000);
               return;
             }
             const newImage = {
               id: `asset-${Date.now()}`,
               file: new File([], asset.name),
               preview: asset.src,
             };
             setUploadedImages(prev => [...prev, newImage].slice(0, MAX_PROMPT_IMAGES));
             setShowAssetPicker(false);
           }}
         />
       )}

       {/* Recreate View Modal */}
       {showRecreateView && recreateData && (
         <RecreateView
           onClose={() => {
             setShowRecreateView(false);
             setRecreateData(null);
           }}
           originalImage={recreateData.image}
           originalPrompt={recreateData.prompt}
           generationInfo={{
             model: recreateData.model,
             style: recreateData.style,
             ratio: recreateData.ratio,
           }}
         />
       )}
    </div>
  )
}

const AppContent: React.FC = () => {
  // Load authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('repix_authenticated');
    return saved === 'true';
  });
  const [view, setView] = useState<ViewState>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialEditorImage, setInitialEditorImage] = useState<string | undefined>(undefined);
  const [initialEditorRatio, setInitialEditorRatio] = useState<string | undefined>(undefined);

  // Save authentication state to localStorage
  useEffect(() => {
    localStorage.setItem('repix_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Check if user has completed onboarding (using localStorage)
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('repix_onboarding_completed');
    if (isAuthenticated && !hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('repix_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('repix_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('repix_authenticated');
    localStorage.removeItem('repix_onboarding_completed');
    setView('landing');
  };

  // Navigate to landing page (for logo click)
  const handleGoToLanding = () => {
    setView('landing');
  };

  const handleStartEditing = (image?: string, ratio?: string) => {
    if (image) {
      setInitialEditorImage(image);
    }
    if (ratio) {
      setInitialEditorRatio(ratio);
    }
    setView('editor');
  };

  // Show Onboarding for new users
  if (isAuthenticated && showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // Handle Authentication Flow
  if (view === 'auth') {
    return (
      <AuthPage 
        onBack={() => setView('landing')} 
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setView('home');
        }} 
      />
    );
  }

  // Show Landing Page (both authenticated and non-authenticated)
  if (view === 'landing') {
    return (
      <LandingPage 
        onLogin={() => setView('auth')} 
        onSignup={() => setView('auth')}
        isAuthenticated={isAuthenticated}
        onTryRepix={() => {
          if (!isAuthenticated) {
            setIsAuthenticated(true); // Auto login for Try Repix
          }
          setView('home');
        }}
        onGoToApp={() => setView('home')}
      />
    );
  }

  // Wrap Main App in Layout (only for authenticated users in app views)
  if (!isAuthenticated) {
    return (
      <LandingPage 
        onLogin={() => setView('auth')} 
        onSignup={() => setView('auth')}
        isAuthenticated={false}
        onTryRepix={() => {
          setIsAuthenticated(true);
          setView('home');
        }}
        onGoToApp={() => setView('home')}
      />
    );
  }

  return (
    <Layout currentView={view} onChangeView={setView} onSignOut={handleSignOut} onGoToLanding={handleGoToLanding}>
      {view === 'home' && <HomeView onStartEditing={handleStartEditing} />}
      {view === 'editor' && <EditorView initialImage={initialEditorImage} initialRatio={initialEditorRatio} />}
      {view === 'photoshoot' && <SmartPhotoshootView onNavigateToEditor={(imageUrl: string) => {
        setInitialEditorImage(imageUrl);
        setView('editor');
      }} />}
      {view === 'assets' && <AssetLibrary />}
      {view === 'brandkit' && <BrandKitView />}
      {view === 'marketplace' && <MarketplaceView onNavigateToPublish={() => {
        setView('profile');
        // Set a flag to open published tab
        localStorage.setItem('repix_open_published', 'true');
      }} />}
      {view === 'team' && <TeamView />}
      {view === 'analytics' && <AnalyticsView />}
      {view === 'settings' && <SettingsPanel />}
      {view === 'profile' && <ProfileView />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <BrandKitProvider>
            <AppContent />
            <UpgradeModal />
          </BrandKitProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
