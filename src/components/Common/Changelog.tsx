import React, { useState } from 'react';
import { X, Sparkles, Zap, Bug, Wrench, Star, ArrowRight, Gift, Rocket } from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  titleVi: string;
  highlights?: string[];
  highlightsVi?: string[];
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'breaking';
    text: string;
    textVi: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.5.0',
    date: 'December 10, 2024',
    title: 'Brand Kit & Batch Processing',
    titleVi: 'Brand Kit & Xử lý hàng loạt',
    highlights: [
      'Create and manage brand kits with colors, fonts, and filters',
      'Batch process multiple images with brand consistency',
      'AI-powered brand suggestions'
    ],
    highlightsVi: [
      'Tạo và quản lý brand kit với màu sắc, font chữ và bộ lọc',
      'Xử lý hàng loạt nhiều ảnh với tính nhất quán thương hiệu',
      'Gợi ý thương hiệu được hỗ trợ bởi AI'
    ],
    changes: [
      { type: 'feature', text: 'Brand Kit Creator with 5-step wizard', textVi: 'Trình tạo Brand Kit với 5 bước' },
      { type: 'feature', text: 'Batch Processor for multiple images', textVi: 'Xử lý hàng loạt cho nhiều ảnh' },
      { type: 'feature', text: 'Consistency Score Card', textVi: 'Thẻ điểm nhất quán' },
      { type: 'improvement', text: 'Improved subscription UI', textVi: 'Cải thiện giao diện subscription' },
      { type: 'fix', text: 'Fixed export quality issues', textVi: 'Sửa lỗi chất lượng xuất ảnh' },
    ]
  },
  {
    version: '2.4.0',
    date: 'December 1, 2024',
    title: 'Subscription System',
    titleVi: 'Hệ thống Subscription',
    changes: [
      { type: 'feature', text: '4-tier subscription plans (Free, Plus, Pro, Team)', textVi: '4 gói subscription (Free, Plus, Pro, Team)' },
      { type: 'feature', text: 'Feature gating based on plan', textVi: 'Giới hạn tính năng theo gói' },
      { type: 'feature', text: 'Credits system for AI operations', textVi: 'Hệ thống credits cho các thao tác AI' },
      { type: 'improvement', text: 'Upgrade modal with plan comparison', textVi: 'Modal nâng cấp với so sánh gói' },
    ]
  },
  {
    version: '2.3.0',
    date: 'November 20, 2024',
    title: 'Real-time Collaboration',
    titleVi: 'Cộng tác thời gian thực',
    changes: [
      { type: 'feature', text: 'Live presence indicators', textVi: 'Chỉ báo hiện diện trực tiếp' },
      { type: 'feature', text: 'Comments and annotations', textVi: 'Bình luận và chú thích' },
      { type: 'feature', text: 'Notification center', textVi: 'Trung tâm thông báo' },
      { type: 'improvement', text: 'Activity feed', textVi: 'Nguồn cấp hoạt động' },
      { type: 'fix', text: 'Sync issues with multiple editors', textVi: 'Sửa lỗi đồng bộ với nhiều editor' },
    ]
  },
  {
    version: '2.2.0',
    date: 'November 10, 2024',
    title: 'AI Tools Enhancement',
    titleVi: 'Nâng cấp công cụ AI',
    changes: [
      { type: 'feature', text: 'Generative Fill 2.0 with better quality', textVi: 'Generative Fill 2.0 với chất lượng tốt hơn' },
      { type: 'feature', text: 'Style Transfer with custom presets', textVi: 'Style Transfer với preset tùy chỉnh' },
      { type: 'improvement', text: '50% faster AI processing', textVi: 'Xử lý AI nhanh hơn 50%' },
      { type: 'improvement', text: 'Better object detection', textVi: 'Phát hiện đối tượng tốt hơn' },
    ]
  },
  {
    version: '2.1.0',
    date: 'October 25, 2024',
    title: 'Creator Dashboard',
    titleVi: 'Bảng điều khiển Creator',
    changes: [
      { type: 'feature', text: 'Sell templates on marketplace', textVi: 'Bán template trên marketplace' },
      { type: 'feature', text: 'Earnings analytics', textVi: 'Phân tích thu nhập' },
      { type: 'feature', text: 'Payout settings', textVi: 'Cài đặt thanh toán' },
      { type: 'improvement', text: 'Template editor', textVi: 'Trình chỉnh sửa template' },
    ]
  },
];

const typeConfig = {
  feature: { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'New', labelVi: 'Mới' },
  improvement: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Improved', labelVi: 'Cải thiện' },
  fix: { icon: Bug, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Fixed', labelVi: 'Sửa lỗi' },
  breaking: { icon: Wrench, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Breaking', labelVi: 'Thay đổi lớn' },
};

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [expandedVersion, setExpandedVersion] = useState<string | null>(changelog[0].version);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-repix-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500">
              <Rocket className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? "Có gì mới?" : "What's New"}
              </h2>
              <p className="text-sm text-zinc-500">
                {language === 'vi' ? 'Cập nhật và tính năng mới' : 'Updates and new features'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
          <div className="space-y-6">
            {changelog.map((entry, idx) => (
              <div key={entry.version} className="relative">
                {/* Timeline line */}
                {idx < changelog.length - 1 && (
                  <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                )}

                {/* Version Header */}
                <button
                  onClick={() => setExpandedVersion(expandedVersion === entry.version ? null : entry.version)}
                  className="w-full flex items-start gap-4 text-left group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    idx === 0 
                      ? 'bg-gradient-to-br from-repix-500 to-pink-500 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    {idx === 0 ? <Gift size={18} /> : <Star size={18} />}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg text-zinc-900 dark:text-white">
                        v{entry.version}
                      </span>
                      {idx === 0 && (
                        <Badge className="bg-gradient-to-r from-repix-500 to-pink-500 text-white border-0">
                          {language === 'vi' ? 'Mới nhất' : 'Latest'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mb-1">{entry.date}</p>
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">
                      {language === 'vi' ? entry.titleVi : entry.title}
                    </p>
                  </div>
                  <ArrowRight 
                    size={20} 
                    className={`text-zinc-400 transition-transform mt-2 ${
                      expandedVersion === entry.version ? 'rotate-90' : ''
                    }`} 
                  />
                </button>

                {/* Expanded Content */}
                {expandedVersion === entry.version && (
                  <div className="ml-14 mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Highlights */}
                    {entry.highlights && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-repix-500/10 to-pink-500/10 border border-repix-500/20">
                        <h4 className="font-bold text-sm text-repix-600 dark:text-repix-400 mb-2">
                          ✨ {language === 'vi' ? 'Điểm nổi bật' : 'Highlights'}
                        </h4>
                        <ul className="space-y-1">
                          {(language === 'vi' ? entry.highlightsVi : entry.highlights)?.map((h, i) => (
                            <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                              <span className="text-repix-500">•</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Changes */}
                    <div className="space-y-2">
                      {entry.changes.map((change, i) => {
                        const config = typeConfig[change.type];
                        return (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                            <div className={`p-1.5 rounded-lg ${config.bg}`}>
                              <config.icon size={14} className={config.color} />
                            </div>
                            <div className="flex-1">
                              <span className={`text-xs font-bold ${config.color} uppercase`}>
                                {language === 'vi' ? config.labelVi : config.label}
                              </span>
                              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                {language === 'vi' ? change.textVi : change.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center">
          <p className="text-xs text-zinc-500">
            {language === 'vi' 
              ? 'Theo dõi chúng tôi để cập nhật tin tức mới nhất'
              : 'Follow us for the latest updates'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
