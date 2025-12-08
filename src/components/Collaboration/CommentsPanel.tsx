import React, { useState } from 'react';
import {
  MessageSquare, Send, Check, X, MoreVertical, AtSign,
  CheckCircle, Circle, Trash2, Edit3, Reply as ReplyIcon
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/UIComponents';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  isResolved: boolean;
  mentions: string[];
  replies?: Comment[];
  position?: { x: number; y: number };
}

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ isOpen, onClose }) => {
  const { trans } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://picsum.photos/seed/sarah/100/100',
        role: 'Designer'
      },
      content: 'Can we adjust the color temperature here? It feels a bit too warm.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isResolved: false,
      mentions: [],
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Alex Creative',
            avatar: 'https://picsum.photos/seed/user/100/100',
            role: 'Pro Member'
          },
          content: 'Good catch! I\'ll cool it down a bit.',
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          isResolved: false,
          mentions: ['Sarah Chen']
        }
      ]
    },
    {
      id: '2',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://picsum.photos/seed/mike/100/100',
        role: 'Art Director'
      },
      content: '@Alex Creative The shadows look great! Ready to approve.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isResolved: true,
      mentions: ['Alex Creative']
    },
    {
      id: '3',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://picsum.photos/seed/emma/100/100',
        role: 'Client'
      },
      content: 'Love the composition! Can we see a version with more contrast?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isResolved: false,
      mentions: []
    }
  ]);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return trans.collaboration.justNow;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${trans.collaboration.minutesAgo}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${trans.collaboration.hoursAgo}`;
    return `${Math.floor(seconds / 86400)} ${trans.collaboration.daysAgo}`;
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Alex Creative',
        avatar: 'https://picsum.photos/seed/user/100/100',
        role: 'Pro Member'
      },
      content: newComment,
      timestamp: new Date(),
      isResolved: false,
      mentions: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const toggleResolve = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, isResolved: !c.isResolved } : c
    ));
  };

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'unresolved') return !c.isResolved;
    if (filter === 'resolved') return c.isResolved;
    return true;
  });

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
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MessageSquare className="text-blue-500" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{trans.collaboration.comments}</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface">
          {(['all', 'unresolved', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                filter === f
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {f === 'all' && 'All'}
              {f === 'unresolved' && 'Open'}
              {f === 'resolved' && 'Resolved'}
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <MessageSquare className="text-zinc-400" size={24} />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{trans.collaboration.noComments}</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`group rounded-xl border transition-all ${
                  comment.isResolved
                    ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 opacity-75'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-blue-500/50 hover:shadow-md'
                }`}
              >
                <div className="p-4">
                  {/* Author Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {comment.author.role}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {formatTimeAgo(comment.timestamp)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleResolve(comment.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          comment.isResolved
                            ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        title={comment.isResolved ? 'Reopen' : trans.collaboration.resolve}
                      >
                        {comment.isResolved ? <CheckCircle size={16} /> : <Circle size={16} />}
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600"
                        title={trans.collaboration.delete}
                        onClick={() => deleteComment(comment.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 leading-relaxed">
                    {comment.content}
                  </p>

                  {/* Resolved Badge */}
                  {comment.isResolved && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-3">
                      <CheckCircle size={12} />
                      {trans.collaboration.resolved}
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <img
                            src={reply.author.avatar}
                            alt={reply.author.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs text-zinc-900 dark:text-white">
                                {reply.author.name}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                {formatTimeAgo(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Button */}
                  {!comment.isResolved && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="mt-2 text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                    >
                      <ReplyIcon size={12} />
                      {trans.collaboration.reply}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Comment Input */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-surface">
          <div className="flex items-start gap-3">
            <img
              src="https://picsum.photos/seed/user/100/100"
              alt="You"
              className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-800"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={trans.collaboration.typeComment}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handlePostComment();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <button className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-500">
                  <AtSign size={16} />
                </button>
                <Button
                  size="sm"
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send size={14} />
                  {trans.collaboration.postComment}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
