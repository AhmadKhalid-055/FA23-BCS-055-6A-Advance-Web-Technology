'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Badge, Spinner } from '@/components/ui';
import { Zap, ShieldCheck, Rocket, Check, Globe, Cpu, ArrowRight, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Package } from '@/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        if (data.success) {
          setPackages(data.data || []);
        }
      } catch (error) {
        console.error('Failed to sync pricing matrix:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <Spinner />
      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] animate-pulse">Establishing Pricing Grid</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in pb-32">
      {/* Packages Header */}
      <div className="relative overflow-hidden pt-24 pb-20 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mx-auto">
            <Zap className="h-3 w-3" />
            Performance Tiers
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mx-auto max-w-4xl">
            Ad-Stream <span className="text-primary italic underline underline-offset-8">Pricing Matrix</span>
          </h1>
          <p className="text-xl text-foreground/60 font-bold max-w-2xl mx-auto leading-relaxed">
            Select your node's performance profile. Higher tiers grant priority algorithmic ranking and permanent featured status in the marketplace grid.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.id} 
              className={`relative flex flex-col p-0 overflow-hidden rounded-[3rem] border-border group transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl ${pkg.is_featured ? 'ring-4 ring-primary shadow-2xl scale-[1.03] z-10 bg-white' : 'bg-white/80'}`}
            >
              {/* Highlight Header */}
              <div className={`h-3 w-full ${pkg.is_featured ? 'bg-primary' : 'bg-muted'}`} />
              
              {pkg.is_featured && (
                <div className="absolute top-8 right-8 rotate-12 group-hover:rotate-0 transition-transform">
                  <Badge variant="default" className="px-6 py-2 rounded-full font-black text-[10px] tracking-widest bg-primary text-white shadow-xl flex items-center gap-2">
                    <Star className="h-3 w-3 fill-white" />
                    MOST DEPLOYED
                  </Badge>
                </div>
              )}

              <div className="p-12 space-y-10 flex-grow">
                <div className="space-y-4">
                   <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{pkg.name} Tier</h3>
                   <div className="flex items-end gap-1">
                      <span className="text-5xl font-black text-foreground">₨{pkg.price}</span>
                      <span className="text-foreground/40 font-bold mb-2">/deployment</span>
                   </div>
                   <p className="text-foreground/50 font-bold text-sm leading-relaxed italic line-clamp-2">
                      “{pkg.description || 'Initialize high-performance nodes in the Ad-Stream marketplace grid.'}”
                   </p>
                </div>

                <div className="space-y-4 pt-10 border-t border-border/50">
                  <div className="flex items-center gap-3 text-sm font-black text-foreground/70">
                    <div className="bg-primary/10 rounded-lg p-1.5"><TrendingUp className="h-4 w-4 text-primary" /></div>
                    Rank Weight: <span className="text-primary">{pkg.weight}x Boosting</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-black text-foreground/70">
                    <div className="bg-primary/10 rounded-lg p-1.5"><Globe className="h-4 w-4 text-primary" /></div>
                    Duration: <span className="text-primary">{pkg.duration_days} Days Live Feed</span>
                  </div>
                  {pkg.is_featured && (
                   <div className="flex items-center gap-3 text-sm font-black text-foreground/70">
                      <div className="bg-primary/10 rounded-lg p-1.5"><Zap className="h-4 w-4 text-primary" /></div>
                      Special Feature: <span className="text-primary uppercase tracking-tighter">Featured Badge Active</span>
                   </div>
                  )}
                </div>

                <div className="space-y-5 pt-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold opacity-70">Cross-Sector Visibility</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold opacity-70">Metadata Optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-bold opacity-70">{pkg.refresh_rule === 'auto' ? 'Auto-Refresh Loop' : 'Manual Maintenance'}</span>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-muted/20 border-t border-border mt-auto">
                 <Link href="/dashboard/client/create-ad">
                    <Button size="lg" className="w-full h-16 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 group hover:scale-[1.05] transition-all">
                       Deploy This Tier
                       <Rocket className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                 </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Support Callout */}
        <div className="mt-32 p-12 bg-white border border-border shadow-2xl rounded-[4rem] text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <h2 className="text-3xl font-black tracking-tight">Need a custom deployment tier?</h2>
           <p className="text-lg text-foreground/50 font-bold max-w-xl mx-auto">
             Contact the platform mainframe for enterprise-level scaling and bulk node synchronization packages.
           </p>
           <div className="pt-6">
              <Link href="/help">
                 <Button variant="outline" size="lg" className="rounded-2xl px-12 font-black border-2 hover:bg-primary/5">
                    Consult Administrator
                 </Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
