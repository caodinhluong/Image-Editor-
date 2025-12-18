import React, { useState, useRef, useEffect } from 'react';
import {
  X, Sparkles, RefreshCw, Wand2, ChevronDown,
  Download, Share2, Heart, Bookmark,
  ZoomIn, ZoomOut, RotateCcw, Copy, Check
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface RecreateViewProps {
  onClose: () => void;
  originalImage: string;
  originalPrompt: string;
  generationInfo?: {
    model: string;
    style: string;
    ratio: string;
  };
  autoGenerate?: boolean;
  selectedToolName?: string; // Tool name passed from RecreateSetupView
}

type OutputTab = 'result' | 'sideBySide' | 'compare';

// Models data
const models = [
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', desc: 'Best 4K image model ever', isNew: true },
  { id: 'seedream-45', name: 'Seedream 4.5', desc: 'Next-gen 4K image model', isNew: true },
  { id: 'flux-2', name: 'FLUX.2', desc: 'Ultra-fast, detailed images', isNew: true },
  { id: 'z-image', name: 'Z-Image', desc: 'Ultra-fast photorealistic images', isNew: true },
  { id: 'kling-o1', name: 'Kling O1 Image', desc: 'Photorealistic, prompt-accurate images', isNew: true },
  { id: 'wan-22', name: 'Wan 2.2 Image', desc: 'Realistic images', isNew: false },
  { id: 'gpt-image', name: 'GPT Image', desc: 'Advanced OpenAI model', isNew: false },
  { id: 'topaz', name: 'Topaz', desc: 'High-resolution upscaler', isNew: false },
  { id: 'higgsfield-soul', name: 'Higgsfield Soul', desc: 'Ultra-realistic fashion visuals', isNew: false },
];

// Styles data
const styles = [
  { id: 'photograph', name: 'Photograph' },
  { id: 'digital-art', name: 'Digital Art' },
  { id: 'anime', name: 'Anime' },
  { id: 'cinematic', name: 'Cinematic' },
  { id: 'oil-painting', name: 'Oil Painting' },
  { id: 'watercolor', name: 'Watercolor' },
  { id: '3d-render', name: '3D Render' },
  { id: 'fantasy', name: 'Fantasy Art' },
];

// Ratios data
const ratios = [
  { id: '1:1', name: '1:1' },
  { id: '3:2', name: '3:2' },
  { id: '2:3', name: '2:3' },
  { id: '16:9', name: '16:9' },
  { id: '9:16', name: '9:16' },
  { id: '4:3', name: '4:3' },
];

export const RecreateView: React.FC<RecreateViewProps> = ({
  onClose,
  originalImage,
  originalPrompt,
  generationInfo = { model: 'Higgsfield Soul', style: 'Photograph', ratio: '3:2' },
  autoGenerate = true,
  selectedToolName = 'AI Upscaler'
}) => {
  const { language } = useLanguage();
  const [outputTab, setOutputTab] = useState<OutputTab>('result');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedStyle, setGeneratedStyle] = useState(generationInfo.style);
  const [comparePosition, setComparePosition] = useState(50);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(100);
  const compareRef = useRef<HTMLDivElement>(null);

  // Selectable states
  const [selectedModel, setSelectedModel] = useState(generationInfo.model);
  const [selectedStyle, setSelectedStyle] = useState(generationInfo.style);
  const [selectedRatio, setSelectedRatio] = useState(generationInfo.ratio);

  // Dropdown states
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);

  const trans = {
    vi: {
      result: 'Sản phẩm',
      sideBySide: 'Song song',
      compare: 'So sánh',
      generating: 'Đang tạo...',
      original: 'Ảnh gốc',
      generated: 'Kết quả',
      prompt: 'PROMPT',
      copy: 'Copy',
      copied: 'Đã copy',
      info: 'TÙY CHỌN',
      model: 'Model',
      style: 'Style',
      ratio: 'Tỷ lệ',
      regenerate: 'Tạo lại',
      usingTool: 'Đang sử dụng',
    },
    en: {
      result: 'Result',
      sideBySide: 'Side by Side',
      compare: 'Compare',
      generating: 'Generating...',
      original: 'Original',
      generated: 'Result',
      prompt: 'PROMPT',
      copy: 'Copy',
      copied: 'Copied',
      info: 'OPTIONS',
      model: 'Model',
      style: 'Style',
      ratio: 'Ratio',
      regenerate: 'Regenerate',
      usingTool: 'Using',
    }
  };
  const t = trans[language] || trans.en;

  const outputTabs = [
    { id: 'result' as OutputTab, label: t.result },
    { id: 'sideBySide' as OutputTab, label: t.sideBySide },
    { id: 'compare' as OutputTab, label: t.compare },
  ];

  useEffect(() => {
    if (autoGenerate) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedImage(null);
    setTimeout(() => {
      setGeneratedImage(originalImage);
      setGeneratedStyle(selectedStyle);
      setIsGenerating(false);
    }, 2500);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(originalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeAllDropdowns = () => {
    setShowModelDropdown(false);
    setShowStyleDropdown(false);
    setShowRatioDropdown(false);
  };

  const handleCompareMouseDown = () => {
    if (!compareRef.current) return;
    const handleMove = (moveEvent: MouseEvent) => {
      if (!compareRef.current) return;
      const rect = compareRef.current.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setComparePosition(percent);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const renderOutputContent = () => {
    if (isGenerating) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-zinc-700 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Wand2 size={24} className="text-purple-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-5 text-zinc-300 font-medium">{t.generating}</p>
          <p className="text-zinc-600 text-sm mt-1">{t.usingTool} {selectedToolName}...</p>
        </div>
      );
    }

    if (!generatedImage) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Sparkles size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Waiting for generation...</p>
          </div>
        </div>
      );
    }

    switch (outputTab) {
      case 'result':
        return (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative" style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.2s' }}>
              <img src={generatedImage} alt="Generated" className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl" />
              <div className="absolute top-5 left-5 right-5">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{generatedStyle}</h2>
                <p className="text-white/60 text-sm mt-1 drop-shadow">AI Enhanced • {selectedModel}</p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className="flex gap-2">
                  <button className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Heart size={16} /></button>
                  <button className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Bookmark size={16} /></button>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Download size={16} /></button>
                  <button className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Share2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sideBySide':
        return (
          <div className="flex-1 flex items-center justify-center gap-6 p-6">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">{t.original}</span>
              <img src={originalImage} alt="Original" className="max-h-[60vh] w-auto object-contain rounded-xl border border-zinc-700/50" />
            </div>
            <div className="w-px h-[50vh] bg-gradient-to-b from-transparent via-zinc-600 to-transparent" />
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">{t.generated}</span>
              <div className="relative">
                <img src={generatedImage} alt="Generated" className="max-h-[60vh] w-auto object-contain rounded-xl border border-zinc-700/50" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium text-white">{generatedStyle}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'compare':
        return (
          <div className="flex-1 flex items-center justify-center p-6">
            <div ref={compareRef} className="relative max-h-[70vh] overflow-hidden rounded-2xl cursor-ew-resize select-none" onMouseDown={handleCompareMouseDown}>
              <img src={originalImage} alt="Original" className="max-h-[70vh] w-auto object-contain" />
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}>
                <img src={generatedImage} alt="Generated" className="max-h-[70vh] w-auto object-contain" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium text-white shadow-lg">{generatedStyle}</span>
                </div>
              </div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${comparePosition}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <ChevronDown size={12} className="text-zinc-700 rotate-90" />
                    <ChevronDown size={12} className="text-zinc-700 -rotate-90" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur rounded-lg text-xs text-white">{t.original}</div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur rounded-lg text-xs text-white">{t.generated}</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex bg-zinc-950">
      <button onClick={onClose} className="absolute top-4 right-4 p-2.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-xl z-20 transition-all">
        <X size={20} className="text-zinc-400" />
      </button>

      {/* LEFT - Original Image & Controls */}
      <div className="w-[480px] flex flex-col bg-zinc-900 border-r border-zinc-800 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Image Container */}
          <div className="p-6 flex items-center justify-center min-h-[280px] bg-zinc-950/50">
            <div className="relative w-full max-w-[380px]">
              <img src={originalImage} alt="Original" className="w-full h-auto object-contain rounded-2xl shadow-xl border border-zinc-800" />
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-sm rounded-lg text-xs text-white font-semibold border border-zinc-700/50">
                {t.original}
              </div>
            </div>
          </div>

          {/* Prompt Section */}
          <div className="px-6 py-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                <Sparkles size={12} className="text-purple-400" />
                {t.prompt}
              </div>
              <button onClick={handleCopyPrompt} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors border border-zinc-700/50">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
            <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/30 rounded-xl p-4 max-h-24 overflow-y-auto border border-zinc-700/30">
              {originalPrompt}
            </div>
          </div>

          {/* Options Section - Selectable */}
          <div className="px-6 py-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-4">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] border border-zinc-700">⚙</span>
              {t.info}
            </div>
            <div className="space-y-3">
              {/* Model Selector */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-500">{t.model}</span>
                </div>
                <button
                  onClick={() => { closeAllDropdowns(); setShowModelDropdown(!showModelDropdown); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-white">{selectedModel}</span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showModelDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-2xl max-h-[200px] overflow-y-auto">
                    {models.map(model => (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model.name); setShowModelDropdown(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-700 transition-colors ${selectedModel === model.name ? 'bg-zinc-700' : ''}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white">{model.name}</span>
                            {model.isNew && <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-[9px] font-bold rounded">NEW</span>}
                          </div>
                          <span className="text-xs text-zinc-500">{model.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Style Selector */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-500">{t.style}</span>
                </div>
                <button
                  onClick={() => { closeAllDropdowns(); setShowStyleDropdown(!showStyleDropdown); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-white">{selectedStyle}</span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showStyleDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showStyleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-2xl max-h-[200px] overflow-y-auto">
                    {styles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => { setSelectedStyle(style.name); setShowStyleDropdown(false); }}
                        className={`w-full px-3 py-2.5 text-left text-sm hover:bg-zinc-700 transition-colors ${selectedStyle === style.name ? 'bg-zinc-700 text-purple-400' : 'text-white'}`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ratio Selector */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-500">{t.ratio}</span>
                </div>
                <button
                  onClick={() => { closeAllDropdowns(); setShowRatioDropdown(!showRatioDropdown); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-white">{selectedRatio}</span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showRatioDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showRatioDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                    {ratios.map(ratio => (
                      <button
                        key={ratio.id}
                        onClick={() => { setSelectedRatio(ratio.name); setShowRatioDropdown(false); }}
                        className={`w-full px-3 py-2.5 text-left text-sm hover:bg-zinc-700 transition-colors ${selectedRatio === ratio.name ? 'bg-zinc-700 text-purple-400' : 'text-white'}`}
                      >
                        {ratio.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-900 flex-shrink-0">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-500 hover:via-pink-400 hover:to-orange-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/25 transition-all"
          >
            <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
            {t.regenerate}
          </Button>
        </div>
      </div>

      {/* RIGHT - Output Area */}
      <div className="flex-1 flex flex-col bg-zinc-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5 pointer-events-none" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 p-1 bg-zinc-800/90 backdrop-blur-sm rounded-full border border-zinc-700/50 shadow-lg">
            {outputTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setOutputTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  outputTab === tab.id ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {outputTab === 'result' && generatedImage && !isGenerating && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center gap-1 p-1 bg-zinc-800/90 backdrop-blur-sm rounded-xl border border-zinc-700/50">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                <ZoomOut size={14} className="text-zinc-400" />
              </button>
              <span className="px-2 text-xs text-zinc-400 font-medium min-w-[36px] text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                <ZoomIn size={14} className="text-zinc-400" />
              </button>
              <div className="w-px h-4 bg-zinc-700" />
              <button onClick={() => setZoom(100)} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                <RotateCcw size={14} className="text-zinc-400" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col pt-14 relative z-0">
          {renderOutputContent()}
        </div>
      </div>
    </div>
  );
};

export default RecreateView;
