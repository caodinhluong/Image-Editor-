
import React, { useState } from 'react';
import { 
  Users, FolderGit2, BarChart3, Settings, ShieldCheck, Plus, 
  X, ChevronRight, Layout, ShoppingBag, Globe, File, 
  Check, Lock, Search, Cpu, Wand2, Loader2,
  LayoutGrid, ListTodo, FileText, MessageSquare, MoreVertical, Folder, 
  Clock, CheckCircle2, AlertCircle, Calendar, Filter, ArrowLeft, Upload
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { Project, AnalyticData } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

// --- MOCK DATA ---
const mockProjects: Project[] = [
  { id: 'p1', name: 'Nike Summer Campaign', lastEdited: '2 mins ago', status: 'In Review', collaborators: ['A', 'B'], thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
  { id: 'p2', name: 'Gucci Product Launch', lastEdited: '1 hour ago', status: 'Approved', collaborators: ['C'], thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' },
  { id: 'p3', name: 'Watch Collection Assets', lastEdited: '4 hours ago', status: 'Draft', collaborators: ['A', 'C', 'D'], thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
];

const analyticData: AnalyticData[] = [
  { name: 'Mon', views: 400, sales: 240, amt: 2400 },
  { name: 'Tue', views: 300, sales: 139, amt: 2210 },
  { name: 'Wed', views: 200, sales: 980, amt: 2290 },
  { name: 'Thu', views: 278, sales: 390, amt: 2000 },
  { name: 'Fri', views: 189, sales: 480, amt: 2181 },
  { name: 'Sat', views: 239, sales: 380, amt: 2500 },
  { name: 'Sun', views: 349, sales: 430, amt: 2100 },
];

const teamMembers = [
  { id: 'u1', name: 'Sarah Designer', role: 'Lead', avatar: 'https://picsum.photos/seed/user1/50/50' },
  { id: 'u2', name: 'Mike Product', role: 'Editor', avatar: 'https://picsum.photos/seed/user2/50/50' },
  { id: 'u3', name: 'Jessica Marketing', role: 'Viewer', avatar: 'https://picsum.photos/seed/user3/50/50' },
  { id: 'u4', name: 'Tom Dev', role: 'Admin', avatar: 'https://picsum.photos/seed/user4/50/50' },
];

// --- CREATE PROJECT WIZARD MODAL ---
interface WizardProps {
  onClose: () => void;
  onCreate: (project: Partial<Project>) => void;
}

const CreateProjectWizard: React.FC<WizardProps> = ({ onClose, onCreate }) => {
  const { trans } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Steps
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onCreate({
        name: projectName || 'Untitled Project',
        status: 'Draft',
        lastEdited: 'Just now',
        collaborators: ['You', ...selectedMembers],
        thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=100&h=100&fit=crop'
      });
    }, 2000);
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(prev => prev.filter(m => m !== id));
    } else {
      setSelectedMembers(prev => [...prev, id]);
    }
  };

  const t = trans.wizard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-[#09090b] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-repix-500 flex items-center justify-center text-white shadow-lg shadow-repix-500/20">
                <Plus size={18} />
             </div>
             <div>
                <h2 className="font-bold text-zinc-900 dark:text-white leading-none">{t.title}</h2>
                <p className="text-xs text-zinc-500 mt-1">Step {step} of {totalSteps}: {
                  step === 1 ? t.step1 : 
                  step === 2 ? t.step2 : 
                  step === 3 ? t.step3 : 
                  t.step4
                }</p>
             </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X size={20}/></Button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
           <div className="h-full bg-repix-500 transition-all duration-300 ease-in-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           {/* STEP 1: PROJECT TYPE */}
           {step === 1 && (
             <div className="animate-in slide-in-from-right-8 duration-300">
                <h3 className="text-xl font-bold mb-6 text-center">{t.step1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {[
                     { id: 'social', icon: Layout, label: t.typeSocial, desc: t.typeSocialDesc || 'Posts & Stories', color: 'text-pink-500', bg: 'bg-pink-500/10' },
                     { id: 'product', icon: ShoppingBag, label: t.typeProduct, desc: t.typeProductDesc || 'E-commerce shots', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                     { id: 'marketing', icon: Globe, label: t.typeMarketing, desc: t.typeMarketingDesc || 'Ad Banners', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                     { id: 'blank', icon: File, label: t.typeBlank, desc: t.typeBlankDesc || 'Start fresh', color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
                   ].map((item) => (
                     <div 
                        key={item.id}
                        onClick={() => setSelectedType(item.id)}
                        className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-4 hover:scale-[1.02] ${selectedType === item.id ? 'border-repix-500 bg-repix-50 dark:bg-repix-900/10' : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                     >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.bg}`}>
                           <item.icon size={32} className={item.color} />
                        </div>
                        <div>
                           <h4 className="font-bold text-zinc-900 dark:text-white">{item.label}</h4>
                           <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                        </div>
                        {selectedType === item.id && (
                           <div className="mt-2 w-6 h-6 rounded-full bg-repix-500 flex items-center justify-center text-white animate-in zoom-in">
                              <Check size={14} />
                           </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* STEP 2: DETAILS */}
           {step === 2 && (
             <div className="animate-in slide-in-from-right-8 duration-300 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-6 text-center">{t.step2}</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.nameLabel || 'Project Name'}</label>
                      <Input 
                        placeholder={t.namePlaceholder || 'e.g. Summer Campaign'} 
                        className="h-12 text-lg" 
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        autoFocus
                      />
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.descLabel || 'Description'}</label>
                      <textarea className="w-full h-32 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-repix-500 resize-none text-sm" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.privacyLabel || 'Privacy'}</label>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 border border-repix-500 bg-repix-50 dark:bg-repix-900/20 rounded-lg flex items-start gap-3 cursor-pointer">
                            <div className="mt-1 text-repix-500"><Globe size={18} /></div>
                            <div>
                               <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.public || 'Public'}</p>
                               <p className="text-xs text-zinc-500">Everyone in workspace</p>
                            </div>
                         </div>
                         <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
                            <div className="mt-1 text-zinc-400"><Lock size={18} /></div>
                            <div>
                               <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.private || 'Private'}</p>
                               <p className="text-xs text-zinc-500">Only invited members</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* STEP 3: TEAM */}
           {step === 3 && (
             <div className="animate-in slide-in-from-right-8 duration-300 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-2 text-center">{t.addMembers || 'Add Members'}</h3>
                <p className="text-zinc-500 text-center mb-8 text-sm">Collaborate in real-time with your team.</p>
                
                <div className="relative mb-6">
                   <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
                   <Input placeholder={t.searchMembers || 'Search by name...'} className="pl-10 h-11" />
                </div>

                <div className="space-y-2">
                   {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all cursor-pointer" onClick={() => toggleMember(member.id)}>
                         <div className="flex items-center gap-3">
                            <img src={member.avatar} className="w-10 h-10 rounded-full bg-zinc-200" />
                            <div>
                               <p className="text-sm font-bold text-zinc-900 dark:text-white">{member.name}</p>
                               <p className="text-xs text-zinc-500">{member.role}</p>
                            </div>
                         </div>
                         <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedMembers.includes(member.id) ? 'bg-repix-500 border-repix-500 text-white' : 'border-zinc-300 dark:border-zinc-600'}`}>
                            {selectedMembers.includes(member.id) && <Check size={14} />}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                   <p className="text-xs font-bold text-zinc-500 mb-3">SELECTED MEMBERS</p>
                   <div className="flex -space-x-2">
                      {selectedMembers.length === 0 && <span className="text-sm text-zinc-400 italic">No members selected</span>}
                      {selectedMembers.map(id => {
                         const m = teamMembers.find(tm => tm.id === id);
                         return (
                            <img key={id} src={m?.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900" title={m?.name} />
                         )
                      })}
                   </div>
                </div>
             </div>
           )}

           {/* STEP 4: AI SETTINGS */}
           {step === 4 && (
             <div className="animate-in slide-in-from-right-8 duration-300 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-6 text-center">{t.aiModel || 'AI Configuration'}</h3>
                
                <Card className="p-4 mb-6 border-repix-500/30 bg-repix-50/50 dark:bg-repix-900/10">
                   <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-repix-100 dark:bg-repix-900/50 text-repix-600 dark:text-repix-300">
                         <Cpu size={24} />
                      </div>
                      <div>
                         <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Repix Neural Engine™</h4>
                         <p className="text-sm text-zinc-600 dark:text-zinc-400">Your project will be powered by our latest V2 models, optimized for low latency and high fidelity.</p>
                      </div>
                   </div>
                </Card>

                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Base Model</label>
                      <div className="grid grid-cols-1 gap-3">
                         <div className="flex items-center gap-3 p-3 rounded-lg border border-repix-500 bg-repix-50 dark:bg-repix-900/20 cursor-pointer">
                            <div className="w-4 h-4 rounded-full border-[5px] border-repix-500"></div>
                            <div>
                               <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.turbo || 'Repix Turbo'}</p>
                               <p className="text-xs text-zinc-500">~0.8s generation time</p>
                            </div>
                            <Badge className="ml-auto bg-green-500 text-white border-0">Recommended</Badge>
                         </div>
                         <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
                            <div className="w-4 h-4 rounded-full border border-zinc-400"></div>
                            <div>
                               <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.quality || 'Repix Quality'}</p>
                               <p className="text-xs text-zinc-500">Max resolution & detail</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Content Filter</label>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                         <span className="text-sm">Safe Search & Brand Safety</span>
                         <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-repix-500 cursor-pointer">
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
           <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="text-zinc-500">
              {t.back}
           </Button>
           
           {step < totalSteps ? (
              <Button onClick={handleNext} disabled={step === 1 && !selectedType}>
                 {t.next} <ChevronRight size={16} className="ml-2" />
              </Button>
           ) : (
              <Button onClick={handleCreate} disabled={!projectName} className="px-8 shadow-xl shadow-repix-500/20">
                 {isLoading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> {t.preparing || 'Initializing...'}</>
                 ) : (
                    <><Wand2 size={16} className="mr-2" /> {t.create}</>
                 )}
              </Button>
           )}
        </div>

      </div>
    </div>
  );
};

// --- PROJECT DETAIL VIEW ---
const ProjectDetailView: React.FC<{ project: Partial<Project>; onBack: () => void }> = ({ project, onBack }) => {
  const { trans } = useLanguage();
  const [activeTab, setActiveTab] = useState<'assets' | 'board' | 'brief'>('assets');
  const t = trans.project || {
      backToWorkspace: "Back to Workspace", assets: "Assets", board: "Kanban", brief: "Brief",
      upload: "Upload", newAsset: "Generate New", todo: "To Do", inProgress: "In Progress", done: "Done"
  };

  const assets = [
    { id: 1, src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', name: 'Nike_Hero_Banner.jpg', status: 'Approved' },
    { id: 2, src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop', name: 'Gucci_Instagram.png', status: 'In Review' },
    { id: 3, src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', name: 'Watch_Email_Header.jpg', status: 'Draft' },
    { id: 4, src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop', name: 'Perfume_Product_Shot.png', status: 'Approved' },
  ];

  return (
    <div className="flex flex-col h-full bg-light-bg dark:bg-dark-bg animate-in fade-in slide-in-from-bottom-8 duration-300">
       {/* Header */}
       <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-dark-surface sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-500">
                <ArrowLeft size={16} className="mr-2" /> {t.backToWorkspace}
             </Button>
             <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>
             <div>
                <h2 className="font-bold text-zinc-900 dark:text-white leading-none">{project.name}</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                   <span className="flex items-center gap-1"><FolderGit2 size={10} /> {project.status}</span>
                   <span>•</span>
                   <span className="flex items-center gap-1"><Clock size={10} /> Edited {project.lastEdited}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-2">
                 {['A','B','C'].map((c,i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold">{c}</div>
                 ))}
                 <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-black flex items-center justify-center text-xs font-bold text-zinc-500"><Plus size={12}/></div>
             </div>
             <Button variant="outline" size="sm"><Settings size={16}/></Button>
             <Button size="sm" className="shadow-lg shadow-repix-500/20"><Wand2 size={16} className="mr-2"/> Open in Editor</Button>
          </div>
       </div>

       {/* Tabs */}
       <div className="px-6 pt-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex gap-6">
             {[
               { id: 'assets', label: t.assets, icon: LayoutGrid },
               { id: 'board', label: t.board, icon: ListTodo },
               { id: 'brief', label: t.brief, icon: FileText },
             ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-repix-500 text-repix-600 dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
               >
                  <tab.icon size={16} /> {tab.label}
               </button>
             ))}
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto p-6">
          
          {/* ASSETS TAB */}
          {activeTab === 'assets' && (
             <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-2">
                      <div className="relative">
                         <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                         <input type="text" placeholder="Search assets..." className="pl-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border-none text-sm w-64 outline-none focus:ring-1 focus:ring-repix-500" />
                      </div>
                      <Button variant="ghost" size="sm"><Filter size={16} className="mr-2"/> Filter</Button>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="outline" size="sm"><Upload size={16} className="mr-2"/> {t.upload}</Button>
                      <Button size="sm"><Plus size={16} className="mr-2"/> {t.newAsset}</Button>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {assets.map(asset => (
                      <div key={asset.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                         <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative">
                            <img src={asset.src} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                               <Badge className={`${asset.status === 'Approved' ? 'bg-green-500' : asset.status === 'Draft' ? 'bg-zinc-500' : 'bg-amber-500'} text-white border-0 text-[10px] px-1.5`}>{asset.status}</Badge>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                               <Button size="icon" variant="secondary" className="rounded-full h-8 w-8"><Wand2 size={14}/></Button>
                               <Button size="icon" variant="secondary" className="rounded-full h-8 w-8"><MoreVertical size={14}/></Button>
                            </div>
                         </div>
                         <div className="p-3">
                            <p className="text-sm font-medium truncate text-zinc-900 dark:text-white">{asset.name}</p>
                            <p className="text-xs text-zinc-500 mt-1">2MB • JPG</p>
                         </div>
                      </div>
                   ))}
                   {/* Create New Placeholder */}
                   <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:border-repix-500 hover:text-repix-500 hover:bg-repix-50 dark:hover:bg-repix-900/10 transition-colors cursor-pointer aspect-square">
                      <Plus size={32} className="mb-2" />
                      <span className="text-sm font-medium">Add New</span>
                   </div>
                </div>
             </div>
          )}

          {/* KANBAN BOARD TAB */}
          {activeTab === 'board' && (
             <div className="flex gap-6 h-full overflow-x-auto pb-4 animate-in fade-in duration-300">
                {[
                  { id: 'todo', title: t.todo, color: 'bg-zinc-500', items: 2 },
                  { id: 'progress', title: t.inProgress, color: 'bg-blue-500', items: 1 },
                  { id: 'done', title: t.done, color: 'bg-green-500', items: 3 },
                ].map(col => (
                   <div key={col.id} className="w-80 flex-shrink-0 flex flex-col bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800/50 h-full">
                      <div className="flex items-center justify-between mb-4 px-1">
                         <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                            <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-200">{col.title}</h4>
                            <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-xs px-1.5 py-0.5 rounded">{col.items}</span>
                         </div>
                         <Button size="icon" variant="ghost" className="h-6 w-6"><Plus size={14}/></Button>
                      </div>
                      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                         {[...Array(col.items)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 cursor-grab active:cursor-grabbing hover:border-repix-500/50 transition-colors">
                               <div className="flex gap-2 mb-2">
                                  <Badge variant="pro" className="text-[10px] px-1 py-0 h-4">High</Badge>
                                  <span className="text-[10px] text-zinc-400">#TSK-{col.id}-{i+1}</span>
                               </div>
                               <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-3">Create variation for summer vibe banner</p>
                               <div className="flex items-center justify-between">
                                  <div className="flex -space-x-1">
                                     <div className="w-5 h-5 rounded-full bg-pink-500 border border-white dark:border-zinc-900"></div>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                                     <MessageSquare size={12} /> 2
                                     <Calendar size={12} /> Oct 24
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                ))}
                <div className="w-80 flex-shrink-0 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                   <span className="flex items-center gap-2 font-medium"><Plus size={16}/> Add List</span>
                </div>
             </div>
          )}

          {/* BRIEF TAB */}
          {activeTab === 'brief' && (
             <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                   <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{project.name}</h1>
                   <Badge className="bg-green-100 text-green-700">Active Campaign</Badge>
                </div>
                <div className="space-y-8">
                   <section>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><TargetIcon/> Objective</h3>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                         Create a cohesive set of visual assets for the upcoming Summer 2024 collection launch. 
                         Focus on vibrant colors, neon accents, and a "Cyber-Tropical" aesthetic. 
                         The goal is to drive engagement on Instagram and conversion on the Shopify store.
                      </p>
                   </section>
                   <section>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><PaletteIcon/> Deliverables</h3>
                      <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-300 ml-2">
                         <li>5x Instagram Feed Posts (4:5)</li>
                         <li>3x Story Videos (9:16)</li>
                         <li>1x Website Hero Banner (1920x800)</li>
                         <li>Product Shot Retouching (20 SKUs)</li>
                      </ul>
                   </section>
                   <section>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><LinkIcon/> References</h3>
                      <div className="flex gap-4">
                         <div className="h-24 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                         </div>
                         <div className="h-24 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&h=200&fit=crop" className="w-full h-full object-cover" />
                         </div>
                         <div className="h-24 w-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 hover:text-repix-500 hover:border-repix-500 cursor-pointer">
                            <Plus size={20} />
                         </div>
                      </div>
                   </section>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

// Icons helper
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-repix-500"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const PaletteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;


export const TeamView: React.FC = () => {
  const { trans } = useLanguage();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [activeProject, setActiveProject] = useState<Partial<Project> | null>(null);

  const handleLaunchProject = (newProject: Partial<Project>) => {
    setIsCreatingProject(false);
    setActiveProject(newProject);
  };

  // If a project is active, show the detailed view instead of the dashboard
  if (activeProject) {
     return <ProjectDetailView project={activeProject} onBack={() => setActiveProject(null)} />;
  }

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg p-8 overflow-y-auto">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{trans.team.workspace}</h1>
            <div className="flex gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
               <span className="flex items-center gap-1"><Users size={14} /> 12 {trans.team.members}</span>
               <span className="flex items-center gap-1"><ShieldCheck size={14} /> {trans.team.enterprise}</span>
            </div>
          </div>
          <Button onClick={() => setIsCreatingProject(true)} className="shadow-lg shadow-repix-500/20">
            <Plus size={16} className="mr-2" /> {trans.team.newProject}
          </Button>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="p-6 col-span-2">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                   <BarChart3 size={18} className="text-repix-500"/> {trans.team.usage}
                 </h3>
                 <select className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded px-2 py-1 text-zinc-900 dark:text-white outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} />
                    <YAxis stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="views" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sales" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </Card>

           <div className="space-y-6">
             <Card className="p-6">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{trans.team.balance}</h3>
                <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">45,200</div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                   <div className="h-full w-[70%] bg-gradient-to-r from-pink-500 to-repix-600"></div>
                </div>
                <p className="text-xs text-zinc-500">70% {trans.team.allocation}</p>
                <Button variant="outline" size="sm" className="w-full mt-4">{trans.team.topUp}</Button>
             </Card>

             <Card className="p-6">
               <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">{trans.team.approvals}</h3>
               <div className="space-y-4">
                 {[1,2].map(i => (
                   <div key={i} className="flex items-start gap-3">
                      <img src={`https://picsum.photos/seed/user${i}/40/40`} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" />
                      <div>
                         <p className="text-sm text-zinc-800 dark:text-zinc-200">Waitlist Banner v2</p>
                         <p className="text-xs text-zinc-500">Requested by Sarah</p>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto text-xs">{trans.team.review}</Button>
                   </div>
                 ))}
               </div>
             </Card>
           </div>
        </div>

        {/* Projects List */}
        <div>
           <div className="flex items-center gap-4 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{trans.team.activeProjects}</h2>
              <div className="bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full text-xs text-zinc-500 dark:text-zinc-400">{trans.team.sort}</div>
           </div>
           
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
             {mockProjects.map((project, idx) => (
               <div key={project.id} className={`flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${idx !== mockProjects.length -1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`} onClick={() => setActiveProject(project)}>
                 <div className="flex items-center gap-4 cursor-pointer">
                    <img src={project.thumbnail} className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800 object-cover" />
                    <div>
                       <h4 className="font-medium text-zinc-900 dark:text-white hover:text-repix-500 transition-colors">{project.name}</h4>
                       <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <FolderGit2 size={12} /> Version 2.1 • {project.lastEdited}
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-8">
                    <div className="flex -space-x-2">
                       {project.collaborators.map((c, i) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-repix-100 dark:bg-repix-900 text-repix-700 dark:text-repix-200 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-zinc-900">
                           {c}
                         </div>
                       ))}
                    </div>
                    
                    <div>
                       {project.status === 'Approved' && <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30">{trans.team.approved}</Badge>}
                       {project.status === 'In Review' && <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">{trans.team.inReview}</Badge>}
                       {project.status === 'Draft' && <Badge>{trans.team.draft}</Badge>}
                    </div>
                    
                    <Button variant="ghost" size="icon"><Settings size={18} /></Button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Render the Wizard Modal */}
        {isCreatingProject && (
          <CreateProjectWizard 
            onClose={() => setIsCreatingProject(false)} 
            onCreate={handleLaunchProject}
          />
        )}
      </div>
    </div>
  );
};
