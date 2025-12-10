import React from 'react';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, FileQuestion, ServerCrash, WifiOff } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ErrorPageProps {
  onGoHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

// 404 Not Found
export const NotFoundPage: React.FC<ErrorPageProps> = ({ onGoHome, onGoBack }) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-repix-500/20 to-pink-500/20 flex items-center justify-center">
            <FileQuestion size={64} className="text-repix-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center animate-bounce">
            <span className="text-white font-bold text-sm">?</span>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-repix-500 to-pink-500 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          {language === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found'}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          {language === 'vi' 
            ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.'
            : "The page you're looking for doesn't exist or has been moved."
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack} className="gap-2">
              <ArrowLeft size={18} />
              {language === 'vi' ? 'Quay lại' : 'Go Back'}
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} className="gap-2">
              <Home size={18} />
              {language === 'vi' ? 'Về trang chủ' : 'Go Home'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// 500 Server Error
export const ServerErrorPage: React.FC<ErrorPageProps> = ({ onGoHome, onRetry }) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <ServerCrash size={64} className="text-red-500" />
          </div>
          <div className="absolute top-0 right-4 w-6 h-6 rounded-full bg-red-500 animate-ping" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
          500
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          {language === 'vi' ? 'Lỗi máy chủ' : 'Server Error'}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          {language === 'vi' 
            ? 'Đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau.'
            : 'Something went wrong on our end. Please try again later.'
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw size={18} />
              {language === 'vi' ? 'Thử lại' : 'Try Again'}
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} className="gap-2">
              <Home size={18} />
              {language === 'vi' ? 'Về trang chủ' : 'Go Home'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Offline Page
export const OfflinePage: React.FC<ErrorPageProps> = ({ onRetry }) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 flex items-center justify-center">
            <WifiOff size={64} className="text-zinc-500" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          {language === 'vi' ? 'Không có kết nối' : 'No Connection'}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          {language === 'vi' 
            ? 'Vui lòng kiểm tra kết nối internet của bạn và thử lại.'
            : 'Please check your internet connection and try again.'
          }
        </p>

        {/* Actions */}
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw size={18} />
            {language === 'vi' ? 'Thử lại' : 'Try Again'}
          </Button>
        )}
      </div>
    </div>
  );
};

// Generic Error
export const GenericErrorPage: React.FC<ErrorPageProps & { title?: string; message?: string }> = ({ 
  onGoHome, 
  onRetry,
  title,
  message 
}) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <AlertTriangle size={64} className="text-amber-500" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          {title || (language === 'vi' ? 'Đã xảy ra lỗi' : 'Something Went Wrong')}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          {message || (language === 'vi' 
            ? 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
            : 'An unexpected error occurred. Please try again.'
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw size={18} />
              {language === 'vi' ? 'Thử lại' : 'Try Again'}
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} className="gap-2">
              <Home size={18} />
              {language === 'vi' ? 'Về trang chủ' : 'Go Home'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
