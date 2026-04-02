<<<<<<< HEAD
import { ReactNode } from 'react';
import clsx from 'clsx';

// Button variants helper
function getButtonVariant(variant: string, size: string) {
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20',
    outline: 'border-2 border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground font-bold',
  };

  const sizes: Record<string, string> = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  return clsx(
    'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
    variants[variant] || variants.default,
    sizes[size] || sizes.md
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'default', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button className={clsx(getButtonVariant(variant, size), className)} {...props} />
  );
}

// Card Component
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white border border-border rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-primary/20', className)}>
      {children}
    </div>
  );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-black text-foreground uppercase tracking-widest ml-1">{label}</label>}
      <input
        {...props}
        className={clsx(
          'rounded-xl border border-border bg-muted/30 px-5 py-3.5 text-sm text-foreground font-bold placeholder:text-foreground/30 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary',
          error && 'border-destructive focus:ring-destructive/50'
        )}
      />
      {error && <span className="mt-1 text-xs text-destructive font-bold ml-1">{error}</span>}
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-foreground border-border',
    success: 'bg-green-500/10 text-green-700 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
    error: 'bg-red-500/10 text-red-700 border-red-500/30',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest', variants[variant], className)}>
      {children}
    </span>
  );
}

// Loading Spinner
export function Spinner() {
  return (
    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary"></div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white relative w-full max-w-md rounded-[2rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] animate-in zoom-in-95 duration-300 border border-border">
        <h2 className="mb-8 text-2xl font-black text-foreground tracking-tight">{title}</h2>
        {children}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-foreground/30 hover:text-foreground hover:bg-muted rounded-full transition-all"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

=======
import { ReactNode } from 'react';
import clsx from 'clsx';

// Button variants helper
function getButtonVariant(variant: string, size: string) {
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20',
    outline: 'border-2 border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground font-bold',
  };

  const sizes: Record<string, string> = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  return clsx(
    'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
    variants[variant] || variants.default,
    sizes[size] || sizes.md
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'default', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button className={clsx(getButtonVariant(variant, size), className)} {...props} />
  );
}

// Card Component
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white border border-border rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-primary/20', className)}>
      {children}
    </div>
  );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-black text-foreground uppercase tracking-widest ml-1">{label}</label>}
      <input
        {...props}
        className={clsx(
          'rounded-xl border border-border bg-muted/30 px-5 py-3.5 text-sm text-foreground font-bold placeholder:text-foreground/30 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary',
          error && 'border-destructive focus:ring-destructive/50'
        )}
      />
      {error && <span className="mt-1 text-xs text-destructive font-bold ml-1">{error}</span>}
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-foreground border-border',
    success: 'bg-green-500/10 text-green-700 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
    error: 'bg-red-500/10 text-red-700 border-red-500/30',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest', variants[variant], className)}>
      {children}
    </span>
  );
}

// Loading Spinner
export function Spinner() {
  return (
    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary"></div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white relative w-full max-w-md rounded-[2rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] animate-in zoom-in-95 duration-300 border border-border">
        <h2 className="mb-8 text-2xl font-black text-foreground tracking-tight">{title}</h2>
        {children}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-foreground/30 hover:text-foreground hover:bg-muted rounded-full transition-all"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
