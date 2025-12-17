import React, { useState, useRef, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Download,
  Wand2,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VideoTemplate {
  id: number;
  videoUrl: string;
  author: string;
  likes: string;
  aspectRatio: string;
}

interface VideoRecreateViewProps {
  video: VideoTemplate;
  templatePrompt: string;
  onClose: () => void;
}

// Models for video generation
const videoModels = [
  { id: 'standard', name: 'Standard', desc: 'Fast generation' },
  { id: 'pro', name: 'Pro', desc: 'Higher quality' },
  { id: 'ultra', name: 'Ultra', desc: 'Best quality', isNew: true },
];

export const VideoRecreateView: React.FC<VideoRecreateViewProps> = ({
  video,
  templatePrompt,
  onClose,
}) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultVideoRef = useRef<HTMLVideoElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(templatePrompt);
  const [selectedModel, setSelectedModel] = useState('standard');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const trans = {
    vi: {
      title: 'Recreate Video',
      uploadImage: 'Tải ảnh lên',
      dragDrop: 'Kéo thả ảnh vào đây',
      or: 'hoặc',
      browse: 'Chọn từ máy',
      prompt: 'PROMPT',
      model: 'Model',
      generate: 'Tạo Video',
      generating: 'Đang tạo...',
      result: 'Kết quả',
      waitingGeneration: 'Chờ tạo video...',
      uploadFirst: 'Vui lòng tải ảnh lên trước',
      download: 'Tải xuống',
      regenerate: 'Tạo lại',
      removeImage: 'Xóa ảnh',
    },
    en: {
      title: 'Recreate Video',
      uploadImage: 'Upload Image',
      dragDrop: 'Drag & drop image here',
      or: 'or',
      browse: 'Browse files',
      prompt: 'PROMPT',
      model: 'Model',
      generate: 'Generate Video',
      generating: 'Generating...',
      result: 'Result',
      waitingGeneration: 'Waiting for generation...',
      uploadFirst: 'Please upload an image first',
      download: 'Download',
      regenerate: 'Regenerate',
      removeImage: 'Remove image',
    },
  };
  const t = trans[language] || trans.en;

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setGeneratedVideo(null);
  };

  const handleGenerate = () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setGeneratedVideo(null);

    // Simulate video generation
    setTimeout(() => {
      setGeneratedVideo(video.videoUrl);
      setIsGenerating(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (resultVideoRef.current) {
      if (isPlaying) {
        resultVideoRef.current.pause();
      } else {
        resultVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `recreated-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-6 z-20">
        <h1 className="text-lg font-semibold text-white">{t.title}</h1>
        <button
          onClick={onClose}
          className="p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition-all"
        >
          <X size={18} className="text-zinc-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex pt-16">
        {/* LEFT - Upload & Settings */}
        <div className="w-[450px] bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Upload Section */}
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-zinc-700/50">
                <ImageIcon size={14} className="text-purple-400" />
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  {t.uploadImage}
                </span>
              </div>

              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`p-8 flex flex-col items-center justify-center transition-colors ${
                    isDragging ? 'bg-purple-500/10 border-purple-500' : ''
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-700/50 flex items-center justify-center mb-4">
                    <Upload size={28} className="text-zinc-500" />
                  </div>
                  <p className="text-zinc-400 text-sm mb-2">{t.dragDrop}</p>
                  <p className="text-zinc-600 text-xs mb-4">{t.or}</p>
                  <button
                    onClick={handleBrowseClick}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-colors"
                  >
                    {t.browse}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="p-4">
                  <div className="relative group">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-zinc-700/50">
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  {t.prompt}
                </span>
              </div>
              <div className="p-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-3 text-sm text-zinc-300 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Enter your prompt..."
                />
              </div>
            </div>

            {/* Model Selection */}
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-zinc-700/50">
                <Wand2 size={14} className="text-blue-400" />
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  {t.model}
                </span>
              </div>
              <div className="p-3 relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-700/50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-white">
                    {videoModels.find((m) => m.id === selectedModel)?.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-zinc-500 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
                {showModelDropdown && (
                  <div className="absolute top-full left-3 right-3 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-10 shadow-2xl">
                    {videoModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-700 transition-colors ${
                          selectedModel === model.id ? 'bg-zinc-700' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white">{model.name}</span>
                            {model.isNew && (
                              <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-[9px] font-bold rounded">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-500">{model.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="p-5 border-t border-zinc-800 flex-shrink-0">
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-500 hover:via-pink-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {t.generate}
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT - Result */}
        <div className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">
          {/* Background gradient decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Result Content */}
          <div className="flex-1 flex items-center justify-center p-8 relative z-10">
            {isGenerating ? (
              <div className="flex flex-col items-center">
                {/* Animated loading */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-zinc-800 border-t-purple-500 border-r-pink-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-zinc-900/80 backdrop-blur flex items-center justify-center">
                      <Wand2 size={28} className="text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <p className="mt-8 text-white font-semibold text-lg">{t.generating}</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Using {videoModels.find((m) => m.id === selectedModel)?.name} model...
                </p>
                {/* Progress bar simulation */}
                <div className="mt-6 w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            ) : generatedVideo ? (
              <div className="relative max-w-[420px] w-full">
                {/* Video container with glow effect */}
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Video wrapper */}
                  <div className="relative bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                    <video
                      ref={resultVideoRef}
                      src={generatedVideo}
                      className="w-full h-auto"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Video Controls - appears on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={togglePlay}
                          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/10"
                        >
                          {isPlaying ? (
                            <Pause size={18} className="text-white" />
                          ) : (
                            <Play size={18} className="text-white" />
                          )}
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleGenerate}
                            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/10"
                            title={t.regenerate}
                          >
                            <RefreshCw size={18} className="text-white" />
                          </button>
                          <button
                            onClick={handleDownload}
                            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl transition-all shadow-lg"
                            title={t.download}
                          >
                            <Download size={18} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video info badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full shadow-lg">
                    <span className="text-white text-xs font-semibold">AI Generated</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Empty state with animation */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-zinc-800/30 border border-zinc-700/50 flex items-center justify-center mx-auto mb-6 backdrop-blur">
                    <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                      <Play size={36} className="text-zinc-600" />
                    </div>
                  </div>
                  {/* Decorative rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 rounded-full border border-zinc-800/50 animate-pulse" />
                  </div>
                </div>
                <p className="text-zinc-400 font-medium">
                  {uploadedImage ? t.waitingGeneration : t.uploadFirst}
                </p>
                <p className="text-zinc-600 text-sm mt-2">
                  {uploadedImage 
                    ? (language === 'vi' ? 'Nhấn nút "Tạo Video" để bắt đầu' : 'Click "Generate Video" to start')
                    : (language === 'vi' ? 'Tải ảnh lên để tiếp tục' : 'Upload an image to continue')
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecreateView;
