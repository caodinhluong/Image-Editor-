import React, { useState } from 'react';
import { Upload, Sparkles, Download, X, Check, Loader2, Link2, FolderOpen, Image, FileWarning, RefreshCw } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useBrandKit } from '../../contexts/BrandKitContext';

// Google Drive icon component - Official colors
const GoogleDriveIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 87.3 78" width={size} height={size}>
    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
    <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 52.35c-.8 1.4-1.2 2.95-1.2 4.5h27.5l16.15-31.85z" fill="#00AC47"/>
    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85L73.55 76.8z" fill="#EA4335"/>
    <path d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.45-4.5 1.2L43.65 25z" fill="#00832D"/>
    <path d="M59.85 53H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2L59.85 53z" fill="#2684FC"/>
    <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28h27.45c0-1.55-.4-3.1-1.2-4.5l-12.7-22z" fill="#FFBA00"/>
  </svg>
);

interface BatchImage {
  id: string;
  file?: File;
  preview: string;
  name: string;
  source: 'local' | 'gdrive';
  status: 'pending' | 'processing' | 'done' | 'error';
  consistencyBefore?: number;
  consistencyAfter?: number;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;
  size: string;
}

export const BatchProcessor: React.FC = () => {
  const { activeBrandKit } = useBrandKit();
  const [images, setImages] = useState<BatchImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState(0);
  
  // Google Drive states
  const [uploadMode, setUploadMode] = useState<'select' | 'local' | 'gdrive'>('select');
  const [driveLink, setDriveLink] = useState('');
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<string[]>([]);
  const [driveError, setDriveError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    const newImages: BatchImage[] = files.map((file: File, index: number) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      source: 'local' as const,
      status: 'pending' as const,
      consistencyBefore: Math.floor(Math.random() * 30) + 60,
    }));
    setImages(prev => [...prev, ...newImages]);
    setUploadMode('select');
  };

  // Mock Google Drive folder scan
  const handleScanDriveFolder = async () => {
    if (!driveLink.trim()) {
      setDriveError('Please enter a Google Drive folder link');
      return;
    }

    // Validate link format
    if (!driveLink.includes('drive.google.com')) {
      setDriveError('Invalid Google Drive link. Please use a valid folder URL.');
      return;
    }

    setIsLoadingDrive(true);
    setDriveError(null);
    setDriveFiles([]);

    // Simulate API call to scan folder
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock files from Drive folder
    const mockFiles: DriveFile[] = [
      { id: 'gd-1', name: 'product_photo_001.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://picsum.photos/seed/gd1/200/200', size: '2.4 MB' },
      { id: 'gd-2', name: 'campaign_banner.png', mimeType: 'image/png', thumbnailLink: 'https://picsum.photos/seed/gd2/200/200', size: '1.8 MB' },
      { id: 'gd-3', name: 'social_post_summer.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://picsum.photos/seed/gd3/200/200', size: '3.1 MB' },
      { id: 'gd-4', name: 'hero_image_v2.png', mimeType: 'image/png', thumbnailLink: 'https://picsum.photos/seed/gd4/200/200', size: '4.2 MB' },
      { id: 'gd-5', name: 'instagram_carousel_1.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://picsum.photos/seed/gd5/200/200', size: '1.5 MB' },
      { id: 'gd-6', name: 'instagram_carousel_2.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://picsum.photos/seed/gd6/200/200', size: '1.6 MB' },
      { id: 'gd-7', name: 'email_header.png', mimeType: 'image/png', thumbnailLink: 'https://picsum.photos/seed/gd7/200/200', size: '890 KB' },
      { id: 'gd-8', name: 'presentation_slide.pdf', mimeType: 'application/pdf', thumbnailLink: '', size: '5.2 MB' }, // Non-image file
      { id: 'gd-9', name: 'brand_guidelines.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', thumbnailLink: '', size: '2.1 MB' }, // Non-image file
      { id: 'gd-10', name: 'product_lifestyle.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://picsum.photos/seed/gd10/200/200', size: '2.9 MB' },
    ];

    setDriveFiles(mockFiles);
    // Auto-select all image files
    const imageFiles = mockFiles.filter(f => f.mimeType.startsWith('image/')).map(f => f.id);
    setSelectedDriveFiles(imageFiles);
    setIsLoadingDrive(false);
  };

  const toggleDriveFileSelection = (fileId: string) => {
    setSelectedDriveFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleImportFromDrive = () => {
    const selectedFiles = driveFiles.filter(f => selectedDriveFiles.includes(f.id) && f.mimeType.startsWith('image/'));
    const newImages: BatchImage[] = selectedFiles.map((file, index) => ({
      id: `gdrive-${Date.now()}-${index}`,
      name: file.name,
      preview: file.thumbnailLink,
      source: 'gdrive' as const,
      status: 'pending' as const,
      consistencyBefore: Math.floor(Math.random() * 30) + 60,
    }));
    setImages(prev => [...prev, ...newImages]);
    setUploadMode('select');
    setDriveLink('');
    setDriveFiles([]);
    setSelectedDriveFiles([]);
  };

  const imageFilesCount = driveFiles.filter(f => f.mimeType.startsWith('image/')).length;
  const nonImageFilesCount = driveFiles.length - imageFilesCount;

  const handleProcessAll = async () => {
    if (!activeBrandKit) return;
    
    setIsProcessing(true);
    
    for (let i = 0; i < images.length; i++) {
      if (images[i].status === 'done') continue;
      
      setCurrentProcessing(i);
      
      // Update status to processing
      setImages(prev => prev.map((img, idx) => 
        idx === i ? { ...img, status: 'processing' as const } : img
      ));
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update to done with improved score
      setImages(prev => prev.map((img, idx) => 
        idx === i ? { 
          ...img, 
          status: 'done' as const,
          consistencyAfter: Math.floor(Math.random() * 10) + 90 // 90-100%
        } : img
      ));
    }
    
    setIsProcessing(false);
    setCurrentProcessing(0);
  };

  const handleExportAll = () => {
    // Mock export functionality
    alert(`Exporting ${images.filter(img => img.status === 'done').length} images...`);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const processedCount = images.filter(img => img.status === 'done').length;
  const averageConsistency = images.length > 0
    ? Math.round(images.reduce((sum, img) => sum + (img.consistencyAfter || img.consistencyBefore || 0), 0) / images.length)
    : 0;

  if (!activeBrandKit) {
    return (
      <div className="text-center py-12">
        <Upload size={48} className="text-zinc-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
          No Active Brand Kit
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select a brand kit to start batch processing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Batch Processing
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Apply brand style to multiple images at once
          </p>
        </div>
        <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-lg">
          PRO
        </div>
      </div>

      {/* Upload Area */}
      {images.length === 0 ? (
        <div className="space-y-4">
          {/* Upload Mode Selection */}
          {uploadMode === 'select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local Upload Option */}
              <button
                onClick={() => setUploadMode('local')}
                className="group relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 text-center hover:border-repix-400 dark:hover:border-repix-500 transition-all bg-white dark:bg-zinc-800/50"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-repix-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-repix-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-xl shadow-repix-500/20 group-hover:shadow-repix-500/40 group-hover:scale-105 transition-all">
                    <Upload size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    Upload from Device
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Select images from your computer
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <Image size={14} />
                    JPG, PNG, WEBP supported
                  </div>
                </div>
              </button>

              {/* Google Drive Option */}
              <button
                onClick={() => setUploadMode('gdrive')}
                className="group relative overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition-all bg-white dark:bg-zinc-800/50"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-600 flex items-center justify-center shadow-xl group-hover:shadow-green-500/20 group-hover:scale-105 group-hover:border-green-400 transition-all">
                    <GoogleDriveIcon size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    Import from Google Drive
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Connect a Drive folder to import images
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full text-xs font-medium text-green-600 dark:text-green-400">
                    <FolderOpen size={14} />
                    Auto-detect image files
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Local Upload Mode */}
          {uploadMode === 'local' && (
            <div className="space-y-4">
              <button
                onClick={() => setUploadMode('select')}
                className="text-sm text-zinc-500 hover:text-repix-500 flex items-center gap-1"
              >
                ← Back to options
              </button>
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-repix-400 dark:hover:border-repix-600 transition-colors cursor-pointer">
                  <Upload size={48} className="text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    Upload Multiple Images
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Select 10-100 images to process with brand style
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-repix-500 hover:bg-repix-600 text-white rounded-lg transition-colors">
                    <Upload size={16} />
                    <span className="text-sm font-medium">Choose Files</span>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Google Drive Mode */}
          {uploadMode === 'gdrive' && (
            <div className="space-y-4">
              <button
                onClick={() => { setUploadMode('select'); setDriveFiles([]); setDriveLink(''); setDriveError(null); }}
                className="text-sm text-zinc-500 hover:text-repix-500 flex items-center gap-1"
              >
                ← Back to options
              </button>

              {/* Drive Link Input */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                    <GoogleDriveIcon />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">Google Drive Folder</h3>
                    <p className="text-xs text-zinc-500">Paste a shared folder link to scan for images</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={driveLink}
                      onChange={(e) => { setDriveLink(e.target.value); setDriveError(null); }}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-repix-500 focus:border-transparent"
                    />
                  </div>
                  <Button
                    onClick={handleScanDriveFolder}
                    isLoading={isLoadingDrive}
                    disabled={isLoadingDrive || !driveLink.trim()}
                    className="px-6"
                  >
                    {isLoadingDrive ? 'Scanning...' : 'Scan Folder'}
                  </Button>
                </div>

                {driveError && (
                  <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                    <FileWarning size={16} />
                    {driveError}
                  </div>
                )}
              </div>

              {/* Drive Files List */}
              {driveFiles.length > 0 && (
                <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderOpen size={20} className="text-amber-500" />
                        <div>
                          <h4 className="font-bold text-zinc-900 dark:text-white">Folder Contents</h4>
                          <p className="text-xs text-zinc-500">
                            {imageFilesCount} images found • {nonImageFilesCount} other files (skipped)
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleScanDriveFolder}
                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Refresh"
                      >
                        <RefreshCw size={16} className="text-zinc-500" />
                      </button>
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {driveFiles.map((file) => {
                        const isImage = file.mimeType.startsWith('image/');
                        const isSelected = selectedDriveFiles.includes(file.id);
                        
                        return (
                          <button
                            key={file.id}
                            onClick={() => isImage && toggleDriveFileSelection(file.id)}
                            disabled={!isImage}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                              !isImage 
                                ? 'opacity-40 cursor-not-allowed border-zinc-200 dark:border-zinc-700' 
                                : isSelected 
                                  ? 'border-green-500 ring-2 ring-green-500/20' 
                                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                            }`}
                          >
                            {isImage ? (
                              <img
                                src={file.thumbnailLink}
                                alt={file.name}
                                className="w-full aspect-square object-cover"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <FileWarning size={24} className="text-zinc-400" />
                              </div>
                            )}
                            
                            {/* Selection Checkbox */}
                            {isImage && (
                              <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'bg-white/80 border-zinc-300'
                              }`}>
                                {isSelected && <Check size={12} className="text-white" />}
                              </div>
                            )}

                            {/* File Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                              <p className="text-[10px] text-white truncate">{file.name}</p>
                              <p className="text-[9px] text-zinc-400">{file.size}</p>
                            </div>

                            {/* Non-image badge */}
                            {!isImage && (
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-zinc-500 text-white text-[9px] rounded">
                                Not an image
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image size={16} className="text-green-500" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedDriveFiles.length} of {imageFilesCount} images selected
                      </span>
                    </div>
                    <Button
                      onClick={handleImportFromDrive}
                      disabled={selectedDriveFiles.length === 0}
                      className="gap-2"
                    >
                      <Download size={16} />
                      Import Selected ({selectedDriveFiles.length})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Images</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{images.length}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Processed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{processedCount}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Avg. Score</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{averageConsistency}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="bg-gradient-to-br from-repix-50 to-pink-50 dark:from-repix-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-repix-200 dark:border-repix-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-repix-900 dark:text-repix-100">
                  Processing Images...
                </span>
                <span className="text-sm font-bold text-repix-600 dark:text-repix-400">
                  {Math.round((currentProcessing / images.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-repix-200 dark:bg-repix-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-repix-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(currentProcessing / images.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-repix-700 dark:text-repix-300 mt-2">
                {currentProcessing} of {images.length} images • Estimated time: {Math.ceil((images.length - currentProcessing) * 1.5 / 60)} min
              </p>
            </div>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
              >
                <img
                  src={image.preview}
                  alt="Batch"
                  className="w-full aspect-square object-cover"
                />
                
                {/* Status Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute top-2 right-2">
                    {image.status === 'pending' && (
                      <div className="w-6 h-6 bg-zinc-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">⏳</span>
                      </div>
                    )}
                    {image.status === 'processing' && (
                      <div className="w-6 h-6 bg-repix-500 rounded-full flex items-center justify-center animate-spin">
                        <Loader2 size={14} className="text-white" />
                      </div>
                    )}
                    {image.status === 'done' && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} className="text-white" />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2">
                    {image.consistencyAfter ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 line-through">{image.consistencyBefore}%</span>
                        <span className="text-green-400 font-bold">{image.consistencyAfter}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400">{image.consistencyBefore}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="aspect-square border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center hover:border-repix-400 dark:hover:border-repix-600 transition-colors">
                <Upload size={24} className="text-zinc-400 mb-2" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Add More</span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleProcessAll}
              isLoading={isProcessing}
              disabled={isProcessing || processedCount === images.length}
              className="flex-1 gap-2"
            >
              <Sparkles size={16} />
              {isProcessing ? 'Processing...' : 'Apply Brand Style to All'}
            </Button>
            <Button
              onClick={handleExportAll}
              variant="secondary"
              disabled={processedCount === 0}
              className="gap-2"
            >
              <Download size={16} />
              Export All ({processedCount})
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
