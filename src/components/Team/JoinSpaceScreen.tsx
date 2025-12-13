import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { PendingInvite } from './types';

interface JoinSpaceScreenProps {
  invite: PendingInvite;
  onJoin: (invite: PendingInvite) => void;
  onDecline: (inviteId: string) => void;
}

export const JoinSpaceScreen: React.FC<JoinSpaceScreenProps> = ({ invite, onJoin, onDecline }) => {
  const { language } = useLanguage();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    setIsJoining(true);
    setTimeout(() => {
      onJoin(invite);
      setIsJoining(false);
    }, 1500);
  };

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          {/* Space Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-repix-500/20">
            {invite.spaceName.charAt(0).toUpperCase()}
          </div>

          {/* Invite Info */}
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {language === 'vi' ? 'Bạn được mời tham gia' : "You're invited to join"}
          </h1>
          <h2 className="text-xl font-semibold text-repix-600 dark:text-repix-400 mb-4">
            {invite.spaceName}
          </h2>

          {/* Inviter */}
          <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <img src={invite.inviterAvatar} className="w-10 h-10 rounded-full" alt={invite.inviterName} />
            <div className="text-left">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">{invite.inviterName}</p>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'đã mời bạn' : 'invited you'} • {invite.invitedAt}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{invite.memberCount}</div>
              <div className="text-xs text-zinc-500">{language === 'vi' ? 'Thành viên' : 'Members'}</div>
            </div>
            <div className="w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">∞</div>
              <div className="text-xs text-zinc-500">Credits</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full h-12 text-base shadow-lg shadow-repix-500/20"
            >
              {isJoining ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  {language === 'vi' ? 'Đang tham gia...' : 'Joining...'}
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  {language === 'vi' ? 'Tham gia Space' : 'Join Space'}
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onDecline(invite.id)}
              className="w-full text-zinc-500"
            >
              {language === 'vi' ? 'Từ chối' : 'Decline'}
            </Button>
          </div>
        </Card>

        {/* Info */}
        <p className="text-center text-xs text-zinc-400 mt-4">
          {language === 'vi' 
            ? 'Bạn sẽ có quyền Editor sau khi tham gia'
            : 'You will have Editor access after joining'}
        </p>
      </div>
    </div>
  );
};
