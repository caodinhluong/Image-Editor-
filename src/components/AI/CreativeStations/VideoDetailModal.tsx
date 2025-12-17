import React, { useState, useRef } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  Sparkles,
  Info,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface VideoTemplate {
  id: number;
  videoUrl: string;
  author: string;
  likes: string;
  aspectRatio: string;
}

interface VideoDetailModalProps {
  video: VideoTemplate;
  onClose: () => void;
  onRecreate: (video: VideoTemplate) => void;
}

// Mock data for video details
const getVideoDetails = (videoId: number) => ({
  prompt: `The scene starts with a close-up of a bearded man pouring vibrant blue liquid with ice cubes into a crystal glass, bathed in soft natural light under a slightly cloudy sky. Slowly, the camera begins a dolly right movement, sliding smoothly along a horizontal track to reveal more of the scene. As the camera glides, the background transitions from a serene coastal view to a lively beach setting with palm trees swaying gently in the breeze.`,
  model: 'Standard',
  preset: 'Dolly Right',
  presetImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  quality: '1080p',
  duration: '5s',
  fps: '24',
  seed: Math.floor(Math.random() * 999999999),
});

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  video,
  onClose,
  onRecreate,
}) => {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const details = getVideoDetails(video.id);

  const trans = {
    vi: {
      author: 'Tác giả',
      prompt: 'PROMPT',
      copy: 'Copy',
      copied: 'Đã copy',
      seeAll: 'Xem tất cả',
      seeLess: 'Thu gọn',
      information: 'THÔNG TIN',
      model: 'Model',
      images: 'Images',
      preset: 'Preset',
      additional: 'BỔ SUNG',
      quality: 'Chất lượng',
      duration: 'Thời lượng',
      fps: 'FPS',
      seed: 'Seed',
      recreate: 'Recreate with Template',
      download: 'Download',
      upscale: 'Upscale',
    },
    en: {
      author: 'Author',
      prompt: 'PROMPT',
      copy: 'Copy',
      copied: 'Copied',
      seeAll: 'See all',
      seeLess: 'See less',
      information: 'INFORMATION',
      model: 'Model',
      images: 'Images',
      preset: 'Preset',
      additional: 'ADDITIONAL',
      quality: 'Quality',
      duration: 'Duration',
      fps: 'FPS',
      seed: 'Seed',
      recreate: 'Recreate with Template',
      download: 'Download',
      upscale: 'Upscale',
    },
  };
  const t = trans[language] || trans.en;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(details.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `video-${video.id}.mp4`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex bg-black/95 backdrop-blur-sm">
      {/* LEFT - Video Player */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="relative max-w-[500px] w-full">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-auto rounded-2xl shadow-2xl"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause size={16} className="text-white" />
                ) : (
                  <Play size={16} className="text-white" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-white" />
                ) : (
                  <Volume2 size={16} className="text-white" />
                )}
              </button>
            </div>
            <button className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg transition-colors">
              <Maximize2 size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT - Info Panel */}
      <div className="w-[380px] bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden relative">
        {/* Fixed Header with Author & Close */}
        <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{video.author.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">{video.author}</h3>
                <p className="text-zinc-500 text-xs">{t.author}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition-all"
            >
              <X size={18} className="text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Prompt Section */}
          <div className="p-4">
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-zinc-700/50">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  <Sparkles size={12} className="text-purple-400" />
                  {t.prompt}
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 bg-zinc-700/50 hover:bg-zinc-600 rounded-lg text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <div className="p-3">
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: showFullPrompt ? '500px' : '96px',
                  }}
                >
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {details.prompt}
                  </p>
                </div>
                <button
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-xs mt-2 transition-colors"
                >
                  {showFullPrompt ? (
                    <>
                      {t.seeLess}
                      <ChevronUp size={12} className="transition-transform duration-300" />
                    </>
                  ) : (
                    <>
                      {t.seeAll}
                      <ChevronDown size={12} className="transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="px-4 pb-4">
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-zinc-700/50">
                <Info size={12} className="text-blue-400" />
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  {t.information}
                </span>
              </div>
              <div className="p-3 space-y-3">
                {/* Model */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.model}</span>
                  <span className="text-sm text-white font-medium">{details.model}</span>
                </div>
                {/* Images */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.images}</span>
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-600">
                    <img src={details.presetImage} alt="Source" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Section */}
          <div className="px-4 pb-4">
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-zinc-700/50">
                <Zap size={12} className="text-yellow-400" />
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  {t.additional}
                </span>
              </div>
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.quality}</span>
                  <span className="text-sm text-white">{details.quality}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.duration}</span>
                  <span className="text-sm text-white">{details.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.fps}</span>
                  <span className="text-sm text-white">{details.fps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.seed}</span>
                  <span className="text-sm text-white font-mono">{details.seed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons with gradient fade */}
        <div className="relative flex-shrink-0">
          {/* Gradient fade effect */}
          <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-3">
            {/* Recreate Button - Gradient 3 màu */}
            <button
              onClick={() => onRecreate(video)}
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-500 hover:via-pink-400 hover:to-orange-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
            >
              <RefreshCw size={18} />
              {t.recreate}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-700"
            >
              <Download size={16} />
              {t.download}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailModal;
