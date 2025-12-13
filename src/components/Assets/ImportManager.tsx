import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image,
  Link2,
  FolderUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RotateCcw,
  Globe,
  HardDrive,
  Smartphone,
  Camera,
  ShoppingBag,
  Package,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ImagePlus,
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ImportManagerProps {
  onBack: () => void;
  onImportComplete?: (files: ImportedFile[]) => void;
}

export interface ImportedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  thumbnail: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  source: 'local' | 'url' | 'ecommerce';
  productInfo?: {
    platform: string;
    productName: string;
    price?: string;
  };
}

interface EcommercePlatform {
  id: string;
  name: string;
  domain: string[];
  icon: string;
  color: string;
}

const ecommercePlatforms: EcommercePlatform[] = [
  { id: 'shopee', name: 'Shopee', domain: ['shopee.vn', 'shopee.com'], icon: '🛒', color: 'bg-orange-500' },
  { id: 'lazada', name: 'Lazada', domain: ['lazada.vn', 'lazada.com'], icon: '🛍️', color: 'bg-blue-600' },
  { id: 'tiki', name: 'Tiki', domain: ['tiki.vn'], icon: '📦', color: 'bg-blue-500' },
  { id: 'amazon', name: 'Amazon', domain: ['amazon.com', 'amazon.co'], icon: '📦', color: 'bg-amber-500' },
  { id: 'alibaba', name: 'Alibaba', domain: ['alibaba.com', '1688.com'], icon: '🏭', color: 'bg-orange-600' },
  { id: 'taobao', name: 'Taobao', domain: ['taobao.com', 'tmall.com'], icon: '🛒', color: 'bg-red-500' },
];

export const ImportManager: React.FC<ImportManagerProps> = ({ onBack, onImportComplete }) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [files, setFiles] = useState<ImportedFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<EcommercePlatform | null>(null);


  const detectPlatform = (url: string): EcommercePlatform | null => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      return ecommercePlatforms.find((p) => p.domain.some((d) => hostname.includes(d))) || null;
    } catch {
      return null;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    setDetectedPlatform(detectPlatform(value));
  };

  const addFiles = useCallback((newFiles: File[]) => {
    const importedFiles: ImportedFile[] = newFiles.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      thumbnail: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0,
      source: 'local' as const,
    }));
    setFiles((prev) => [...prev, ...importedFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
      addFiles(droppedFiles);
    },
    [addFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith('image/'));
      addFiles(selectedFiles);
    }
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim()) return;

    const platform = detectPlatform(urlInput);

    if (platform) {
      setIsAnalyzingUrl(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockImages = [
        { name: 'product_main.jpg', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { name: 'product_angle_1.jpg', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
        { name: 'product_angle_2.jpg', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400' },
        { name: 'product_detail.jpg', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400' },
      ];

      const newFiles: ImportedFile[] = mockImages.map((img, idx) => ({
        id: `ecom-${Date.now()}-${idx}`,
        name: img.name,
        size: Math.floor(Math.random() * 3000000) + 500000,
        type: 'image/jpeg',
        thumbnail: img.thumbnail,
        status: 'pending',
        progress: 0,
        source: 'ecommerce',
        productInfo: { platform: platform.name, productName: 'Nike Air Max 270', price: '2,500,000₫' },
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      setIsAnalyzingUrl(false);
    } else {
      const newFile: ImportedFile = {
        id: `url-${Date.now()}`,
        name: urlInput.split('/').pop() || 'imported-image',
        size: 0,
        type: 'image/jpeg',
        thumbnail: urlInput,
        status: 'pending',
        progress: 0,
        source: 'url',
      };
      setFiles((prev) => [...prev, newFile]);
    }
    setUrlInput('');
    setDetectedPlatform(null);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const retryFile = (id: string) => setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'pending', progress: 0, error: undefined } : f)));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleStartUpload = async () => {
    setIsUploading(true);
    for (const file of files) {
      if (file.status !== 'pending') continue;
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: 'uploading' } : f)));
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 80));
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress } : f)));
      }
      const success = Math.random() > 0.05;
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: success ? 'success' : 'error', error: success ? undefined : 'Upload failed' } : f))
      );
    }
    setIsUploading(false);
    setShowSuccessScreen(true);
  };

  const handleComplete = () => {
    const successFiles = files.filter((f) => f.status === 'success');
    onImportComplete?.(successFiles);
    setFiles([]);
    setShowSuccessScreen(false);
    onBack();
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;


  // Success Screen
  if (showSuccessScreen && successCount > 0) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Back */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4">
            <ArrowLeft size={16} />
            {language === 'vi' ? 'Quay lại' : 'Back'}
          </button>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle2 size={48} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Upload thành công!' : 'Upload Successful!'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              {language === 'vi' ? `${successCount} ảnh đã được tải lên thành công` : `${successCount} images have been uploaded successfully`}
            </p>

            {/* Preview Grid */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {files
                .filter((f) => f.status === 'success')
                .slice(0, 8)
                .map((file, idx) => (
                  <div key={file.id} className="relative">
                    <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-2 ring-green-500/30">
                      <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check size={12} className="text-white" />
                    </div>
                    {idx === 7 && successCount > 8 && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">+{successCount - 8}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{successCount}</p>
                <p className="text-xs text-zinc-500">{language === 'vi' ? 'Thành công' : 'Successful'}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {(files.filter((f) => f.status === 'success').reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className="text-xs text-zinc-500">{language === 'vi' ? 'Tổng dung lượng' : 'Total Size'}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{errorCount}</p>
                <p className="text-xs text-zinc-500">{language === 'vi' ? 'Thất bại' : 'Failed'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccessScreen(false);
                  setFiles([]);
                }}
                className="gap-2"
              >
                <ImagePlus size={16} />
                {language === 'vi' ? 'Upload thêm' : 'Upload More'}
              </Button>
              <Button onClick={handleComplete} className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                {language === 'vi' ? 'Hoàn tất' : 'Done'}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4">
          <ArrowLeft size={16} />
          {language === 'vi' ? 'Quay lại' : 'Back'}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Upload size={24} className="text-repix-500" />
              {language === 'vi' ? 'Import ảnh mới' : 'Import New Images'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {language === 'vi' ? 'Tải lên ảnh từ máy tính hoặc link sản phẩm' : 'Upload images from computer or product links'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6">
        {[
          { id: 'upload', icon: HardDrive, label: language === 'vi' ? 'Từ máy tính' : 'From Computer' },
          { id: 'url', icon: Link2, label: language === 'vi' ? 'Từ Link / URL' : 'From Link / URL' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'upload' | 'url')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-repix-600 dark:text-repix-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-repix-500" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-repix-500 bg-repix-50 dark:bg-repix-900/20'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-repix-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
              <div className="flex flex-col items-center gap-4">
                <div className={`p-5 rounded-full ${isDragging ? 'bg-repix-100 dark:bg-repix-900/30' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                  <FolderUp size={40} className={isDragging ? 'text-repix-500' : 'text-zinc-400'} />
                </div>
                <div>
                  <p className="text-base font-medium text-zinc-900 dark:text-white">
                    {language === 'vi' ? 'Kéo thả ảnh vào đây' : 'Drag and drop images here'}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">{language === 'vi' ? 'hoặc click để chọn file' : 'or click to select files'}</p>
                </div>
                <p className="text-xs text-zinc-400">PNG, JPG, WEBP, GIF • Max 50MB</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Image size={14} />
                {language === 'vi' ? 'Chọn ảnh' : 'Select Images'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera size={14} />
                {language === 'vi' ? 'Chụp màn hình' : 'Screenshot'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Smartphone size={14} />
                {language === 'vi' ? 'Từ điện thoại' : 'From Phone'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="space-y-4">
            {/* URL Input */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={language === 'vi' ? 'Dán link sản phẩm hoặc URL ảnh...' : 'Paste product link or image URL...'}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-repix-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
                  />
                </div>
                <Button onClick={handleUrlImport} disabled={!urlInput.trim() || isAnalyzingUrl} className="px-6">
                  {isAnalyzingUrl ? <Loader2 size={16} className="animate-spin" /> : language === 'vi' ? 'Thêm' : 'Add'}
                </Button>
              </div>

              {/* Platform Detection */}
              {detectedPlatform && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in slide-in-from-top-2">
                  <div className={`w-8 h-8 ${detectedPlatform.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {detectedPlatform.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      {language === 'vi' ? `Phát hiện link ${detectedPlatform.name}` : `${detectedPlatform.name} link detected`}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      {language === 'vi' ? 'Sẽ tự động lấy tất cả ảnh sản phẩm' : 'Will automatically fetch all product images'}
                    </p>
                  </div>
                  <Sparkles size={16} className="text-green-500" />
                </div>
              )}
            </div>

            {/* Supported Platforms */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                <ShoppingBag size={14} />
                {language === 'vi' ? 'Hỗ trợ lấy ảnh từ các sàn TMĐT:' : 'Supported e-commerce platforms:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {ecommercePlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-zinc-700 rounded-lg border border-zinc-200 dark:border-zinc-600"
                  >
                    <span>{platform.icon}</span>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{platform.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-3">
                {language === 'vi'
                  ? '💡 Dán link sản phẩm để tự động lấy tất cả ảnh. Hoặc dán trực tiếp URL ảnh (PNG, JPG, WEBP, GIF)'
                  : '💡 Paste product link to auto-fetch all images. Or paste direct image URL (PNG, JPG, WEBP, GIF)'}
              </p>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Danh sách file' : 'File List'} ({files.length})
              </h3>
              <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-600">
                {language === 'vi' ? 'Xóa tất cả' : 'Clear all'}
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 relative">
                    <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    {file.source === 'ecommerce' && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-orange-500 rounded-tl-lg flex items-center justify-center">
                        <Package size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500">{formatFileSize(file.size)}</span>
                      {file.productInfo && (
                        <Badge className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-[10px]">
                          {file.productInfo.platform}
                        </Badge>
                      )}
                      {file.status === 'uploading' && (
                        <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full bg-repix-500 rounded-full transition-all" style={{ width: `${file.progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'pending' && (
                      <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400 text-[10px]">
                        {language === 'vi' ? 'Chờ' : 'Pending'}
                      </Badge>
                    )}
                    {file.status === 'uploading' && <Loader2 size={16} className="text-repix-500 animate-spin" />}
                    {file.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                    {file.status === 'error' && (
                      <div className="flex items-center gap-1">
                        <AlertCircle size={16} className="text-red-500" />
                        <button onClick={() => retryFile(file.id)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
                          <RotateCcw size={14} className="text-zinc-500" />
                        </button>
                      </div>
                    )}
                    <button onClick={() => removeFile(file.id)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
                      <Trash2 size={14} className="text-zinc-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {files.length > 0 && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>{pendingCount} {language === 'vi' ? 'chờ xử lý' : 'pending'}</span>
              {successCount > 0 && <span className="text-green-500">{successCount} {language === 'vi' ? 'thành công' : 'success'}</span>}
              {errorCount > 0 && <span className="text-red-500">{errorCount} {language === 'vi' ? 'lỗi' : 'failed'}</span>}
            </div>
            <Button onClick={handleStartUpload} disabled={pendingCount === 0 || isUploading} className="bg-gradient-to-r from-repix-500 to-pink-500">
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {language === 'vi' ? 'Đang tải...' : 'Uploading...'}
                </span>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  {language === 'vi' ? `Tải lên (${pendingCount})` : `Upload (${pendingCount})`}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
