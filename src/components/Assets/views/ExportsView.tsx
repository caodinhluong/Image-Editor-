import React from 'react';
import {
  Download, FileImage, Calendar, MoreHorizontal, Eye, Trash2,
  Image, FileType, Maximize, CheckCircle2
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ExportedAsset {
  id: string;
  name: string;
  thumbnail: string;
  format: 'PNG' | 'JPG' | 'WEBP' | 'PDF';
  quality: number;
  resolution: string;
  size: string;
  exportedAt: string;
}

export const ExportsView: React.FC = () => {
  const { language } = useLanguage();

  const exports: ExportedAsset[] = [
    { id: '1', name: 'Product_Hero_Final.png', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', format: 'PNG', quality: 100, resolution: '4K', size: '8.4 MB', exportedAt: '2024-12-10' },
    { id: '2', name: 'Banner_Campaign.jpg', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300', format: 'JPG', quality: 90, resolution: '1080p', size: '1.2 MB', exportedAt: '2024-12-09' },
    { id: '3', name: 'Social_Post.webp', thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', format: 'WEBP', quality: 85, resolution: '1080x1080', size: '0.8 MB', exportedAt: '2024-12-08' },
    { id: '4', name: 'Catalog_Page.pdf', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', format: 'PDF', quality: 100, resolution: 'A4', size: '2.1 MB', exportedAt: '2024-12-07' },
  ];

  const getFormatColor = (format: ExportedAsset['format']) => {
    switch (format) {
      case 'PNG': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'JPG': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'WEBP': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'PDF': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Action Bar */}
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 flex items-center justify-between">
        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          {[
            { label: 'PNG', value: '18', color: 'text-blue-500' },
            { label: 'JPG', value: '15', color: 'text-green-500' },
            { label: 'WEBP', value: '10', color: 'text-purple-500' },
            { label: 'PDF', value: '5', color: 'text-red-500' },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-zinc-500">{stat.label}</span>
            </div>
          ))}
        </div>
        <Button size="sm" className="gap-2">
          <Download size={16} />
          {language === 'vi' ? 'Tải tất cả' : 'Download All'}
        </Button>
      </div>

      {/* Content - Table View */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Tên file' : 'File Name'}</th>
                <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Định dạng' : 'Format'}</th>
                <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Chất lượng' : 'Quality'}</th>
                <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Độ phân giải' : 'Resolution'}</th>
                <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Kích thước' : 'Size'}</th>
                <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase">{language === 'vi' ? 'Ngày xuất' : 'Date'}</th>
                <th className="w-20 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {exports.map(asset => (
                <tr key={asset.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={asset.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">{asset.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getFormatColor(asset.format)} text-xs`}>{asset.format}</Badge>
                  </td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{asset.quality}%</td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{asset.resolution}</td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{asset.size}</td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{asset.exportedAt}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
