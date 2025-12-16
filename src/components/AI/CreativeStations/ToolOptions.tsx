import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ToolOption } from '../../../types/stations';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ToolOptionsProps {
  options: ToolOption[];
  values: Record<string, any>;
  onChange: (optionId: string, value: any) => void;
}

export const ToolOptions: React.FC<ToolOptionsProps> = ({
  options,
  values,
  onChange,
}) => {
  const { language } = useLanguage();

  const renderOption = (option: ToolOption) => {
    const label = language === 'vi' ? option.labelVi : option.label;
    const currentValue = values[option.id] ?? option.default;

    switch (option.type) {
      case 'select':
        return (
          <div key={option.id} className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </label>
            <div className="relative">
              <select
                value={currentValue}
                onChange={(e) => onChange(option.id, e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {option.values?.map((value, index) => (
                  <option key={value} value={value}>
                    {language === 'vi' && option.valuesVi ? option.valuesVi[index] : value}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" 
              />
            </div>
          </div>
        );

      case 'slider':
        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label}
              </label>
              <span className="text-sm font-bold text-purple-500">
                {currentValue}{option.max === 100 ? '%' : ''}
              </span>
            </div>
            <input
              type="range"
              min={option.min ?? 0}
              max={option.max ?? 100}
              step={option.step ?? 1}
              value={currentValue}
              onChange={(e) => onChange(option.id, Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{option.min ?? 0}</span>
              <span>{option.max ?? 100}</span>
            </div>
          </div>
        );

      case 'toggle':
        return (
          <div key={option.id} className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </label>
            <button
              onClick={() => onChange(option.id, !currentValue)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                currentValue 
                  ? 'bg-purple-500' 
                  : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            >
              <div 
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  currentValue ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      case 'text':
        return (
          <div key={option.id} className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </label>
            <textarea
              value={currentValue}
              onChange={(e) => onChange(option.id, e.target.value)}
              placeholder={language === 'vi' ? 'Nhập prompt của bạn...' : 'Enter your prompt...'}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-4">
      <h5 className="text-sm font-semibold text-zinc-900 dark:text-white">
        {language === 'vi' ? 'Tùy chọn' : 'Options'}
      </h5>
      {options.map(renderOption)}
    </div>
  );
};

export default ToolOptions;
