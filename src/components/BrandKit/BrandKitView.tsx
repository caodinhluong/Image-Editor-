import React, { useState } from 'react';
import { BrandKitManager } from './BrandKitManager';
import { BrandKitCreator } from './BrandKitCreator';
import { BrandKit } from '../../types/brandKit';

export const BrandKitView: React.FC = () => {
  const [showCreator, setShowCreator] = useState(false);
  const [editingBrandKit, setEditingBrandKit] = useState<BrandKit | null>(null);

  const handleCreateNew = () => {
    setEditingBrandKit(null);
    setShowCreator(true);
  };

  const handleEdit = (brandKit: BrandKit) => {
    setEditingBrandKit(brandKit);
    setShowCreator(true);
  };

  const handleComplete = () => {
    setShowCreator(false);
    setEditingBrandKit(null);
  };

  const handleClose = () => {
    setShowCreator(false);
    setEditingBrandKit(null);
  };

  return (
    <>
      <BrandKitManager
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
      />
      
      {showCreator && (
        <BrandKitCreator
          onClose={handleClose}
          onComplete={handleComplete}
        />
      )}
    </>
  );
};
