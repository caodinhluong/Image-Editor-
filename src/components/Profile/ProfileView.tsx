import React, { useState } from 'react';
import { 
  User, Settings, CreditCard, Heart, Image as ImageIcon, 
  Share2, Edit2, Zap, Clock, Bell, Key, Download, MoreHorizontal,
  LogOut, Shield, Crown, Grid, List, CheckCircle
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export const ProfileView: React.FC = () => {
  const { trans, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'templates' | 'likes' | 'billing' | 'settings'>('portfolio');

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

  // Portfolio với ảnh sản phẩm thời trang nổi tiếng
  const portfolioImages = [
    { id: 0, src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', title: 'Nike Air Max', date: '2 days ago' },
    { id: 1, src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', title: 'Louis Vuitton Bag', date: '3 days ago' },
    { id: 2, src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', title: 'Apple Watch', date: '5 days ago' },
    { id: 3, src: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', title: 'Chanel Perfume', date: '1 week ago' },
    { id: 4, src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', title: 'Adidas Sneakers', date: '1 week ago' },
    { id: 5, src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', title: 'Gucci Handbag', date: '2 weeks ago' },
  ];

  const myTemplates = Array(3).fill(null).map((_, i) => ({
    id: i,
    title: `Template ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/temp${i}/400/300`,
    sales: Math.floor(Math.random() * 1000),
    status: 'Active'
  }));

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

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  
                  {/* Stats Row */}
                  <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                     <div className="text-center md:text-left">
                        <span className="block font-bold text-zinc-900 dark:text-white text-lg">{user.stats.followers}</span>
                        <span className="text-zinc-500">{trans.profile.followers}</span>
                     </div>
                     <div className="text-center md:text-left">
                        <span className="block font-bold text-zinc-900 dark:text-white text-lg">{user.stats.following}</span>
                        <span className="text-zinc-500">{trans.profile.following}</span>
                     </div>
                     <div className="text-center md:text-left">
                        <span className="block font-bold text-zinc-900 dark:text-white text-lg">{user.stats.downloads}</span>
                        <span className="text-zinc-500">{trans.marketplace.downloads}</span>
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

            {/* Credit Dashboard Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <Card className="p-6 bg-gradient-to-br from-repix-600 to-indigo-700 text-white border-none shadow-xl col-span-1 md:col-span-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="relative z-10 flex justify-between items-start">
                     <div>
                        <p className="text-repix-100 font-medium mb-1">{trans.profile.creditsLeft}</p>
                        <h2 className="text-4xl font-bold tracking-tight mb-4">{user.credits.current.toLocaleString()} <span className="text-lg font-normal opacity-70">/ {user.credits.total.toLocaleString()}</span></h2>
                        <div className="h-2 w-full max-w-md bg-black/20 rounded-full overflow-hidden mb-2">
                           <div className="h-full bg-white/90 w-[70%] rounded-full"></div>
                        </div>
                        <p className="text-xs text-repix-200">{trans.profile.nextBilling} Oct 24, 2024</p>
                     </div>
                     <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                        <Zap size={32} className="text-yellow-300 fill-yellow-300" />
                     </div>
                  </div>
               </Card>
               
               <Card className="p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 flex flex-col">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                     <h3 className="font-bold flex items-center gap-2"><TrophyIcon /> Achievements</h3>
                  </div>
                  <div className="p-4 flex-1 flex items-center justify-around">
                      <div className="text-center group cursor-pointer">
                         <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 flex items-center justify-center border border-yellow-200 dark:border-yellow-700 group-hover:scale-110 transition-transform">
                            <Zap size={20} fill="currentColor" />
                         </div>
                         <span className="text-xs font-medium">Power User</span>
                      </div>
                      <div className="text-center group cursor-pointer">
                         <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 flex items-center justify-center border border-blue-200 dark:border-blue-700 group-hover:scale-110 transition-transform">
                            <Heart size={20} fill="currentColor" />
                         </div>
                         <span className="text-xs font-medium">Top Seller</span>
                      </div>
                      <div className="text-center group cursor-pointer grayscale opacity-50">
                         <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                            <Shield size={20} />
                         </div>
                         <span className="text-xs font-medium">Verified</span>
                      </div>
                  </div>
               </Card>
            </div>

            {/* Main Tabs */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 mb-6 sticky top-0 bg-light-bg dark:bg-dark-bg z-20">
               <nav className="flex gap-6 overflow-x-auto hide-scrollbar">
                  {[
                     { id: 'portfolio', label: trans.profile.portfolio, icon: ImageIcon },
                     { id: 'templates', label: trans.profile.templates, icon: Grid },
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                     {portfolioImages.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer">
                           <img src={img.src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <h4 className="text-white font-medium truncate">{img.title}</h4>
                              <p className="text-white/70 text-xs">{img.date}</p>
                           </div>
                           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full"><Download size={14}/></Button>
                           </div>
                        </div>
                     ))}
                     {/* Add New Placeholder */}
                     <div className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 hover:text-repix-500 hover:border-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/10 cursor-pointer transition-all">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                           <Zap size={24} />
                        </div>
                        <span className="font-medium text-sm">Create New</span>
                     </div>
                  </div>
               )}

               {/* TEMPLATES TAB */}
               {activeTab === 'templates' && (
                  <div className="space-y-4">
                     {myTemplates.map(tmp => (
                        <div key={tmp.id} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md transition-shadow">
                           <div className="w-24 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                              <img src={tmp.thumbnail} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                 <h4 className="font-bold text-zinc-900 dark:text-white">{tmp.title}</h4>
                                 <Badge className="bg-green-100 text-green-700 border-green-200">{tmp.status}</Badge>
                              </div>
                              <p className="text-sm text-zinc-500">{tmp.sales} sales • Last updated 1 week ago</p>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-zinc-900 dark:text-white">$124.50</p>
                              <p className="text-xs text-zinc-500">Revenue</p>
                           </div>
                           <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                        </div>
                     ))}
                  </div>
               )}

               {/* SETTINGS TAB */}
               {activeTab === 'settings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  );
};

const TrophyIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);