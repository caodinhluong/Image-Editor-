import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { EditorView } from './components/Editor/EditorView';
import { MarketplaceView } from './components/Marketplace/MarketplaceView';
import { TeamView } from './components/Team/TeamView';
import { ProfileView } from './components/Profile/ProfileView';
import { LandingPage } from './components/Landing/LandingPage';
import { AuthPage } from './components/Auth/AuthPage';
import { ViewState } from './types';
import { 
  Sparkles, ArrowRight, Image as ImageIcon, Scissors, Layers, Maximize2, Wand2, Search, Play,
  ShoppingBag, Camera, Briefcase, Zap, Crown, Check, ShieldCheck, Building2, Star
} from 'lucide-react';
import { Button, Card, Badge } from './components/ui/UIComponents';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// --- Modern Home Dashboard View ---
const HomeView: React.FC<{ onStartEditing: () => void }> = ({ onStartEditing }) => {
  const { trans } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');
  
  // Mock Inspiration Data
  const inspirationImages = [
    { id: 1, src: "https://picsum.photos/seed/cyberpunk/400/600", prompt: "Cyberpunk street with neon lights", author: "@neo_artist" },
    { id: 2, src: "https://picsum.photos/seed/nature/400/400", prompt: "Hyperrealistic forest in morning mist", author: "@eco_love" },
    { id: 3, src: "https://picsum.photos/seed/portrait/400/500", prompt: "Studio portrait with rembrandt lighting", author: "@portrait_pro" },
    { id: 4, src: "https://picsum.photos/seed/arch/400/300", prompt: "Minimalist concrete architecture", author: "@archi_daily" },
  ];

  // Quick Tools (Persona: Casual User)
  const tools = [
    { icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10", label: trans.home.toolTextToImage },
    { icon: Scissors, color: "text-pink-500", bg: "bg-pink-500/10", label: trans.home.toolRemoveBg },
    { icon: Maximize2, color: "text-amber-500", bg: "bg-amber-500/10", label: trans.home.toolUpscale },
    { icon: Wand2, color: "text-repix-500", bg: "bg-repix-500/10", label: trans.home.toolReplace },
  ];

  // Workflows (Persona: E-commerce, Creator, Agency)
  const workflows = [
    { 
      id: 'product', icon: ShoppingBag, 
      title: trans.home.workflowProduct, desc: trans.home.workflowProductDesc,
      color: "from-orange-400 to-pink-500",
      persona: "E-Commerce"
    },
    { 
      id: 'portrait', icon: Camera, 
      title: trans.home.workflowPortrait, desc: trans.home.workflowPortraitDesc,
      color: "from-purple-400 to-blue-500",
      persona: "Photographer"
    },
    { 
      id: 'social', icon: Zap, 
      title: trans.home.workflowSocial, desc: trans.home.workflowSocialDesc,
      color: "from-pink-500 to-rose-500",
      persona: "Creator"
    },
    { 
      id: 'restore', icon: Sparkles, 
      title: trans.home.workflowRestore, desc: trans.home.workflowRestoreDesc,
      color: "from-emerald-400 to-teal-500",
      persona: "General"
    },
  ];

  // Pricing Plans (Monetization Strategy)
  const plans = [
    {
      name: trans.home.planGo,
      price: "Free",
      userType: "Casual User",
      icon: Zap,
      features: ["50 Credits/mo", "Standard Resolution", "Basic AI Tools", "Community Templates"],
      cta: trans.home.currentPlan,
      primary: false,
      color: "text-blue-500"
    },
    {
      name: trans.home.planPro,
      price: "$19",
      userType: "Creator / Seller",
      icon: Crown,
      features: ["500 Credits/mo", "4K Upscaling", "Batch Processing", "Pro Templates", "No Watermark"],
      cta: trans.home.upgrade,
      primary: true, // Highlight this
      color: "text-amber-400"
    },
    {
      name: trans.home.planTeam,
      price: "$49",
      userType: "Agency / Small Team",
      icon: Briefcase,
      features: ["Shared Workspace", "2000 Credits/mo", "Brand Kit & Presets", "Comment & Review", "Priority Support"],
      cta: trans.home.upgrade,
      primary: false,
      color: "text-purple-500"
    },
    {
      name: trans.home.planEnt,
      price: "Custom",
      userType: "Enterprise",
      icon: Building2,
      features: ["Unlimited Volume", "Custom Model Training", "SSO & Security", "On-premise Option", "Dedicated Manager"],
      cta: trans.home.contactSales,
      primary: false,
      color: "text-zinc-500"
    }
  ];

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto transition-colors duration-300">
       <div className="relative">
          {/* Hero Background Gradient */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-repix-500/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10">
            
            {/* --- SECTION 1: HERO & PROMPT (The Core) --- */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="pro" className="mb-4">Repix AI 2.0</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                {trans.home.heroTitle}
              </h1>
              
              <div className="relative group">
                 {/* Moving Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <div className="absolute -inset-[3px] rounded-2xl overflow-hidden opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm">
                   <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#a855f7_360deg)] animate-[spin_3s_linear_infinite]"></div>
                   <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_0_340deg,#3b82f6_360deg)] animate-[spin_3s_linear_infinite]"></div>
                </div>

                <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-2 flex items-center shadow-2xl border border-transparent group-focus-within:border-white/20 dark:group-focus-within:border-white/10 transition-colors">
                   <div className="pl-4 text-repix-500 animate-pulse">
                      <Sparkles size={24} />
                   </div>
                   <input 
                     type="text" 
                     placeholder={trans.home.placeholder}
                     className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-lg px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 h-14"
                   />
                   <Button size="lg" className="rounded-xl h-12 px-6 shadow-lg shadow-repix-500/20" onClick={onStartEditing}>
                      {trans.home.generate}
                   </Button>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: QUICK ACTIONS (Casual / Fast) --- */}
            <div className="mb-16">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Zap size={20} className="text-amber-500" /> {trans.home.tools}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{trans.home.quickActionsDesc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tools.map((tool, idx) => (
                  <button 
                    key={idx}
                    onClick={onStartEditing}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                       <tool.icon className={tool.color} size={28} />
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- SECTION 3: WORKFLOWS (Pro / Seller / Agency) --- */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-repix-500" /> {trans.home.workflows}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workflows.map((wf) => (
                  <div key={wf.id} onClick={onStartEditing} className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 hover:border-repix-500/50 transition-all">
                    <div className={`absolute top-0 right-0 p-2 bg-gradient-to-bl ${wf.color} opacity-10 group-hover:opacity-20 rounded-bl-3xl transition-opacity w-24 h-24`}></div>
                    <div className="flex items-start justify-between mb-4">
                       <div className={`p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-white group-hover:bg-gradient-to-br ${wf.color} transition-colors`}>
                          <wf.icon size={24} />
                       </div>
                       <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-0">{wf.persona}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{wf.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{wf.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SECTION 4: INSPIRATION (Community) --- */}
            <div className="mb-20">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-pink-500" /> {trans.home.inspiration}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab(activeTab === 'trending' ? 'recent' : 'trending')}>
                    {activeTab === 'trending' ? trans.home.recent : trans.home.trending} <ArrowRight size={14} className="ml-1" />
                  </Button>
               </div>
               
               <div className="columns-2 md:columns-4 gap-4 space-y-4">
                  {inspirationImages.map((img) => (
                     <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer" onClick={onStartEditing}>
                        <img src={img.src} alt={img.prompt} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                           <p className="text-white text-sm font-medium line-clamp-2 mb-2">{img.prompt}</p>
                           <Button size="sm" className="h-7 text-xs px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border-0 w-full">
                                 {trans.home.remix}
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* --- SECTION 5: PRICING (Monetization - Enhanced) --- */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">{trans.home.pricingTitle}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">{trans.home.pricingDesc}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 px-4">
                 {plans.map((plan, i) => (
                   <div 
                     key={i} 
                     className={`
                       group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500
                       ${plan.primary 
                         ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 scale-105 z-10 shadow-2xl shadow-repix-500/30' 
                         : 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:border-repix-500/30 hover:shadow-repix-500/10'
                       }
                     `}
                   >
                      {/* Pro Plan Animated Background */}
                      {plan.primary && (
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-repix-500/20 blur-[80px] rounded-full group-hover:bg-pink-500/30 transition-colors duration-500"></div>
                           <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/20 blur-[80px] rounded-full group-hover:bg-repix-500/30 transition-colors duration-500"></div>
                        </div>
                      )}

                      {/* "Most Popular" Badge */}
                      {plan.primary && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <div className="bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                            <Star size={12} fill="currentColor" /> Popular
                          </div>
                        </div>
                      )}
                      
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${plan.primary ? 'bg-white/10 dark:bg-zinc-900/10 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 ' + plan.color}`}>
                             <plan.icon size={24} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${plan.primary ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>{plan.name}</h3>
                            <p className={`text-xs font-medium ${plan.primary ? 'text-white/60 dark:text-zinc-500' : 'text-zinc-400'}`}>{plan.userType}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                           <div className="flex items-baseline gap-1">
                             <span className={`text-4xl font-extrabold tracking-tight ${plan.primary ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-white'}`}>{plan.price}</span>
                             {plan.price !== 'Custom' && plan.price !== 'Free' && <span className={`text-sm font-medium ${plan.primary ? 'text-white/60 dark:text-zinc-500' : 'text-zinc-500'}`}>{trans.home.month}</span>}
                           </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 mb-8 flex-1">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-3 group/item">
                               <div className={`mt-0.5 p-0.5 rounded-full ${plan.primary ? 'bg-white/20 dark:bg-zinc-900/10' : 'bg-repix-100 dark:bg-repix-900/30'}`}>
                                 <Check size={12} className={`shrink-0 ${plan.primary ? 'text-white dark:text-zinc-900' : 'text-repix-600 dark:text-repix-400'}`} />
                               </div>
                               <span className={`text-sm transition-colors ${plan.primary ? 'text-white/80 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-zinc-900' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <Button 
                          variant={plan.primary ? 'primary' : 'outline'} 
                          className={`w-full h-12 rounded-xl font-bold transition-transform duration-300 group-hover:scale-[1.02] active:scale-95 ${
                            plan.primary 
                              ? 'bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border-0 shadow-lg' 
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:border-zinc-700'
                          }`}
                        >
                           {plan.cta}
                        </Button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

          </div>
       </div>
    </div>
  )
}

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('landing');

  // Handle Authentication Flow
  if (!isAuthenticated) {
    if (view === 'auth') {
      return (
        <AuthPage 
          onBack={() => setView('landing')} 
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            setView('home');
          }} 
        />
      );
    }
    return (
      <LandingPage 
        onLogin={() => setView('auth')} 
        onSignup={() => setView('auth')} 
      />
    );
  }

  // Handle Main App Flow
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setView('landing');
  }

  // Wrap Main App in Layout
  return (
    <Layout currentView={view} onChangeView={setView} onSignOut={handleSignOut}>
      {view === 'home' && <HomeView onStartEditing={() => setView('editor')} />}
      {view === 'editor' && <EditorView />}
      {view === 'marketplace' && <MarketplaceView />}
      {view === 'team' && <TeamView />}
      {view === 'profile' && <ProfileView />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;