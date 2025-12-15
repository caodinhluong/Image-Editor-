import React, { useState } from 'react';
import { X, Image as ImageIcon, Check, Plus } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShareGenerationModalProps {
  onClose: () => void;
  onPublish?: (items: PublishItem[]) => void;
}

interface PublishItem {
  id: string;
  mainImage: string;
  prompt: string;
}

const mockGenerations = [
  { 
    id: '1', 
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Close-up portrait, subject centered, head and shoulders visible, room background on right • Camera Settings: Moderate aperture, natural indoor lighting, no flash • Film Grain: Soft, smooth finish, low grain LENS EFFECTS: • Optics: Sharp focus on face and hairbrush, slight softness around edges • Artifacts: None noticeable • Depth of Field: Shallow to moderate, background slightly blurred SUBJECT: • Description: Young woman with long black hair and bangs, neutral expression, dark eyes looking forward • Wardrobe: Off-shoulder garment in dark color, minimal visible clothing • Grooming: Smooth skin, natural makeup with subtle lip tint SCENE: • Location: Indoor room with pale walls, window with metal frame and bulletin board visible • Time of Day: Day or evening with soft artificial lighting • Environment: Quiet, personal space, casual setting VISUAL DETAILS: • Action: Holding a pink hairbrush close to face • Props: Pink hairbrush with open, rounded rectangular design • Physics: Hair slightly tousled, resting on shoulder CINEMATOGRAPHY: • Lighting: Soft, diffused indoor light, no harsh shadows • Tone: Calm, intimate, and natural • Color Palette: Neutral tones with soft pink from hairbrush and subtle skin tones TEXT ELEMENTS: • Visible Text: None • Typography: None • Placement: None STYLE: • Visual Aesthetic: Realistic, soft-focus portrait with casual indoor ambiance' 
  },
  { 
    id: '2', 
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Medium close-up portrait, subject positioned slightly off-center, warm golden hour lighting from the side • Camera Settings: Wide aperture f/1.8, natural outdoor lighting, golden hour • Film Grain: Minimal grain, smooth cinematic finish LENS EFFECTS: • Optics: Crisp focus on eyes and facial features, beautiful bokeh in background • Artifacts: Subtle lens flare from sun • Depth of Field: Very shallow, creamy background blur SUBJECT: • Description: Young woman with flowing auburn hair, genuine warm smile showing teeth, bright expressive eyes with natural sparkle • Wardrobe: Light summer dress in soft pastel colors, delicate jewelry • Grooming: Natural makeup enhancing features, sun-kissed skin with light freckles SCENE: • Location: Outdoor setting, possibly a garden or park with soft foliage in background • Time of Day: Golden hour, approximately 1 hour before sunset • Environment: Peaceful, romantic atmosphere with warm ambient light VISUAL DETAILS: • Action: Candid moment of genuine laughter, hair caught in gentle breeze • Props: None visible • Physics: Hair movement suggesting light wind, natural body language CINEMATOGRAPHY: • Lighting: Warm golden backlight creating rim lighting effect on hair • Tone: Joyful, carefree, and authentic • Color Palette: Warm golden tones, soft greens from foliage, natural skin tones TEXT ELEMENTS: • Visible Text: None • Typography: None • Placement: None STYLE: • Visual Aesthetic: Lifestyle photography with editorial quality, natural and unposed feeling' 
  },
  { 
    id: '3', 
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Three-quarter portrait, subject facing camera with confident stance, urban backdrop • Camera Settings: Medium aperture f/2.8, mixed natural and artificial lighting • Film Grain: Subtle grain for editorial feel LENS EFFECTS: • Optics: Sharp focus throughout face, slight vignette at edges • Artifacts: None • Depth of Field: Moderate, background recognizable but softened SUBJECT: • Description: Young man with styled dark hair, strong jawline, confident neutral expression, direct eye contact • Wardrobe: Contemporary streetwear, layered outfit with designer elements, statement accessories • Grooming: Well-maintained stubble, styled hair with product, clear skin SCENE: • Location: Urban environment, possibly city street or architectural setting • Time of Day: Late afternoon, overcast sky providing even lighting • Environment: Modern, metropolitan atmosphere with clean lines VISUAL DETAILS: • Action: Standing pose with relaxed shoulders, hands possibly in pockets • Props: Minimal, focus on subject • Physics: Static pose, clothing draping naturally CINEMATOGRAPHY: • Lighting: Soft overcast light with subtle fill, no harsh shadows • Tone: Cool, confident, and contemporary • Color Palette: Muted urban tones, blacks, grays, with subtle color accents TEXT ELEMENTS: • Visible Text: None • Typography: None • Placement: None STYLE: • Visual Aesthetic: High-fashion editorial meets street style, polished yet approachable' 
  },
  { 
    id: '4', 
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Beauty close-up, face filling most of frame, symmetrical positioning • Camera Settings: Wide aperture f/1.4, studio strobe lighting with softboxes • Film Grain: None, clean digital capture LENS EFFECTS: • Optics: Tack sharp focus on eyes, gradual softness toward edges • Artifacts: Subtle catchlights in eyes from lighting setup • Depth of Field: Extremely shallow, ears and hair slightly soft SUBJECT: • Description: Young woman with flawless complexion, striking bone structure, full lips with glossy finish, perfectly groomed eyebrows • Wardrobe: Minimal visible, possibly bare shoulders suggesting elegant simplicity • Grooming: Professional makeup application, dewy skin finish, defined eyes with subtle smoky effect SCENE: • Location: Professional photography studio with controlled environment • Time of Day: N/A - studio setting • Environment: Clean, distraction-free background, focus entirely on subject VISUAL DETAILS: • Action: Subtle expression, slight head tilt, engaging eye contact • Props: None • Physics: Perfect stillness, every detail intentional CINEMATOGRAPHY: • Lighting: Classic beauty lighting setup, key light at 45 degrees, fill light opposite, hair light from behind • Tone: Elegant, sophisticated, and timeless • Color Palette: Neutral tones, emphasis on natural skin colors, subtle pink undertones TEXT ELEMENTS: • Visible Text: None • Typography: None • Placement: None STYLE: • Visual Aesthetic: High-end beauty campaign quality, magazine cover worthy' 
  },
  { 
    id: '5', 
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Fashion portrait, full face visible with dramatic angle, high contrast lighting • Camera Settings: Medium aperture, studio flash with modifiers • Film Grain: Minimal, clean commercial finish' 
  },
  { 
    id: '6', 
    url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Lifestyle candid, subject in natural environment, authentic moment captured • Camera Settings: Fast shutter, natural lighting • Film Grain: Light grain for authentic feel' 
  },
  { 
    id: '7', 
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Editorial beauty shot, dramatic makeup emphasis, artistic lighting • Camera Settings: Studio strobe, beauty dish • Film Grain: None, ultra-clean finish' 
  },
  { 
    id: '8', 
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', 
    type: 'image', 
    prompt: 'SHOT: • Composition: Professional headshot, corporate style, clean background • Camera Settings: Portrait lens 85mm, studio lighting • Film Grain: None, professional finish' 
  },
];

export const ShareGenerationModal: React.FC<ShareGenerationModalProps> = ({ onClose, onPublish }) => {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'all' | 'image'>('all');
  const [publishItems, setPublishItems] = useState<PublishItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const tabs = [
    { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All' },
    { id: 'image', label: language === 'vi' ? 'Ảnh' : 'Image', icon: ImageIcon },
  ];

  const addToPublish = (gen: typeof mockGenerations[0]) => {
    if (!publishItems.find(item => item.id === gen.id)) {
      const newItem: PublishItem = { id: gen.id, mainImage: gen.url, prompt: gen.prompt };
      setPublishItems(prev => [...prev, newItem]);
      setActiveItemIndex(publishItems.length);
    }
  };

  const removeFromPublish = (id: string) => {
    setPublishItems(prev => prev.filter(item => item.id !== id));
    if (activeItemIndex >= publishItems.length - 1) {
      setActiveItemIndex(Math.max(0, publishItems.length - 2));
    }
  };

  const activeItem = publishItems[activeItemIndex];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95">
      <div className="bg-zinc-950 w-full h-full flex relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full z-20">
          <X size={24} className="text-zinc-400" />
        </button>

        {/* Left - Preview & Prompt */}
        <div className="flex-1 flex p-8 gap-6">
          {/* Main Preview */}
          <div className="flex flex-col items-center">
            <div className="flex-1 flex items-center justify-center mb-4">
              {activeItem ? (
                <img src={activeItem.mainImage} alt="Preview" className="max-h-[60vh] w-auto object-contain rounded-xl" />
              ) : (
                <div className="w-80 h-80 bg-zinc-900 rounded-xl flex items-center justify-center flex-col gap-3 border border-zinc-800">
                  <ImageIcon size={64} className="text-zinc-700" />
                  <p className="text-zinc-500 text-sm">{language === 'vi' ? 'Chọn ảnh để publish' : 'Select images to publish'}</p>
                </div>
              )}
            </div>

            {/* Publish Items Tabs */}
            <div className="flex items-center gap-3 mb-6">
              {publishItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activeItemIndex ? 'border-yellow-500 ring-2 ring-yellow-500/30' : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <img src={item.mainImage} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromPublish(item.id); }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </button>
              ))}
            </div>

            {/* Publish Button */}
            <Button 
              onClick={() => { onPublish?.(publishItems); onClose(); }}
              disabled={publishItems.length === 0}
              className="px-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-semibold disabled:opacity-50 min-w-[200px]"
            >
              {language === 'vi' ? 'Xuất bản' : 'Publish'} ({publishItems.length})
            </Button>
          </div>

          {/* Prompt Section */}
          <div className="w-[400px] flex flex-col">
            <h3 className="text-sm font-semibold text-zinc-500 mb-3">Prompt</h3>
            <div className="flex-1 bg-zinc-900/50 rounded-xl p-5 overflow-y-auto text-sm text-zinc-300 leading-relaxed border border-zinc-800/50 max-h-[70vh]">
              {activeItem ? activeItem.prompt : (
                <span className="text-zinc-600">{language === 'vi' ? 'Chọn ảnh để xem prompt' : 'Select an image to view prompt'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right - Gallery */}
        <div className="w-[320px] flex flex-col bg-zinc-900/50 border-l border-zinc-800">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTab === tab.id ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-2">
              {mockGenerations.map(gen => {
                const isAdded = publishItems.some(item => item.id === gen.id);
                const itemIndex = publishItems.findIndex(item => item.id === gen.id);
                return (
                  <button
                    key={gen.id}
                    onClick={() => addToPublish(gen)}
                    className={`relative aspect-square rounded-lg overflow-hidden group ${isAdded ? 'ring-2 ring-yellow-500' : 'hover:ring-2 hover:ring-zinc-600'}`}
                  >
                    <img src={gen.url} alt="" className="w-full h-full object-cover" />
                    <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isAdded ? 'bg-cyan-500 text-white' : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
                    }`}>
                      {isAdded ? itemIndex + 1 : <Plus size={10} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareGenerationModal;
