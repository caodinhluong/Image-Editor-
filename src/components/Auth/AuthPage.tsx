
import React, { useState } from 'react';
import { Sun, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onLoginSuccess }) => {
  const { trans } = useLanguage();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

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
                      <Input className="pl-10 h-11" placeholder="Alex Creative" required animated />
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
