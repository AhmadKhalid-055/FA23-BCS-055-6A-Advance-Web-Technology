'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import Link from 'next/link';
import { Search, MapPin, Tag, Zap, ArrowRight, Filter, Globe, ChevronRight } from 'lucide-react';
import { Category, City, Ad } from '@/types';
import clsx from 'clsx';

export default function Explore() {
  const [ads, setAds] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adsRes, catRes, cityRes] = await Promise.all([
        fetch(`/api/ads?category_id=${categoryId}&city_id=${cityId}`),
        fetch('/api/categories'),
        fetch('/api/cities')
      ]);

      const [adsData, catData, cityData] = await Promise.all([
        adsRes.json(),
        catRes.json(),
        cityRes.json()
      ]);

      if (adsData.success) setAds(adsData.data.ads || []);
      if (catData.success) setCategories(catData.data || []);
      if (cityData.success) setCities(cityData.data || []);
    } catch (error) {
      console.error('Terminal Data Sync Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId, cityId]);

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in pb-20">
      {/* Marketplace Header - Command Center Style */}
      <div className="relative overflow-hidden pt-20 pb-16 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <Globe className="h-3 w-3" />
                Live Marketplace Feed
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Global <span className="text-primary italic underline underline-offset-8">Ad-Stream</span>
              </h1>
              <p className="text-xl text-foreground/60 font-bold max-w-xl">
                Access categorized marketplace nodes verified by AdFlow Pro protocols. High-performance trading starts here.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-2xl">
               <div className="flex flex-col items-center px-6 py-2 border-r border-border">
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Active Nodes</span>
                  <span className="text-2xl font-black">{ads.length}</span>
               </div>
               <Badge variant="success" className="mx-4 font-black px-4 py-2">Synced OK</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filtering Interface - Futuristic Control Bar */}
        <Card className="mb-16 p-2 bg-white border-border shadow-2xl rounded-[2.5rem] flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-4 ring-1 ring-border/50">
          <div className="flex-grow flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow group">
              <Tag className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:scale-110 transition-transform" />
              <select 
                className="w-full bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[2rem] pl-14 pr-8 py-5 text-base font-black appearance-none transition-all outline-none cursor-pointer"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            
            <div className="relative flex-grow group">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:scale-110 transition-transform" />
              <select 
                className="w-full bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[2rem] pl-14 pr-8 py-5 text-base font-black appearance-none transition-all outline-none cursor-pointer"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
              >
                <option value="">Universal (Cities)</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
              </select>
            </div>
          </div>
          
          <Button onClick={fetchData} size="lg" className="rounded-[2rem] px-12 py-8 text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Filter className="mr-3 h-5 w-5" />
            Apply Filter
          </Button>
        </Card>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-6">
            <Spinner />
            <p className="text-sm font-black text-foreground/40 uppercase tracking-[0.3em] animate-pulse">Initializing Data Stream</p>
          </div>
        ) : ads.length === 0 ? (
          <Card className="p-20 text-center bg-white border-dashed border-2 border-border/50 rounded-[3rem]">
            <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
               <Globe className="h-10 w-10 text-foreground/20" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4 tracking-tighter">No Active Nodes Detected</h2>
            <p className="text-foreground/50 max-w-md mx-auto font-bold mb-10 leading-relaxed text-lg">
              The marketplace stream is currently empty for these parameters. Be the first to initialize a node in this sector.
            </p>
            <Link href="/dashboard/client/create-ad">
               <Button variant="outline" size="lg" className="rounded-2xl px-10 font-black border-2 hover:bg-primary/5">
                  Initialize New Node
               </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad, index) => (
              <div 
                key={ad.id} 
                className="group perspective-1000 animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/ads/${ad.slug}`}>
                  <Card className="relative overflow-hidden h-full flex flex-col p-0 bg-white border-border/80 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border-b-4 border-b-transparent hover:border-b-primary">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    
                    {/* Visual Media Placeholder/Preview */}
                    <div className="relative h-56 w-full bg-muted/30 overflow-hidden border-b border-border/50">
                      <img 
                        src={ad.main_image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      
                      {/* Status Pulse */}
                      <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Active Node</span>
                      </div>
                      
                      <Badge className="absolute bottom-6 left-6 font-black uppercase tracking-widest bg-primary text-white px-3 py-1 text-[9px] shadow-lg">
                        {ad.category_name || 'Classified'}
                      </Badge>
                    </div>

                    <div className="p-8 flex-grow space-y-6 relative z-10">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                           <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                              {ad.title}
                           </h3>
                        </div>
                        <p className="text-sm text-foreground/60 font-bold line-clamp-3 leading-relaxed">
                          {ad.description || "Entering high-performance marketplace stream with verified metadata and ROI focus..."}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border/30 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-foreground/40 font-black text-[10px] uppercase tracking-widest">
                           <MapPin className="h-3 w-3 text-primary" />
                           {ad.city_name || 'Universal'}
                        </div>
                        <div className="flex items-center gap-2 text-primary font-black group-hover:translate-x-2 transition-transform duration-300">
                           <span className="text-[10px] uppercase tracking-widest">View Node</span>
                           <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
