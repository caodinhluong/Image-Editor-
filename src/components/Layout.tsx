import React, { useState } from 'react';
import { 
  Home, Edit3, ShoppingBag, Users, Settings, 
  LogOut, Sun, Moon, BarChart3, Award, Palette, FolderOpen,
  ChevronLeft, ChevronRight, Sparkles, Wand2
} from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { PlanBadge } from './Subscription/PlanBadge';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut?: () => void;
  onGoToLanding?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, onSignOut, onGoToLanding, children }) => {
  const { trans, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: trans.nav.home },
    // { id: 'editor', icon: Edit3, label: trans.nav.editor }, // Temporarily hidden
    { id: 'photoshoot', icon: Sparkles, label: language === 'vi' ? 'Bộ Ảnh Thông Minh' : 'Smart Photoshoot', isNew: true },
    { id: 'creative-stations', icon: Wand2, label: language === 'vi' ? 'Quầy Sáng Tạo' : 'Creative Stations', isNew: true },
    { id: 'assets', icon: FolderOpen, label: trans.nav.assets },
    // { id: 'brandkit', icon: Palette, label: trans.brandkit.title }, // Temporarily hidden
    { id: 'marketplace', icon: ShoppingBag, label: trans.nav.marketplace },
    // { id: 'team', icon: Users, label: trans.nav.team }, // Temporarily hidden
    { id: 'analytics', icon: BarChart3, label: trans.nav.analytics },
  ];

  // In Editor mode, we might want to hide the main navigation on mobile for immersion
  const isEditor = currentView === 'editor';

  return (
    <div className="flex h-screen w-screen bg-light-bg dark:bg-dark-bg text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      {/* Collapse Toggle Button - Outside sidebar for proper z-index */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`hidden md:flex fixed top-20 z-[50] w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center text-zinc-500 hover:text-repix-500 hover:border-repix-500 shadow-md hover:shadow-lg hover:scale-110 active:scale-95`}
        style={{
          left: isSidebarCollapsed ? '52px' : '276px',
          transition: 'left 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms ease',
          willChange: 'left'
        }}
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span 
          className="flex items-center justify-center"
          style={{
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isSidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
          }}
        >
          <ChevronRight size={14} />
        </span>
      </button>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside 
        className={`hidden md:flex ${isSidebarCollapsed ? 'w-16' : 'w-72'} border-r border-zinc-200 dark:border-dark-border bg-white dark:bg-dark-surface flex-col z-20 relative overflow-hidden`}
        style={{
          transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'width'
        }}
      >
        
        {/* Brand & Toggles */}
        <div 
          className="h-16 flex items-center border-b border-zinc-200 dark:border-dark-border overflow-hidden"
          style={{
            padding: isSidebarCollapsed ? '0 8px' : '0 16px',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            transition: 'padding 400ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
           <div 
             className="flex items-center cursor-pointer group select-none"
             onClick={() => onGoToLanding?.()}
             title="Go to Landing Page"
           >
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-repix-500 to-accent-blue flex items-center justify-center shadow-lg shadow-repix-500/20 group-hover:shadow-repix-500/40 transition-shadow flex-shrink-0">
               <Sun size={18} className="text-white fill-white" />
             </div>
             {!isSidebarCollapsed && (
               <div className="ml-2">
                 <span className="font-bold text-lg tracking-tight leading-none block bg-gradient-to-r from-pink-600 to-repix-600 bg-clip-text text-transparent dark:text-white group-hover:text-repix-500 transition-colors whitespace-nowrap">Repix</span>
                 <span className="text-[10px] text-zinc-400 font-medium tracking-wider whitespace-nowrap">AI EDITOR</span>
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
        <nav 
          className="flex-1 space-y-1 overflow-hidden"
          style={{
            padding: isSidebarCollapsed ? '8px' : '16px',
            transition: 'padding 400ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
           {navItems.map((item) => (
             <button
               key={item.id}
               onClick={() => {
                 onChangeView(item.id as ViewState);
                 setIsSidebarCollapsed(false);
               }}
               title={isSidebarCollapsed ? item.label : undefined}
               className={`w-full flex items-center rounded-lg text-sm font-medium overflow-hidden ${
                 currentView === item.id 
                   ? 'animated-border bg-zinc-100 dark:bg-zinc-800 text-repix-600 dark:text-white' 
                   : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
               }`}
               style={{
                 padding: isSidebarCollapsed ? '12px' : '10px 12px',
                 justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                 transition: 'background-color 200ms ease, padding 400ms cubic-bezier(0.4, 0, 0.2, 1)'
               }}
             >
               <div className="flex items-center gap-3 min-w-0">
                 <item.icon 
                   size={18} 
                   className={`flex-shrink-0 ${currentView === item.id ? 'text-repix-500' : item.id === 'photoshoot' ? 'text-purple-500' : ''}`}
                 />
                 {!isSidebarCollapsed && (
                   <>
                     <span className="whitespace-nowrap truncate">{item.label}</span>
                     {(item as any).isNew && (
                       <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex-shrink-0">NEW</span>
                     )}
                   </>
                 )}
               </div>
               {!isSidebarCollapsed && currentView === item.id && (
                 <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-repix-500 flex-shrink-0" />
               )}
             </button>
           ))}
        </nav>

        {/* Bottom User Area */}
        <div 
          className="border-t border-zinc-200 dark:border-dark-border bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden"
          style={{
            padding: isSidebarCollapsed ? '8px' : '16px',
            transition: 'padding 400ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
           {/* Plan Badge */}
           {!isSidebarCollapsed && <PlanBadge className="mb-4" />}
           
           <div 
            className={`flex items-center mb-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors group ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
            onClick={() => {
              onChangeView('profile');
              setIsSidebarCollapsed(false);
            }}
            title={isSidebarCollapsed ? 'Profile' : undefined}
           >
              <div className={`rounded-full bg-gradient-to-tr from-pink-500 via-repix-500 to-accent-blue p-0.5 flex-shrink-0 ${isSidebarCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
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
                      setIsSidebarCollapsed(false);
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
             className={`flex items-center rounded-lg bg-white border border-zinc-200 dark:border-0 dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors group ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-2 px-3 py-2'}`}
             title={isSidebarCollapsed ? trans.nav.signOut : undefined}
           >
              <LogOut size={16} className="text-zinc-400 group-hover:text-red-500 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-red-500">{trans.nav.signOut}</span>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 relative overflow-hidden flex flex-col bg-light-bg dark:bg-dark-bg ${isEditor ? 'mb-0' : 'mb-16 md:mb-0'}`}
        onClick={() => setIsSidebarCollapsed(true)}
      >
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