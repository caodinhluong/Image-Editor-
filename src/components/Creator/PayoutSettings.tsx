import React, { useState } from 'react';
import {
  DollarSign, CreditCard, Building2, Wallet, Plus, Check, X,
  Calendar, Clock, ArrowUpRight, ArrowDownRight, Download,
  Shield, AlertCircle, ChevronRight, ExternalLink, Copy,
  Banknote, CircleDollarSign, FileText, Settings, RefreshCw,
  CheckCircle2, XCircle, Loader2, Globe, Percent, TrendingUp
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';

interface PaymentMethod {
  id: string;
  type: 'paypal' | 'stripe' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  addedAt: Date;
}

interface Transaction {
  id: string;
  type: 'payout' | 'earning' | 'refund' | 'fee';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: Date;
  description: string;
  method?: string;
}

interface TaxDocument {
  id: string;
  name: string;
  type: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  submittedAt?: Date;
}

export const PayoutSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'history' | 'tax' | 'settings'>('overview');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [addMethodType, setAddMethodType] = useState<'paypal' | 'stripe' | 'bank' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Mock data
  const balance = {
    available: 8450.00,
    pending: 1234.50,
    lifetime: 45670.00,
    nextPayout: new Date('2024-12-15'),
    currency: 'USD'
  };

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'paypal',
      name: 'PayPal',
      details: 'creator@email.com',
      isDefault: true,
      isVerified: true,
      addedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'bank',
      name: 'Bank Account',
      details: '****4567 - Chase Bank',
      isDefault: false,
      isVerified: true,
      addedAt: new Date('2024-03-20')
    }
  ]);

  const transactions: Transaction[] = [
    { id: '1', type: 'payout', amount: -2500.00, status: 'completed', date: new Date('2024-12-01'), description: 'Monthly payout - November', method: 'PayPal' },
    { id: '2', type: 'earning', amount: 156.00, status: 'completed', date: new Date('2024-12-05'), description: 'Cyberpunk City Pack - 4 sales' },
    { id: '3', type: 'earning', amount: 89.00, status: 'completed', date: new Date('2024-12-04'), description: 'Nature Landscape Set - 3 sales' },
    { id: '4', type: 'fee', amount: -12.50, status: 'completed', date: new Date('2024-12-03'), description: 'Platform fee (5%)' },
    { id: '5', type: 'refund', amount: -29.00, status: 'completed', date: new Date('2024-12-02'), description: 'Refund - Order #8834' },
    { id: '6', type: 'payout', amount: -1800.00, status: 'pending', date: new Date('2024-12-15'), description: 'Scheduled payout - December', method: 'PayPal' },
    { id: '7', type: 'earning', amount: 234.00, status: 'pending', date: new Date('2024-12-06'), description: 'Pending clearance (7 days)' },
  ];

  const taxDocuments: TaxDocument[] = [
    { id: '1', name: 'W-9 Form', type: 'Tax ID', status: 'approved', submittedAt: new Date('2024-01-10') },
    { id: '2', name: '1099-K 2023', type: 'Tax Report', status: 'approved', submittedAt: new Date('2024-02-15') },
  ];

  const payoutSettings = {
    minimumPayout: 50,
    autoPayoutEnabled: true,
    autoPayoutDay: 15,
    currency: 'USD',
    holdPeriod: 7
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'approved': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'failed': case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'paypal': return <Wallet className="text-blue-500" size={20} />;
      case 'stripe': return <CreditCard className="text-purple-500" size={20} />;
      case 'bank': return <Building2 className="text-emerald-500" size={20} />;
      default: return <DollarSign size={20} />;
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < payoutSettings.minimumPayout) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      alert('Withdrawal request submitted successfully!');
    }, 2000);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const handleRemoveMethod = (id: string) => {
    if (paymentMethods.find(m => m.id === id)?.isDefault) {
      alert('Cannot remove default payment method');
      return;
    }
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <CircleDollarSign className="text-emerald-500" size={28} />
            Payout Settings
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your earnings and payment methods</p>
        </div>
        <Button onClick={() => setShowWithdrawModal(true)} className="gap-2">
          <Banknote size={18} />
          Withdraw Funds
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto">
        {(['overview', 'methods', 'history', 'tax', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[100px] px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'methods' && 'Payment Methods'}
            {tab === 'history' && 'History'}
            {tab === 'tax' && 'Tax Info'}
            {tab === 'settings' && 'Settings'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/20">
                  <Wallet size={20} />
                </div>
                <Badge className="bg-white/20 text-white border-0">Available</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">${balance.available.toLocaleString()}</h3>
              <p className="text-emerald-100 text-sm">Ready to withdraw</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="text-amber-500" size={20} />
                </div>
                <Badge variant="default">Pending</Badge>
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                ${balance.pending.toLocaleString()}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Clearing in {payoutSettings.holdPeriod} days</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <TrendingUp className="text-purple-500" size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                ${balance.lifetime.toLocaleString()}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Lifetime earnings</p>
            </Card>
          </div>

          {/* Next Payout Info */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">Next Scheduled Payout</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {balance.nextPayout.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">${balance.available.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">via {paymentMethods.find(m => m.isDefault)?.name}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings size={14} className="mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">Recent Activity</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('history')}>
                View All <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'earning' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      tx.type === 'payout' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      tx.type === 'refund' ? 'bg-red-100 dark:bg-red-900/30' :
                      'bg-zinc-100 dark:bg-zinc-800'
                    }`}>
                      {tx.type === 'earning' && <ArrowDownRight className="text-emerald-500" size={16} />}
                      {tx.type === 'payout' && <ArrowUpRight className="text-blue-500" size={16} />}
                      {tx.type === 'refund' && <RefreshCw className="text-red-500" size={16} />}
                      {tx.type === 'fee' && <Percent className="text-zinc-500" size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-zinc-500">{tx.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}


      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          {/* Current Methods */}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`p-5 ${method.isDefault ? 'ring-2 ring-emerald-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-zinc-900 dark:text-white">{method.name}</h3>
                        {method.isDefault && (
                          <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">Default</Badge>
                        )}
                        {method.isVerified && (
                          <CheckCircle2 className="text-emerald-500" size={14} />
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{method.details}</p>
                      <p className="text-xs text-zinc-400 mt-1">Added {method.addedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleRemoveMethod(method.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Add New Method */}
          {!showAddMethod ? (
            <Button variant="outline" className="w-full h-14 border-dashed" onClick={() => setShowAddMethod(true)}>
              <Plus size={18} className="mr-2" />
              Add Payment Method
            </Button>
          ) : (
            <Card className="p-6">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Add Payment Method</h3>
              
              {!addMethodType ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setAddMethodType('paypal')}
                    className="p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Wallet className="text-blue-500" size={32} />
                    </div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">PayPal</h4>
                    <p className="text-xs text-zinc-500 mt-1">Instant transfers</p>
                  </button>

                  <button
                    onClick={() => setAddMethodType('stripe')}
                    className="p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-500 transition-colors text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="text-purple-500" size={32} />
                    </div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">Stripe</h4>
                    <p className="text-xs text-zinc-500 mt-1">Debit card payouts</p>
                  </button>

                  <button
                    onClick={() => setAddMethodType('bank')}
                    className="p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 transition-colors text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="text-emerald-500" size={32} />
                    </div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">Bank Transfer</h4>
                    <p className="text-xs text-zinc-500 mt-1">Direct deposit (3-5 days)</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    {getMethodIcon(addMethodType)}
                    <span className="font-medium capitalize">{addMethodType}</span>
                  </div>

                  {addMethodType === 'paypal' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">PayPal Email</label>
                        <Input placeholder="your@email.com" type="email" />
                      </div>
                    </div>
                  )}

                  {addMethodType === 'stripe' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Card Number</label>
                        <Input placeholder="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Expiry</label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">CVC</label>
                          <Input placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {addMethodType === 'bank' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Holder Name</label>
                        <Input placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Routing Number</label>
                        <Input placeholder="021000021" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Number</label>
                        <Input placeholder="000123456789" type="password" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => { setAddMethodType(null); setShowAddMethod(false); }}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Mock add method
                      const newMethod: PaymentMethod = {
                        id: Date.now().toString(),
                        type: addMethodType,
                        name: addMethodType === 'paypal' ? 'PayPal' : addMethodType === 'stripe' ? 'Stripe' : 'Bank Account',
                        details: addMethodType === 'paypal' ? 'new@email.com' : addMethodType === 'stripe' ? '****4242' : '****6789',
                        isDefault: paymentMethods.length === 0,
                        isVerified: false,
                        addedAt: new Date()
                      };
                      setPaymentMethods(prev => [...prev, newMethod]);
                      setAddMethodType(null);
                      setShowAddMethod(false);
                    }}>
                      Add Method
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Security Notice */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <Shield className="text-blue-500 shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Secure Payments</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  All payment information is encrypted and securely stored. We never store your full card details.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}


      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-3">
              <select className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                <option>All Types</option>
                <option>Earnings</option>
                <option>Payouts</option>
                <option>Refunds</option>
                <option>Fees</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>All time</option>
              </select>
              <Button variant="outline" size="sm" className="ml-auto">
                <Download size={14} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </Card>

          {/* Transactions List */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {tx.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{tx.description}</p>
                        {tx.method && <p className="text-xs text-zinc-500">via {tx.method}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium capitalize px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tax Info Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          {/* Tax Status */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-white">Tax Information Complete</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Your tax documents are up to date. You're all set to receive payouts.
                </p>
              </div>
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">Verified</Badge>
            </div>
          </Card>

          {/* Tax Documents */}
          <Card className="p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Tax Documents</h3>
            <div className="space-y-3">
              {taxDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                      <FileText className="text-zinc-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{doc.name}</p>
                      <p className="text-xs text-zinc-500">{doc.type} • Submitted {doc.submittedAt?.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              <Plus size={16} className="mr-2" />
              Upload New Document
            </Button>
          </Card>

          {/* Tax Info Notice */}
          <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-100">Tax Reporting</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  If you earn more than $600 in a calendar year, you'll receive a 1099-K form for tax reporting purposes.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Auto Payout */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">Automatic Payouts</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Automatically withdraw your balance on a schedule
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={payoutSettings.autoPayoutEnabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Payout Day</label>
                <select className="w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                  <option value="1">1st of each month</option>
                  <option value="15" selected>15th of each month</option>
                  <option value="weekly">Every Friday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Minimum Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                  <Input defaultValue={payoutSettings.minimumPayout} className="pl-9" />
                </div>
              </div>
            </div>
          </Card>

          {/* Currency */}
          <Card className="p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Currency Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display Currency</label>
                <select className="w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="VND">VND - Vietnamese Dong</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Payout Currency</label>
                <select className="w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                  <option value="USD">USD - US Dollar</option>
                  <option value="local">Local Currency (auto-convert)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Hold Period */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Clock className="text-zinc-500" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-white">Hold Period</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Earnings are held for <strong>{payoutSettings.holdPeriod} days</strong> before becoming available for withdrawal. 
                  This allows time for potential refunds or disputes.
                </p>
              </div>
            </div>
          </Card>

          <Button className="w-full">Save Settings</Button>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Withdraw Funds</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Available Balance</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">${balance.available.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Amount to Withdraw</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-9 text-lg"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">Minimum withdrawal: ${payoutSettings.minimumPayout}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Withdraw To</label>
                <select className="w-full px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 text-sm font-medium">
                  {paymentMethods.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.details} {m.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) < payoutSettings.minimumPayout || parseFloat(withdrawAmount) > balance.available}
                  isLoading={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Withdraw'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
