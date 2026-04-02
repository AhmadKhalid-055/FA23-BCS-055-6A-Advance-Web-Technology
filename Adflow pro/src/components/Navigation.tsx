'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui';
import { Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'client':
        return '/dashboard/client';
      case 'moderator':
        return '/dashboard/moderator';
      case 'admin':
      case 'super_admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">💼</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              AdFlow<span className="text-primary italic">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6 mr-4">
              <Link href="/explore" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/packages" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
                Packages
              </Link>
              <Link href="/help" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
                Help
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l border-border pl-6">
                <span className="text-sm font-bold text-foreground">{user?.name}</span>
                <Link href={getDashboardLink()}>
                  <Button size="sm" variant="secondary" className="rounded-full px-5 border-border/10 hover:bg-primary/5">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-2 text-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l border-border pl-6">
                <Link href="/auth/login">
                  <span className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors cursor-pointer mr-3">
                    Log In
                  </span>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="rounded-full px-6 shadow-md shadow-primary/10">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border py-6 px-4 space-y-4 rounded-b-2xl shadow-xl animate-in slide-in-from-top duration-300">
            <Link href="/explore" className="block text-base font-bold text-foreground/80 hover:text-primary py-2 text-center">
              Explore Listings
            </Link>
            <Link href="/packages" className="block text-base font-bold text-foreground/80 hover:text-primary py-2 text-center">
              Premium Packages
            </Link>
            <Link href="/help" className="block text-base font-bold text-foreground/80 hover:text-primary py-2 text-center">
              Support Center
            </Link>

            {isAuthenticated ? (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-center space-x-3 px-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="font-bold text-foreground">{user?.name}</span>
                </div>
                <Link href={getDashboardLink()} className="block">
                  <Button size="md" variant="secondary" className="w-full rounded-xl">
                    Go to Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => logout()}
                  className="block w-full py-3 text-center text-sm font-bold text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3 border-t border-border pt-4">
                <Link href="/auth/login" className="block">
                  <Button size="md" variant="outline" className="w-full rounded-xl font-bold">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button size="md" className="w-full rounded-xl font-bold">
                    Join Marketplace
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
