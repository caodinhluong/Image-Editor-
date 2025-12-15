import React, { useState } from 'react';
import {
  Trash2, RotateCcw, AlertTriangle, Clock, Download,
  X, Share2, Copy, Check, Calendar
} from 'lucide-react';
import { Button, Badge } from '../../ui/UIComponents';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TrashItem {
  id: string;
  name: string;
  thumbnail: string;
  type: 'image' | 'project';
  deletedAt: string;
  size: string;
  expiresIn: string;
  originalFolder: string;
}

export const TrashView: React.FC = () => {
  const { language } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  const trashItems: TrashItem[] = [
    { id: '1', name: 'Old_Banner_Draft.png', thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600', type: 'image', deletedAt: '2024-12-13', size: '2.1 MB', expiresIn: '27 days', originalFolder: 'My Resources' },
    { id: '2', name: 'Unused_Product_Shot.jpg', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', type: 'image', deletedAt: '2024-12-12', size: '1.8 MB', expiresIn: '26 days', originalFolder: 'AI Generated' },
    { id: '3', name: 'Test_Project.psd', thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600', type: 'project', deletedAt: '2024-12-10', size: '15.4 MB', expiresIn: '24 days', originalFolder: 'My Resources' },
    { id: '4', name: 'Summer_Campaign.png', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600', type: 'image', deletedAt: '2024-12-09', size: '3.2 MB', expiresIn: '23 days', originalFolder: 'AI Generated' },
    { id: '5', name: 'Logo_Variation_3.png', thumbnail: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600', type: 'image', deletedAt: '2024-12-08', size: '0.8 MB', expiresIn: '22 days', originalFolder: 'My Resources' },
  ];

  const handleRestore = (id: string) => {
    console.log('Restoring:', id);
    setSelectedItem(null);
  };

  const handlePermanentDelete = (id: string) => {
    console.log('Permanently deleting:', id);
    setSelectedItem(null);
  };

  const handleEmptyTrash = () => {
    console.log('Emptying trash');
    setShowEmptyConfirm(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Trash2 size={14} className="text-red-500" />
            <span className="text-sm font-bold text-red-500">{trashItems.length}</span>
            <span className="text-xs text-red-400">{language === 'vi' ? 'mục' : 'items'}</span>
          </div>
          <span className="text-xs text-zinc-500">
            {language === 'vi' ? 'Tự động xóa sau 30 ngày' : 'Auto-delete after 30 days'}
          </span>
        </div>

        {trashItems.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            onClick={() => setShowEmptyConfirm(true)}
          >
            <Trash2 size={14} />
            {language === 'vi' ? 'Dọn thùng rác' : 'Empty Trash'}
          </Button>
        )}
      </div>

      {/* Masonry Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-100 dark:bg-zinc-900/50">
        {trashItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Thùng rác trống' : 'Trash is empty'}
            </h3>
            <p className="text-sm text-zinc-500 max-w-xs">
              {language === 'vi' ? 'Các mục đã xóa sẽ xuất hiện ở đây' : 'Deleted items will appear here'}
            </p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
            {trashItems.map(item => (
              <div
                key={item.id}
                className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-800"
                onClick={() => setSelectedItem(item)}
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.name} 
                  className="w-full h-auto object-cover opacity-70 transition-all duration-300 group-hover:opacity-90 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Top Actions */}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRestore(item.id); }}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white transition-colors"
                      title={language === 'vi' ? 'Khôi phục' : 'Restore'}
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePermanentDelete(item.id); }}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      title={language === 'vi' ? 'Xóa vĩnh viễn' : 'Delete Forever'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Expires Badge */}
                    <Badge className="mb-2 bg-amber-500/90 text-white text-[10px] backdrop-blur-sm">
                      <Clock size={10} className="mr-1" />
                      {language === 'vi' ? `Còn ${item.expiresIn}` : `${item.expiresIn} left`}
                    </Badge>
                    
                    {/* Name */}
                    <p className="text-white text-xs font-medium truncate mb-1">
                      {item.name}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.deletedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Always visible expires indicator */}
                <div className="absolute top-2 left-2">
                  <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                    <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                      <Clock size={10} />
                      {item.expiresIn}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <TrashDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRestore={() => handleRestore(selectedItem.id)}
          onDelete={() => handlePermanentDelete(selectedItem.id)}
        />
      )}

      {/* Empty Trash Confirmation Modal */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white text-center mb-2">
              {language === 'vi' ? 'Dọn thùng rác?' : 'Empty Trash?'}
            </h3>
            <p className="text-sm text-zinc-500 text-center mb-6">
              {language === 'vi' 
                ? `${trashItems.length} mục sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.`
                : `${trashItems.length} items will be permanently deleted. This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEmptyConfirm(false)}>
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleEmptyTrash}>
                {language === 'vi' ? 'Xóa tất cả' : 'Delete All'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Trash Detail Modal Component
interface TrashDetailModalProps {
  item: TrashItem;
  onClose: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

const TrashDetailModal: React.FC<TrashDetailModalProps> = ({ item, onClose, onRestore, onDelete }) => {
  const { language } = useLanguage();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
        {/* Left - Image */}
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-6 relative">
          <img 
            src={item.thumbnail} 
            alt={item.name} 
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl opacity-80"
          />
          
          {/* Deleted Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-white px-3 py-1.5 text-sm">
              <Trash2 size={14} className="mr-1.5" />
              {language === 'vi' ? 'Đã xóa' : 'Deleted'}
            </Badge>
          </div>
        </div>

        {/* Right - Info Panel */}
        <div className="w-[360px] flex flex-col border-l border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate pr-2">{item.name}</h3>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <X size={18} className="text-zinc-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Warning */}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <Clock size={14} />
                <span className="text-sm font-medium">
                  {language === 'vi' ? `Còn ${item.expiresIn}` : `${item.expiresIn} remaining`}
                </span>
              </div>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                {language === 'vi' 
                  ? 'Mục này sẽ bị xóa vĩnh viễn sau thời gian trên'
                  : 'This item will be permanently deleted after this time'}
              </p>
            </div>

            {/* File Info */}
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                {language === 'vi' ? 'Thông tin' : 'File Info'}
              </span>
              <div className="space-y-2">
                {[
                  { label: language === 'vi' ? 'Loại' : 'Type', value: item.type === 'image' ? 'Image' : 'Project' },
                  { label: language === 'vi' ? 'Kích thước' : 'Size', value: item.size },
                  { label: language === 'vi' ? 'Ngày xóa' : 'Deleted', value: item.deletedAt },
                  { label: language === 'vi' ? 'Thư mục gốc' : 'Original Folder', value: item.originalFolder },
                ].map((info, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <span className="text-sm text-zinc-500">{info.label}</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <Button 
              onClick={onRestore}
              className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white gap-2"
            >
              <RotateCcw size={16} />
              {language === 'vi' ? 'Khôi phục' : 'Restore'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-10 gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} />
              {language === 'vi' ? 'Xóa vĩnh viễn' : 'Delete Forever'}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h4 className="text-center font-semibold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Xóa vĩnh viễn?' : 'Delete Forever?'}
            </h4>
            <p className="text-sm text-zinc-500 text-center mb-4">
              {language === 'vi' ? 'Hành động này không thể hoàn tác.' : 'This action cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={onDelete}>
                {language === 'vi' ? 'Xóa' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
