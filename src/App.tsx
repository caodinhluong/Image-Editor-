
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
  Paperclip, X, ImagePlus, Download
} from 'lucide-react';
import { Button, Card, Badge } from './components/ui/UIComponents';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrandKitProvider } from './contexts/BrandKitContext';
import { BrandKitView } from './components/BrandKit/BrandKitView';
import { AssetLibrary } from './components/Assets/AssetLibrary';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { UpgradeModal } from './components/Subscription/UpgradeModal';

// --- Modern Home Dashboard View ---
const HomeView: React.FC<{ onStartEditing: (image?: string, ratio?: string) => void }> = ({ onStartEditing }) => {
  const { trans, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  
  // Image Upload States
  const [uploadedImages, setUploadedImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generation Options States
  const [selectedModel, setSelectedModel] = useState('standard');
  const [selectedStyle, setSelectedStyle] = useState('photograph');
  const [selectedRatio, setSelectedRatio] = useState('3:2');
  const [imageCount, setImageCount] = useState(2);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);
  
  // Example Preview Modal State
  const [selectedExample, setSelectedExample] = useState<{ title: string; src: string; prompt: string } | null>(null);
  const [showMoreExamples, setShowMoreExamples] = useState(false);
  
  // Full screen preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; index: number } | null>(null);
  
  // Options Data
  const modelOptions = [
    { id: 'standard', label: 'Standard', labelVi: 'Tiêu chuẩn' },
    { id: 'creative', label: 'Creative', labelVi: 'Sáng tạo' },
    { id: 'realistic', label: 'Realistic', labelVi: 'Chân thực' },
    { id: 'anime', label: 'Anime', labelVi: 'Anime' },
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
    const newImages = files.slice(0, 4 - uploadedImages.length).map((file: File, idx: number) => ({
      id: `upload-${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages].slice(0, 4));
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
        if (file && uploadedImages.length < 4) {
          const newImage = {
            id: `paste-${Date.now()}`,
            file,
            preview: URL.createObjectURL(file)
          };
          setUploadedImages(prev => [...prev, newImage].slice(0, 4));
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
                       {uploadedImages.length < 4 && (
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
                       
                       {/* Reference Image Button */}
                       <button
                         onClick={() => fileInputRef.current?.click()}
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/20 transition-colors"
                       >
                         <ImagePlus size={14} />
                         {language === 'vi' ? 'Ảnh tham chiếu' : 'Reference image'}
                       </button>

                       {/* Model Dropdown */}
                       <div className="relative">
                         <button 
                           onClick={() => { setShowModelDropdown(!showModelDropdown); setShowStyleDropdown(false); setShowRatioDropdown(false); }}
                           className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                         >
                           Model: {modelOptions.find(m => m.id === selectedModel)?.[language === 'vi' ? 'labelVi' : 'label']}
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                         </button>
                         {showModelDropdown && (
                           <div className="absolute top-full left-0 mt-1 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-20 min-w-[140px]">
                             {modelOptions.map(opt => (
                               <button
                                 key={opt.id}
                                 onClick={() => { setSelectedModel(opt.id); setShowModelDropdown(false); }}
                                 className={`w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${selectedModel === opt.id ? 'text-repix-500 font-medium' : 'text-zinc-600 dark:text-zinc-400'}`}
                               >
                                 {language === 'vi' ? opt.labelVi : opt.label}
                               </button>
                             ))}
                           </div>
                         )}
                       </div>

                       {/* Style Dropdown */}
                       <div className="relative">
                         <button 
                           onClick={() => { setShowStyleDropdown(!showStyleDropdown); setShowModelDropdown(false); setShowRatioDropdown(false); }}
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
                           onClick={() => { setShowRatioDropdown(!showRatioDropdown); setShowModelDropdown(false); setShowStyleDropdown(false); }}
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
                </div>
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

            {/* Example Preview Modal */}
            {selectedExample && (
              <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setSelectedExample(null)}
              >
                <div 
                  className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedExample(null)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 transition-colors shadow-lg"
                  >
                    <X size={20} className="text-zinc-600 dark:text-zinc-400" />
                  </button>

                  {/* Title */}
                  <div className="text-center py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {selectedExample.title}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={selectedExample.src}
                        alt={selectedExample.title}
                        className="w-full md:w-72 h-auto rounded-xl shadow-lg"
                      />
                    </div>

                    {/* Prompt Card */}
                    <div className="flex-1 flex flex-col">
                      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 flex-1">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                          AI Art Image Prompt
                        </h3>
                        
                        <div className="mb-3">
                          <p className="text-xs text-zinc-500 mb-1">Prompt:</p>
                          <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              {selectedExample.prompt}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedExample.prompt);
                          }}
                          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-repix-500 transition-colors ml-auto"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {language === 'vi' ? 'Sao chép Prompt' : 'Copy Prompt'}
                        </button>
                      </div>

                      {/* Open in Editor Button */}
                      <Button
                        onClick={() => {
                          setPrompt(selectedExample.prompt);
                          setSelectedExample(null);
                          onStartEditing(selectedExample.src);
                        }}
                        className="w-full mt-4 gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        <Sparkles size={16} />
                        {language === 'vi' ? 'Mở trong Editor' : 'Open in editor'}
                      </Button>
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

            {/* --- SECTION 2: QUICK ACTIONS (Casual / Fast) --- */}
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

            {/* --- SECTION 3: WORKFLOWS (Pro / Seller / Agency) --- */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-repix-500" /> {trans.home.workflows}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workflows.map((wf) => (
                  <div key={wf.id} onClick={() => onStartEditing()} className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 hover:border-repix-500/50 transition-all">
                    <div className={`absolute top-0 right-0 p-2 bg-gradient-to-bl ${wf.color} opacity-10 group-hover:opacity-20 rounded-bl-3xl transition-opacity w-24 h-24`}></div>
                    <div className="flex items-start justify-between mb-4">
                       <div className={`p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-white group-hover:bg-gradient-to-br ${wf.color} transition-colors`}>
                          <wf.icon size={24} />
                       </div>
                       <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-0">{wf.persona}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{wf.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{wf.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SECTION 4: INSPIRATION (Community) --- */}
            <div className="mb-20">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-pink-500" /> {trans.home.inspiration}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab(activeTab === 'trending' ? 'recent' : 'trending')}>
                    {activeTab === 'trending' ? trans.home.recent : trans.home.trending} <ArrowRight size={14} className="ml-1" />
                  </Button>
               </div>

               {/* Filter Tabs */}
               <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                 {[
                   { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All', icon: null },
                   { id: 'product', label: language === 'vi' ? 'Sản phẩm' : 'Product', icon: ShoppingBag },
                   { id: 'portrait', label: language === 'vi' ? 'Chân dung' : 'Portrait', icon: Camera },
                   { id: 'fashion', label: language === 'vi' ? 'Thời trang' : 'Fashion', icon: Briefcase },
                   { id: 'food', label: language === 'vi' ? 'Ẩm thực' : 'Food', icon: null },
                   { id: 'nature', label: language === 'vi' ? 'Thiên nhiên' : 'Nature', icon: null },
                   { id: 'art', label: language === 'vi' ? 'Nghệ thuật' : 'Art', icon: Sparkles },
                 ].map((filter) => (
                   <button
                     key={filter.id}
                     onClick={() => setActiveTab(filter.id as any)}
                     className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                       activeTab === filter.id || (filter.id === 'all' && (activeTab === 'trending' || activeTab === 'recent'))
                         ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                         : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                     }`}
                   >
                     {filter.icon && <filter.icon size={14} />}
                     {filter.label}
                   </button>
                 ))}
               </div>
               
               <div className="columns-2 md:columns-4 gap-4 space-y-4">
                  {inspirationImages.map((img) => (
                     <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => onStartEditing()}>
                        <img src={img.src} alt={img.prompt} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                           <p className="text-white text-sm font-medium line-clamp-2 mb-2">{img.prompt}</p>
                           <Button size="sm" className="h-7 text-xs px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border-0 w-full">
                                 {trans.home.remix}
                           </Button>
                        </div>
                     </div>
                  ))}
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
      {view === 'assets' && <AssetLibrary />}
      {view === 'brandkit' && <BrandKitView />}
      {view === 'marketplace' && <MarketplaceView />}
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
