import React, { useState } from 'react';
import {
  Eye, EyeOff, Lock, Unlock, Trash2, Copy, FolderPlus,
  Plus, MoreVertical, ChevronDown, ChevronRight, Image as ImageIcon,
  Layers as LayersIcon, Link2, Scissors
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button, Slider } from '../ui/UIComponents';

interface Layer {
  id: string;
  name: string;
  type: 'image' | 'group' | 'adjustment' | 'text';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  thumbnail?: string;
  children?: Layer[];
  isExpanded?: boolean;
  hasMask?: boolean;
  isClipped?: boolean;
}

type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' 
  | 'hard-light' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

export const AdvancedLayerPanel: React.FC = () => {
  const { trans } = useLanguage();
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'group-1',
      name: 'Product Group',
      type: 'group',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      isExpanded: true,
      children: [
        {
          id: 'layer-1',
          name: 'Product Shot',
          type: 'image',
          visible: true,
          locked: false,
          opacity: 100,
          blendMode: 'normal',
          thumbnail: 'https://picsum.photos/seed/layer1/100/100',
          hasMask: false,
          isClipped: false
        },
        {
          id: 'layer-2',
          name: 'Shadows',
          type: 'image',
          visible: true,
          locked: false,
          opacity: 75,
          blendMode: 'multiply',
          thumbnail: 'https://picsum.photos/seed/layer2/100/100',
          hasMask: true,
          isClipped: false
        }
      ]
    },
    {
      id: 'layer-3',
      name: 'Background',
      type: 'image',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      thumbnail: 'https://picsum.photos/seed/layer3/100/100',
      hasMask: false,
      isClipped: false
    }
  ]);

  const blendModes: { value: BlendMode; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'darken', label: 'Darken' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' },
    { value: 'luminosity', label: 'Luminosity' }
  ];

  const toggleVisibility = (layerId: string) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    setLayers(updateLayer(layers));
  };

  const toggleLock = (layerId: string) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, locked: !layer.locked };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    setLayers(updateLayer(layers));
  };

  const toggleGroup = (layerId: string) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId && layer.type === 'group') {
          return { ...layer, isExpanded: !layer.isExpanded };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    setLayers(updateLayer(layers));
  };

  const updateOpacity = (layerId: string, opacity: number) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, opacity };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    setLayers(updateLayer(layers));
  };

  const updateBlendMode = (layerId: string, blendMode: BlendMode) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, blendMode };
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) };
        }
        return layer;
      });
    };
    setLayers(updateLayer(layers));
  };

  const deleteLayer = (layerId: string) => {
    const removeLayer = (layers: Layer[]): Layer[] => {
      return layers.filter(layer => {
        if (layer.id === layerId) return false;
        if (layer.children) {
          layer.children = removeLayer(layer.children);
        }
        return true;
      });
    };
    setLayers(removeLayer(layers));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(layers[0]?.id || '');
    }
  };

  const duplicateLayer = (layerId: string) => {
    const findAndDuplicate = (layers: Layer[]): Layer[] => {
      const result: Layer[] = [];
      layers.forEach(layer => {
        result.push(layer);
        if (layer.id === layerId) {
          const duplicate = {
            ...layer,
            id: `${layer.id}-copy-${Date.now()}`,
            name: `${layer.name} Copy`
          };
          result.push(duplicate);
        }
        if (layer.children) {
          layer.children = findAndDuplicate(layer.children);
        }
      });
      return result;
    };
    setLayers(findAndDuplicate(layers));
  };

  const getSelectedLayer = (): Layer | null => {
    const findLayer = (layers: Layer[]): Layer | null => {
      for (const layer of layers) {
        if (layer.id === selectedLayerId) return layer;
        if (layer.children) {
          const found = findLayer(layer.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findLayer(layers);
  };

  const selectedLayer = getSelectedLayer();

  const renderLayer = (layer: Layer, depth: number = 0) => {
    const isSelected = layer.id === selectedLayerId;
    const paddingLeft = depth * 16 + 8;

    return (
      <div key={layer.id}>
        <div
          className={`
            group flex items-center gap-2 px-2 py-2 cursor-pointer transition-all
            ${isSelected 
              ? 'bg-repix-500/10 border-l-2 border-repix-500' 
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }
          `}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => setSelectedLayerId(layer.id)}
        >
          {/* Group Expand/Collapse */}
          {layer.type === 'group' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(layer.id);
              }}
              className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
            >
              {layer.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}

          {/* Thumbnail or Icon */}
          <div className="w-10 h-10 rounded bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700">
            {layer.thumbnail ? (
              <img src={layer.thumbnail} alt={layer.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {layer.type === 'group' ? (
                  <LayersIcon size={16} className="text-zinc-400" />
                ) : (
                  <ImageIcon size={16} className="text-zinc-400" />
                )}
              </div>
            )}
          </div>

          {/* Layer Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium truncate ${
                isSelected ? 'text-repix-600 dark:text-repix-400' : 'text-zinc-900 dark:text-white'
              }`}>
                {layer.name}
              </span>
              {layer.hasMask && (
                <Scissors size={12} className="text-zinc-400" title="Has mask" />
              )}
              {layer.isClipped && (
                <Link2 size={12} className="text-zinc-400" title="Clipping mask" />
              )}
            </div>
            {layer.blendMode !== 'normal' && (
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {blendModes.find(m => m.value === layer.blendMode)?.label}
              </span>
            )}
          </div>

          {/* Opacity */}
          {layer.opacity < 100 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
              {layer.opacity}%
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(layer.id);
              }}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
              title={layer.visible ? trans.editor.hideLayer : trans.editor.showLayer}
            >
              {layer.visible ? <Eye size={14} /> : <EyeOff size={14} className="text-zinc-400" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(layer.id);
              }}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
              title={layer.locked ? trans.editor.unlockLayer : trans.editor.lockLayer}
            >
              {layer.locked ? <Lock size={14} className="text-amber-500" /> : <Unlock size={14} className="text-zinc-400" />}
            </button>
          </div>
        </div>

        {/* Render Children */}
        {layer.type === 'group' && layer.isExpanded && layer.children && (
          <div>
            {layer.children.map(child => renderLayer(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Layer Controls */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
        {/* Blend Mode */}
        {selectedLayer && (
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 block">
              {trans.editor.blendMode}
            </label>
            <select
              value={selectedLayer.blendMode}
              onChange={(e) => updateBlendMode(selectedLayer.id, e.target.value as BlendMode)}
              className="w-full px-2 py-1.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-repix-500"
            >
              {blendModes.map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Opacity */}
        {selectedLayer && (
          <div>
            <Slider
              label={trans.editor.opacity}
              value={selectedLayer.opacity}
              onChange={(value) => updateOpacity(selectedLayer.id, value)}
              min={0}
              max={100}
              showValue
              unit="%"
            />
          </div>
        )}
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto">
        {layers.map(layer => renderLayer(layer))}
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/30">
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              const newLayer: Layer = {
                id: `layer-${Date.now()}`,
                name: 'New Layer',
                type: 'image',
                visible: true,
                locked: false,
                opacity: 100,
                blendMode: 'normal',
                thumbnail: 'https://picsum.photos/seed/new/100/100'
              };
              setLayers([newLayer, ...layers]);
              setSelectedLayerId(newLayer.id);
            }}
            title={trans.editor.newLayer}
          >
            <Plus size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              const newGroup: Layer = {
                id: `group-${Date.now()}`,
                name: 'New Group',
                type: 'group',
                visible: true,
                locked: false,
                opacity: 100,
                blendMode: 'normal',
                isExpanded: true,
                children: []
              };
              setLayers([newGroup, ...layers]);
            }}
            title={trans.editor.newGroup}
          >
            <FolderPlus size={16} />
          </Button>
          {selectedLayer && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => duplicateLayer(selectedLayer.id)}
                title={trans.editor.duplicateLayer}
              >
                <Copy size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => deleteLayer(selectedLayer.id)}
                title={trans.editor.deleteLayer}
              >
                <Trash2 size={16} />
              </Button>
            </>
          )}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          title="More options"
        >
          <MoreVertical size={16} />
        </Button>
      </div>
    </div>
  );
};
