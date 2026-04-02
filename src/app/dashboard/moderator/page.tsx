'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import { ShieldCheck, Eye, CheckCircle, XCircle, User, Tag, Clock, ArrowRight, Zap } from 'lucide-react';
import clsx from 'clsx';

interface AdReview {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user?: { name: string, email: string };
  categories?: { name: string };
  ad_media?: { original_url: string }[];
}

export default function ModeratorDashboard() {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  const [queue, setQueue] = useState<AdReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'moderator' && user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.push('/dashboard/client');
      return;
    }

    fetchQueue();
  }, [isAuthenticated, user, router]);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/moderator/review-queue', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setQueue(result.data?.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (adId: string, action: 'approve' | 'reject') => {
    const note = prompt(action === 'reject' ? 'Reason for rejection:' : 'Moderation note (optional):');
    if (action === 'reject' && !note) return;

    try {
      const res = await fetch('/api/moderator/review-queue', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ad_id: adId,
          action,
          note
        })
      });

      const result = await res.json();
      if (result.success) {
        fetchQueue();
      } else {
        alert(result.error || 'Failed to update ad status');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
      <Spinner />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 animate-pulse">Initializing Security Protocol</p>
    </div>
  );

  return (
    <div className="space-y-12 py-12 animate-fade-in text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">Integrity Shield Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            Review <span className="text-primary italic">Queue</span>
          </h1>
          <p className="text-lg text-foreground/60 font-medium italic">
            Monitoring <span className="text-foreground font-black underline decoration-primary/30 decoration-4 underline-offset-4">{queue.length}</span> pending nodes for quality assurance.
          </p>
        </div>
        
        <div className="hidden lg:flex items-center gap-6 text-right">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Active Moderator</p>
            <p className="text-sm font-black text-foreground">{user?.name}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-black text-xl text-primary border border-primary/10">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-white border-border/50 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all border-l-4 border-l-yellow-500">
          <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-600"><Clock className="h-6 w-6" /></div>
          <div>
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Pending Review</p>
            <p className="text-2xl font-black">{queue.length}</p>
          </div>
        </Card>
        <Card className="p-6 bg-white border-border/50 shadow-sm flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all border-l-4 border-l-primary">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary"><CheckCircle className="h-6 w-6" /></div>
          <div>
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Today's Approvals</p>
            <p className="text-2xl font-black">24</p>
          </div>
        </Card>
        <Card className="p-6 bg-white border-border/50 shadow-sm flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all border-l-4 border-l-red-500">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-600"><XCircle className="h-6 w-6" /></div>
          <div>
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Threats Neutralized</p>
            <p className="text-2xl font-black">3</p>
          </div>
        </Card>
      </div>

      {/* Review Nodes Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            Verification Stream
          </h2>
          <div className="h-[1px] flex-grow mx-8 bg-gradient-to-r from-border/50 via-border to-transparent hidden md:block" />
        </div>

        {queue.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {queue.map((ad, index) => (
              <div key={ad.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="p-0 overflow-hidden bg-white border-border/80 shadow-lg hover:shadow-2xl transition-all duration-500 relative group">
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Media Block */}
                    <div className="sm:w-1/3 relative bg-muted overflow-hidden">
                      <img 
                        src={ad.ad_media?.[0]?.original_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"} 
                        alt={ad.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Info Block */}
                    <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge variant="warning" className="font-black px-3">{ad.status}</Badge>
                          <span className="text-[10px] font-mono font-bold text-foreground/30">NODE_ID::{ad.id.slice(0,8)}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{ad.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground/50 uppercase tracking-widest">
                              <User className="h-3 w-3" />
                              {ad.user?.name || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground/50 uppercase tracking-widest">
                              <Tag className="h-3 w-3" />
                              {ad.categories?.name || 'General'}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-foreground/60 font-medium line-clamp-2 italic">
                          "{ad.description}"
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between gap-3">
                        <Button size="sm" variant="outline" className="rounded-xl px-4 font-black text-[10px] border-red-500/30 text-red-600 hover:bg-red-500/5 hover:border-red-500" onClick={() => handleReview(ad.id, 'reject')}>
                          <XCircle className="h-3 w-3 mr-1.5" />
                          Reject
                        </Button>
                        <Button size="sm" className="rounded-xl px-6 font-black text-[10px] shadow-lg shadow-primary/20 bg-primary/90" onClick={() => handleReview(ad.id, 'approve')}>
                          <CheckCircle className="h-3 w-3 mr-1.5" />
                          Approve Node
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative py-24 px-8 rounded-[3rem] border-2 border-dashed border-border/50 flex flex-col items-center text-center space-y-6">
            <div className="bg-muted p-8 rounded-full animate-float">
              <ShieldCheck className="h-12 w-12 text-primary/40" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">All Sectors Clear</h3>
              <p className="text-foreground/60 font-medium max-w-sm mx-auto">No pending nodes detected in the stream. Security protocols are fully synchronized.</p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 text-green-700 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
              Monitoring Live Feed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
