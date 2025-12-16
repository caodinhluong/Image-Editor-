import React, { useState } from 'react';
import { 
  Users, FolderGit2, BarChart3, Settings, ShieldCheck, Plus, 
  LayoutGrid, FileText, Folder, Clock, CheckCircle2,
  Bell, Activity, UserPlus
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
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
import { TeamSpace, SpaceMember, JoinedSpace, mockProjects, analyticData } from './types';
import { InviteLinkModal, SpaceSwitcher, CreateProjectWizard, SpaceMembersList } from './SpaceComponents';
import { Project } from '../../types';
import { ProjectDetailView } from './ProjectDetailView';

interface SpaceDashboardProps {
  space: TeamSpace;
  onDeleteSpace: () => void;
  joinedSpaces?: JoinedSpace[];
  pendingInvitesCount?: number;
  onViewInvites?: () => void;
  ownedSpaces?: TeamSpace[];
  activeSpaceId?: string;
  onSwitchSpace?: (spaceId: string) => void;
  onCreateNewSpace?: () => void;
  isOwnSpace?: boolean;
  userRole?: 'lead' | 'member';
}


export const SpaceDashboard: React.FC<SpaceDashboardProps> = ({ 
  space, 
  onDeleteSpace,
  joinedSpaces = [],
  pendingInvitesCount = 0,
  onViewInvites,
  ownedSpaces = [],
  activeSpaceId = '',
  onSwitchSpace,
  onCreateNewSpace,
  isOwnSpace = true,
  userRole = 'lead'
}) => {
  const { language } = useLanguage();
  const { teamCredits } = useSubscription();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeProject, setActiveProject] = useState<Partial<Project> | null>(null);
  const [projects, setProjects] = useState<Project[]>(space.projects || mockProjects);
  
  // Update projects when space changes
  React.useEffect(() => {
    setProjects(space.projects || mockProjects);
  }, [space.id]);

  // Get members from space or use mock
  const spaceMembers = space.members || [
    { id: 'u0', name: 'Bạn (Lead)', email: 'you@repix.ai', avatar: 'https://picsum.photos/seed/user/50/50', role: 'lead' as const, joinedAt: space.createdAt, isOnline: true },
    { id: 'u1', name: 'Sarah Designer', email: 'sarah@company.com', avatar: 'https://picsum.photos/seed/user1/50/50', role: 'member' as const, joinedAt: '2024-01-15', isOnline: true },
    { id: 'u2', name: 'Mike Product', email: 'mike@company.com', avatar: 'https://picsum.photos/seed/user2/50/50', role: 'member' as const, joinedAt: '2024-01-20', isOnline: false },
  ];

  // Use space's team credits or context
  const displayCredits = space.teamCredits ?? teamCredits;

  // Permission checks - Lead can do everything, Member has limited access
  const canInvite = userRole === 'lead';
  const canCreateProject = true; // Both lead and member can create projects
  const canManageSettings = userRole === 'lead';
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // Modal states
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

  // Use space members
  const members = spaceMembers;

  const handleLaunchProject = (newProject: Partial<Project>) => {
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

  // If viewing a project detail
  if (activeProject) {
    return <ProjectDetailView project={activeProject} onBack={() => setActiveProject(null)} />;
  }

  // If viewing settings (now a full view, not modal)
  if (showSettings) {
    return <TeamSettings isOpen={true} onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg p-8 overflow-y-auto">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-8">

        {/* Space Header - Clean & Professional */}
        <div className="flex justify-between items-center">
          {/* Left: Space Switcher */}
          <SpaceSwitcher
            currentSpace={space}
            joinedSpaces={joinedSpaces}
            pendingInvitesCount={pendingInvitesCount}
            onSelectJoinedSpace={(joinedSpace) => onSwitchSpace?.(`joined_${joinedSpace.id}`)}
            onViewInvites={onViewInvites || (() => {})}
            ownedSpaces={ownedSpaces}
            activeSpaceId={activeSpaceId}
            onSwitchSpace={onSwitchSpace}
            onCreateNewSpace={onCreateNewSpace}
            isOwnSpace={isOwnSpace}
            userRole={userRole}
          />
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {canInvite && (
              <Button onClick={() => setShowInviteModal(true)} variant="outline" className="border-repix-500 text-repix-600 hover:bg-repix-50 dark:hover:bg-repix-900/20">
                <UserPlus size={16} className="mr-2" /> {language === 'vi' ? 'Mời' : 'Invite'}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowActivityLog(true)}>
              <Activity size={18} />
            </Button>
            {canManageSettings && (
              <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
                <Settings size={18} />
              </Button>
            )}
            {canCreateProject && (
              <Button onClick={() => setIsCreatingProject(true)} className="shadow-lg shadow-repix-500/20">
                <Plus size={16} className="mr-2" /> {language === 'vi' ? 'Dự án mới' : 'New Project'}
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <Users size={16} />
              <span>{members.length} {language === 'vi' ? 'thành viên' : 'members'}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <ShieldCheck size={16} />
              <span>{language === 'vi' ? 'Gói Team' : 'Team Plan'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {members.filter(m => m.isOnline).slice(0, 3).map(member => (
                  <img 
                    key={member.id} 
                    src={member.avatar} 
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900" 
                    title={member.name}
                  />
                ))}
              </div>
              <span className="text-xs text-green-500 font-medium">
                {members.filter(m => m.isOnline).length} online
              </span>
            </div>
          </div>
          
          {/* Leave Space button for joined spaces */}
          {!isOwnSpace && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDeleteSpace}
              className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              {language === 'vi' ? 'Rời Space' : 'Leave Space'}
            </Button>
          )}
        </div>

        {/* Analytics & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 2xl:gap-6">
          <Card className="p-6 col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-repix-500"/> {language === 'vi' ? 'Hoạt động' : 'Activity'}
              </h3>
              <select className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded px-2 py-1 outline-none">
                <option>{language === 'vi' ? '7 ngày qua' : 'Last 7 Days'}</option>
                <option>{language === 'vi' ? '30 ngày qua' : 'Last 30 Days'}</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} />
                  <YAxis stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} />
                  <Bar dataKey="views" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-6">
            {/* Personal Credits */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-zinc-500 mb-1">{language === 'vi' ? 'Credit cá nhân' : 'Personal Credits'}</h3>
              <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">∞</div>
              <p className="text-xs text-zinc-500">{language === 'vi' ? 'Không giới hạn' : 'Unlimited'}</p>
            </Card>

            {/* Team Credits */}
            <Card className="p-6 border-repix-200 dark:border-repix-800 bg-gradient-to-br from-repix-50/50 to-violet-50/50 dark:from-repix-900/10 dark:to-violet-900/10">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-zinc-500">{language === 'vi' ? 'Credit Team' : 'Team Credits'}</h3>
                <Badge className="bg-repix-100 text-repix-700 dark:bg-repix-900/30 dark:text-repix-400 text-[10px]">
                  {language === 'vi' ? 'Chia sẻ' : 'Shared'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                {displayCredits.toLocaleString()}
                <span className="text-lg text-zinc-400 font-normal"> / 2,000</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-repix-500 to-pink-500 transition-all" 
                  style={{ width: `${Math.min((displayCredits / 2000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500">
                {language === 'vi' ? 'Dùng chung cho cả team' : 'Shared across team members'}
              </p>
            </Card>

            {/* Projects Summary */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-zinc-500 mb-3">{language === 'vi' ? 'Dự án' : 'Projects'}</h3>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{projects.length}</div>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  {projects.filter(p => p.status === 'Approved').length} {language === 'vi' ? 'đã duyệt' : 'approved'}
                </span>
                <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  {projects.filter(p => p.status === 'In Review').length} {language === 'vi' ? 'đang xét' : 'in review'}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 2xl:gap-4">
          {[
            { icon: FileText, label: language === 'vi' ? 'Brand Guidelines' : 'Brand Guidelines', color: 'bg-violet-500', onClick: () => setShowBrandGuidelines(true) },
            { icon: Folder, label: language === 'vi' ? 'Thư viện Asset' : 'Asset Library', color: 'bg-cyan-500', onClick: () => setShowAssetLibrary(true) },
            { icon: LayoutGrid, label: 'Templates', color: 'bg-pink-500', onClick: () => setShowTemplatesLibrary(true) },
            { icon: CheckCircle2, label: language === 'vi' ? 'Phê duyệt' : 'Approvals', color: 'bg-emerald-500', onClick: () => setShowApprovalWorkflow(true) },
            { icon: Clock, label: language === 'vi' ? 'Thời gian' : 'Time Tracking', color: 'bg-blue-500', onClick: () => setShowTimeTracking(true) },
            { icon: BarChart3, label: language === 'vi' ? 'Báo cáo' : 'Reports', color: 'bg-orange-500', onClick: () => setShowExportReports(true) },
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
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {language === 'vi' ? 'Dự án' : 'Projects'}
            </h2>
            <Badge>{projects.length}</Badge>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className={`flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${
                  idx !== projects.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
                }`}
                onClick={() => setActiveProject(project)}
              >
                <div className="flex items-center gap-4">
                  <img src={project.thumbnail} className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800 object-cover" />
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-white hover:text-repix-500 transition-colors">{project.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <FolderGit2 size={12} /> {project.lastEdited}
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
                    {project.status === 'Approved' && <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">{language === 'vi' ? 'Đã duyệt' : 'Approved'}</Badge>}
                    {project.status === 'In Review' && <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">{language === 'vi' ? 'Đang xét' : 'In Review'}</Badge>}
                    {project.status === 'Draft' && <Badge>{language === 'vi' ? 'Nháp' : 'Draft'}</Badge>}
                  </div>
                  
                  <Button variant="ghost" size="icon"><Settings size={18} /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        <InviteLinkModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} space={space} />
        
        {isCreatingProject && (
          <CreateProjectWizard onClose={() => setIsCreatingProject(false)} onCreate={handleLaunchProject} />
        )}
        
        {/* TeamSettings is now rendered as a view above, not as modal */}
        <ActivityLog isOpen={showActivityLog} onClose={() => setShowActivityLog(false)} />
        <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <RolePermissions isOpen={showRolePermissions} onClose={() => setShowRolePermissions(false)} />
        <BrandGuidelines isOpen={showBrandGuidelines} onClose={() => setShowBrandGuidelines(false)} />
        <AssetLibrary isOpen={showAssetLibrary} onClose={() => setShowAssetLibrary(false)} />
        <TemplatesLibrary isOpen={showTemplatesLibrary} onClose={() => setShowTemplatesLibrary(false)} />
        <ApprovalWorkflow isOpen={showApprovalWorkflow} onClose={() => setShowApprovalWorkflow(false)} />
        <TimeTracking isOpen={showTimeTracking} onClose={() => setShowTimeTracking(false)} />
        <ExportReports isOpen={showExportReports} onClose={() => setShowExportReports(false)} />
      </div>
    </div>
  );
};
