
import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2, Users, ShoppingBag, Sun, Moon, ArrowRight,
  Twitter, Github, Linkedin, Facebook, Globe, Shield,
  CheckCircle2, Play, Layout, Image as ImageIcon,
  MoreHorizontal, Sparkles, Zap, Command, Crown, Briefcase, Building2, Star, Check
} from 'lucide-react';
import { Button, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Galaxy from './Galaxy';
import { ScrollReveal } from './ScrollReveal';
import TrueFocus from './TrueFocus';
import LogoLoop, { LogoItem } from './LogoLoop';
import ClickSpark from './ClickSpark';
import { PLANS, PlanType } from '../../types/subscription';

// Partner company logos as SVG nodes for professional look
const partnerLogos: LogoItem[] = [
  {
    node: (
      <svg viewBox="0 0 76 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <path d="M15.5 0L31 24H0L15.5 0Z" />
        <text x="36" y="18" fontSize="14" fontWeight="700" fontFamily="system-ui">Vercel</text>
      </svg>
    ),
    title: 'Vercel'
  },
  {
    node: (
      <svg viewBox="0 0 100 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <circle cx="12" cy="12" r="10" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">OpenAI</text>
      </svg>
    ),
    title: 'OpenAI'
  },
  {
    node: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Figma</text>
      </svg>
    ),
    title: 'Figma'
  },
  {
    node: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Stripe</text>
      </svg>
    ),
    title: 'Stripe'
  },
  {
    node: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Linear</text>
      </svg>
    ),
    title: 'Linear'
  },
  {
    node: (
      <svg viewBox="0 0 90 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Raycast</text>
      </svg>
    ),
    title: 'Raycast'
  },
  {
    node: (
      <svg viewBox="0 0 90 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14z" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Shopify</text>
      </svg>
    ),
    title: 'Shopify'
  },
  {
    node: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Notion</text>
      </svg>
    ),
    title: 'Notion'
  },
  {
    node: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Framer</text>
      </svg>
    ),
    title: 'Framer'
  },
  {
    node: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="h-6 text-white/70 hover:text-white transition-colors">
        <path d="M2 12h20M12 2v20" strokeWidth="3" stroke="currentColor" />
        <text x="28" y="17" fontSize="14" fontWeight="700" fontFamily="system-ui">Supabase</text>
      </svg>
    ),
    title: 'Supabase'
  }
];

// --- ANIMATED COUNTER COMPONENT ---
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  decimals = 0 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = easeOutQuart * end;
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toString();

  return (
    <span ref={counterRef}>
      {prefix}{displayValue}{suffix}
    </span>
  );
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

// --- MAIN LANDING PAGE ---

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const { trans, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <ClickSpark
      sparkColors={['#EC4899', '#A855F7', '#3B82F6']} // Pink, Purple, Blue - gradient colors
      sparkSize={12}
      sparkRadius={30}
      sparkCount={12}
      duration={500}
      easing="ease-out"
      extraScale={1.3}
    >
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white selection:bg-repix-500/30 font-sans relative">
      
      {/* GALAXY BACKGROUND - Fixed full screen */}
      <div className="fixed inset-0 z-0">
        <Galaxy
          density={0.7}
          speed={0.5}
          colors={['#A855F7', '#EC4899', '#3B82F6']} // Tím, Hồng, Xanh dương
          glowIntensity={0.4}
          saturation={1}
          twinkleIntensity={1}
          rotationSpeed={0.1}
          mouseInteraction={true}
          mouseRepulsion={true}
          repulsionStrength={5}
          transparent={false}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
         {/* Hero Content */}
         <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
           {/* Main Heading with TrueFocus Animation */}
           <div 
             className="max-w-5xl mb-8 opacity-0"
             style={{ animation: 'fadeSlideUp 0.8s ease-out 0.4s forwards' }}
           >
             <TrueFocus
               sentence={`${trans.landing.heroTitle} ${trans.landing.heroTitleHighlight}`}
               manualMode={false}
               blurAmount={5}
               borderColor="#EC4899"
               animationDuration={0.6}
               pauseBetweenAnimations={0.5}
               highlightLastWord={true}
               highlightGradient="linear-gradient(to right, #EC4899, #A855F7, #3B82F6)"
               className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white"
             />
           </div>

           {/* Description */}
           <p 
             className="max-w-2xl text-lg md:text-xl text-white/70 mb-10 leading-relaxed opacity-0"
             style={{ animation: 'fadeSlideUp 0.8s ease-out 0.6s forwards' }}
           >
             {trans.landing.heroDesc}
           </p>

           {/* CTA Buttons */}
           <div 
             className="flex flex-col sm:flex-row items-center gap-4 opacity-0"
             style={{ animation: 'fadeSlideUp 0.8s ease-out 0.8s forwards' }}
           >
             <Button 
               size="lg" 
               className="animated-border rounded-full h-14 px-8 text-lg shadow-xl shadow-repix-500/20"
               onClick={onSignup}
             >
               {trans.landing.cta} <ArrowRight size={18} className="ml-2" />
             </Button>
             <Button 
               size="lg" 
               variant="secondary" 
               className="rounded-full h-14 px-8 text-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
             >
               <Play size={18} className="mr-2" /> {trans.landing.watchDemo}
             </Button>
           </div>
         </div>
      </section>

      {/* --- FLOATING NAVBAR --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-6xl h-20 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-between px-4 pl-8 shadow-xl shadow-black/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-repix-500 to-accent-blue flex items-center justify-center shadow-lg shadow-repix-500/20">
               <Sun size={20} className="text-white fill-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Repix</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-base font-medium text-zinc-600 dark:text-zinc-400">
             <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.features}</a>
             <a href="#templates" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.marketplace}</a>
             <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.pricing}</a>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={toggleLanguage} 
               className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-colors border border-zinc-300 dark:border-white/20"
             >
               <Globe size={16} />
               <span className="text-sm font-bold">{language === 'vi' ? 'VI' : 'EN'}</span>
             </button>
             <div className="h-6 w-px bg-zinc-300 dark:bg-white/10"></div>
             {/* Try Repix CTA Button - Goes to Login */}
             <Button 
                onClick={onLogin} 
                variant="primary"
                size="lg" 
                className="animated-border rounded-full px-10 h-12 text-lg font-extrabold shadow-xl shadow-repix-500/30 hover:shadow-repix-500/50 transition-all"
             >
               {trans.nav.getStarted}
             </Button>
          </div>
        </div>
      </nav>

      {/* REST OF PAGE - Transparent backgrounds to show AntiGravity */}
      <div className="relative">

      {/* --- TRUSTED BY MARQUEE --- */}
      <section className="py-8 border-y border-white/10 dark:border-white/5 bg-black/60 backdrop-blur-md relative z-10">
         <p className="text-center text-xs uppercase tracking-[0.2em] text-zinc-500 mb-6">
           {trans.landing.trustedBy}
         </p>
         <LogoLoop
           logos={partnerLogos}
           speed={60}
           direction="left"
           logoHeight={32}
           gap={64}
           pauseOnHover={true}
           fadeOut={true}
           fadeOutColor="rgba(0,0,0,0.9)"
           scaleOnHover={true}
           ariaLabel="Trusted by leading companies"
         />
      </section>

      {/* --- FEATURES (BENTO GRID) --- */}
      <section id="features" className="py-32 px-6 relative z-10 bg-black/70 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="mb-20">
                 <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">{trans.landing.featuresTitle} <br/> <span className="text-zinc-400">{trans.landing.featuresTitleHighlight}</span></h2>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
               
               {/* Card 1: Large (Span 2) */}
               <ScrollReveal delay={0} className="md:col-span-2 md:row-span-2">
                 <BentoCard 
                    title={trans.landing.genFillTitle}
                    desc={trans.landing.genFillDesc}
                    icon={Wand2}
                    className="h-full bg-zinc-100 dark:bg-zinc-900"
                    graphic={
                       <div className="relative h-64 w-full rounded-xl overflow-hidden mt-4 border border-black/5 dark:border-white/5 shadow-lg group">
                          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-mono border border-black/5 dark:border-white/10 shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                                {trans.landing.genFillPrompt}
                             </div>
                          </div>
                       </div>
                    }
                 />
               </ScrollReveal>

               {/* Card 2: Tall (Span 1) */}
               <ScrollReveal delay={100} className="md:col-span-1 md:row-span-2">
                 <BentoCard 
                    title={trans.landing.realtimeSyncTitle}
                    desc={trans.landing.realtimeSyncDesc}
                    icon={Users}
                    className="h-full"
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
               </ScrollReveal>

               {/* Card 3: Standard */}
               <ScrollReveal delay={200}>
                 <BentoCard 
                    title={trans.landing.edgeNetworkTitle}
                    desc={trans.landing.edgeNetworkDesc}
                    icon={Globe}
                    className="h-full"
                 />
               </ScrollReveal>

               {/* Card 4: Standard */}
               <ScrollReveal delay={300}>
                 <BentoCard 
                    title={trans.landing.marketplaceTitle}
                    desc={trans.landing.marketplaceDesc}
                    icon={ShoppingBag}
                    className="h-full"
                 />
               </ScrollReveal>

               {/* Card 5: Wide */}
               <ScrollReveal delay={400} className="md:col-span-3">
                 <BentoCard 
                    title={trans.landing.securityTitle}
                    desc={trans.landing.securityDesc}
                    icon={Shield}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-black"
                    graphic={
                       <div className="flex gap-8 mt-4 opacity-50">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16}/> {trans.landing.soc2}</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16}/> {trans.landing.gdpr}</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16}/> {trans.landing.uptime}</div>
                     </div>
                  }
                 />
               </ScrollReveal>
            </div>
         </div>
      </section>

      {/* --- GLOBAL SCALE SECTION --- */}
      <section className="py-32 bg-black/80 text-white relative overflow-hidden backdrop-blur-sm">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <ScrollReveal>
              <Badge variant="pro" className="mb-6 bg-repix-500/20 text-repix-300 border-repix-500/30">{trans.landing.globalScale}</Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">{trans.landing.deployedToEdge}</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-16">
                 {trans.landing.globalScaleDesc}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                 <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-2">
                       <AnimatedCounter end={150} duration={2000} suffix="+" />
                    </div>
                    <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{trans.landing.edgeLocations}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-2">
                       <AnimatedCounter end={99.99} duration={2500} suffix="%" decimals={2} />
                    </div>
                    <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{trans.landing.uptimeSLA}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-2">
                       <AnimatedCounter end={50} duration={1800} prefix="< " suffix="ms" />
                    </div>
                    <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{trans.landing.globalLatency}</div>
                 </div>
                 <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 mb-2">
                       <AnimatedCounter end={2} duration={2000} suffix="M+" />
                    </div>
                    <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{trans.landing.dailyAssets}</div>
                 </div>
              </div>
            </ScrollReveal>
         </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 px-6 relative z-10 bg-black/70 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                 <Badge variant="pro" className="mb-4">{trans.landing.pricing}</Badge>
                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {trans.landing.pricingTitle}
                 </h2>
                 <p className="text-zinc-400 max-w-xl mx-auto text-lg">
                    {trans.landing.pricingDesc}
                 </p>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 px-4">
               {/* Free Plan */}
               <ScrollReveal delay={0}>
               <div className="group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500 bg-white/90 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:border-repix-500/30 hover:shadow-repix-500/10 backdrop-blur-sm">
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                           <Zap size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{language === 'vi' ? PLANS.free.nameVi : PLANS.free.name}</h3>
                           <p className="text-xs font-medium text-zinc-400">{language === 'vi' ? PLANS.free.taglineVi : PLANS.free.tagline}</p>
                        </div>
                     </div>
                     <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Free</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{PLANS.free.credits} credits/month</p>
                     </div>
                     <div className="space-y-4 mb-8 flex-1">
                        {PLANS.free.features.slice(0, 4).map((feat, idx) => (
                           <div key={idx} className="flex items-start gap-3 group/item">
                              <div className="mt-0.5 p-0.5 rounded-full bg-repix-100 dark:bg-repix-900/30">
                                 <Check size={12} className="shrink-0 text-repix-600 dark:text-repix-400" />
                              </div>
                              <span className="text-sm transition-colors text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">{language === 'vi' ? feat.textVi : feat.text}</span>
                           </div>
                        ))}
                     </div>
                     <Button variant="outline" className="w-full h-12 rounded-xl font-bold transition-transform duration-300 group-hover:scale-[1.02] active:scale-95 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:border-zinc-700" onClick={onSignup}>
                        {language === 'vi' ? 'Bắt đầu miễn phí' : 'Get Started Free'}
                     </Button>
                  </div>
               </div>
               </ScrollReveal>

               {/* Plus Plan - Highlighted */}
               <ScrollReveal delay={100}>
               <div className="group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 scale-105 z-10 shadow-2xl shadow-purple-500/30">
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full group-hover:bg-pink-500/30 transition-colors duration-500"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-purple-500/30 transition-colors duration-500"></div>
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                     <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                        <Star size={12} fill="currentColor" /> {PLANS.plus.badge}
                     </div>
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 bg-white/10 dark:bg-zinc-900/10 text-white dark:text-zinc-900">
                           <Sparkles size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-white dark:text-zinc-900">{language === 'vi' ? PLANS.plus.nameVi : PLANS.plus.name}</h3>
                           <p className="text-xs font-medium text-white/60 dark:text-zinc-500">{language === 'vi' ? PLANS.plus.taglineVi : PLANS.plus.tagline}</p>
                        </div>
                     </div>
                     <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-extrabold tracking-tight text-white dark:text-zinc-900">${PLANS.plus.price}</span>
                           <span className="text-sm font-medium text-white/60 dark:text-zinc-500">/month</span>
                        </div>
                        <p className="text-xs text-white/50 dark:text-zinc-500 mt-1">{PLANS.plus.credits} credits/month</p>
                     </div>
                     <div className="space-y-4 mb-8 flex-1">
                        {PLANS.plus.features.slice(0, 6).map((feat, idx) => (
                           <div key={idx} className="flex items-start gap-3 group/item">
                              <div className="mt-0.5 p-0.5 rounded-full bg-white/20 dark:bg-zinc-900/10">
                                 <Check size={12} className="shrink-0 text-white dark:text-zinc-900" />
                              </div>
                              <span className="text-sm transition-colors text-white/80 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-zinc-900">{language === 'vi' ? feat.textVi : feat.text}</span>
                           </div>
                        ))}
                     </div>
                     <Button className="w-full h-12 rounded-xl font-bold transition-transform duration-300 group-hover:scale-[1.02] active:scale-95 bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 border-0 shadow-lg" onClick={onSignup}>
                        {language === 'vi' ? `Nâng cấp lên ${PLANS.plus.name}` : `Upgrade to ${PLANS.plus.name}`}
                     </Button>
                  </div>
               </div>
               </ScrollReveal>

               {/* Pro Plan */}
               <ScrollReveal delay={200}>
               <div className="group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500 bg-white/90 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:border-amber-500/30 hover:shadow-amber-500/10 backdrop-blur-sm">
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 bg-amber-100 dark:bg-amber-900/30 text-amber-500">
                           <Crown size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{language === 'vi' ? PLANS.pro.nameVi : PLANS.pro.name}</h3>
                           <p className="text-xs font-medium text-zinc-400">{language === 'vi' ? PLANS.pro.taglineVi : PLANS.pro.tagline}</p>
                        </div>
                     </div>
                     <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">${PLANS.pro.price}</span>
                           <span className="text-sm font-medium text-zinc-500">/month</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{PLANS.pro.credits} credits/month</p>
                     </div>
                     <div className="space-y-4 mb-8 flex-1">
                        {PLANS.pro.features.slice(0, 6).map((feat, idx) => (
                           <div key={idx} className="flex items-start gap-3 group/item">
                              <div className="mt-0.5 p-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                                 <Check size={12} className="shrink-0 text-amber-600 dark:text-amber-400" />
                              </div>
                              <span className="text-sm transition-colors text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">{language === 'vi' ? feat.textVi : feat.text}</span>
                           </div>
                        ))}
                     </div>
                     <Button variant="outline" className="w-full h-12 rounded-xl font-bold transition-transform duration-300 group-hover:scale-[1.02] active:scale-95 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400" onClick={onSignup}>
                        {language === 'vi' ? `Nâng cấp lên ${PLANS.pro.name}` : `Upgrade to ${PLANS.pro.name}`}
                     </Button>
                  </div>
               </div>
               </ScrollReveal>

               {/* Team Plan */}
               <ScrollReveal delay={300}>
               <div className="group relative rounded-3xl p-8 flex flex-col h-full transition-all duration-500 bg-white/90 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-xl hover:border-blue-500/30 hover:shadow-blue-500/10 backdrop-blur-sm">
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                           <Building2 size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{language === 'vi' ? PLANS.team.nameVi : PLANS.team.name}</h3>
                           <p className="text-xs font-medium text-zinc-400">{language === 'vi' ? PLANS.team.taglineVi : PLANS.team.tagline}</p>
                        </div>
                     </div>
                     <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                           <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{language === 'vi' ? 'Liên hệ' : 'Custom'}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{language === 'vi' ? 'Credits không giới hạn' : 'Unlimited credits'}</p>
                     </div>
                     <div className="space-y-4 mb-8 flex-1">
                        {PLANS.team.features.slice(0, 6).map((feat, idx) => (
                           <div key={idx} className="flex items-start gap-3 group/item">
                              <div className="mt-0.5 p-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                 <Check size={12} className="shrink-0 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm transition-colors text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">{language === 'vi' ? feat.textVi : feat.text}</span>
                           </div>
                        ))}
                     </div>
                     <Button variant="outline" className="w-full h-12 rounded-xl font-bold transition-transform duration-300 group-hover:scale-[1.02] active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                        {language === 'vi' ? 'Liên hệ tư vấn' : 'Contact Sales'}
                     </Button>
                  </div>
               </div>
               </ScrollReveal>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black/90 border-t border-white/10 pt-20 pb-10 relative z-10 backdrop-blur-sm">
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
                     {trans.landing.footerDesc}
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
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-6">{trans.landing.product}</h4>
                  <ul className="space-y-4 text-sm">
                     <li><a href="#features" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.features}</a></li>
                     <li><a href="#templates" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.marketplace}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.enterprise}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.changelog}</a></li>
                     <li><a href="#pricing" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.pricing}</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-6">{trans.landing.resources}</h4>
                  <ul className="space-y-4 text-sm">
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.documentation}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.apiReference}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.community}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.helpCenter}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.partners}</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-6">{trans.landing.company}</h4>
                  <ul className="space-y-4 text-sm">
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.about}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.careers}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.blog}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.contact}</a></li>
                     <li><a href="#" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">{trans.landing.legal}</a></li>
                  </ul>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-sm text-zinc-500 dark:text-zinc-500">© 2024 Repix Inc. {trans.landing.allRightsReserved}</p>
               <div className="flex gap-8 text-sm text-zinc-500 dark:text-zinc-500">
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">{trans.landing.privacyPolicy}</a>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">{trans.landing.termsOfService}</a>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span>{trans.landing.allSystemsOperational}</span>
                  </div>
               </div>
            </div>
         </div>
      </footer>
      </div>{/* End of AntiGravity wrapper */}
    </div>
    </ClickSpark>
  );
};
