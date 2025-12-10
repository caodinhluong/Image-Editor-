import React, { useState } from 'react';
import { Palette, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useBrandKit } from '../../contexts/BrandKitContext';
import { BrandKit } from '../../types/brandKit';

export const BrandKitSelector: React.FC = () => {
  const { brandKits, activeBrandKit, setActiveBrandKit } = useBrandKit();
  const [isOpen, setIsOpen] = useState(false);

  if (brandKits.length === 0) {
    return null;
  }

  const handleSelect = (brandKit: BrandKit) => {
    setActiveBrandKit(brandKit);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button - Professional Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-repix-400 dark:hover:border-repix-600 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {activeBrandKit ? (
          <>
            {/* Logo/Icon with Gradient Ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-repix-500 to-pink-500 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity" />
              {activeBrandKit.profile.logo ? (
                <div className="relative w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
                  <img
                    src={activeBrandKit.profile.logo.url}
                    alt={activeBrandKit.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <Palette size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate max-w-[120px]">
                {activeBrandKit.name}
              </span>
              <div className="flex gap-0.5 mt-0.5">
                {activeBrandKit.profile.primaryColors.slice(0, 4).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-2 h-2 rounded-sm border border-white dark:border-zinc-800"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Chevron */}
            <ChevronDown 
              size={14} 
              className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
              <Palette size={14} className="text-zinc-400" />
            </div>
            <span className="text-xs font-medium text-zinc-500">Select Brand</span>
            <ChevronDown size={14} className="text-zinc-400" />
          </>
        )}
      </button>

      {/* Dropdown Menu - Premium Design */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-repix-500" />
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Brand Kits
                </span>
                <span className="ml-auto text-xs text-zinc-500">
                  {brandKits.length}
                </span>
              </div>
            </div>

            {/* Brand List */}
            <div className="max-h-80 overflow-y-auto">
              {brandKits.map((brandKit, index) => (
                <button
                  key={brandKit.id}
                  onClick={() => handleSelect(brandKit)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-repix-50 hover:to-pink-50 dark:hover:from-repix-900/20 dark:hover:to-pink-900/20 transition-all duration-200 text-left group ${
                    index !== brandKits.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''
                  } ${
                    activeBrandKit?.id === brandKit.id ? 'bg-gradient-to-r from-repix-50 to-pink-50 dark:from-repix-900/20 dark:to-pink-900/20' : ''
                  }`}
                >
                  {/* Logo */}
                  <div className="relative shrink-0">
                    {brandKit.profile.logo ? (
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 p-1.5 border border-zinc-200 dark:border-zinc-700 group-hover:border-repix-300 dark:group-hover:border-repix-700 transition-colors">
                        <img
                          src={brandKit.profile.logo.url}
                          alt={brandKit.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Palette size={18} className="text-white" />
                      </div>
                    )}
                    {activeBrandKit?.id === brandKit.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-repix-600 dark:group-hover:text-repix-400 transition-colors">
                      {brandKit.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Colors */}
                      <div className="flex gap-1">
                        {brandKit.profile.primaryColors.slice(0, 5).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3 h-3 rounded border border-white dark:border-zinc-800 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      {/* Usage Count */}
                      <span className="text-xs text-zinc-400">
                        {brandKit.metadata.usageCount}x
                      </span>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {activeBrandKit?.id === brandKit.id && (
                    <div className="shrink-0">
                      <div className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">
                          Active
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-xs text-zinc-500 text-center">
                Switch brands to apply different styles
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
