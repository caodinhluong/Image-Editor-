import React from 'react';
import { Users, Shield, Sparkles, Share2, Cpu, Crown } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface UpgradeToTeamScreenProps {
  onUpgrade: () => void;
}

export const UpgradeToTeamScreen: React.FC<UpgradeToTeamScreenProps> = ({ onUpgrade }) => {
  const { language } = useLanguage();
  const { triggerUpgradeModal } = useSubscription();

  const features = [
    { icon: Users, text: language === 'vi' ? 'Không gian làm việc nhóm' : 'Team workspace & collaboration' },
    { icon: Shield, text: language === 'vi' ? 'Bảo mật doanh nghiệp' : 'Enterprise-grade security' },
    { icon: Sparkles, text: language === 'vi' ? 'AI không giới hạn' : 'Unlimited AI generations' },
    { icon: Share2, text: language === 'vi' ? 'Chia sẻ dự án & preset' : 'Share projects & presets' },
    { icon: Cpu, text: language === 'vi' ? 'Huấn luyện AI theo brand' : 'Custom AI model training' },
  ];

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-repix-500/30">
          <Users size={48} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          {language === 'vi' ? 'Team Space' : 'Team Space'}
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          {language === 'vi' 
            ? 'Nâng cấp lên gói Team để mở khóa không gian làm việc nhóm và cộng tác với đội ngũ của bạn.'
            : 'Upgrade to Team plan to unlock team workspace and collaborate with your team.'}
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left max-w-lg mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center">
                <feature.icon size={20} className="text-repix-600 dark:text-repix-400" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button 
          size="lg" 
          onClick={() => triggerUpgradeModal('teamWorkspace')}
          className="px-10 py-4 text-lg shadow-xl shadow-repix-500/20"
        >
          <Crown size={20} className="mr-2" />
          {language === 'vi' ? 'Nâng cấp lên Team' : 'Upgrade to Team'}
        </Button>

        <p className="mt-4 text-sm text-zinc-400">
          {language === 'vi' ? 'Liên hệ để nhận báo giá phù hợp' : 'Contact us for custom pricing'}
        </p>
      </div>
    </div>
  );
};
