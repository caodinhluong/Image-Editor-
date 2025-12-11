
import React, { useState } from 'react';
import { 
  Users, FolderGit2, BarChart3, Settings, ShieldCheck, Plus, 
  X, ChevronRight, Layout, ShoppingBag, Globe, File, 
  Check, Lock, Search, Cpu, Wand2, Loader2,
  LayoutGrid, ListTodo, FileText, MessageSquare, MoreVertical, Folder, 
  Clock, CheckCircle2, AlertCircle, Calendar, Filter, ArrowLeft, Upload,
  Bell, Activity, Shield, Send, UserPlus, Trash2, Mail, UserMinus
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { Project, AnalyticData } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { TeamSettings } from './TeamSettings';
import { ActivityLog } from './ActivityLog';
import { NotificationsPanel } from './NotificationsPanel';
import { RolePermissions } from './RolePermissions';
import { BrandGuidelines } from './BrandGuidelines';
import { AssetLibrary } from './AssetLibrary';
import { TemplatesLibrary } from './TemplatesLibrary';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { TimeTracking } from './TimeTracking';
import { ExportReports } from './ExportReports';

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

// Current user (mock profile)
const currentUser = {
  id: 'u0',
  name: 'Lương đẹp trai',
  role: 'Lead' as const,
  avatar: 'https://picsum.photos/seed/user/50/50',
  email: 'luong@repix.ai',
  isCurrentUser: true,
};

const teamMembers = [
  currentUser,
  { id: 'u1', name: 'Sarah Designer', role: 'Admin', avatar: 'https://picsum.photos/seed/user1/50/50' },
  { id: 'u2', name: 'Mike Product', role: 'Editor', avatar: 'https://picsum.photos/seed/user2/50/50' },
  { id: 'u3', name: 'Jessica Marketing', role: 'Viewer', avatar: 'https://picsum.photos/seed/user3/50/50' },
  { id: 'u4', name: 'Tom Dev', role: 'Editor', avatar: 'https://picsum.photos/seed/user4/50/50' },
];

// --- CREATE PROJECT WIZARD MODAL ---
interface WizardProps {
  onClose: () => void;
  onCreate: (project: Partial<Project>) => void;
}

// All available users in the system (mock database)
const allUsers = [
  { id: 'u0', name: 'Lương đẹp trai', username: 'luong_designs', avatar: 'https://picsum.photos/seed/user/50/50', email: 'luong@repix.ai' },
  { id: 'u1', name: 'Sarah Designer', username: 'sarah_design', avatar: 'https://picsum.photos/seed/user1/50/50', email: 'sarah@company.com' },
  { id: 'u2', name: 'Mike Product', username: 'mike_product', avatar: 'https://picsum.photos/seed/user2/50/50', email: 'mike@company.com' },
  { id: 'u3', name: 'Jessica Marketing', username: 'jessica_mkt', avatar: 'https://picsum.photos/seed/user3/50/50', email: 'jessica@company.com' },
  { id: 'u4', name: 'Tom Dev', username: 'tom_dev', avatar: 'https://picsum.photos/seed/user4/50/50', email: 'tom@company.com' },
  { id: 'u5', name: 'Anna Creative', username: 'anna_creative', avatar: 'https://picsum.photos/seed/user5/50/50', email: 'anna@design.co' },
  { id: 'u6', name: 'David Photo', username: 'david_photo', avatar: 'https://picsum.photos/seed/user6/50/50', email: 'david@photo.com' },
  { id: 'u7', name: 'Emma Writer', username: 'emma_writes', avatar: 'https://picsum.photos/seed/user7/50/50', email: 'emma@content.io' },
  { id: 'u8', name: 'James Video', username: 'james_video', avatar: 'https://picsum.photos/seed/user8/50/50', email: 'james@video.pro' },
  { id: 'u9', name: 'Lisa Brand', username: 'lisa_brand', avatar: 'https://picsum.photos/seed/user9/50/50', email: 'lisa@brand.agency' },
];

const CreateProjectWizard: React.FC<WizardProps> = ({ onClose, onCreate }) => {
  const { trans } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = searchMemberQuery.length > 0 
    ? allUsers.filter(user => 
        user.username.toLowerCase().includes(searchMemberQuery.toLowerCase().replace('@', '')) ||
        user.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchMemberQuery.toLowerCase())
      )
    : [];

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
                   <Input 
                     placeholder={t.searchMembers || 'Search by user_name or email...'} 
                     className="pl-10 h-11" 
                     value={searchMemberQuery}
                     onChange={(e) => setSearchMemberQuery(e.target.value)}
                   />
                </div>

                {/* Search Results */}
                {searchMemberQuery.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-zinc-500 mb-3">
                      {filteredUsers.length > 0 ? 'SEARCH RESULTS' : 'NO USERS FOUND'}
                    </p>
                    {filteredUsers.length > 0 ? (
                      <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        {filteredUsers.map(user => (
                          <div 
                            key={user.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-repix-500 transition-all cursor-pointer"
                            onClick={() => {
                              if (!selectedMembers.includes(user.id)) {
                                toggleMember(user.id);
                              }
                              setSearchMemberQuery('');
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <img src={user.avatar} className="w-10 h-10 rounded-full bg-zinc-200" />
                              <div>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-zinc-500">@{user.username}</p>
                              </div>
                            </div>
                            {selectedMembers.includes(user.id) ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Added</Badge>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Plus size={14} className="mr-1" /> Add
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                        <Users size={24} className="mx-auto mb-2 text-zinc-400" />
                        <p className="text-sm text-zinc-500">No users found with "{searchMemberQuery}"</p>
                        <p className="text-xs text-zinc-400 mt-1">Try searching by username or email</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Team Members */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 mb-3">TEAM MEMBERS</p>
                  <div className="space-y-2">
                     {teamMembers.filter(m => !searchMemberQuery || selectedMembers.includes(m.id)).map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all cursor-pointer" onClick={() => toggleMember(member.id)}>
                           <div className="flex items-center gap-3">
                              <img src={member.avatar} className="w-10 h-10 rounded-full bg-zinc-200" />
                              <div>
                                 <p className="text-sm font-bold text-zinc-900 dark:text-white">{member.name}</p>
                                 <p className="text-xs text-zinc-500">@{allUsers.find(u => u.id === member.id)?.username || member.id} • {member.role}</p>
                              </div>
                           </div>
                           <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedMembers.includes(member.id) ? 'bg-repix-500 border-repix-500 text-white' : 'border-zinc-300 dark:border-zinc-600'}`}>
                              {selectedMembers.includes(member.id) && <Check size={14} />}
                           </div>
                        </div>
                     ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                   <p className="text-xs font-bold text-zinc-500 mb-3">SELECTED MEMBERS ({selectedMembers.length})</p>
                   <div className="flex -space-x-2">
                      {selectedMembers.length === 0 && <span className="text-sm text-zinc-400 italic">No members selected</span>}
                      {selectedMembers.map(id => {
                         const m = teamMembers.find(tm => tm.id === id) || allUsers.find(u => u.id === id);
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
interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  assignee: typeof teamMembers[0];
  comments: number;
  dueDate: string;
  status: 'todo' | 'progress' | 'done';
}

const ProjectDetailView: React.FC<{ project: Partial<Project>; onBack: () => void }> = ({ project, onBack }) => {
  const { trans, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'assets' | 'board' | 'ideas' | 'members'>('assets');
  const t = trans.project || {
      backToWorkspace: "Back to Workspace", assets: "Assets", board: "Kanban", ideas: "Ideas", members: "Members",
      upload: "Upload", newAsset: "Generate New", todo: "To Do", inProgress: "In Progress", done: "Done",
      addIdea: "Add Idea", noIdeas: "No ideas yet", ideaPlaceholder: "Share your idea...",
      inviteMember: "Invite", removeMember: "Remove", changeRole: "Change Role"
  };

  // Task management state
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', title: 'Create variation for summer vibe banner', priority: 'high', assignee: teamMembers[0], comments: 2, dueDate: 'Oct 24', status: 'todo' },
    { id: 'task-2', title: 'Design Instagram story template', priority: 'medium', assignee: teamMembers[1], comments: 1, dueDate: 'Oct 25', status: 'todo' },
    { id: 'task-3', title: 'Review product photography', priority: 'low', assignee: teamMembers[2], comments: 3, dueDate: 'Oct 26', status: 'progress' },
    { id: 'task-4', title: 'Finalize hero banner colors', priority: 'high', assignee: teamMembers[0], comments: 5, dueDate: 'Oct 20', status: 'done' },
    { id: 'task-5', title: 'Export assets for social media', priority: 'medium', assignee: teamMembers[3], comments: 0, dueDate: 'Oct 21', status: 'done' },
    { id: 'task-6', title: 'Create email header design', priority: 'low', assignee: teamMembers[1], comments: 2, dueDate: 'Oct 22', status: 'done' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      priority: 'medium',
      assignee: teamMembers[0],
      comments: 0,
      dueDate: 'Not set',
      status: 'todo',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'progress' | 'done') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Mock ideas data
  const [ideas, setIdeas] = useState([
    { id: 1, author: teamMembers[0], content: 'Thử nghiệm màu neon cho banner chính, tạo cảm giác năng động hơn', likes: 5, createdAt: '2 hours ago' },
    { id: 2, author: teamMembers[1], content: 'Có thể thêm hiệu ứng gradient cho text để nổi bật hơn', likes: 3, createdAt: '5 hours ago' },
    { id: 3, author: teamMembers[2], content: 'Nên có version dark mode cho các asset social media', likes: 8, createdAt: '1 day ago' },
  ]);
  const [newIdea, setNewIdea] = useState('');

  // Members management state
  const [projectMembers, setProjectMembers] = useState(teamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTarget, setChatTarget] = useState<typeof teamMembers[0] | 'group' | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [pendingInvites, setPendingInvites] = useState([
    { email: 'alex@company.com', invitedAt: '2 days ago' },
  ]);
  // Current user is the Lead (from mock profile)
  const currentUserRole = currentUser.role;
  const currentUserId = currentUser.id;

  const removeMember = (memberId: string) => {
    if (currentUserRole !== 'Lead') return;
    if (memberId === currentUserId) return; // Cannot remove yourself
    setProjectMembers(projectMembers.filter(m => m.id !== memberId));
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    setPendingInvites([...pendingInvites, { email: inviteEmail, invitedAt: 'Just now' }]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const cancelInvite = (email: string) => {
    setPendingInvites(pendingInvites.filter(i => i.email !== email));
  };

  const openChat = (target: typeof teamMembers[0] | 'group') => {
    setChatTarget(target);
    setShowChatModal(true);
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
               { id: 'ideas', label: t.ideas || 'Ideas', icon: MessageSquare },
               { id: 'members', label: t.members || 'Members', icon: Users },
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
                  { id: 'todo' as const, title: t.todo, color: 'bg-zinc-500', nextStatus: 'progress' as const, nextLabel: language === 'vi' ? 'Chuyển sang Đang xử lý' : 'Move to In Progress' },
                  { id: 'progress' as const, title: t.inProgress, color: 'bg-blue-500', nextStatus: 'done' as const, nextLabel: language === 'vi' ? 'Chuyển sang Hoàn thành' : 'Move to Done' },
                  { id: 'done' as const, title: t.done, color: 'bg-green-500', nextStatus: null, nextLabel: null },
                ].map(col => {
                   const columnTasks = tasks.filter(task => task.status === col.id);
                   return (
                   <div key={col.id} className="w-80 flex-shrink-0 flex flex-col bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800/50 h-full">
                      <div className="flex items-center justify-between mb-4 px-1">
                         <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                            <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-200">{col.title}</h4>
                            <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-xs px-1.5 py-0.5 rounded">{columnTasks.length}</span>
                         </div>
                         {col.id === 'todo' && (
                           <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShowAddTask(true)}>
                             <Plus size={14}/>
                           </Button>
                         )}
                      </div>
                      
                      {/* Add Task Form - Only for Todo column */}
                      {col.id === 'todo' && showAddTask && (
                        <div className="mb-3 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-repix-500 shadow-lg">
                          <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder={language === 'vi' ? 'Nhập tên công việc...' : 'Enter task name...'}
                            className="w-full p-2 text-sm bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-repix-500 mb-2"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={addTask} disabled={!newTaskTitle.trim()}>
                              <Plus size={12} className="mr-1" /> {language === 'vi' ? 'Thêm' : 'Add'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setShowAddTask(false); setNewTaskTitle(''); }}>
                              {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                         {columnTasks.map((task) => (
                            <div key={task.id} className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-repix-500/50 transition-colors group">
                               <div className="flex gap-2 mb-2 items-center justify-between">
                                  <div className="flex gap-2">
                                    <Badge className={`text-[10px] px-1 py-0 h-4 ${
                                      task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                      'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                    }`}>
                                      {task.priority === 'high' ? (language === 'vi' ? 'Cao' : 'High') :
                                       task.priority === 'medium' ? (language === 'vi' ? 'TB' : 'Med') :
                                       (language === 'vi' ? 'Thấp' : 'Low')}
                                    </Badge>
                                    <span className="text-[10px] text-zinc-400">#{task.id.split('-')[1]}</span>
                                  </div>
                                  <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                               </div>
                               <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-3">{task.title}</p>
                               <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                     <img src={task.assignee.avatar} className="w-5 h-5 rounded-full" title={task.assignee.name} />
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                                     <MessageSquare size={12} /> {task.comments}
                                     <Calendar size={12} /> {task.dueDate}
                                  </div>
                               </div>
                               {/* Move to next status button */}
                               {col.nextStatus && (
                                 <button
                                   onClick={() => moveTask(task.id, col.nextStatus!)}
                                   className="w-full mt-2 py-1.5 text-xs font-medium text-repix-600 dark:text-repix-400 bg-repix-50 dark:bg-repix-900/20 rounded-lg hover:bg-repix-100 dark:hover:bg-repix-900/30 transition-colors flex items-center justify-center gap-1"
                                 >
                                   <ChevronRight size={14} /> {col.nextLabel}
                                 </button>
                               )}
                            </div>
                         ))}
                         
                         {/* Empty state */}
                         {columnTasks.length === 0 && (
                           <div className="text-center py-8 text-zinc-400">
                             <p className="text-sm">{language === 'vi' ? 'Chưa có công việc' : 'No tasks'}</p>
                           </div>
                         )}
                      </div>
                   </div>
                   );
                })}
             </div>
          )}

          {/* IDEAS TAB */}
          {activeTab === 'ideas' && (
             <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
                {/* Add new idea */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
                   <div className="flex gap-3">
                      <img src={teamMembers[0].avatar} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                         <textarea 
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            placeholder={t.ideaPlaceholder || "Share your idea with the team..."}
                            className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-repix-500"
                         />
                         <div className="flex justify-end mt-2">
                            <Button 
                               size="sm" 
                               disabled={!newIdea.trim()}
                               onClick={() => {
                                  if (newIdea.trim()) {
                                     setIdeas([{ id: Date.now(), author: teamMembers[0], content: newIdea, likes: 0, createdAt: 'Just now' }, ...ideas]);
                                     setNewIdea('');
                                  }
                               }}
                            >
                               <Plus size={14} className="mr-1" /> {t.addIdea || 'Add Idea'}
                            </Button>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Ideas list */}
                <div className="space-y-4">
                   {ideas.length === 0 ? (
                      <div className="text-center py-12 text-zinc-500">
                         <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                         <p>{t.noIdeas || 'No ideas yet. Be the first to share!'}</p>
                      </div>
                   ) : (
                      ideas.map(idea => (
                         <div key={idea.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                            <div className="flex gap-3">
                               <img src={idea.author.avatar} className="w-10 h-10 rounded-full" />
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                     <span className="font-medium text-zinc-900 dark:text-white text-sm">{idea.author.name}</span>
                                     <span className="text-xs text-zinc-400">•</span>
                                     <span className="text-xs text-zinc-400">{idea.createdAt}</span>
                                  </div>
                                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{idea.content}</p>
                                  <div className="flex items-center gap-4 mt-3">
                                     <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-repix-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                                        {idea.likes}
                                     </button>
                                     <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-repix-500 transition-colors">
                                        <MessageSquare size={14} /> Reply
                                     </button>
                                  </div>
                               </div>
                               <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={14} /></Button>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
             <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.members || 'Team Members'}</h3>
                      <p className="text-sm text-zinc-500">{projectMembers.length} {language === 'vi' ? 'thành viên trong dự án' : 'members in this project'}</p>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openChat('group')}>
                         <MessageSquare size={14} className="mr-1" /> {language === 'vi' ? 'Chat nhóm' : 'Group Chat'}
                      </Button>
                      <Button size="sm" onClick={() => setShowInviteModal(true)}>
                         <UserPlus size={14} className="mr-1" /> {t.inviteMember || 'Invite'}
                      </Button>
                   </div>
                </div>

                {/* Members list */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                   {projectMembers.map((member, idx) => (
                      <div 
                         key={member.id} 
                         className={`flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group ${idx !== projectMembers.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}
                      >
                         <div className="flex items-center gap-3">
                            <div className="relative">
                               <img src={member.avatar} className="w-12 h-12 rounded-full" />
                               <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900"></div>
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <p className="font-medium text-zinc-900 dark:text-white">{member.name}</p>
                                  {member.id === currentUserId && (
                                     <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-1.5 py-0">
                                        {language === 'vi' ? 'Bạn' : 'You'}
                                     </Badge>
                                  )}
                               </div>
                               <p className="text-xs text-zinc-500">{member.role === 'Lead' ? 'Project Lead' : member.role === 'Admin' ? 'Administrator' : member.role === 'Editor' ? 'Can Edit' : 'View Only'}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <Badge className={`${member.role === 'Lead' || member.role === 'Admin' ? 'bg-repix-100 text-repix-700 dark:bg-repix-900/30 dark:text-repix-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                               {member.role}
                            </Badge>
                            {/* Chat button - not for yourself */}
                            {member.id !== currentUserId && (
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => openChat(member)}
                                  title={language === 'vi' ? 'Nhắn tin' : 'Send message'}
                               >
                                  <MessageSquare size={14} />
                               </Button>
                            )}
                            {/* Remove button - only for Lead, not for yourself */}
                            {currentUserRole === 'Lead' && member.id !== currentUserId && (
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() => removeMember(member.id)}
                                  title={language === 'vi' ? 'Xóa khỏi team' : 'Remove from team'}
                               >
                                  <UserMinus size={14} />
                               </Button>
                            )}
                         </div>
                      </div>
                   ))}
                </div>

                {/* Pending invites */}
                <div className="mt-6">
                   <h4 className="text-sm font-medium text-zinc-500 mb-3">{language === 'vi' ? 'Lời mời đang chờ' : 'Pending Invites'}</h4>
                   {pendingInvites.length === 0 ? (
                      <div className="text-center py-8 text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                         <Mail size={24} className="mx-auto mb-2 opacity-50" />
                         <p className="text-sm">{language === 'vi' ? 'Không có lời mời nào' : 'No pending invites'}</p>
                      </div>
                   ) : (
                      <div className="space-y-2">
                         {pendingInvites.map((invite, idx) => (
                            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-4">
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                        <Mail size={18} className="text-zinc-400" />
                                     </div>
                                     <div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{invite.email}</p>
                                        <p className="text-xs text-zinc-400">{language === 'vi' ? 'Đã mời' : 'Invited'} {invite.invitedAt}</p>
                                     </div>
                                  </div>
                                  <div className="flex gap-2">
                                     <Button variant="outline" size="sm">{language === 'vi' ? 'Gửi lại' : 'Resend'}</Button>
                                     <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-500"
                                        onClick={() => cancelInvite(invite.email)}
                                     >
                                        {language === 'vi' ? 'Hủy' : 'Cancel'}
                                     </Button>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                {/* Invite Modal */}
                {showInviteModal && (
                   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                         <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="font-bold text-zinc-900 dark:text-white">{language === 'vi' ? 'Mời thành viên' : 'Invite Member'}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(false)}><X size={18} /></Button>
                         </div>
                         <div className="p-4">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                               {language === 'vi' ? 'Email' : 'Email Address'}
                            </label>
                            <Input
                               type="email"
                               value={inviteEmail}
                               onChange={(e) => setInviteEmail(e.target.value)}
                               placeholder="colleague@company.com"
                               className="mb-4"
                            />
                            <div className="flex gap-2">
                               <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                               </Button>
                               <Button className="flex-1" onClick={sendInvite} disabled={!inviteEmail.trim()}>
                                  <Send size={14} className="mr-2" /> {language === 'vi' ? 'Gửi lời mời' : 'Send Invite'}
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* Chat Modal */}
                {showChatModal && chatTarget && (
                   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[70vh]">
                         <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               {chatTarget === 'group' ? (
                                  <>
                                     <div className="w-10 h-10 rounded-full bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center">
                                        <Users size={20} className="text-repix-600" />
                                     </div>
                                     <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white">{language === 'vi' ? 'Chat nhóm' : 'Group Chat'}</h3>
                                        <p className="text-xs text-zinc-500">{projectMembers.length} {language === 'vi' ? 'thành viên' : 'members'}</p>
                                     </div>
                                  </>
                               ) : (
                                  <>
                                     <img src={chatTarget.avatar} className="w-10 h-10 rounded-full" />
                                     <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white">{chatTarget.name}</h3>
                                        <p className="text-xs text-green-500">{language === 'vi' ? 'Đang hoạt động' : 'Online'}</p>
                                     </div>
                                  </>
                               )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowChatModal(false)}><X size={18} /></Button>
                         </div>
                         
                         {/* Chat messages */}
                         <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] bg-zinc-50 dark:bg-zinc-900/50">
                            {/* Sample messages */}
                            <div className="flex gap-3">
                               <img src={teamMembers[0].avatar} className="w-8 h-8 rounded-full" />
                               <div className="bg-white dark:bg-zinc-800 rounded-xl rounded-tl-none p-3 max-w-[80%]">
                                  <p className="text-sm text-zinc-800 dark:text-zinc-200">Hey team! How's the banner design coming along?</p>
                                  <p className="text-[10px] text-zinc-400 mt-1">10:30 AM</p>
                               </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                               <div className="bg-repix-500 text-white rounded-xl rounded-tr-none p-3 max-w-[80%]">
                                  <p className="text-sm">Almost done! Just finalizing the colors.</p>
                                  <p className="text-[10px] text-repix-200 mt-1">10:32 AM</p>
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <img src={teamMembers[1].avatar} className="w-8 h-8 rounded-full" />
                               <div className="bg-white dark:bg-zinc-800 rounded-xl rounded-tl-none p-3 max-w-[80%]">
                                  <p className="text-sm text-zinc-800 dark:text-zinc-200">Great! Can't wait to see the final version 🎨</p>
                                  <p className="text-[10px] text-zinc-400 mt-1">10:35 AM</p>
                               </div>
                            </div>
                         </div>

                         {/* Chat input */}
                         <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex gap-2">
                               <Input
                                  value={chatMessage}
                                  onChange={(e) => setChatMessage(e.target.value)}
                                  placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                                  className="flex-1"
                                  onKeyDown={(e) => e.key === 'Enter' && setChatMessage('')}
                               />
                               <Button onClick={() => setChatMessage('')}>
                                  <Send size={16} />
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
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
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  
  // Modal states for new features
  const [showSettings, setShowSettings] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRolePermissions, setShowRolePermissions] = useState(false);
  const [showBrandGuidelines, setShowBrandGuidelines] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showTemplatesLibrary, setShowTemplatesLibrary] = useState(false);
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false);
  const [showTimeTracking, setShowTimeTracking] = useState(false);
  const [showExportReports, setShowExportReports] = useState(false);

  const handleLaunchProject = (newProject: Partial<Project>) => {
    // Add new project to the list
    const projectWithId: Project = {
      id: `p${Date.now()}`,
      name: newProject.name || 'Untitled Project',
      lastEdited: 'Just now',
      status: newProject.status || 'Draft',
      collaborators: newProject.collaborators || ['You'],
      thumbnail: newProject.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    };
    setProjects([projectWithId, ...projects]);
    setIsCreatingProject(false);
    setActiveProject(projectWithId);
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
          <div className="flex items-center gap-3">
            {/* Quick Action Buttons */}
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowActivityLog(true)}>
              <Activity size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowRolePermissions(true)}>
              <Shield size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
              <Settings size={18} />
            </Button>
            <Button onClick={() => setIsCreatingProject(true)} className="shadow-lg shadow-repix-500/20">
              <Plus size={16} className="mr-2" /> {trans.team.newProject}
            </Button>
          </div>
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

        {/* Quick Tools */}
        <div className="grid grid-cols-6 gap-4">
          {[
            { icon: FileText, label: 'Brand Guidelines', color: 'bg-violet-500', onClick: () => setShowBrandGuidelines(true) },
            { icon: Folder, label: 'Asset Library', color: 'bg-cyan-500', onClick: () => setShowAssetLibrary(true) },
            { icon: LayoutGrid, label: 'Templates', color: 'bg-pink-500', onClick: () => setShowTemplatesLibrary(true) },
            { icon: CheckCircle2, label: 'Approvals', color: 'bg-emerald-500', onClick: () => setShowApprovalWorkflow(true) },
            { icon: Clock, label: 'Time Tracking', color: 'bg-blue-500', onClick: () => setShowTimeTracking(true) },
            { icon: BarChart3, label: 'Export Reports', color: 'bg-orange-500', onClick: () => setShowExportReports(true) },
          ].map((tool, idx) => (
            <button
              key={idx}
              onClick={tool.onClick}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <tool.icon size={20} className="text-white" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">{tool.label}</p>
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div>
           <div className="flex items-center gap-4 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{trans.team.activeProjects}</h2>
              <div className="bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full text-xs text-zinc-500 dark:text-zinc-400">{trans.team.sort}</div>
           </div>
           
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
             {projects.map((project, idx) => (
               <div key={project.id} className={`flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${idx !== projects.length -1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`} onClick={() => setActiveProject(project)}>
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

        {/* Team Settings Modal */}
        <TeamSettings 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />

        {/* Activity Log Modal */}
        <ActivityLog 
          isOpen={showActivityLog} 
          onClose={() => setShowActivityLog(false)} 
        />

        {/* Notifications Panel */}
        <NotificationsPanel 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />

        {/* Role & Permissions Modal */}
        <RolePermissions 
          isOpen={showRolePermissions} 
          onClose={() => setShowRolePermissions(false)} 
        />

        {/* Brand Guidelines Modal */}
        <BrandGuidelines 
          isOpen={showBrandGuidelines} 
          onClose={() => setShowBrandGuidelines(false)} 
        />

        {/* Asset Library Modal */}
        <AssetLibrary 
          isOpen={showAssetLibrary} 
          onClose={() => setShowAssetLibrary(false)} 
        />

        {/* Templates Library Modal */}
        <TemplatesLibrary 
          isOpen={showTemplatesLibrary} 
          onClose={() => setShowTemplatesLibrary(false)} 
        />

        {/* Approval Workflow Modal */}
        <ApprovalWorkflow 
          isOpen={showApprovalWorkflow} 
          onClose={() => setShowApprovalWorkflow(false)} 
        />

        {/* Time Tracking Modal */}
        <TimeTracking 
          isOpen={showTimeTracking} 
          onClose={() => setShowTimeTracking(false)} 
        />

        {/* Export Reports Modal */}
        <ExportReports 
          isOpen={showExportReports} 
          onClose={() => setShowExportReports(false)} 
        />
      </div>
    </div>
  );
};
