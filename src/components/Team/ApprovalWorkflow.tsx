import React, { useState } from 'react';
import {
  X, GitPullRequest, Check, XIcon, Clock, MessageSquare,
  ChevronRight, User, Eye, Download, MoreVertical, Filter,
  CheckCircle2, XCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ApprovalWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApprovalRequest {
  id: string;
  asset: { name: string; thumbnail: string; type: string };
  requestedBy: { name: string; avatar: string };
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  reviewers: { name: string; avatar: string; status: 'pending' | 'approved' | 'rejected' }[];
  comments: number;
  priority: 'low' | 'medium' | 'high';
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const trans = {
    title: language === 'vi' ? 'Quy trình duyệt' : 'Approval Workflow',
    subtitle: language === 'vi' ? 'Quản lý yêu cầu duyệt asset' : 'Manage asset approval requests',
    pending: language === 'vi' ? 'Chờ duyệt' : 'Pending',
    approved: language === 'vi' ? 'Đã duyệt' : 'Approved',
    rejected: language === 'vi' ? 'Từ chối' : 'Rejected',
    all: language === 'vi' ? 'Tất cả' : 'All',
    approve: language === 'vi' ? 'Duyệt' : 'Approve',
    reject: language === 'vi' ? 'Từ chối' : 'Reject',
    requestRevision: language === 'vi' ? 'Yêu cầu sửa' : 'Request Revision',
    viewDetails: language === 'vi' ? 'Xem chi tiết' : 'View Details',
    requestedBy: language === 'vi' ? 'Yêu cầu bởi' : 'Requested by',
    reviewers: language === 'vi' ? 'Người duyệt' : 'Reviewers',
    comments: language === 'vi' ? 'bình luận' : 'comments',
    high: language === 'vi' ? 'Cao' : 'High',
    medium: language === 'vi' ? 'Trung bình' : 'Medium',
    low: language === 'vi' ? 'Thấp' : 'Low',
    noRequests: language === 'vi' ? 'Không có yêu cầu nào' : 'No requests found',
  };

  const [requests] = useState<ApprovalRequest[]>([
    {
      id: '1',
      asset: { name: 'Hero_Banner_Summer_v2.png', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', type: 'image' },
      requestedBy: { name: 'Sarah Designer', avatar: 'https://picsum.photos/seed/u1/40' },
      requestedAt: '2 hours ago',
      status: 'pending',
      reviewers: [
        { name: 'Mike', avatar: 'https://picsum.photos/seed/u2/40', status: 'approved' },
        { name: 'Jessica', avatar: 'https://picsum.photos/seed/u3/40', status: 'pending' },
      ],
      comments: 3,
      priority: 'high',
    },
    {
      id: '2',
      asset: { name: 'Instagram_Post_Collection.jpg', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', type: 'image' },
      requestedBy: { name: 'Tom Dev', avatar: 'https://picsum.photos/seed/u4/40' },
      requestedAt: '5 hours ago',
      status: 'pending',
      reviewers: [
        { name: 'Sarah', avatar: 'https://picsum.photos/seed/u1/40', status: 'pending' },
      ],
      comments: 1,
      priority: 'medium',
    },
    {
      id: '3',
      asset: { name: 'Product_Video_30s.mp4', thumbnail: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200', type: 'video' },
      requestedBy: { name: 'Mike Product', avatar: 'https://picsum.photos/seed/u2/40' },
      requestedAt: '1 day ago',
      status: 'approved',
      reviewers: [
        { name: 'Sarah', avatar: 'https://picsum.photos/seed/u1/40', status: 'approved' },
        { name: 'Jessica', avatar: 'https://picsum.photos/seed/u3/40', status: 'approved' },
      ],
      comments: 5,
      priority: 'high',
    },
    {
      id: '4',
      asset: { name: 'Email_Header_Draft.png', thumbnail: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200', type: 'image' },
      requestedBy: { name: 'Jessica Marketing', avatar: 'https://picsum.photos/seed/u3/40' },
      requestedAt: '2 days ago',
      status: 'rejected',
      reviewers: [
        { name: 'Mike', avatar: 'https://picsum.photos/seed/u2/40', status: 'rejected' },
      ],
      comments: 2,
      priority: 'low',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      case 'revision': return <AlertCircle size={16} className="text-amber-500" />;
      default: return <Clock size={16} className="text-zinc-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    };
    return styles[priority] || styles.low;
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const counts = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    all: requests.length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <GitPullRequest size={20} className="text-emerald-600" />
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

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-fit">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {trans[tab]}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? 'bg-zinc-200 dark:bg-zinc-600' : 'bg-zinc-200/50 dark:bg-zinc-700'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <GitPullRequest size={48} className="mx-auto mb-4 opacity-30" />
              <p>{trans.noRequests}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(request => (
                <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                      <img src={request.asset.thumbnail} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-zinc-900 dark:text-white">{request.asset.name}</h3>
                            <Badge className={getPriorityBadge(request.priority)}>
                              {trans[request.priority as keyof typeof trans]}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-500 flex items-center gap-2">
                            <img src={request.requestedBy.avatar} className="w-5 h-5 rounded-full" />
                            {request.requestedBy.name} • {request.requestedAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className={`text-sm font-medium ${
                            request.status === 'approved' ? 'text-green-600' :
                            request.status === 'rejected' ? 'text-red-600' :
                            'text-zinc-500'
                          }`}>
                            {trans[request.status as keyof typeof trans]}
                          </span>
                        </div>
                      </div>

                      {/* Reviewers */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs text-zinc-500">{trans.reviewers}:</span>
                        <div className="flex items-center gap-1">
                          {request.reviewers.map((reviewer, idx) => (
                            <div key={idx} className="relative">
                              <img src={reviewer.avatar} className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900" />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white dark:border-zinc-900 ${
                                reviewer.status === 'approved' ? 'bg-green-500' :
                                reviewer.status === 'rejected' ? 'bg-red-500' :
                                'bg-zinc-300'
                              }`} />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <MessageSquare size={12} /> {request.comments} {trans.comments}
                        </span>
                      </div>

                      {/* Actions */}
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check size={14} className="mr-1" /> {trans.approve}
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <XIcon size={14} className="mr-1" /> {trans.reject}
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare size={14} className="mr-1" /> {trans.requestRevision}
                          </Button>
                          <Button size="sm" variant="ghost" className="ml-auto">
                            <Eye size={14} className="mr-1" /> {trans.viewDetails}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
