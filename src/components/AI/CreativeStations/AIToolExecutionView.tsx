import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  X, Upload, Sparkles, Download, RefreshCw, FolderOpen, Save,
  Image as ImageIcon, ChevronDown, ZoomIn, ZoomOut, RotateCcw, Heart, Bookmark, Share2,
  Wand2, RectangleHorizontal, Square, Smartphone, Monitor, RectangleVertical,
  // Station icons
  Coffee, Drama, Bot, Film, ChefHat, ShoppingCart
} from 'lucide-react';
import { Station, Tool, ProcessingState, ProcessingResult } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE, STATIONS } from '../../../data/stations';
import { AssetPickerModal } from '../../Editor/AssetPickerModal';

// Map station icon names to Lucide components
const stationIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'coffee': Coffee,
  'drama': Drama,
  'bot': Bot,
  'film': Film,
  'chef': ChefHat,
  'cart': ShoppingCart,
};

interface AIToolExecutionViewProps {
  tool: Tool;
  station: Station;
  onClose: () => void;
  onComplete?: (result: ProcessingResult) => void;
  initialImage?: string;
}

type OutputTab = 'result' | 'sideBySide' | 'compare';

export const AIToolExecutionView: React.FC<AIToolExecutionViewProps> = ({
  tool: initialTool,
  station: initialStation,
  onClose,
  onComplete,
  initialImage,
}) => {
  const { language } = useLanguage();
  const { credits, useCredits, triggerUpgradeModal } = useSubscription();
  
  // Tool selection state
  const [selectedTool, setSelectedTool] = useState<Tool>(initialTool);
  const [selectedStation, setSelectedStation] = useState<Station>(initialStation);
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  
  // Image states
  const [inputImage, setInputImage] = useState<string | null>(initialImage || null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [savedToAssets, setSavedToAssets] = useState(false);
  
  // Multi-image state for Dynamic Polaroid
  const [multiImages, setMultiImages] = useState<(string | null)[]>([null, null, null, null]);
  const [activeImageSlot, setActiveImageSlot] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<'standard' | 'premium'>('standard');
  const [showImageSourceMenu, setShowImageSourceMenu] = useState(false);
  
  // Video-specific state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  
  // Instant Noodle Video state
  const [selectedDuration, setSelectedDuration] = useState('8');
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  
  // View states
  const [outputTab, setOutputTab] = useState<OutputTab>('result');
  const [zoom, setZoom] = useState(100);
  const [comparePosition, setComparePosition] = useState(50);

  // Tool options state
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({});
  
  // Processing state
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    estimatedTimeRemaining: initialTool.estimatedTime,
  });
  
  // Check if this is a video tool (show prompt & aspect ratio)
  const isVideoTool = selectedTool.id === 'video-kitchen' || selectedTool.id === 'instant-noodle-video';
  
  // Duration options for Instant Noodle Video
  const durationOptions = ['8', '13', '18', '23'];
  
  // Video aspect ratio options
  const aspectRatioOptions = [
    { id: '16:9', label: '16:9', icon: RectangleHorizontal, desc: 'Landscape', descVi: 'Ngang' },
    { id: '9:16', label: '9:16', icon: Smartphone, desc: 'Portrait', descVi: 'Dọc' },
    { id: '1:1', label: '1:1', icon: Square, desc: 'Square', descVi: 'Vuông' },
    { id: '4:3', label: '4:3', icon: Monitor, desc: 'Standard', descVi: 'Chuẩn' },
    { id: '3:4', label: '3:4', icon: RectangleVertical, desc: 'Portrait', descVi: 'Dọc 3:4' },
  ];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  // Get all tools from all stations for dropdown
  const allTools = STATIONS.flatMap(s => s.tools.map(t => ({ tool: t, station: s })));

  const toolName = language === 'vi' ? selectedTool.nameVi : selectedTool.name;
  const toolDescription = language === 'vi' ? selectedTool.descriptionVi : selectedTool.description;

  // Translations
  const t = {
    vi: {
      inputImage: 'Ảnh đầu vào',
      result: 'Kết quả',
      sideBySide: 'Song song',
      compare: 'So sánh',
      dragDrop: 'Kéo thả hoặc nhấn để tải ảnh',
      selectFromAssets: 'Chọn từ thư viện',
      changeImage: 'Đổi ảnh',
      options: 'Tùy chọn',
      credits: 'credits',
      balance: 'Số dư',
      cancel: 'Hủy',
      generate: 'Tạo',
      processing: 'Đang xử lý...',
      regenerate: 'Tạo lại',
      download: 'Tải xuống',
      saveToAssets: 'Lưu vào thư viện',
      saved: 'Đã lưu!',
      resultHere: 'Kết quả sẽ hiển thị ở đây',
      original: 'Ảnh gốc',
      generated: 'Kết quả',
      selectTool: 'Chọn công cụ',
      videoDescription: 'Mô tả video',
      videoPlaceholder: 'Mô tả chi tiết video bạn muốn tạo...',
      videoTip: 'Mẹo: Mô tả càng chi tiết, video càng chính xác.',
      aspectRatio: 'Khung hình',
      aiEnhance: 'AI Enhance',
      enhancing: 'Đang tối ưu...',
    },
    en: {
      inputImage: 'Input Image',
      result: 'Result',
      sideBySide: 'Side by Side',
      compare: 'Compare',
      dragDrop: 'Drag & drop or click to upload',
      selectFromAssets: 'Select from Assets',
      changeImage: 'Change image',
      options: 'Options',
      credits: 'credits',
      balance: 'Balance',
      cancel: 'Cancel',
      generate: 'Generate',
      processing: 'Processing...',
      regenerate: 'Regenerate',
      download: 'Download',
      saveToAssets: 'Save to Assets',
      saved: 'Saved!',
      resultHere: 'Result will appear here',
      original: 'Original',
      generated: 'Result',
      selectTool: 'Select tool',
      videoDescription: 'Video Description',
      videoPlaceholder: 'Describe the video you want to create...',
      videoTip: 'Tip: The more detailed your description, the better the result.',
      aspectRatio: 'Aspect Ratio',
      aiEnhance: 'AI Enhance',
      enhancing: 'Enhancing...',
    }
  };
  const trans = t[language] || t.en;

  // Initialize tool options with defaults
  useEffect(() => {
    if (selectedTool.options) {
      const defaults: Record<string, any> = {};
      selectedTool.options.forEach(opt => {
        defaults[opt.id] = opt.default;
      });
      setToolOptions(defaults);
    }
  }, [selectedTool]);

  // File validation
  const validateFile = (file: File): boolean => {
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) return false;
    if (file.size > MAX_FILE_SIZE) return false;
    return true;
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;
    const reader = new FileReader();
    reader.onload = (e) => setInputImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('border-purple-500', 'bg-purple-900/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-purple-500', 'bg-purple-900/20');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-purple-500', 'bg-purple-900/20');
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // Simulate processing
  const simulateProcessing = async (): Promise<ProcessingResult> => {
    return new Promise((resolve) => {
      const totalTime = selectedTool.estimatedTime * 1000;
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalTime) * 100, 99);
        const remaining = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));
        setProcessingState({ isProcessing: true, progress, estimatedTimeRemaining: remaining });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setProcessingState({ isProcessing: false, progress: 100, estimatedTimeRemaining: 0 });
        resolve({
          success: true,
          outputUrl: inputImage || '',
          creditsUsed: selectedTool.creditCost,
          processingTime: totalTime,
          toolId: selectedTool.id,
          stationId: selectedStation.id,
        });
      }, totalTime);
    });
  };

  // Handle generate
  const handleGenerate = async () => {
    if (selectedTool.id === 'video-kitchen' || selectedTool.id === 'instant-noodle-video') {
      if (!videoPrompt.trim()) return;
    } else if (selectedTool.id === 'dynamic-polaroid') {
      if (!multiImages.some(img => img !== null)) return;
    } else {
      if (!inputImage) return;
    }
    if (credits < selectedTool.creditCost) {
      triggerUpgradeModal('advancedAI');
      return;
    }

    setProcessingState({ isProcessing: true, progress: 0, estimatedTimeRemaining: selectedTool.estimatedTime });

    try {
      const result = await simulateProcessing();
      if (result.success) {
        for (let i = 0; i < selectedTool.creditCost; i++) {
          useCredits('textToImage', 1);
        }
        let outputUrl: string;
        if (selectedTool.id === 'video-kitchen') {
          outputUrl = inputImage || 'https://via.placeholder.com/1920x1080/1a1a2e/ffffff?text=Video+Generated';
        } else if (selectedTool.id === 'dynamic-polaroid') {
          outputUrl = multiImages.find(img => img !== null) || '';
        } else {
          outputUrl = result.outputUrl || inputImage || '';
        }
        setOutputImage(outputUrl);
        setOutputTab('result');
        onComplete?.(result);
      }
    } catch {
      setProcessingState({ isProcessing: false, progress: 0, estimatedTimeRemaining: selectedTool.estimatedTime });
    }
  };

  const handleRetry = () => {
    setOutputImage(null);
    setOutputTab('result');
  };

  const handleSaveToAssets = () => {
    if (outputImage) {
      setSavedToAssets(true);
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = `${selectedTool.id}-${Date.now()}.png`;
      link.click();
      setTimeout(() => setSavedToAssets(false), 3000);
    }
  };

  const handleDownload = () => {
    if (outputImage) {
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = `${selectedTool.id}-${Date.now()}.png`;
      link.click();
    }
  };

  const handleAssetSelect = (asset: { src: string } | { src: string }[]) => {
    if (selectedTool.id === 'dynamic-polaroid') {
      if (Array.isArray(asset)) {
        const newImages = [...multiImages];
        let slotIndex = 0;
        for (const a of asset) {
          while (slotIndex < 4 && newImages[slotIndex] !== null) slotIndex++;
          if (slotIndex < 4) { newImages[slotIndex] = a.src; slotIndex++; }
        }
        setMultiImages(newImages);
      } else {
        const newImages = [...multiImages];
        newImages[activeImageSlot] = asset.src;
        setMultiImages(newImages);
      }
    } else {
      const singleAsset = Array.isArray(asset) ? asset[0] : asset;
      setInputImage(singleAsset.src);
    }
    setShowAssetPicker(false);
  };
  
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).slice(0, 4).forEach((file) => {
      if (!SUPPORTED_IMAGE_FORMATS.includes(file.type) || file.size > MAX_FILE_SIZE) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMultiImages(prev => {
          const updated = [...prev];
          const emptySlot = updated.findIndex(img => img === null);
          if (emptySlot !== -1) updated[emptySlot] = ev.target?.result as string;
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    setShowImageSourceMenu(false);
  };

  const handleToolSelect = (tool: Tool, station: Station) => {
    setSelectedTool(tool);
    setSelectedStation(station);
    setShowToolDropdown(false);
    setOutputImage(null);
  };

  const handleCompareMouseDown = () => {
    if (!compareRef.current) return;
    const handleMove = (e: MouseEvent) => {
      if (!compareRef.current) return;
      const rect = compareRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setComparePosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // AI Enhance prompt for video
  const handleEnhancePrompt = async () => {
    if (!videoPrompt.trim()) return;
    setIsEnhancingPrompt(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const enhancements = ['cinematic lighting, smooth camera movement, high quality, 4K resolution'];
    setVideoPrompt(prev => `${prev}, ${enhancements[0]}`);
    setIsEnhancingPrompt(false);
  };

  // Render output content
  const renderOutputContent = () => {
    if (processingState.isProcessing) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-zinc-700 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={24} className="text-purple-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-5 text-zinc-300 font-medium">{trans.processing}</p>
          <p className="text-zinc-600 text-sm mt-1">{Math.round(processingState.progress)}%</p>
        </div>
      );
    }

    // Video Kitchen - Show video player
    if (selectedTool.id === 'video-kitchen') {
      if (!outputImage) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
              <p className="text-zinc-500">{language === 'vi' ? 'Video sẽ hiển thị ở đây' : 'Video will appear here'}</p>
            </div>
          </div>
        );
      }
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <video
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              controls
              autoPlay
              loop
              className="w-full rounded-2xl shadow-2xl"
              style={{ maxHeight: '70vh' }}
            />
            <div className="mt-4 flex justify-center gap-3">
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white flex items-center gap-2">
                <Download size={16} />
                {language === 'vi' ? 'Tải video' : 'Download'}
              </button>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white flex items-center gap-2">
                <Share2 size={16} />
                {language === 'vi' ? 'Chia sẻ' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Instant Noodle Video - Show default placeholder when no output, show video + clips after generation
    if (selectedTool.id === 'instant-noodle-video') {
      const totalClips = Math.ceil(parseInt(selectedDuration) / 8);
      const clips = Array.from({ length: totalClips }, (_, i) => i + 1);
      
      // Before generation - show default placeholder like other tools
      if (!outputImage) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <span className="text-4xl">🍜</span>
              </div>
              <p className="text-zinc-500">{language === 'vi' ? 'Video sẽ hiển thị ở đây' : 'Video will appear here'}</p>
              <p className="text-zinc-600 text-sm mt-2">{language === 'vi' ? `${totalClips} clip × 8 giây = ${selectedDuration} giây` : `${totalClips} clips × 8s = ${selectedDuration}s`}</p>
            </div>
          </div>
        );
      }
      
      // After generation - show video player with progress bar on left
      return (
        <div className="flex-1 flex">
          {/* Left side - Progress bar as horizontal segments stacked vertically */}
          <div className="w-24 border-r border-zinc-800 p-3 flex flex-col">
            <div className="text-xs text-zinc-500 font-medium mb-3">{language === 'vi' ? 'Tiến độ' : 'Progress'}</div>
            <div className="flex-1 flex flex-col gap-2">
              {clips.map((clip) => (
                <div key={clip} className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-zinc-400">{selectedAspectRatio}</div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-400">{language === 'vi' ? 'Xong' : 'Done'}</span>
            </div>
          </div>
          
          {/* Right side - Video + clips */}
          <div className="flex-1 flex flex-col">
            {/* Video player area */}
            <div className="flex-1 p-4 flex items-center justify-center">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                controls
                autoPlay
                className="max-w-full max-h-full rounded-xl shadow-2xl"
                style={{ maxHeight: '55vh' }}
              />
            </div>
            
            {/* Clips bar */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
              {/* Clips thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {clips.map((clip) => (
                  <button key={clip} onClick={() => setSelectedClipIndex(clip - 1)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-all overflow-hidden ${selectedClipIndex === clip - 1 ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                    <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                      <span className="text-zinc-400 text-xs">Clip {clip}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Actions */}
              <div className="mt-3 flex justify-center gap-3">
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm flex items-center gap-2">
                  <Download size={14} />
                  {language === 'vi' ? 'Tải video' : 'Download'}
                </button>
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white text-sm flex items-center gap-2">
                  <Share2 size={14} />
                  {language === 'vi' ? 'Chia sẻ' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!outputImage) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">{trans.resultHere}</p>
          </div>
        </div>
      );
    }

    switch (outputTab) {
      case 'result':
        return (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative" style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.2s' }}>
              <img src={outputImage} alt="Generated" className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className="flex gap-2">
                  <button className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Heart size={16} /></button>
                  <button className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Bookmark size={16} /></button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur rounded-xl text-white"><Download size={16} /></button>
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
              <span className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">{trans.original}</span>
              <img src={inputImage || ''} alt="Original" className="max-h-[60vh] w-auto object-contain rounded-xl border border-zinc-700/50" />
            </div>
            <div className="w-px h-[50vh] bg-gradient-to-b from-transparent via-zinc-600 to-transparent" />
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">{trans.generated}</span>
              <img src={outputImage} alt="Generated" className="max-h-[60vh] w-auto object-contain rounded-xl border border-zinc-700/50" />
            </div>
          </div>
        );

      case 'compare':
        return (
          <div className="flex-1 flex items-center justify-center p-6">
            <div ref={compareRef} className="relative max-h-[70vh] overflow-hidden rounded-2xl cursor-ew-resize select-none" onMouseDown={handleCompareMouseDown}>
              <img src={inputImage || ''} alt="Original" className="max-h-[70vh] w-auto object-contain" />
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}>
                <img src={outputImage} alt="Generated" className="max-h-[70vh] w-auto object-contain" />
              </div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${comparePosition}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <ChevronDown size={12} className="text-zinc-700 rotate-90" />
                  <ChevronDown size={12} className="text-zinc-700 -rotate-90" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };


  // Render tool option input
  const renderOptionInput = (option: any) => {
    const value = toolOptions[option.id] ?? option.default;
    const label = language === 'vi' ? option.labelVi : option.label;
    const values = language === 'vi' ? (option.valuesVi || option.values) : option.values;

    switch (option.type) {
      case 'select':
        return (
          <div key={option.id} className="space-y-2">
            <label className="text-xs text-zinc-500">{label}</label>
            <select
              value={value}
              onChange={(e) => setToolOptions(prev => ({ ...prev, [option.id]: e.target.value }))}
              className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {values?.map((v: string, i: number) => (
                <option key={i} value={option.values[i]}>{v}</option>
              ))}
            </select>
          </div>
        );
      case 'slider':
        return (
          <div key={option.id} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-zinc-500">{label}</label>
              <span className="text-xs text-zinc-400">{value}</span>
            </div>
            <input
              type="range"
              min={option.min}
              max={option.max}
              step={option.step}
              value={value}
              onChange={(e) => setToolOptions(prev => ({ ...prev, [option.id]: Number(e.target.value) }))}
              className="w-full accent-purple-500"
            />
          </div>
        );
      case 'toggle':
        return (
          <div key={option.id} className="flex items-center justify-between">
            <label className="text-xs text-zinc-500">{label}</label>
            <button
              onClick={() => setToolOptions(prev => ({ ...prev, [option.id]: !value }))}
              className={`w-10 h-6 rounded-full transition-colors ${value ? 'bg-purple-500' : 'bg-zinc-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="fixed inset-0 z-[99999] flex bg-zinc-950">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4 p-2.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-xl z-20 transition-all">
        <X size={20} className="text-zinc-400" />
      </button>

      {/* LEFT PANEL - Input & Options */}
      <div className="w-[480px] flex flex-col bg-zinc-900 border-r border-zinc-800 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Header with Tool Info */}
          <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${selectedStation.color}`}>
              {(() => {
                const IconComponent = stationIconMap[selectedStation.icon];
                if (IconComponent) {
                  return <IconComponent size={24} className="text-white" />;
                }
                return <span className="text-xl">{selectedStation.icon}</span>;
              })()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">{toolName}</h3>
              <p className="text-xs text-zinc-500">{toolDescription}</p>
            </div>
          </div>

          {/* Video Prompt Section - Only for video-kitchen */}
          {isVideoTool && (
            <div className="p-6 border-b border-zinc-800 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">{trans.videoDescription}</h4>
                  <button onClick={handleEnhancePrompt} disabled={!videoPrompt.trim() || isEnhancingPrompt}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!videoPrompt.trim() || isEnhancingPrompt ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'}`}>
                    <Wand2 size={14} className={isEnhancingPrompt ? 'animate-spin' : ''} />
                    {isEnhancingPrompt ? trans.enhancing : trans.aiEnhance}
                  </button>
                </div>
                <textarea value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} placeholder={trans.videoPlaceholder}
                  className="w-full h-24 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p className="text-xs text-zinc-500">{trans.videoTip}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">{trans.aspectRatio}</h4>
                <div className="flex flex-wrap gap-2">
                  {aspectRatioOptions.map((ratio) => {
                    const IconComponent = ratio.icon;
                    return (
                      <button key={ratio.id} onClick={() => setSelectedAspectRatio(ratio.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${selectedAspectRatio === ratio.id ? 'border-purple-500 bg-purple-900/30 text-purple-400' : 'border-zinc-700 hover:border-purple-500/50 text-zinc-400'}`}>
                        <IconComponent size={16} />
                        <span className="text-sm font-medium">{ratio.label}</span>
                        <span className="text-xs opacity-70">{language === 'vi' ? ratio.descVi : ratio.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Duration selector - Only for instant-noodle-video */}
              {selectedTool.id === 'instant-noodle-video' && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">{language === 'vi' ? 'Thời lượng' : 'Duration'}</h4>
                  <div className="flex gap-2">
                    {durationOptions.map((dur) => (
                      <button key={dur} onClick={() => setSelectedDuration(dur)}
                        className={`px-4 py-2 rounded-lg border transition-all ${selectedDuration === dur ? 'border-purple-500 bg-purple-900/30 text-purple-400' : 'border-zinc-700 hover:border-purple-500/50 text-zinc-400'}`}>
                        <span className="text-sm font-medium">{dur}s</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">{language === 'vi' ? 'Mỗi clip 8 giây' : 'Each clip is 8 seconds'}</p>
                </div>
              )}
            </div>
          )}

          {/* Input Image Section - Dynamic Polaroid or Standard */}
          {selectedTool.id === 'dynamic-polaroid' ? (
            <div className="p-6">
              <input ref={multiFileInputRef} type="file" accept={SUPPORTED_IMAGE_FORMATS.join(',')} multiple onChange={handleMultiFileUpload} className="hidden" />
              <div onClick={() => setShowImageSourceMenu(!showImageSourceMenu)} className="relative aspect-square rounded-xl border-2 border-dashed border-zinc-600 hover:border-zinc-500 bg-zinc-800/50 transition-all cursor-pointer flex flex-col items-center justify-center">
                {multiImages.some(img => img !== null) ? (
                  <div className="absolute inset-4 grid grid-cols-2 gap-2">
                    {multiImages.map((img, index) => (
                      <div key={index} className={`relative aspect-square rounded-lg overflow-hidden ${img ? 'bg-zinc-700' : 'bg-zinc-800/50 border border-dashed border-zinc-600'}`}>
                        {img ? (
                          <>
                            <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                            <button onClick={(e) => { e.stopPropagation(); const newImages = [...multiImages]; newImages[index] = null; setMultiImages(newImages); }} className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full"><X size={12} className="text-white" /></button>
                          </>
                        ) : (<div className="flex items-center justify-center h-full"><span className="text-zinc-600 text-2xl">+</span></div>)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <span className="text-zinc-500 text-4xl mb-3">+</span>
                    <p className="text-zinc-400 font-medium">{language === 'vi' ? 'Thêm nguyên liệu' : 'Add Ingredient'}</p>
                    <p className="text-purple-400 text-sm mt-1">({multiImages.filter(img => img !== null).length}/4) {language === 'vi' ? 'hoặc kéo vào giỏ' : 'or drag to basket'}</p>
                  </>
                )}
                {showImageSourceMenu && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-10 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { multiFileInputRef.current?.click(); setShowImageSourceMenu(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-700 text-left"><Upload size={18} className="text-purple-400" /><span className="text-sm text-white">{language === 'vi' ? 'Tải từ máy' : 'Upload from device'}</span></button>
                    <button onClick={() => { setShowAssetPicker(true); setShowImageSourceMenu(false); }} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-700 text-left border-t border-zinc-700"><FolderOpen size={18} className="text-purple-400" /><span className="text-sm text-white">{language === 'vi' ? 'Thư viện của tôi' : 'My Assets'}</span></button>
                  </div>
                )}
              </div>
              {multiImages.some(img => img !== null) && (<p className="text-xs text-zinc-500 mt-3 text-center">({multiImages.filter(img => img !== null).length}/4) {language === 'vi' ? 'hoặc kéo vào giỏ' : 'or drag to basket'}</p>)}
              <div className="mt-4 flex rounded-xl overflow-hidden border border-zinc-700">
                <button onClick={() => setSelectedModel('standard')} className={`flex-1 py-3 text-sm font-medium transition-all ${selectedModel === 'standard' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>{language === 'vi' ? 'Chuẩn' : 'Standard'}</button>
                <button onClick={() => setSelectedModel('premium')} className={`flex-1 py-3 text-sm font-medium transition-all ${selectedModel === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>{language === 'vi' ? 'Cao cấp' : 'Premium'}</button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">{trans.inputImage}</h4>
                {inputImage && (<button onClick={() => { setInputImage(null); setOutputImage(null); }} className="text-xs text-purple-400 hover:text-purple-300">{trans.changeImage}</button>)}
              </div>
              {!inputImage ? (
                <div className="space-y-3">
                  <div ref={dropZoneRef} onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 bg-zinc-800/30">
                    <div className="p-4 rounded-full bg-purple-500/20"><Upload size={32} className="text-purple-400" /></div>
                    <div className="text-center"><p className="font-medium text-zinc-300">{trans.dragDrop}</p><p className="text-xs text-zinc-500 mt-1">JPG, PNG, WebP (max 10MB)</p></div>
                    <input ref={fileInputRef} type="file" accept={SUPPORTED_IMAGE_FORMATS.join(',')} onChange={handleInputChange} className="hidden" />
                  </div>
                  <button onClick={() => setShowAssetPicker(true)} className="w-full p-3 rounded-xl border border-zinc-700 hover:border-purple-500 hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2 text-sm font-medium text-zinc-400 hover:text-purple-400"><FolderOpen size={18} />{trans.selectFromAssets}</button>
                </div>
              ) : (<div className="relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700"><img src={inputImage} alt="Input" className="w-full h-auto object-contain max-h-[280px]" /></div>)}
            </div>
          )}

 
         {/* Tool Selector - Hidden for video tools */}
          {selectedTool.id !== 'video-kitchen' && selectedTool.id !== 'dynamic-polaroid' && selectedTool.id !== 'instant-noodle-video' && (
          <div className="px-6 py-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={12} className="text-purple-400" />
              {trans.selectTool}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowToolDropdown(!showToolDropdown)}
                className="w-full flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedStation.color} flex items-center justify-center`}>
                  <span className="text-lg">{selectedStation.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{toolName}</span>
                    {selectedTool.tier !== 'free' && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${selectedTool.tier === 'plus' ? 'bg-purple-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {selectedTool.tier.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">{toolDescription}</span>
                </div>
                <ChevronDown size={16} className={`text-zinc-500 transition-transform ${showToolDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showToolDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-2xl max-h-[300px] overflow-y-auto">
                  {STATIONS.map(station => (
                    <div key={station.id}>
                      <div className="px-3 py-2 bg-zinc-900/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                        <span>{station.icon}</span>
                        {language === 'vi' ? station.nameVi : station.name}
                      </div>
                      {station.tools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelect(tool, station)}
                          className={`w-full flex items-center gap-3 p-3 hover:bg-zinc-700 transition-colors ${selectedTool.id === tool.id ? 'bg-zinc-700' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${station.color} flex items-center justify-center text-sm`}>
                            {typeof tool.icon === 'string' ? tool.icon : '✨'}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{language === 'vi' ? tool.nameVi : tool.name}</span>
                              {tool.tier !== 'free' && (
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${tool.tier === 'plus' ? 'bg-purple-500/80' : 'bg-amber-500/80'} text-white`}>
                                  {tool.tier.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-zinc-500">{language === 'vi' ? tool.descriptionVi : tool.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Tool Options */}
          {selectedTool.options && selectedTool.options.length > 0 && (
            <div className="px-6 py-4 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-4">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] border border-zinc-700">⚙</span>
                {trans.options}
              </div>
              <div className="space-y-4">
                {selectedTool.options.map(option => renderOptionInput(option))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors">
              {trans.cancel}
            </button>
            {outputImage ? (
              <>
                <button onClick={handleRetry} className="px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-900/30 transition-colors flex items-center gap-2">
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={handleSaveToAssets}
                  disabled={savedToAssets}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    savedToAssets ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                  }`}
                >
                  <Save size={16} />
                  {savedToAssets ? trans.saved : trans.saveToAssets}
                </button>
              </>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={
                  processingState.isProcessing ||
                  ((selectedTool.id === 'video-kitchen' || selectedTool.id === 'instant-noodle-video') && !videoPrompt.trim()) ||
                  (selectedTool.id === 'dynamic-polaroid' && !multiImages.some(img => img !== null)) ||
                  (selectedTool.id !== 'video-kitchen' && selectedTool.id !== 'dynamic-polaroid' && selectedTool.id !== 'instant-noodle-video' && !inputImage)
                }
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  processingState.isProcessing ||
                  ((selectedTool.id === 'video-kitchen' || selectedTool.id === 'instant-noodle-video') && !videoPrompt.trim()) ||
                  (selectedTool.id === 'dynamic-polaroid' && !multiImages.some(img => img !== null)) ||
                  (selectedTool.id !== 'video-kitchen' && selectedTool.id !== 'dynamic-polaroid' && selectedTool.id !== 'instant-noodle-video' && !inputImage)
                    ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                }`}
              >
                <Sparkles size={16} />
                {processingState.isProcessing ? trans.processing : trans.generate}
              </button>
            )}
          </div>
        </div>
      </div>


      {/* RIGHT PANEL - Output Area */}
      <div className="flex-1 flex flex-col bg-zinc-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5 pointer-events-none" />

        {/* Output Tabs - Hidden for video tools */}
        {outputImage && !processingState.isProcessing && selectedTool.id !== 'video-kitchen' && selectedTool.id !== 'dynamic-polaroid' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1 p-1 bg-zinc-800/90 backdrop-blur-sm rounded-full border border-zinc-700/50 shadow-lg">
              {[
                { id: 'result' as OutputTab, label: trans.result },
                { id: 'sideBySide' as OutputTab, label: trans.sideBySide },
                { id: 'compare' as OutputTab, label: trans.compare },
              ].map(tab => (
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
        )}

        {/* Zoom Controls - Hidden for video tools */}
        {outputTab === 'result' && outputImage && !processingState.isProcessing && selectedTool.id !== 'video-kitchen' && selectedTool.id !== 'dynamic-polaroid' && (
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

        {/* Output Content */}
        <div className="flex-1 flex flex-col pt-14 relative z-0">
          {renderOutputContent()}
        </div>
      </div>

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <AssetPickerModal
          isOpen={showAssetPicker}
          onClose={() => setShowAssetPicker(false)}
          onSelectAsset={handleAssetSelect}
          multiSelect={selectedTool.id === 'dynamic-polaroid'}
          maxSelection={selectedTool.id === 'dynamic-polaroid' ? 4 - multiImages.filter(img => img !== null).length : 1}
        />
      )}
    </div>
  );
};

export default AIToolExecutionView;
