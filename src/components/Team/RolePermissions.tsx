import React, { useState } from 'react';
import {
  X, Shield, Users, Check, X as XIcon, Info,
  Eye, Edit3, Trash2, Upload, Download, Settings,
  FolderPlus, UserPlus, CreditCard, Lock, Unlock
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface RolePermissionsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Permission {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  category: 'projects' | 'assets' | 'team' | 'billing' | 'settings';
}

interface Role {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  color: string;
  permissions: string[];
  isDefault?: boolean;
  memberCount: number;
}

export const RolePermissions: React.FC<RolePermissionsProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<string>('editor');
  const [isEditing, setIsEditing] = useState(false);

  const trans = {
    title: language === 'vi' ? 'Quản lý quyền' : 'Role & Permissions',
    subtitle: language === 'vi' ? 'Cấu hình quyền truy cập cho từng vai trò' : 'Configure access permissions for each role',
    roles: language === 'vi' ? 'Vai trò' : 'Roles',
    permissions: language === 'vi' ? 'Quyền hạn' : 'Permissions',
    members: language === 'vi' ? 'thành viên' : 'members',
    save: language === 'vi' ? 'Lưu thay đổi' : 'Save Changes',
    cancel: language === 'vi' ? 'Hủy' : 'Cancel',
    edit: language === 'vi' ? 'Chỉnh sửa' : 'Edit',
    createRole: language === 'vi' ? 'Tạo vai trò mới' : 'Create New Role',
    default: language === 'vi' ? 'Mặc định' : 'Default',
    projects: language === 'vi' ? 'Dự án' : 'Projects',
    assets: language === 'vi' ? 'Assets' : 'Assets',
    team: language === 'vi' ? 'Nhóm' : 'Team',
    billing: language === 'vi' ? 'Thanh toán' : 'Billing',
    settings: language === 'vi' ? 'Cài đặt' : 'Settings',
  };

  const permissions: Permission[] = [
    // Projects
    { id: 'project_view', name: 'View projects', nameVi: 'Xem dự án', description: 'Can view all projects', descriptionVi: 'Có thể xem tất cả dự án', category: 'projects' },
    { id: 'project_create', name: 'Create projects', nameVi: 'Tạo dự án', description: 'Can create new projects', descriptionVi: 'Có thể tạo dự án mới', category: 'projects' },
    { id: 'project_edit', name: 'Edit projects', nameVi: 'Sửa dự án', description: 'Can edit project details', descriptionVi: 'Có thể sửa thông tin dự án', category: 'projects' },
    { id: 'project_delete', name: 'Delete projects', nameVi: 'Xóa dự án', description: 'Can delete projects', descriptionVi: 'Có thể xóa dự án', category: 'projects' },
    // Assets
    { id: 'asset_view', name: 'View assets', nameVi: 'Xem assets', description: 'Can view all assets', descriptionVi: 'Có thể xem tất cả assets', category: 'assets' },
    { id: 'asset_upload', name: 'Upload assets', nameVi: 'Tải lên assets', description: 'Can upload new assets', descriptionVi: 'Có thể tải lên assets mới', category: 'assets' },
    { id: 'asset_edit', name: 'Edit assets', nameVi: 'Sửa assets', description: 'Can edit assets in editor', descriptionVi: 'Có thể sửa assets trong editor', category: 'assets' },
    { id: 'asset_delete', name: 'Delete assets', nameVi: 'Xóa assets', description: 'Can delete assets', descriptionVi: 'Có thể xóa assets', category: 'assets' },
    { id: 'asset_download', name: 'Download assets', nameVi: 'Tải xuống assets', description: 'Can download assets', descriptionVi: 'Có thể tải xuống assets', category: 'assets' },
    { id: 'asset_approve', name: 'Approve assets', nameVi: 'Duyệt assets', description: 'Can approve/reject assets', descriptionVi: 'Có thể duyệt/từ chối assets', category: 'assets' },
    // Team
    { id: 'team_view', name: 'View members', nameVi: 'Xem thành viên', description: 'Can view team members', descriptionVi: 'Có thể xem thành viên nhóm', category: 'team' },
    { id: 'team_invite', name: 'Invite members', nameVi: 'Mời thành viên', description: 'Can invite new members', descriptionVi: 'Có thể mời thành viên mới', category: 'team' },
    { id: 'team_remove', name: 'Remove members', nameVi: 'Xóa thành viên', description: 'Can remove team members', descriptionVi: 'Có thể xóa thành viên', category: 'team' },
    { id: 'team_role', name: 'Change roles', nameVi: 'Đổi vai trò', description: 'Can change member roles', descriptionVi: 'Có thể thay đổi vai trò', category: 'team' },
    // Billing
    { id: 'billing_view', name: 'View billing', nameVi: 'Xem thanh toán', description: 'Can view billing info', descriptionVi: 'Có thể xem thông tin thanh toán', category: 'billing' },
    { id: 'billing_manage', name: 'Manage billing', nameVi: 'Quản lý thanh toán', description: 'Can manage payments', descriptionVi: 'Có thể quản lý thanh toán', category: 'billing' },
    { id: 'credits_purchase', name: 'Purchase credits', nameVi: 'Mua credits', description: 'Can purchase credits', descriptionVi: 'Có thể mua thêm credits', category: 'billing' },
    // Settings
    { id: 'settings_view', name: 'View settings', nameVi: 'Xem cài đặt', description: 'Can view workspace settings', descriptionVi: 'Có thể xem cài đặt workspace', category: 'settings' },
    { id: 'settings_edit', name: 'Edit settings', nameVi: 'Sửa cài đặt', description: 'Can edit workspace settings', descriptionVi: 'Có thể sửa cài đặt workspace', category: 'settings' },
  ];

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'owner',
      name: 'Owner',
      nameVi: 'Chủ sở hữu',
      description: 'Full access to everything',
      descriptionVi: 'Toàn quyền truy cập',
      color: 'bg-red-500',
      permissions: permissions.map(p => p.id),
      memberCount: 1,
    },
    {
      id: 'admin',
      name: 'Admin',
      nameVi: 'Quản trị viên',
      description: 'Can manage team and settings',
      descriptionVi: 'Có thể quản lý nhóm và cài đặt',
      color: 'bg-violet-500',
      permissions: permissions.filter(p => p.id !== 'billing_manage').map(p => p.id),
      memberCount: 2,
    },
    {
      id: 'editor',
      name: 'Editor',
      nameVi: 'Biên tập viên',
      description: 'Can create and edit content',
      descriptionVi: 'Có thể tạo và sửa nội dung',
      color: 'bg-blue-500',
      permissions: ['project_view', 'project_create', 'project_edit', 'asset_view', 'asset_upload', 'asset_edit', 'asset_download', 'team_view'],
      isDefault: true,
      memberCount: 5,
    },
    {
      id: 'viewer',
      name: 'Viewer',
      nameVi: 'Người xem',
      description: 'Can only view content',
      descriptionVi: 'Chỉ có thể xem nội dung',
      color: 'bg-zinc-500',
      permissions: ['project_view', 'asset_view', 'asset_download', 'team_view'],
      memberCount: 4,
    },
  ]);

  const currentRole = roles.find(r => r.id === selectedRole);

  const togglePermission = (permissionId: string) => {
    if (!isEditing || selectedRole === 'owner') return;
    
    setRoles(prev => prev.map(role => {
      if (role.id === selectedRole) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      projects: <FolderPlus size={16} />,
      assets: <Upload size={16} />,
      team: <Users size={16} />,
      billing: <CreditCard size={16} />,
      settings: <Settings size={16} />,
    };
    return icons[category];
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Shield size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
              <p className="text-xs text-zinc-500">{trans.subtitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Roles Sidebar */}
          <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{trans.roles}</h3>
              <Button variant="ghost" size="sm" className="text-xs">
                <UserPlus size={12} className="mr-1" /> {trans.createRole}
              </Button>
            </div>

            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedRole === role.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 ring-2 ring-repix-500'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-900 dark:text-white text-sm">
                          {language === 'vi' ? role.nameVi : role.name}
                        </span>
                        {role.isDefault && (
                          <Badge className="text-[9px] px-1 py-0">{trans.default}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{role.memberCount} {trans.members}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentRole && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${currentRole.color}`} />
                      {language === 'vi' ? currentRole.nameVi : currentRole.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {language === 'vi' ? currentRole.descriptionVi : currentRole.description}
                    </p>
                  </div>
                  {selectedRole !== 'owner' && (
                    <Button 
                      variant={isEditing ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <><Check size={14} className="mr-1" /> {trans.save}</> : <><Edit3 size={14} className="mr-1" /> {trans.edit}</>}
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2 uppercase">
                        {getCategoryIcon(category)}
                        {trans[category as keyof typeof trans] || category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {perms.map(perm => {
                          const hasPermission = currentRole.permissions.includes(perm.id);
                          return (
                            <div
                              key={perm.id}
                              onClick={() => togglePermission(perm.id)}
                              className={`p-3 rounded-lg border transition-all ${
                                hasPermission
                                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                              } ${isEditing && selectedRole !== 'owner' ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className={`text-sm font-medium ${hasPermission ? 'text-green-700 dark:text-green-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {language === 'vi' ? perm.nameVi : perm.name}
                                  </p>
                                  <p className="text-xs text-zinc-500 mt-0.5">
                                    {language === 'vi' ? perm.descriptionVi : perm.description}
                                  </p>
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  hasPermission ? 'bg-green-500 text-white' : 'bg-zinc-300 dark:bg-zinc-600'
                                }`}>
                                  {hasPermission ? <Check size={12} /> : <XIcon size={12} />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
