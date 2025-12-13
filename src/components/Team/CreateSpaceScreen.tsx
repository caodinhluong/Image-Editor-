import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Loader2, Users, Link2, FileText, CheckCircle2 } from 'lucide-react';
import { Button, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { TeamSpace } from './types';

interface CreateSpaceScreenProps {
  onCreateSpace: (space: TeamSpace) => void;
}

export const CreateSpaceScreen: React.FC<CreateSpaceScreenProps> = ({ onCreateSpace }) => {
  const { language } = useLanguage();
  const [spaceName, setSpaceName] = useState('');
  const [spaceSlug, setSpaceSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Auto-generate slug from name
  useEffect(() => {
    const slug = spaceName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30);
    setSpaceSlug(slug);
  }, [spaceName]);

  const handleCreate = () => {
    if (!spaceName.trim()) return;
    
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSpace: TeamSpace = {
        id: `space_${Date.now()}`,
        name: spaceName,
        slug: spaceSlug || `space-${Date.now()}`,
        description,
        createdAt: new Date().toISOString(),
        ownerId: 'current_user',
        memberCount: 1,
        inviteLink: `https://repix.ai/join/${spaceSlug || `space-${Date.now()}`}`,
      };
      
      onCreateSpace(newSpace);
      setIsCreating(false);
    }, 1500);
  };

  const isValidSlug = spaceSlug.length >= 3;
  const isValidName = spaceName.trim().length >= 2;

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-6 py-12">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-repix-500 to-violet-500 blur-xl opacity-40" />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-repix-500 to-violet-500 flex items-center justify-center shadow-2xl">
                <Rocket size={36} className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Tạo Team Space' : 'Create Your Team Space'}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              {language === 'vi' 
                ? 'Thiết lập không gian làm việc cho đội ngũ của bạn'
                : 'Set up a workspace for your team to collaborate'}
            </p>
          </div>

          {/* Form Card */}
          <Card className="p-6 md:p-8 shadow-xl border-zinc-200 dark:border-zinc-800">
            <div className="space-y-5">
              {/* Space Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <Users size={14} className="text-repix-500" />
                  {language === 'vi' ? 'Tên Space' : 'Space Name'}
                  <span className="text-red-500">*</span>
                </label>
                <div className={`relative rounded-xl transition-all ${focusedField === 'name' ? 'ring-2 ring-repix-500 ring-offset-2 dark:ring-offset-zinc-900' : ''}`}>
                  <input
                    type="text"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={language === 'vi' ? 'VD: Repix Design Team' : 'e.g. Repix Design Team'}
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none transition-colors"
                    autoFocus
                  />
                  {isValidName && (
                    <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>

              {/* Space URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <Link2 size={14} className="text-repix-500" />
                  {language === 'vi' ? 'URL Space' : 'Space URL'}
                </label>
                <div className={`flex rounded-xl overflow-hidden border transition-all ${focusedField === 'slug' ? 'ring-2 ring-repix-500 ring-offset-2 dark:ring-offset-zinc-900 border-repix-500' : 'border-zinc-200 dark:border-zinc-700'}`}>
                  <span className="flex items-center px-4 text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 whitespace-nowrap font-mono">
                    repix.ai/join/
                  </span>
                  <input
                    type="text"
                    value={spaceSlug}
                    onChange={(e) => setSpaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    onFocus={() => setFocusedField('slug')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your-team"
                    className="flex-1 h-12 px-4 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-mono"
                  />
                  {isValidSlug && (
                    <span className="flex items-center px-3 bg-zinc-50 dark:bg-zinc-900">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-zinc-400" />
                  {language === 'vi' ? 'Đây là link để mời thành viên tham gia' : 'This is the link to invite members'}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <FileText size={14} className="text-repix-500" />
                  {language === 'vi' ? 'Mô tả' : 'Description'}
                  <span className="text-zinc-400 font-normal text-xs">({language === 'vi' ? 'tùy chọn' : 'optional'})</span>
                </label>
                <div className={`rounded-xl transition-all ${focusedField === 'desc' ? 'ring-2 ring-repix-500 ring-offset-2 dark:ring-offset-zinc-900' : ''}`}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setFocusedField('desc')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={language === 'vi' ? 'Mô tả ngắn về team của bạn...' : 'Brief description of your team...'}
                    className="w-full h-28 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none resize-none text-sm"
                  />
                </div>
              </div>

              {/* Create Button */}
              <Button 
                onClick={handleCreate} 
                disabled={!isValidName || isCreating}
                className="w-full h-12 text-base font-semibold shadow-lg shadow-repix-500/20 mt-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {language === 'vi' ? 'Đang tạo...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    {language === 'vi' ? 'Tạo Space' : 'Create Space'}
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Features Preview */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: language === 'vi' ? 'Mời thành viên' : 'Invite members' },
              { icon: Link2, label: language === 'vi' ? 'Chia sẻ link' : 'Share link' },
              { icon: Sparkles, label: language === 'vi' ? 'Cộng tác AI' : 'AI collaboration' },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/30">
                <feature.icon size={16} className="text-repix-500" />
                <span className="text-[10px] text-zinc-500 text-center">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Info */}
          <p className="text-center text-xs text-zinc-400 mt-6">
            {language === 'vi' 
              ? 'Bạn có thể mời thành viên và tùy chỉnh space sau khi tạo'
              : 'You can invite members and customize your space after creation'}
          </p>
        </div>
      </div>
    </div>
  );
};
