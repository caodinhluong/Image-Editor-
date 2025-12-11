
import React, { useState, useEffect, useRef } from 'react';
import { 
  Wand2, Eraser, Move, Crop, Layers, Download, 
  Undo, Redo, Sparkles, Share2, Aperture, 
  ScanFace, Palette, BrainCircuit, Upload, Command, Zap,
  X, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowRight, History,
  MessageSquare, Bell, Activity, ZoomIn, ZoomOut, Maximize2,
  ImagePlus, Paperclip, Trash2, Lock
} from 'lucide-react';
import { Button, Slider, Badge, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { HistoryPanel } from './HistoryPanel';
import { AdvancedLayerPanel } from './AdvancedLayerPanel';
import { CommentsPanel } from '../Collaboration/CommentsPanel';
import { NotificationCenter } from '../Collaboration/NotificationCenter';
import { PresenceIndicators } from '../Collaboration/PresenceIndicators';
import { BrandStyleApplicator } from '../BrandKit/BrandStyleApplicator';
import { ConsistencyScoreCard } from '../BrandKit/ConsistencyScoreCard';
import { AIContentAdvisor } from '../AI/AIContentAdvisor';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { FeatureKey } from '../../types/subscription';
import { CreditsIndicator } from '../Subscription/FeatureGate';
import { ToolDemoPanel } from './ToolDemoPanel';

interface EditorViewProps {
  initialImage?: string;
}

export const EditorView: React.FC<EditorViewProps> = ({ initialImage }) => {
  const { trans } = useLanguage();
  const { currentPlan } = useSubscription();
  
  // Check if user has Team plan for collaboration features
  const hasTeamPlan = currentPlan === 'team';
  
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'adjustments' | 'layers' | 'style' | 'brandkit' | 'advisor'>('adjustments');
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showObjectOverlay, setShowObjectOverlay] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [showGeneratePreview, setShowGeneratePreview] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [currentCanvasImage, setCurrentCanvasImage] = useState(initialImage || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop');
  
  // Prompt Upload States
  const [uploadedImages, setUploadedImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Toolstrip collapse state
  const [isToolstripCollapsed, setIsToolstripCollapsed] = useState(false);
  // Right panel collapse state
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  // Tool Demo Panel state
  const [showToolDemo, setShowToolDemo] = useState<string | null>(null);
  // Check if tool demos are disabled
  const [hideToolDemos, setHideToolDemos] = useState(() => {
    return localStorage.getItem('hideToolDemos') === 'true';
  });
  
  // Moodboard Style Transfer States
  const [selectedStylePreset, setSelectedStylePreset] = useState<string | null>(null);
  const [styleStrength, setStyleStrength] = useState(80);
  const [isApplyingStyle, setIsApplyingStyle] = useState(false);
  const [appliedStyle, setAppliedStyle] = useState<string | null>(null);
  const [showStyleSuccess, setShowStyleSuccess] = useState(false);
  
  // AI Preset Generator States
  const [stylePrompt, setStylePrompt] = useState('');
  const [isGeneratingPreset, setIsGeneratingPreset] = useState(false);
  const [customPresets, setCustomPresets] = useState<typeof defaultPresets>([]);

  // Default style presets data
  const defaultPresets = [
    { 
      id: 'cyberpunk', 
      name: 'Cyberpunk', 
      img: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=80&h=80&fit=crop',
      colors: ['#FF00FF', '#00FFFF', '#FF1493', '#8B00FF', '#1E90FF'],
      filter: 'hue-rotate(280deg) saturate(1.5) contrast(1.2)',
      isCustom: false
    },
    { 
      id: 'pastel', 
      name: 'Pastel', 
      img: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=80&h=80&fit=crop',
      colors: ['#FFB6C1', '#E6E6FA', '#98FB98', '#FFDAB9', '#B0E0E6'],
      filter: 'saturate(0.7) brightness(1.1) contrast(0.9)',
      isCustom: false
    },
    { 
      id: 'vintage', 
      name: 'Vintage', 
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',
      colors: ['#D2691E', '#8B4513', '#DEB887', '#F5DEB3', '#CD853F'],
      filter: 'sepia(0.4) saturate(0.8) contrast(1.1) brightness(0.95)',
      isCustom: false
    },
  ];

  // Combine default and custom presets
  const stylePresets = [...defaultPresets, ...customPresets];

  const currentPreset = stylePresets.find(p => p.id === selectedStylePreset);

  // AI Preset generation based on prompt
  const generatePresetFromPrompt = (promptText: string) => {
    // Map common keywords to filter styles
    const promptLower = promptText.toLowerCase();
    
    if (promptLower.includes('neon') || promptLower.includes('cyber') || promptLower.includes('futuristic')) {
      return {
        colors: ['#FF00FF', '#00FFFF', '#FF1493', '#8B00FF', '#1E90FF'],
        filter: 'hue-rotate(280deg) saturate(1.8) contrast(1.3) brightness(1.1)',
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=80&h=80&fit=crop'
      };
    } else if (promptLower.includes('warm') || promptLower.includes('sunset') || promptLower.includes('golden')) {
      return {
        colors: ['#FF6B35', '#F7931E', '#FFD700', '#FF4500', '#FFA500'],
        filter: 'sepia(0.2) saturate(1.4) brightness(1.05) hue-rotate(-10deg)',
        img: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=80&h=80&fit=crop'
      };
    } else if (promptLower.includes('cold') || promptLower.includes('ice') || promptLower.includes('winter')) {
      return {
        colors: ['#00CED1', '#4169E1', '#87CEEB', '#B0E0E6', '#E0FFFF'],
        filter: 'saturate(0.9) brightness(1.1) hue-rotate(180deg) contrast(1.05)',
        img: 'https://images.unsplash.com/photo-1478719059408-592965723cbc?w=80&h=80&fit=crop'
      };
    } else if (promptLower.includes('dark') || promptLower.includes('moody') || promptLower.includes('dramatic')) {
      return {
        colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560'],
        filter: 'contrast(1.3) brightness(0.85) saturate(1.2)',
        img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=80&h=80&fit=crop'
      };
    } else if (promptLower.includes('nature') || promptLower.includes('forest') || promptLower.includes('green')) {
      return {
        colors: ['#228B22', '#32CD32', '#90EE90', '#006400', '#8FBC8F'],
        filter: 'saturate(1.2) hue-rotate(60deg) brightness(1.05)',
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=80&h=80&fit=crop'
      };
    } else if (promptLower.includes('retro') || promptLower.includes('80s') || promptLower.includes('synthwave')) {
      return {
        colors: ['#FF6EC7', '#7B68EE', '#00CED1', '#FF1493', '#9400D3'],
        filter: 'saturate(1.6) contrast(1.2) hue-rotate(320deg)',
        img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=80&h=80&fit=crop'
      };
    } else {
      // Default creative style
      return {
        colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
        filter: 'saturate(1.3) contrast(1.1) brightness(1.05)',
        img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=80&h=80&fit=crop'
      };
    }
  };

  // Handle AI preset generation
  const handleGeneratePreset = () => {
    if (!stylePrompt.trim()) return;
    
    setIsGeneratingPreset(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const generatedStyle = generatePresetFromPrompt(stylePrompt);
      const newPreset = {
        id: `custom-${Date.now()}`,
        name: stylePrompt.slice(0, 15) + (stylePrompt.length > 15 ? '...' : ''),
        img: generatedStyle.img,
        colors: generatedStyle.colors,
        filter: generatedStyle.filter,
        isCustom: true
      };
      
      setCustomPresets(prev => [newPreset, ...prev]);
      setSelectedStylePreset(newPreset.id);
      setStylePrompt('');
      setIsGeneratingPreset(false);
    }, 2000);
  };

  // Update canvas when initialImage changes
  useEffect(() => {
    if (initialImage) {
      setCurrentCanvasImage(initialImage);
    }
  }, [initialImage]);

  // Handle style preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedStylePreset(presetId);
    setShowStyleSuccess(false);
  };

  // Handle apply style transfer
  const handleApplyStyleTransfer = () => {
    if (!selectedStylePreset) return;
    
    setIsApplyingStyle(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setAppliedStyle(selectedStylePreset);
      setIsApplyingStyle(false);
      setShowStyleSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowStyleSuccess(false), 3000);
    }, 2000);
  };

  // Reset style
  const handleResetStyle = () => {
    setAppliedStyle(null);
    setSelectedStylePreset(null);
    setShowStyleSuccess(false);
  };
  
  // Subscription hook
  const { canAccess, triggerUpgradeModal, hasEnoughCredits } = useSubscription();

  const tools: { id: string; icon: React.ElementType; label: string; feature?: FeatureKey; creditOp?: string }[] = [
    { id: 'move', icon: Move, label: trans.editor.move },
    { id: 'object-select', icon: ScanFace, label: trans.editor.objectSelect },
    { id: 'generative', icon: Sparkles, label: trans.editor.genFill, feature: 'genFill', creditOp: 'genFill' },
    { id: 'magic-erase', icon: Eraser, label: trans.editor.magicErase, feature: 'magicErase', creditOp: 'magicErase' },
    { id: 'crop', icon: Crop, label: trans.editor.crop },
    { id: 'remove-bg', icon: Aperture, label: trans.editor.removeBg, feature: 'removeBg', creditOp: 'removeBg' },
    { id: 'upscale-4k', icon: Maximize2, label: 'Upscale 4K', feature: 'upscale4K', creditOp: 'upscale' },
    { id: 'style-transfer', icon: Palette, label: 'Style Transfer', feature: 'styleTransfer', creditOp: 'styleTransfer' },
  ];

  // Handle tool click with feature gating
  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.feature && !canAccess(tool.feature)) {
      triggerUpgradeModal(tool.feature);
      return;
    }
    if (tool.creditOp && !hasEnoughCredits(tool.creditOp)) {
      triggerUpgradeModal(tool.feature || 'textToImage');
      return;
    }
    // Show demo panel for tools that have demos (not move tool), unless disabled
    if (tool.id !== 'move' && !hideToolDemos) {
      setShowToolDemo(tool.id);
    } else {
      setActiveTool(tool.id);
    }
  };

  // Handle apply tool from demo
  const handleApplyToolFromDemo = () => {
    if (showToolDemo) {
      setActiveTool(showToolDemo);
      setShowToolDemo(null);
    }
  };

  // Handle don't show tool demos again
  const handleDontShowToolDemos = () => {
    localStorage.setItem('hideToolDemos', 'true');
    setHideToolDemos(true);
    if (showToolDemo) {
      setActiveTool(showToolDemo);
      setShowToolDemo(null);
    }
  };
  
  // Mock Layers
  const [layers, setLayers] = useState([
    { id: 1, name: 'Product Shot', visible: true, locked: false },
    { id: 2, name: 'Shadows', visible: true, locked: true },
    { id: 3, name: 'Background', visible: true, locked: false },
  ]);

  // Simulate Object Detection when tool is selected
  useEffect(() => {
    if (activeTool === 'object-select') {
      const timer = setTimeout(() => setShowObjectOverlay(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowObjectOverlay(false);
    }
  }, [activeTool]);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setShowGeneratePreview(true);
    setGenerateProgress(0);
    setSelectedGeneratedImage(null);
    
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

    // Simulate AI Generation with 4 variations
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerateProgress(100);
      setIsGenerating(false);
      
      // Generate 4 different image variations
      const variations = [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=750&fit=crop',
      ];
      setGeneratedImages(variations);
    }, 3000);
  };

  const handleSelectGeneratedImage = (index: number) => {
    setSelectedGeneratedImage(index);
  };

  // Handle prompt image upload
  const handlePromptImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    const newImages = files.slice(0, 4 - uploadedImages.length).map((file: File, idx: number) => ({
      id: `upload-${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages].slice(0, 4));
    setIsPromptExpanded(true);
  };

  const handleRemoveUploadedImage = (id: string) => {
    setUploadedImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
    if (uploadedImages.length <= 1) setIsPromptExpanded(false);
  };

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
          setIsPromptExpanded(true);
        }
        break;
      }
    }
  };

  const handleApplyGeneratedImage = () => {
    if (selectedGeneratedImage === null) return;
    // Apply the selected image to canvas
    setCurrentCanvasImage(generatedImages[selectedGeneratedImage]);
    setShowGeneratePreview(false);
    setGeneratedImages([]);
    setSelectedGeneratedImage(null);
    setPrompt('');
  };

  const handleCancelGenerate = () => {
    setShowGeneratePreview(false);
    setGeneratedImages([]);
    setSelectedGeneratedImage(null);
    setIsGenerating(false);
    setGenerateProgress(0);
  };

  const enhancePrompt = () => {
    if (!prompt) return;
    setPrompt(prompt + " [cinematic lighting, 8k resolution, highly detailed]");
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-light-bg dark:bg-dark-bg text-zinc-900 dark:text-white overflow-hidden relative">
      
      {/* TOOLBAR - Desktop: Left Sidebar | Mobile: Bottom Bar */}
      <div className={`order-3 md:order-1 w-full ${isToolstripCollapsed ? 'md:w-16' : 'md:w-44'} h-16 md:h-full border-t md:border-t-0 md:border-r border-zinc-200 dark:border-dark-border flex flex-row md:flex-col items-center justify-between px-4 md:px-2 md:py-4 gap-2 bg-white dark:bg-dark-surface z-30 overflow-x-auto md:overflow-y-auto hide-scrollbar shrink-0 safe-pb relative transition-all duration-300`}>
        
        {/* Collapse Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsToolstripCollapsed(!isToolstripCollapsed)}
          className="hidden md:flex absolute -right-3 top-4 z-40 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center text-zinc-500 hover:text-repix-500 hover:border-repix-500 transition-colors shadow-sm"
          title={isToolstripCollapsed ? 'Expand toolbar' : 'Collapse toolbar'}
        >
          {isToolstripCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
        
        <div className="flex flex-row md:flex-col gap-1 w-full md:w-full items-center justify-between md:justify-start">
          {tools.map((tool) => {
            const isLocked = tool.feature && !canAccess(tool.feature);
            
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                title={isToolstripCollapsed ? tool.label : undefined}
                className={`${isToolstripCollapsed ? 'p-3 justify-center' : 'px-3 py-2.5 justify-start gap-3'} w-full flex items-center rounded-xl transition-all group relative shrink-0 ${
                  activeTool === tool.id 
                    ? 'bg-gradient-to-br from-pink-500 to-repix-600 text-white shadow-lg shadow-repix-500/40' 
                    : isLocked
                    ? 'text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <tool.icon size={18} className={isLocked ? 'opacity-50' : ''} />
                
                {/* Tool Label - Only show when expanded */}
                {!isToolstripCollapsed && (
                  <span className={`hidden md:block text-xs font-medium truncate ${isLocked ? 'opacity-50' : ''}`}>
                    {tool.label}
                  </span>
                )}
                
                {/* Lock icon for premium features */}
                {isLocked && (
                  <div className={`absolute ${isToolstripCollapsed ? '-top-1 -right-1' : 'top-1/2 -translate-y-1/2 right-2'} w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center`}>
                    <Lock size={10} className="text-white" />
                  </div>
                )}
                
                {/* Tooltip - Only show when collapsed */}
                {isToolstripCollapsed && (
                  <span className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-zinc-900 dark:bg-zinc-700 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] pointer-events-none shadow-lg">
                    {tool.label}
                    {isLocked && <span className="ml-1 text-amber-400">(PRO)</span>}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900 dark:border-r-zinc-700"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="order-2 flex-1 flex flex-col relative bg-zinc-50 dark:bg-[#09090b] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* Top Bar inside Canvas */}
        <div className="h-14 border-b border-zinc-200 dark:border-dark-border flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-2">
            {/* Mobile Back Button (simulated) */}
            <div className="md:hidden p-1 mr-1">
               <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <ChevronLeft size={14} />
               </div>
            </div>
            <Badge variant="default" className="hidden sm:inline-flex">{trans.editor.draft}</Badge>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[120px] sm:max-w-none">Untitled Project_01</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
             
             {/* Undo/Redo/History Buttons */}
             <div className="hidden md:flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white" title="Undo">
                   <Undo size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white" title="Redo">
                   <Redo size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${isHistoryOpen ? 'text-repix-500 bg-repix-500/10' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  title={trans.editor.history}
                >
                   <History size={18} />
                </Button>
             </div>

             {/* Collaboration Tools - Only for Team/Enterprise plans */}
             {hasTeamPlan && (
               <div className="hidden md:flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 relative ${isCommentsOpen ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                    title="Comments"
                  >
                     <MessageSquare size={18} />
                     <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 relative ${isNotificationsOpen ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    title="Notifications"
                  >
                     <Bell size={18} />
                     {unreadNotifications > 0 && (
                       <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadNotifications}</span>
                     )}
                  </Button>
               </div>
             )}

             {/* Presence Indicators - Only for Team/Enterprise plans */}
             {hasTeamPlan && (
               <div className="hidden md:flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
                  <PresenceIndicators />
               </div>
             )}

            <Button size="sm" variant="secondary" className="hidden sm:flex"><Share2 size={16} className="mr-2" /> {trans.editor.share}</Button>
            <Button size="sm" variant="primary"><Download size={16} className="mr-2 hidden sm:inline" /> {trans.editor.export}</Button>
          </div>
        </div>

        {/* The Canvas */}
        <div 
          className={`flex-1 flex items-center justify-center p-4 md:p-8 pb-24 md:pb-28 overflow-hidden relative group z-10 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
          onWheel={(e) => {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -10 : 10;
              setZoom(prev => Math.min(200, Math.max(25, prev + delta)));
            }
          }}
          onMouseDown={(e) => {
            if (e.button === 0) { // Left click
              setIsPanning(true);
              setPanStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
            }
          }}
          onMouseMove={(e) => {
            if (isPanning) {
              setPanPosition({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
              });
            }
          }}
          onMouseUp={() => setIsPanning(false)}
          onMouseLeave={() => setIsPanning(false)}
        >
          <div 
            className={`relative shadow-2xl shadow-black/20 dark:shadow-black/50 ${isPanning ? '' : 'transition-transform duration-200'}`}
            style={{ 
              width: '100%', 
              maxWidth: '500px',
              aspectRatio: '4/5',
              transform: `scale(${zoom / 100}) translate(${panPosition.x / (zoom / 100)}px, ${panPosition.y / (zoom / 100)}px)`
            }}
          >
             {/* Canvas Image with Style Filter */}
            <img 
              src={currentCanvasImage} 
              alt="Canvas" 
              className="w-full h-full object-cover rounded-lg transition-all duration-500"
              style={{ 
                filter: appliedStyle 
                  ? stylePresets.find(p => p.id === appliedStyle)?.filter 
                  : 'none'
              }}
            />
            
            {/* Style Applied Badge */}
            {appliedStyle && (
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                <Sparkles size={12} />
                {stylePresets.find(p => p.id === appliedStyle)?.name} Style
              </div>
            )}

            {/* AI Selection Overlay Mock */}
            {activeTool === 'generative' && (
               <div className="absolute inset-0 border-2 border-repix-500 bg-repix-500/10 rounded-lg flex items-center justify-center">
                  <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-full border border-repix-500/50 shadow-xl flex items-center gap-2 animate-pulse">
                     <Wand2 size={16} className="text-repix-500" />
                     <span className="text-sm font-medium text-zinc-900 dark:text-white">Select area</span>
                  </div>
               </div>
            )}

            {/* Smart Object Detection Overlay */}
            {showObjectOverlay && (
               <div className="absolute inset-0 pointer-events-none">
                 {/* Full body - Person detection */}
                 <div className="absolute top-[5%] left-[15%] w-[70%] h-[90%] border-2 border-accent-blue/80 rounded-lg bg-accent-blue/10 flex items-start justify-center animate-in fade-in duration-300">
                    <span className="bg-accent-blue text-white text-[10px] px-2 py-0.5 rounded-sm -mt-2.5 font-medium shadow-sm">Person 99%</span>
                 </div>
                 {/* Face detection */}
                 <div className="absolute top-[8%] left-[30%] w-[40%] h-[25%] border-2 border-green-500/80 rounded-lg bg-green-500/10 flex items-start justify-center animate-in fade-in duration-400">
                    <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-sm -mt-2.5 font-medium shadow-sm">Face 97%</span>
                 </div>
                 {/* Clothing - Top */}
                 <div className="absolute top-[32%] left-[20%] w-[60%] h-[30%] border-2 border-purple-500/80 rounded-lg bg-purple-500/10 flex items-start justify-center animate-in fade-in duration-500">
                    <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-sm -mt-2.5 font-medium shadow-sm">Clothing 96%</span>
                 </div>
                 {/* Instruction */}
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                    <ScanFace size={12} />
                    <span>Click to select object</span>
                 </div>
               </div>
            )}

            {/* Crop Tool Overlay - Grid & Handles */}
            {activeTool === 'crop' && (
              <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                {/* Darkened areas outside crop */}
                <div className="absolute inset-0 bg-black/40"></div>
                {/* Crop area */}
                <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] bg-transparent border-2 border-white">
                  {/* Rule of thirds grid */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/30"></div>
                    ))}
                  </div>
                  {/* Corner handles */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-sm shadow-lg"></div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-sm shadow-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-sm shadow-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-sm shadow-lg"></div>
                  {/* Edge handles */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white rounded-sm shadow-lg"></div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white rounded-sm shadow-lg"></div>
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-8 bg-white rounded-sm shadow-lg"></div>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-8 bg-white rounded-sm shadow-lg"></div>
                </div>
                {/* Dimension label */}
                <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Crop size={12} />
                  <span>400 × 500 px</span>
                </div>
              </div>
            )}

            {/* Magic Erase Tool Overlay - Brush Cursor & Erased Areas */}
            {activeTool === 'magic-erase' && (
              <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                {/* Simulated erased area with checkerboard pattern */}
                <div 
                  className="absolute top-[30%] right-[15%] w-[25%] h-[20%] rounded-full opacity-80"
                  style={{
                    background: 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 50% / 10px 10px'
                  }}
                ></div>
                {/* Brush cursor indicator */}
                <div className="absolute top-[35%] right-[20%] w-12 h-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-white/10 animate-pulse">
                  <Eraser size={16} className="text-white" />
                </div>
                {/* Instruction tooltip */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-repix-600 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Eraser size={14} />
                  <span>Brush over objects to remove</span>
                </div>
              </div>
            )}

            {/* Move Tool Overlay - Transform Handles */}
            {activeTool === 'move' && (
              <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                {/* Selection border with dashed line */}
                <div className="absolute top-[8%] left-[18%] w-[64%] h-[84%] border-2 border-dashed border-repix-500">
                  {/* Corner resize handles */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-repix-500 rounded-sm shadow-lg cursor-nwse-resize"></div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-repix-500 rounded-sm shadow-lg cursor-nesw-resize"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-repix-500 rounded-sm shadow-lg cursor-nesw-resize"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-repix-500 rounded-sm shadow-lg cursor-nwse-resize"></div>
                  {/* Rotation handle */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-repix-500"></div>
                    <div className="w-5 h-5 rounded-full bg-repix-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                        <path d="M21 3v5h-5" />
                      </svg>
                    </div>
                  </div>
                  {/* Center move indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-repix-500/20 border-2 border-repix-500 flex items-center justify-center">
                    <Move size={14} className="text-repix-500" />
                  </div>
                </div>
                {/* Position info */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-3">
                  <span>X: 120</span>
                  <span className="w-px h-3 bg-white/30"></span>
                  <span>Y: 80</span>
                  <span className="w-px h-3 bg-white/30"></span>
                  <span>↻ 0°</span>
                </div>
              </div>
            )}

            {/* Remove Background Tool Overlay - Mask Preview */}
            {activeTool === 'remove-bg' && (
              <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                {/* Checkerboard background showing transparency */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-60"
                  style={{
                    background: 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 50% / 20px 20px'
                  }}
                ></div>
                {/* Subject silhouette mask */}
                <div className="absolute top-[8%] left-[25%] w-[50%] h-[85%] bg-gradient-to-b from-repix-500/30 to-pink-500/30 rounded-t-full border-2 border-dashed border-repix-400"></div>
                {/* Processing indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-dark-surface px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
                  <div className="relative">
                    <Aperture size={32} className="text-repix-500 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Detecting subject...</p>
                    <p className="text-xs text-zinc-500">AI is analyzing the image</p>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <button className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs px-4 py-2 rounded-full shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                    Refine Edge
                  </button>
                  <button className="bg-gradient-to-r from-pink-500 to-repix-600 text-white text-xs px-4 py-2 rounded-full shadow-lg hover:from-pink-600 hover:to-repix-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Preview Overlay */}
        {showGeneratePreview && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-repix-600 rounded-xl">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">AI Generation</h2>
                  <p className="text-white/60 text-sm truncate max-w-[300px]">"{prompt}"</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white/60 hover:text-white hover:bg-white/10"
                onClick={handleCancelGenerate}
              >
                <X size={24} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
              {isGenerating ? (
                // Loading State
                <div className="text-center space-y-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-repix-500 animate-spin"
                      style={{ animationDuration: '1s' }}
                    ></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500/20 to-repix-600/20 flex items-center justify-center">
                      <Sparkles size={32} className="text-repix-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-2">Generating variations...</p>
                    <p className="text-white/50 text-sm mb-4">Creating 4 unique options for you</p>
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-repix-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(generateProgress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-white/40 text-xs mt-2">{Math.round(Math.min(generateProgress, 100))}%</p>
                  </div>
                </div>
              ) : (
                // Results Grid
                <div className="w-full max-w-4xl space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-white/60 text-sm">Select your favorite variation</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generatedImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectGeneratedImage(index)}
                        className={`relative aspect-[4/5] rounded-xl overflow-hidden group transition-all duration-300 ${
                          selectedGeneratedImage === index 
                            ? 'ring-4 ring-repix-500 scale-[1.02]' 
                            : 'ring-2 ring-white/10 hover:ring-white/30'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Variation ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 transition-opacity duration-200 ${
                          selectedGeneratedImage === index 
                            ? 'bg-repix-500/20' 
                            : 'bg-black/0 group-hover:bg-black/30'
                        }`}></div>
                        
                        {/* Selection Badge */}
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold transition-all ${
                          selectedGeneratedImage === index 
                            ? 'bg-repix-500 text-white' 
                            : 'bg-black/50 text-white/80'
                        }`}>
                          {selectedGeneratedImage === index ? '✓ Selected' : `V${index + 1}`}
                        </div>

                        {/* Quality Badge */}
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/50 text-white/80 text-xs font-medium backdrop-blur-sm">
                          {['Best Match', 'Creative', 'Vibrant', 'Minimal'][index]}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handleCancelGenerate}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handleGenerate}
                    >
                      <Sparkles size={16} className="mr-2" />
                      Regenerate
                    </Button>
                    <Button 
                      disabled={selectedGeneratedImage === null}
                      onClick={handleApplyGeneratedImage}
                      className="bg-gradient-to-r from-pink-500 to-repix-600 hover:from-pink-600 hover:to-repix-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply Selected
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zoom Controls - Bottom Right Corner */}
        <div className={`absolute bottom-20 md:bottom-24 right-4 z-20 transition-opacity duration-300 ${showGeneratePreview ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-1 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg p-1">
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
              disabled={zoom >= 200}
              title="Zoom In (+)"
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={() => { setZoom(100); setPanPosition({ x: 0, y: 0 }); }}
              className="px-2 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-repix-500 transition-colors min-w-[48px] text-center"
              title="Reset View (100%)"
            >
              {zoom}%
            </button>
            <button 
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
              disabled={zoom <= 25}
              title="Zoom Out (-)"
            >
              <ZoomOut size={18} />
            </button>
            <div className="w-full h-px bg-zinc-200 dark:bg-zinc-700 my-0.5"></div>
            <button 
              onClick={() => { setZoom(75); setPanPosition({ x: 0, y: 0 }); }}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Floating Prompt Bar (Responsive Fixed) - Enhanced with Image Upload */}
        <div className={`absolute bottom-4 md:bottom-8 left-0 right-0 px-3 md:px-4 flex justify-center z-20 pointer-events-none transition-all duration-300 ${showGeneratePreview ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`w-full max-w-2xl bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border border-repix-500/30 rounded-2xl shadow-2xl ring-1 ring-repix-500/10 dark:ring-white/5 pointer-events-auto transition-all duration-300 ${isPromptExpanded || uploadedImages.length > 0 ? 'p-3' : 'p-1.5 md:p-2'}`}>
            
            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img 
                      src={img.preview} 
                      alt="Upload" 
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border-2 border-zinc-200 dark:border-zinc-700"
                    />
                    <button
                      onClick={() => handleRemoveUploadedImage(img.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={12} className="text-white" />
                    </button>
                    {/* Image type badge */}
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
              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePromptImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/20 transition-colors shrink-0"
                title="Upload image (Ctrl+V to paste)"
              >
                <Paperclip size={18} />
              </button>

              {/* AI Icon - Hidden on mobile when images uploaded */}
              <div className={`p-2 bg-gradient-to-br from-pink-500 to-repix-600 rounded-xl shrink-0 ${uploadedImages.length > 0 ? 'hidden md:block' : 'hidden xs:block'}`}>
                <Sparkles size={18} className="text-white" />
              </div>
             
              {/* Text Input - Auto-resize Textarea */}
              <textarea 
                ref={textareaRef}
                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm px-2 min-w-0 resize-none overflow-y-auto transition-[height] duration-150 ease-out py-2.5"
                style={{ 
                  minHeight: '40px',
                  maxHeight: window.innerWidth < 768 ? '150px' : '200px',
                }}
                placeholder={uploadedImages.length > 0 ? "Describe what to do with these images..." : trans.editor.promptPlaceholder}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  // Auto-resize logic - reset to auto then calculate
                  const textarea = e.target;
                  textarea.style.height = 'auto';
                  const maxH = window.innerWidth < 768 ? 150 : 200;
                  const newHeight = Math.max(40, Math.min(textarea.scrollHeight, maxH));
                  textarea.style.height = newHeight + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                onPaste={handlePasteImage}
                rows={1}
              />
             
              {/* AI Prompt Enhancer Button - Hidden on mobile */}
              {prompt.length > 3 && (
                <button 
                  onClick={enhancePrompt}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors shrink-0"
                >
                  <BrainCircuit size={12} /> {trans.editor.enhancePrompt}
                </button>
              )}

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                disabled={(!prompt && uploadedImages.length === 0) || isGenerating}
                isLoading={isGenerating}
                className="animated-border rounded-xl px-3 sm:px-4 md:px-6 shrink-0 h-10"
              >
                <span className="sm:hidden"><ArrowRight size={20} /></span>
                <span className="hidden sm:flex items-center gap-2">
                  <Wand2 size={16} /> 
                  {trans.editor.generate}
                </span>
              </Button>
            </div>

            {/* Helper Text */}
            {uploadedImages.length === 0 && (
              <div className="hidden md:flex items-center justify-center gap-4 mt-2 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Paperclip size={10} /> Upload or paste images
                </span>
                <span>•</span>
                <span>Press Enter to generate</span>
                <span>•</span>
                <span>Max 4 images</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Properties Panel - Desktop: Always Visible */}
      <div 
        className={`
          order-3 ${isRightPanelCollapsed ? 'w-12' : 'w-72 lg:w-80'} bg-white dark:bg-dark-surface
          border-l border-zinc-200 dark:border-dark-border flex-col shrink-0
          hidden md:flex relative transition-all duration-300
          ${showGeneratePreview ? 'md:hidden' : ''}
        `}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
          className="absolute -left-3 top-4 z-40 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-repix-500 hover:border-repix-500 transition-colors shadow-sm"
          title={isRightPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isRightPanelCollapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Collapsed State - Icon Only Tabs */}
        {isRightPanelCollapsed ? (
          <div className="flex flex-col items-center py-4 gap-2">
            <button 
               onClick={() => { setActivePanel('adjustments'); setIsRightPanelCollapsed(false); }}
               className={`p-2.5 rounded-lg transition-all ${
                 activePanel === 'adjustments' 
                   ? 'bg-repix-500/10 text-repix-500' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
               }`}
               title="Adjustments"
            >
               <SlidersHorizontal size={18} />
            </button>
            <button 
               onClick={() => { setActivePanel('layers'); setIsRightPanelCollapsed(false); }}
               className={`p-2.5 rounded-lg transition-all ${
                 activePanel === 'layers' 
                   ? 'bg-repix-500/10 text-repix-500' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
               }`}
               title="Layers"
            >
               <Layers size={18} />
            </button>
            <button 
               onClick={() => { setActivePanel('style'); setIsRightPanelCollapsed(false); }}
               className={`p-2.5 rounded-lg transition-all ${
                 activePanel === 'style' 
                   ? 'bg-repix-500/10 text-repix-500' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
               }`}
               title="Style"
            >
               <Palette size={18} />
            </button>
            <button 
               onClick={() => { setActivePanel('brandkit'); setIsRightPanelCollapsed(false); }}
               className={`p-2.5 rounded-lg transition-all ${
                 activePanel === 'brandkit' 
                   ? 'bg-repix-500/10 text-repix-500' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
               }`}
               title="Brand Kit"
            >
               <Sparkles size={18} />
            </button>
          </div>
        ) : (
          <>
        {/* Panel Tabs - Vertical Layout */}
        <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="grid grid-cols-4 gap-1 p-2 bg-zinc-50 dark:bg-zinc-900/50">
            <button 
               onClick={() => setActivePanel('adjustments')}
               className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                 activePanel === 'adjustments' 
                   ? 'bg-white dark:bg-zinc-800 text-repix-500 shadow-sm' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'
               }`}
            >
               <SlidersHorizontal size={18} />
               <span className="text-[10px] font-semibold uppercase tracking-wider">Adjust</span>
            </button>
            <button 
               onClick={() => setActivePanel('layers')}
               className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                 activePanel === 'layers' 
                   ? 'bg-white dark:bg-zinc-800 text-repix-500 shadow-sm' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'
               }`}
            >
               <Layers size={18} />
               <span className="text-[10px] font-semibold uppercase tracking-wider">Layers</span>
            </button>
            <button 
               onClick={() => setActivePanel('style')}
               className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                 activePanel === 'style' 
                   ? 'bg-white dark:bg-zinc-800 text-pink-500 shadow-sm' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'
               }`}
            >
               {!canAccess('styleTransfer') && (
                 <div className="absolute -top-1 -right-1 px-1 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded text-[8px] font-bold text-white">PRO</div>
               )}
               <Palette size={18} />
               <span className="text-[10px] font-semibold uppercase tracking-wider">Style</span>
            </button>
            <button 
               onClick={() => setActivePanel('brandkit')}
               className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                 activePanel === 'brandkit' 
                   ? 'bg-white dark:bg-zinc-800 text-repix-500 shadow-sm' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'
               }`}
            >
               <Sparkles size={18} />
               <span className="text-[10px] font-semibold uppercase tracking-wider">Brand</span>
            </button>
            <button 
               onClick={() => setActivePanel('advisor')}
               className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                 activePanel === 'advisor' 
                   ? 'bg-white dark:bg-zinc-800 text-repix-500 shadow-sm' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'
               }`}
            >
               <BrainCircuit size={18} />
               <span className="text-[10px] font-semibold uppercase tracking-wider">AI</span>
            </button>
          </div>
        </div>

        {/* Panel Content */}
        {activePanel !== 'layers' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* ADJUSTMENTS PANEL */}
            {activePanel === 'adjustments' && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{trans.editor.adjustments}</h3>
                  <Zap size={14} className="text-repix-500" />
                </div>
                <Card className="p-4 space-y-4">
                  <Slider label={trans.editor.exposure} value={10} onChange={()=>{}} min={-100} max={100} />
                  <Slider label={trans.editor.contrast} value={45} onChange={()=>{}} min={0} max={100} />
                  <Slider label={trans.editor.saturation} value={-5} onChange={()=>{}} min={-100} max={100} />
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">{trans.editor.autoTone}</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">{trans.editor.autoColor}</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* AI STYLE MATCH PANEL */}
            {activePanel === 'style' && (
              <div className="space-y-5">
               {/* Success Message */}
               {showStyleSuccess && (
                 <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                   <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                     <Sparkles size={12} className="text-white" />
                   </div>
                   <span className="text-sm font-medium text-green-700 dark:text-green-300">Style applied successfully!</span>
                 </div>
               )}

               {/* Selected Style Preview */}
               <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{trans.editor.moodboard}</h3>
                    <Badge className="text-[10px] bg-pink-100 text-pink-600 border-pink-200">AI Powered</Badge>
                  </div>
                  
                  {/* Reference Image Preview */}
                  {currentPreset ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
                      <img 
                        src={currentPreset.img.replace('80&h=80', '300&h=200')} 
                        alt="Reference Style"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-white text-xs font-medium">{currentPreset.name} Style</span>
                        <button 
                          onClick={() => setSelectedStylePreset(null)}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] hover:bg-white/30 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold flex items-center gap-1 ${appliedStyle === currentPreset.id ? 'bg-green-500' : 'bg-amber-500'}`}>
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          {appliedStyle === currentPreset.id ? 'Applied' : 'Selected'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <Palette size={24} className="text-zinc-400 mb-2" />
                      <p className="text-xs text-zinc-500">Select a style preset below</p>
                    </div>
                  )}

                  {/* Extracted Colors from Reference */}
                  {currentPreset && (
                    <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider">Extracted Palette</p>
                      <div className="flex gap-1.5">
                        {currentPreset.colors.map((color, i) => (
                          <div 
                            key={i}
                            className="w-8 h-8 rounded-lg shadow-sm border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
               </div>

               {/* Style Transfer Preview */}
               {currentPreset && (
                 <div>
                    <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Preview Result</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Before */}
                      <div className="relative rounded-lg overflow-hidden">
                        <img 
                          src={currentCanvasImage} 
                          alt="Before"
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-white text-[10px]">Before</div>
                      </div>
                      {/* After */}
                      <div className="relative rounded-lg overflow-hidden ring-2 ring-pink-500">
                        <img 
                          src={currentCanvasImage} 
                          alt="After"
                          className="w-full h-20 object-cover"
                          style={{ filter: currentPreset.filter }}
                        />
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-pink-500 rounded text-white text-[10px]">After</div>
                      </div>
                    </div>
                 </div>
               )}
               
               {/* AI Preset Generator */}
               <Card className="p-4 space-y-3 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <BrainCircuit size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">Create Style with AI</p>
                      <p className="text-[10px] text-zinc-500">Describe your desired style</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={stylePrompt}
                      onChange={(e) => setStylePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGeneratePreset()}
                      placeholder="e.g., warm sunset, neon cyberpunk..."
                      className="flex-1 px-3 py-2 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <Button
                      size="sm"
                      onClick={handleGeneratePreset}
                      disabled={!stylePrompt.trim() || isGeneratingPreset}
                      isLoading={isGeneratingPreset}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-3"
                    >
                      {isGeneratingPreset ? '' : <Sparkles size={14} />}
                    </Button>
                  </div>
                  
                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Warm sunset', 'Neon cyber', 'Cold winter', 'Dark moody', 'Retro 80s'].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setStylePrompt(suggestion)}
                        className="px-2 py-1 text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full hover:border-purple-500 hover:text-purple-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
               </Card>

               {/* Match Strength Control */}
               <Card className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <div className={`w-2 h-2 rounded-full ${selectedStylePreset ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`}></div>
                     <span className="text-xs font-medium text-zinc-500">
                       {selectedStylePreset ? 'AI Style Transfer Ready' : 'Select a style to begin'}
                     </span>
                  </div>
                  <Slider 
                    label={trans.editor.matchStrength} 
                    value={styleStrength} 
                    onChange={(v) => setStyleStrength(v)} 
                    min={0} 
                    max={100} 
                  />
                  
                  {/* Quick Style Presets */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Style Presets</p>
                      {customPresets.length > 0 && (
                        <span className="text-[10px] text-purple-500 font-medium">{customPresets.length} custom</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       {stylePresets.map(style => (
                          <button 
                            key={style.id} 
                            onClick={() => handleSelectPreset(style.id)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all group ${
                              selectedStylePreset === style.id 
                                ? 'border-pink-500 ring-2 ring-pink-500/30' 
                                : 'border-transparent hover:border-repix-500'
                            }`}
                          >
                             <img src={style.img} alt={style.name} className="w-full h-12 object-cover" />
                             <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                               selectedStylePreset === style.id ? 'bg-pink-500/60' : 'bg-black/40'
                             }`}>
                               <span className="text-white text-[10px] font-bold truncate px-1">{style.name}</span>
                             </div>
                             {style.isCustom && (
                               <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-purple-500 rounded-full"></div>
                             )}
                          </button>
                       ))}
                    </div>
                  </div>
               </Card>

               {/* Action Buttons */}
               <div className="flex gap-2">
                 {appliedStyle && (
                   <Button 
                     variant="outline" 
                     className="flex-1"
                     onClick={handleResetStyle}
                   >
                     Reset
                   </Button>
                 )}
                 <Button 
                   className={`flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 ${!selectedStylePreset ? 'opacity-50 cursor-not-allowed' : ''}`}
                   onClick={handleApplyStyleTransfer}
                   disabled={!selectedStylePreset || isApplyingStyle}
                   isLoading={isApplyingStyle}
                 >
                   {isApplyingStyle ? 'Applying...' : (
                     <>
                       <Sparkles size={16} className="mr-2" /> 
                       {appliedStyle === selectedStylePreset ? 'Applied!' : 'Apply Style'}
                     </>
                   )}
                 </Button>
               </div>
              </div>
            )}

            {/* BRAND KIT PANEL */}
            {activePanel === 'brandkit' && (
              <div className="space-y-4">
                <ConsistencyScoreCard />
                <BrandStyleApplicator />
              </div>
            )}

            {/* AI CONTENT ADVISOR PANEL */}
            {activePanel === 'advisor' && (
              <AIContentAdvisor 
                imageUrl={currentCanvasImage}
                onApplySuggestion={(id) => console.log('Applied suggestion:', id)}
              />
            )}
          </div>
        )}

        {/* LAYERS PANEL - Advanced (Full Height) */}
        {activePanel === 'layers' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdvancedLayerPanel />
          </div>
        )}
        
        {/* Pro Upsell */}
        {activePanel !== 'style' && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="p-4 rounded-xl bg-gradient-to-br from-repix-600 to-accent-blue text-center space-y-2 text-white shadow-lg shadow-repix-500/20">
              <p className="text-xs text-white/80 font-medium">✨ {trans.editor.proFeature}</p>
              <p className="text-sm font-bold">{trans.editor.trainModel}</p>
              <Button size="sm" className="w-full bg-white text-repix-700 hover:bg-zinc-50 border-0">{trans.editor.startTraining}</Button>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Mobile Overlay Backdrop for Properties Panel */}
      {isPropertiesOpen && (
        <div 
           className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
           onClick={() => setIsPropertiesOpen(false)}
        />
      )}

      {/* History Panel */}
      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />

      {/* Comments Panel */}
      <CommentsPanel 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)} 
      />

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Tool Demo Panel */}
      {showToolDemo && (
        <ToolDemoPanel
          toolId={showToolDemo}
          onClose={() => setShowToolDemo(null)}
          onApply={handleApplyToolFromDemo}
          onDontShowAgain={handleDontShowToolDemos}
        />
      )}
    </div>
  );
};
