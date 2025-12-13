import React from 'react';
import {
  Sparkles, Wand2, Calendar, Download, Eye, Copy, MoreHorizontal,
  MessageSquare, Zap, Clock, RefreshCw
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface AIAsset {
  id: string;
  name: string;
  thumbnail: string;
  prompt: string;
  model: string;
  createdAt: string;
  generationTime: string;
  credits: number;
}

export const AIGeneratedView: React.FC = () => {
  const { language } = useLanguage();

  const aiAssets: AIAsset[] = [
    { id: '1', name: 'AI_Sneaker_001.png', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', prompt: 'Professional product photo of red Nike sneaker on white background, studio lighting', model: 'Repix Pro', createdAt: '2024-12-10', generationTime: '12s', credits: 4 },
    { id: '2', name: 'AI_Background_002.png', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', prompt: 'Minimalist gradient background, soft pink to purple, abstract shapes', model: 'Repix Pro', createdAt: '2024-12-09', generationTime: '8s', credits: 4 },
    { id: '3', name: 'AI_Portrait_003.png', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', prompt: 'Professional headshot, business attire, neutral background', model: 'Repix Plus', createdAt: '2024-12-08', generationTime: '15s', credits: 6 },
    { id: '4', name: 'AI_Scene_004.png', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', prompt: 'Cozy coffee shop interior, warm lighting, wooden furniture', model: 'Repix Pro', createdAt: '2024-12-07', generationTime: '18s', credits: 4 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Action Bar */}
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 flex items-center justify-between">
        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          {[
            { label: language === 'vi' ? 'Tổng' : 'Total', value: '67', icon: Sparkles, color: 'text-purple-500' },
            { label: language === 'vi' ? 'Hôm nay' : 'Today', value: '5', icon: Calendar, color: 'text-blue-500' },
            { label: 'Credits', value: '268', icon: Zap, color: 'text-amber-500' },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <stat.icon size={12} className={stat.color} />
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-zinc-500">{stat.label}</span>
            </div>
          ))}
        </div>
        <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500">
          <Wand2 size={16} />
          {language === 'vi' ? 'Tạo ảnh mới' : 'Generate New'}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiAssets.map(asset => (
            <div
              key={asset.id}
              className="group bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-40 h-40 flex-shrink-0 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye size={14} />
                    </Button>
                    <Button size="sm" className="h-8 w-8 p-0">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{asset.name}</h4>
                      <Badge className="mt-1 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-[10px]">
                        {asset.model}
                      </Badge>
                    </div>
                    <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded">
                      <MoreHorizontal size={14} className="text-zinc-500" />
                    </button>
                  </div>

                  {/* Prompt */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                      <MessageSquare size={10} />
                      Prompt
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{asset.prompt}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {asset.generationTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={10} />
                      {asset.credits} credits
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {asset.createdAt}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Copy size={12} />
                      {language === 'vi' ? 'Dùng lại prompt' : 'Reuse Prompt'}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <RefreshCw size={12} />
                      {language === 'vi' ? 'Tạo lại' : 'Regenerate'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
