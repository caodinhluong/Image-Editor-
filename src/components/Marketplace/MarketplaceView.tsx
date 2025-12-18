
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Heart, TrendingUp, Crown, User, 
  Download, Star, SlidersHorizontal, Check, ArrowUpRight, X,
  Image as ImageIcon, UploadCloud, DollarSign, Tag, Sparkles, AlertCircle,
  Beaker, Play, Save, Settings2, Plus, RefreshCw, Wand2, Layers,
  Share2, Copy, Scan, SplitSquareHorizontal, ArrowRight, HardDrive, Link as LinkIcon, CheckCircle2, Lock, ChevronDown
} from 'lucide-react';
import { Button, Input, Badge, Card, Slider } from '../ui/UIComponents';
import { Template } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { ShareGenerationModal } from './ShareGenerationModal';
import { RecreateView } from './RecreateView';
import { TemplateDetailModal } from './TemplateDetailModal';
import { RecreateSetupView } from './RecreateSetupView';
import { CollectionDetailModal } from './CollectionDetailModal';
import { getToolById } from '../../data/stations';

interface ExtendedTemplate extends Template {
  downloads: string;
  likes: string;
  category: string;
  style: string;
  description?: string;
  gallery?: string[]; // Multiple preview images
}

// Main template types - will be translated via trans object
const getTemplateTypes = (trans: any) => [
  { id: 'ecommerce', name: trans.marketplace.typeEcommerce },
  { id: 'social', name: trans.marketplace.typeSocial },
  { id: 'marketing', name: trans.marketplace.typeMarketing },
  { id: 'branding', name: trans.marketplace.typeBranding },
  { id: 'print', name: trans.marketplace.typePrint },
];

// Platform categories - will be translated via trans object
const getEcommercePlatforms = (trans: any) => [
  { id: 'all', name: trans.marketplace.all },
  { id: 'shopee', name: trans.marketplace.shopee },
  { id: 'lazada', name: trans.marketplace.lazada },
  { id: 'tiktok', name: trans.marketplace.tiktokShop },
  { id: 'facebook', name: trans.marketplace.facebook },
  { id: 'instagram', name: trans.marketplace.instagram },
  { id: 'zalo', name: trans.marketplace.zaloShop },
  { id: 'sendo', name: trans.marketplace.sendo },
];

const getSocialPlatforms = (trans: any) => [
  { id: 'all', name: trans.marketplace.all },
  { id: 'facebook', name: trans.marketplace.facebook },
  { id: 'instagram', name: trans.marketplace.instagram },
  { id: 'tiktok', name: trans.marketplace.tiktok },
  { id: 'youtube', name: trans.marketplace.youtube },
  { id: 'twitter', name: trans.marketplace.twitter },
  { id: 'linkedin', name: trans.marketplace.linkedin },
  { id: 'threads', name: trans.marketplace.threads },
];

const getMarketingPlatforms = (trans: any) => [
  { id: 'all', name: trans.marketplace.all },
  { id: 'ads', name: trans.marketplace.ads },
  { id: 'email', name: trans.marketplace.emailMarketing },
  { id: 'landing', name: trans.marketplace.landingPage },
  { id: 'banner', name: trans.marketplace.banner },
  { id: 'popup', name: trans.marketplace.popup },
];

const getBrandingPlatforms = (trans: any) => [
  { id: 'all', name: trans.marketplace.all },
  { id: 'logo', name: trans.marketplace.logo },
  { id: 'namecard', name: trans.marketplace.nameCard },
  { id: 'letterhead', name: trans.marketplace.letterhead },
  { id: 'presentation', name: trans.marketplace.presentation },
  { id: 'brand-kit', name: trans.marketplace.brandKit },
];

const getPrintPlatforms = (trans: any) => [
  { id: 'all', name: trans.marketplace.all },
  { id: 'poster', name: trans.marketplace.poster },
  { id: 'flyer', name: trans.marketplace.flyer },
  { id: 'brochure', name: trans.marketplace.brochure },
  { id: 'menu', name: trans.marketplace.menu },
  { id: 'packaging', name: trans.marketplace.packaging },
  { id: 'label', name: trans.marketplace.labelSticker },
];

const getProductCategories = (trans: any) => [
  { id: 'all', name: trans.marketplace.all },
  { id: 'fashion', name: trans.marketplace.fashion },
  { id: 'cosmetics', name: trans.marketplace.cosmetics },
  { id: 'electronics', name: trans.marketplace.electronics },
  { id: 'food', name: trans.marketplace.food },
  { id: 'home', name: trans.marketplace.home },
  { id: 'accessories', name: trans.marketplace.accessories },
];

// Helper function to get platforms based on template type
const getPlatformsByType = (type: string, trans: any) => {
  switch (type) {
    case 'ecommerce': return getEcommercePlatforms(trans);
    case 'social': return getSocialPlatforms(trans);
    case 'marketing': return getMarketingPlatforms(trans);
    case 'branding': return getBrandingPlatforms(trans);
    case 'print': return getPrintPlatforms(trans);
    default: return getEcommercePlatforms(trans);
  }
};

const templates: ExtendedTemplate[] = [
  // Portrait 9:16 Templates - Fashion & Beauty (~80% of templates)
  { id: '1', title: 'Elegant Fashion Portrait', author: 'ArtistPro', price: 'Free', tags: ['Portrait', 'Fashion', 'Elegant'], thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '45k', likes: '12k', category: 'Instagram', style: 'Portrait', description: "Chân dung thời trang thanh lịch, ánh sáng cinematic" },
  { id: '2', title: 'Street Style Portrait', author: 'ShopeeKing', price: 'Free', tags: ['Street', 'Fashion', 'Urban'], thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '52k', likes: '15k', category: 'TikTok Shop', style: 'Street', description: "Phong cách đường phố hiện đại, năng động", gallery: [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&h=711&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=711&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&h=711&q=80',
  ]},
  { id: '3', title: 'Glamour Beauty Portrait', author: 'LiveSeller', price: 5, tags: ['Beauty', 'Glamour', 'Portrait'], thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '38k', likes: '9.2k', category: 'Instagram', style: 'Beauty', description: "Chân dung làm đẹp quyến rũ, ánh sáng studio chuyên nghiệp", gallery: [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=711&q=80',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=400&h=711&q=80',
  ]},
  { id: '4', title: 'Casual Lifestyle Model', author: 'MallPro', price: 15, tags: ['Lifestyle', 'Casual', 'Model'], thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '22k', likes: '6.5k', category: 'Instagram', style: 'Lifestyle', description: "Phong cách sống tự nhiên, thoải mái", gallery: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=711&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=711&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=711&q=80',
  ]},
  
  // Portrait 9:16 - Continued
  { id: '5', title: 'Summer Vibes Portrait', author: 'SalesMaster', price: 'Free', tags: ['Summer', 'Bright', 'Portrait'], thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '48k', likes: '14k', category: 'TikTok Shop', style: 'Summer', description: "Chân dung mùa hè tươi sáng, năng lượng tích cực" },
  { id: '6', title: 'Professional Headshot', author: 'BrandVN', price: 12, tags: ['Professional', 'Business', 'Portrait'], thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '18k', likes: '4.8k', category: 'Instagram', style: 'Professional', description: "Ảnh chân dung chuyên nghiệp cho doanh nhân" },
  { id: '7', title: 'Artistic Portrait', author: 'VoucherPro', price: 'Free', tags: ['Artistic', 'Creative', 'Portrait'], thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '35k', likes: '8.9k', category: 'Instagram', style: 'Artistic', description: "Chân dung nghệ thuật với ánh sáng độc đáo" },
  
  // Portrait 9:16 - Fashion & Style
  { id: '8', title: 'Minimalist Fashion', author: 'TikSeller', price: 5, tags: ['Minimalist', 'Fashion', 'Clean'], thumbnail: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '58k', likes: '18k', category: 'TikTok Shop', style: 'Minimalist', description: "Thời trang tối giản, phong cách hiện đại" },
  { id: '9', title: 'Urban Street Fashion', author: 'ReviewKing', price: 8, tags: ['Urban', 'Street', 'Fashion'], thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '42k', likes: '12k', category: 'TikTok Shop', style: 'Urban', description: "Thời trang đường phố năng động, cá tính" },
  { id: '10', title: 'Elegant Evening Look', author: 'TransformVN', price: 'Free', tags: ['Elegant', 'Evening', 'Glamour'], thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '65k', likes: '22k', category: 'Instagram', style: 'Evening', description: "Phong cách dạ tiệc sang trọng, quyến rũ" },
  { id: '11', title: 'Bohemian Style', author: 'DealHunter', price: 'Free', tags: ['Bohemian', 'Boho', 'Free Spirit'], thumbnail: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '28k', likes: '7.5k', category: 'Instagram', style: 'Bohemian', description: "Phong cách boho tự do, phóng khoáng" },
  
  // Portrait 9:16 - Beauty & Makeup
  { id: '12', title: 'Natural Beauty Portrait', author: 'AdsPro', price: 8, tags: ['Natural', 'Beauty', 'Skincare'], thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '32k', likes: '8.8k', category: 'Instagram', style: 'Natural', description: "Vẻ đẹp tự nhiên, làn da khỏe mạnh" },
  { id: '13', title: 'Makeup Tutorial Look', author: 'CoverDesign', price: 'Free', tags: ['Makeup', 'Tutorial', 'Beauty'], thumbnail: 'https://images.unsplash.com/photo-1503104834685-7205e8607eb9?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '25k', likes: '6.2k', category: 'TikTok Shop', style: 'Makeup', description: "Look makeup tutorial, dễ học theo" },
  { id: '14', title: 'Fitness Model Portrait', author: 'MarketPro', price: 'Free', tags: ['Fitness', 'Health', 'Active'], thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '45k', likes: '11k', category: 'Instagram', style: 'Fitness', description: "Chân dung fitness khỏe khoắn, năng động" },
  { id: '15', title: 'Vintage Style Portrait', author: 'VideoAds', price: 15, tags: ['Vintage', 'Retro', 'Classic'], thumbnail: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '38k', likes: '9.5k', category: 'Instagram', style: 'Vintage', description: "Phong cách vintage cổ điển, hoài niệm" },
  
  // Portrait 9:16 - Lifestyle & Travel
  { id: '16', title: 'Travel Adventure Portrait', author: 'InstaShop', price: 'Free', tags: ['Travel', 'Adventure', 'Outdoor'], thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '55k', likes: '16k', category: 'Instagram', style: 'Travel', description: "Chân dung du lịch phiêu lưu, khám phá" },
  { id: '17', title: 'Coffee Shop Aesthetic', author: 'ReelsMaster', price: 10, tags: ['Coffee', 'Aesthetic', 'Cozy'], thumbnail: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '48k', likes: '14k', category: 'Instagram', style: 'Aesthetic', description: "Phong cách quán cà phê ấm cúng, thư giãn" },
  { id: '18', title: 'Golden Hour Portrait', author: 'AestheticVN', price: 20, tags: ['Golden Hour', 'Sunset', 'Warm'], thumbnail: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '22k', likes: '7.8k', category: 'Instagram', style: 'Golden Hour', description: "Chân dung giờ vàng, ánh sáng hoàng hôn" },
  { id: '19', title: 'Sporty Active Look', author: 'ShopTag', price: 'Free', tags: ['Sport', 'Active', 'Athletic'], thumbnail: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '28k', likes: '6.5k', category: 'TikTok Shop', style: 'Sport', description: "Phong cách thể thao năng động, khỏe mạnh" },
  
  // Portrait 9:16 - Creative & Artistic
  { id: '20', title: 'Moody Dark Portrait', author: 'ZaloSeller', price: 'Free', tags: ['Moody', 'Dark', 'Dramatic'], thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '18k', likes: '4.2k', category: 'Instagram', style: 'Moody', description: "Chân dung tối màu, dramatic và bí ẩn" },
  { id: '21', title: 'Colorful Pop Portrait', author: 'ZaloOA', price: 5, tags: ['Colorful', 'Pop', 'Vibrant'], thumbnail: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '12k', likes: '3.1k', category: 'TikTok Shop', style: 'Colorful', description: "Màu sắc rực rỡ, phong cách pop art" },
  
  // Portrait 9:16 - More Styles
  { id: '22', title: 'Romantic Soft Portrait', author: 'SendoPro', price: 5, tags: ['Romantic', 'Soft', 'Dreamy'], thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '8k', likes: '1.8k', category: 'Instagram', style: 'Romantic', description: "Chân dung lãng mạn, mềm mại và mơ màng" },
  { id: '23', title: 'Edgy Fashion Portrait', author: 'SieuRe', price: 'Free', tags: ['Edgy', 'Fashion', 'Bold'], thumbnail: 'https://images.unsplash.com/photo-1504199367641-aba8151af406?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '6k', likes: '1.2k', category: 'TikTok Shop', style: 'Edgy', description: "Thời trang táo bạo, cá tính mạnh mẽ" },
  
  // Portrait 9:16 - Premium Collection
  { id: '24', title: 'Luxury Fashion Portrait', author: 'BeautyShot', price: 'Free', tags: ['Luxury', 'Fashion', 'Premium'], thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '28k', likes: '7.2k', category: 'Instagram', style: 'Luxury', description: "Thời trang cao cấp, sang trọng và đẳng cấp" },
  { id: '25', title: 'Beach Summer Portrait', author: 'FashionVN', price: 12, tags: ['Beach', 'Summer', 'Vacation'], thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '35k', likes: '9.5k', category: 'Instagram', style: 'Beach', description: "Chân dung biển mùa hè, tươi mát và sảng khoái" },
  { id: '26', title: 'Studio Pro Portrait', author: 'TechPro', price: 15, tags: ['Studio', 'Professional', 'Clean'], thumbnail: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=711&q=80', trending: false, downloads: '22k', likes: '5.8k', category: 'Instagram', style: 'Studio', description: "Chân dung studio chuyên nghiệp, nền sạch" },
  
  // Square 1:1 Templates (~20% of templates)
  { id: '27', title: 'Product Showcase Square', author: 'FoodieShot', price: 'Free', tags: ['Product', 'Square', 'Clean'], thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600&q=80', trending: true, downloads: '42k', likes: '12k', category: 'Shopee', style: 'Product', description: "Ảnh sản phẩm vuông, nền trắng chuẩn TMĐT" },
  { id: '28', title: 'Food Photography Square', author: 'HomePro', price: 8, tags: ['Food', 'Square', 'Delicious'], thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&h=600&q=80', trending: false, downloads: '15k', likes: '3.8k', category: 'Instagram', style: 'Food', description: "Ảnh đồ ăn vuông, hấp dẫn và ngon miệng" },
  { id: '29', title: 'Cosmetics Flat Lay', author: 'AccessPro', price: 'Free', tags: ['Cosmetics', 'Flat Lay', 'Beauty'], thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&h=600&q=80', trending: false, downloads: '18k', likes: '4.5k', category: 'Shopee', style: 'Flat Lay', description: "Flat lay mỹ phẩm, bố cục đẹp mắt" },
  
  // More Portrait 9:16
  { id: '30', title: 'Autumn Fashion Portrait', author: 'OmniSeller', price: 20, tags: ['Autumn', 'Fashion', 'Warm'], thumbnail: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '52k', likes: '15k', category: 'Instagram', style: 'Autumn', description: "Thời trang mùa thu, tông màu ấm áp" },
  { id: '31', title: 'Night City Portrait', author: 'SalePro', price: 25, tags: ['Night', 'City', 'Neon'], thumbnail: 'https://images.unsplash.com/photo-1504199367641-aba8151af406?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '48k', likes: '13k', category: 'TikTok Shop', style: 'Night', description: "Chân dung đêm thành phố, ánh đèn neon" },
  { id: '32', title: 'Wellness Lifestyle', author: 'VideoKing', price: 30, tags: ['Wellness', 'Health', 'Lifestyle'], thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=400&h=711&q=80', trending: true, downloads: '38k', likes: '11k', category: 'Instagram', style: 'Wellness', description: "Lối sống lành mạnh, cân bằng và tích cực" },
];

// NOTE: TemplateDetailModal is now imported from './TemplateDetailModal'
// It provides Example-like flow: View details → Choose options → Recreate with AI tools

// --- CREATOR STUDIO COMPONENT ---
const CreatorStudio: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'recipe' | 'details'>('recipe');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Recipe State
  const [prompt, setPrompt] = useState("A professional portrait of {subject}, studio lighting, 8k resolution");
  const [negPrompt, setNegPrompt] = useState("blur, low quality, distortion, watermark");
  const [cfgScale, setCfgScale] = useState(7);
  const [steps, setSteps] = useState(30);
  const [model, setModel] = useState("repix-v2-turbo");

  // Details State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  const insertVariable = (variable: string) => {
    setPrompt(prev => prev + ` {${variable}}`);
  };

  const handleTestRun = () => {
    setIsGenerating(true);
    // Simulate AI generation time
    setTimeout(() => {
      setIsGenerating(false);
      // Mock result
      setGeneratedImage(`https://picsum.photos/seed/${Math.random()}/800/800`);
    }, 2500);
  };

  const handlePublish = () => {
    alert("Template published successfully to the Marketplace!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-light-bg dark:bg-dark-bg flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-dark-surface">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-repix-600 flex items-center justify-center text-white">
              <Beaker size={20} />
           </div>
           <div>
              <h2 className="font-bold text-lg leading-none">Creator Studio</h2>
              <p className="text-xs text-zinc-500">Design & Publish AI Templates</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="ghost" onClick={onClose}>Cancel</Button>
           {step === 'recipe' ? (
             <Button onClick={() => setStep('details')} disabled={!generatedImage}>
               Next: Details <ArrowUpRight size={16} className="ml-2"/>
             </Button>
           ) : (
             <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 text-white border-0">
               Publish Template <UploadCloud size={16} className="ml-2"/>
             </Button>
           )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Preview Canvas */}
        <div className="flex-1 bg-zinc-100 dark:bg-black/50 p-8 flex flex-col items-center justify-center relative">
           <div className="relative w-full max-w-xl aspect-square bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group">
              {isGenerating ? (
                <div className="text-center space-y-4">
                   <div className="w-12 h-12 border-4 border-repix-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                   <p className="text-zinc-500 font-medium animate-pulse">Generating preview...</p>
                </div>
              ) : generatedImage ? (
                <>
                  <img src={generatedImage} className="w-full h-full object-cover" alt="Generated Result" />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button size="sm" variant="secondary" onClick={handleTestRun}><RefreshCw size={14} className="mr-2"/> Regenerate</Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 text-zinc-400">
                   <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                   <p className="font-medium">Run a test generation to preview your template</p>
                </div>
              )}
           </div>
           
           {/* Console Log Simulation */}
           <div className="mt-6 w-full max-w-xl h-32 bg-zinc-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto border border-zinc-800 shadow-inner">
              <div className="text-zinc-500 border-b border-zinc-800 pb-2 mb-2 flex justify-between">
                <span>SYSTEM CONSOLE</span>
                <span>ID: #TMP-88X2</span>
              </div>
              <p>{'>'} Initializing Creator Environment...</p>
              <p>{'>'} AI Model loaded: {model}</p>
              {isGenerating && (
                <>
                  <p>{'>'} Parsing prompt variables...</p>
                  <p>{'>'} Applying negative embeddings...</p>
                  <p>{'>'} Denoising steps: 0/{steps}...</p>
                </>
              )}
              {generatedImage && <p className="text-white">{'>'} Generation successful (2.4s)</p>}
           </div>
        </div>

        {/* Right Panel: Configuration */}
        <div className="w-[450px] bg-white dark:bg-dark-surface border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
           
           {/* Step 1: AI Recipe Builder */}
           {step === 'recipe' && (
             <div className="flex-1 overflow-y-auto p-6 space-y-8 animate-in slide-in-from-right-10 duration-300">
                
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                    <Wand2 size={18} className="text-repix-500" /> Prompt Logic
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs text-zinc-500">
                          <label className="font-medium">Base Prompt</label>
                          <span>Use {'{variable}'} for dynamic inputs</span>
                       </div>
                       <textarea 
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         className="w-full h-32 p-3 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-repix-500 outline-none resize-none font-mono"
                       />
                       {/* Variable Chips */}
                       <div className="flex gap-2 flex-wrap">
                          {['subject', 'color', 'lighting', 'location'].map(v => (
                             <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 rounded-md bg-repix-100 dark:bg-repix-900/30 text-repix-600 dark:text-repix-400 text-xs font-medium hover:bg-repix-200 transition-colors flex items-center gap-1">
                                <Plus size={10} /> {v}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-medium text-zinc-500">Negative Prompt</label>
                       <textarea 
                         value={negPrompt}
                         onChange={(e) => setNegPrompt(e.target.value)}
                         className="w-full h-20 p-3 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-red-500/50 outline-none resize-none font-mono text-zinc-600 dark:text-zinc-400"
                         placeholder="What to avoid..."
                       />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                    <Settings2 size={18} className="text-repix-500" /> Model Settings
                  </h3>
                  
                  <div className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500">Base Model</label>
                        <select 
                          value={model} onChange={(e) => setModel(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm outline-none"
                        >
                           <option value="repix-v2-turbo">Repix V2 Turbo (Fastest)</option>
                           <option value="repix-v2-pro">Repix V2 Pro (Best Quality)</option>
                           <option value="stable-xl">Stable Diffusion XL</option>
                        </select>
                     </div>

                     <Slider 
                        label="Guidance Scale (CFG)" 
                        value={cfgScale} onChange={setCfgScale} min={1} max={20} 
                     />
                     
                     <Slider 
                        label="Inference Steps" 
                        value={steps} onChange={setSteps} min={10} max={100} 
                     />
                  </div>
                </div>

                <Button 
                   onClick={handleTestRun} 
                   className="w-full h-12 rounded-xl font-bold shadow-lg shadow-repix-500/20"
                   isLoading={isGenerating}
                >
                   {isGenerating ? 'Running Logic...' : 'Test Run & Generate Preview'} <Play size={16} className="ml-2 fill-current"/>
                </Button>
             </div>
           )}

           {/* Step 2: Template Details */}
           {step === 'details' && (
             <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right-10 duration-300">
                 <div>
                    <h3 className="font-bold text-2xl mb-2">Almost done!</h3>
                    <p className="text-zinc-500 text-sm">Add details to help others find your template.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Template Name</label>
                       <Input 
                          placeholder="e.g. Cinematic Neon Portrait" 
                          value={title} onChange={(e) => setTitle(e.target.value)}
                          className="h-12 text-lg"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium">Description</label>
                       <textarea className="w-full h-24 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 outline-none text-sm resize-none" placeholder="Explain what your template does..." />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium">Category</label>
                       <div className="grid grid-cols-2 gap-2">
                          {['Portrait', 'Landscape', 'Product', 'Art', '3D', 'Fashion'].map(cat => (
                             <div key={cat} className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/20 transition-all">
                                <div className="w-4 h-4 rounded-full border border-zinc-400"></div>
                                <span className="text-sm">{cat}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-green-500" />
                          <span className="font-bold">Set Price</span>
                       </div>
                       <span className="text-xl font-bold text-repix-500">{price === 0 ? 'Free' : `${price} Credits`}</span>
                    </div>
                    <Slider value={price} onChange={setPrice} max={500} />
                    <p className="text-xs text-zinc-500">
                       You earn 70% of every sale. Set to 0 for free community access.
                    </p>
                 </Card>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};



const TrendTracker: React.FC<{
  trans: any;
  selectedType: string;
  selectedPlatform: string;
  setSelectedPlatform: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  currentPlatforms: Array<{id: string; name: string}>;
  productCategories: Array<{id: string; name: string}>;
}> = ({trans, selectedType, selectedPlatform, setSelectedPlatform, selectedCategory, setSelectedCategory, currentPlatforms, productCategories}) => {
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Get trending keywords based on type
  const getTrendingKeywords = () => {
    switch (selectedType) {
      case 'ecommerce':
        return [{k: "Flash Sale", v: "+150%"}, {k: "11.11", v: "+120%"}, {k: "Livestream", v: "+85%"}];
      case 'social':
        return [{k: "Reels", v: "+180%"}, {k: "Carousel", v: "+95%"}, {k: "Story", v: "+75%"}];
      case 'marketing':
        return [{k: "Retargeting", v: "+140%"}, {k: "A/B Test", v: "+90%"}, {k: "CTA", v: "+65%"}];
      case 'branding':
        return [{k: "Minimalist", v: "+130%"}, {k: "Gradient", v: "+85%"}, {k: "3D Logo", v: "+70%"}];
      case 'print':
        return [{k: "Eco Print", v: "+110%"}, {k: "QR Code", v: "+95%"}, {k: "Foil", v: "+60%"}];
      default:
        return [{k: "Flash Sale", v: "+150%"}, {k: "11.11", v: "+120%"}, {k: "Livestream", v: "+85%"}];
    }
  };

  return (
    <div className="mb-6">
        <div className="bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-dark-surface border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Trend Info */}
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-500 flex items-center justify-center shrink-0">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{trans.marketplace.trendTracker}</h3>
                    <p className="text-xs text-zinc-500 hidden sm:block">{trans.marketplace.risingKeywords}</p>
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar ml-4">
                    {getTrendingKeywords().map((trend, i) => (
                       <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                          <span className="text-xs font-medium">{trend.k}</span>
                          <span className="text-xs font-bold text-green-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> {trend.v}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Right: Filter Dropdowns */}
              <div className="flex items-center gap-3 flex-wrap">
                 {/* Platform Filter Dropdown - Custom */}
                 <div className="relative">
                    <button
                       onClick={() => { setShowPlatformDropdown(!showPlatformDropdown); setShowCategoryDropdown(false); }}
                       className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                       <Filter size={14} className="text-purple-500" />
                       <span className="text-zinc-700 dark:text-zinc-300">
                         {currentPlatforms.find(p => p.id === selectedPlatform)?.name}
                       </span>
                       <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${showPlatformDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showPlatformDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowPlatformDropdown(false)} />
                        <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 py-1 max-h-72 overflow-y-auto">
                          {currentPlatforms.map((platform) => (
                            <button
                              key={platform.id}
                              onClick={() => {
                                setSelectedPlatform(platform.id);
                                setShowPlatformDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-all ${
                                selectedPlatform === platform.id 
                                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-500 font-medium' 
                                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                              }`}
                            >
                              <span>{platform.name}</span>
                              {selectedPlatform === platform.id && <Check size={16} className="text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                 </div>

                 {/* Category Filter Dropdown - Custom */}
                 <div className="relative">
                    <button
                       onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowPlatformDropdown(false); }}
                       className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium flex items-center gap-2 hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                       <Tag size={14} className="text-purple-500" />
                       <span className="text-zinc-700 dark:text-zinc-300">
                         {productCategories.find(c => c.id === selectedCategory)?.name}
                       </span>
                       <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCategoryDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowCategoryDropdown(false)} />
                        <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 py-1">
                          {productCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.id);
                                setShowCategoryDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-all ${
                                selectedCategory === cat.id 
                                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-500 font-medium' 
                                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                              }`}
                            >
                              <span>{cat.name}</span>
                              {selectedCategory === cat.id && <Check size={16} className="text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                 </div>

                 {/* Active Filters Display */}
                 {(selectedPlatform !== 'all' || selectedCategory !== 'all') && (
                    <button 
                       onClick={() => { setSelectedPlatform('all'); setSelectedCategory('all'); }}
                       className="text-xs text-repix-500 hover:text-repix-600 font-medium flex items-center gap-1"
                    >
                       <X size={12} /> {trans.marketplace.clearFilters}
                    </button>
                 )}
              </div>
           </div>
        </div>
    </div>
  );
};

interface MarketplaceViewProps {
  onNavigateToPublish?: () => void;
  initialContentType?: 'single' | 'collection';
  onNavigateToPhotoshoot?: (data: {
    images: string[];
    imageCount: number;
    templateSettings: {
      title: string;
      style: string;
      model: string;
      ratio: string;
    };
  }) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigateToPublish, initialContentType, onNavigateToPhotoshoot }) => {
  const { trans, language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreatorStudio, setShowCreatorStudio] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplate | null>(null);
  const [selectedType, setSelectedType] = useState('ecommerce');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentType, setContentType] = useState<'all' | 'single' | 'collection'>(initialContentType || 'all');
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('trending');
  
  // New states for Example-like flow
  const [showTemplateDetail, setShowTemplateDetail] = useState(false);
  const [showRecreateSetup, setShowRecreateSetup] = useState(false);
  const [recreateData, setRecreateData] = useState<{ image: string; prompt: string; model: string; style: string; ratio: string } | null>(null);
  
  // State for RecreateView (Step 3: Auto generate with selected tool)
  const [showToolExecution, setShowToolExecution] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  
  // State for Collection Detail Modal
  const [selectedCollection, setSelectedCollection] = useState<{
    id: number;
    title: string;
    author: string;
    count: number;
    images: string[];
    likes: string;
    description?: string;
    tags?: string[];
  } | null>(null);

  // Get translated data
  const templateTypes = getTemplateTypes(trans);
  const productCategories = getProductCategories(trans);
  
  // Get current platforms based on selected type
  const currentPlatforms = getPlatformsByType(selectedType, trans);

  // Filter templates based on selected platform and category
  const filteredTemplates = templates.filter(template => {
    const platformMatch = selectedPlatform === 'all' || 
      template.category.toLowerCase().includes(selectedPlatform) ||
      template.tags.some(tag => tag.toLowerCase().includes(selectedPlatform));
    const categoryMatch = selectedCategory === 'all' ||
      template.tags.some(tag => tag.toLowerCase().includes(selectedCategory));
    return platformMatch && categoryMatch;
  });
  
  return (
    <div className="flex h-full bg-light-bg dark:bg-dark-bg text-zinc-900 dark:text-white overflow-hidden relative">

      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header & Search */}
        <div className="sticky top-0 z-30 bg-light-bg dark:bg-dark-bg border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 py-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                 <h1 className="text-2xl font-bold">{trans.marketplace.title}</h1>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.marketplace.desc}</p>
              </div>
              <Button size="sm" onClick={() => {
                 if (onNavigateToPublish) {
                   onNavigateToPublish();
                 } else {
                   setShowCreatorStudio(true);
                 }
              }}>
                 <Share2 size={16} className="mr-2" /> 
                 <span className="hidden sm:inline">{trans.marketplace.shareGeneration || 'Share Generation'}</span>
                 <span className="sm:hidden">{trans.marketplace.share || 'Share'}</span>
              </Button>
           </div>

           {/* Search Bar */}
           <div className="flex gap-3">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                 <input 
                   type="text" 
                   placeholder={trans.marketplace.search}
                   className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-repix-500/50 text-sm"
                 />
              </div>
              <div className="flex items-center gap-2">
                 {/* Content Type Selector - Custom Dropdown */}
                 <div className="relative">
                   <button
                     onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
                     className="h-10 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
                   >
                     {contentType === 'all' && <Layers size={16} />}
                     {contentType === 'single' && <ImageIcon size={16} />}
                     {contentType === 'collection' && <Layers size={16} />}
                     <span>
                       {contentType === 'all' && (language === 'vi' ? 'Tất cả' : 'All')}
                       {contentType === 'single' && (language === 'vi' ? 'Ảnh đơn' : 'Single Images')}
                       {contentType === 'collection' && (language === 'vi' ? 'Bộ sưu tập' : 'Collections')}
                     </span>
                     <ChevronDown size={16} className={`transition-transform ${showContentTypeDropdown ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {showContentTypeDropdown && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowContentTypeDropdown(false)} />
                       <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50">
                         {[
                           { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All', icon: Layers },
                           { id: 'single', label: language === 'vi' ? 'Ảnh đơn' : 'Single Images', icon: ImageIcon },
                           { id: 'collection', label: language === 'vi' ? 'Bộ sưu tập' : 'Collections', icon: Layers },
                         ].map((option) => (
                           <button
                             key={option.id}
                             onClick={() => {
                               setContentType(option.id as 'all' | 'single' | 'collection');
                               setShowContentTypeDropdown(false);
                             }}
                             className={`w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                               contentType === option.id ? 'bg-gradient-to-r from-pink-500/10 to-blue-500/10 text-repix-500' : 'text-zinc-700 dark:text-zinc-300'
                             }`}
                           >
                             <option.icon size={16} />
                             <span>{option.label}</span>
                             {contentType === option.id && <Check size={14} className="ml-auto text-repix-500" />}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </div>
                 
                 {/* Template Type Selector - Custom Dropdown */}
                 <div className="relative">
                   <button
                     onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowSortDropdown(false); setShowContentTypeDropdown(false); }}
                     className="h-10 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                   >
                     <span>{templateTypes.find(t => t.id === selectedType)?.name}</span>
                     <ChevronDown size={16} className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {showTypeDropdown && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowTypeDropdown(false)} />
                       <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                         {templateTypes.map((type) => (
                           <button
                             key={type.id}
                             onClick={() => {
                               setSelectedType(type.id);
                               setSelectedPlatform('all');
                               setShowTypeDropdown(false);
                             }}
                             className={`w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                               selectedType === type.id ? 'bg-zinc-100 dark:bg-zinc-700 text-repix-500' : 'text-zinc-700 dark:text-zinc-300'
                             }`}
                           >
                             <span>{type.name}</span>
                             {selectedType === type.id && <Check size={14} className="ml-auto text-repix-500" />}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </div>
                 
                 {/* Sort Selector - Custom Dropdown */}
                 <div className="relative hidden md:block">
                   <button
                     onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTypeDropdown(false); setShowContentTypeDropdown(false); }}
                     className="h-10 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm font-medium flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                   >
                     <span>
                       {sortBy === 'trending' && trans.marketplace.trending}
                       {sortBy === 'newest' && trans.marketplace.newest}
                       {sortBy === 'popular' && trans.marketplace.popular}
                     </span>
                     <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {showSortDropdown && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                       <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                         {[
                           { id: 'trending', label: trans.marketplace.trending, icon: TrendingUp },
                           { id: 'newest', label: trans.marketplace.newest, icon: Sparkles },
                           { id: 'popular', label: trans.marketplace.popular, icon: Heart },
                         ].map((option) => (
                           <button
                             key={option.id}
                             onClick={() => {
                               setSortBy(option.id);
                               setShowSortDropdown(false);
                             }}
                             className={`w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                               sortBy === option.id ? 'bg-zinc-100 dark:bg-zinc-700 text-repix-500' : 'text-zinc-700 dark:text-zinc-300'
                             }`}
                           >
                             <option.icon size={16} />
                             <span>{option.label}</span>
                             {sortBy === option.id && <Check size={14} className="ml-auto text-repix-500" />}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </div>
              </div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-8 space-y-8 md:space-y-12">
           
           {/* Trend Tracker with Filters */}
           <TrendTracker 
              trans={trans}
              selectedType={selectedType}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              currentPlatforms={currentPlatforms}
              productCategories={productCategories}
           />

           {/* Hero Banner / Featured */}
           <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/50 aspect-[4/3] md:aspect-[3/1] flex items-end md:items-center">
              <img src="https://picsum.photos/seed/hero_art/1200/400" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/50 to-transparent"></div>
              
              <div className="relative z-[1] p-6 md:p-12 max-w-2xl">
                 <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
                    <Star size={12} fill="currentColor" /> {trans.marketplace.featured}
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight">{trans.marketplace.featuredTitle || 'Neon Dreams Vol. 2'}</h2>
                 <p className="text-zinc-300 mb-6 line-clamp-2 text-sm md:text-base">{trans.marketplace.featuredDesc || 'Experience the next level of cyberpunk aesthetics with our community-curated collection of neon-soaked presets.'}</p>
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 border-0 w-full md:w-auto">{trans.marketplace.exploreCollection || 'Explore Collection'}</Button>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                       <User size={16} /> {trans.marketplace.createdBy || 'Created by'} <span className="text-white font-bold underline cursor-pointer">NeonMaster</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Collections Section */}
           {(contentType === 'all' || contentType === 'collection') && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                     <Layers size={18} className="text-white" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold">{language === 'vi' ? 'Bộ sưu tập' : 'Collections'}</h3>
                     <p className="text-sm text-zinc-500">{language === 'vi' ? 'Bộ ảnh theo chủ đề từ creators' : 'Themed photo sets from creators'}</p>
                   </div>
                 </div>
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
                     ],
                     likes: '5.2k'
                   },
                   { 
                     id: 2, 
                     title: language === 'vi' ? 'Sản phẩm công nghệ' : 'Tech Products',
                     author: '@tech_shots',
                     count: 8,
                     images: [
                       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&h=400&q=80',
                     ],
                     likes: '3.8k'
                   },
                   { 
                     id: 3, 
                     title: language === 'vi' ? 'Ẩm thực Việt Nam' : 'Vietnamese Cuisine',
                     author: '@food_vn',
                     count: 15,
                     images: [
                       'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&h=400&q=80',
                     ],
                     likes: '4.1k'
                   },
                   { 
                     id: 4, 
                     title: language === 'vi' ? 'Chân dung nghệ thuật' : 'Artistic Portraits',
                     author: '@portrait_master',
                     count: 20,
                     images: [
                       'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=400&q=80',
                     ],
                     likes: '8.5k'
                   },
                   { 
                     id: 5, 
                     title: language === 'vi' ? 'Mỹ phẩm & Làm đẹp' : 'Beauty & Cosmetics',
                     author: '@beauty_studio',
                     count: 10,
                     images: [
                       'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=300&h=400&q=80',
                     ],
                     likes: '6.2k'
                   },
                   { 
                     id: 6, 
                     title: language === 'vi' ? 'Phong cách đường phố' : 'Street Style',
                     author: '@street_fashion',
                     count: 18,
                     images: [
                       'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=300&h=400&q=80',
                       'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=300&h=400&q=80',
                     ],
                     likes: '7.3k'
                   },
                 ].map((collection) => (
                   <div 
                     key={collection.id}
                     onClick={() => setSelectedCollection(collection)}
                     className="group relative bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                   >
                     {/* Stacked Images Preview */}
                     <div className="relative h-48 overflow-hidden">
                       <div className="absolute inset-0 flex">
                         {collection.images.map((img, idx) => (
                           <div 
                             key={idx} 
                             className="flex-1 relative overflow-hidden"
                             style={{ 
                               transform: `translateX(${idx * -10}px)`,
                               zIndex: collection.images.length - idx 
                             }}
                           >
                             <img 
                               src={img} 
                               alt="" 
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                             />
                           </div>
                         ))}
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       
                       {/* Count Badge */}
                       <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                         {collection.count} {language === 'vi' ? 'ảnh' : 'images'}
                       </div>
                     </div>
                     
                     {/* Info */}
                     <div className="p-4">
                       <h4 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-repix-500 transition-colors">
                         {collection.title}
                       </h4>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-zinc-500">{collection.author}</span>
                         <div className="flex items-center gap-1 text-zinc-400">
                           <Heart size={14} />
                           <span className="text-xs">{collection.likes}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Single Images Section Header */}
           {(contentType === 'all' || contentType === 'single') && (
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                 <ImageIcon size={18} className="text-white" />
               </div>
               <div>
                 <h3 className="text-lg font-bold">{language === 'vi' ? 'Ảnh đơn' : 'Single Images'}</h3>
                 <p className="text-sm text-zinc-500">{language === 'vi' ? 'Tác phẩm nổi bật từ cộng đồng' : 'Featured works from community'}</p>
               </div>
             </div>
           )}

           {/* Masonry Grid - Image Only */}
           {(contentType === 'all' || contentType === 'single') && (
           <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-3 2xl:gap-4 space-y-3 2xl:space-y-4">
              {filteredTemplates.map(template => (
                 <div 
                  key={template.id} 
                  onClick={() => { setSelectedTemplate(template); setShowTemplateDetail(true); }}
                  className="group relative break-inside-avoid rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
                 >
                    <img 
                      src={template.thumbnail} 
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy" 
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                       {/* Top Right - Likes */}
                       <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                          <Heart size={12} className="text-white" />
                          <span className="text-white text-xs font-medium">{template.likes}</span>
                       </div>

                       {/* Bottom Info */}
                       <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-medium truncate mb-2">{template.title}</p>
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 p-[1px]">
                                <img 
                                  src={`https://picsum.photos/seed/${template.author}/30/30`} 
                                  className="w-full h-full rounded-full border border-white/20" 
                                />
                             </div>
                             <span className="text-white/80 text-xs">{template.author}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           )}
        </div>
      </div>
      
      {/* Template Detail Modal - Step 1: View template details & options (like Example Modal) */}
      {selectedTemplate && showTemplateDetail && (
         <TemplateDetailModal 
           template={selectedTemplate}
           onClose={() => { setSelectedTemplate(null); setShowTemplateDetail(false); }}
           onRecreate={(data) => {
             setRecreateData(data);
             setShowTemplateDetail(false);
             setShowRecreateSetup(true);
           }}
           onEdit={(image) => {
             // TODO: Navigate to editor with image
             alert(`Opening Editor with image: ${image}`);
             setSelectedTemplate(null);
             setShowTemplateDetail(false);
           }}
         />
      )}

      {/* RecreateSetupView - Step 2: Choose AI tool to recreate */}
      {showRecreateSetup && recreateData && (
         <RecreateSetupView 
           onClose={() => { setShowRecreateSetup(false); setRecreateData(null); setSelectedTemplate(null); }}
           originalImage={recreateData.image}
           originalPrompt={recreateData.prompt}
           generationInfo={{
             model: recreateData.model,
             style: recreateData.style,
             ratio: recreateData.ratio,
           }}
           onStartGenerate={(toolId) => {
             // Get tool name and open RecreateView with autoGenerate
             const toolData = getToolById(toolId);
             setSelectedToolId(toolId);
             setShowRecreateSetup(false);
             setShowToolExecution(true);
           }}
         />
      )}
      
      {/* RecreateView - Step 3: Auto generate with selected tool */}
      {showToolExecution && selectedToolId && recreateData && (() => {
        const toolData = getToolById(selectedToolId);
        const toolName = toolData ? (toolData.tool.name || selectedToolId) : selectedToolId;
        return (
          <RecreateView
            onClose={() => {
              setShowToolExecution(false);
              setSelectedToolId(null);
              setRecreateData(null);
              setSelectedTemplate(null);
            }}
            originalImage={recreateData.image}
            originalPrompt={recreateData.prompt}
            generationInfo={{
              model: recreateData.model,
              style: recreateData.style,
              ratio: recreateData.ratio,
            }}
            autoGenerate={true}
            selectedToolName={toolName}
          />
        );
      })()}
      {/* Share Generation Modal */}
      {showCreatorStudio && (
        <ShareGenerationModal onClose={() => setShowCreatorStudio(false)} />
      )}
      
      {/* Collection Detail Modal */}
      {selectedCollection && (
        <CollectionDetailModal
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
          onSelectImage={(image) => {
            // Handle selecting an image from collection
            console.log('Selected image:', image);
          }}
          onNavigateToPhotoshoot={onNavigateToPhotoshoot}
        />
      )}
    </div>
  );
};
