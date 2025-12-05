import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// --- Configuration Types ---
interface Distortion {
  uniforms: Record<string, { value: any }>;
  getDistortion: string;
  getJS?: (progress: number, time: number) => THREE.Vector3;
}

interface Distortions {
  [key: string]: Distortion;
}

interface Colors {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number;
}

export interface HyperspeedOptions {
  onSpeedUp?: (ev: MouseEvent | TouchEvent) => void;
  onSlowDown?: (ev: MouseEvent | TouchEvent) => void;
  distortion?: string | Distortion;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: [number, number];
  lightStickHeight: [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: Colors;
}

interface HyperspeedProps {
  effectOptions?: Partial<HyperspeedOptions>;
}

// --- Default Options ---
const defaultOptions: HyperspeedOptions = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3
  }
};

// --- Shaders ---
const turbulentUniforms = {
  uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
  uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
};

const distortions: Distortions = {
  turbulentDistortion: {
    uniforms: turbulentUniforms,
    getDistortion: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.
        );
      }
    `,
    getJS: (progress: number, time: number) => {
      const uFreq = turbulentUniforms.uFreq.value;
      const uAmp = turbulentUniforms.uAmp.value;
      const getX = (p: number) =>
        Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
        Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;
      const getY = (p: number) =>
        - (Math.sin(Math.PI * p * uFreq.z + time) * 0.5 + 0.5) * uAmp.z -
        Math.pow((Math.sin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)) * 0.5 + 0.5), 5) * uAmp.w;

      const distortion = new THREE.Vector3(
        getX(progress) - getX(progress + 0.007),
        getY(progress) - getY(progress + 0.007),
        0
      );
      const lookAtAmp = new THREE.Vector3(-2, -5, 0);
      const lookAtOffset = new THREE.Vector3(0, 0, -10);
      return distortion.multiply(lookAtAmp).add(lookAtOffset);
    }
  }
};

// Shader Chunks - Access safely
const fogParsFragment = THREE.ShaderChunk ? THREE.ShaderChunk.fog_pars_fragment : '';
const fogFragment = THREE.ShaderChunk ? THREE.ShaderChunk.fog_fragment : '';
const fogParsVertex = THREE.ShaderChunk ? THREE.ShaderChunk.fog_pars_vertex : '';
const fogVertex = THREE.ShaderChunk ? THREE.ShaderChunk.fog_vertex : '';

const carLightsFragment = `
  #define USE_FOG;
  ${fogParsFragment}
  varying vec3 vColor;
  varying vec2 vUv; 
  uniform vec2 uFade;
  void main() {
    vec3 color = vec3(vColor);
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${fogFragment}
  }
`;

const carLightsVertex = `
  #define USE_FOG;
  ${fogParsVertex}
  attribute vec3 aOffset;
  attribute vec3 aMetrics;
  attribute vec3 aColor;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec2 vUv; 
  varying vec3 vColor; 
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;

    transformed.xy *= radius;
    transformed.z *= myLength;

    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${fogVertex}
  }
`;

const roadBaseFragment = `
  #define USE_FOG;
  varying vec2 vUv; 
  uniform vec3 uColor;
  uniform float uTime;
  #include <roadMarkings_vars>
  ${fogParsFragment}
  void main() {
    vec2 uv = vUv;
    vec3 color = vec3(uColor);
    #include <roadMarkings_fragment>
    gl_FragColor = vec4(color, 1.);
    ${fogFragment}
  }
`;

const roadMarkings_vars = `
  uniform float uLanes;
  uniform vec3 uBrokenLinesColor;
  uniform vec3 uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage;
  uniform float uBrokenLinesWidthPercentage;
  uniform float uBrokenLinesLengthPercentage;
  highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
  }
`;

const roadMarkings_fragment = `
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);

  brokenLines = mix(brokenLines, sideLines, uv.x);
`;

const roadFragment = roadBaseFragment
  .replace('#include <roadMarkings_fragment>', roadMarkings_fragment)
  .replace('#include <roadMarkings_vars>', roadMarkings_vars);

const islandFragment = roadBaseFragment
  .replace('#include <roadMarkings_fragment>', '')
  .replace('#include <roadMarkings_vars>', '');

const roadVertex = `
  #define USE_FOG;
  uniform float uTime;
  ${fogParsVertex}
  uniform float uTravelLength;
  varying vec2 vUv; 
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    transformed.y += -1. * distortion.z;  
    
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${fogVertex}
  }
`;

const sideSticksVertex = `
  #define USE_FOG;
  ${fogParsVertex}
  attribute float aOffset;
  attribute vec3 aColor;
  attribute vec2 aMetrics;
  uniform float uTravelLength;
  uniform float uTime;
  varying vec3 vColor;
  mat4 rotationY( in float angle ) {
    return mat4(
      cos(angle),		0,		sin(angle),	0,
      0,		        1.0,	0,			0,
      -sin(angle),	    0,		cos(angle),	0,
      0, 		        0,		0,			1
    );
  }
  #include <getDistortion_vertex>
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x;
    float height = aMetrics.y;

    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);

    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += - uTravelLength + time;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);

    transformed.y += height / 2.;
    transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${fogVertex}
  }
`;

const sideSticksFragment = `
  #define USE_FOG;
  ${fogParsFragment}
  varying vec3 vColor;
  void main(){
    vec3 color = vec3(vColor);
    gl_FragColor = vec4(color,1.);
    ${fogFragment}
  }
`;

// --- Helpers ---
function random(base: number | [number, number]): number {
  if (Array.isArray(base)) {
    return Math.random() * (base[1] - base[0]) + base[0];
  }
  return Math.random() * base;
}

function pickRandom<T>(arr: T | T[]): T {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return arr;
}

function lerp(current: number, target: number, speed = 0.1, limit = 0.001): number {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) {
    change = target - current;
  }
  return change;
}

// --- App Class ---
class App {
  container: HTMLElement;
  options: HyperspeedOptions;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  disposed: boolean;
  
  road: any;
  leftCarLights: any;
  rightCarLights: any;
  leftSticks: any;
  
  fogUniforms: Record<string, { value: any }>;
  fovTarget: number;
  speedUpTarget: number;
  speedUp: number;
  timeOffset: number;

  constructor(container: HTMLElement, options: HyperspeedOptions) {
    this.options = options;
    this.container = container;
    this.disposed = false;

    if (typeof this.options.distortion === 'string') {
       this.options.distortion = distortions[this.options.distortion];
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true
    });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(options.fov, container.offsetWidth / container.offsetHeight, 0.1, 10000);
    this.camera.position.set(0, 8, -5);

    this.scene = new THREE.Scene();
    const fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);
    this.scene.fog = fog;
    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far }
    };

    this.clock = new THREE.Clock();
    this.initWorld();

    this.fovTarget = options.fov;
    this.speedUpTarget = 0;
    this.speedUp = 0;
    this.timeOffset = 0;

    this.tick = this.tick.bind(this);
    this.onResize = this.onResize.bind(this);
    
    window.addEventListener('resize', this.onResize);
    
    // Add interactions
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('mouseout', this.onMouseUp);
    
    this.tick();
  }

  initWorld() {
    const options = this.options;
    this.road = this.createRoad();
    this.leftCarLights = this.createCarLights(
      options.colors.leftCars, 
      options.movingAwaySpeed, 
      new THREE.Vector2(0, 1 - options.carLightsFade), 
      -options.roadWidth/2 - options.islandWidth/2
    );
    this.rightCarLights = this.createCarLights(
      options.colors.rightCars, 
      options.movingCloserSpeed, 
      new THREE.Vector2(1, 0 + options.carLightsFade),
      options.roadWidth/2 + options.islandWidth/2
    );
    this.leftSticks = this.createSticks(-(options.roadWidth + options.islandWidth/2));
  }

  createRoad() {
     const { options } = this;
     const geometry = new THREE.PlaneGeometry(options.roadWidth, options.length, 20, 100);
     const material = new THREE.ShaderMaterial({
        fragmentShader: roadFragment,
        vertexShader: roadVertex,
        side: THREE.DoubleSide,
        uniforms: Object.assign({
           uTravelLength: { value: options.length },
           uColor: { value: new THREE.Color(options.colors.roadColor) },
           uTime: { value: 0 },
           uLanes: { value: options.lanesPerRoad },
           uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
           uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
           uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
           uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
           uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage }
        }, this.fogUniforms, (this.options.distortion as Distortion).uniforms)
     });
     
     this.injectDistortion(material);
     
     const mesh = new THREE.Mesh(geometry, material);
     mesh.rotation.x = -Math.PI / 2;
     mesh.position.z = -options.length / 2;
     mesh.position.x = -options.roadWidth / 2 - options.islandWidth / 2;
     
     const meshRight = mesh.clone();
     meshRight.position.x = options.roadWidth / 2 + options.islandWidth / 2;
     
     const islandGeo = new THREE.PlaneGeometry(options.islandWidth, options.length, 20, 100);
     const islandMat = new THREE.ShaderMaterial({
       fragmentShader: islandFragment,
       vertexShader: roadVertex,
       side: THREE.DoubleSide,
       uniforms: Object.assign({
          uTravelLength: { value: options.length },
          uColor: { value: new THREE.Color(options.colors.islandColor) },
          uTime: { value: 0 }
       }, this.fogUniforms, (this.options.distortion as Distortion).uniforms)
     });
     this.injectDistortion(islandMat);
     const island = new THREE.Mesh(islandGeo, islandMat);
     island.rotation.x = -Math.PI / 2;
     island.position.z = -options.length / 2;

     this.scene.add(mesh, meshRight, island);
     return { update: (t:number) => {
        mesh.material.uniforms.uTime.value = t;
        meshRight.material.uniforms.uTime.value = t;
        island.material.uniforms.uTime.value = t;
     }};
  }

  createCarLights(colors: number[] | number, speed: [number, number], fade: THREE.Vector2, xOffset: number) {
     const { options } = this;
     const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
     const baseGeo = new THREE.TubeGeometry(curve, 25, 1, 8, false);
     const instanced = new THREE.InstancedBufferGeometry().copy(baseGeo as any) as THREE.InstancedBufferGeometry;
     instanced.instanceCount = options.lightPairsPerRoadWay * 2;
     
     const aOffset: number[] = [];
     const aMetrics: number[] = [];
     const aColor: number[] = [];
     
     let colorArray = Array.isArray(colors) ? colors.map(c => new THREE.Color(c)) : [new THREE.Color(colors)];
     const laneWidth = options.roadWidth / options.lanesPerRoad;

     for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
        const radius = random(options.carLightsRadius);
        const len = random(options.carLightsLength);
        const spd = random(speed);
        const lane = i % options.lanesPerRoad;
        const laneX = (lane * laneWidth) - (options.roadWidth / 2) + (laneWidth / 2) + (random(options.carShiftX) * laneWidth);
        const offY = random(options.carFloorSeparation) + radius * 1.3;
        const offZ = -random(options.length);
        const carWidth = random(options.carWidthPercentage) * laneWidth;
        const c = pickRandom(colorArray);
        
        aOffset.push(laneX - carWidth/2, offY, offZ);
        aMetrics.push(radius, len, spd);
        aColor.push(c.r, c.g, c.b);
        aOffset.push(laneX + carWidth/2, offY, offZ);
        aMetrics.push(radius, len, spd);
        aColor.push(c.r, c.g, c.b);
     }

     instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
     instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
     instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

     const mat = new THREE.ShaderMaterial({
        fragmentShader: carLightsFragment,
        vertexShader: carLightsVertex,
        transparent: true,
        blending: THREE.AdditiveBlending, // Key for Glow effect
        uniforms: Object.assign({
          uTime: { value: 0 },
          uTravelLength: { value: options.length },
          uFade: { value: fade }
        }, this.fogUniforms, (this.options.distortion as Distortion).uniforms)
     });
     this.injectDistortion(mat);
     
     const mesh = new THREE.Mesh(instanced, mat);
     mesh.position.x = xOffset;
     this.scene.add(mesh);
     return { update: (t:number) => mat.uniforms.uTime.value = t };
  }

  createSticks(xOffset: number) {
     const { options } = this;
     const geo = new THREE.PlaneGeometry(1, 1);
     const instanced = new THREE.InstancedBufferGeometry().copy(geo as any) as THREE.InstancedBufferGeometry;
     const count = options.totalSideLightSticks;
     instanced.instanceCount = count;
     
     const aOffset: number[] = [];
     const aMetrics: number[] = [];
     const aColor: number[] = [];
     const color = new THREE.Color(options.colors.sticks);
     const stickGap = options.length / (count - 1);

     for(let i=0; i<count; i++) {
        const w = random(options.lightStickWidth);
        const h = random(options.lightStickHeight);
        aOffset.push((i - 1) * stickGap * 2 + stickGap * Math.random());
        aMetrics.push(w, h);
        aColor.push(color.r, color.g, color.b);
     }
     
     instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false));
     instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false));
     instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

     const mat = new THREE.ShaderMaterial({
        fragmentShader: sideSticksFragment,
        vertexShader: sideSticksVertex,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: Object.assign({
          uTime: { value: 0 },
          uTravelLength: { value: options.length }
        }, this.fogUniforms, (this.options.distortion as Distortion).uniforms)
     });
     this.injectDistortion(mat);

     const mesh = new THREE.Mesh(instanced, mat);
     mesh.position.x = xOffset;
     this.scene.add(mesh);
     return { update: (t:number) => mat.uniforms.uTime.value = t };
  }

  injectDistortion(material: THREE.ShaderMaterial) {
     const distortion = this.options.distortion as Distortion;
     material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace('#include <getDistortion_vertex>', distortion.getDistortion);
     };
  }

  onResize() {
     const w = this.container.offsetWidth;
     const h = this.container.offsetHeight;
     this.renderer.setSize(w, h);
     this.camera.aspect = w / h;
     this.camera.updateProjectionMatrix();
  }

  onMouseDown(ev: MouseEvent) {
     if(this.options.onSpeedUp) this.options.onSpeedUp(ev);
     this.fovTarget = this.options.fovSpeedUp;
     this.speedUpTarget = this.options.speedUp;
  }
  
  onMouseUp(ev: MouseEvent) {
     if(this.options.onSlowDown) this.options.onSlowDown(ev);
     this.fovTarget = this.options.fov;
     this.speedUpTarget = 0;
  }

  tick() {
     if (this.disposed) return;
     const delta = this.clock.getDelta();
     const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
     this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
     this.timeOffset += this.speedUp * delta;
     const time = this.clock.elapsedTime + this.timeOffset;

     this.road.update(time);
     this.leftCarLights.update(time);
     this.rightCarLights.update(time);
     if (this.leftSticks) this.leftSticks.update(time);

     const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
     if (Math.abs(fovChange) > 0.01) {
        this.camera.fov += fovChange * delta * 6;
        this.camera.updateProjectionMatrix();
     }

     const distortion = this.options.distortion as Distortion;
     if (distortion.getJS) {
        const dist = distortion.getJS(0.025, time);
        this.camera.lookAt(
           new THREE.Vector3(this.camera.position.x + dist.x, this.camera.position.y + dist.y, this.camera.position.z + dist.z)
        );
     }

     this.renderer.render(this.scene, this.camera);
     requestAnimationFrame(this.tick);
  }

  dispose() {
     this.disposed = true;
     window.removeEventListener('resize', this.onResize);
     this.container.removeEventListener('mousedown', this.onMouseDown);
     this.container.removeEventListener('mouseup', this.onMouseUp);
     this.container.removeEventListener('mouseout', this.onMouseUp);
     this.renderer.dispose();
     this.scene.clear();
  }
}

const Hyperspeed: React.FC<HyperspeedProps> = ({ effectOptions = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);
  const mergedOptions = useMemo(() => ({ ...defaultOptions, ...effectOptions }), [effectOptions]);

  useEffect(() => {
     if (containerRef.current) {
        // Cleanup old app if exists to prevent duplicates on hot reload
        if (appRef.current) appRef.current.dispose();
        // Clear container content
        while (containerRef.current.firstChild) {
           containerRef.current.removeChild(containerRef.current.firstChild);
        }
        appRef.current = new App(containerRef.current, mergedOptions);
     }
     return () => {
        if (appRef.current) appRef.current.dispose();
     };
  }, [mergedOptions]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default Hyperspeed;