import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Download, Edit3, Copy, Check } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { RecreateView } from './RecreateView';

interface GenerationDetailModalProps {
  onClose: () => void;
  generation: {
    id: string;
    title: string;
    image: string;
    prompt: string;
    model: string;
    style: string;
    ratio: string;
  };
  onEdit?: () => void;
}

export const GenerationDetailModal: React.FC<GenerationDetailModalProps> = ({ 
  onClose, 
  generation,
  onEdit 
}) => {
  const { language } = useLanguage();
  const [showRecreate, setShowRecreate] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generation.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trans = {
    vi: {
      aiGenerated: 'AI Generated',
      prompt: 'PROMPT',
      copy: 'Copy',
      copied: 'Đã copy',
      information: 'INFORMATION',
      model: 'Model',
      style: 'Style',
      ratio: 'Ratio',
      recreate: 'Recreate',
      download: 'Download',
      edit: 'Edit',
    },
    en: {
      aiGenerated: 'AI Generated',
      prompt: 'PROMPT',
      copy: 'Copy',
      copied: 'Copied',
      information: 'INFORMATION',
      model: 'Model',
      style: 'Style',
      ratio: 'Ratio',
      recreate: 'Recreate',
      download: 'Download',
      edit: 'Edit',
    }
  };

  const t = trans[language] || trans.en;

  // Show RecreateView when Recreate is clicked
  if (showRecreate) {
    return (
      <RecreateView
        onClose={() => setShowRecreate(false)}
        originalImage={generation.image}
        originalPrompt={generation.prompt}
        generationInfo={{
          model: generation.model,
          style: generation.style,
          ratio: generation.ratio,
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90">
      <div className="bg-zinc-900 w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden flex relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full z-20 transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>

        {/* Left - Image Preview */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-8">
          <img 
            src={generation.image} 
            alt={generation.title} 
            className="max-h-full max-w-full object-contain rounded-xl"
          />
        </div>

        {/* Right - Info Panel */}
        <div className="w-[340px] flex flex-col bg-zinc-900 border-l border-zinc-800">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{generation.title}</h2>
                <p className="text-xs text-zinc-500">{t.aiGenerated}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Prompt Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-zinc-500 flex items-center gap-2">
                  <Sparkles size={12} />
                  {t.prompt}
                </h3>
                <button 
                  onClick={handleCopyPrompt}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs font-medium text-white transition-colors flex items-center gap-1"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/50 rounded-xl p-4 max-h-40 overflow-y-auto">
                {generation.prompt}
              </p>
            </div>

            {/* Information Section */}
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-[10px]">i</span>
                {t.information}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.model}</span>
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-white">
                    {generation.model}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.style}</span>
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-white">
                    {generation.style}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">{t.ratio}</span>
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-white">
                    {generation.ratio}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-zinc-800 space-y-3">
            {/* Recreate Button - Main CTA */}
            <Button
              onClick={() => setShowRecreate(true)}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/25"
            >
              <RefreshCw size={18} />
              {t.recreate}
            </Button>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white rounded-full font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} />
                {t.download}
              </Button>
              <Button
                onClick={onEdit}
                variant="outline"
                className="flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white rounded-full font-medium flex items-center justify-center gap-2"
              >
                <Edit3 size={16} />
                {t.edit}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationDetailModal;
