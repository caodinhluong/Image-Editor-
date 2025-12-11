import React, { useState } from 'react';
import {
  X, LayoutTemplate, Search, Filter, Plus, Star, StarOff,
  Copy, Edit3, Trash2, Eye, Lock, Globe, Users, MoreVertical
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface TemplatesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  starred: boolean;
  visibility: 'private' | 'team' | 'public';
  dimensions: string;
}

export const TemplatesLibrary: React.FC<TemplatesLibraryProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const trans = {
    title: language === 'vi' ? 'Thư viện Templates' : 'Templates Library',
    subtitle: language === 'vi' ? 'Templates riêng của team' : 'Team-exclusive templates',
    search: language === 'vi' ? 'Tìm templates...' : 'Search templates...',
    create: language === 'vi' ? 'Tạo Template' : 'Create Template',
    all: language === 'vi' ? 'Tất cả' : 'All',
    social: language === 'vi' ? 'Social Media' : 'Social Media',
    marketing: language === 'vi' ? 'Marketing' : 'Marketing',
    product: language === 'vi' ? 'Sản phẩm' : 'Product',
    presentation: language === 'vi' ? 'Presentation' : 'Presentation',
    use: language === 'vi' ? 'Sử dụng' : 'Use',
    duplicate: language === 'vi' ? 'Nhân bản' : 'Duplicate',
    edit: language === 'vi' ? 'Chỉnh sửa' : 'Edit',
    usedTimes: language === 'vi' ? 'lần sử dụng' : 'uses',
    private: language === 'vi' ? 'Riêng tư' : 'Private',
    team: language === 'vi' ? 'Team' : 'Team',
    public: language === 'vi' ? 'Công khai' : 'Public',
  };

  const categories = [
    { id: 'all', name: trans.all },
    { id: 'social', name: trans.social },
    { id: 'marketing', name: trans.marketing },
    { id: 'product', name: trans.product },
    { id: 'presentation', name: trans.presentation },
  ];

  const [templates] = useState<Template[]>([
    { id: '1', name: 'Instagram Post - Product', category: 'social', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', createdBy: 'Sarah', createdAt: '2 days ago', usageCount: 45, starred: true, visibility: 'team', dimensions: '1080x1080' },
    { id: '2', name: 'Facebook Ad Banner', category: 'marketing', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', createdBy: 'Mike', createdAt: '5 days ago', usageCount: 32, starred: false, visibility: 'team', dimensions: '1200x628' },
    { id: '3', name: 'Story Template - Sale', category: 'social', thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300', createdBy: 'Jessica', createdAt: '1 week ago', usageCount: 78, starred: true, visibility: 'team', dimensions: '1080x1920' },
    { id: '4', name: 'Product Showcase', category: 'product', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', createdBy: 'Tom', createdAt: '1 week ago', usageCount: 23, starred: false, visibility: 'private', dimensions: '1920x1080' },
    { id: '5', name: 'Email Header', category: 'marketing', thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300', createdBy: 'Sarah', createdAt: '2 weeks ago', usageCount: 56, starred: false, visibility: 'team', dimensions: '600x200' },
    { id: '6', name: 'Pitch Deck Slide', category: 'presentation', thumbnail: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=300', createdBy: 'Mike', createdAt: '2 weeks ago', usageCount: 12, starred: true, visibility: 'private', dimensions: '1920x1080' },
  ]);

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return <Lock size={12} className="text-zinc-400" />;
      case 'team': return <Users size={12} className="text-blue-500" />;
      case 'public': return <Globe size={12} className="text-green-500" />;
      default: return null;
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory !== 'all' && template.category !== selectedCategory) return false;
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <LayoutTemplate size={20} className="text-pink-600" />
              </div>
              <div>
                <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
                <p className="text-xs text-zinc-500">{trans.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">
                <Plus size={14} className="mr-2" /> {trans.create}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Search & Categories */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder={trans.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden">
                  <img src={template.thumbnail} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button size="sm" className="shadow-lg">{trans.use}</Button>
                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full"><Eye size={16} /></Button>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-black/60 text-white border-0 text-[10px]">{template.dimensions}</Badge>
                  </div>
                  <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-zinc-800/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    {template.starred ? <Star size={14} className="text-amber-500 fill-amber-500" /> : <StarOff size={14} className="text-zinc-400" />}
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-white">{template.name}</h3>
                      <p className="text-xs text-zinc-500">{template.createdBy} • {template.createdAt}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreVertical size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        {getVisibilityIcon(template.visibility)}
                        {trans[template.visibility as keyof typeof trans]}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">{template.usageCount} {trans.usedTimes}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Template Card */}
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors cursor-pointer aspect-[4/3]">
              <Plus size={32} className="mb-2" />
              <span className="text-sm font-medium">{trans.create}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
