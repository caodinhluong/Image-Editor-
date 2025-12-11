import React, { useState } from 'react';
import {
  X, Settings, Users, CreditCard, Shield, Bell, Palette,
  Globe, Lock, Trash2, Upload, Check, ChevronRight, Building2,
  Mail, Key, Eye, EyeOff, Copy, RefreshCw, AlertTriangle
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
    cancel: language === 'vi' ? 'Hủy' : 'Cancel',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex max-h-[85vh]">
        
        {/* Sidebar */}
        <div className="w-56 bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 flex items-center justify-center text-white font-bold">
              R
            </div>
            <div>
              <p className="font-bold text-sm text-zinc-900 dark:text-white">Repix Team</p>
              <p className="text-xs text-zinc-500">Enterprise</p>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-repix-100 dark:bg-repix-900/30 text-repix-700 dark:text-repix-300'
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
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-200">
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
                    <span className="text-sm text-zinc-500">repix.ai/</span>
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

                {/* Danger Zone */}
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} /> {trans.dangerZone}
                  </h3>
                  <Card className="p-4 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{trans.deleteWorkspace}</p>
                        <p className="text-sm text-zinc-500">{trans.deleteWarning}</p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">Team Members</h3>
                    <p className="text-sm text-zinc-500">12 members • 3 pending invites</p>
                  </div>
                  <Button size="sm">
                    <Mail size={14} className="mr-2" /> Invite Members
                  </Button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Sarah Designer', email: 'sarah@company.com', role: 'Owner', avatar: 'https://picsum.photos/seed/u1/40' },
                    { name: 'Mike Product', email: 'mike@company.com', role: 'Admin', avatar: 'https://picsum.photos/seed/u2/40' },
                    { name: 'Jessica Marketing', email: 'jessica@company.com', role: 'Editor', avatar: 'https://picsum.photos/seed/u3/40' },
                    { name: 'Tom Dev', email: 'tom@company.com', role: 'Viewer', avatar: 'https://picsum.photos/seed/u4/40' },
                  ].map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-zinc-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select className="text-sm bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5">
                          <option selected={member.role === 'Owner'}>Owner</option>
                          <option selected={member.role === 'Admin'}>Admin</option>
                          <option selected={member.role === 'Editor'}>Editor</option>
                          <option selected={member.role === 'Viewer'}>Viewer</option>
                        </select>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Card className="p-6 bg-gradient-to-r from-repix-500/10 to-pink-500/10 border-repix-200 dark:border-repix-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="bg-repix-500 text-white border-0 mb-2">Team Plan</Badge>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">$99/month</h3>
                      <p className="text-sm text-zinc-500">Billed annually • Renews Dec 15, 2025</p>
                    </div>
                    <Button variant="outline">Manage Plan</Button>
                  </div>
                </Card>

                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Credit Usage</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <p className="text-3xl font-bold text-repix-500">45,200</p>
                      <p className="text-sm text-zinc-500">Available</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-3xl font-bold text-zinc-900 dark:text-white">12,800</p>
                      <p className="text-sm text-zinc-500">Used this month</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-500">∞</p>
                      <p className="text-sm text-zinc-500">Monthly limit</p>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Payment Method</h3>
                  <Card className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-xs text-zinc-500">Expires 12/26</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Change</Button>
                  </Card>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">API Access</h3>
                  <Card className="p-4">
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
                    <code className="block p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-mono">
                      {showApiKey ? 'rpx_live_sk_1234567890abcdef' : '••••••••••••••••••••••••'}
                    </code>
                  </Card>
                </div>

                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Security Settings</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Two-Factor Authentication (2FA)', desc: 'Require 2FA for all team members', enabled: true },
                      { label: 'Single Sign-On (SSO)', desc: 'Enable SSO with your identity provider', enabled: false },
                      { label: 'IP Allowlist', desc: 'Restrict access to specific IP addresses', enabled: false },
                      { label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity', enabled: true },
                    ].map((setting, idx) => (
                      <Card key={idx} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{setting.label}</p>
                          <p className="text-sm text-zinc-500">{setting.desc}</p>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${setting.enabled ? 'bg-repix-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <p className="text-sm text-zinc-500">Configure how your team receives notifications</p>
                
                <div className="space-y-4">
                  {[
                    { category: 'Projects', items: ['New project created', 'Project status changed', 'Asset uploaded'] },
                    { category: 'Team', items: ['New member joined', 'Member role changed', 'Member removed'] },
                    { category: 'Billing', items: ['Payment successful', 'Payment failed', 'Credit low warning'] },
                  ].map((group, idx) => (
                    <Card key={idx} className="p-4">
                      <h4 className="font-bold text-zinc-900 dark:text-white mb-3">{group.category}</h4>
                      <div className="space-y-3">
                        {group.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">{item}</span>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-xs text-zinc-500">
                                <input type="checkbox" defaultChecked className="rounded" /> Email
                              </label>
                              <label className="flex items-center gap-2 text-xs text-zinc-500">
                                <input type="checkbox" defaultChecked className="rounded" /> In-app
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-16 px-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
            <Button variant="outline" onClick={onClose}>{trans.cancel}</Button>
            <Button>{trans.save}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
