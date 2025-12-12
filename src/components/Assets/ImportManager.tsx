import React, { useState, useRef, useCallback } from 'react';
import {
  X, Upload, Image, Link2, Cloud, FolderUp, CheckCircle2,
  AlertCircle, Loader2, Trash2, RotateCcw, ChevronRight, Globe,
  HardDrive, Smartphone, Camera, CloudCog
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { GoogleDrivePicker } from './GoogleDrivePicker';

interface ImportManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (files: ImportedFile[]) => void;
}

interface ImportedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  thumbnail: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  source: 'local' | 'url' | 'cloud';
}

interface ImportSource {
  id: string;
  name: string;
  nameVi: string;
  icon: React.ElementType;
  color: string;
  connected?: boolean;
}

export const ImportManager: React.FC<ImportManagerProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'cloud'>('upload');
  const [files, setFiles] = useState<ImportedFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showGoogleDrivePicker, setShowGoogleDrivePicker] = useState(false);

  const cloudSources: ImportSource[] = [
    { id: 'google-drive', name: 'Google Drive', nameVi: 'Google Drive', icon: Cloud, color: 'text-blue-500', connected: true },
    { id: 'dropbox', name: 'Dropbox', nameVi: 'Dropbox', icon: CloudCog, color: 'text-blue-600', connected: false },
    { id: 'figma', name: 'Figma', nameVi: 'Figma', icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>, color: 'text-purple-500', connected: true },
    { id: 'instagram', name: 'Instagram', nameVi: 'Instagram', icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, color: 'text-pink-500', connected: false },
  ];

  const addFiles = useCallback((newFiles: File[]) => {
    const importedFiles: ImportedFile[] = newFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      thumbnail: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0,
      source: 'local' as const,
    }));
    setFiles(prev => [...prev, ...importedFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    addFiles(droppedFiles);
  }, [addFiles]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      addFiles(selectedFiles);
    }
  };

  const handleUrlImport = () => {
    if (!urlInput.trim()) return;
    
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
    setFiles(prev => [...prev, newFile]);
    setUrlInput('');
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryFile = (id: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'pending', progress: 0, error: undefined } : f
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleStartUpload = async () => {
    setIsUploading(true);
    
    // Simulate upload for each file
    for (const file of files) {
      if (file.status !== 'pending') continue;
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading' } : f
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }

      // Random success/error for demo
      const success = Math.random() > 0.1;
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: success ? 'success' : 'error', error: success ? undefined : 'Upload failed' } 
          : f
      ));
    }

    setIsUploading(false);
  };

  const handleComplete = () => {
    const successFiles = files.filter(f => f.status === 'success');
    onImportComplete?.(successFiles);
    setFiles([]);
    onClose();
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <Upload size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Import ảnh' : 'Import Images'}
              </h2>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Tải lên ảnh từ máy tính hoặc nguồn khác' : 'Upload images from your computer or other sources'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          {[
            { id: 'upload', icon: HardDrive, label: language === 'vi' ? 'Từ máy tính' : 'From Computer' },
            { id: 'url', icon: Link2, label: language === 'vi' ? 'Từ URL' : 'From URL' },
            { id: 'cloud', icon: Cloud, label: language === 'vi' ? 'Từ Cloud' : 'From Cloud' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-repix-600 dark:text-repix-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-repix-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-repix-500 bg-repix-50 dark:bg-repix-900/20'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-repix-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-4 rounded-full ${isDragging ? 'bg-repix-100 dark:bg-repix-900/30' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    <FolderUp size={32} className={isDragging ? 'text-repix-500' : 'text-zinc-400'} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {language === 'vi' ? 'Kéo thả ảnh vào đây' : 'Drag and drop images here'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {language === 'vi' ? 'hoặc click để chọn file' : 'or click to select files'}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400">
                    PNG, JPG, WEBP, GIF • Max 50MB
                  </p>
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
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={language === 'vi' ? 'Dán URL ảnh vào đây...' : 'Paste image URL here...'}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-repix-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
                  />
                </div>
                <Button onClick={handleUrlImport} disabled={!urlInput.trim()}>
                  {language === 'vi' ? 'Thêm' : 'Add'}
                </Button>
              </div>
              <p className="text-xs text-zinc-500">
                {language === 'vi' 
                  ? 'Hỗ trợ URL trực tiếp đến file ảnh (PNG, JPG, WEBP, GIF)'
                  : 'Supports direct URLs to image files (PNG, JPG, WEBP, GIF)'}
              </p>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="grid grid-cols-2 gap-3">
              {cloudSources.map(source => (
                <button
                  key={source.id}
                  onClick={() => {
                    if (source.id === 'google-drive' && source.connected) {
                      setShowGoogleDrivePicker(true);
                    }
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    source.connected
                      ? 'border-zinc-200 dark:border-zinc-700 hover:border-repix-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer'
                      : 'border-zinc-200 dark:border-zinc-700 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 ${source.color}`}>
                    {typeof source.icon === 'function' ? <source.icon /> : <source.icon size={20} />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {language === 'vi' ? source.nameVi : source.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {source.connected 
                        ? (language === 'vi' ? 'Đã kết nối' : 'Connected')
                        : (language === 'vi' ? 'Chưa kết nối' : 'Not connected')
                      }
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400" />
                </button>
              ))}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Danh sách file' : 'File List'} ({files.length})
                </h3>
                {files.length > 0 && (
                  <button 
                    onClick={() => setFiles([])}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    {language === 'vi' ? 'Xóa tất cả' : 'Clear all'}
                  </button>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0">
                      <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{formatFileSize(file.size)}</span>
                        {file.status === 'uploading' && (
                          <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-repix-500 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {file.status === 'pending' && (
                        <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400 text-[10px]">
                          {language === 'vi' ? 'Chờ' : 'Pending'}
                        </Badge>
                      )}
                      {file.status === 'uploading' && (
                        <Loader2 size={16} className="text-repix-500 animate-spin" />
                      )}
                      {file.status === 'success' && (
                        <CheckCircle2 size={16} className="text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <div className="flex items-center gap-1">
                          <AlertCircle size={16} className="text-red-500" />
                          <button onClick={() => retryFile(file.id)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
                            <RotateCcw size={14} className="text-zinc-500" />
                          </button>
                        </div>
                      )}
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                      >
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
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              {files.length > 0 && (
                <>
                  <span>{pendingCount} {language === 'vi' ? 'chờ xử lý' : 'pending'}</span>
                  {successCount > 0 && (
                    <span className="text-green-500">{successCount} {language === 'vi' ? 'thành công' : 'success'}</span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-red-500">{errorCount} {language === 'vi' ? 'lỗi' : 'failed'}</span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              {successCount > 0 && !isUploading ? (
                <Button onClick={handleComplete} className="bg-gradient-to-r from-repix-500 to-pink-500">
                  {language === 'vi' ? `Hoàn tất (${successCount})` : `Done (${successCount})`}
                </Button>
              ) : (
                <Button 
                  onClick={handleStartUpload}
                  disabled={pendingCount === 0 || isUploading}
                  className="bg-gradient-to-r from-repix-500 to-pink-500"
                >
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Drive Picker Modal */}
      <GoogleDrivePicker
        isOpen={showGoogleDrivePicker}
        onClose={() => setShowGoogleDrivePicker(false)}
        onSelect={(driveFiles) => {
          const importedFiles: ImportedFile[] = driveFiles.map(file => ({
            id: `drive-${file.id}`,
            name: file.name,
            size: file.size || 0,
            type: file.mimeType,
            thumbnail: file.thumbnailUrl || '',
            status: 'pending' as const,
            progress: 0,
            source: 'cloud' as const,
          }));
          setFiles(prev => [...prev, ...importedFiles]);
          setShowGoogleDrivePicker(false);
        }}
      />
    </div>
  );
};
