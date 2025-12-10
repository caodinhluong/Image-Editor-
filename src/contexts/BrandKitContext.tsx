import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandKit } from '../types/brandKit';

interface BrandKitContextType {
  brandKits: BrandKit[];
  activeBrandKit: BrandKit | null;
  isLoading: boolean;
  createBrandKit: (brandKit: Omit<BrandKit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BrandKit>;
  updateBrandKit: (id: string, updates: Partial<BrandKit>) => Promise<void>;
  deleteBrandKit: (id: string) => Promise<void>;
  setActiveBrandKit: (brandKit: BrandKit | null) => void;
  refreshBrandKits: () => Promise<void>;
}

const BrandKitContext = createContext<BrandKitContextType | undefined>(undefined);

export const useBrandKit = () => {
  const context = useContext(BrandKitContext);
  if (!context) {
    throw new Error('useBrandKit must be used within BrandKitProvider');
  }
  return context;
};

interface BrandKitProviderProps {
  children: ReactNode;
}

export const BrandKitProvider: React.FC<BrandKitProviderProps> = ({ children }) => {
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [activeBrandKit, setActiveBrandKitState] = useState<BrandKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load brand kits from localStorage on mount
  useEffect(() => {
    loadBrandKits();
    loadActiveBrandKit();
  }, []);

  // Save to localStorage whenever brandKits change
  useEffect(() => {
    if (brandKits.length > 0) {
      try {
        localStorage.setItem('repix_brand_kits', JSON.stringify(brandKits));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('LocalStorage quota exceeded. Clearing old data...');
          // Clear old brand kits data and try again
          localStorage.removeItem('repix_brand_kits');
          try {
            localStorage.setItem('repix_brand_kits', JSON.stringify(brandKits));
          } catch (e) {
            console.error('Failed to save brand kits even after clearing:', e);
          }
        }
      }
    }
  }, [brandKits]);

  // Save active brand kit to localStorage
  useEffect(() => {
    try {
      if (activeBrandKit) {
        localStorage.setItem('repix_active_brand_kit', activeBrandKit.id);
      } else {
        localStorage.removeItem('repix_active_brand_kit');
      }
    } catch (error) {
      console.error('Failed to save active brand kit:', error);
    }
  }, [activeBrandKit]);

  const loadBrandKits = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('repix_brand_kits');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const kits = parsed.map((kit: any) => ({
          ...kit,
          createdAt: new Date(kit.createdAt),
          updatedAt: new Date(kit.updatedAt),
          metadata: {
            ...kit.metadata,
            lastUsed: new Date(kit.metadata.lastUsed),
          },
        }));
        setBrandKits(kits);
      }
    } catch (error) {
      console.error('Failed to load brand kits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActiveBrandKit = () => {
    const activeId = localStorage.getItem('repix_active_brand_kit');
    if (activeId) {
      const stored = localStorage.getItem('repix_brand_kits');
      if (stored) {
        const kits = JSON.parse(stored);
        const active = kits.find((kit: BrandKit) => kit.id === activeId);
        if (active) {
          setActiveBrandKitState({
            ...active,
            createdAt: new Date(active.createdAt),
            updatedAt: new Date(active.updatedAt),
            metadata: {
              ...active.metadata,
              lastUsed: new Date(active.metadata.lastUsed),
            },
          });
        }
      }
    }
  };

  const createBrandKit = async (brandKitData: Omit<BrandKit, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandKit> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newBrandKit: BrandKit = {
      ...brandKitData,
      id: `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBrandKits(prev => [...prev, newBrandKit]);
    setIsLoading(false);
    
    return newBrandKit;
  };

  const updateBrandKit = async (id: string, updates: Partial<BrandKit>): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setBrandKits(prev => prev.map(kit => 
      kit.id === id 
        ? { ...kit, ...updates, updatedAt: new Date() }
        : kit
    ));

    // Update active brand kit if it's the one being updated
    if (activeBrandKit?.id === id) {
      setActiveBrandKitState(prev => 
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      );
    }

    setIsLoading(false);
  };

  const deleteBrandKit = async (id: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setBrandKits(prev => prev.filter(kit => kit.id !== id));

    // Clear active brand kit if it's the one being deleted
    if (activeBrandKit?.id === id) {
      setActiveBrandKitState(null);
    }

    setIsLoading(false);
  };

  const setActiveBrandKit = (brandKit: BrandKit | null) => {
    setActiveBrandKitState(brandKit);
    
    // Update last used timestamp
    if (brandKit) {
      updateBrandKit(brandKit.id, {
        metadata: {
          ...brandKit.metadata,
          lastUsed: new Date(),
          usageCount: brandKit.metadata.usageCount + 1,
        },
      });
    }
  };

  const refreshBrandKits = async () => {
    await loadBrandKits();
  };

  const value: BrandKitContextType = {
    brandKits,
    activeBrandKit,
    isLoading,
    createBrandKit,
    updateBrandKit,
    deleteBrandKit,
    setActiveBrandKit,
    refreshBrandKits,
  };

  return (
    <BrandKitContext.Provider value={value}>
      {children}
    </BrandKitContext.Provider>
  );
};
