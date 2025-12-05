import React from 'react';
import { 
  Wand2, Users, ShoppingBag, Sun, Moon, ArrowRight, 
  Twitter, Github, Linkedin, Facebook, Globe, Shield, 
  CheckCircle2, Play
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Hyperspeed, { HyperspeedOptions } from './Hyperspeed';

// Configuration for the Hyperspeed background
const hyperspeedColors: Partial<HyperspeedOptions> = {
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xFF00C7, 0xFF00FF, 0xFF55FF], 
    rightCars: [0x00FFFF, 0x55FFFF, 0x00AAFF],
    sticks: 0x00FFFF 
  },
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 14,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 1.3,
  carLightsFade: 0.4,
  totalSideLightSticks: 50,
  lightPairsPerRoadWay: 30,
  shoulderLinesWidthPercentage: 0.08,
  brokenLinesWidthPercentage: 0.15,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.3],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [20, 50],
  movingCloserSpeed: [-150, -230],
  carLightsLength: [400 * 0.05, 400 * 0.15],
  carLightsRadius: [0.08, 0.18],
  carWidthPercentage: [0.2, 0.4],
  carShiftX: [-0.5, 0.5],
  carFloorSeparation: [0.05, 1],
};

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

// --- SUB-COMPONENTS FOR MODERN UI ---

const BentoCard: React.FC<{ 
  title: string; 
  desc: string; 
  icon: React.ElementType; 
  className?: string;
  graphic?: React.ReactNode;
  delay?: string;
}> = ({ title, desc, icon: Icon, className = "", graphic, delay = "0ms" }) => (
  <div 
    className={`group relative overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 p-8 hover:border-repix-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-repix-500/10 flex flex-col ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-6 w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
        <Icon size={24} className="text-zinc-900 dark:text-white" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm">{desc}</p>
      {graphic && <div className="mt-auto w-full">{graphic}</div>}
    </div>
    
    {/* Hover Gradient BG */}
    <div className="absolute inset-0 bg-gradient-to-br from-repix-500/0 via-repix-500/0 to-repix-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
  </div>
);

const MarqueeItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 mx-8 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default">
    <Globe size={20} />
    <span className="text-lg font-bold tracking-tight">{text}</span>
  </div>
);

// --- MAIN LANDING PAGE ---

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const { trans, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white selection:bg-repix-500/30 font-sans">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Hyperspeed only visible in Hero, fades out as you scroll */}
         <div className="absolute inset-0 h-[100vh] opacity-30 dark:opacity-80 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
             <Hyperspeed effectOptions={hyperspeedColors} />
         </div>
         {/* Global Grain/Noise Texture */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- FLOATING NAVBAR --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-5xl h-14 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-between px-2 pl-6 shadow-xl shadow-black/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-repix-600 flex items-center justify-center">
               <Sun size={14} className="text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Repix</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
             <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
             <a href="#templates" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Marketplace</a>
             <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-colors">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <div className="h-4 w-px bg-zinc-300 dark:bg-white/10"></div>
             <Button variant="ghost" onClick={onLogin} size="sm" className="hidden sm:inline-flex hover:bg-transparent hover:text-repix-500 font-semibold">{trans.nav.login}</Button>
             <Button onClick={onSignup} size="sm" className="rounded-full px-5 h-9 text-xs font-bold shadow-lg shadow-repix-500/20 bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-white dark:text-black">{trans.nav.getStarted}</Button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden flex flex-col items-center text-center z-10">
        
        {/* Announcement Pill */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md text-xs font-medium mb-8 cursor-pointer hover:border-repix-500/50 transition-colors group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-zinc-600 dark:text-zinc-300">Repix 2.0 is now available globally</span>
              <ArrowRight size={12} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
           </div>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 drop-shadow-2xl">
           <span className="bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
             Create at the speed of
           </span>
           <br />
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue animate-gradient-x">
             Imagination
           </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
           The first AI-native photo editor designed for high-performance teams. 
           Real-time collaboration, generative assets, and global edge delivery.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
           <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-2xl shadow-repix-500/40 hover:scale-105 transition-transform" onClick={onSignup}>
              Start Creating <ArrowRight className="ml-2" />
           </Button>
           <Button size="lg" variant="secondary" className="rounded-full h-14 px-8 text-lg bg-white/80 dark:bg-white/10 backdrop-blur-md border border-zinc-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/20">
              <Play size={18} className="mr-2" /> Watch Demo
           </Button>
        </div>

        {/* Floating App Preview */}
        <div className="mt-20 w-full max-w-6xl relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
           <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue rounded-xl blur opacity-30 animate-pulse"></div>
           <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-sm aspect-[16/9] group">
              <img src="https://picsum.photos/seed/interface/1920/1080" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]" alt="Interface" />
              
              {/* Floating UI Elements Mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-10 h-10 rounded-full bg-repix-500 flex items-center justify-center text-white"><Wand2 size={20}/></div>
                  <div>
                     <div className="h-2 w-24 bg-white/20 rounded-full mb-2"></div>
                     <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/30">Processing</div>
              </div>
           </div>
        </div>
      </section>

      {/* --- TRUSTED BY MARQUEE --- */}
      <section className="py-12 border-y border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-sm overflow-hidden relative z-10">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10"></div>
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10"></div>
         
         <div className="flex animate-[scroll_30s_linear_infinite] w-max">
            {/* Repeat list twice for seamless loop */}
            {[...Array(2)].map((_, i) => (
               <React.Fragment key={i}>
                  {['ACME Corp', 'Vercel', 'Linear', 'Stripe', 'Raycast', 'OpenAI', 'Figma', 'Shopify'].map(brand => (
                     <MarqueeItem key={brand} text={brand} />
                  ))}
               </React.Fragment>
            ))}
         </div>
      </section>

      {/* --- FEATURES (BENTO GRID) --- */}
      <section id="features" className="py-32 px-6 relative z-10 bg-white dark:bg-black">
         <div className="max-w-7xl mx-auto">
            <div className="mb-20">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need to <br/> <span className="text-zinc-400">ship creative work faster.</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
               
               {/* Card 1: Large (Span 2) */}
               <BentoCard 
                  title="Generative Fill 2.0"
                  desc="Remove objects, expand backgrounds, and generate assets with simple text prompts. Powered by our proprietary low-latency models."
                  icon={Wand2}
                  className="md:col-span-2 md:row-span-2 bg-zinc-100 dark:bg-zinc-900"
                  graphic={
                     <div className="relative h-64 w-full rounded-xl overflow-hidden mt-4 border border-black/5 dark:border-white/5 shadow-lg group">
                        <img src="https://picsum.photos/seed/genfill/800/400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-mono border border-black/5 dark:border-white/10 shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                              /imagine prompt: cyberpunk city
                           </div>
                        </div>
                     </div>
                  }
               />

               {/* Card 2: Tall (Span 1) */}
               <BentoCard 
                  title="Real-time Sync"
                  desc="Multiplayer editing with 0ms lag. See cursors, comments, and changes instantly."
                  icon={Users}
                  className="md:col-span-1 md:row-span-2"
                  graphic={
                     <div className="relative h-full min-h-[200px] w-full mt-4 flex items-center justify-center">
                        <div className="absolute w-32 h-32 bg-repix-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative z-10 grid grid-cols-2 gap-2">
                           {[1,2,3,4].map(n => (
                              <div key={n} className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 flex items-center justify-center">
                                 <div className={`w-3 h-3 rounded-full ${n===1?'bg-green-500':n===2?'bg-blue-500':'bg-zinc-500'}`}></div>
                              </div>
                           ))}
                        </div>
                     </div>
                  }
               />

               {/* Card 3: Standard */}
               <BentoCard 
                  title="Global Edge Network"
                  desc="Assets are cached in 150+ regions for lightning fast loading times."
                  icon={Globe}
                  className=""
               />

               {/* Card 4: Standard */}
               <BentoCard 
                  title="Asset Marketplace"
                  desc="Access thousands of community-made templates and presets."
                  icon={ShoppingBag}
                  className=""
               />

               {/* Card 5: Wide */}
               <BentoCard 
                  title="Enterprise Security"
                  desc="SSO, Audit Logs, and Role-based access control built-in."
                  icon={Shield}
                  className="md:col-span-3 bg-zinc-900 text-white dark:bg-white dark:text-black"
                  graphic={
                     <div className="flex gap-8 mt-4 opacity-50">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16}/> SOC2 Compliant</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16}/> GDPR Ready</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16}/> 99.99% Uptime</div>
                     </div>
                  }
               />
            </div>
         </div>
      </section>

      {/* --- GLOBAL SCALE SECTION --- */}
      <section className="py-32 bg-zinc-950 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <Badge variant="pro" className="mb-6 bg-repix-500/20 text-repix-300 border-repix-500/30">Global Scale</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Deployed to the Edge.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-16">
               Your creative assets shouldn't be slowed down by geography. Repix intelligently routes traffic to the nearest edge node for instant performance.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
               {[
                  { label: "Edge Locations", value: "150+" },
                  { label: "Uptime SLA", value: "99.99%" },
                  { label: "Global Latency", value: "< 50ms" },
                  { label: "Daily Assets", value: "2M+" },
               ].map((stat, i) => (
                  <div key={i} className="text-center">
                     <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-2">{stat.value}</div>
                     <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10 relative z-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
               {/* Brand Column */}
               <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
                        <Sun size={18} className="text-white dark:text-black fill-current" />
                     </div>
                     <span className="font-bold text-xl text-zinc-900 dark:text-white">Repix AI</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed max-w-xs">
                     The operating system for modern creative teams. Design, collaborate, and ship faster than ever.
                  </p>
                  <div className="flex gap-4">
                     {[Github, Twitter, Linkedin, Facebook].map((Icon, i) => (
                        <button key={i} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
                           <Icon size={18} />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Links Columns */}
               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Product</h4>
                  <ul className="space-y-4 text-sm">
                     {['Features', 'Marketplace', 'Enterprise', 'Changelog', 'Pricing'].map(item => (
                        <li key={item}>
                           <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{item}</a>
                        </li>
                     ))}
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Resources</h4>
                  <ul className="space-y-4 text-sm">
                     {['Documentation', 'API Reference', 'Community', 'Help Center', 'Partners'].map(item => (
                        <li key={item}>
                           <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{item}</a>
                        </li>
                     ))}
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Company</h4>
                  <ul className="space-y-4 text-sm">
                     {['About', 'Careers', 'Blog', 'Contact', 'Legal'].map(item => (
                        <li key={item}>
                           <a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{item}</a>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-sm text-zinc-500 dark:text-zinc-500">© 2024 Repix Inc. All rights reserved.</p>
               <div className="flex gap-8 text-sm text-zinc-500 dark:text-zinc-500">
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Terms of Service</a>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span>All Systems Operational</span>
                  </div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};