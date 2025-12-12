import React, { useState } from 'react';
import {
  X, Link2, CheckCircle2, AlertCircle, Loader2, Trash2, Plus,
  ExternalLink, FolderOpen, Image, FileImage, Info, Copy, Check,
  Eye, ZoomIn, Grid3X3, LayoutList, Sparkles
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface GoogleDrivePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (files: DriveFile[]) => void;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  thumbnailUrl?: string;
  modifiedTime: string;
}

interface ParsedLink {
  id: string;
  url: string;
  type: 'file' | 'folder' | 'unknown';
  fileId: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  name?: string;
  thumbnail?: string;
  error?: string;
}

const parseGoogleDriveLink = (url: string): { type: 'file' | 'folder' | 'unknown'; fileId: string } | null => {
  try {
    const filePatterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/,
    ];
    const folderPattern = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;

    for (const pattern of filePatterns) {
      const match = url.match(pattern);
      if (match) return { type: 'file', fileId: match[1] };
    }

    const folderMatch = url.match(folderPattern);
    if (folderMatch) return { type: 'folder', fileId: folderMatch[1] };

    return null;
  } catch {
    return null;
  }
};

export const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const { language } = useLanguage();
  const [linkInput, setLinkInput] = useState('');
  const [parsedLinks, setParsedLinks] = useState<ParsedLink[]>([]);
  const [previewImage, setPreviewImage] = useState<ParsedLink | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedForImport, setSelectedForImport] = useState<Set<string>>(new Set());

  const successLinks = parsedLinks.filter(l => l.status === 'success');
  const successCount = successLinks.length;
  const errorCount = parsedLinks.filter(l => l.status === 'error').length;
  const loadingCount = parsedLinks.filter(l => l.status === 'loading').length;

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const parsed = parseGoogleDriveLink(linkInput);
    
    if (!parsed) {
      const newLink: ParsedLink = {
        id: `link-${Date.now()}`,
        url: linkInput,
        type: 'unknown',
        fileId: '',
        status: 'error',
        error: language === 'vi' ? 'Link không hợp lệ' : 'Invalid link',
      };
      setParsedLinks(prev => [...prev, newLink]);
    } else {
      const newLink: ParsedLink = {
        id: `link-${Date.now()}`,
        url: linkInput,
        type: parsed.type,
        fileId: parsed.fileId,
        status: 'loading',
      };
      setParsedLinks(prev => [...prev, newLink]);

      setTimeout(() => {
        const mockNames = ['product-banner.png', 'hero-image.jpg', 'marketing-asset.webp', 'social-media-post.png', 'brand-logo.svg'];
        const mockThumbnails = [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
          'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200',
          'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200',
          'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
        ];
        
        setParsedLinks(prev => prev.map(link => {
          if (link.id === newLink.id) {
            return {
              ...link,
              status: 'success' as const,
              name: mockNames[Math.floor(Math.random() * mockNames.length)],
              thumbnail: mockThumbnails[Math.floor(Math.random() * mockThumbnails.length)],
            };
          }
          return link;
        }));
        setSelectedForImport(prev => new Set([...prev, newLink.id]));
      }, 1500);
    }
    setLinkInput('');
  };

  const handleRemoveLink = (id: string) => {
    setParsedLinks(prev => prev.filter(link => link.id !== id));
    setSelectedForImport(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLinkInput(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const handleImport = () => {
    const linksToImport = parsedLinks.filter(link => link.status === 'success' && selectedForImport.has(link.id));
    const files: DriveFile[] = linksToImport.map(link => ({
      id: link.fileId,
      name: link.name || 'Untitled',
      mimeType: 'image/jpeg',
      thumbnailUrl: link.thumbnail,
      modifiedTime: new Date().toISOString(),
    }));
    onSelect(files);
    setParsedLinks([]);
    setSelectedForImport(new Set());
    onClose();
  };

  const toggleSelectForImport = (id: string) => {
    setSelectedForImport(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAllSuccess = () => setSelectedForImport(new Set(successLinks.map(l => l.id)));
  const deselectAll = () => setSelectedForImport(new Set());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-green-500 to-blue-500 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M7.71 3.5L1.15 15l3.43 5.99h6.56l-3.43-6L12 8.01 7.71 3.5zm8.58 0L12 8.01l4.29 6.99-3.43 6h6.56L22.85 15l-6.56-11.5z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Google Drive</h2>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Dán link chia sẻ từ Google Drive' : 'Paste share links from Google Drive'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <div className="p-4 space-y-4">
            {/* Input Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {language === 'vi' ? 'Dán link Google Drive' : 'Paste Google Drive Link'}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                  />
                </div>
                <Button variant="outline" onClick={handlePaste} className="px-3 gap-1.5">
                  <Copy size={14} />
                  {language === 'vi' ? 'Dán' : 'Paste'}
                </Button>
                <Button onClick={handleAddLink} disabled={!linkInput.trim()} className="px-3 gap-1.5 bg-blue-500 hover:bg-blue-600">
                  <Plus size={14} />
                  {language === 'vi' ? 'Thêm' : 'Add'}
                </Button>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">{language === 'vi' ? 'Hỗ trợ các định dạng link:' : 'Supported link formats:'}</p>
                <ul className="space-y-0.5 text-blue-600 dark:text-blue-400">
                  <li>• drive.google.com/file/d/[FILE_ID]/view</li>
                  <li>• drive.google.com/open?id=[FILE_ID]</li>
                  <li>• drive.google.com/drive/folders/[FOLDER_ID]</li>
                </ul>
              </div>
            </div>

            {/* Links List */}
            {parsedLinks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {language === 'vi' ? 'Danh sách link' : 'Link List'} ({parsedLinks.length})
                  </h3>
                  <button onClick={() => { setParsedLinks([]); setSelectedForImport(new Set()); }} className="text-xs text-red-500 hover:text-red-600">
                    {language === 'vi' ? 'Xóa tất cả' : 'Clear all'}
                  </button>
                </div>

                <div className="space-y-2">
                  {parsedLinks.map(link => (
                    <div
                      key={link.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        link.status === 'error' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                        : link.status === 'success' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center">
                        {link.status === 'loading' ? <Loader2 size={18} className="text-blue-500 animate-spin" />
                        : link.status === 'success' && link.thumbnail ? <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                        : link.type === 'folder' ? <FolderOpen size={18} className="text-yellow-500" />
                        : link.status === 'error' ? <AlertCircle size={18} className="text-red-500" />
                        : <FileImage size={18} className="text-zinc-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {link.status === 'success' && link.name ? link.name 
                          : link.status === 'error' ? link.error
                          : link.status === 'loading' ? (language === 'vi' ? 'Đang tải...' : 'Loading...')
                          : link.url}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {link.type !== 'unknown' && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              link.type === 'file' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                            }`}>{link.type === 'file' ? 'File' : 'Folder'}</span>
                          )}
                          <span className="text-[10px] text-zinc-500 truncate">{link.fileId ? `ID: ${link.fileId.substring(0, 10)}...` : ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {link.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                        {link.status === 'loading' && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink size={12} className="text-zinc-400" />
                        </a>
                        <button onClick={() => handleRemoveLink(link.id)} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg">
                          <Trash2 size={12} className="text-zinc-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {parsedLinks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                  <Image size={24} className="text-zinc-400" />
                </div>
                <p className="text-sm text-zinc-500">
                  {language === 'vi' ? 'Dán link Google Drive để bắt đầu' : 'Paste Google Drive links to start'}
                </p>
              </div>
            )}

            {/* Preview Gallery */}
            {successLinks.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-green-500" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {language === 'vi' ? 'Ảnh từ Google Drive' : 'Images from Google Drive'}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                      {successLinks.length} {language === 'vi' ? 'ảnh' : 'images'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedForImport.size === successLinks.length ? (
                      <button onClick={deselectAll} className="text-[10px] text-zinc-500 hover:text-zinc-700">{language === 'vi' ? 'Bỏ chọn' : 'Deselect'}</button>
                    ) : (
                      <button onClick={selectAllSuccess} className="text-[10px] text-blue-500 hover:text-blue-600">{language === 'vi' ? 'Chọn tất cả' : 'Select all'}</button>
                    )}
                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                      <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}>
                        <Grid3X3 size={12} className={viewMode === 'grid' ? 'text-blue-500' : 'text-zinc-500'} />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm' : ''}`}>
                        <LayoutList size={12} className={viewMode === 'list' ? 'text-blue-500' : 'text-zinc-500'} />
                      </button>
                    </div>
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-4 gap-2">
                    {successLinks.map(link => (
                      <div
                        key={link.id}
                        onClick={() => toggleSelectForImport(link.id)}
                        className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedForImport.has(link.id) ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-zinc-300'
                        }`}
                      >
                        <img src={link.thumbnail} alt={link.name} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${selectedForImport.has(link.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${selectedForImport.has(link.id) ? 'bg-blue-500' : 'border-2 border-white/70 bg-black/20 opacity-0 group-hover:opacity-100'}`}>
                          {selectedForImport.has(link.id) && <Check size={12} className="text-white" />}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setPreviewImage(link); }} className="absolute top-1.5 left-1.5 p-1 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-black/70">
                          <ZoomIn size={12} className="text-white" />
                        </button>
                        <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-white font-medium truncate opacity-0 group-hover:opacity-100">{link.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {successLinks.map(link => (
                      <div
                        key={link.id}
                        onClick={() => toggleSelectForImport(link.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
                          selectedForImport.has(link.id) ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : 'bg-zinc-50 dark:bg-zinc-800/50 border border-transparent hover:bg-zinc-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${selectedForImport.has(link.id) ? 'bg-blue-500' : 'border-2 border-zinc-300'}`}>
                          {selectedForImport.has(link.id) && <Check size={10} className="text-white" />}
                        </div>
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                          <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{link.name}</p>
                          <p className="text-[10px] text-zinc-500">Google Drive</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setPreviewImage(link); }} className="p-1.5 hover:bg-zinc-200 rounded-lg">
                          <Eye size={14} className="text-zinc-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              {loadingCount > 0 && <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" />{loadingCount} {language === 'vi' ? 'đang xử lý' : 'processing'}</span>}
              {successCount > 0 && <span className="text-green-500 flex items-center gap-1"><Check size={10} />{successCount} {language === 'vi' ? 'sẵn sàng' : 'ready'}</span>}
              {selectedForImport.size > 0 && <span className="text-blue-600 font-medium flex items-center gap-1"><CheckCircle2 size={10} />{selectedForImport.size} {language === 'vi' ? 'đã chọn' : 'selected'}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>{language === 'vi' ? 'Hủy' : 'Cancel'}</Button>
              <Button onClick={handleImport} disabled={selectedForImport.size === 0 || loadingCount > 0} className="bg-blue-500 hover:bg-blue-600 px-5">
                Import ({selectedForImport.size})
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewImage && (
          <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setPreviewImage(null)}>
            <button onClick={() => setPreviewImage(null)} className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20">
              <X size={20} className="text-white" />
            </button>
            <div className="max-w-full max-h-full text-center" onClick={(e) => e.stopPropagation()}>
              <img src={previewImage.thumbnail?.replace('w=200', 'w=800')} alt={previewImage.name} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl mx-auto" />
              <p className="text-white font-medium mt-3">{previewImage.name}</p>
              <p className="text-white/60 text-sm">{language === 'vi' ? 'Từ Google Drive' : 'From Google Drive'}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Button variant="outline" size="sm" className="gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => window.open(previewImage.url, '_blank')}>
                  <ExternalLink size={12} />{language === 'vi' ? 'Mở trong Drive' : 'Open in Drive'}
                </Button>
                <Button size="sm" className="gap-1.5 bg-blue-500 hover:bg-blue-600" onClick={() => { toggleSelectForImport(previewImage.id); setPreviewImage(null); }}>
                  {selectedForImport.has(previewImage.id) ? <><Check size={12} />{language === 'vi' ? 'Đã chọn' : 'Selected'}</> : <><Plus size={12} />{language === 'vi' ? 'Chọn' : 'Select'}</>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(155, 155, 155, 0.5); }
      `}</style>
    </div>
  );
};
