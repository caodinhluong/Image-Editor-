import React, { useEffect, useRef, useState } from 'react';

interface CarouselImage {
  src: string;
  alt: string;
}

interface RotatingImageCarouselProps {
  images: CarouselImage[];
  autoRotate?: boolean;
  rotationSpeed?: number; // seconds per full rotation
  radius?: number; // radius in pixels
  imageWidth?: number;
  imageHeight?: number;
}

const RotatingImageCarousel: React.FC<RotatingImageCarouselProps> = ({
  images,
  autoRotate = true,
  rotationSpeed = 20,
  radius = 200,
  imageWidth = 120,
  imageHeight = 150,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const angleStep = 360 / images.length;

  useEffect(() => {
    if (!autoRotate || isDragging) return;

    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.5);
    }, (rotationSpeed * 1000) / 720);

    return () => clearInterval(interval);
  }, [autoRotate, rotationSpeed, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentRotation(rotation);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotation(currentRotation + deltaX * 0.5);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ perspective: '1000px' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect behind carousel */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-[80px]" />
      </div>

      {/* 3D Rotating Container */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.1s linear',
        }}
      >
        {images.map((image, index) => {
          const angle = angleStep * index;
          const zIndex = Math.round(Math.cos((angle + rotation) * (Math.PI / 180)) * 10) + 10;
          const opacity = (Math.cos((angle + rotation) * (Math.PI / 180)) + 1) / 2 * 0.6 + 0.4;

          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 transition-all duration-300"
              style={{
                width: imageWidth,
                height: imageHeight,
                transform: `
                  translateX(-50%) 
                  translateY(-50%) 
                  rotateY(${angle}deg) 
                  translateZ(${radius}px)
                `,
                transformStyle: 'preserve-3d',
                zIndex,
              }}
            >
              <div
                className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 group hover:scale-110 transition-transform duration-300"
                style={{ opacity }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Reflection effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default RotatingImageCarousel;
