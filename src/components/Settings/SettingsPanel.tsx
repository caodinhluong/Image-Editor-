import React, { useState } from 'react';
import {
  Settings as SettingsIcon, User, CreditCard, Shield, Key, Users,
  Bell, Globe, Copy, Check, Eye, EyeOff, Plus, Trash2, Edit3,
  Crown, Calendar, DollarSign, Download, ExternalLink, Sparkles, Zap, Building2, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button, Card, Badge, Input } from '../ui/UIComponents';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PLANS, PlanType } from '../../types/subscription';

type SettingsTab = 'account' | 'billing' | 'security' | 'api' | 'team' | 'notifications';

export const SettingsPanel: React.FC = () => {
  const { trans, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { 
    currentPlan, 
    credits, 
    subscription, 
    setShowUpgradeModal, 
    resetCredits, 
    addCredits,
    upgradePlan 
  } = useSubscription();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const plan = PLANS[currentPlan];
  const planIcons: Record<PlanType, React.ElementType> = {
    free: Zap,
    plus: Sparkles,
    pro: Crown,
    team: Building2
  };
  const PlanIcon = planIcons[currentPlan];

  const tabs = [
    { id: 'account' as const, icon: User, label: trans.settings.account },
    { id: 'billing' as const, icon: CreditCard, label: trans.settings.billing },
    { id: 'security' as const, icon: Shield, label: trans.settings.security },
    { id: 'api' as const, icon: Key, label: trans.settings.api },
    { id: 'team' as const, icon: Users, label: trans.settings.team },
    { id: 'notifications' as const, icon: Bell, label: trans.settings.notifications }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 h-full bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="text-repix-500" size={32} />
            {trans.settings.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 shrink-0">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-repix-500 text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            
            {/* Account Tab */}
            {activeTab === 'account' && (
              <>
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.settings.profile}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                      <Input defaultValue="Alex Creative" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{trans.settings.email}</label>
                      <Input type="email" defaultValue="alex@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Username</label>
                      <Input defaultValue="@alex_creative" />
                    </div>
                    <Button>{trans.settings.save}</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.settings.preferences}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{trans.settings.language}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose your preferred language</p>
                      </div>
                      <Button variant="outline" onClick={toggleLanguage}>
                        {language === 'en' ? 'English' : 'Tiếng Việt'}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Theme</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Dark or light mode</p>
                      </div>
                      <Button variant="outline" onClick={toggleTheme}>
                        {theme === 'dark' ? 'Dark' : 'Light'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{trans.settings.currentPlan}</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your subscription</p>
                    </div>
                    <Badge variant="pro" className="flex items-center gap-1">
                      <PlanIcon size={12} />
                      {language === 'vi' ? plan.nameVi : plan.name}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Price</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {plan.price === 'custom' ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                        {typeof plan.price === 'number' && plan.price > 0 && <span className="text-sm font-normal">/mo</span>}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Credits Remaining</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {currentPlan === 'team' ? '∞' : credits}
                        <span className="text-sm font-normal text-zinc-500">/{plan.credits === -1 ? '∞' : plan.credits}</span>
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Used This Month</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">{subscription.usedCredits}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Next Renewal</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        {subscription.renewalDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Credits Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-500">Credits Usage</span>
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {currentPlan === 'team' ? '∞' : `${Math.round((credits / subscription.maxCredits) * 100)}%`} remaining
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                        style={{ width: `${currentPlan === 'team' ? 100 : (credits / subscription.maxCredits) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button onClick={() => setShowUpgradeModal(true)}>
                      <Crown size={16} className="mr-2" />
                      {trans.settings.upgrade}
                    </Button>
                    <Button variant="outline" onClick={() => addCredits(100)}>
                      <Plus size={16} className="mr-2" />
                      Buy Credits
                    </Button>
                    <Button variant="ghost" onClick={resetCredits}>
                      <RefreshCw size={16} className="mr-2" />
                      Reset Credits (Demo)
                    </Button>
                  </div>
                </Card>

                {/* Quick Plan Switcher for Demo */}
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                    🎮 Demo: Quick Plan Switcher
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Switch plans instantly to test feature gating (for demo purposes only)
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {(['free', 'plus', 'pro', 'team'] as PlanType[]).map((p) => (
                      <Button
                        key={p}
                        variant={currentPlan === p ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => upgradePlan(p)}
                      >
                        {PLANS[p].name}
                      </Button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.settings.paymentMethod}</h2>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit3 size={14} />
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.settings.billingHistory}</h2>
                  <div className="space-y-3">
                    {[
                      { date: 'Dec 15, 2024', amount: '$19.00', status: 'Paid', invoice: 'INV-001' },
                      { date: 'Nov 15, 2024', amount: '$19.00', status: 'Paid', invoice: 'INV-002' },
                      { date: 'Oct 15, 2024', amount: '$19.00', status: 'Paid', invoice: 'INV-003' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-4">
                          <Calendar size={16} className="text-zinc-400" />
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{item.date}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.invoice}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-zinc-900 dark:text-white">{item.amount}</span>
                          <Badge className="bg-emerald-500/10 text-emerald-500">{item.status}</Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.settings.changePassword}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{trans.settings.currentPassword}</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{trans.settings.newPassword}</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{trans.settings.confirmPassword}</label>
                      <Input type="password" />
                    </div>
                    <Button>{trans.settings.save}</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{trans.settings.twoFactor}</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Add an extra layer of security</p>
                    </div>
                    <Badge variant="default">{trans.settings.disabled}</Badge>
                  </div>
                  <Button>{trans.settings.enable}</Button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{trans.settings.sessions}</h2>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on Windows', location: 'New York, US', current: true },
                      { device: 'Safari on iPhone', location: 'New York, US', current: false }
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{session.device}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{session.location}</p>
                        </div>
                        {session.current ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Current</Badge>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* API Tab */}
            {activeTab === 'api' && (
              <>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{trans.settings.apiKeys}</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your API keys</p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus size={14} />
                      {trans.settings.createApiKey}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white mb-1">Production API Key</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">Created on Dec 1, 2024</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowApiKey(!showApiKey)}>
                            {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" title={trans.settings.revoke}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-900 text-sm font-mono text-zinc-900 dark:text-white">
                          {showApiKey ? 'rpx_live_1234567890abcdef' : '••••••••••••••••••••••••'}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => copyToClipboard('rpx_live_1234567890abcdef')}
                        >
                          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{trans.settings.webhooks}</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure webhook endpoints</p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus size={14} />
                      {trans.settings.createWebhook}
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white mb-1">https://api.example.com/webhook</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Events: generation.completed, credit.used</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500">{trans.settings.enabled}</Badge>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{trans.settings.teamMembers}</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your team members</p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus size={14} />
                    {trans.settings.inviteMember}
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Alex Creative', email: 'alex@example.com', role: 'Owner', avatar: 'https://picsum.photos/seed/user/100/100' },
                    { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Admin', avatar: 'https://picsum.photos/seed/sarah/100/100' },
                    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Member', avatar: 'https://picsum.photos/seed/mike/100/100' }
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{member.role}</Badge>
                        {member.role !== 'Owner' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit3 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">{trans.settings.notifications}</h2>
                <div className="space-y-4">
                  {[
                    { label: trans.settings.emailNotifications, desc: 'Receive notifications via email', enabled: true },
                    { label: trans.settings.pushNotifications, desc: 'Receive push notifications', enabled: true },
                    { label: trans.settings.desktopNotifications, desc: 'Show desktop notifications', enabled: false }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white mb-1">{item.label}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                      </div>
                      <button
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          item.enabled ? 'bg-repix-500' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            item.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
