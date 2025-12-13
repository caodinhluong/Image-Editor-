import React, { useState } from 'react';
import { 
  X, Check, Link2, Copy, Mail, ExternalLink, UserMinus, ChevronRight,
  Plus, Wand2, Loader2, Layout, ShoppingBag, Globe, File
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { TeamSpace, SpaceMember, JoinedSpace, teamMembers } from './types';
import { Project } from '../../types';

// ============================================
// INVITE LINK MODAL
// ============================================
interface InviteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: TeamSpace;
}

export const InviteLinkModal: React.FC<InviteLinkModalProps> = ({ isOpen, onClose, space }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(space.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-repix-100 dark:bg-repix-900/30 flex items-center justify-center">
              <Link2 size={20} className="text-repix-600" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">
              {language === 'vi' ? 'Mời thành viên' : 'Invite Members'}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {language === 'vi' 
              ? 'Chia sẻ link này để mời người khác tham gia space của bạn'
              : 'Share this link to invite others to join your space'}
          </p>

          {/* Link Box */}
          <div className="flex items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-4">
            <Link2 size={18} className="text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              value={space.inviteLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-zinc-700 dark:text-zinc-300 outline-none"
            />
            <Button 
              size="sm" 
              variant={copied ? 'primary' : 'outline'}
              onClick={copyLink}
              className={copied ? 'bg-green-500 hover:bg-green-500' : ''}
            >
              {copied ? (
                <><Check size={14} className="mr-1" /> {language === 'vi' ? 'Đã copy' : 'Copied'}</>
              ) : (
                <><Copy size={14} className="mr-1" /> Copy</>
              )}
            </Button>
          </div>

          {/* QR Code placeholder */}
          <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <div className="w-32 h-32 mx-auto bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center mb-3">
              <div className="grid grid-cols-5 gap-1">
                {Array(25).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-zinc-900 dark:bg-white' : 'bg-transparent'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              {language === 'vi' ? 'Quét QR để tham gia' : 'Scan QR to join'}
            </p>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => window.open(`mailto:?subject=Join my team on Repix&body=${space.inviteLink}`)}>
              <Mail size={16} className="mr-2" /> Email
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(space.inviteLink)}`)}>
              <ExternalLink size={16} className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SPACE MEMBERS LIST
// ============================================
interface SpaceMembersListProps {
  members: SpaceMember[];
  onRemoveMember: (id: string) => void;
  onChangeRole: (id: string, role: SpaceMember['role']) => void;
  currentUserId: string;
}

export const SpaceMembersList: React.FC<SpaceMembersListProps> = ({ members, onRemoveMember, onChangeRole, currentUserId }) => {
  const { language } = useLanguage();

  const getRoleLabel = (role: SpaceMember['role']) => {
    const labels: Record<string, string> = {
      lead: 'Lead',
      member: 'Member',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: SpaceMember['role']) => {
    const colors: Record<string, string> = {
      lead: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      member: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return colors[role] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {members.map((member, idx) => (
        <div 
          key={member.id}
          className={`flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group ${
            idx !== members.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={member.avatar} className="w-12 h-12 rounded-full" alt={member.name} />
              {member.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
              )}
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
              <p className="text-xs text-zinc-500">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getRoleColor(member.role)}>
              {getRoleLabel(member.role)}
            </Badge>
            
            {member.role !== 'lead' && member.id !== currentUserId && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => onRemoveMember(member.id)}
              >
                <UserMinus size={14} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// JOINED SPACES SIDEBAR
// ============================================
// ============================================
// SPACE SWITCHER (Dropdown in header)
// ============================================
interface SpaceSwitcherProps {
  currentSpace: TeamSpace;
  joinedSpaces: JoinedSpace[];
  pendingInvitesCount: number;
  onSelectJoinedSpace: (space: JoinedSpace) => void;
  onViewInvites: () => void;
  ownedSpaces?: TeamSpace[];
  activeSpaceId?: string;
  onSwitchSpace?: (spaceId: string) => void;
  onCreateNewSpace?: () => void;
  isOwnSpace?: boolean;
  userRole?: 'lead' | 'member';
}

export const SpaceSwitcher: React.FC<SpaceSwitcherProps> = ({ 
  currentSpace, 
  joinedSpaces, 
  pendingInvitesCount,
  onSelectJoinedSpace,
  onViewInvites,
  ownedSpaces = [],
  activeSpaceId = '',
  onSwitchSpace,
  onCreateNewSpace,
  isOwnSpace = true,
  userRole = 'lead'
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      lead: 'Lead',
      member: 'Member',
    };
    return labels[role] || role;
  };

  // Count total other spaces
  const otherOwnedSpaces = ownedSpaces.filter(s => activeSpaceId !== `own_${s.id}`);
  const totalOtherSpaces = otherOwnedSpaces.length + joinedSpaces.length + pendingInvitesCount;

  return (
    <div className="relative">
      {/* Current Space Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 pr-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
          isOwnSpace 
            ? 'bg-gradient-to-br from-repix-500 to-pink-500 shadow-repix-500/20' 
            : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-cyan-500/20'
        }`}>
          {currentSpace.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{currentSpace.name}</h1>
            <ChevronRight size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-zinc-500">
              {isOwnSpace 
                ? (language === 'vi' ? 'Space của bạn' : 'Your Space')
                : getRoleLabel(userRole)
              }
            </p>
            {!isOwnSpace && (
              <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-[9px] px-1.5 py-0">
                {language === 'vi' ? 'Đã tham gia' : 'Joined'}
              </Badge>
            )}
          </div>
        </div>
        {totalOtherSpaces > 0 && (
          <div className="ml-2 w-5 h-5 rounded-full bg-repix-500 text-white text-[10px] font-bold flex items-center justify-center">
            {totalOtherSpaces}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
            {/* Current Space */}
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                {language === 'vi' ? 'Space hiện tại' : 'Current Space'}
              </p>
              <div className={`flex items-center gap-3 p-2 rounded-xl border ${
                isOwnSpace 
                  ? 'bg-repix-50 dark:bg-repix-900/20 border-repix-200 dark:border-repix-800'
                  : 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                  isOwnSpace 
                    ? 'bg-gradient-to-br from-repix-500 to-pink-500'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                }`}>
                  {currentSpace.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-zinc-900 dark:text-white">{currentSpace.name}</p>
                  <p className="text-xs text-zinc-500">{getRoleLabel(userRole)}</p>
                </div>
                <Check size={18} className={isOwnSpace ? 'text-repix-500' : 'text-cyan-500'} />
              </div>
            </div>

            {/* Your Spaces (owned) */}
            {ownedSpaces.length > 0 && (
              <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {language === 'vi' ? 'Spaces của bạn' : 'Your Spaces'} ({ownedSpaces.length})
                  </p>
                </div>
                <div className="space-y-1">
                  {ownedSpaces.map((space) => {
                    const isActive = activeSpaceId === `own_${space.id}`;
                    return (
                      <button
                        key={space.id}
                        onClick={() => {
                          if (!isActive) {
                            onSwitchSpace?.(`own_${space.id}`);
                          }
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-repix-50 dark:bg-repix-900/20 border border-repix-200 dark:border-repix-800'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {space.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-zinc-900 dark:text-white">{space.name}</p>
                          <p className="text-xs text-zinc-500">{language === 'vi' ? 'Chủ sở hữu' : 'Owner'}</p>
                        </div>
                        {isActive && <Check size={16} className="text-repix-500" />}
                      </button>
                    );
                  })}
                </div>
                
                {/* Create New Space Button */}
                <button
                  onClick={() => {
                    onCreateNewSpace?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 mt-2 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-repix-300 dark:hover:border-repix-700 hover:bg-repix-50/50 dark:hover:bg-repix-900/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Plus size={20} className="text-zinc-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-zinc-600 dark:text-zinc-400">
                      {language === 'vi' ? 'Tạo Space mới' : 'Create New Space'}
                    </p>
                    <p className="text-xs text-zinc-400">{language === 'vi' ? 'Thêm workspace mới' : 'Add new workspace'}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Joined Spaces */}
            {joinedSpaces.length > 0 && (
              <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {language === 'vi' ? 'Spaces đã tham gia' : 'Joined Spaces'} ({joinedSpaces.length})
                </p>
                <div className="space-y-1">
                  {joinedSpaces.map((space) => {
                    const isActive = activeSpaceId === `joined_${space.id}`;
                    return (
                      <button
                        key={space.id}
                        onClick={() => {
                          if (!isActive) {
                            onSelectJoinedSpace(space);
                          }
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {space.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-zinc-900 dark:text-white">{space.name}</p>
                          <p className="text-xs text-zinc-500">{space.ownerName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px]">
                            {getRoleLabel(space.role)}
                          </Badge>
                          {isActive && <Check size={16} className="text-cyan-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pending Invites */}
            {pendingInvitesCount > 0 && (
              <div className="p-3">
                <button
                  onClick={() => {
                    onViewInvites();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {pendingInvitesCount} {language === 'vi' ? 'lời mời đang chờ' : 'pending invite(s)'}
                    </p>
                    <p className="text-xs text-zinc-500">{language === 'vi' ? 'Nhấn để xem' : 'Click to view'}</p>
                  </div>
                  <ChevronRight size={18} className="text-amber-500" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Legacy component - kept for backward compatibility
interface JoinedSpacesSidebarProps {
  spaces: JoinedSpace[];
  currentSpaceId?: string;
  onSelectSpace: (space: JoinedSpace) => void;
}

export const JoinedSpacesSidebar: React.FC<JoinedSpacesSidebarProps> = ({ spaces, currentSpaceId, onSelectSpace }) => {
  // This component is now deprecated - use SpaceSwitcher instead
  return null;
};

// ============================================
// CREATE PROJECT WIZARD
// ============================================
interface CreateProjectWizardProps {
  onClose: () => void;
  onCreate: (project: Partial<Project>) => void;
}

export const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({ onClose, onCreate }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 3;
  
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
    }, 1500);
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(prev => prev.filter(m => m !== id));
    } else {
      setSelectedMembers(prev => [...prev, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-[#09090b] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-repix-500 flex items-center justify-center text-white shadow-lg shadow-repix-500/20">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white leading-none">
                {language === 'vi' ? 'Tạo dự án mới' : 'Create New Project'}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {language === 'vi' ? `Bước ${step}/${totalSteps}` : `Step ${step} of ${totalSteps}`}
              </p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X size={20}/></Button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
          <div className="h-full bg-repix-500 transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* STEP 1: PROJECT TYPE */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">
                {language === 'vi' ? 'Chọn loại dự án' : 'Choose Project Type'}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'social', icon: Layout, label: 'Social Media', desc: 'Posts & Stories', color: 'text-pink-500', bg: 'bg-pink-500/10' },
                  { id: 'product', icon: ShoppingBag, label: 'Product', desc: 'E-commerce', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { id: 'marketing', icon: Globe, label: 'Marketing', desc: 'Ad Banners', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { id: 'blank', icon: File, label: 'Blank', desc: 'Start fresh', color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
                ].map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedType(item.id)}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-3 hover:scale-[1.02] ${
                      selectedType === item.id 
                        ? 'border-repix-500 bg-repix-50 dark:bg-repix-900/10' 
                        : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.bg}`}>
                      <item.icon size={28} className={item.color} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{item.label}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                    {selectedType === item.id && (
                      <div className="w-6 h-6 rounded-full bg-repix-500 flex items-center justify-center text-white">
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
            <div className="animate-in slide-in-from-right-8 duration-300 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-6 text-center">
                {language === 'vi' ? 'Chi tiết dự án' : 'Project Details'}
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {language === 'vi' ? 'Tên dự án' : 'Project Name'}
                  </label>
                  <Input 
                    placeholder={language === 'vi' ? 'VD: Summer Campaign' : 'e.g. Summer Campaign'} 
                    className="h-12 text-lg" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {language === 'vi' ? 'Mô tả' : 'Description'}
                  </label>
                  <textarea className="w-full h-28 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-repix-500 resize-none text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TEAM */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-300 max-w-lg mx-auto">
              <h3 className="text-xl font-bold mb-2 text-center">
                {language === 'vi' ? 'Thêm thành viên' : 'Add Members'}
              </h3>
              <p className="text-zinc-500 text-center mb-6 text-sm">
                {language === 'vi' ? 'Chọn thành viên tham gia dự án' : 'Select members to collaborate'}
              </p>
              
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all cursor-pointer"
                    onClick={() => toggleMember(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} className="w-10 h-10 rounded-full bg-zinc-200" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-zinc-500">{member.role}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                      selectedMembers.includes(member.id) 
                        ? 'bg-repix-500 border-repix-500 text-white' 
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}>
                      {selectedMembers.includes(member.id) && <Check size={14} />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">
                  {language === 'vi' ? `Đã chọn ${selectedMembers.length} thành viên` : `${selectedMembers.length} members selected`}
                </p>
                <div className="flex -space-x-2">
                  {selectedMembers.map(id => {
                    const m = teamMembers.find(tm => tm.id === id);
                    return m && <img key={id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900" title={m.name} />;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="text-zinc-500">
            {language === 'vi' ? 'Quay lại' : 'Back'}
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={step === 1 && !selectedType}>
              {language === 'vi' ? 'Tiếp tục' : 'Next'} <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={!projectName} className="px-8 shadow-xl shadow-repix-500/20">
              {isLoading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> {language === 'vi' ? 'Đang tạo...' : 'Creating...'}</>
              ) : (
                <><Wand2 size={16} className="mr-2" /> {language === 'vi' ? 'Tạo dự án' : 'Create Project'}</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
