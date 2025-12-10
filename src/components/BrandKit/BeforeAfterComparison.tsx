import React, { useState } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { Button } from '../ui/UIComponents';

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeScore: number;
  afterScore: number;
  onKeep: () => void;
  onUndo: () => void;
  onClose: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  beforeImage,
  afterImage,
  beforeScore,
  afterScore,
  onKeep,
  onUndo,
  onClose
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Before/After Comparison
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Drag the slider to compare changes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Comparison Container */}
        <div className="p-6">
          <div
            className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full) */}
            <div className="absolute inset-0">
              <img
                src={afterImage}
                alt="After"
                className="w-full h-full object-contain"
                draggable={false}
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                AFTER: {afterScore}%
              </div>
            </div>

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt="Before"
                className="w-full h-full object-contain"
                draggable={false}
              />
              <div className="absolute top-4 left-4 bg-zinc-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                BEFORE: {beforeScore}%
              </div>
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-zinc-200 dark:border-zinc-700">
                <div className="flex gap-1">
                  <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                  <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                ← Drag to compare →
              </div>
            </div>
          </div>

          {/* Score Comparison */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Before</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{beforeScore}%</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Original consistency</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400 mb-2">After</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{afterScore}%</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{afterScore - beforeScore}%
                </p>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Brand consistency</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <Button
            onClick={onUndo}
            variant="secondary"
            className="gap-2"
          >
            <RotateCcw size={16} />
            Undo Changes
          </Button>
          <Button
            onClick={onKeep}
            className="gap-2"
          >
            <Check size={16} />
            Keep Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
