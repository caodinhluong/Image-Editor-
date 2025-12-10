
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { EditorView } from './components/Editor/EditorView';
import { MarketplaceView } from './components/Marketplace/MarketplaceView';
import { TeamView } from './components/Team/TeamView';
import { ProfileView } from './components/Profile/ProfileView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { CreatorDashboard } from './components/Creator/CreatorDashboard';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { LandingPage } from './components/Landing/LandingPage';
import { AuthPage } from './components/Auth/AuthPage';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { ViewState } from './types';
import { 
  Sparkles, ArrowRight, Image as ImageIcon, Scissors, Layers, Maximize2, Wand2, Search, Play,
  ShoppingBag, Camera, Briefcase, Zap, Crown, Check, ShieldCheck, Building2, Star,
  Paperclip, X, ImagePlus
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
const HomeView: React.FC<{ onStartEditing: (image?: string) => void }> = ({ onStartEditing }) => {
  const { trans, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState(0);
  
  // Image Upload States
  const [uploadedImages, setUploadedImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Simulate AI Generation
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerateProgress(100);
      setIsGenerating(false);
      setGeneratedImages([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=750&fit=crop',
      ]);
    }, 3000);
  };

  const handleApplyAndEdit = () => {
    if (selectedImage === null) return;
    onStartEditing(generatedImages[selectedImage]);
    setShowGenerateModal(false);
    setGeneratedImages([]);
    setPrompt('');
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

                   {/* Main Input Row */}
                   <div className="flex items-end gap-2">
                     {/* Hidden File Input */}
                     <input
                       ref={fileInputRef}
                       type="file"
                       accept="image/*"
                       multiple
                       onChange={handleImageUpload}
                       className="hidden"
                     />
                     
                     {/* Upload Button */}
                     <button
                       onClick={() => fileInputRef.current?.click()}
                       className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/20 transition-colors shrink-0"
                       title="Upload image (Ctrl+V to paste)"
                     >
                       <Paperclip size={20} />
                     </button>

                     {/* Textarea */}
                     <textarea 
                       placeholder={uploadedImages.length > 0 ? "Describe what to do with these images..." : trans.home.placeholder}
                       value={prompt}
                       onChange={(e) => {
                         setPrompt(e.target.value);
                         // Auto-resize logic
                         const textarea = e.target;
                         textarea.style.height = 'auto';
                         const maxH = window.innerWidth < 768 ? 150 : 200;
                         const newHeight = Math.max(48, Math.min(textarea.scrollHeight, maxH));
                         textarea.style.height = newHeight + 'px';
                       }}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleGenerate();
                         }
                       }}
                       onPaste={handlePasteImage}
                       className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-lg px-4 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none overflow-y-auto transition-[height] duration-150 ease-out"
                       style={{ minHeight: '48px', maxHeight: window.innerWidth < 768 ? '150px' : '200px' }}
                       rows={1}
                     />
                     
                     {/* Generate Button */}
                     <Button 
                       size="lg" 
                       className="rounded-xl h-12 px-6 shadow-lg shadow-repix-500/20 shrink-0" 
                       onClick={handleGenerate} 
                       disabled={!prompt.trim() && uploadedImages.length === 0}
                     >
                       {trans.home.generate}
                     </Button>
                   </div>
                </div>
              </div>
            </div>

            {/* Generate Preview Modal */}
            {showGenerateModal && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-pink-500 to-repix-600 rounded-xl">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-zinc-900 dark:text-white">AI Generation</h2>
                        <p className="text-zinc-500 text-sm truncate max-w-[300px]">"{prompt}"</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                      <ArrowRight size={20} className="rotate-45 text-zinc-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
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
                          <p className="font-semibold text-zinc-900 dark:text-white mb-2">Generating variations...</p>
                          <p className="text-zinc-500 text-sm mb-4">Creating 4 unique options for you</p>
                          <div className="w-48 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mx-auto">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-repix-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(generateProgress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-center text-zinc-500 text-sm">Select your favorite variation to edit</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {generatedImages.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(index)}
                              className={`relative aspect-[4/5] rounded-xl overflow-hidden group transition-all duration-300 ${
                                selectedImage === index 
                                  ? 'ring-4 ring-repix-500 scale-[1.02]' 
                                  : 'ring-2 ring-zinc-200 dark:ring-zinc-700 hover:ring-zinc-400'
                              }`}
                            >
                              <img src={img} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                              <div className={`absolute inset-0 transition-opacity ${selectedImage === index ? 'bg-repix-500/20' : 'bg-black/0 group-hover:bg-black/20'}`}></div>
                              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                                selectedImage === index ? 'bg-repix-500 text-white' : 'bg-black/50 text-white'
                              }`}>
                                {selectedImage === index ? '✓ Selected' : `V${index + 1}`}
                              </div>
                              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                                {['Best Match', 'Creative', 'Vibrant', 'Minimal'][index]}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {!isGenerating && generatedImages.length > 0 && (
                    <div className="flex items-center justify-between p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                      <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleGenerate}>
                          <Sparkles size={16} className="mr-2" /> Regenerate
                        </Button>
                        <Button 
                          disabled={selectedImage === null}
                          onClick={handleApplyAndEdit}
                          className="bg-gradient-to-r from-pink-500 to-repix-600"
                        >
                          <Wand2 size={16} className="mr-2" /> Edit in Studio
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-pink-500" /> {trans.home.inspiration}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab(activeTab === 'trending' ? 'recent' : 'trending')}>
                    {activeTab === 'trending' ? trans.home.recent : trans.home.trending} <ArrowRight size={14} className="ml-1" />
                  </Button>
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialEditorImage, setInitialEditorImage] = useState<string | undefined>(undefined);

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
    setView('landing');
  };

  const handleStartEditing = (image?: string) => {
    if (image) {
      setInitialEditorImage(image);
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
  if (!isAuthenticated) {
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
    return (
      <LandingPage 
        onLogin={() => setView('auth')} 
        onSignup={() => setView('auth')} 
      />
    );
  }

  // Wrap Main App in Layout
  return (
    <Layout currentView={view} onChangeView={setView} onSignOut={handleSignOut}>
      {view === 'home' && <HomeView onStartEditing={handleStartEditing} />}
      {view === 'editor' && <EditorView initialImage={initialEditorImage} />}
      {view === 'assets' && <AssetLibrary />}
      {view === 'brandkit' && <BrandKitView />}
      {view === 'marketplace' && <MarketplaceView />}
      {view === 'team' && <TeamView />}
      {view === 'analytics' && <AnalyticsView />}
      {view === 'creator' && <CreatorDashboard />}
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
