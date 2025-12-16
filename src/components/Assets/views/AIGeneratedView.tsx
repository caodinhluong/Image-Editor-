import React, { useState } from 'react';
import {
  Sparkles, Wand2, Calendar, Download, Filter, ChevronDown,
  Zap, Clock, RefreshCw, Heart, X, Share2, Copy, Check,
  Trash2, Edit3, ExternalLink, Info
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';
import { RecreateView } from '../../Marketplace/RecreateView';

interface AIAsset {
  id: string;
  name: string;
  thumbnail: string;
  prompt: string;
  model: string;
  style: string;
  tool: string;
  createdAt: string;
  generationTime: string;
  credits: number;
  liked: boolean;
  ratio: string;
}

interface AIGeneratedViewProps {
  selectedTool?: string;
  onToolChange?: (tool: string) => void;
  aiTools?: { id: string; name: string }[];
}

export const AIGeneratedView: React.FC<AIGeneratedViewProps> = ({
  selectedTool = 'all',
  onToolChange,
  aiTools = []
}) => {
  const { language } = useLanguage();
  const [showToolFilter, setShowToolFilter] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AIAsset | null>(null);
  const [showRecreate, setShowRecreate] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  // Sample video assets with Higgsfield CDN videos
  const videoAssets = [
    { id: 'v1', name: 'Portrait_Motion.mp4', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600', videoUrl: 'https://cdn.higgsfield.ai/kling_video_sample/1308a1ac-d626-4178-b6d5-0e2bb676f194.mp4', prompt: 'Portrait with subtle hair movement and cinematic lighting', model: 'Kling AI', duration: '5s', createdAt: '2024-12-10' },
    { id: 'v2', name: 'Fashion_Scene.mp4', thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', videoUrl: 'https://cdn.higgsfield.ai/kling_video_sample/377e5f89-37b7-4d72-8a22-2802faabf4e5.mp4', prompt: 'Fashion model walking with dynamic camera movement', model: 'Runway Gen-3', duration: '8s', createdAt: '2024-12-09' },
    { id: 'v3', name: 'Artistic_Motion.mp4', thumbnail: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600', videoUrl: 'https://cdn.higgsfield.ai/kling_video_sample/383a6e99-f88d-41c1-8b62-e2181cae3406.mp4', prompt: 'Artistic double exposure with flowing motion', model: 'Kling AI', duration: '6s', createdAt: '2024-12-08' },
    { id: 'v4', name: 'Creative_Loop.mp4', thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600', videoUrl: 'https://cdn.higgsfield.ai/kling_video_sample/cf9c9837-4383-4edf-898e-7f85b687eea5.mp4', prompt: 'Creative portrait with seamless loop animation', model: 'Pika Labs', duration: '4s', createdAt: '2024-12-07' },
  ];

  const aiAssets: AIAsset[] = [
    { id: '1', name: 'Forest_Magic.png', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600', prompt: 'Dark mystical forest with red magical light, two silhouettes facing each other, cinematic atmosphere', model: 'Repix Pro', style: 'Cinematic', tool: 'text-to-image', createdAt: '2024-12-10', generationTime: '12s', credits: 4, liked: true, ratio: '2:3' },
    { id: '2', name: 'Library_Sphere.png', thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600', prompt: 'Crystal ball reflecting infinite library, warm golden light, vintage aesthetic', model: 'Repix Pro', style: 'Fantasy Art', tool: 'text-to-image', createdAt: '2024-12-09', generationTime: '15s', credits: 4, liked: false, ratio: '1:1' },
    { id: '3', name: 'F1_Race.png', thumbnail: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=600', prompt: 'Formula 1 race cars on track, dramatic sky with birds, action shot', model: 'Repix Plus', style: 'Photograph', tool: 'upscale', createdAt: '2024-12-08', generationTime: '8s', credits: 6, liked: true, ratio: '16:9' },
    { id: '4', name: 'City_Rain.png', thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600', prompt: 'Rainy city street at night, neon lights reflection, cyberpunk mood', model: 'Repix Pro', style: 'Cinematic', tool: 'gen-fill', createdAt: '2024-12-07', generationTime: '18s', credits: 4, liked: false, ratio: '3:2' },
    { id: '5', name: 'Modern_House.png', thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', prompt: 'Modern luxury house at dusk, warm interior lights, architectural photography', model: 'Repix Pro', style: 'Photograph', tool: 'text-to-image', createdAt: '2024-12-06', generationTime: '14s', credits: 4, liked: true, ratio: '16:9' },
    { id: '6', name: 'Crystal_Banana.png', thumbnail: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', prompt: 'Surreal banana with purple crystal growing inside, studio lighting, product shot', model: 'Repix Plus', style: 'Digital Art', tool: 'magic-replace', createdAt: '2024-12-05', generationTime: '20s', credits: 6, liked: false, ratio: '1:1' },
    { id: '7', name: 'Sunset_Field.png', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', prompt: 'Person standing in golden wheat field at sunset, silhouette, peaceful atmosphere', model: 'Repix Pro', style: 'Photograph', tool: 'text-to-image', createdAt: '2024-12-04', generationTime: '10s', credits: 4, liked: true, ratio: '3:2' },
    { id: '8', name: 'Comic_Mars.png', thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600', prompt: 'Astronaut on Mars surface, comic book style, vintage sci-fi aesthetic', model: 'Repix Pro', style: 'Digital Art', tool: 'text-to-image', createdAt: '2024-12-03', generationTime: '16s', credits: 4, liked: false, ratio: '4:3' },
    { id: '9', name: 'Retro_TV.png', thumbnail: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', prompt: 'Stack of vintage televisions, retro aesthetic, moody lighting', model: 'Repix Plus', style: 'Photograph', tool: 'upscale', createdAt: '2024-12-02', generationTime: '9s', credits: 6, liked: true, ratio: '2:3' },
    { id: '10', name: 'City_Cartoon.png', thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600', prompt: 'Colorful cartoon city with dinosaurs and beach, whimsical illustration style', model: 'Repix Pro', style: 'Digital Art', tool: 'text-to-image', createdAt: '2024-12-01', generationTime: '22s', credits: 4, liked: false, ratio: '16:9' },
    { id: '11', name: 'Glass_Car.png', thumbnail: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600', prompt: 'Transparent glass car in meadow, surreal concept art, golden hour', model: 'Repix Pro', style: 'Fantasy Art', tool: 'gen-fill', createdAt: '2024-11-30', generationTime: '25s', credits: 4, liked: true, ratio: '3:2' },
    { id: '12', name: 'Vintage_Portrait.png', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600', prompt: 'Vintage portrait of woman, 1950s style, black and white with subtle color', model: 'Repix Plus', style: 'Photograph', tool: 'magic-replace', createdAt: '2024-11-29', generationTime: '12s', credits: 6, liked: false, ratio: '3:4' },
  ];

  const filteredAssets = selectedTool === 'all' 
    ? aiAssets 
    : aiAssets.filter(asset => asset.tool === selectedTool);

  const getToolLabel = (toolId: string) => {
    const tool = aiTools.find(t => t.id === toolId);
    return tool?.name || toolId;
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log('Toggle like:', id);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Action Bar */}
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 flex items-center justify-between">
        {/* Tabs: Image / Video */}
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'image'
                  ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              🖼️ {language === 'vi' ? 'Hình ảnh' : 'Image'}
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                {aiAssets.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'video'
                  ? 'bg-white dark:bg-zinc-700 text-pink-600 dark:text-pink-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              🎬 Video
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full">
                {videoAssets.length}
              </span>
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-2">
            {[
              { label: language === 'vi' ? 'Tổng' : 'Total', value: String(aiAssets.length + videoAssets.length), icon: Sparkles, color: 'text-purple-500' },
              { label: language === 'vi' ? 'Hôm nay' : 'Today', value: '5', icon: Calendar, color: 'text-blue-500' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <stat.icon size={12} className={stat.color} />
                <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tool Filter */}
          {aiTools.length > 0 && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowToolFilter(!showToolFilter)}
              >
                <Filter size={14} />
                {selectedTool === 'all' 
                  ? (language === 'vi' ? 'Tất cả công cụ' : 'All Tools')
                  : getToolLabel(selectedTool)
                }
                <ChevronDown size={14} />
              </Button>
              
              {showToolFilter && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 z-50">
                  {aiTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => { 
                        onToolChange?.(tool.id); 
                        setShowToolFilter(false); 
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedTool === tool.id 
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Wand2 size={16} />
            {language === 'vi' ? 'Tạo ảnh mới' : 'Generate New'}
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-100 dark:bg-zinc-900/50">
        {/* Image Tab */}
        {activeTab === 'image' && (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800"
                onClick={() => setSelectedAsset(asset)}
              >
                <img 
                  src={asset.thumbnail} 
                  alt={asset.name} 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Top Actions */}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button 
                      onClick={(e) => toggleLike(e, asset.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        asset.liked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart size={14} fill={asset.liked ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors"
                    >
                      <Download size={14} />
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Badge className="mb-2 bg-purple-500/90 text-white text-[10px] backdrop-blur-sm">
                      <Sparkles size={10} className="mr-1" />
                      {asset.style}
                    </Badge>
                    <p className="text-white text-xs line-clamp-2 mb-2 leading-relaxed">
                      {asset.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} />
                        {asset.generationTime}
                      </span>
                      <span>{asset.model}</span>
                    </div>
                  </div>

                  {/* Center Action */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      <RefreshCw size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Tab - Masonry layout with autoplay */}
        {activeTab === 'video' && (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
            {videoAssets.map(video => (
              <div
                key={video.id}
                className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800"
              >
                {/* Video Player - Auto plays continuously */}
                <video 
                  src={video.videoUrl}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-auto"
                />
                
                {/* Duration Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                  {video.duration}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Badge className="mb-2 bg-pink-500/90 text-white text-[10px] backdrop-blur-sm">
                      🎬 {video.model}
                    </Badge>
                    <p className="text-white text-xs line-clamp-2 leading-relaxed">
                      {video.prompt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'image' && filteredAssets.length === 0) || (activeTab === 'video' && videoAssets.length === 0)) && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Wand2 size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              {activeTab === 'image' 
                ? (language === 'vi' ? 'Chưa có ảnh nào' : 'No images yet')
                : (language === 'vi' ? 'Chưa có video nào' : 'No videos yet')
              }
            </h3>
            <p className="text-sm text-zinc-500 max-w-xs">
              {activeTab === 'image'
                ? (language === 'vi' ? 'Bắt đầu tạo ảnh AI đầu tiên của bạn' : 'Start creating your first AI image')
                : (language === 'vi' ? 'Bắt đầu tạo video AI đầu tiên của bạn' : 'Start creating your first AI video')
              }
            </p>
          </div>
        )}
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && !showRecreate && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onRecreate={() => setShowRecreate(true)}
        />
      )}

      {/* RecreateView Modal */}
      {selectedAsset && showRecreate && (
        <RecreateView
          onClose={() => {
            setShowRecreate(false);
            setSelectedAsset(null);
          }}
          originalImage={selectedAsset.thumbnail}
          originalPrompt={selectedAsset.prompt}
          generationInfo={{
            model: selectedAsset.model,
            style: selectedAsset.style,
            ratio: selectedAsset.ratio,
          }}
          autoGenerate={false}
        />
      )}
    </div>
  );
};

// Asset Detail Modal Component
interface AssetDetailModalProps {
  asset: AIAsset;
  onClose: () => void;
  onRecreate: () => void;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose, onRecreate }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(asset.liked);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(asset.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = asset.thumbnail;
    link.download = asset.name;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
        {/* Left - Image */}
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-6 relative">
          <img 
            src={asset.thumbnail} 
            alt={asset.name} 
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl"
          />
          
          {/* Style Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-purple-500 text-white px-3 py-1.5 text-sm">
              <Sparkles size={14} className="mr-1.5" />
              {asset.style}
            </Badge>
          </div>
        </div>

        {/* Right - Info Panel */}
        <div className="w-[380px] flex flex-col border-l border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate pr-2">{asset.name}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={18} className="text-zinc-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => setLiked(!liked)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-colors ${
                  liked 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500' 
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{liked ? (language === 'vi' ? 'Đã thích' : 'Liked') : 'Like'}</span>
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm font-medium">{language === 'vi' ? 'Tải xuống' : 'Download'}</span>
              </button>
              <button className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
                <Share2 size={16} />
              </button>
            </div>

            {/* Prompt Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Prompt</span>
                <button 
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-xs text-repix-500 hover:text-repix-600 font-medium"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? (language === 'vi' ? 'Đã copy' : 'Copied') : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {asset.prompt}
              </div>
            </div>

            {/* Generation Info */}
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                {language === 'vi' ? 'Thông tin' : 'Generation Info'}
              </span>
              <div className="space-y-2">
                {[
                  { label: 'Model', value: asset.model },
                  { label: 'Style', value: asset.style },
                  { label: language === 'vi' ? 'Tỷ lệ' : 'Ratio', value: asset.ratio },
                  { label: language === 'vi' ? 'Ngày tạo' : 'Created', value: asset.createdAt },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <span className="text-sm text-zinc-500">{item.label}</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Used */}
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                {language === 'vi' ? 'Công cụ đã dùng' : 'Tool Used'}
              </span>
              <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Wand2 size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white capitalize">
                    {asset.tool.replace(/-/g, ' ')}
                  </p>
                  <p className="text-xs text-zinc-500">AI Generation Tool</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <Button 
              onClick={onRecreate}
              className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
            >
              <RefreshCw size={16} />
              {language === 'vi' ? 'Tạo lại với tùy chỉnh' : 'Recreate with Options'}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-10 gap-2 text-sm">
                <Edit3 size={14} />
                {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
              </Button>
              <Button variant="outline" className="flex-1 h-10 gap-2 text-sm text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
                <Trash2 size={14} />
                {language === 'vi' ? 'Xóa' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
