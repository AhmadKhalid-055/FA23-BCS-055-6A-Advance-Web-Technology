'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Badge, Spinner } from '@/components/ui';
import { MapPin, Tag, Clock, ChevronLeft, ShieldCheck, Zap, Globe, MessageSquare, AlertTriangle, User } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function AdDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/ads/${slug}`);
        const result = await res.json();
        
        if (result.success) {
          setAd(result.data);
        } else {
          setError('Marketplace Node Not Found or Decommissioned');
        }
      } catch (err) {
        console.error(err);
        setError('Marketplace Stream Interruption');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAd();
  }, [slug]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <Spinner />
      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] animate-pulse">Syncing Node Metadata</p>
    </div>
  );

  if (error || !ad) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <div className="bg-red-500/10 p-6 rounded-3xl mb-8">
        <AlertTriangle className="h-16 w-16 text-red-500" />
      </div>
      <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter">{error}</h2>
      <p className="text-foreground/50 font-bold mb-10 max-w-md text-center leading-relaxed">
        The requested marketplace data stream is unavailable or has been moved to a different sector.
      </p>
      <Link href="/explore">
        <Button size="lg" className="rounded-2xl px-12 font-black shadow-xl">
           Return to Mainframe
        </Button>
      </Link>
    </div>
  );

  const mainMedia = ad.ad_media?.[0]?.original_url 
    || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-background animate-fade-in pb-24">
      {/* Dynamic Header */}
      <div className="border-b border-border/50 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="rounded-full px-4 hover:bg-muted font-black text-xs uppercase tracking-widest text-foreground/60"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Network Link Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Visual Node Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Visual Media Center */}
            <div className="group relative">
               <div className="absolute -inset-1.5 bg-primary/10 rounded-[2.5rem] blur opacity-40 group-hover:opacity-60 transition duration-500" />
               <Card className="relative p-0 overflow-hidden rounded-[2.5rem] border-white shadow-2xl group">
                 <img 
                    src={mainMedia} 
                    alt={ad.title} 
                    className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                 
                 <div className="absolute bottom-8 left-8 flex items-center gap-4">
                    <Badge variant="default" className="px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest bg-white text-foreground shadow-xl border-none">
                       {ad.categories?.name || 'Classified Node'}
                    </Badge>
                    <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-md px-5 py-2 rounded-full text-white shadow-xl">
                       <ShieldCheck className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Verified Listing</span>
                    </div>
                 </div>
               </Card>
            </div>

            {/* Core Info Block */}
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                 <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs">
                    <Zap className="h-4 w-4" />
                    Ad-Pulse Mainframe
                 </div>
                 <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight decoration-primary/10 transition-all">
                    {ad.title}
                 </h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-foreground/40 border-y border-border/50 py-6">
                <span className="flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-xl group transition-all">
                  <Tag className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> 
                  <span className="text-foreground font-black">{ad.categories?.name}</span>
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-xl group transition-all">
                  <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> 
                  <span className="text-foreground font-black">{ad.cities?.name}</span>
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-xl group transition-all">
                  <Clock className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> 
                  <span className="text-foreground font-black">{new Date(ad.publish_at || ad.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </span>
              </div>
            </div>

            {/* Structured Description */}
            <div className="space-y-6">
               <h2 className="text-2xl font-black flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary" />
                  Asset Specifications
               </h2>
               <Card className="p-10 bg-white border-border/60 shadow-xl rounded-[2rem] relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-2 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
                 <p className="whitespace-pre-line text-foreground/80 leading-relaxed font-bold text-lg">
                   {ad.description}
                 </p>
               </Card>
            </div>
          </div>

          {/* Sidebar Protocol Center */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 sticky top-32 overflow-hidden bg-white border-border shadow-2xl rounded-[2.5rem]">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary" />
               
               <div className="flex items-center gap-4 mb-8 p-4 bg-muted/20 rounded-[1.5rem] border border-border/40">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                     <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Contract Owner</h3>
                    <p className="text-xl font-black text-foreground truncate">{ad.user?.name || 'Anonymous Partner'}</p>
                  </div>
               </div>

               <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between p-4 bg-white border border-border shadow-sm rounded-xl">
                    <span className="text-xs font-black text-foreground/40 uppercase tracking-widest">Email Hash</span>
                    <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{ad.user?.email || 'Encrypted'}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Initiate Comms
                  </Button>
                  <Button variant="outline" className="w-full h-16 rounded-2xl font-black text-foreground/60 border-2 border-border hover:border-red-500/20 hover:text-red-500 transition-all">
                    Report Data Integrity
                  </Button>
               </div>

               {ad.packages?.is_featured && (
                 <div className="mt-8 p-6 bg-primary/[0.03] border-2 border-primary/10 rounded-[2rem] text-center space-y-2 group transition-all hover:bg-primary/[0.05]">
                    <div className="flex justify-center">
                       <Zap className="h-8 w-8 text-primary group-hover:scale-125 transition-transform" />
                    </div>
                    <p className="text-primary text-xs font-black uppercase tracking-[0.3em]">
                       Premium Protocol Active
                    </p>
                 </div>
               )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
