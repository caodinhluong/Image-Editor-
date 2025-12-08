import React, { useState } from 'react';
import { 
  History, Clock, Check, X, RotateCcw, Download, 
  Trash2, Eye, EyeOff, Sparkles, Wand2, Crop, 
  Palette, Maximize2, Scissors, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button, Badge } from '../ui/UIComponents';

interface HistoryState {
  id: number;
  timestamp: Date;
  action: string;
  tool: string;
  thumbnail: string;
  isSaved: boolean;
  icon: React.ElementType;
  color: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose }) => {
  const { trans } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareMode, setCompareMode] = useState(false);

  // Mock History Data
  const historyStates: HistoryState[] = [
    {
      id: 0,
      timestamp: new Date(Date.now() - 0),
      action: 'Applied color grading',
      tool: 'Adjustments',
      thumbnail: 'https://picsum.photos/seed/state0/200/250',
      isSaved: false,
      icon: Palette,
      color: 'text-purple-500'
    },
    {
      id: 1,
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      action: 'Upscaled to 4K',
      tool: 'Upscale',
      thumbnail: 'https://picsum.photos/seed/state1/200/250',
      isSaved: true,
      icon: Maximize2,
      color: 'text-amber-500'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      action: 'Removed background',
      tool: 'Remove BG',
      thumbnail: 'https://picsum.photos/seed/state2/200/250',
      isSaved: true,
      icon: Scissors,
      color: 'text-pink-500'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      action: 'Generated sunset sky',
      tool: 'Gen Fill',
      thumbnail: 'https://picsum.photos/seed/state3/200/250',
      isSaved: true,
      icon: Wand2,
      color: 'text-repix-500'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      action: 'Cropped to 4:5',
      tool: 'Crop',
      thumbnail: 'https://picsum.photos/seed/state4/200/250',
      isSaved: true,
      icon: Crop,
      color: 'text-blue-500'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: 'Original upload',
      tool: 'Import',
      thumbnail: 'https://picsum.photos/seed/original/200/250',
      isSaved: true,
      icon: Sparkles,
      color: 'text-zinc-500'
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return trans.editor.justNow;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${trans.editor.ago}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${trans.editor.ago}`;
    return `${Math.floor(seconds / 86400)}d ${trans.editor.ago}`;
  };

  const handleRestore = (index: number) => {
    setCurrentIndex(index);
    // In real app: restore state logic here
    console.log('Restoring to state:', historyStates[index]);
  };

  const handleUndo = () => {
    if (currentIndex < historyStates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRedo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-dark-surface border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-repix-500/10">
              <History className="text-repix-500" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{trans.editor.historyTitle}</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{historyStates.length} {trans.editor.version}s</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Undo/Redo Controls */}
        <div className="flex items-center gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={handleUndo}
            disabled={currentIndex >= historyStates.length - 1}
          >
            <RotateCcw size={16} />
            Undo
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={handleRedo}
            disabled={currentIndex <= 0}
          >
            <RotateCcw size={16} className="scale-x-[-1]" />
            Redo
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCompareMode(!compareMode)}
            className={compareMode ? 'bg-repix-500/10 text-repix-500' : ''}
          >
            {compareMode ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {historyStates.map((state, index) => {
            const isActive = index === currentIndex;
            const isFuture = index < currentIndex;
            
            return (
              <div 
                key={state.id}
                className={`
                  group relative rounded-xl border transition-all cursor-pointer
                  ${isActive 
                    ? 'border-repix-500 bg-repix-50 dark:bg-repix-500/10 shadow-md' 
                    : isFuture
                    ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 opacity-50'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-repix-500/50 hover:shadow-md'
                  }
                `}
                onClick={() => handleRestore(index)}
              >
                {/* Timeline Connector */}
                {index < historyStates.length - 1 && (
                  <div className="absolute left-[52px] top-full w-0.5 h-3 bg-zinc-200 dark:bg-zinc-800" />
                )}

                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="relative shrink-0">
                    <div className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive 
                        ? 'border-repix-500 shadow-lg shadow-repix-500/20' 
                        : 'border-zinc-200 dark:border-zinc-700'
                    }`}>
                      <img 
                        src={state.thumbnail} 
                        alt={state.action}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Icon Badge */}
                    <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-md ${
                      isActive ? 'bg-repix-500' : 'bg-zinc-200 dark:bg-zinc-700'
                    }`}>
                      <state.icon 
                        size={12} 
                        className={isActive ? 'text-white' : state.color}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm line-clamp-1 ${
                        isActive 
                          ? 'text-repix-600 dark:text-repix-400' 
                          : 'text-zinc-900 dark:text-white'
                      }`}>
                        {state.action}
                      </h3>
                      {isActive && (
                        <Badge variant="success" className="shrink-0 text-[10px] px-1.5 py-0.5">
                          <Check size={10} className="mr-0.5" />
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      <Clock size={12} />
                      <span>{formatTimeAgo(state.timestamp)}</span>
                      <span>•</span>
                      <span>{state.tool}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {state.isSaved ? (
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          <Check size={10} className="mr-1" />
                          {trans.editor.autoSaved}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-amber-500/30 text-amber-600 dark:text-amber-400">
                          <Clock size={10} className="mr-1" />
                          {trans.editor.unsavedChanges}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions (on hover) */}
                  {!isActive && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <button 
                        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-repix-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(index);
                        }}
                        title={trans.editor.restore}
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button 
                        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Export version:', state);
                        }}
                        title={trans.editor.exportVersion}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Active State Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-repix-500 to-blue-500 rounded-l-xl" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
          >
            <Trash2 size={16} />
            {trans.editor.clearHistory}
          </Button>
          
          <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500">
            Auto-save every 30 seconds • {historyStates.filter(s => s.isSaved).length} saved states
          </p>
        </div>
      </div>
    </>
  );
};
