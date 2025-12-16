import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ProcessingIndicatorProps {
  progress: number;
  estimatedTimeRemaining: number;
  currentStep?: string;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  progress,
  estimatedTimeRemaining,
  currentStep,
}) => {
  const { language } = useLanguage();

  // Format time remaining
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Animated icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
          <Sparkles size={32} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-ping" />
        <Loader2 
          size={80} 
          className="absolute inset-0 text-purple-500 animate-spin" 
          style={{ animationDuration: '2s' }}
        />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-4">
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        {Math.round(progress)}%
      </div>

      {/* Current step */}
      {currentStep && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          {currentStep}
        </p>
      )}

      {/* Estimated time */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {language === 'vi' ? 'Thời gian còn lại:' : 'Time remaining:'}
        </span>
        <span className="font-medium text-purple-500">
          ~{formatTime(estimatedTimeRemaining)}
        </span>
      </div>

      {/* Fun messages */}
      <div className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic">
        {progress < 30 && (language === 'vi' ? '🎨 Đang chuẩn bị nguyên liệu...' : '🎨 Preparing ingredients...')}
        {progress >= 30 && progress < 60 && (language === 'vi' ? '✨ Đang pha chế phép màu...' : '✨ Mixing the magic...')}
        {progress >= 60 && progress < 90 && (language === 'vi' ? '🔥 Đang nấu nướng...' : '🔥 Cooking in progress...')}
        {progress >= 90 && (language === 'vi' ? '🍽️ Sắp hoàn thành!' : '🍽️ Almost ready!')}
      </div>
    </div>
  );
};

export default ProcessingIndicator;
