import React, { useState, useEffect } from 'react';
import {
  X, Smartphone, QrCode, Check, RefreshCw, Wifi, Shield, Clock,
  ChevronRight, Download, Image, CheckCircle2, Loader2
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface PhoneSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SyncStatus = 'waiting' | 'connecting' | 'syncing' | 'success' | 'error';

export const PhoneSyncModal: React.FC<PhoneSyncModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('waiting');
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncedPhotos, setSyncedPhotos] = useState(0);
  const [sessionCode, setSessionCode] = useState('');

  // Generate random session code
  useEffect(() => {
    if (isOpen) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setSessionCode(code);
      setSyncStatus('waiting');
      setSyncProgress(0);
      setSyncedPhotos(0);
    }
  }, [isOpen]);

  // Simulate QR code as SVG pattern (placeholder for real QR)
  const generateQRPattern = () => {
    const size = 200;
    const cellSize = 8;
    const cells = size / cellSize;
    const pattern: boolean[][] = [];
    
    // Generate random pattern (in real app, this would be actual QR data)
    for (let i = 0; i < cells; i++) {
      pattern[i] = [];
      for (let j = 0; j < cells; j++) {
        // Keep corners for position markers
        const isCorner = (i < 7 && j < 7) || (i < 7 && j >= cells - 7) || (i >= cells - 7 && j < 7);
        if (isCorner) {
          const inOuter = i < 7 ? (i === 0 || i === 6 || j === 0 || j === 6 || (j >= cells - 7 && (j === cells - 7 || j === cells - 1))) : 
                         (i === cells - 7 || i === cells - 1 || j === 0 || j === 6);
          const inInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) || 
                         (i >= 2 && i <= 4 && j >= cells - 5 && j <= cells - 3) ||
                         (i >= cells - 5 && i <= cells - 3 && j >= 2 && j <= 4);
          pattern[i][j] = inOuter || inInner;
        } else {
          pattern[i][j] = Math.random() > 0.5;
        }
      }
    }
    return pattern;
  };

  const [qrPattern] = useState(generateQRPattern);

  const handleRefreshCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
  };

  // Demo: Simulate sync process
  const simulateSync = () => {
    setSyncStatus('connecting');
    setTimeout(() => {
      setSyncStatus('syncing');
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setSyncStatus('success');
          setSyncedPhotos(24);
        }
        setSyncProgress(Math.min(progress, 100));
      }, 500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Đồng bộ từ điện thoại' : 'Sync from Phone'}
              </h2>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Quét mã QR để kết nối' : 'Scan QR code to connect'}
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

        {/* Content */}
        <div className="p-6">
          {syncStatus === 'waiting' && (
            <>
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="relative p-4 bg-white rounded-2xl shadow-lg mb-4">
                  {/* QR Code SVG */}
                  <svg width="200" height="200" className="rounded-lg">
                    {qrPattern.map((row, i) =>
                      row.map((cell, j) =>
                        cell ? (
                          <rect
                            key={`${i}-${j}`}
                            x={j * 8}
                            y={i * 8}
                            width="8"
                            height="8"
                            fill="#18181b"
                            rx="1"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                  
                  {/* Center Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-repix-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <QrCode size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Session Code */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-zinc-500">
                    {language === 'vi' ? 'Mã phiên:' : 'Session:'}
                  </span>
                  <code className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-mono text-lg font-bold text-zinc-900 dark:text-white tracking-wider">
                    {sessionCode}
                  </code>
                  <button
                    onClick={handleRefreshCode}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title={language === 'vi' ? 'Làm mới mã' : 'Refresh code'}
                  >
                    <RefreshCw size={14} className="text-zinc-500" />
                  </button>
                </div>

                {/* Instructions */}
                <div className="w-full space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white text-center">
                    {language === 'vi' ? 'Hướng dẫn:' : 'Instructions:'}
                  </h4>
                  {[
                    { 
                      icon: Download, 
                      text: language === 'vi' ? 'Tải app Repix trên điện thoại' : 'Download Repix app on your phone',
                      sub: 'iOS & Android'
                    },
                    { 
                      icon: QrCode, 
                      text: language === 'vi' ? 'Mở app và quét mã QR này' : 'Open app and scan this QR code',
                      sub: language === 'vi' ? 'Hoặc nhập mã phiên' : 'Or enter session code'
                    },
                    { 
                      icon: Image, 
                      text: language === 'vi' ? 'Chọn ảnh cần đồng bộ' : 'Select photos to sync',
                      sub: language === 'vi' ? 'Ảnh sẽ tự động tải lên' : 'Photos will upload automatically'
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-repix-100 dark:bg-repix-900/30 text-repix-600 dark:text-repix-400 text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-zinc-900 dark:text-white">{step.text}</p>
                        <p className="text-xs text-zinc-500">{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Demo Button (for testing) */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={simulateSync}
                  className="text-xs"
                >
                  {language === 'vi' ? '🧪 Demo kết nối' : '🧪 Demo Connection'}
                </Button>
              </div>
            </>
          )}

          {syncStatus === 'connecting' && (
            <div className="flex flex-col items-center py-8">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center">
                  <Wifi size={32} className="text-repix-500 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-repix-500/30 animate-ping" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Đang kết nối...' : 'Connecting...'}
              </h3>
              <p className="text-sm text-zinc-500 text-center">
                {language === 'vi' 
                  ? 'Vui lòng chờ trong khi thiết lập kết nối an toàn'
                  : 'Please wait while establishing secure connection'}
              </p>
            </div>
          )}

          {syncStatus === 'syncing' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center mb-6">
                <Loader2 size={32} className="text-repix-500 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Đang đồng bộ ảnh...' : 'Syncing photos...'}
              </h3>
              <div className="w-full max-w-xs mb-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>{Math.round(syncProgress)}%</span>
                  <span>{Math.round(syncProgress * 0.24)} / 24 {language === 'vi' ? 'ảnh' : 'photos'}</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-repix-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Không tắt cửa sổ này' : "Don't close this window"}
              </p>
            </div>
          )}

          {syncStatus === 'success' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {language === 'vi' ? 'Đồng bộ thành công!' : 'Sync Complete!'}
              </h3>
              <p className="text-sm text-zinc-500 text-center mb-6">
                {language === 'vi' 
                  ? `Đã đồng bộ ${syncedPhotos} ảnh từ điện thoại của bạn`
                  : `Successfully synced ${syncedPhotos} photos from your phone`}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </Button>
                <Button 
                  className="bg-gradient-to-r from-repix-500 to-pink-500"
                  onClick={() => {
                    onClose();
                    // Navigate to imports folder
                  }}
                >
                  {language === 'vi' ? 'Xem ảnh' : 'View Photos'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Security Info */}
        {syncStatus === 'waiting' && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Shield size={16} className="text-green-600 dark:text-green-400" />
              <p className="text-xs text-green-700 dark:text-green-300">
                {language === 'vi' 
                  ? 'Kết nối được mã hóa end-to-end. Ảnh của bạn được bảo mật.'
                  : 'End-to-end encrypted connection. Your photos are secure.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
