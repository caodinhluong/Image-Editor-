import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Heart, TrendingUp, Crown, User, 
  Download, Star, SlidersHorizontal, Check, ArrowUpRight, X,
  Image as ImageIcon, UploadCloud, DollarSign, Tag, Sparkles, AlertCircle,
  Beaker, Play, Save, Settings2, Plus, RefreshCw, Wand2, Layers,
  Share2, Copy, Scan, SplitSquareHorizontal, ArrowRight
} from 'lucide-react';
import { Button, Input, Badge, Card, Slider } from '../ui/UIComponents';
import { Template } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExtendedTemplate extends Template {
  downloads: string;
  likes: string;
  category: string;
  style: string;
  description?: string;
}

const templates: ExtendedTemplate[] = [
  { id: '1', title: 'Neon Cyberpunk Portrait', author: 'Akira Studio', price: 'Free', tags: ['Portrait', 'Cyberpunk'], thumbnail: 'https://picsum.photos/seed/cyber/600/800', trending: true, downloads: '12k', likes: '3.4k', category: 'Portrait', style: 'Cyberpunk', description: "Transforms ordinary portraits into futuristic cyberpunk characters with neon lighting and chromatic aberration effects." },
  { id: '2', title: 'Minimalist Product', author: 'Ecommerce Pro', price: 5, tags: ['Product', 'Clean'], thumbnail: 'https://picsum.photos/seed/product/600/600', trending: false, downloads: '5k', likes: '1.2k', category: 'Product', style: 'Minimalist', description: "Clean, studio-quality lighting for product photography. Removes distractions and enhances texture details." },
  { id: '3', title: 'Cinematic Color Grade', author: 'FilmLook', price: 12, tags: ['Color', 'Filter'], thumbnail: 'https://picsum.photos/seed/film/600/900', trending: true, downloads: '8.5k', likes: '2.1k', category: 'Photography', style: 'Cinematic', description: "Apply the teal and orange Hollywood look to your street photography. Enhances contrast and mood." },
  { id: '4', title: 'Vintage 90s Vibe', author: 'RetroKing', price: 'Free', tags: ['Retro', 'Texture'], thumbnail: 'https://picsum.photos/seed/vintage/600/700', trending: false, downloads: '22k', likes: '5k', category: 'Photography', style: 'Vintage', description: "Authentic 90s film aesthetic with grain, light leaks, and slightly washed-out blacks." },
  { id: '5', title: 'Professional Headshot', author: 'CorpStyle', price: 2, tags: ['Business', 'Retouch'], thumbnail: 'https://picsum.photos/seed/corp/600/600', trending: true, downloads: '4k', likes: '900', category: 'Portrait', style: 'Professional', description: "AI retouching for business profiles. Smooths skin texture while keeping it natural, brightens eyes." },
  { id: '6', title: 'Food Photography Pop', author: 'TastyLens', price: 'Free', tags: ['Food', 'Color'], thumbnail: 'https://picsum.photos/seed/food/600/800', trending: false, downloads: '3.2k', likes: '850', category: 'Product', style: 'Commercial', description: "Make food look delicious with enhanced saturation, sharpness, and a warm appetizing tone." },
  { id: '7', title: 'Real Estate HDR', author: 'HomeView', price: 8, tags: ['Architecture'], thumbnail: 'https://picsum.photos/seed/house/600/500', trending: false, downloads: '1.5k', likes: '300', category: 'Architecture', style: 'HDR', description: "High Dynamic Range effect for interior and exterior real estate shots. Balances windows and shadows." },
  { id: '8', title: 'Dreamy Wedding', author: 'LoveCapture', price: 15, tags: ['Wedding', 'Soft'], thumbnail: 'https://picsum.photos/seed/wedding/600/800', trending: true, downloads: '6k', likes: '1.8k', category: 'Portrait', style: 'Soft', description: "Soft, romantic glow with pastel tones perfect for wedding and engagement photography." },
  { id: '9', title: 'Abstract 3D Shape', author: 'RenderGod', price: 20, tags: ['3D', 'Abstract'], thumbnail: 'https://picsum.photos/seed/3dshape/600/600', trending: true, downloads: '9k', likes: '2.5k', category: '3D Asset', style: 'Abstract', description: "Generates abstract 3D shapes suitable for background elements and modern UI design." },
  { id: '10', title: 'Fashion Editorial', author: 'VogueAI', price: 'Free', tags: ['Fashion', 'High-end'], thumbnail: 'https://picsum.photos/seed/fashion2/600/1000', trending: true, downloads: '15k', likes: '4.2k', category: 'Fashion', style: 'Editorial', description: "High-contrast, edgy fashion magazine look. Emphasizes clothing textures and model pose." },
];

// --- TEMPLATE DETAIL MODAL ---
const TemplateDetailModal: React.FC<{ template: ExtendedTemplate, onClose: () => void }> = ({ template, onClose }) => {
   const [viewMode, setViewMode] = useState<'after' | 'before' | 'split'>('after');
   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setIsProcessing(true);
         const reader = new FileReader();
         reader.onload = (ev) => {
            setTimeout(() => { // Simulate processing delay
               setUploadedImage(ev.target?.result as string);
               setIsProcessing(false);
            }, 1500);
         }
         reader.readAsDataURL(e.target.files[0]);
      }
   }

   const handleUseTemplate = () => {
      alert(`Opening Editor with template: ${template.title}`);
      onClose();
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
         <div className="bg-white dark:bg-dark-surface w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200 ring-1 ring-zinc-800 relative">
            
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-zinc-800 text-white rounded-full transition-colors">
               <X size={20} />
            </button>

            {/* LEFT: PREVIEW AREA */}
            <div className="w-full md:w-7/12 bg-zinc-900 relative flex items-center justify-center overflow-hidden group">
               {/* Image Container */}
               <div className="relative w-full h-full md:h-[600px] bg-black">
                  <img 
                     src={uploadedImage || template.thumbnail} 
                     className={`w-full h-full object-contain transition-all duration-500 ${viewMode === 'before' ? 'grayscale brightness-75 blur-[1px]' : ''}`}
                     alt="Preview"
                  />
                  
                  {/* Processing Overlay */}
                  {isProcessing && (
                     <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                        <div className="w-12 h-12 border-4 border-repix-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold animate-pulse">Applying AI Template...</p>
                     </div>
                  )}

                  {/* View Controls Overlay */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full p-1.5 flex gap-1 border border-white/10 shadow-xl">
                     <button 
                        onClick={() => setViewMode('before')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${viewMode === 'before' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                     >
                        Original
                     </button>
                     <button 
                        onClick={() => setViewMode('after')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${viewMode === 'after' ? 'bg-repix-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                     >
                        Result
                     </button>
                  </div>
               </div>
            </div>

            {/* RIGHT: INFO & ACTIONS */}
            <div className="w-full md:w-5/12 bg-white dark:bg-dark-surface flex flex-col h-full overflow-hidden">
               <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                  
                  {/* Header */}
                  <div>
                     <div className="flex items-start justify-between mb-4">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              {typeof template.price === 'number' ? (
                                 <Badge className="bg-yellow-400 text-black border-0 font-bold px-2">PRO</Badge>
                              ) : (
                                 <Badge className="bg-green-500 text-white border-0 font-bold px-2">FREE</Badge>
                              )}
                              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{template.category}</span>
                           </div>
                           <h2 className="text-3xl font-bold text-zinc-900 dark:text-white leading-tight">{template.title}</h2>
                        </div>
                        <div className="flex flex-col items-center">
                           <button className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors">
                              <Heart size={20} />
                           </button>
                           <span className="text-xs text-zinc-500 mt-1">{template.likes}</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-blue-500 p-[2px]">
                           <img src={`https://picsum.photos/seed/${template.author}/50/50`} className="w-full h-full rounded-full border border-white dark:border-zinc-900" alt={template.author} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-zinc-900 dark:text-white">{template.author}</p>
                           <p className="text-xs text-zinc-500">Verified Creator</p>
                        </div>
                        <Button size="sm" variant="outline" className="ml-auto h-8 text-xs">Follow</Button>
                     </div>
                  </div>

                  {/* Description & DNA */}
                  <div className="space-y-4">
                     <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Description</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                           {template.description || "Transform your photos with this professional grade AI preset. Designed to enhance lighting, texture, and mood automatically."}
                        </p>
                     </div>

                     <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                           <Scan size={16} className="text-repix-500"/> Template DNA
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                           <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                              <span className="text-xs text-zinc-500 block mb-1">Model</span>
                              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Repix V2 Turbo</span>
                           </div>
                           <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                              <span className="text-xs text-zinc-500 block mb-1">Style Strength</span>
                              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">High (0.85)</span>
                           </div>
                           <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 col-span-2">
                              <span className="text-xs text-zinc-500 block mb-1">Tags</span>
                              <div className="flex flex-wrap gap-1">
                                 {template.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                       #{tag}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>

               {/* Sticky Bottom Actions */}
               <div className="p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
                  <div className="space-y-4">
                     
                     {/* Quick Try Upload */}
                     {!uploadedImage && (
                        <div className="relative group">
                           <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-repix-500 rounded-xl opacity-20 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                           <label className="relative flex items-center justify-center gap-3 w-full p-3 bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-transparent transition-all">
                              <UploadCloud size={20} className="text-zinc-400 group-hover:text-white" />
                              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                                 Try with your own photo
                              </span>
                              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                           </label>
                        </div>
                     )}

                     <div className="flex gap-4">
                        <div className="flex-1">
                           <Button 
                              size="lg" 
                              className="w-full h-14 text-lg rounded-xl shadow-xl shadow-repix-500/20"
                              onClick={handleUseTemplate}
                           >
                              <Wand2 className="mr-2" size={20} /> Use Template
                           </Button>
                        </div>
                        <Button size="lg" variant="secondary" className="h-14 w-14 rounded-xl px-0 shrink-0">
                           <Share2 size={20} />
                        </Button>
                     </div>
                     
                     <p className="text-center text-xs text-zinc-400">
                        {typeof template.price === 'number' 
                           ? `This template costs ${template.price} credits per use.` 
                           : "This template is free for commercial use."}
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};

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

const FilterSection: React.FC<{ title: string; options: string[] }> = ({ title, options }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (opt: string) => {
    if (selected.includes(opt)) setSelected(selected.filter(s => s !== opt));
    else setSelected([...selected, opt]);
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">{title}</h4>
      <div className="space-y-2">
        {options.map(opt => (
          <div key={opt} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggle(opt)}>
             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-repix-500 border-repix-500' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-repix-500'}`}>
                {selected.includes(opt) && <Check size={10} className="text-white" />}
             </div>
             <span className={`text-sm ${selected.includes(opt) ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TrendTracker: React.FC<{trans: any}> = ({trans}) => (
  <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-dark-surface border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-500 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
             </div>
             <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{trans.marketplace.trendTracker}</h3>
                <p className="text-xs text-zinc-500 hidden sm:block">{trans.marketplace.risingKeywords}</p>
             </div>
         </div>
         <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar max-w-[200px] sm:max-w-none mask-linear-fade">
             {[
               {k: "Y2K Aesthetic", v: "+120%"},
               {k: "Glassmorphism", v: "+85%"},
               {k: "Cyberpunk", v: "+60%"},
               {k: "Retro Anime", v: "+45%"}
             ].map((trend, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                   <span className="text-xs font-medium">{trend.k}</span>
                   <span className="text-xs font-bold text-green-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> {trend.v}</span>
                </div>
             ))}
         </div>
      </div>
  </div>
);

export const MarketplaceView: React.FC = () => {
  const { trans } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreatorStudio, setShowCreatorStudio] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplate | null>(null);
  
  return (
    <div className="flex h-full bg-light-bg dark:bg-dark-bg text-zinc-900 dark:text-white overflow-hidden relative">
      
      {/* Sidebar Filters (Desktop) */}
      <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface p-6 overflow-y-auto hidden md:block">
         <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg flex items-center gap-2"><Filter size={20} /> {trans.marketplace.filters}</h3>
            <span className="text-xs text-repix-500 cursor-pointer hover:underline">Reset</span>
         </div>
         <FilterSection title={trans.marketplace.categories} options={['Portrait', 'Product', 'Fashion', 'Architecture', '3D Asset', 'Illustration']} />
         <FilterSection title={trans.marketplace.styles} options={['Photorealistic', 'Anime', 'Minimalist', 'Cyberpunk', 'Vintage', 'Cinematic']} />
         <FilterSection title="License" options={[trans.marketplace.free, trans.marketplace.pro]} />
         <FilterSection title="Format" options={['Square (1:1)', 'Portrait (3:4)', 'Landscape (16:9)', 'Vertical (9:16)']} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header & Search */}
        <div className="sticky top-0 z-20 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 py-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                 <h1 className="text-2xl font-bold">{trans.marketplace.title}</h1>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.marketplace.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                   <span className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm font-medium">{trans.marketplace.credits}:</span>
                   <span className="text-repix-600 dark:text-repix-400 font-bold text-sm">1,250</span>
                 </div>
                 <Button size="sm" onClick={() => setShowCreatorStudio(true)}>
                    <UploadCloud size={16} className="mr-2" /> 
                    <span className="hidden sm:inline">{trans.marketplace.upload}</span>
                    <span className="sm:hidden">Upload</span>
                 </Button>
              </div>
           </div>

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
                 <select className="h-10 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-sm border-none outline-none cursor-pointer hidden md:block">
                    <option>{trans.marketplace.trending}</option>
                    <option>{trans.marketplace.newest}</option>
                    <option>{trans.marketplace.popular}</option>
                 </select>
                 <Button 
                   variant="outline" 
                   className="h-10 w-10 p-0 md:hidden bg-zinc-100 dark:bg-zinc-900 border-none"
                   onClick={() => setShowFilters(true)}
                 >
                    <SlidersHorizontal size={18}/>
                 </Button>
              </div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-8 space-y-8 md:space-y-12">
           
           {/* Trend Tracker */}
           <TrendTracker trans={trans} />

           {/* Hero Banner / Featured */}
           <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/50 aspect-[4/3] md:aspect-[4/1] flex items-end md:items-center">
              <img src="https://picsum.photos/seed/hero_art/1200/400" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/50 to-transparent"></div>
              
              <div className="relative z-10 p-6 md:p-12 max-w-2xl">
                 <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
                    <Star size={12} fill="currentColor" /> {trans.marketplace.featured}
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight">Neon Dreams Vol. 2</h2>
                 <p className="text-zinc-300 mb-6 line-clamp-2 text-sm md:text-base">Experience the next level of cyberpunk aesthetics with our community-curated collection of neon-soaked presets.</p>
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 border-0 w-full md:w-auto">Explore Collection</Button>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                       <User size={16} /> Created by <span className="text-white font-bold underline cursor-pointer">NeonMaster</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Masonry Grid */}
           <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {templates.map(template => (
                 <div 
                  key={template.id} 
                  onClick={() => setSelectedTemplate(template)}
                  className="group relative break-inside-avoid rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                 >
                    
                    {/* Image */}
                    <div className="relative">
                       <img src={template.thumbnail} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                       
                       {/* Overlay Gradient (Hidden by default, shown on hover/tap) */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                             <Button className="w-full mb-3 bg-white text-zinc-900 hover:bg-zinc-200 border-0 shadow-lg font-bold">
                                {trans.marketplace.useTemplate}
                             </Button>
                             
                             <div className="flex items-center justify-between text-white/90 text-xs font-medium">
                                <div className="flex items-center gap-3">
                                   <span className="flex items-center gap-1"><Download size={14} /> {template.downloads}</span>
                                   <span className="flex items-center gap-1"><Heart size={14} /> {template.likes}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="absolute top-3 left-3 flex gap-2">
                          {template.trending && (
                            <Badge className="bg-red-500/90 text-white backdrop-blur-sm border-0 shadow-sm flex items-center gap-1 px-2">
                               <TrendingUp size={10} /> {trans.marketplace.trending}
                            </Badge>
                          )}
                       </div>
                       
                       {/* PRO Badge with new Yellow Color */}
                       <div className="absolute top-3 right-3">
                          {typeof template.price === 'number' ? (
                             <Badge className="bg-yellow-400 text-black border-0 font-bold flex items-center gap-1 shadow-sm px-2">
                                <Crown size={12} fill="currentColor" /> PRO
                             </Badge>
                          ) : (
                             <Badge className="bg-black/50 text-white backdrop-blur-md border-0">{trans.marketplace.free}</Badge>
                          )}
                       </div>
                    </div>

                    <div className="p-3">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-200 text-sm truncate pr-2">{template.title}</h3>
                          <span className="text-xs font-semibold text-repix-600 dark:text-repix-400 shrink-0">
                            {typeof template.price === 'number' ? `${template.price}c` : ''}
                          </span>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 group/author cursor-pointer">
                             <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 p-[1px]">
                                <img src={`https://picsum.photos/seed/${template.author}/30/30`} className="w-full h-full rounded-full border border-white dark:border-zinc-900" />
                             </div>
                             <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover/author:text-zinc-900 dark:group-hover/author:text-zinc-200 transition-colors">{template.author}</span>
                          </div>
                          <button className="text-zinc-400 hover:text-red-500 transition-colors">
                             <Heart size={14} />
                          </button>
                       </div>
                    </div>

                 </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Template Detail Modal */}
      {selectedTemplate && (
         <TemplateDetailModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      )}

      {/* Creator Studio Overlay (Replaces Old Modal) */}
      {showCreatorStudio && (
        <CreatorStudio onClose={() => setShowCreatorStudio(false)} />
      )}

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
            <div className="relative bg-white dark:bg-dark-surface w-full sm:w-[400px] h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
               <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Filter size={20} /> {trans.marketplace.filters}</h3>
                  <Button size="icon" variant="ghost" onClick={() => setShowFilters(false)}><X size={20} /></Button>
               </div>
               <div className="flex-1 overflow-y-auto p-6">
                  <FilterSection title={trans.marketplace.categories} options={['Portrait', 'Product', 'Fashion', 'Architecture', '3D Asset', 'Illustration']} />
                  <FilterSection title={trans.marketplace.styles} options={['Photorealistic', 'Anime', 'Minimalist', 'Cyberpunk', 'Vintage', 'Cinematic']} />
                  <FilterSection title="License" options={[trans.marketplace.free, trans.marketplace.pro]} />
                  <FilterSection title="Format" options={['Square (1:1)', 'Portrait (3:4)', 'Landscape (16:9)', 'Vertical (9:16)']} />
               </div>
               <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                  <Button className="w-full h-12 rounded-xl text-lg font-bold" onClick={() => setShowFilters(false)}>Apply Filters</Button>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};