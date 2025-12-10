import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  titleVi: string;
  shortcuts: {
    keys: string[];
    description: string;
    descriptionVi: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'General',
    titleVi: 'Chung',
    shortcuts: [
      { keys: ['Ctrl', 'S'], description: 'Save project', descriptionVi: 'Lưu dự án' },
      { keys: ['Ctrl', 'Z'], description: 'Undo', descriptionVi: 'Hoàn tác' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo', descriptionVi: 'Làm lại' },
      { keys: ['Ctrl', 'C'], description: 'Copy', descriptionVi: 'Sao chép' },
      { keys: ['Ctrl', 'V'], description: 'Paste', descriptionVi: 'Dán' },
      { keys: ['Delete'], description: 'Delete selected', descriptionVi: 'Xóa đã chọn' },
      { keys: ['Esc'], description: 'Deselect / Cancel', descriptionVi: 'Bỏ chọn / Hủy' },
    ]
  },
  {
    title: 'Tools',
    titleVi: 'Công cụ',
    shortcuts: [
      { keys: ['V'], description: 'Move tool', descriptionVi: 'Công cụ di chuyển' },
      { keys: ['M'], description: 'Object select', descriptionVi: 'Chọn đối tượng' },
      { keys: ['G'], description: 'Generative fill', descriptionVi: 'Tạo sinh AI' },
      { keys: ['E'], description: 'Magic erase', descriptionVi: 'Xóa thông minh' },
      { keys: ['C'], description: 'Crop tool', descriptionVi: 'Công cụ cắt' },
      { keys: ['B'], description: 'Remove background', descriptionVi: 'Xóa nền' },
      { keys: ['U'], description: 'Upscale 4K', descriptionVi: 'Nâng cấp 4K' },
      { keys: ['S'], description: 'Style transfer', descriptionVi: 'Chuyển style' },
    ]
  },
  {
    title: 'View',
    titleVi: 'Xem',
    shortcuts: [
      { keys: ['Ctrl', '+'], description: 'Zoom in', descriptionVi: 'Phóng to' },
      { keys: ['Ctrl', '-'], description: 'Zoom out', descriptionVi: 'Thu nhỏ' },
      { keys: ['Ctrl', '0'], description: 'Fit to screen', descriptionVi: 'Vừa màn hình' },
      { keys: ['Ctrl', '1'], description: 'Actual size (100%)', descriptionVi: 'Kích thước thực (100%)' },
      { keys: ['Space'], description: 'Pan (hold)', descriptionVi: 'Kéo canvas (giữ)' },
      { keys: ['H'], description: 'Toggle history panel', descriptionVi: 'Bật/tắt lịch sử' },
      { keys: ['L'], description: 'Toggle layers panel', descriptionVi: 'Bật/tắt layers' },
    ]
  },
  {
    title: 'Layers',
    titleVi: 'Layers',
    shortcuts: [
      { keys: ['Ctrl', 'Shift', 'N'], description: 'New layer', descriptionVi: 'Layer mới' },
      { keys: ['Ctrl', 'J'], description: 'Duplicate layer', descriptionVi: 'Nhân đôi layer' },
      { keys: ['Ctrl', '['], description: 'Send backward', descriptionVi: 'Đưa xuống dưới' },
      { keys: ['Ctrl', ']'], description: 'Bring forward', descriptionVi: 'Đưa lên trên' },
      { keys: ['Ctrl', 'G'], description: 'Group layers', descriptionVi: 'Nhóm layers' },
      { keys: ['Ctrl', 'E'], description: 'Merge layers', descriptionVi: 'Gộp layers' },
    ]
  },
  {
    title: 'Export',
    titleVi: 'Xuất',
    shortcuts: [
      { keys: ['Ctrl', 'Shift', 'E'], description: 'Quick export', descriptionVi: 'Xuất nhanh' },
      { keys: ['Ctrl', 'Shift', 'S'], description: 'Export as...', descriptionVi: 'Xuất dưới dạng...' },
      { keys: ['Ctrl', 'P'], description: 'Print', descriptionVi: 'In' },
    ]
  }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <Keyboard className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Phím tắt' : 'Keyboard Shortcuts'}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {language === 'vi' ? 'Làm việc nhanh hơn với phím tắt' : 'Work faster with keyboard shortcuts'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-100px)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcutGroups.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Command size={14} className="text-repix-500" />
                  {language === 'vi' ? group.titleVi : group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-repix-500/50 transition-colors"
                    >
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {language === 'vi' ? shortcut.descriptionVi : shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded shadow-sm text-zinc-700 dark:text-zinc-300">
                              {key}
                            </kbd>
                            {kIdx < shortcut.keys.length - 1 && (
                              <span className="text-zinc-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            {language === 'vi' 
              ? 'Nhấn ? bất cứ lúc nào để mở bảng phím tắt này'
              : 'Press ? anytime to open this shortcuts panel'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
