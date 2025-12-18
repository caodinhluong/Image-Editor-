import React, { useState } from 'react';
import {
  X, Heart, Download, Share2, Bookmark, User, Calendar, Eye, 
  ChevronLeft, ChevronRight, Grid3X3, LayoutGrid, Play, Sparkles,
  Copy, Check, ExternalLink, MoreHorizontal, Flag, MessageCircle
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface CollectionImage {
  id: number;
  src: string;
  prompt?: string;
  likes: string;
}

interface Collection {
  id: number;
  title: string;
  author: string;
  authorAvatar?: string;
  count: number;
  images: string[];
  likes: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  views?: string;
}

interface CollectionDetailModalProps {
  collection: Collection;
  onClose: () => void;
  onSelectImage?: (image: string) => void;
  onNavigateToPhotoshoot?: (data: {
    images: string[];
    imageCount: number;
    templateSettings: {
      title: string;
      style: string;
      model: string;
      ratio: string;
    };
  }) => void;
}

export const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
  collection,
  onClose,
  onSelectImage,
  onNavigateToPhotoshoot
}) => {
  const { language } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Navigate directly to Smart Photoshoot with template settings
  const handleRecreateStyle = () => {
    if (onNavigateToPhotoshoot) {
      onNavigateToPhotoshoot({
        images: [], // Empty - user will upload in Smart Photoshoot
        imageCount: 4, // Default count
        templateSettings: {
          title: collection.title,
          style: 'Professional Portrait',
          model: 'Flux Pro',
          ratio: '9:16'
        }
      });
      onClose();
    }
  };

  // Generate full image list from collection
  const allImages: CollectionImage[] = collection.images.map((src, idx) => ({
    id: idx + 1,
    src,
    prompt: `${collection.title} - Image ${idx + 1}`,
    likes: `${Math.floor(Math.random() * 500 + 100)}`
  }));

  // Add more sample images to fill the collection
  const extendedImages: CollectionImage[] = [
    ...allImages,
    ...Array.from({ length: Math.max(0, collection.count - allImages.length) }, (_, i) => ({
      id: allImages.length + i + 1,
      src: `https://picsum.photos/seed/${collection.id}_${i}/400/600`,
      prompt: `${collection.title} - Image ${allImages.length + i + 1}`,
      likes: `${Math.floor(Math.random() * 500 + 100)}`
    }))
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://repix.ai/collection/${collection.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : extendedImages.length - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex < extendedImages.length - 1 ? selectedImageIndex + 1 : 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full h-full md:w-[95vw] md:h-[95vh] md:max-w-7xl bg-white dark:bg-zinc-900 md:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-[2px]">
                <img 
                  src={collection.authorAvatar || `https://picsum.photos/seed/${collection.author}/100/100`}
                  alt={collection.author}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-zinc-900"
                />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">{collection.author}</h3>
                <p className="text-xs text-zinc-500">
                  {language === 'vi' ? 'Creator' : 'Creator'} • {collection.views || '12.5k'} {language === 'vi' ? 'lượt xem' : 'views'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? 'text-red-500' : ''}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="ml-1 hidden sm:inline">{collection.likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? 'text-yellow-500' : ''}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
            </Button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={20} className="text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Collection Info Section */}
          <div className="px-4 md:px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                  {collection.title}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  {collection.description || (language === 'vi' 
                    ? `Bộ sưu tập ${collection.count} ảnh chất lượng cao được tuyển chọn bởi ${collection.author}. Hoàn hảo cho các dự án sáng tạo của bạn.`
                    : `A curated collection of ${collection.count} high-quality images by ${collection.author}. Perfect for your creative projects.`
                  )}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(collection.tags || ['Fashion', 'Portrait', 'Professional', 'Studio']).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Grid3X3 size={16} />
                    <span>{collection.count} {language === 'vi' ? 'ảnh' : 'images'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{collection.likes} {language === 'vi' ? 'thích' : 'likes'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{collection.views || '12.5k'} {language === 'vi' ? 'lượt xem' : 'views'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{collection.createdAt || '2 days ago'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Button className="w-full">
                  <Download size={16} className="mr-2" />
                  {language === 'vi' ? 'Tải tất cả' : 'Download All'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRecreateStyle}>
                  <Sparkles size={16} className="mr-2" />
                  {language === 'vi' ? 'Bắt đầu' : 'Get Started'}
                </Button>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="px-4 md:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              {extendedImages.length} {language === 'vi' ? 'ảnh trong bộ sưu tập' : 'images in collection'}
            </span>
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'masonry' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
              >
                <Grid3X3 size={16} />
              </button>
            </div>
          </div>

          {/* Images Grid */}
          <div className="p-4 md:p-6">
            {viewMode === 'masonry' ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                {extendedImages.map((image, idx) => (
                  <div 
                    key={image.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className="group relative break-inside-avoid rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
                  >
                    <img 
                      src={image.src}
                      alt={image.prompt}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs">{image.prompt}</span>
                          <div className="flex items-center gap-1 text-white/80">
                            <Heart size={12} />
                            <span className="text-xs">{image.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {extendedImages.map((image, idx) => (
                  <div 
                    key={image.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
                  >
                    <img 
                      src={image.src}
                      alt={image.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs truncate">{image.prompt}</span>
                          <div className="flex items-center gap-1 text-white/80">
                            <Heart size={12} />
                            <span className="text-xs">{image.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center">
          {/* Close */}
          <button 
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Navigation */}
          <button 
            onClick={handlePrevImage}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button 
            onClick={handleNextImage}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] px-16">
            <img 
              src={extendedImages[selectedImageIndex].src}
              alt={extendedImages[selectedImageIndex].prompt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">{extendedImages[selectedImageIndex].prompt}</p>
                <p className="text-white/60 text-sm">
                  {selectedImageIndex + 1} / {extendedImages.length} • {collection.author}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Heart size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Download size={18} />
                </Button>
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200" onClick={() => { setSelectedImageIndex(null); handleRecreateStyle(); }}>
                  <Sparkles size={16} className="mr-2" />
                  {language === 'vi' ? 'Bắt đầu' : 'Get Started'}
                </Button>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-xl max-w-[80vw] overflow-x-auto">
            {extendedImages.slice(0, 10).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  selectedImageIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {extendedImages.length > 10 && (
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs">
                +{extendedImages.length - 10}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
