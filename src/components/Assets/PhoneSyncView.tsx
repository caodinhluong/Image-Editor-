import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  Check,
  RefreshCw,
  Wifi,
  Shield,
  CheckCircle2,
  Loader2,
  Upload,
  CheckSquare,
  Square,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Send,
  Scan,
} from 'lucide-react';

// Apple Logo SVG Component
const AppleLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 384 512" className={className} fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

// Google Play Logo SVG Component  
const GooglePlayLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" className={className}>
    <path fill="#4285F4" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
    <path fill="#34A853" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
    <path fill="#FBBC04" d="M325.3 277.7l-60.1-60.1L47 512l278.3-234.3z"/>
    <path fill="#EA4335" d="M486.7 256L385.4 196l-60.1 60.1 60.1 60.1 101.3-60.2z"/>
  </svg>
);
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface PhoneSyncViewProps {
  onBack: () => void;
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

const mockPhonePhotos: PhonePhoto[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', name: 'IMG_001.jpg', date: 'Today', size: '2.4 MB', selected: false },
  { id: '2', src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', name: 'IMG_002.jpg', date: 'Today', size: '1.8 MB', selected: false },
  { id: '3', src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop', name: 'IMG_003.jpg', date: 'Yesterday', size: '3.1 MB', selected: false },
  { id: '4', src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop', name: 'IMG_004.jpg', date: 'Yesterday', size: '2.2 MB', selected: false },
  { id: '5', src: 'https://images.unsplash.com/photo-1491553895911-0055uj6e?w=200&h=200&fit=crop', name: 'IMG_005.jpg', date: '2 days ago', size: '1.5 MB', selected: false },
  { id: '6', src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', name: 'IMG_006.jpg', date: '2 days ago', size: '2.8 MB', selected: false },
  { id: '7', src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop', name: 'IMG_007.jpg', date: '3 days ago', size: '1.9 MB', selected: false },
  { id: '8', src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop', name: 'IMG_008.jpg', date: '3 days ago', size: '2.1 MB', selected: false },
];

export const PhoneSyncView: React.FC<PhoneSyncViewProps> = ({ onBack, onSyncComplete }) => {
  const { language } = useLanguage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('waiting');
  const [syncProgress, setSyncProgress] = useState(0);
  const [sessionCode, setSessionCode] = useState('');
  const [photos, setPhotos] = useState<PhonePhoto[]>(mockPhonePhotos);

  const selectedCount = photos.filter((p) => p.selected).length;

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
  }, []);

  const handleRefreshCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
  };

  const togglePhotoSelection = (id: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  };

  const selectAll = () => setPhotos((prev) => prev.map((p) => ({ ...p, selected: true })));
  const deselectAll = () => setPhotos((prev) => prev.map((p) => ({ ...p, selected: false })));

  const simulateConnect = () => {
    setSyncStatus('connecting');
    setTimeout(() => setSyncStatus('selecting'), 2000);
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
        onSyncComplete?.('iPhone 15 Pro', selectedCount);
      }
      setSyncProgress(Math.min(progress, 100));
    }, 400);
  };

  const handleComplete = () => {
    onBack();
  };


  // Success Screen
  if (syncStatus === 'success') {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft size={18} />
            <span className="font-medium">{language === 'vi' ? 'Quay lại' : 'Back'}</span>
          </button>
          <span className="text-sm font-semibold text-green-600 flex items-center gap-2">
            <CheckCircle2 size={16} />
            {language === 'vi' ? 'Đồng bộ hoàn tất' : 'Sync Complete'}
          </span>
          <div className="w-20" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Đồng bộ thành công!' : 'Sync Successful!'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              {language === 'vi' ? `${selectedCount} ảnh đã được tải lên` : `${selectedCount} photos uploaded`}
            </p>

            <div className="flex -space-x-3 justify-center mb-8">
              {photos.filter((p) => p.selected).slice(0, 5).map((photo, idx) => (
                <img key={photo.id} src={photo.src} className="w-14 h-14 rounded-xl object-cover border-3 border-white dark:border-zinc-900 shadow-lg" style={{ zIndex: 5 - idx }} />
              ))}
              {selectedCount > 5 && (
                <div className="w-14 h-14 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center border-3 border-white dark:border-zinc-900 shadow-lg">
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">+{selectedCount - 5}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => { setSyncStatus('waiting'); setPhotos(mockPhonePhotos.map((p) => ({ ...p, selected: false }))); }}>
                {language === 'vi' ? 'Đồng bộ thêm' : 'Sync More'}
              </Button>
              <Button onClick={handleComplete} className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500">
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
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          <ArrowLeft size={18} />
          <span className="font-medium">{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <Smartphone size={16} className="text-repix-500" />
          {language === 'vi' ? 'Đồng bộ từ điện thoại' : 'Sync from Phone'}
        </h2>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* WAITING STATE */}
        {syncStatus === 'waiting' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="relative p-5 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl mb-4 border border-zinc-200 dark:border-zinc-700">
                  <div className="w-48 h-48 bg-zinc-900 rounded-2xl p-3">
                    <div className="w-full h-full grid grid-cols-8 gap-0.5">
                      {Array(64).fill(0).map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-zinc-900'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-repix-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-800">
                      <QrCode size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-zinc-500">Session:</span>
                  <code className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-mono text-xl font-bold tracking-[0.3em]">
                    {sessionCode}
                  </code>
                  <button onClick={handleRefreshCode} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
                    <RefreshCw size={16} className="text-zinc-500" />
                  </button>
                </div>

                <Button onClick={simulateConnect} className="shadow-lg shadow-repix-500/20">
                  <Wifi size={16} className="mr-2" />
                  {language === 'vi' ? 'Demo kết nối' : 'Demo Connect'}
                </Button>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 text-center">
                    {language === 'vi' ? 'Tải app Repix' : 'Download Repix App'}
                  </p>
                  <div className="flex gap-3">
                    {/* App Store Button - Official Style */}
                    <button className="flex-1 flex items-center gap-3 px-4 py-3 bg-black rounded-xl hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] border border-zinc-700 shadow-lg">
                      <AppleLogo className="w-7 h-7 text-white flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-[9px] text-zinc-400 leading-tight">Download on the</p>
                        <p className="text-[15px] font-semibold text-white leading-tight tracking-tight">App Store</p>
                      </div>
                    </button>
                    
                    {/* Google Play Button - Official Style */}
                    <button className="flex-1 flex items-center gap-3 px-4 py-3 bg-black rounded-xl hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] border border-zinc-700 shadow-lg">
                      <GooglePlayLogo className="w-6 h-6 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-[9px] text-zinc-400 leading-tight">GET IT ON</p>
                        <p className="text-[15px] font-semibold text-white leading-tight tracking-tight">Google Play</p>
                      </div>
                    </button>
                  </div>
                  
                  {/* QR Code hint */}
                  <p className="text-[10px] text-zinc-500 text-center mt-3">
                    {language === 'vi' ? 'Hoặc quét mã QR bên trái bằng camera điện thoại' : 'Or scan the QR code on the left with your phone camera'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Shield size={14} className="text-green-500" />
                  <p className="text-xs text-green-700 dark:text-green-400">
                    {language === 'vi' ? 'Kết nối được mã hóa end-to-end' : 'End-to-end encrypted connection'}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Mockup Steps - Visual Guide */}
            <div className="mt-8 max-w-5xl mx-auto">
              <h3 className="text-center text-sm font-semibold text-zinc-900 dark:text-white mb-6">
                {language === 'vi' ? 'Hướng dẫn từng bước' : 'Step-by-step Guide'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1: Download App */}
                <div className="relative group">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 pt-6 border border-zinc-200 dark:border-zinc-700 hover:border-repix-300 dark:hover:border-repix-700 transition-colors">
                    {/* Phone Mockup */}
                    <div className="mx-auto w-32 h-56 bg-zinc-900 rounded-[1.5rem] p-1.5 shadow-xl mb-4">
                      <div className="w-full h-full bg-zinc-800 rounded-[1.2rem] overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-900 rounded-b-xl" />
                        {/* Screen Content - App Store */}
                        <div className="pt-6 px-2 h-full bg-gradient-to-b from-blue-600 to-blue-800">
                          <div className="text-center mb-2">
                            <div className="w-12 h-12 mx-auto mb-1.5 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center shadow-lg">
                              <Smartphone size={20} className="text-white" />
                            </div>
                            <p className="text-white text-[9px] font-semibold">Repix</p>
                            <p className="text-blue-200 text-[7px]">Photo Editor</p>
                          </div>
                          <div className="flex justify-center gap-1 mb-2">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className="w-2 h-2 text-yellow-400">★</div>
                            ))}
                          </div>
                          <button className="w-full py-1.5 bg-white rounded-lg text-blue-600 text-[8px] font-bold">
                            {language === 'vi' ? 'TẢI XUỐNG' : 'GET'}
                          </button>
                          <div className="mt-2 grid grid-cols-3 gap-1">
                            {[1,2,3].map(i => (
                              <div key={i} className="aspect-square bg-white/20 rounded-md" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                        {language === 'vi' ? 'Tải app Repix' : 'Download Repix'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {language === 'vi' ? 'Có sẵn trên iOS & Android' : 'Available on iOS & Android'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Scan QR */}
                <div className="relative group">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      2
                    </div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 pt-6 border border-zinc-200 dark:border-zinc-700 hover:border-repix-300 dark:hover:border-repix-700 transition-colors">
                    {/* Phone Mockup */}
                    <div className="mx-auto w-32 h-56 bg-zinc-900 rounded-[1.5rem] p-1.5 shadow-xl mb-4">
                      <div className="w-full h-full bg-zinc-800 rounded-[1.2rem] overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-900 rounded-b-xl" />
                        {/* Screen Content - QR Scanner */}
                        <div className="pt-6 px-2 h-full bg-gradient-to-b from-zinc-900 to-zinc-800">
                          <div className="text-center mb-2">
                            <p className="text-white text-[8px] font-medium mb-2">
                              {language === 'vi' ? 'Quét mã QR' : 'Scan QR Code'}
                            </p>
                          </div>
                          {/* QR Scanner Frame */}
                          <div className="relative mx-auto w-20 h-20 mb-2">
                            <div className="absolute inset-0 border-2 border-repix-500 rounded-lg" />
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-repix-400 rounded-tl" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-repix-400 rounded-tr" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-repix-400 rounded-bl" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-repix-400 rounded-br" />
                            {/* Scan line animation */}
                            <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-repix-500 to-transparent animate-pulse" />
                            <Scan size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-repix-400" />
                          </div>
                          <p className="text-zinc-400 text-[7px] text-center mb-2">
                            {language === 'vi' ? 'hoặc nhập mã' : 'or enter code'}
                          </p>
                          <div className="bg-zinc-700 rounded-lg px-2 py-1.5 text-center">
                            <span className="text-white text-[9px] font-mono tracking-wider">{sessionCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                        {language === 'vi' ? 'Quét mã QR' : 'Scan QR Code'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {language === 'vi' ? 'Hoặc nhập mã phiên' : 'Or enter session code'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Select & Upload */}
                <div className="relative group">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      3
                    </div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 pt-6 border border-zinc-200 dark:border-zinc-700 hover:border-repix-300 dark:hover:border-repix-700 transition-colors">
                    {/* Phone Mockup */}
                    <div className="mx-auto w-32 h-56 bg-zinc-900 rounded-[1.5rem] p-1.5 shadow-xl mb-4">
                      <div className="w-full h-full bg-zinc-800 rounded-[1.2rem] overflow-hidden relative">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-900 rounded-b-xl" />
                        {/* Screen Content - Photo Gallery */}
                        <div className="pt-6 px-1.5 h-full bg-gradient-to-b from-zinc-900 to-zinc-800">
                          <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-white text-[8px] font-medium">
                              {language === 'vi' ? 'Chọn ảnh' : 'Select Photos'}
                            </p>
                            <span className="text-repix-400 text-[7px]">3 {language === 'vi' ? 'đã chọn' : 'selected'}</span>
                          </div>
                          {/* Photo Grid */}
                          <div className="grid grid-cols-3 gap-0.5 mb-2">
                            {[1,2,3,4,5,6].map(i => (
                              <div key={i} className="relative aspect-square bg-zinc-700 rounded-sm overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center">
                                  <ImageIcon size={8} className="text-zinc-500" />
                                </div>
                                {i <= 3 && (
                                  <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-repix-500 rounded-full flex items-center justify-center">
                                    <Check size={6} className="text-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {/* Upload Button */}
                          <button className="w-full py-1.5 bg-gradient-to-r from-repix-500 to-pink-500 rounded-lg text-white text-[8px] font-bold flex items-center justify-center gap-1">
                            <Send size={8} />
                            {language === 'vi' ? 'Tải lên' : 'Upload'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                        {language === 'vi' ? 'Chọn & Tải lên' : 'Select & Upload'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {language === 'vi' ? 'Ảnh sẽ tự động đồng bộ' : 'Photos sync automatically'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Arrow Indicators */}
              <div className="hidden md:flex justify-center items-center mt-4 gap-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-zinc-300 to-repix-300 dark:from-zinc-600 dark:to-repix-600 rounded" />
                  <ArrowRight size={14} className="text-repix-500" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-repix-300 to-pink-300 dark:from-repix-600 dark:to-pink-600 rounded" />
                  <ArrowRight size={14} className="text-pink-500" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-pink-300 to-green-300 dark:from-pink-600 dark:to-green-600 rounded" />
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}


        {/* CONNECTING STATE */}
        {syncStatus === 'connecting' && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
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
              {language === 'vi' ? 'Đang thiết lập kết nối an toàn' : 'Establishing secure connection'}
            </p>
          </div>
        )}

        {/* SELECTING STATE */}
        {syncStatus === 'selecting' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 size={12} className="mr-1" />
                  {language === 'vi' ? 'Đã kết nối' : 'Connected'}
                </Badge>
                <span className="text-sm text-zinc-500">{photos.length} {language === 'vi' ? 'ảnh' : 'photos'}</span>
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

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => togglePhotoSelection(photo.id)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group transition-all ${
                    photo.selected ? 'ring-3 ring-repix-500 ring-offset-2 dark:ring-offset-zinc-900' : 'hover:opacity-80'
                  }`}
                >
                  <img src={photo.src} alt={photo.name} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-all ${photo.selected ? 'bg-repix-500/20' : 'bg-black/0 group-hover:bg-black/20'}`} />
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    photo.selected ? 'bg-repix-500 text-white' : 'bg-white/80 dark:bg-zinc-800/80 text-zinc-400 opacity-0 group-hover:opacity-100'
                  }`}>
                    {photo.selected ? <Check size={14} /> : <span className="text-xs">{photos.indexOf(photo) + 1}</span>}
                  </div>
                </div>
              ))}
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-repix-50 dark:bg-repix-900/20 rounded-2xl border border-repix-200 dark:border-repix-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-repix-500 flex items-center justify-center text-white font-bold">{selectedCount}</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {language === 'vi' ? `${selectedCount} ảnh đã chọn` : `${selectedCount} photos selected`}
                    </p>
                    <p className="text-xs text-zinc-500">{language === 'vi' ? 'Sẵn sàng tải lên' : 'Ready to upload'}</p>
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
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
            <div className="w-24 h-24 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center mb-8">
              <Loader2 size={40} className="text-repix-500 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Đang tải lên...' : 'Uploading...'}
            </h3>
            <div className="w-full max-w-sm mb-4">
              <div className="flex justify-between text-sm text-zinc-500 mb-2">
                <span>{Math.round(syncProgress)}%</span>
                <span>{Math.round((syncProgress * selectedCount) / 100)} / {selectedCount}</span>
              </div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-repix-500 to-pink-500 rounded-full transition-all" style={{ width: `${syncProgress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
