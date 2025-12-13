import React from 'react';
import { Mail, ChevronRight, Plus } from 'lucide-react';
import { Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { PendingInvite } from './types';

interface PendingInvitesScreenProps {
  invites: PendingInvite[];
  onSelectInvite: (invite: PendingInvite) => void;
  onCreateSpace: () => void;
  hasOwnSpace: boolean;
}

export const PendingInvitesScreen: React.FC<PendingInvitesScreenProps> = ({ 
  invites, 
  onSelectInvite, 
  onCreateSpace,
  hasOwnSpace 
}) => {
  const { language } = useLanguage();

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {language === 'vi' ? 'Lời mời tham gia' : 'Pending Invitations'}
          </h1>
          <p className="text-zinc-500">
            {language === 'vi' 
              ? `Bạn có ${invites.length} lời mời đang chờ`
              : `You have ${invites.length} pending invitation${invites.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Invites List */}
        <div className="space-y-4 mb-8">
          {invites.map((invite) => (
            <Card 
              key={invite.id}
              className="p-4 hover:border-repix-500 transition-colors cursor-pointer"
              onClick={() => onSelectInvite(invite)}
            >
              <div className="flex items-center gap-4">
                {/* Space Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {invite.spaceName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{invite.spaceName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={invite.inviterAvatar} className="w-5 h-5 rounded-full" alt="" />
                    <span className="text-sm text-zinc-500 truncate">
                      {language === 'vi' ? 'Mời bởi' : 'Invited by'} {invite.inviterName}
                    </span>
                  </div>
                </div>

                {/* Stats & Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">{invite.memberCount}</div>
                    <div className="text-xs text-zinc-400">{language === 'vi' ? 'thành viên' : 'members'}</div>
                  </div>
                  <ChevronRight size={20} className="text-zinc-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-sm text-zinc-400">{language === 'vi' ? 'hoặc' : 'or'}</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Create Own Space */}
        {!hasOwnSpace && (
          <Card className="p-6 border-dashed border-2 hover:border-repix-500 transition-colors cursor-pointer" onClick={onCreateSpace}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Plus size={24} className="text-zinc-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Tạo Space của riêng bạn' : 'Create your own Space'}
                </h3>
                <p className="text-sm text-zinc-500">
                  {language === 'vi' ? 'Bắt đầu team workspace mới' : 'Start a new team workspace'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
