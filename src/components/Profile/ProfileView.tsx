import React, { useState, useEffect } from 'react';
import { 
  User, Settings, CreditCard, Heart, Image as ImageIcon, 
  Share2, Edit2, Zap, Clock, Bell, Key, MoreHorizontal,
  Crown, Eye, ExternalLink, Trash2
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { ShareGenerationModal } from '../Marketplace/ShareGenerationModal';


export const ProfileView: React.FC = () => {
  const { trans, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  useSubscription();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'published' | 'likes' | 'billing' | 'settings'>('portfolio');
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Check if navigated from Marketplace to open Published tab
  useEffect(() => {
    const shouldOpenPublished = localStorage.getItem('repix_open_published');
    if (shouldOpenPublished === 'true') {
      setActiveTab('published');
      setShowShareModal(true);
      localStorage.removeItem('repix_open_published');
    }
  }, []);
  


  // Mock User Data
  const user = {
    name: "Lương đẹp trai",
    handle: "@luong_designs",
    avatar: "https://picsum.photos/seed/user/200/200",
    cover: "https://picsum.photos/seed/cover/1200/400",
    joined: "Sep 2023",
    plan: "Repix Pro",
    credits: { current: 3450, total: 5000 },
    stats: {
      followers: "12.5k",
      following: "240",
      downloads: "45k"
    }
  };





  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      
      {/* Hero Section */}
      <div className="relative">
         {/* Cover Image */}
         <div className="h-48 md:h-64 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative group">
            <img src={user.cover} className="w-full h-full object-cover" alt="Cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
               <Edit2 size={16} />
            </button>
         </div>

         <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-10">
            <div className="relative -mt-16 sm:-mt-24 mb-6 flex flex-col md:flex-row items-end md:items-end gap-6">
               {/* Avatar */}
               <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-light-bg dark:border-dark-bg overflow-hidden bg-white dark:bg-zinc-800 shadow-xl">
                     <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-repix-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110">
                     <Edit2 size={14} />
                  </button>
               </div>

               {/* User Info */}
               <div className="flex-1 pb-2 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                     <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">{user.name}</h1>
                     <Badge variant="pro" className="w-fit mx-auto md:mx-0"><Crown size={12} className="mr-1" fill="currentColor"/> {user.plan}</Badge>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-3">{user.handle} • {trans.profile.memberSince} {user.joined}</p>
                  
                  {/* Compact Stats Row */}
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm flex-wrap">
                     <div className="flex items-center gap-1.5">
                        <Zap size={14} className="text-yellow-500" />
                        <span className="font-bold text-zinc-900 dark:text-white">{user.credits.current.toLocaleString()}</span>
                        <span className="text-zinc-500">credits</span>
                     </div>
                     <span className="text-zinc-300 dark:text-zinc-600">•</span>
                     <div className="flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-blue-500" />
                        <span className="font-bold text-zinc-900 dark:text-white">156</span>
                        <span className="text-zinc-500">{language === 'vi' ? 'ảnh' : 'images'}</span>
                     </div>
                     <span className="text-zinc-300 dark:text-zinc-600">•</span>
                     <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900 dark:text-white">{user.stats.followers}</span>
                        <span className="text-zinc-500">{trans.profile.followers}</span>
                     </div>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-3 pb-4 w-full md:w-auto">
                  <Button variant="outline" className="flex-1 md:flex-none">{trans.profile.editProfile}</Button>
                  <Button variant="secondary" size="icon"><Share2 size={18} /></Button>
                  <Button variant="secondary" size="icon"><MoreHorizontal size={18} /></Button>
               </div>
            </div>

            {/* Main Tabs */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 mb-6 sticky top-0 bg-light-bg dark:bg-dark-bg z-20">
               <nav className="flex gap-6 overflow-x-auto hide-scrollbar">
                  {[
                     { id: 'portfolio', label: trans.profile.portfolio, icon: ImageIcon },
                     { id: 'published', label: language === 'vi' ? 'Đã xuất bản' : 'Published', icon: Share2 },
                     { id: 'likes', label: trans.profile.likes, icon: Heart },
                     { id: 'billing', label: trans.profile.billing, icon: CreditCard },
                     { id: 'settings', label: trans.profile.settings, icon: Settings },
                  ].map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-repix-500 text-repix-600 dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                     >
                        <tab.icon size={16} /> {tab.label}
                     </button>
                  ))}
               </nav>
            </div>

            {/* Tab Content */}
            <div className="pb-20">
               
               {/* PORTFOLIO TAB */}
               {activeTab === 'portfolio' && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                        <ImageIcon size={40} className="text-zinc-400" />
                     </div>
                     <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        {language === 'vi' ? 'Chưa có sáng tạo nào' : 'No creations yet'}
                     </h3>
                     <p className="text-zinc-500 mb-6 max-w-md">
                        {language === 'vi' 
                           ? 'Bắt đầu tạo ảnh AI đầu tiên của bạn và chúng sẽ xuất hiện ở đây.'
                           : 'Start creating your first AI images and they will appear here.'}
                     </p>
                     <Button className="gap-2">
                        <Zap size={16} />
                        {language === 'vi' ? 'Tạo ngay' : 'Create Now'}
                     </Button>
                  </div>
               )}

               {/* PUBLISHED TAB */}
               {activeTab === 'published' && (
                  <div className="flex gap-6 min-h-[600px]">
                     {/* Left Sidebar */}
                     <div className="w-56 flex-shrink-0 space-y-5">
                        {/* Stats */}
                        <div className="flex items-center gap-3 text-sm">
                           <span className="text-zinc-900 dark:text-white font-bold">0</span>
                           <span className="text-zinc-500">likes</span>
                           <span className="text-zinc-900 dark:text-white font-bold ml-2">2</span>
                           <span className="text-zinc-500">posts</span>
                           <span className="text-zinc-900 dark:text-white font-bold ml-2">1</span>
                           <span className="text-zinc-500">views</span>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                           {['All', 'Image', 'Video', 'Boards'].map((tab, i) => (
                              <button 
                                 key={tab}
                                 className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    i === 0 
                                       ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                                       : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                 }`}
                              >
                                 {tab}
                              </button>
                           ))}
                        </div>

                        {/* Create Share Inspire Card */}
                        <div className="bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl p-5">
                           {/* Stacked Images */}
                           <div className="flex justify-center mb-4">
                              <div className="relative w-28 h-20">
                                 <div className="absolute left-0 top-1 w-10 h-14 rounded-lg overflow-hidden rotate-[-15deg] shadow-md border-2 border-white dark:border-zinc-700">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 h-14 rounded-lg overflow-hidden z-10 shadow-md border-2 border-white dark:border-zinc-700">
                                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="absolute right-0 top-1 w-10 h-14 rounded-lg overflow-hidden rotate-[15deg] shadow-md border-2 border-white dark:border-zinc-700">
                                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80" className="w-full h-full object-cover" />
                                 </div>
                              </div>
                           </div>
                           
                           <h3 className="text-zinc-900 dark:text-white font-bold text-base text-center mb-1">
                              Create. Share. Inspire.
                           </h3>
                           <p className="text-zinc-500 text-xs text-center mb-4 leading-relaxed">
                              {language === 'vi' 
                                 ? 'Xuất bản sáng tạo và xem người khác biến ý tưởng thành hiện thực.'
                                 : 'Publish your generations and see how others bring their ideas to life.'}
                           </p>
                           
                           <button 
                              onClick={() => setShowShareModal(true)} 
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold text-sm py-2.5 rounded-full transition-all shadow-lg shadow-purple-500/25"
                           >
                              <Share2 size={14} />
                              Publish
                           </button>
                        </div>
                     </div>

                     {/* Right Content - Masonry Grid */}
                     <div className="flex-1 overflow-hidden">
                        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 2xl:gap-4 auto-rows-max">
                           {[
                              { id: 1, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&fit=crop', title: 'Portrait Style', span: 'row-span-2', hasAI: true },
                              { id: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop', title: 'Product Shot', span: '', hasAI: false },
                              { id: 3, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=400&fit=crop', title: 'Lifestyle Portrait', span: '', hasAI: true },
                              { id: 4, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop', title: 'Fashion Edit', span: 'row-span-2', hasAI: false },
                              { id: 5, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=350&fit=crop', title: 'Minimal Product', span: '', hasAI: true },
                              { id: 6, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=350&fit=crop', title: 'Beauty Shot', span: '', hasAI: false },
                           ].map((item) => (
                              <div 
                                 key={item.id} 
                                 className={`group relative rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 cursor-pointer ${item.span} ${item.span ? 'h-80' : 'h-40'}`}
                              >
                                 <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                 />
                                 
                                 {/* Hover Overlay */}
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="absolute bottom-3 left-3 right-3">
                                       <h4 className="text-white font-medium text-sm truncate">{item.title}</h4>
                                       <div className="flex items-center gap-3 mt-1 text-white/70 text-xs">
                                          <span className="flex items-center gap-1"><Eye size={11} /> 1.2k</span>
                                          <span className="flex items-center gap-1"><Heart size={11} /> 234</span>
                                       </div>
                                    </div>
                                    
                                    {/* Quick Actions */}
                                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30">
                                          <ExternalLink size={12} className="text-white" />
                                       </button>
                                       <button className="p-1.5 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-500">
                                          <Trash2 size={12} className="text-white" />
                                       </button>
                                    </div>
                                 </div>
                                 
                                 {/* AI Badge */}
                                 {item.hasAI && (
                                    <div className="absolute bottom-2 right-2 opacity-100 group-hover:opacity-0 transition-opacity">
                                       <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded shadow-lg">
                                          AI
                                       </span>
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}



               {/* SETTINGS TAB */}
               {activeTab === 'settings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-8">
                     <div className="space-y-6">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">General</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"><User size={18}/></div>
                                 <span className="text-sm font-medium">Profile Visibility</span>
                              </div>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-repix-500 cursor-pointer">
                                 <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                              </div>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"><Bell size={18}/></div>
                                 <span className="text-sm font-medium">Email Notifications</span>
                              </div>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 dark:bg-zinc-700 cursor-pointer">
                                 <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                              </div>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"><Clock size={18}/></div>
                                 <span className="text-sm font-medium">Save History</span>
                              </div>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-repix-500 cursor-pointer">
                                 <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                              </div>
                           </div>
                        </div>

                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2 mt-8">Developer</h3>
                        <div className="space-y-4">
                           <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-2 font-medium"><Key size={16}/> API Key</div>
                                 <Badge>Active</Badge>
                              </div>
                              <div className="flex gap-2">
                                 <Input value="pk_live_51M..." readOnly className="bg-white dark:bg-black font-mono text-xs" />
                                 <Button size="sm" variant="outline">Copy</Button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                         <h3 className="font-bold text-lg text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-2">Preferences</h3>
                         <div className="space-y-4">
                           <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer" onClick={toggleTheme}>
                              <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"><User size={18}/></div> {/* Icon placeholder */}
                                 <span className="text-sm font-medium">{trans.profile.darkTheme}</span>
                              </div>
                              <div className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${theme === 'dark' ? 'bg-repix-500' : 'bg-zinc-200'}`}>
                                 <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}/>
                              </div>
                           </div>

                           <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer" onClick={toggleLanguage}>
                              <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"><User size={18}/></div> {/* Icon placeholder */}
                                 <span className="text-sm font-medium">{trans.profile.language}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold">{language === 'en' ? 'English' : 'Tiếng Việt'}</span>
                              </div>
                           </div>
                         </div>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>

      {/* Share Generation Modal */}
      {showShareModal && (
        <ShareGenerationModal 
          onClose={() => setShowShareModal(false)}
          onPublish={(items) => {
            console.log('Publishing items:', items);
            setShowShareModal(false);
          }}
        />
      )}
    </div>
  );
};

