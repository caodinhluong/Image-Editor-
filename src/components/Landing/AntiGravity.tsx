import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
  particleCount?: number;
  colors?: string[];
  maxRadius?: number;
  minRadius?: number;
  speed?: number;
  mouseRadius?: number;
  mouseForce?: number;
}

// Global mouse position tracker
const globalMouse = { x: 0, y: 0, isActive: false };

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    globalMouse.x = e.clientX;
    globalMouse.y = e.clientY;
    globalMouse.isActive = true;
  });
  window.addEventListener('mouseleave', () => {
    globalMouse.isActive = false;
  });
}

// Create glow texture programmatically
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  // Create radial gradient for glow effect
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const AntigravityInner: React.FC<AntigravityProps> = ({
  particleCount = 300,
  colors = ['#FFFFFF', '#EC4899', '#D946EF', '#A855F7', '#3B82F6', '#06B6D4'],
  maxRadius = 0.5,
  minRadius = 0.1,
  speed = 0.2,
  mouseRadius = 180,
  mouseForce = 0.08
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, size } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mousePos = useRef({ x: 0, y: 0 });
  
  // Create glow texture once
  const glowTexture = useMemo(() => createGlowTexture(), []);

  // Create particles
  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * width * 1.8;
      const y = (Math.random() - 0.5) * height * 1.8;
      const z = (Math.random() - 0.5) * 15;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const colorIndex = Math.floor(Math.random() * colors.length);
      const vx = (Math.random() - 0.5) * speed * 0.3;
      const vy = (Math.random() - 0.5) * speed * 0.3;
      
      temp.push({
        x, y, z,
        originX: x,
        originY: y,
        vx, vy,
        radius,
        colorIndex,
        hoverScale: 1,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.5 + Math.random() * 2
      });
    }
    return temp;
  }, [particleCount, viewport.width, viewport.height, minRadius, maxRadius, colors.length, speed]);

  // Create colors for particles
  const particleColors = useMemo(() => {
    return particles.map(p => new THREE.Color(colors[p.colorIndex]));
  }, [particles, colors]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = state.clock.getElapsedTime();
    
    // Convert global mouse to world coordinates
    const normalizedX = (globalMouse.x / size.width) * 2 - 1;
    const normalizedY = -((globalMouse.y / size.height) * 2 - 1);
    const mouseX = (normalizedX * viewport.width) / 2;
    const mouseY = (normalizedY * viewport.height) / 2;
    
    mousePos.current.x = mouseX;
    mousePos.current.y = mouseY;

    const worldMouseRadius = (mouseRadius / size.width) * viewport.width;
    
    particles.forEach((particle, i) => {
      const dx = particle.x - mousePos.current.x;
      const dy = particle.y - mousePos.current.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      
      // Hover effect - push away from mouse
      if (globalMouse.isActive && distToMouse < worldMouseRadius) {
        const force = (1 - distToMouse / worldMouseRadius) * mouseForce;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force;
        particle.vy += Math.sin(angle) * force;
        particle.hoverScale = 1.5 + (1 - distToMouse / worldMouseRadius) * 1.5;
      } else {
        particle.hoverScale += (1 - particle.hoverScale) * 0.08;
      }
      
      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      
      // Return to origin slowly
      particle.vx += (particle.originX - particle.x) * 0.001;
      particle.vy += (particle.originY - particle.y) * 0.001;
      
      // Floating motion
      particle.x += Math.sin(time * 0.4 + particle.pulsePhase) * 0.015;
      particle.y += Math.cos(time * 0.3 + particle.pulsePhase) * 0.015;
      
      // Twinkle effect - soft glow pulsing
      const twinkle = 0.7 + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.3;
      const finalScale = particle.radius * particle.hoverScale * twinkle * 0.5;
      
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
  });

  // Set particle colors
  React.useEffect(() => {
    if (meshRef.current) {
      particles.forEach((_, i) => {
        meshRef.current!.setColorAt(i, particleColors[i]);
      });
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [particles, particleColors]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial 
        map={glowTexture}
        transparent 
        opacity={0.9}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

const AntiGravity: React.FC<AntigravityProps> = props => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 50], fov: 35 }}
        style={{ pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <AntigravityInner {...props} />
      </Canvas>
    </div>
  );
};

export default AntiGravity;
