import React, { useState } from 'react';
import {
  Settings, Users, CreditCard, Shield, Bell,
  Upload, Trash2, Building2,
  Mail, Eye, EyeOff, Copy, RefreshCw, AlertTriangle,
  ArrowLeft, Crown, User
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface TeamSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'members' | 'billing' | 'security' | 'notifications';

export const TeamSettings: React.FC<TeamSettingsProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('Repix Design Team');
  const [workspaceUrl, setWorkspaceUrl] = useState('repix-design');

  const trans = {
    title: language === 'vi' ? 'Cài đặt Workspace' : 'Workspace Settings',
    general: language === 'vi' ? 'Chung' : 'General',
    members: language === 'vi' ? 'Thành viên' : 'Members',
    billing: language === 'vi' ? 'Thanh toán' : 'Billing',
    security: language === 'vi' ? 'Bảo mật' : 'Security',
    notifications: language === 'vi' ? 'Thông báo' : 'Notifications',
    save: language === 'vi' ? 'Lưu thay đổi' : 'Save Changes',
    cancel: language === 'vi' ? 'Quay lại' : 'Back',
    workspaceName: language === 'vi' ? 'Tên Workspace' : 'Workspace Name',
    workspaceUrl: language === 'vi' ? 'URL Workspace' : 'Workspace URL',
    workspaceLogo: language === 'vi' ? 'Logo Workspace' : 'Workspace Logo',
    uploadLogo: language === 'vi' ? 'Tải lên logo' : 'Upload Logo',
    dangerZone: language === 'vi' ? 'Vùng nguy hiểm' : 'Danger Zone',
    deleteWorkspace: language === 'vi' ? 'Xóa Workspace' : 'Delete Workspace',
    deleteWarning: language === 'vi' ? 'Hành động này không thể hoàn tác' : 'This action cannot be undone',
  };

  const tabs = [
    { id: 'general', label: trans.general, icon: Settings },
    { id: 'members', label: trans.members, icon: Users },
    { id: 'billing', label: trans.billing, icon: CreditCard },
    { id: 'security', label: trans.security, icon: Shield },
    { id: 'notifications', label: trans.notifications, icon: Bell },
  ];

  if (!isOpen) return null;

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-4"
          >
            <ArrowLeft size={16} />
            {trans.cancel}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">Repix Team</p>
              <Badge className="bg-repix-100 text-repix-700 dark:bg-repix-900/30 dark:text-repix-400 text-[10px]">
                Team Plan
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-repix-50 dark:bg-repix-900/20 text-repix-600 dark:text-repix-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 px-8 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
          <Button>{trans.save}</Button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-dark-bg">
          <div className="max-w-3xl">

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Card className="p-6">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                    {language === 'vi' ? 'Thông tin cơ bản' : 'Basic Information'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        {trans.workspaceName}
                      </label>
                      <Input
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="max-w-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        {trans.workspaceUrl}
                      </label>
                      <div className="flex items-center gap-2 max-w-md">
                        <span className="text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">repix.ai/</span>
                        <Input
                          value={workspaceUrl}
                          onChange={(e) => setWorkspaceUrl(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        {trans.workspaceLogo}
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Building2 size={32} className="text-zinc-400" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload size={14} className="mr-2" /> {trans.uploadLogo}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Danger Zone */}
                <Card className="p-6 border-red-200 dark:border-red-900/50">
                  <h3 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} /> {trans.dangerZone}
                  </h3>
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{trans.deleteWorkspace}</p>
                        <p className="text-sm text-zinc-500">{trans.deleteWarning}</p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white">
                        {language === 'vi' ? 'Thành viên Team' : 'Team Members'}
                      </h3>
                      <p className="text-sm text-zinc-500">4 {language === 'vi' ? 'thành viên' : 'members'}</p>
                    </div>
                    <Button size="sm">
                      <Mail size={14} className="mr-2" /> {language === 'vi' ? 'Mời thành viên' : 'Invite Members'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Designer', email: 'sarah@company.com', role: 'lead', avatar: 'https://picsum.photos/seed/u1/40' },
                      { name: 'Mike Product', email: 'mike@company.com', role: 'member', avatar: 'https://picsum.photos/seed/u2/40' },
                      { name: 'Jessica Marketing', email: 'jessica@company.com', role: 'member', avatar: 'https://picsum.photos/seed/u3/40' },
                      { name: 'Tom Dev', email: 'tom@company.com', role: 'member', avatar: 'https://picsum.photos/seed/u4/40' },
                    ].map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{member.name}</p>
                            <p className="text-xs text-zinc-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={member.role === 'lead' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }>
                            {member.role === 'lead' ? (
                              <><Crown size={12} className="mr-1" /> Lead</>
                            ) : (
                              <><User size={12} className="mr-1" /> Member</>
                            )}
                          </Badge>
                          {member.role !== 'lead' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500">
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Card className="p-6 bg-gradient-to-r from-repix-500/10 to-pink-500/10 border-repix-200 dark:border-repix-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="bg-repix-500 text-white border-0 mb-2">Team Plan</Badge>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">$99/{language === 'vi' ? 'tháng' : 'month'}</h3>
                      <p className="text-sm text-zinc-500">{language === 'vi' ? 'Thanh toán hàng năm • Gia hạn 15/12/2025' : 'Billed annually • Renews Dec 15, 2025'}</p>
                    </div>
                    <Button variant="outline">{language === 'vi' ? 'Quản lý gói' : 'Manage Plan'}</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">{language === 'vi' ? 'Sử dụng Credit' : 'Credit Usage'}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                      <p className="text-3xl font-bold text-repix-500">45,200</p>
                      <p className="text-sm text-zinc-500">{language === 'vi' ? 'Còn lại' : 'Available'}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                      <p className="text-3xl font-bold text-zinc-900 dark:text-white">12,800</p>
                      <p className="text-sm text-zinc-500">{language === 'vi' ? 'Đã dùng tháng này' : 'Used this month'}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                      <p className="text-3xl font-bold text-green-500">∞</p>
                      <p className="text-sm text-zinc-500">{language === 'vi' ? 'Giới hạn hàng tháng' : 'Monthly limit'}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">{language === 'vi' ? 'Phương thức thanh toán' : 'Payment Method'}</h3>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-xs text-zinc-500">{language === 'vi' ? 'Hết hạn' : 'Expires'} 12/26</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">{language === 'vi' ? 'Thay đổi' : 'Change'}</Button>
                  </div>
                </Card>
              </div>
            )}


            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Card className="p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">API Access</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">API Key</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                      <Button variant="ghost" size="sm"><Copy size={14} /></Button>
                      <Button variant="ghost" size="sm"><RefreshCw size={14} /></Button>
                    </div>
                  </div>
                  <code className="block p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm font-mono">
                    {showApiKey ? 'rpx_live_sk_1234567890abcdef' : '••••••••••••••••••••••••'}
                  </code>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">{language === 'vi' ? 'Cài đặt bảo mật' : 'Security Settings'}</h3>
                  <div className="space-y-3">
                    {[
                      { label: language === 'vi' ? 'Xác thực 2 yếu tố (2FA)' : 'Two-Factor Authentication (2FA)', desc: language === 'vi' ? 'Yêu cầu 2FA cho tất cả thành viên' : 'Require 2FA for all team members', enabled: true },
                      { label: 'Single Sign-On (SSO)', desc: language === 'vi' ? 'Bật SSO với nhà cung cấp danh tính' : 'Enable SSO with your identity provider', enabled: false },
                      { label: language === 'vi' ? 'Danh sách IP cho phép' : 'IP Allowlist', desc: language === 'vi' ? 'Giới hạn truy cập từ các địa chỉ IP cụ thể' : 'Restrict access to specific IP addresses', enabled: false },
                      { label: language === 'vi' ? 'Hết phiên tự động' : 'Session Timeout', desc: language === 'vi' ? 'Tự động đăng xuất sau 30 phút không hoạt động' : 'Auto logout after 30 minutes of inactivity', enabled: true },
                    ].map((setting, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{setting.label}</p>
                          <p className="text-sm text-zinc-500">{setting.desc}</p>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${setting.enabled ? 'bg-repix-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <p className="text-sm text-zinc-500">{language === 'vi' ? 'Cấu hình cách team nhận thông báo' : 'Configure how your team receives notifications'}</p>
                
                {[
                  { category: language === 'vi' ? 'Dự án' : 'Projects', items: [
                    language === 'vi' ? 'Dự án mới được tạo' : 'New project created', 
                    language === 'vi' ? 'Trạng thái dự án thay đổi' : 'Project status changed', 
                    language === 'vi' ? 'Asset được tải lên' : 'Asset uploaded'
                  ]},
                  { category: 'Team', items: [
                    language === 'vi' ? 'Thành viên mới tham gia' : 'New member joined', 
                    language === 'vi' ? 'Vai trò thành viên thay đổi' : 'Member role changed', 
                    language === 'vi' ? 'Thành viên bị xóa' : 'Member removed'
                  ]},
                  { category: language === 'vi' ? 'Thanh toán' : 'Billing', items: [
                    language === 'vi' ? 'Thanh toán thành công' : 'Payment successful', 
                    language === 'vi' ? 'Thanh toán thất bại' : 'Payment failed', 
                    language === 'vi' ? 'Cảnh báo credit thấp' : 'Credit low warning'
                  ]},
                ].map((group, idx) => (
                  <Card key={idx} className="p-6">
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-4">{group.category}</h4>
                    <div className="space-y-4">
                      {group.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">{item}</span>
                          <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-repix-500 focus:ring-repix-500" /> Email
                            </label>
                            <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-repix-500 focus:ring-repix-500" /> In-app
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
