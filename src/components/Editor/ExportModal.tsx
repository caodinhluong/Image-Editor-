import React, { useState } from 'react';
import { X, Download, Image, FileImage, File, Check, Loader2, Settings2 } from 'lucide-react';
import { Button, Badge, Slider } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  imageName?: string;
}

interface ExportSettings {
  format: 'png' | 'jpg' | 'webp' | 'pdf';
  quality: number;
  scale: number;
  width: number;
  height: number;
}

const formatOptions = [
  { id: 'png', label: 'PNG', desc: 'Lossless, transparent', icon: FileImage, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'jpg', label: 'JPG', desc: 'Smaller size, no transparency', icon: Image, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'webp', label: 'WebP', desc: 'Modern, best compression', icon: FileImage, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'pdf', label: 'PDF', desc: 'Print-ready document', icon: File, color: 'text-red-500', bg: 'bg-red-500/10' },
];

const presetSizes = [
  { label: 'Original', scale: 1 },
  { label: '2x', scale: 2 },
  { label: '0.5x', scale: 0.5 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Facebook Cover', width: 820, height: 312 },
  { label: 'Twitter Header', width: 1500, height: 500 },
  { label: '4K', width: 3840, height: 2160 },
];

export const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  onExport,
  imageName = 'Untitled'
}) => {
  const { language } = useLanguage();
  const [format, setFormat] = useState<ExportSettings['format']>('png');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      onExport({ format, quality, scale, width, height });
      setIsExporting(false);
      onClose();
    }, 1500);
  };

  const handlePresetSelect = (preset: typeof presetSizes[0]) => {
    if (preset.scale) {
      setScale(preset.scale);
      setWidth(Math.round(1920 * preset.scale));
      setHeight(Math.round(1080 * preset.scale));
    } else if (preset.width && preset.height) {
      setWidth(preset.width);
      setHeight(preset.height);
      setScale(1);
    }
  };

  const estimatedSize = () => {
    const pixels = width * height;
    let baseSize = pixels * 3; // RGB
    
    if (format === 'png') baseSize *= 0.5;
    else if (format === 'jpg') baseSize *= (quality / 100) * 0.15;
    else if (format === 'webp') baseSize *= (quality / 100) * 0.1;
    else if (format === 'pdf') baseSize *= 0.8;
    
    if (baseSize > 1024 * 1024) return `~${(baseSize / (1024 * 1024)).toFixed(1)} MB`;
    return `~${(baseSize / 1024).toFixed(0)} KB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Download className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Xuất ảnh' : 'Export Image'}
              </h2>
              <p className="text-sm text-zinc-500">{imageName}.{format}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-3">
              {language === 'vi' ? 'Định dạng' : 'Format'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formatOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id as ExportSettings['format'])}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    format === opt.id
                      ? 'border-repix-500 bg-repix-50 dark:bg-repix-900/20'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {format === opt.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-repix-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-lg ${opt.bg} flex items-center justify-center mb-2`}>
                    <opt.icon className={opt.color} size={20} />
                  </div>
                  <p className="font-bold text-zinc-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-zinc-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG/WebP) */}
          {(format === 'jpg' || format === 'webp') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Chất lượng' : 'Quality'}
                </label>
                <span className="text-sm font-mono text-repix-500">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-repix-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>{language === 'vi' ? 'Nhỏ hơn' : 'Smaller'}</span>
                <span>{language === 'vi' ? 'Chất lượng cao' : 'Higher quality'}</span>
              </div>
            </div>
          )}

          {/* Size Presets */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-3">
              {language === 'vi' ? 'Kích thước' : 'Size'}
            </label>
            <div className="flex flex-wrap gap-2">
              {presetSizes.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (preset.scale === scale && !preset.width) || (preset.width === width && preset.height === height)
                      ? 'bg-repix-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <Settings2 size={16} />
              {language === 'vi' ? 'Cài đặt nâng cao' : 'Advanced settings'}
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      {language === 'vi' ? 'Chiều rộng' : 'Width'} (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      {language === 'vi' ? 'Chiều cao' : 'Height'} (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {width} × {height} px
              </p>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Kích thước ước tính' : 'Estimated size'}: {estimatedSize()}
              </p>
            </div>
            <Badge variant="default" className="uppercase">{format}</Badge>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <Button variant="outline" onClick={onClose}>
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2 min-w-[140px]">
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {language === 'vi' ? 'Đang xuất...' : 'Exporting...'}
              </>
            ) : (
              <>
                <Download size={16} />
                {language === 'vi' ? 'Xuất ảnh' : 'Export'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
