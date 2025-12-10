import React, { useState } from 'react';
import { 
  Home, Edit3, ShoppingBag, Users, Settings, 
  LogOut, Sun, Moon, BarChart3, Award, Palette, FolderOpen,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { PlanBadge } from './Subscription/PlanBadge';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, onSignOut, children }) => {
  const { trans, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: trans.nav.home },
    { id: 'editor', icon: Edit3, label: trans.nav.editor },
    { id: 'assets', icon: FolderOpen, label: trans.nav.assets },
    { id: 'brandkit', icon: Palette, label: trans.brandkit.title },
    { id: 'marketplace', icon: ShoppingBag, label: trans.nav.marketplace },
    { id: 'team', icon: Users, label: trans.nav.team },
    { id: 'analytics', icon: BarChart3, label: trans.nav.analytics },
    { id: 'creator', icon: Award, label: trans.creator.dashboard },
  ];

  // In Editor mode, we might want to hide the main navigation on mobile for immersion
  const isEditor = currentView === 'editor';

  return (
    <div className="flex h-screen w-screen bg-light-bg dark:bg-dark-bg text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className={`hidden md:flex ${isSidebarCollapsed ? 'w-16' : 'w-64'} border-r border-zinc-200 dark:border-dark-border bg-white dark:bg-dark-surface flex-col z-20 transition-all duration-300 relative`}>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 z-30 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-repix-500 hover:border-repix-500 transition-colors shadow-sm"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        {/* Brand & Toggles */}
        <div className={`h-16 flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-zinc-200 dark:border-dark-border`}>
           <div 
             className="flex items-center cursor-pointer group select-none"
             onClick={() => onChangeView('home')}
             title="Go to Home"
           >
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-repix-500 to-accent-blue flex items-center justify-center shadow-lg shadow-repix-500/20 group-hover:shadow-repix-500/40 transition-shadow">
               <Sun size={18} className="text-white fill-white" />
             </div>
             {!isSidebarCollapsed && (
               <div className="ml-2">
                 <span className="font-bold text-lg tracking-tight leading-none block bg-gradient-to-r from-pink-600 to-repix-600 bg-clip-text text-transparent dark:text-white group-hover:text-repix-500 transition-colors">Repix</span>
                 <span className="text-[10px] text-zinc-400 font-medium tracking-wider">AI EDITOR</span>
               </div>
             )}
           </div>
           
           {!isSidebarCollapsed && (
             <div className="flex gap-2">
               <button 
                  onClick={toggleTheme}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
               >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
               </button>
               <button 
                 onClick={toggleLanguage}
                 className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 transition-colors hover:border-repix-500/50"
               >
                 <span className={`text-[10px] font-bold ${language === 'vi' ? 'text-repix-500' : 'text-zinc-500'}`}>VI</span>
                 <span className="text-[10px] text-zinc-300 dark:text-zinc-700">|</span>
                 <span className={`text-[10px] font-bold ${language === 'en' ? 'text-repix-500' : 'text-zinc-500'}`}>EN</span>
               </button>
             </div>
           )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 ${isSidebarCollapsed ? 'p-2' : 'p-4'} space-y-1`}>
           {navItems.map(item => (
             <button
               key={item.id}
               onClick={() => onChangeView(item.id as ViewState)}
               title={isSidebarCollapsed ? item.label : undefined}
               className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} ${isSidebarCollapsed ? 'p-3' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors ${
                 currentView === item.id 
                   ? 'animated-border bg-zinc-100 dark:bg-zinc-800 text-repix-600 dark:text-white' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
               }`}
             >
               <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-3'}`}>
                 <item.icon size={18} className={currentView === item.id ? 'text-repix-500' : ''} />
                 {!isSidebarCollapsed && item.label}
               </div>
               {!isSidebarCollapsed && currentView === item.id && <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-repix-500"></div>}
             </button>
           ))}
        </nav>

        {/* Bottom User Area */}
        <div className={`${isSidebarCollapsed ? 'p-2' : 'p-4'} border-t border-zinc-200 dark:border-dark-border bg-zinc-50 dark:bg-zinc-900/30`}>
           {/* Plan Badge */}
           {!isSidebarCollapsed && <PlanBadge className="mb-4" />}
           
           <div 
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors group`}
            onClick={() => onChangeView('profile')}
            title={isSidebarCollapsed ? 'Profile' : undefined}
           >
              <div className={`${isSidebarCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gradient-to-tr from-pink-500 via-repix-500 to-accent-blue p-0.5`}>
                 <img src="https://picsum.photos/seed/user/100/100" className="w-full h-full rounded-full border-2 border-white dark:border-zinc-900" alt="User" />
              </div>
              {!isSidebarCollapsed && (
                <>
                  <div className="flex-1 overflow-hidden">
                     <h4 className="text-sm font-semibold truncate text-zinc-900 dark:text-white group-hover:text-repix-500 transition-colors">Lương So Cute</h4>
                     <p className="text-xs text-zinc-500 truncate">Pro Member</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeView('settings');
                    }}
                    className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Settings size={16} className="text-zinc-400 hover:text-repix-500" />
                  </button>
                </>
              )}
           </div>
           <div 
             onClick={onSignOut}
             className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'} ${isSidebarCollapsed ? 'p-3' : 'px-3 py-2'} rounded-lg bg-white border border-zinc-200 dark:border-0 dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors group`}
             title={isSidebarCollapsed ? trans.nav.signOut : undefined}
           >
              <LogOut size={16} className="text-zinc-400 group-hover:text-red-500" />
              {!isSidebarCollapsed && <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-red-500">{trans.nav.signOut}</span>}
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 relative overflow-hidden flex flex-col bg-light-bg dark:bg-dark-bg ${isEditor ? 'mb-0' : 'mb-16 md:mb-0'}`}>
         {children}
      </main>

      {/* Mobile Bottom Navigation - Hidden on Desktop & Hidden in Editor View */}
      {!isEditor && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around z-50 px-2 pb-safe transition-all duration-300">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform rounded-lg ${
                currentView === item.id ? 'animated-border text-repix-500' : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <item.icon size={22} className={currentView === item.id ? 'fill-current opacity-20' : ''} strokeWidth={currentView === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button 
             onClick={() => onChangeView('profile')}
             className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform rounded-lg ${
                currentView === 'profile' ? 'animated-border text-repix-500' : 'text-zinc-400 dark:text-zinc-500'
              }`}
          >
             <div className="w-6 h-6 rounded-full overflow-hidden border border-current">
                <img src="https://picsum.photos/seed/user/100/100" className="w-full h-full object-cover" />
             </div>
             <span className="text-[10px] font-medium">Me</span>
          </button>
        </nav>
      )}

    </div>
  );
};