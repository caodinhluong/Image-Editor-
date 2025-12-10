import React from 'react';
import { 
  Image, FolderOpen, Search, Users, ShoppingBag, 
  Sparkles, FileText, Bell, Heart, MessageSquare,
  Plus, Upload, Wand2
} from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface EmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
  actionLabelVi?: string;
}

// No Images
export const NoImagesState: React.FC<EmptyStateProps> = ({ onAction, actionLabel, actionLabelVi }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-repix-500/20 to-pink-500/20 flex items-center justify-center mb-6">
        <Image size={40} className="text-repix-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Chưa có ảnh nào' : 'No Images Yet'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {language === 'vi' 
          ? 'Bắt đầu bằng cách tải lên ảnh đầu tiên hoặc tạo ảnh mới với AI'
          : 'Get started by uploading your first image or creating one with AI'
        }
      </p>
      {onAction && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onAction} className="gap-2">
            <Upload size={18} />
            {language === 'vi' ? 'Tải lên' : 'Upload'}
          </Button>
          <Button onClick={onAction} className="gap-2">
            <Sparkles size={18} />
            {language === 'vi' ? 'Tạo với AI' : 'Create with AI'}
          </Button>
        </div>
      )}
    </div>
  );
};

// Empty Folder
export const EmptyFolderState: React.FC<EmptyStateProps> = ({ onAction }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
        <FolderOpen size={40} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Thư mục trống' : 'Empty Folder'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {language === 'vi' 
          ? 'Thư mục này chưa có tệp nào. Thêm tệp để bắt đầu.'
          : 'This folder is empty. Add files to get started.'
        }
      </p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus size={18} />
          {language === 'vi' ? 'Thêm tệp' : 'Add Files'}
        </Button>
      )}
    </div>
  );
};

// No Search Results
export const NoSearchResultsState: React.FC<{ query?: string }> = ({ query }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 flex items-center justify-center mb-6">
        <Search size={40} className="text-zinc-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Không tìm thấy kết quả' : 'No Results Found'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
        {query ? (
          language === 'vi' 
            ? `Không tìm thấy kết quả cho "${query}". Thử từ khóa khác.`
            : `No results found for "${query}". Try different keywords.`
        ) : (
          language === 'vi' 
            ? 'Thử tìm kiếm với từ khóa khác'
            : 'Try searching with different keywords'
        )}
      </p>
    </div>
  );
};

// No Team Members
export const NoTeamMembersState: React.FC<EmptyStateProps> = ({ onAction }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6">
        <Users size={40} className="text-purple-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Chưa có thành viên' : 'No Team Members'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {language === 'vi' 
          ? 'Mời thành viên để cộng tác trên các dự án'
          : 'Invite team members to collaborate on projects'
        }
      </p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus size={18} />
          {language === 'vi' ? 'Mời thành viên' : 'Invite Members'}
        </Button>
      )}
    </div>
  );
};

// No Templates
export const NoTemplatesState: React.FC<EmptyStateProps> = ({ onAction }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6">
        <ShoppingBag size={40} className="text-amber-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Chưa có template' : 'No Templates'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {language === 'vi' 
          ? 'Tạo template đầu tiên để bán trên marketplace'
          : 'Create your first template to sell on the marketplace'
        }
      </p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <Wand2 size={18} />
          {language === 'vi' ? 'Tạo template' : 'Create Template'}
        </Button>
      )}
    </div>
  );
};

// No Projects
export const NoProjectsState: React.FC<EmptyStateProps> = ({ onAction }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6">
        <FileText size={40} className="text-emerald-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Chưa có dự án' : 'No Projects'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {language === 'vi' 
          ? 'Tạo dự án đầu tiên để bắt đầu làm việc'
          : 'Create your first project to get started'
        }
      </p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus size={18} />
          {language === 'vi' ? 'Tạo dự án' : 'Create Project'}
        </Button>
      )}
    </div>
  );
};

// No Notifications
export const NoNotificationsState: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 flex items-center justify-center mb-4">
        <Bell size={32} className="text-zinc-500" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Không có thông báo' : 'No Notifications'}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
        {language === 'vi' 
          ? 'Bạn đã xem hết tất cả thông báo'
          : "You're all caught up!"
        }
      </p>
    </div>
  );
};

// No Comments
export const NoCommentsState: React.FC<EmptyStateProps> = ({ onAction }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
        <MessageSquare size={32} className="text-blue-500" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Chưa có bình luận' : 'No Comments'}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-4">
        {language === 'vi' 
          ? 'Hãy là người đầu tiên bình luận'
          : 'Be the first to leave a comment'
        }
      </p>
    </div>
  );
};

// No Favorites
export const NoFavoritesState: React.FC<EmptyStateProps> = ({ onAction }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mb-6">
        <Heart size={40} className="text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {language === 'vi' ? 'Chưa có mục yêu thích' : 'No Favorites'}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        {language === 'vi' 
          ? 'Nhấn vào biểu tượng trái tim để lưu mục yêu thích'
          : 'Click the heart icon to save your favorites'
        }
      </p>
      {onAction && (
        <Button variant="outline" onClick={onAction} className="gap-2">
          <Search size={18} />
          {language === 'vi' ? 'Khám phá' : 'Explore'}
        </Button>
      )}
    </div>
  );
};
