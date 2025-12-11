import React, { useState } from 'react';
import {
  X, BookOpen, Palette, Type, Image, Layout, Download,
  Edit3, Plus, Eye, Copy, Check, ChevronRight, Sparkles
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface BrandGuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandGuidelines: React.FC<BrandGuidelinesProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('colors');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const trans = {
    title: language === 'vi' ? 'Hướng dẫn thương hiệu' : 'Brand Guidelines',
    subtitle: language === 'vi' ? 'Tài liệu chuẩn hóa thương hiệu cho team' : 'Brand standards documentation for your team',
    colors: language === 'vi' ? 'Màu sắc' : 'Colors',
    typography: language === 'vi' ? 'Typography' : 'Typography',
    logos: language === 'vi' ? 'Logo' : 'Logos',
    imagery: language === 'vi' ? 'Hình ảnh' : 'Imagery',
    templates: language === 'vi' ? 'Templates' : 'Templates',
    download: language === 'vi' ? 'Tải PDF' : 'Download PDF',
    edit: language === 'vi' ? 'Chỉnh sửa' : 'Edit',
    primary: language === 'vi' ? 'Màu chính' : 'Primary',
    secondary: language === 'vi' ? 'Màu phụ' : 'Secondary',
    accent: language === 'vi' ? 'Màu nhấn' : 'Accent',
    neutral: language === 'vi' ? 'Trung tính' : 'Neutral',
    copied: language === 'vi' ? 'Đã copy!' : 'Copied!',
  };

  const sections = [
    { id: 'colors', label: trans.colors, icon: Palette },
    { id: 'typography', label: trans.typography, icon: Type },
    { id: 'logos', label: trans.logos, icon: Image },
    { id: 'imagery', label: trans.imagery, icon: Layout },
  ];

  const brandColors = {
    primary: [
      { name: 'Primary 500', hex: '#8B5CF6', usage: 'Main brand color' },
      { name: 'Primary 600', hex: '#7C3AED', usage: 'Hover states' },
      { name: 'Primary 400', hex: '#A78BFA', usage: 'Light accents' },
    ],
    secondary: [
      { name: 'Pink 500', hex: '#EC4899', usage: 'Secondary actions' },
      { name: 'Pink 400', hex: '#F472B6', usage: 'Highlights' },
    ],
    accent: [
      { name: 'Amber 500', hex: '#F59E0B', usage: 'Warnings, credits' },
      { name: 'Green 500', hex: '#22C55E', usage: 'Success states' },
      { name: 'Red 500', hex: '#EF4444', usage: 'Errors, alerts' },
    ],
    neutral: [
      { name: 'Zinc 900', hex: '#18181B', usage: 'Dark backgrounds' },
      { name: 'Zinc 100', hex: '#F4F4F5', usage: 'Light backgrounds' },
      { name: 'Zinc 500', hex: '#71717A', usage: 'Secondary text' },
    ],
  };

  const typography = [
    { name: 'Display', font: 'Inter', weight: '700', size: '48px', usage: 'Hero headlines' },
    { name: 'Heading 1', font: 'Inter', weight: '700', size: '32px', usage: 'Page titles' },
    { name: 'Heading 2', font: 'Inter', weight: '600', size: '24px', usage: 'Section headers' },
    { name: 'Body', font: 'Inter', weight: '400', size: '16px', usage: 'Paragraph text' },
    { name: 'Caption', font: 'Inter', weight: '500', size: '12px', usage: 'Labels, hints' },
  ];

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
              <p className="text-xs text-zinc-500">{trans.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-2" /> {trans.download}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 p-3">
            <nav className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <section.icon size={16} />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Colors Section */}
            {activeSection === 'colors' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {Object.entries(brandColors).map(([category, colors]) => (
                  <div key={category}>
                    <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-4">
                      {trans[category as keyof typeof trans] || category}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {colors.map(color => (
                        <div
                          key={color.hex}
                          className="group cursor-pointer"
                          onClick={() => copyColor(color.hex)}
                        >
                          <div
                            className="h-24 rounded-xl mb-2 relative overflow-hidden shadow-lg"
                            style={{ backgroundColor: color.hex }}
                          >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              {copiedColor === color.hex ? (
                                <Badge className="bg-white text-zinc-900"><Check size={12} className="mr-1" /> {trans.copied}</Badge>
                              ) : (
                                <Copy size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </div>
                          <p className="font-medium text-sm text-zinc-900 dark:text-white">{color.name}</p>
                          <p className="text-xs text-zinc-500 font-mono">{color.hex}</p>
                          <p className="text-xs text-zinc-400 mt-1">{color.usage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Typography Section */}
            {activeSection === 'typography' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    <Sparkles size={14} className="inline mr-2" />
                    {language === 'vi' ? 'Font chính: Inter - Sử dụng cho tất cả nội dung' : 'Primary font: Inter - Used for all content'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {typography.map(type => (
                    <Card key={type.name} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            className="text-zinc-900 dark:text-white mb-2"
                            style={{ fontFamily: type.font, fontWeight: type.weight, fontSize: type.size }}
                          >
                            {type.name}
                          </p>
                          <div className="flex gap-4 text-xs text-zinc-500">
                            <span>Font: {type.font}</span>
                            <span>Weight: {type.weight}</span>
                            <span>Size: {type.size}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{type.usage}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Logos Section */}
            {activeSection === 'logos' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-4">Primary Logo</h4>
                    <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                        R
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1"><Download size={12} className="mr-1" /> SVG</Button>
                      <Button variant="outline" size="sm" className="flex-1"><Download size={12} className="mr-1" /> PNG</Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-4">Logo on Dark</h4>
                    <div className="h-32 bg-zinc-900 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-violet-600 text-2xl font-bold">
                        R
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1"><Download size={12} className="mr-1" /> SVG</Button>
                      <Button variant="outline" size="sm" className="flex-1"><Download size={12} className="mr-1" /> PNG</Button>
                    </div>
                  </Card>
                </div>

                <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                  <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Logo Usage Rules</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                    <li>• Minimum size: 32px height</li>
                    <li>• Clear space: 1x logo height on all sides</li>
                    <li>• Do not stretch, rotate, or add effects</li>
                    <li>• Use approved color variations only</li>
                  </ul>
                </Card>
              </div>
            )}

            {/* Imagery Section */}
            {activeSection === 'imagery' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Photography Style</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', label: 'Product shots' },
                      { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', label: 'Lifestyle' },
                      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300', label: 'Detail close-ups' },
                    ].map((img, idx) => (
                      <div key={idx}>
                        <div className="aspect-square rounded-xl overflow-hidden mb-2">
                          <img src={img.src} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{img.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="p-4">
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-3">Image Guidelines</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-600 font-medium mb-1">✓ Do</p>
                      <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
                        <li>• High contrast, vibrant colors</li>
                        <li>• Clean, minimal backgrounds</li>
                        <li>• Natural lighting preferred</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-red-600 font-medium mb-1">✗ Don't</p>
                      <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
                        <li>• Overly filtered images</li>
                        <li>• Cluttered compositions</li>
                        <li>• Low resolution assets</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
