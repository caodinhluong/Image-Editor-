
import React, { useState } from 'react';
import { Sun, Mail, Lock, User, ArrowLeft, Zap, Crown, Briefcase, Building2, Check } from 'lucide-react';
import { Button, Input, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

type UserType = 'casual' | 'creator' | 'team' | 'enterprise';
type AuthStep = 'auth' | 'user-type';

const userTypes = [
  {
    id: 'casual' as UserType,
    icon: Zap,
    title: 'Casual User',
    titleVi: 'Người dùng cá nhân',
    description: 'Personal projects & hobby editing',
    descVi: 'Dự án cá nhân & chỉnh sửa ảnh',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
  },
  {
    id: 'creator' as UserType,
    icon: Crown,
    title: 'Creator / Seller',
    titleVi: 'Nhà sáng tạo / Bán hàng',
    description: 'Content creation & e-commerce',
    descVi: 'Tạo nội dung & thương mại điện tử',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500',
    recommended: true,
  },
  {
    id: 'team' as UserType,
    icon: Briefcase,
    title: 'Agency / Team',
    titleVi: 'Agency / Nhóm',
    description: 'Collaborate with your team',
    descVi: 'Cộng tác với nhóm của bạn',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
  },
  {
    id: 'enterprise' as UserType,
    icon: Building2,
    title: 'Enterprise',
    titleVi: 'Doanh nghiệp',
    description: 'Large scale & custom solutions',
    descVi: 'Quy mô lớn & giải pháp tùy chỉnh',
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-500/10',
    borderColor: 'border-zinc-500',
  },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLoginSuccess }) => {
  const { trans, language } = useLanguage();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>('auth');
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        // Login goes directly to app
        onLoginSuccess();
      } else {
        // Signup goes to user type selection
        setStep('user-type');
      }
    }, 1500);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
  };

  const handleUserTypeConfirm = () => {
    if (!selectedUserType) return;
    setIsLoading(true);
    // Simulate saving user type
    setTimeout(() => {
      setIsLoading(false);
      // Save to localStorage for demo
      localStorage.setItem('repix_user_type', selectedUserType);
      onLoginSuccess();
    }, 1000);
  };

  // User Type Selection Step
  if (step === 'user-type') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-dark-bg relative overflow-hidden transition-colors duration-300">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="w-full max-w-2xl p-6 z-10">
          <Button variant="ghost" onClick={() => setStep('auth')} className="mb-8 pl-0 hover:bg-transparent hover:text-repix-500">
            <ArrowLeft size={16} className="mr-2" /> {language === 'vi' ? 'Quay lại' : 'Back'}
          </Button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-pink-500 via-repix-500 to-accent-blue flex items-center justify-center shadow-lg shadow-repix-500/30 mb-4">
              <Sun size={24} className="text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {language === 'vi' ? 'Bạn là ai?' : 'What describes you best?'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {language === 'vi' ? 'Chọn nhóm phù hợp để chúng tôi tùy chỉnh trải nghiệm cho bạn' : 'Select your profile so we can personalize your experience'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {userTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedUserType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handleUserTypeSelect(type.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group
                    ${isSelected 
                      ? `${type.borderColor} bg-white dark:bg-zinc-900 shadow-xl` 
                      : 'border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }
                  `}
                >
                  {type.recommended && (
                    <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {language === 'vi' ? 'Phổ biến' : 'Popular'}
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${type.bgColor} ${type.color} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
                        {language === 'vi' ? type.titleVi : type.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {language === 'vi' ? type.descVi : type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className={`p-1 rounded-full ${type.bgColor} ${type.color}`}>
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <Button 
            onClick={handleUserTypeConfirm}
            disabled={!selectedUserType}
            isLoading={isLoading}
            className="w-full h-12 text-base shadow-xl shadow-repix-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'vi' ? 'Tiếp tục' : 'Continue'}
          </Button>

          <p className="text-center text-xs text-zinc-400 mt-4">
            {language === 'vi' ? 'Bạn có thể thay đổi sau trong cài đặt' : 'You can change this later in settings'}
          </p>
        </div>
      </div>
    );
  }

  // Auth Form Step
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-dark-bg relative overflow-hidden transition-colors duration-300">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/20 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-md p-6 z-10">
        <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:bg-transparent hover:text-repix-500">
           <ArrowLeft size={16} className="mr-2" /> Back
        </Button>

        <div className="text-center mb-8">
           <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-pink-500 via-repix-500 to-accent-blue flex items-center justify-center shadow-lg shadow-repix-500/30 mb-4">
              <Sun size={24} className="text-white fill-white" />
           </div>
           <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
             {isLogin ? trans.auth.welcomeBack : trans.auth.createAccount}
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400">
             {trans.auth.enterDetails}
           </p>
        </div>

        <Card className="p-8 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-700 shadow-2xl">
           <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                   <label className="text-xs font-medium text-zinc-500 ml-1">{trans.auth.fullName}</label>
                   <div className="relative">
                      <User className="absolute z-20 left-3 top-2.5 text-zinc-400" size={18} />
                      <Input className="pl-10 h-11" placeholder="Lương đẹp trai" required animated />
                   </div>
                </div>
              )}
              
              <div className="space-y-1">
                 <label className="text-xs font-medium text-zinc-500 ml-1">{trans.auth.email}</label>
                 <div className="relative">
                    <Mail className="absolute z-20 left-3 top-2.5 text-zinc-400" size={18} />
                    <Input className="pl-10 h-11" type="email" placeholder="alex@example.com" required animated />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-medium text-zinc-500 ml-1">{trans.auth.password}</label>
                 <div className="relative">
                    <Lock className="absolute z-20 left-3 top-2.5 text-zinc-400" size={18} />
                    <Input className="pl-10 h-11" type="password" placeholder="••••••••" required animated />
                 </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base shadow-xl shadow-repix-500/20 mt-2" isLoading={isLoading}>
                 {isLogin ? trans.auth.login : trans.auth.continue}
              </Button>
           </form>

           <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                 <span className="bg-white dark:bg-[#1f1f23] px-2 text-zinc-500">{trans.auth.or}</span>
              </div>
           </div>

           <Button variant="outline" className="animated-border w-full h-11 !bg-zinc-900 dark:!bg-zinc-900 hover:!bg-black dark:hover:!bg-black !text-white !border-0">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
              {trans.auth.google}
           </Button>

           <div className="mt-6 text-center text-sm">
              <span className="text-zinc-500">
                {isLogin ? trans.auth.noAccount : trans.auth.haveAccount}
              </span>
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-repix-600 dark:text-repix-400 hover:underline"
              >
                {isLogin ? trans.auth.signup : trans.auth.login}
              </button>
           </div>
        </Card>
      </div>
    </div>
  );
};
