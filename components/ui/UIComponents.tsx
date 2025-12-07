import React from 'react';
import { Loader2 } from 'lucide-react';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', ...props 
}) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative z-10";
  
  const variants = {
    // Gradient Pink -> Purple -> Blue
    primary: "bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue text-white hover:opacity-90 shadow-lg shadow-repix-500/25 border-0 animated-border",
    // Secondary needs specific BG to hide the animated border center if applied
    secondary: "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    ghost: "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white",
    destructive: "bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70 border dark:border-red-900",
    outline: "border border-zinc-300 bg-transparent hover:bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-100 animated-border"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  animated?: boolean;
}

export const Input: React.FC<InputProps> = ({ className = '', animated = false, ...props }) => {
  const baseStyles = "flex h-10 w-full rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-repix-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 text-sm px-3 py-2 transition-all";

  if (animated) {
    return (
      <div className="relative group animated-border rounded-md">
        {/* The input must have a background color to act as a mask for the border */}
        <input 
          className={`${baseStyles} border-transparent dark:border-transparent focus-visible:ring-0 relative z-10 ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <input 
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

// Slider
interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, min = 0, max = 100, onChange, label }) => (
  <div className="w-full space-y-2">
    {label && <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400"><span>{label}</span><span>{value}</span></div>}
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-repix-500"
    />
  </div>
);

// Badge
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'pro'; className?: string }> = ({ children, variant = 'default', className = '' }) => {
  const styles = variant === 'pro' 
    ? "bg-gradient-to-r from-pink-500 to-repix-600 text-white font-bold shadow-sm"
    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${styles} ${className}`}>
      {children}
    </span>
  );
};

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 ${className}`}
  >
    {children}
  </div>
);