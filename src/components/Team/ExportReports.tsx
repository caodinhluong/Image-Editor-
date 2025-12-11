import React, { useState } from 'react';
import {
  X, FileText, Download, Calendar, Filter, BarChart3,
  PieChart, TrendingUp, Users, FolderGit2, Clock, CreditCard,
  FileSpreadsheet, File, Loader2, Check, ChevronDown
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExportReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReportType = 'usage' | 'projects' | 'team' | 'billing' | 'time';
type ExportFormat = 'pdf' | 'excel' | 'csv';

export const ExportReports: React.FC<ExportReportsProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<ReportType>('usage');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const trans = {
    title: language === 'vi' ? 'Xuất báo cáo' : 'Export Reports',
    subtitle: language === 'vi' ? 'Tạo và tải báo cáo chi tiết' : 'Generate and download detailed reports',
    selectReport: language === 'vi' ? 'Chọn loại báo cáo' : 'Select Report Type',
    usage: language === 'vi' ? 'Sử dụng AI' : 'AI Usage',
    projects: language === 'vi' ? 'Dự án' : 'Projects',
    team: language === 'vi' ? 'Thành viên' : 'Team Members',
    billing: language === 'vi' ? 'Thanh toán' : 'Billing',
    time: language === 'vi' ? 'Thời gian' : 'Time Tracking',
    dateRange: language === 'vi' ? 'Khoảng thời gian' : 'Date Range',
    week: language === 'vi' ? '7 ngày qua' : 'Last 7 days',
    month: language === 'vi' ? '30 ngày qua' : 'Last 30 days',
    quarter: language === 'vi' ? 'Quý này' : 'This Quarter',
    year: language === 'vi' ? 'Năm nay' : 'This Year',
    format: language === 'vi' ? 'Định dạng' : 'Format',
    export: language === 'vi' ? 'Xuất báo cáo' : 'Export Report',
    exporting: language === 'vi' ? 'Đang xuất...' : 'Exporting...',
    complete: language === 'vi' ? 'Hoàn tất!' : 'Complete!',
    preview: language === 'vi' ? 'Xem trước' : 'Preview',
    includes: language === 'vi' ? 'Bao gồm' : 'Includes',
  };

  const reportTypes = [
    { 
      id: 'usage', 
      name: trans.usage, 
      icon: BarChart3, 
      color: 'bg-violet-500',
      description: language === 'vi' ? 'Thống kê sử dụng credit và AI features' : 'Credit usage and AI feature statistics',
      includes: ['Credit consumption', 'Feature usage breakdown', 'Daily/Weekly trends', 'Top users']
    },
    { 
      id: 'projects', 
      name: trans.projects, 
      icon: FolderGit2, 
      color: 'bg-blue-500',
      description: language === 'vi' ? 'Tổng quan các dự án và tiến độ' : 'Project overview and progress',
      includes: ['Active projects', 'Completion rates', 'Asset counts', 'Timeline analysis']
    },
    { 
      id: 'team', 
      name: trans.team, 
      icon: Users, 
      color: 'bg-green-500',
      description: language === 'vi' ? 'Hoạt động và đóng góp của thành viên' : 'Member activity and contributions',
      includes: ['Member activity', 'Contribution metrics', 'Role distribution', 'Collaboration stats']
    },
    { 
      id: 'billing', 
      name: trans.billing, 
      icon: CreditCard, 
      color: 'bg-amber-500',
      description: language === 'vi' ? 'Chi tiết thanh toán và hóa đơn' : 'Payment details and invoices',
      includes: ['Payment history', 'Invoice details', 'Credit purchases', 'Subscription info']
    },
    { 
      id: 'time', 
      name: trans.time, 
      icon: Clock, 
      color: 'bg-pink-500',
      description: language === 'vi' ? 'Báo cáo thời gian làm việc' : 'Working hours report',
      includes: ['Hours by project', 'Hours by member', 'Productivity trends', 'Task breakdown']
    },
  ];

  const formats = [
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Best for sharing and printing' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'Best for data analysis' },
    { id: 'csv', name: 'CSV', icon: File, description: 'Best for importing to other tools' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 2000);
    }, 2000);
  };

  const currentReport = reportTypes.find(r => r.id === selectedReport);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <FileText size={20} className="text-orange-600" />
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
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Report Types */}
          <div className="w-72 border-r border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">{trans.selectReport}</h3>
            <div className="space-y-2">
              {reportTypes.map(report => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id as ReportType)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedReport === report.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 ring-2 ring-orange-500'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${report.color} flex items-center justify-center`}>
                      <report.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{report.name}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1">{report.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentReport && (
              <div className="space-y-6">
                {/* Report Preview Card */}
                <Card className={`p-6 bg-gradient-to-br from-${currentReport.color.replace('bg-', '')}/10 to-transparent border-${currentReport.color.replace('bg-', '')}/20`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${currentReport.color} flex items-center justify-center`}>
                      <currentReport.icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{currentReport.name} Report</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{currentReport.description}</p>
                      <div>
                        <p className="text-xs font-medium text-zinc-500 mb-2">{trans.includes}:</p>
                        <div className="flex flex-wrap gap-2">
                          {currentReport.includes.map((item, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{item}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Date Range */}
                <div>
                  <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">{trans.dateRange}</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {(['week', 'month', 'quarter', 'year'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          dateRange === range
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {trans[range]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Format */}
                <div>
                  <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">{trans.format}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {formats.map(format => (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id as ExportFormat)}
                        className={`p-4 rounded-xl text-center transition-all ${
                          selectedFormat === format.id
                            ? 'bg-orange-100 dark:bg-orange-900/30 ring-2 ring-orange-500'
                            : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <format.icon size={24} className={`mx-auto mb-2 ${selectedFormat === format.id ? 'text-orange-600' : 'text-zinc-400'}`} />
                        <p className="font-medium text-zinc-900 dark:text-white">{format.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">{format.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <Button 
                  className="w-full h-12 text-base bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <><Loader2 size={18} className="mr-2 animate-spin" /> {trans.exporting}</>
                  ) : exportComplete ? (
                    <><Check size={18} className="mr-2" /> {trans.complete}</>
                  ) : (
                    <><Download size={18} className="mr-2" /> {trans.export}</>
                  )}
                </Button>

                {/* Recent Exports */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-500 mb-3">Recent Exports</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'AI_Usage_Report_Nov2024.pdf', date: '2 days ago', size: '2.4 MB' },
                      { name: 'Team_Activity_Q4.xlsx', date: '1 week ago', size: '1.8 MB' },
                      { name: 'Billing_Summary_2024.pdf', date: '2 weeks ago', size: '856 KB' },
                    ].map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-zinc-400" />
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{file.name}</p>
                            <p className="text-xs text-zinc-500">{file.date} • {file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm"><Download size={14} /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
