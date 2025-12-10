import React, { useState } from 'react';
import {
  HelpCircle, Search, Book, Video, MessageCircle, Mail,
  ChevronRight, Sparkles, Wand2, Layers,
  Download, Users, CreditCard, X, ArrowLeft
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  questionVi: string;
  answer: string;
  answerVi: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  titleVi: string;
  icon: React.ElementType;
  color: string;
  articles: number;
}

const categories: HelpCategory[] = [
  { id: 'getting-started', title: 'Getting Started', titleVi: 'Bắt đầu', icon: Sparkles, color: 'text-blue-500', articles: 12 },
  { id: 'ai-tools', title: 'AI Tools', titleVi: 'Công cụ AI', icon: Wand2, color: 'text-purple-500', articles: 18 },
  { id: 'editing', title: 'Editing & Layers', titleVi: 'Chỉnh sửa & Layers', icon: Layers, color: 'text-pink-500', articles: 15 },
  { id: 'export', title: 'Export & Share', titleVi: 'Xuất & Chia sẻ', icon: Download, color: 'text-emerald-500', articles: 8 },
  { id: 'collaboration', title: 'Collaboration', titleVi: 'Cộng tác', icon: Users, color: 'text-amber-500', articles: 10 },
  { id: 'billing', title: 'Billing & Plans', titleVi: 'Thanh toán & Gói', icon: CreditCard, color: 'text-cyan-500', articles: 7 },
];

const faqs: FAQItem[] = [
  {
    question: 'How do I remove the background from an image?',
    questionVi: 'Làm thế nào để xóa nền ảnh?',
    answer: 'Select the "Remove BG" tool from the toolbar or press B. The AI will automatically detect and remove the background. You can refine the selection using the brush tools.',
    answerVi: 'Chọn công cụ "Xóa nền" từ thanh công cụ hoặc nhấn B. AI sẽ tự động phát hiện và xóa nền. Bạn có thể tinh chỉnh vùng chọn bằng công cụ brush.',
    category: 'ai-tools'
  },
  {
    question: 'What is Generative Fill and how does it work?',
    questionVi: 'Generative Fill là gì và hoạt động như thế nào?',
    answer: 'Generative Fill uses AI to add, remove, or replace content in your images. Select an area, describe what you want, and the AI will generate it seamlessly.',
    answerVi: 'Generative Fill sử dụng AI để thêm, xóa hoặc thay thế nội dung trong ảnh. Chọn một vùng, mô tả những gì bạn muốn, và AI sẽ tạo ra nó một cách liền mạch.',
    category: 'ai-tools'
  },
  {
    question: 'How many credits do I get with each plan?',
    questionVi: 'Mỗi gói có bao nhiêu credits?',
    answer: 'Free: 50 credits/month, Plus: 200 credits/month, Pro: 500 credits/month, Team: Unlimited. Credits reset monthly.',
    answerVi: 'Free: 50 credits/tháng, Plus: 200 credits/tháng, Pro: 500 credits/tháng, Team: Không giới hạn. Credits được reset hàng tháng.',
    category: 'billing'
  },
  {
    question: 'Can I collaborate with my team in real-time?',
    questionVi: 'Tôi có thể cộng tác với team theo thời gian thực không?',
    answer: 'Yes! With Pro and Team plans, you can invite team members to edit projects together. You\'ll see their cursors and changes in real-time.',
    answerVi: 'Có! Với gói Pro và Team, bạn có thể mời thành viên nhóm cùng chỉnh sửa dự án. Bạn sẽ thấy con trỏ và thay đổi của họ theo thời gian thực.',
    category: 'collaboration'
  },
  {
    question: 'What export formats are supported?',
    questionVi: 'Những định dạng xuất nào được hỗ trợ?',
    answer: 'We support PNG, JPG, WebP, and PDF formats. Pro users can export in 4K resolution with no watermarks.',
    answerVi: 'Chúng tôi hỗ trợ định dạng PNG, JPG, WebP và PDF. Người dùng Pro có thể xuất ở độ phân giải 4K không có watermark.',
    category: 'export'
  },
  {
    question: 'How do I create a Brand Kit?',
    questionVi: 'Làm thế nào để tạo Brand Kit?',
    answer: 'Go to Brand Kit section, click "Create New", and follow the wizard to add your brand colors, fonts, and logo. You can then apply it to any project.',
    answerVi: 'Vào phần Brand Kit, nhấn "Tạo mới", và làm theo hướng dẫn để thêm màu sắc, font chữ và logo thương hiệu. Sau đó bạn có thể áp dụng cho bất kỳ dự án nào.',
    category: 'editing'
  },
];

const videoTutorials = [
  { title: 'Getting Started with Repix AI', titleVi: 'Bắt đầu với Repix AI', duration: '5:30', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop' },
  { title: 'Mastering AI Tools', titleVi: 'Làm chủ công cụ AI', duration: '8:45', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop' },
  { title: 'Advanced Editing Techniques', titleVi: 'Kỹ thuật chỉnh sửa nâng cao', duration: '12:20', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop' },
];

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(query) ||
      faq.questionVi.toLowerCase().includes(query);
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-dark-bg overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <HelpCircle className="text-repix-500" size={24} />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              {language === 'vi' ? 'Trung tâm trợ giúp' : 'Help Center'}
            </h1>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 overflow-y-auto hidden md:block">
          <nav className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-repix-500 text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Book size={18} />
              {language === 'vi' ? 'Tất cả chủ đề' : 'All Topics'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-repix-500 text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <cat.icon size={18} className={selectedCategory === cat.id ? '' : cat.color} />
                  {language === 'vi' ? cat.titleVi : cat.title}
                </div>
                <span className="text-xs opacity-60">{cat.articles}</span>
              </button>
            ))}
          </nav>

          {/* Contact Support */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-repix-500 to-pink-500 text-white">
            <MessageCircle size={24} className="mb-3" />
            <h3 className="font-bold mb-1">
              {language === 'vi' ? 'Cần hỗ trợ?' : 'Need help?'}
            </h3>
            <p className="text-sm opacity-90 mb-3">
              {language === 'vi' ? 'Liên hệ đội ngũ hỗ trợ của chúng tôi' : 'Contact our support team'}
            </p>
            <Button size="sm" className="w-full bg-white text-repix-600 hover:bg-zinc-100">
              <Mail size={14} className="mr-2" />
              {language === 'vi' ? 'Gửi tin nhắn' : 'Send Message'}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Search Hero */}
          <div className="bg-gradient-to-br from-repix-500/10 to-pink-500/10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4 text-center">
              {language === 'vi' ? 'Chúng tôi có thể giúp gì cho bạn?' : 'How can we help you?'}
            </h2>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm kiếm câu hỏi...' : 'Search for answers...'}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-lg focus:outline-none focus:ring-2 focus:ring-repix-500 shadow-lg"
              />
            </div>
          </div>

          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            {/* Categories Grid (Mobile) */}
            <div className="grid grid-cols-2 md:hidden gap-3 mb-8">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-left"
                >
                  <cat.icon className={cat.color} size={24} />
                  <p className="font-medium text-sm mt-2 text-zinc-900 dark:text-white">
                    {language === 'vi' ? cat.titleVi : cat.title}
                  </p>
                </button>
              ))}
            </div>

            {/* Video Tutorials */}
            <section className="mb-10">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Video className="text-repix-500" size={20} />
                {language === 'vi' ? 'Video hướng dẫn' : 'Video Tutorials'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videoTutorials.map((video, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-repix-500 border-b-8 border-b-transparent ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0">
                        {video.duration}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-white group-hover:text-repix-500 transition-colors">
                      {language === 'vi' ? video.titleVi : video.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <HelpCircle className="text-repix-500" size={20} />
                {language === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}
              </h3>
              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <span className="font-medium text-zinc-900 dark:text-white pr-4">
                        {language === 'vi' ? faq.questionVi : faq.question}
                      </span>
                      <ChevronRight
                        size={20}
                        className={`text-zinc-400 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700 pt-4 bg-zinc-50 dark:bg-zinc-800/30">
                        {language === 'vi' ? faq.answerVi : faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
