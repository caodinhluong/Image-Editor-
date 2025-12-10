import React, { useState } from 'react';
import {
  X, Save, Eye, Upload, Image as ImageIcon, Tag, DollarSign,
  FileText, Clock, History, Archive, Copy, Trash2, Globe,
  ChevronDown, Check, AlertCircle, Sparkles, RotateCcw,
  ExternalLink, Lock, Unlock, Plus, GripVertical, Play
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui/UIComponents';

interface TemplateVersion {
  id: string;
  version: string;
  date: Date;
  changes: string;
  isCurrent: boolean;
}

interface TemplateData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  license: 'standard' | 'extended' | 'exclusive';
  status: 'published' | 'draft' | 'archived';
  thumbnail: string;
  previewImages: string[];
  createdAt: Date;
  updatedAt: Date;
  sales: number;
  downloads: number;
}

interface TemplateEditorProps {
  templateId: string;
  onClose: () => void;
  onSave?: (data: TemplateData) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ templateId, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'pricing' | 'history'>('details');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Mock template data
  const [template, setTemplate] = useState<TemplateData>({
    id: templateId,
    title: 'Cyberpunk City Pack',
    description: 'Transform your photos into stunning cyberpunk-style images with neon lights, futuristic elements, and dramatic color grading. Perfect for urban photography, portraits, and creative projects.',
    category: 'Urban',
    tags: ['Cyberpunk', 'Neon', 'Urban', 'Futuristic', 'Night'],
    price: 29,
    license: 'standard',
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop',
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    sales: 234,
    downloads: 456
  });

  const [versions] = useState<TemplateVersion[]>([
    { id: '1', version: '2.1', date: new Date('2024-12-01'), changes: 'Updated color grading, added new presets', isCurrent: true },
    { id: '2', version: '2.0', date: new Date('2024-10-15'), changes: 'Major update: New AI model, improved quality', isCurrent: false },
    { id: '3', version: '1.5', date: new Date('2024-08-20'), changes: 'Added 5 new style variations', isCurrent: false },
    { id: '4', version: '1.0', date: new Date('2024-01-15'), changes: 'Initial release', isCurrent: false },
  ]);

  const categories = ['Urban', 'Portrait', 'Nature', 'Product', 'Fashion', 'Architecture', '3D Asset', 'Abstract'];
  
  const updateField = <K extends keyof TemplateData>(field: K, value: TemplateData[K]) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addTag = () => {
    if (newTag.trim() && !template.tags.includes(newTag.trim())) {
      updateField('tags', [...template.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    updateField('tags', template.tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    onSave?.(template);
  };

  const handleDuplicate = () => {
    alert('Template duplicated! You can find it in your drafts.');
  };

  const handleArchive = () => {
    updateField('status', 'archived');
  };

  const handleUnpublish = () => {
    updateField('status', 'draft');
  };

  const handlePublish = () => {
    updateField('status', 'published');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'draft': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'archived': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
      default: return '';
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Template</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
              {template.status}
            </span>
            {hasChanges && (
              <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-0">
                Unsaved changes
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)}>
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={!hasChanges}
              isLoading={isSaving}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg ml-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 p-4 shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'details', label: 'Details', icon: FileText },
                { id: 'media', label: 'Media', icon: ImageIcon },
                { id: 'pricing', label: 'Pricing', icon: DollarSign },
                { id: 'history', label: 'History', icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-repix-500/10 text-repix-600 dark:text-repix-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <p className="text-xs font-bold text-zinc-500 uppercase mb-3">Actions</p>
              <button 
                onClick={handleDuplicate}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Copy size={16} />
                Duplicate
              </button>
              {template.status === 'published' ? (
                <button 
                  onClick={handleUnpublish}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <Lock size={16} />
                  Unpublish
                </button>
              ) : template.status === 'draft' ? (
                <button 
                  onClick={handlePublish}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Unlock size={16} />
                  Publish
                </button>
              ) : null}
              <button 
                onClick={handleArchive}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Archive size={16} />
                Archive
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Title
                  </label>
                  <Input
                    value={template.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Template title"
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe your template..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0 text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-repix-500 resize-none"
                  />
                  <p className="text-xs text-zinc-500 mt-1">{template.description.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Category
                  </label>
                  <select
                    value={template.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0 text-zinc-900 dark:text-white focus:ring-2 focus:ring-repix-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button variant="outline" onClick={addTag}>
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}


            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Thumbnail
                  </label>
                  <div className="relative group w-full max-w-md aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img 
                      src={template.thumbnail} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button size="sm" variant="secondary">
                        <Upload size={14} className="mr-2" />
                        Replace
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Recommended: 1200x800px, JPG or PNG</p>
                </div>

                {/* Preview Images */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Preview Images ({template.previewImages.length}/6)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {template.previewImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                            <GripVertical size={16} className="text-white" />
                          </button>
                          <button 
                            className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500"
                            onClick={() => updateField('previewImages', template.previewImages.filter((_, i) => i !== idx))}
                          >
                            <Trash2 size={16} className="text-white" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                    
                    {template.previewImages.length < 6 && (
                      <label className="aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-repix-500 transition-colors">
                        <Plus size={24} className="text-zinc-400 mb-2" />
                        <span className="text-sm text-zinc-500">Add Image</span>
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Drag to reorder. First image will be shown in search results.</p>
                </div>

                {/* Before/After Demo */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Before/After Demo (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-repix-500 transition-colors">
                      <ImageIcon size={24} className="text-zinc-400 mb-2" />
                      <span className="text-sm text-zinc-500">Before Image</span>
                    </div>
                    <div className="aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-repix-500 transition-colors">
                      <Sparkles size={24} className="text-zinc-400 mb-2" />
                      <span className="text-sm text-zinc-500">After Image</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-2xl">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Price
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                      <Input
                        type="number"
                        value={template.price}
                        onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                        className="pl-9"
                        min={0}
                      />
                    </div>
                    <Button 
                      variant={template.price === 0 ? 'primary' : 'outline'}
                      onClick={() => updateField('price', 0)}
                    >
                      Free
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    You'll receive 70% of the sale price. Platform fee: 30%
                  </p>
                </div>

                {/* License Type */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    License Type
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', name: 'Standard License', desc: 'For personal and commercial projects. No resale.', price: 'Base price' },
                      { id: 'extended', name: 'Extended License', desc: 'Includes merchandise and unlimited copies.', price: '3x base price' },
                      { id: 'exclusive', name: 'Exclusive License', desc: 'Full rights transfer. Template removed after sale.', price: '10x base price' },
                    ].map((license) => (
                      <label
                        key={license.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          template.license === license.id
                            ? 'border-repix-500 bg-repix-500/5'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="license"
                          value={license.id}
                          checked={template.license === license.id}
                          onChange={(e) => updateField('license', e.target.value as TemplateData['license'])}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-900 dark:text-white">{license.name}</span>
                            <span className="text-sm text-zinc-500">{license.price}</span>
                          </div>
                          <p className="text-sm text-zinc-500 mt-1">{license.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pricing Preview */}
                <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50">
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-3">Pricing Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Standard License</span>
                      <span className="font-medium">${template.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Extended License</span>
                      <span className="font-medium">${template.price * 3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Exclusive License</span>
                      <span className="font-medium">${template.price * 10}</span>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-2 mt-2">
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Your earnings (70%)</span>
                        <span className="font-bold">${(template.price * 0.7).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}


            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">Version History</h3>
                    <p className="text-sm text-zinc-500">Track changes and restore previous versions</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus size={14} className="mr-2" />
                    Create New Version
                  </Button>
                </div>

                <div className="space-y-4">
                  {versions.map((version, idx) => (
                    <Card 
                      key={version.id} 
                      className={`p-4 ${version.isCurrent ? 'ring-2 ring-repix-500' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            version.isCurrent 
                              ? 'bg-repix-500 text-white' 
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          }`}>
                            <span className="text-sm font-bold">v{version.version}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-zinc-900 dark:text-white">
                                Version {version.version}
                              </span>
                              {version.isCurrent && (
                                <Badge className="bg-repix-100 dark:bg-repix-900/30 text-repix-600 dark:text-repix-400 border-0 text-[10px]">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-500 mt-1">{version.changes}</p>
                            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                              <Clock size={12} />
                              {version.date.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          {!version.isCurrent && (
                            <Button variant="outline" size="sm">
                              <RotateCcw size={14} className="mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Version Timeline Visual */}
                <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50">
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-4">Timeline</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="space-y-6">
                      {versions.map((version, idx) => (
                        <div key={version.id} className="flex items-center gap-4 relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            version.isCurrent 
                              ? 'bg-repix-500 text-white' 
                              : 'bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300'
                          }`}>
                            {version.isCurrent ? <Check size={14} /> : <span className="text-xs">{versions.length - idx}</span>}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-zinc-900 dark:text-white">v{version.version}</span>
                            <span className="text-xs text-zinc-500 ml-2">{version.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="h-14 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-zinc-50 dark:bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <span>Created: {template.createdAt.toLocaleDateString()}</span>
            <span>Updated: {template.updatedAt.toLocaleDateString()}</span>
            <span>{template.sales} sales</span>
            <span>{template.downloads} downloads</span>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink size={14} className="mr-2" />
            View in Marketplace
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-dark-surface w-full max-w-4xl rounded-2xl overflow-hidden">
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
              <h3 className="font-bold text-zinc-900 dark:text-white">Preview</h3>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-6">
                <div className="w-1/2">
                  <img src={template.thumbnail} alt="Preview" className="w-full rounded-xl" />
                </div>
                <div className="w-1/2">
                  <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-3">{template.title}</h2>
                  <p className="text-zinc-500 mt-2">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {template.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </span>
                      <Button>
                        <Play size={16} className="mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
