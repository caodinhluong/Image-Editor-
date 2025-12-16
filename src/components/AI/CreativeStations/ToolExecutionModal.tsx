import React, { useState, useRef, useCallback } from 'react';
import { 
  X, 
  Upload, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  RefreshCw,
  Clock,
  Image as ImageIcon,
  Layers,
  FolderOpen,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CreditCard,
  Wand2,
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Station, Tool, ProcessingState, ProcessingResult, ProcessingErrorType } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE, PROCESSING_ERRORS } from '../../../data/stations';
import { ProcessingIndicator } from './ProcessingIndicator';
import { ToolOptions } from './ToolOptions';
import { AssetPickerModal } from '../../Editor/AssetPickerModal';

// Error state interface
interface ErrorState {
  type: ProcessingErrorType;
  message: string;
  retryable: boolean;
  refundCredits: boolean;
  creditsRefunded?: number;
}

interface ToolExecutionModalProps {
  tool: Tool;
  station: Station;
  onClose: () => void;
  onComplete: (result: ProcessingResult) => void;
}

type ViewMode = 'before' | 'after' | 'compare';

export const ToolExecutionModal: React.FC<ToolExecutionModalProps> = ({
  tool,
  station,
  onClose,
  onComplete,
}) => {
  const { language } = useLanguage();
  const { credits, useCredits, triggerUpgradeModal } = useSubscription();
  
  // Check if this is a video tool
  const isVideoTool = tool.inputType === 'video' || tool.inputType === 'both';
  
  // Debug log
  console.log('Tool inputType:', tool.inputType, 'isVideoTool:', isVideoTool);
  
  // Video aspect ratio options
  const aspectRatioOptions = [
    { id: '16:9', label: '16:9', labelVi: '16:9', icon: RectangleHorizontal, desc: 'Landscape', descVi: 'Ngang' },
    { id: '9:16', label: '9:16', labelVi: '9:16', icon: Smartphone, desc: 'Portrait', descVi: 'Dọc' },
    { id: '1:1', label: '1:1', labelVi: '1:1', icon: Square, desc: 'Square', descVi: 'Vuông' },
    { id: '4:3', label: '4:3', labelVi: '4:3', icon: Monitor, desc: 'Standard', descVi: 'Chuẩn' },
    { id: '3:4', label: '3:4', labelVi: '3:4', icon: RectangleVertical, desc: 'Portrait 3:4', descVi: 'Dọc 3:4' },
  ];
  
  // State
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [savedToAssets, setSavedToAssets] = useState(false);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('before');
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({});
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [showRefundNotification, setShowRefundNotification] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    estimatedTimeRemaining: tool.estimatedTime,
  });
  
  // Video-specific state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const toolName = language === 'vi' ? tool.nameVi : tool.name;
  const toolDescription = language === 'vi' ? tool.descriptionVi : tool.description;


  // Initialize tool options with defaults
  React.useEffect(() => {
    if (tool.options) {
      const defaults: Record<string, any> = {};
      tool.options.forEach(opt => {
        defaults[opt.id] = opt.default;
      });
      setToolOptions(defaults);
    }
  }, [tool.options]);

  // File validation - returns error type or null
  const validateFile = (file: File): ProcessingErrorType | null => {
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return 'unsupported_format';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'file_too_large';
    }
    return null;
  };

  // Set error from error type
  const setErrorFromType = (errorType: ProcessingErrorType, creditsRefunded?: number) => {
    const errorInfo = PROCESSING_ERRORS[errorType];
    setErrorState({
      type: errorType,
      message: language === 'vi' ? errorInfo.messageVi : errorInfo.message,
      retryable: errorInfo.retryable,
      refundCredits: errorInfo.refundCredits,
      creditsRefunded
    });

    // Show refund notification if credits were refunded
    if (errorInfo.refundCredits && creditsRefunded && creditsRefunded > 0) {
      setShowRefundNotification(true);
      setTimeout(() => setShowRefundNotification(false), 5000);
    }
  };

  // Clear error state
  const clearError = () => {
    setErrorState(null);
    setShowRefundNotification(false);
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const errorType = validateFile(file);
    if (errorType) {
      setErrorFromType(errorType);
      return;
    }

    clearError();
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImage(e.target?.result as string);
    };
    reader.onerror = () => {
      setErrorFromType('upload_failed');
    };
    reader.readAsDataURL(file);
  }, [language]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add('border-purple-500', 'bg-purple-50', 'dark:bg-purple-900/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-purple-500', 'bg-purple-50', 'dark:bg-purple-900/20');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-purple-500', 'bg-purple-50', 'dark:bg-purple-900/20');
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Simulate processing (in real app, this would call an API)
  const simulateProcessing = async (): Promise<ProcessingResult> => {
    return new Promise((resolve) => {
      const totalTime = tool.estimatedTime * 1000;
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalTime) * 100, 99);
        const remaining = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));
        
        setProcessingState({
          isProcessing: true,
          progress,
          estimatedTimeRemaining: remaining,
          currentStep: language === 'vi' ? 'Đang xử lý...' : 'Processing...',
          currentStepVi: 'Đang xử lý...',
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setProcessingState({
          isProcessing: false,
          progress: 100,
          estimatedTimeRemaining: 0,
        });
        
        // Simulate success (in real app, this would be the actual result)
        resolve({
          success: true,
          outputUrl: inputImage || '',
          creditsUsed: tool.creditCost,
          processingTime: totalTime,
          toolId: tool.id,
          stationId: station.id,
        });
      }, totalTime);
    });
  };


  // Handle generate button click
  const handleGenerate = async () => {
    if (!inputImage) {
      setErrorFromType('upload_failed');
      return;
    }

    // Check credits - compare against tool's credit cost
    if (credits < tool.creditCost) {
      setErrorFromType('insufficient_credits');
      // Also trigger upgrade modal with appropriate feature based on tool tier
      const featureKey = tool.tier === 'pro' ? 'advancedAI' : 'textToImage';
      triggerUpgradeModal(featureKey);
      return;
    }

    clearError();
    setProcessingState({
      isProcessing: true,
      progress: 0,
      estimatedTimeRemaining: tool.estimatedTime,
    });

    try {
      const result = await simulateProcessing();
      
      if (result.success) {
        // Deduct credits based on tool's credit cost
        // Using textToImage as base operation, multiplied by tool cost
        for (let i = 0; i < tool.creditCost; i++) {
          useCredits('textToImage', 1);
        }
        
        // Set output image (in real app, this would be the processed image)
        setOutputImage(result.outputUrl || inputImage);
        setViewMode('after');
        
        onComplete(result);
      } else {
        // Processing returned failure
        setErrorFromType('processing_failed', tool.creditCost);
        setProcessingState({
          isProcessing: false,
          progress: 0,
          estimatedTimeRemaining: tool.estimatedTime,
        });
      }
    } catch (err) {
      // On failure, show error with refund notification
      // Credits are refunded automatically on processing failure
      setErrorFromType('processing_failed', tool.creditCost);
      setProcessingState({
        isProcessing: false,
        progress: 0,
        estimatedTimeRemaining: tool.estimatedTime,
      });
    }
  };

  // Handle retry - clears error and resets state for another attempt
  const handleRetry = () => {
    clearError();
    setOutputImage(null);
    setViewMode('before');
    setProcessingState({
      isProcessing: false,
      progress: 0,
      estimatedTimeRemaining: tool.estimatedTime,
    });
  };

  // Handle retry from error state - attempts to regenerate
  const handleRetryFromError = () => {
    clearError();
    // If we have an input image, try processing again
    if (inputImage) {
      handleGenerate();
    }
  };

  // Handle save to assets
  const handleSaveToAssets = () => {
    if (outputImage) {
      // In a real app, this would save to the user's asset library via API
      // For now, we simulate saving and show success feedback
      setSavedToAssets(true);
      
      // Also trigger download as backup
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = `${tool.id}-${Date.now()}.png`;
      link.click();
      
      // Reset saved status after 3 seconds
      setTimeout(() => setSavedToAssets(false), 3000);
    }
  };

  // Handle download only
  const handleDownload = () => {
    if (outputImage) {
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = `${tool.id}-${Date.now()}.png`;
      link.click();
    }
  };

  // Handle asset selection from picker
  const handleAssetSelect = (asset: { src: string; name?: string }) => {
    setInputImage(asset.src);
    setShowAssetPicker(false);
  };

  // Handle option change
  const handleOptionChange = (optionId: string, value: any) => {
    setToolOptions(prev => ({
      ...prev,
      [optionId]: value,
    }));
  };

  // AI Enhance prompt for video
  const handleEnhancePrompt = async () => {
    if (!videoPrompt.trim()) return;
    
    setIsEnhancingPrompt(true);
    
    // Simulate AI enhancement (in real app, this would call an API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced prompt examples based on input
    const enhancements = [
      'cinematic lighting, smooth camera movement, high quality, 4K resolution',
      'professional color grading, dynamic motion, detailed textures',
      'dramatic atmosphere, fluid transitions, vivid colors',
    ];
    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    
    setVideoPrompt(prev => `${prev}, ${randomEnhancement}`);
    setIsEnhancingPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-zinc-500" />
            </button>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${station.color}`}>
              <span className="text-xl">{station.icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">{toolName}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{toolDescription}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>


        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Video Prompt Section - Only for video tools */}
          {isVideoTool && (
            <div className="mb-4 space-y-4">
              {/* Prompt Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-zinc-900 dark:text-white">
                    {language === 'vi' ? 'Mô tả video' : 'Video Description'}
                  </h4>
                  <button
                    onClick={handleEnhancePrompt}
                    disabled={!videoPrompt.trim() || isEnhancingPrompt}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !videoPrompt.trim() || isEnhancingPrompt
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:shadow-md'
                    }`}
                  >
                    <Wand2 size={14} className={isEnhancingPrompt ? 'animate-spin' : ''} />
                    {isEnhancingPrompt 
                      ? (language === 'vi' ? 'Đang tối ưu...' : 'Enhancing...') 
                      : (language === 'vi' ? 'AI Enhance' : 'AI Enhance')
                    }
                  </button>
                </div>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder={language === 'vi' 
                    ? 'Mô tả chi tiết video bạn muốn tạo... (VD: Một con mèo đang chạy trên bãi biển lúc hoàng hôn)'
                    : 'Describe the video you want to create... (e.g., A cat running on the beach at sunset)'
                  }
                  className="w-full h-24 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'vi' 
                    ? 'Mẹo: Mô tả càng chi tiết, video càng chính xác. Sử dụng AI Enhance để tối ưu prompt.'
                    : 'Tip: The more detailed your description, the better the result. Use AI Enhance to optimize your prompt.'
                  }
                </p>
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Khung hình' : 'Aspect Ratio'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aspectRatioOptions.map((ratio) => {
                    const IconComponent = ratio.icon;
                    return (
                      <button
                        key={ratio.id}
                        onClick={() => setSelectedAspectRatio(ratio.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          selectedAspectRatio === ratio.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-600 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        <IconComponent size={16} />
                        <span className="text-sm font-medium">{ratio.label}</span>
                        <span className="text-xs opacity-70">
                          {language === 'vi' ? ratio.descVi : ratio.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Input/Upload Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Ảnh đầu vào' : 'Input Image'}
                </h4>
                {inputImage && (
                  <button
                    onClick={() => {
                      setInputImage(null);
                      setOutputImage(null);
                      setViewMode('before');
                    }}
                    className="text-xs text-purple-500 hover:text-purple-600"
                  >
                    {language === 'vi' ? 'Đổi ảnh' : 'Change image'}
                  </button>
                )}
              </div>

              {!inputImage ? (
                <div className="space-y-3">
                  <div
                    ref={dropZoneRef}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-800/50"
                  >
                    <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Upload size={32} className="text-purple-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">
                        {language === 'vi' ? 'Kéo thả hoặc nhấn để tải ảnh' : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        JPG, PNG, WebP (max 10MB)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={SUPPORTED_IMAGE_FORMATS.join(',')}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Select from Assets button */}
                  <button
                    onClick={() => setShowAssetPicker(true)}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-purple-600"
                  >
                    <FolderOpen size={18} />
                    {language === 'vi' ? 'Chọn từ thư viện' : 'Select from Assets'}
                  </button>
                </div>
              ) : (
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={inputImage}
                    alt="Input"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Tool Options */}
              {tool.options && tool.options.length > 0 && (
                <ToolOptions
                  options={tool.options}
                  values={toolOptions}
                  onChange={handleOptionChange}
                />
              )}
            </div>

            {/* Right: Preview/Output Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Kết quả' : 'Result'}
                </h4>
                {outputImage && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('before')}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                        viewMode === 'before' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' 
                          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {language === 'vi' ? 'Trước' : 'Before'}
                    </button>
                    <button
                      onClick={() => setViewMode('after')}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                        viewMode === 'after' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' 
                          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {language === 'vi' ? 'Sau' : 'After'}
                    </button>
                    <button
                      onClick={() => setViewMode('compare')}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                        viewMode === 'compare' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' 
                          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Layers size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {processingState.isProcessing ? (
                  <ProcessingIndicator
                    progress={processingState.progress}
                    estimatedTimeRemaining={processingState.estimatedTimeRemaining}
                    currentStep={processingState.currentStep}
                  />
                ) : outputImage ? (
                  viewMode === 'compare' ? (
                    <div className="relative w-full h-full">
                      <img src={inputImage || ''} alt="Before" className="absolute inset-0 w-full h-full object-contain" />
                      <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-white">
                        <img src={outputImage} alt="After" className="w-[200%] h-full object-contain" />
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Layers size={16} className="text-zinc-600" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={viewMode === 'before' ? inputImage || '' : outputImage}
                      alt={viewMode === 'before' ? 'Before' : 'After'}
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div className="text-center text-zinc-400">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {language === 'vi' ? 'Kết quả sẽ hiển thị ở đây' : 'Result will appear here'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Error Display */}
          {errorState && (
            <div className="mt-4 space-y-3">
              {/* Main Error Message */}
              <div className={`p-4 rounded-xl border ${
                errorState.type === 'insufficient_credits'
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start gap-3">
                  {/* Error Icon */}
                  <div className={`p-2 rounded-lg ${
                    errorState.type === 'insufficient_credits'
                      ? 'bg-amber-100 dark:bg-amber-900/40'
                      : 'bg-red-100 dark:bg-red-900/40'
                  }`}>
                    {errorState.type === 'insufficient_credits' ? (
                      <CreditCard size={20} className="text-amber-600 dark:text-amber-400" />
                    ) : errorState.type === 'upload_failed' || errorState.type === 'unsupported_format' || errorState.type === 'file_too_large' ? (
                      <AlertTriangle size={20} className="text-red-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                  </div>
                  
                  {/* Error Content */}
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${
                      errorState.type === 'insufficient_credits'
                        ? 'text-amber-800 dark:text-amber-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {errorState.type === 'insufficient_credits'
                        ? (language === 'vi' ? 'Không đủ credits' : 'Insufficient Credits')
                        : errorState.type === 'processing_failed'
                        ? (language === 'vi' ? 'Xử lý thất bại' : 'Processing Failed')
                        : errorState.type === 'upload_failed'
                        ? (language === 'vi' ? 'Tải lên thất bại' : 'Upload Failed')
                        : errorState.type === 'timeout'
                        ? (language === 'vi' ? 'Hết thời gian' : 'Timeout')
                        : (language === 'vi' ? 'Lỗi' : 'Error')
                      }
                    </h4>
                    <p className={`text-sm mt-1 ${
                      errorState.type === 'insufficient_credits'
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {errorState.message}
                    </p>
                  </div>

                  {/* Retry Button */}
                  {errorState.retryable && (
                    <button
                      onClick={handleRetryFromError}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                        errorState.type === 'insufficient_credits'
                          ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-700'
                          : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-700'
                      }`}
                    >
                      <RefreshCw size={14} />
                      {language === 'vi' ? 'Thử lại' : 'Retry'}
                    </button>
                  )}

                  {/* Close Error Button */}
                  <button
                    onClick={clearError}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className={
                      errorState.type === 'insufficient_credits'
                        ? 'text-amber-500'
                        : 'text-red-500'
                    } />
                  </button>
                </div>
              </div>

              {/* Credit Refund Notification */}
              {showRefundNotification && errorState.refundCredits && errorState.creditsRefunded && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3 animate-pulse">
                  <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/40">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      {language === 'vi' ? 'Credits đã được hoàn lại' : 'Credits Refunded'}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {language === 'vi' 
                        ? `${errorState.creditsRefunded} credits đã được hoàn vào tài khoản của bạn`
                        : `${errorState.creditsRefunded} credits have been returned to your account`
                      }
                    </p>
                  </div>
                  <span className="text-lg">💎</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between">
            {/* Credit info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">💎</span>
                <span className="font-bold text-zinc-900 dark:text-white">{tool.creditCost}</span>
                <span className="text-zinc-500">
                  {language === 'vi' ? 'credits' : 'credits'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock size={14} />
                <span>~{tool.estimatedTime}s</span>
              </div>
              <div className="text-xs text-zinc-400">
                {language === 'vi' ? `Số dư: ${credits} credits` : `Balance: ${credits} credits`}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              
              {outputImage ? (
                <>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    {language === 'vi' ? 'Tạo lại' : 'Regenerate'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    {language === 'vi' ? 'Tải xuống' : 'Download'}
                  </button>
                  <button
                    onClick={handleSaveToAssets}
                    disabled={savedToAssets}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      savedToAssets
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                    }`}
                  >
                    <Save size={16} />
                    {savedToAssets 
                      ? (language === 'vi' ? 'Đã lưu!' : 'Saved!')
                      : (language === 'vi' ? 'Lưu vào thư viện' : 'Save to Assets')
                    }
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!inputImage || processingState.isProcessing}
                  className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    !inputImage || processingState.isProcessing
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 hover:shadow-lg'
                  }`}
                >
                  <Sparkles size={16} />
                  {processingState.isProcessing 
                    ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...') 
                    : (language === 'vi' ? 'Tạo' : 'Generate')
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <AssetPickerModal
          isOpen={showAssetPicker}
          onClose={() => setShowAssetPicker(false)}
          onSelectAsset={handleAssetSelect}
          multiSelect={false}
          maxSelection={1}
        />
      )}
    </div>
  );
};

export default ToolExecutionModal;
