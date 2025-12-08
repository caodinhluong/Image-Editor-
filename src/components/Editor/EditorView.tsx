
import React, { useState, useEffect } from 'react';
import { 
  Wand2, Eraser, Move, Crop, Layers, Download, 
  Undo, Redo, Sparkles, Share2, Aperture, 
  ScanFace, Palette, BrainCircuit, Upload, Command, Zap,
  X, SlidersHorizontal, ChevronLeft, ArrowRight, History,
  MessageSquare, Bell, Activity
} from 'lucide-react';
import { Button, Slider, Badge, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { HistoryPanel } from './HistoryPanel';
import { AdvancedLayerPanel } from './AdvancedLayerPanel';
import { CommentsPanel } from '../Collaboration/CommentsPanel';
import { NotificationCenter } from '../Collaboration/NotificationCenter';
import { PresenceIndicators } from '../Collaboration/PresenceIndicators';

export const EditorView: React.FC = () => {
  const { trans } = useLanguage();
  const [activeTool, setActiveTool] = useState('move');
  const [activePanel, setActivePanel] = useState<'adjustments' | 'layers' | 'style'>('adjustments');
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showObjectOverlay, setShowObjectOverlay] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  
  const tools = [
    { id: 'move', icon: Move, label: trans.editor.move },
    { id: 'object-select', icon: ScanFace, label: trans.editor.objectSelect },
    { id: 'generative', icon: Sparkles, label: trans.editor.genFill },
    { id: 'magic-erase', icon: Eraser, label: trans.editor.magicErase },
    { id: 'crop', icon: Crop, label: trans.editor.crop },
    { id: 'remove-bg', icon: Aperture, label: trans.editor.removeBg },
  ];
  
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
    // Simulate AI Latency
    setTimeout(() => {
      setIsGenerating(false);
      setPrompt('');
      alert("AI Generation Complete: Applied '" + prompt + "'");
    }, 2000);
  };

  const enhancePrompt = () => {
    if (!prompt) return;
    setPrompt(prompt + " [cinematic lighting, 8k resolution, highly detailed]");
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-light-bg dark:bg-dark-bg text-zinc-900 dark:text-white overflow-hidden relative">
      
      {/* TOOLBAR - Desktop: Left Sidebar | Mobile: Bottom Bar */}
      <div className="order-3 md:order-1 w-full md:w-16 h-16 md:h-full border-t md:border-t-0 md:border-r border-zinc-200 dark:border-dark-border flex flex-row md:flex-col items-center justify-between px-4 md:px-0 md:py-4 gap-4 bg-white dark:bg-dark-surface z-30 overflow-x-auto hide-scrollbar shrink-0 safe-pb">
        <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto items-center justify-between md:justify-start">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-3 rounded-xl transition-all group relative shrink-0 ${
                activeTool === tool.id 
                  ? 'bg-gradient-to-br from-pink-500 to-repix-600 text-white shadow-lg shadow-repix-500/40' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <tool.icon size={20} />
              {/* Tooltip only on desktop */}
              <span className="hidden md:block absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {tool.label}
              </span>
            </button>
          ))}
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

             {/* Collaboration Tools */}
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

             {/* Presence Indicators */}
             <div className="hidden md:flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
                <PresenceIndicators />
             </div>

             <Button 
               size="sm" 
               variant="secondary" 
               className="md:hidden"
               onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
             >
               <SlidersHorizontal size={16} />
             </Button>

             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{zoom}%</span>
             </div>
            <Button size="sm" variant="secondary" className="hidden sm:flex"><Share2 size={16} className="mr-2" /> {trans.editor.share}</Button>
            <Button size="sm" variant="primary"><Download size={16} className="mr-2 hidden sm:inline" /> {trans.editor.export}</Button>
          </div>
        </div>

        {/* The Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative group touch-none z-10">
          <div 
            className="relative shadow-2xl shadow-black/20 dark:shadow-black/50 transition-transform duration-200"
            style={{ 
              width: '100%', 
              maxWidth: '500px',
              aspectRatio: '4/5',
              transform: `scale(${zoom / 100})`
            }}
          >
             {/* Mock Content */}
            <img 
              src="https://picsum.photos/seed/fashion/800/1000" 
              alt="Canvas" 
              className="w-full h-full object-cover rounded-lg"
            />

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
                 <div className="absolute top-[10%] left-[20%] w-[60%] h-[80%] border-2 border-accent-blue/80 rounded-lg bg-accent-blue/10 flex items-start justify-center animate-in fade-in duration-300">
                    <span className="bg-accent-blue text-white text-[10px] px-1 rounded-sm -mt-2">Person 98%</span>
                 </div>
                 <div className="absolute bottom-[5%] right-[5%] w-[20%] h-[20%] border-2 border-pink-500/80 rounded-lg bg-pink-500/10 flex items-start justify-center animate-in fade-in duration-500">
                    <span className="bg-pink-500 text-white text-[10px] px-1 rounded-sm -mt-2">Bag 95%</span>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Floating Prompt Bar (Responsive Fixed) */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 px-3 md:px-4 flex justify-center z-20 pointer-events-none">
          <div className="w-full max-w-2xl bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border border-repix-500/30 p-1.5 md:p-2 rounded-2xl shadow-2xl flex items-center gap-2 ring-1 ring-repix-500/10 dark:ring-white/5 pointer-events-auto">
             
             {/* Icon - Hidden on very small screens to give space for input */}
             <div className="hidden xs:block p-2 bg-gradient-to-br from-pink-500 to-repix-600 rounded-xl shrink-0">
               <Sparkles size={20} className="text-white" />
             </div>
             
             <input 
               type="text" 
               className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm h-10 px-2 min-w-0"
               placeholder={trans.editor.promptPlaceholder}
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
             
             {/* AI Prompt Enhancer Button - Hidden on mobile */}
             {prompt.length > 3 && (
               <button 
                  onClick={enhancePrompt}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors mr-2 shrink-0"
               >
                 <BrainCircuit size={12} /> {trans.editor.enhancePrompt}
               </button>
             )}

             {/* Mobile-Optimized Generate Button */}
             <Button 
                onClick={handleGenerate} 
                disabled={!prompt || isGenerating}
                isLoading={isGenerating}
                className="animated-border rounded-xl px-3 sm:px-4 md:px-6 shrink-0 h-10"
             >
                {/* On Mobile: Just Arrow/Icon, On Desktop: Text */}
                <span className="sm:hidden"><ArrowRight size={20} /></span>
                <span className="hidden sm:flex items-center gap-2">
                   <Wand2 size={16} /> 
                   {trans.editor.generate}
                </span>
             </Button>
          </div>
        </div>
      </div>

      {/* Right Properties Panel - Desktop: Static / Mobile: Drawer Overlay */}
      <div 
        className={`
          fixed md:relative inset-y-0 right-0 w-80 bg-white dark:bg-dark-surface z-50 
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          border-l border-zinc-200 dark:border-dark-border flex flex-col
          ${isPropertiesOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Header for Drawer */}
        <div className="flex md:hidden items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
           <span className="font-bold text-lg">Properties</span>
           <Button size="icon" variant="ghost" onClick={() => setIsPropertiesOpen(false)}>
             <X size={20} />
           </Button>
        </div>

        {/* Panel Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <button 
             onClick={() => setActivePanel('adjustments')}
             className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${activePanel === 'adjustments' ? 'text-repix-500 border-b-2 border-repix-500' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
          >
             {trans.editor.adjustments}
          </button>
          <button 
             onClick={() => setActivePanel('layers')}
             className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${activePanel === 'layers' ? 'text-repix-500 border-b-2 border-repix-500' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
          >
             {trans.editor.layers}
          </button>
          <button 
             onClick={() => setActivePanel('style')}
             className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 ${activePanel === 'style' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
          >
             <Palette size={12} /> {trans.editor.style}
          </button>
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
              <div className="space-y-6">
               {/* Moodboard Upload */}
               <div>
                  <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">{trans.editor.moodboard}</h3>
                  <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors cursor-pointer group">
                     <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={18} className="text-zinc-400 group-hover:text-pink-500" />
                     </div>
                     <p className="text-xs font-medium text-zinc-500 group-hover:text-pink-500">{trans.editor.uploadRef}</p>
                  </div>
               </div>
               
               {/* Context Aware Color Matching */}
               <Card className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-xs font-medium text-zinc-500">AI Context Analysis Active</span>
                  </div>
                  <Slider label={trans.editor.matchStrength} value={80} onChange={()=>{}} min={0} max={100} />
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                     {['Cyberpunk', 'Pastel', 'Vintage'].map(style => (
                        <button key={style} className="px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs hover:bg-repix-50 dark:hover:bg-repix-900/20 hover:border-repix-500 transition-all">
                           {style}
                        </button>
                     ))}
                  </div>
               </Card>
              </div>
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
    </div>
  );
};
