import React, { useState, useEffect } from 'react';
import {
  X, Smartphone, QrCode, Check, RefreshCw, Wifi, Shield, 
  Download, Image, CheckCircle2, Loader2, Apple, Play,
  ChevronRight, Camera, Upload, Trash2, CheckSquare, Square
} from 'lucide-react';
import { Button, Badge, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface PhoneSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: (deviceName: string, photosCount: number) => void;
}

type SyncStatus = 'waiting' | 'connecting' | 'selecting' | 'syncing' | 'success';

interface PhonePhoto {
  id: string;
  src: string;
  name: string;
  date: string;
  size: string;
  selected: boolean;
}

// Mock photos from phone
const mockPhonePhotos: PhonePhoto[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', name: 'IMG_001.jpg', date: 'Hôm nay', size: '2.4 MB', selected: false },
  { id: '2', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', name: 'IMG_002.jpg', date: 'Hôm nay', size: '1.8 MB', selected: false },
  { id: '3', src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop', name: 'IMG_003.jpg', date: 'Hôm qua', size: '3.1 MB', selected: false },
  { id: '4', src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop', name: 'IMG_004.jpg', date: 'Hôm qua', size: '2.2 MB', selected: false },
  { id: '5', src: 'https://images.unsplash.com/photo-1491553895911-0055uj6e?w=200&h=200&fit=crop', name: 'IMG_005.jpg', date: '2 ngày trước', size: '1.5 MB', selected: false },
  { id: '6', src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', name: 'IMG_006.jpg', date: '2 ngày trước', size: '2.8 MB', selected: false },
  { id: '7', src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop', name: 'IMG_007.jpg', date: '3 ngày trước', size: '1.9 MB', selected: false },
  { id: '8', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop', name: 'IMG_008.jpg', date: '3 ngày trước', size: '2.1 MB', selected: false },
];

export const PhoneSyncModal: React.FC<PhoneSyncModalProps> = ({ isOpen, onClose, onSyncComplete }) => {
  const { language } = useLanguage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('waiting');
  const [syncProgress, setSyncProgress] = useState(0);
  const [sessionCode, setSessionCode] = useState('');
  const [photos, setPhotos] = useState<PhonePhoto[]>(mockPhonePhotos);


  const selectedCount = photos.filter(p => p.selected).length;

  useEffect(() => {
    if (isOpen) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setSessionCode(code);
      setSyncStatus('waiting');
      setSyncProgress(0);
      setPhotos(mockPhonePhotos.map(p => ({ ...p, selected: false })));
    }
  }, [isOpen]);

  const handleRefreshCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
  };

  const togglePhotoSelection = (id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => {
    setPhotos(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setPhotos(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const simulateConnect = () => {
    setSyncStatus('connecting');
    setTimeout(() => {
      setSyncStatus('selecting');
    }, 2000);
  };

  const startSync = () => {
    if (selectedCount === 0) return;
    setSyncStatus('syncing');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setSyncStatus('success');
        // Call callback when sync completes
        onSyncComplete?.('iPhone 15 Pro', selectedCount);
      }
      setSyncProgress(Math.min(progress, 100));
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-repix-500/5 to-pink-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center shadow-lg shadow-repix-500/30">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Đồng bộ từ điện thoại' : 'Sync from Phone'}
              </h2>
              <p className="text-sm text-zinc-500">
                {syncStatus === 'waiting' && (language === 'vi' ? 'Quét mã QR để kết nối' : 'Scan QR code to connect')}
                {syncStatus === 'connecting' && (language === 'vi' ? 'Đang kết nối...' : 'Connecting...')}
                {syncStatus === 'selecting' && (language === 'vi' ? 'Chọn ảnh để tải lên' : 'Select photos to upload')}
                {syncStatus === 'syncing' && (language === 'vi' ? 'Đang tải lên...' : 'Uploading...')}
                {syncStatus === 'success' && (language === 'vi' ? 'Hoàn tất!' : 'Complete!')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          
          {/* WAITING STATE - QR Code + Phone Mockup */}
          {syncStatus === 'waiting' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left: QR Code */}
                <div className="flex flex-col items-center">
                  <div className="relative p-5 bg-white rounded-3xl shadow-xl mb-4 border border-zinc-100">
                    {/* QR Code */}
                    <div className="w-48 h-48 bg-zinc-900 rounded-2xl p-3">
                      <div className="w-full h-full grid grid-cols-8 gap-0.5">
                        {Array(64).fill(0).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-zinc-900'}`} />
                        ))}
                      </div>
                    </div>
                    {/* Center Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-repix-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                        <QrCode size={24} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Session Code */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-zinc-500">{language === 'vi' ? 'Mã phiên:' : 'Session:'}</span>
                    <code className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-mono text-xl font-bold text-zinc-900 dark:text-white tracking-[0.3em]">
                      {sessionCode}
                    </code>
                    <button onClick={handleRefreshCode} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                      <RefreshCw size={16} className="text-zinc-500" />
                    </button>
                  </div>

                  {/* Demo Button */}
                  <Button onClick={simulateConnect} className="shadow-lg shadow-repix-500/20">
                    <Wifi size={16} className="mr-2" />
                    {language === 'vi' ? 'Demo kết nối' : 'Demo Connect'}
                  </Button>
                </div>

                {/* Right: Phone Mockup + Instructions */}
                <div className="flex flex-col">
                  {/* Phone Mockup */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-44 h-80 bg-zinc-900 rounded-[2.5rem] p-2 shadow-2xl">
                      <div className="w-full h-full bg-zinc-800 rounded-[2rem] overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-900 rounded-b-2xl" />
                        {/* Screen Content */}
                        <div className="pt-8 px-3 h-full bg-gradient-to-b from-repix-900 to-zinc-900">
                          <div className="text-center mb-4">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center">
                              <Camera size={20} className="text-white" />
                            </div>
                            <p className="text-white text-xs font-semibold">Repix</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <QrCode size={14} className="text-repix-400" />
                              <span className="text-white text-[10px]">{language === 'vi' ? 'Quét mã QR' : 'Scan QR'}</span>
                            </div>
                            <div className="w-full h-16 bg-white/20 rounded-lg flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-repix-400 rounded-lg" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-zinc-400 text-[10px]">{language === 'vi' ? 'hoặc nhập mã' : 'or enter code'}</p>
                            <div className="mt-1 px-3 py-1.5 bg-white/10 rounded-lg">
                              <span className="text-white text-xs font-mono tracking-wider">{sessionCode}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -right-2 top-1/3 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-lg">
                      {language === 'vi' ? 'Bước 2' : 'Step 2'}
                    </div>
                  </div>

                  {/* Download App */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 text-center">
                      {language === 'vi' ? 'Tải app Repix' : 'Download Repix App'}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 dark:bg-white rounded-xl hover:opacity-90 transition-opacity">
                        <Apple size={20} className="text-white dark:text-zinc-900" />
                        <div className="text-left">
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none">Download on</p>
                          <p className="text-sm font-semibold text-white dark:text-zinc-900 leading-tight">App Store</p>
                        </div>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 dark:bg-white rounded-xl hover:opacity-90 transition-opacity">
                        <Play size={20} className="text-white dark:text-zinc-900" fill="currentColor" />
                        <div className="text-left">
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none">Get it on</p>
                          <p className="text-sm font-semibold text-white dark:text-zinc-900 leading-tight">Google Play</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { step: 1, icon: Download, title: language === 'vi' ? 'Tải app' : 'Download', desc: 'iOS & Android' },
                  { step: 2, icon: QrCode, title: language === 'vi' ? 'Quét mã' : 'Scan QR', desc: language === 'vi' ? 'Hoặc nhập mã' : 'Or enter code' },
                  { step: 3, icon: Upload, title: language === 'vi' ? 'Chọn & Tải' : 'Select & Upload', desc: language === 'vi' ? 'Tự động đồng bộ' : 'Auto sync' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* CONNECTING STATE */}
          {syncStatus === 'connecting' && (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center">
                  <Wifi size={40} className="text-repix-500 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-repix-500/30 animate-ping" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Đang kết nối...' : 'Connecting...'}
              </h3>
              <p className="text-sm text-zinc-500 text-center max-w-xs">
                {language === 'vi' 
                  ? 'Đang thiết lập kết nối an toàn với điện thoại của bạn'
                  : 'Establishing secure connection with your phone'}
              </p>
            </div>
          )}

          {/* SELECTING STATE - Photo Grid */}
          {syncStatus === 'selecting' && (
            <div className="p-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 size={12} className="mr-1" />
                    {language === 'vi' ? 'Đã kết nối' : 'Connected'}
                  </Badge>
                  <span className="text-sm text-zinc-500">
                    {photos.length} {language === 'vi' ? 'ảnh từ điện thoại' : 'photos from phone'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={selectAll}>
                    <CheckSquare size={14} className="mr-1" />
                    {language === 'vi' ? 'Chọn tất cả' : 'Select All'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={deselectAll}>
                    <Square size={14} className="mr-1" />
                    {language === 'vi' ? 'Bỏ chọn' : 'Deselect'}
                  </Button>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => togglePhotoSelection(photo.id)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group transition-all ${
                      photo.selected 
                        ? 'ring-3 ring-repix-500 ring-offset-2 dark:ring-offset-zinc-900' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    <img src={photo.src} alt={photo.name} className="w-full h-full object-cover" />
                    
                    {/* Selection Overlay */}
                    <div className={`absolute inset-0 transition-all ${
                      photo.selected ? 'bg-repix-500/20' : 'bg-black/0 group-hover:bg-black/20'
                    }`} />
                    
                    {/* Checkbox */}
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      photo.selected 
                        ? 'bg-repix-500 text-white' 
                        : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-400 opacity-0 group-hover:opacity-100'
                    }`}>
                      {photo.selected ? <Check size={14} /> : <span className="text-xs">{photos.indexOf(photo) + 1}</span>}
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] truncate">{photo.name}</p>
                      <p className="text-white/70 text-[10px]">{photo.size}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Info */}
              {selectedCount > 0 && (
                <div className="flex items-center justify-between p-4 bg-repix-50 dark:bg-repix-900/20 rounded-2xl border border-repix-200 dark:border-repix-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-repix-500 flex items-center justify-center text-white font-bold">
                      {selectedCount}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {language === 'vi' ? `${selectedCount} ảnh đã chọn` : `${selectedCount} photos selected`}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {language === 'vi' ? 'Sẵn sàng tải lên Repix' : 'Ready to upload to Repix'}
                      </p>
                    </div>
                  </div>
                  <Button onClick={startSync} className="shadow-lg shadow-repix-500/20">
                    <Upload size={16} className="mr-2" />
                    {language === 'vi' ? 'Tải lên' : 'Upload'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* SYNCING STATE */}
          {syncStatus === 'syncing' && (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-24 h-24 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center mb-8">
                <Loader2 size={40} className="text-repix-500 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Đang tải lên...' : 'Uploading...'}
              </h3>
              <div className="w-full max-w-sm mb-4">
                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                  <span>{Math.round(syncProgress)}%</span>
                  <span>{Math.round(syncProgress * selectedCount / 100)} / {selectedCount}</span>
                </div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-repix-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Vui lòng không đóng cửa sổ này' : 'Please do not close this window'}
              </p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {syncStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-8">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Tải lên thành công!' : 'Upload Complete!'}
              </h3>
              <p className="text-sm text-zinc-500 text-center mb-8 max-w-xs">
                {language === 'vi' 
                  ? `Đã tải ${selectedCount} ảnh từ điện thoại vào thư viện của bạn`
                  : `Successfully uploaded ${selectedCount} photos from your phone`}
              </p>
              
              {/* Preview uploaded */}
              <div className="flex -space-x-3 mb-8">
                {photos.filter(p => p.selected).slice(0, 5).map((photo, idx) => (
                  <img 
                    key={photo.id} 
                    src={photo.src} 
                    className="w-14 h-14 rounded-xl object-cover border-3 border-white dark:border-zinc-900 shadow-lg"
                    style={{ zIndex: 5 - idx }}
                  />
                ))}
                {selectedCount > 5 && (
                  <div className="w-14 h-14 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center border-3 border-white dark:border-zinc-900 shadow-lg">
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">+{selectedCount - 5}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </Button>
                <Button className="shadow-lg shadow-repix-500/20" onClick={onClose}>
                  <Image size={16} className="mr-2" />
                  {language === 'vi' ? 'Xem thư viện' : 'View Library'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Security */}
        {syncStatus === 'waiting' && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
            <div className="flex items-center justify-center gap-2">
              <Shield size={14} className="text-green-500" />
              <p className="text-xs text-zinc-500">
                {language === 'vi' 
                  ? 'Kết nối được mã hóa end-to-end • Ảnh của bạn được bảo mật'
                  : 'End-to-end encrypted • Your photos are secure'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
