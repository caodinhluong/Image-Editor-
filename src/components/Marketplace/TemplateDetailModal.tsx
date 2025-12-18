import React, { useState } from 'react';
import {
  X, Sparkles, ChevronDown, RefreshCw, Download, Edit3, Heart, Crown, Check, Copy, Layers
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface TemplateDetailModalProps {
  template: {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
    description?: string;
    tags: string[];
    style?: string;
    gallery?: string[];
    likes?: string;
    downloads?: string;
    price?: number | string;
  };
  onClose: () => void;
  onRecreate: (data: { image: string; prompt: string; model: string; style: string; ratio: string }) => void;
  onEdit: (image: string) => void;
}

// Tools data for Template Modal
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
];

// Model options
const modelOptions = [
  { id: 'higgsfield-soul', label: 'Higgsfield Soul', desc: 'Ultra-Realistic Fashion Visuals', tier: 'free', icon: '✨' },
  { id: 'nano-banana-pro', label: 'Nano Banana Pro', desc: "Google's Flagship Generation Model", tier: 'free', icon: 'G' },
  { id: 'z-image', label: 'Z-Image', desc: 'Ultra-Fast Photorealistic Images', tier: 'free', icon: '⚡' },
  { id: 'flux-pro', label: 'FLUX.2 Pro', desc: 'Lightning-Fast Precision', tier: 'free', icon: '△' },
  { id: 'wan-22', label: 'WAN 2.2', desc: 'High-Fidelity Cinematic Visuals', tier: 'free', icon: '🎬' },
  { id: 'higgsfield-faceswap', label: 'Higgsfield Face Swap', desc: 'Seamless Face Swapping', tier: 'plus', icon: '👤' },
  { id: 'seedream-45', label: 'Seedream 4.5', desc: "ByteDance's Next-Gen 4K Image Model", tier: 'plus', icon: '📊' },
  { id: 'kling-o1', label: 'Kling O1', desc: "Kling's Photorealistic Image Model", tier: 'plus', icon: '◎' },
  { id: 'gpt-image', label: 'GPT Image', desc: "OpenAI's Powerful Image Tool", tier: 'pro', icon: '◈' },
];

// Style options
const styleOptions = [
  { id: 'photograph', label: 'Photograph', labelVi: 'Ảnh chụp' },
  { id: 'illustration', label: 'Illustration', labelVi: 'Minh họa' },
  { id: 'digital-art', label: 'Digital Art', labelVi: 'Nghệ thuật số' },
  { id: '3d-render', label: '3D Render', labelVi: '3D Render' },
  { id: 'painting', label: 'Painting', labelVi: 'Tranh vẽ' },
  { id: 'anime', label: 'Anime', labelVi: 'Anime' },
  { id: 'cinematic', label: 'Cinematic', labelVi: 'Điện ảnh' },
];

// Ratio options
const ratioOptions = [
  { id: '1:1', label: '1:1' },
  { id: '16:9', label: '16:9' },
  { id: '9:16', label: '9:16' },
  { id: '3:2', label: '3:2' },
  { id: '2:3', label: '2:3' },
  { id: '4:3', label: '4:3' },
];

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template,
  onClose,
  onRecreate,
  onEdit,
}) => {
  const { language } = useLanguage();
  const { currentPlan, triggerUpgradeModal } = useSubscription();
  
  // States
  const [selectedTool, setSelectedTool] = useState('nano-banana-pro');
  const [selectedModel, setSelectedModel] = useState('higgsfield-soul');
  const [selectedStyle, setSelectedStyle] = useState(template.style || 'photograph');
  const [selectedRatio, setSelectedRatio] = useState('3:2');
  const [copied, setCopied] = useState(false);
  
  // Dropdown states
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);
  
  // Gallery state
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const galleryImages = template.gallery && template.gallery.length > 0 
    ? template.gallery 
    : [template.thumbnail];

  const closeAllDropdowns = () => {
    setShowToolDropdown(false);
    setShowModelDropdown(false);
    setShowStyleDropdown(false);
    setShowRatioDropdown(false);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(template.description || template.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecreate = () => {
    onRecreate({
      image: galleryImages[selectedGalleryIndex],
      prompt: template.description || template.title,
      model: modelOptions.find(m => m.id === selectedModel)?.label || 'Higgsfield Soul',
      style: styleOptions.find(s => s.id === selectedStyle)?.label || 'Photograph',
      ratio: selectedRatio
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = galleryImages[selectedGalleryIndex];
    link.download = `${template.title.replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  const handleEdit = () => {
    onEdit(galleryImages[selectedGalleryIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-xl transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>

        {/* LEFT: Image Preview */}
        <div className="w-full md:w-1/2 bg-zinc-950 relative flex flex-col">
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-6 min-h-[300px] md:min-h-[500px]">
            <img 
              src={galleryImages[selectedGalleryIndex]} 
              alt={template.title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGalleryIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedGalleryIndex === idx 
                        ? 'border-purple-500 ring-2 ring-purple-500/30' 
                        : 'border-transparent hover:border-zinc-600'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              {selectedGalleryIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* RIGHT: Details & Options */}
        <div className="w-full md:w-1/2 flex flex-col max-h-[90vh] md:max-h-full">
          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
            {/* Header */}
            <div className="pt-5 pb-4 border-b border-zinc-800/50 sticky top-0 bg-zinc-900 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    {typeof template.price === 'number' && template.price > 0 ? (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded border border-amber-500/30">PRO</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded border border-green-500/30">FREE</span>
                    )}
                    <span className="text-xs text-zinc-500">{template.tags?.[0] || 'Template'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{template.title}</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-[1px]">
                        <img 
                          src={`https://picsum.photos/seed/${template.author}/30/30`} 
                          className="w-full h-full rounded-full" 
                          alt={template.author}
                        />
                      </div>
                      <span className="text-sm text-zinc-400">{template.author}</span>
                    </div>
                    {template.likes && (
                      <div className="flex items-center gap-1 text-zinc-500 text-xs">
                        <Heart size={12} />
                        <span>{template.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Selector */}
            <div className="bg-zinc-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mb-3">
                <Layers size={12} className="text-green-400" />
                <span>TOOL</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => { closeAllDropdowns(); setShowToolDropdown(!showToolDropdown); }}
                  className="w-full flex items-center gap-3 p-2.5 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-600 flex items-center justify-center text-lg">
                    {toolOptions.find(t => t.id === selectedTool)?.icon || '🔧'}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white">{toolOptions.find(t => t.id === selectedTool)?.name || 'Select Tool'}</span>
                      {toolOptions.find(t => t.id === selectedTool)?.isNew && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-[9px] font-bold rounded">NEW</span>
                      )}
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
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 text-[11px] font-medium bg-zinc-700/80 hover:bg-zinc-600 text-zinc-300 rounded-lg transition-all duration-200 flex items-center gap-1"
                >
                  {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[13px] text-zinc-300 leading-relaxed">
                {template.description || template.title}
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
                {/* Model Selector */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-zinc-500">Model</span>
                    <button
                      onClick={() => { closeAllDropdowns(); setShowModelDropdown(!showModelDropdown); }}
                      className="text-[13px] text-white font-medium bg-zinc-700/80 hover:bg-zinc-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {modelOptions.find(m => m.id === selectedModel)?.label || 'Higgsfield Soul'}
                      {modelOptions.find(m => m.id === selectedModel)?.tier === 'plus' && <Crown size={10} className="text-purple-400" />}
                      {modelOptions.find(m => m.id === selectedModel)?.tier === 'pro' && <Crown size={10} className="text-amber-400" />}
                      <ChevronDown size={12} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {showModelDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-72 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-30 shadow-2xl max-h-[250px] overflow-y-auto">
                      {modelOptions.map(model => {
                        const canAccess = model.tier === 'free' || 
                          (model.tier === 'plus' && (currentPlan === 'plus' || currentPlan === 'pro')) ||
                          (model.tier === 'pro' && currentPlan === 'pro');
                        
                        return (
                          <button
                            key={model.id}
                            onClick={() => {
                              if (canAccess) {
                                setSelectedModel(model.id);
                                setShowModelDropdown(false);
                              } else {
                                setShowModelDropdown(false);
                                triggerUpgradeModal('advancedAI');
                              }
                            }}
                            className={`w-full px-3 py-2.5 text-left hover:bg-zinc-700 transition-colors ${selectedModel === model.id ? 'bg-zinc-700' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] text-white">{model.label}</span>
                              {model.tier === 'plus' && <Crown size={10} className="text-purple-400" />}
                              {model.tier === 'pro' && <Crown size={10} className="text-amber-400" />}
                            </div>
                            <span className="text-[10px] text-zinc-500">{model.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Style Selector */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-zinc-500">Style</span>
                    <button
                      onClick={() => { closeAllDropdowns(); setShowStyleDropdown(!showStyleDropdown); }}
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

                {/* Ratio Selector */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-zinc-500">{language === 'vi' ? 'Tỉ lệ' : 'Ratio'}</span>
                    <button
                      onClick={() => { closeAllDropdowns(); setShowRatioDropdown(!showRatioDropdown); }}
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

          {/* Actions - Fixed Bottom */}
          <div className="p-5 border-t border-zinc-800/50 space-y-3 bg-zinc-900/50">
            {/* Primary Action - Start Using (like Try Example flow) */}
            <button
              onClick={handleRecreate}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-[1.02]"
            >
              <Sparkles size={16} />
              {language === 'vi' ? 'Bắt đầu sử dụng' : 'Start Using'}
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-all duration-200"
              >
                <Download size={15} />
                Download
              </button>
              <button 
                onClick={handleEdit}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-all duration-200"
              >
                <Edit3 size={15} />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailModal;
