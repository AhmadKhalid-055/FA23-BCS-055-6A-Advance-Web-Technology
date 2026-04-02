'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { Button, Card, Input, Spinner } from '@/components/ui';


export default function CreateAd() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [cities, setCities] = useState<{id: string, name: string}[]>([]);
  const [packages, setPackages] = useState<{id: string, name: string, price: number}[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    city_id: '',
    package_id: '',
    media_url: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchDropdowns = async () => {
      const [catRes, cityRes, pkgRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/cities'),
        fetch('/api/packages'),
      ]);
      const catData = await catRes.json();
      const cityData = await cityRes.json();
      const pkgData = await pkgRes.json();
      if (catData.success) setCategories(catData.data);
      if (cityData.success) setCities(cityData.data);
      if (pkgData.success) setPackages(pkgData.data);
    };

    fetchDropdowns();
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          media_urls: formData.media_url ? [formData.media_url] : []
        })
      });

      const result = await res.json();
      if (result.success) {
        alert('Ad submitted successfully! It will be reviewed by a moderator.');
        router.push('/dashboard/client');
      } else {
        alert('Error: ' + (result.error || 'Failed to create ad'));
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 space-y-10 animate-fade-in text-foreground">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-6xl">
          Pitch Your <span className="text-primary italic underline underline-offset-8">Next Big Deal</span>
        </h1>
        <p className="text-xl text-foreground/70 mx-auto max-w-2xl font-bold italic">
          High-conversion sponsored listing initialization on AdFlow Pro.
        </p>
      </div>

      <Card className="p-10 bg-white border-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary shadow-sm" />
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10 font-bold">
          <Input 
            label="Listing Headline" 
            placeholder="e.g. iPhone 15 Pro Max - Titanium Grey" 
            required 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="rounded-xl font-black text-lg border-border focus:border-primary"
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-black text-foreground uppercase tracking-widest ml-1">Asset Description</label>
            <textarea 
              className="rounded-xl border border-border bg-muted/30 px-4 py-4 text-base text-foreground font-bold placeholder:text-foreground/30 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary min-h-[180px] resize-none"
              placeholder="Describe condition, specifications, and warranty details..."
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-foreground uppercase tracking-widest ml-1">Market Category</label>
              <select 
                className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-base text-foreground font-black focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer outline-none"
                required
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="" className="bg-white">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-white">{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-foreground uppercase tracking-widest ml-1">Trade City</label>
              <select 
                className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-base text-foreground font-black focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer outline-none"
                required
                value={formData.city_id}
                onChange={(e) => setFormData({...formData, city_id: e.target.value})}
              >
                <option value="" className="bg-white">Select City</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id} className="bg-white">{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-foreground uppercase tracking-widest ml-1">Listing Priority / Visibility Package</label>
            <select 
              className="rounded-xl border-2 border-primary shadow-sm bg-primary/5 px-4 py-4 text-lg text-foreground font-black focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer outline-none"
              required
              value={formData.package_id}
              onChange={(e) => setFormData({...formData, package_id: e.target.value})}
            >
              <option value="" className="bg-white">-- Recommended Placement Tiers --</option>
              {packages.map(pkg => (
                <option key={pkg.id} value={pkg.id} className="bg-white">{pkg.name} Tier - PKR {pkg.price}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Media Asset Link (Direct Image or YT)" 
            placeholder="https://imgur.com/your-product-image.jpg" 
            type="url"
            required 
            value={formData.media_url}
            onChange={(e) => setFormData({...formData, media_url: e.target.value})}
            className="rounded-xl font-bold border-border"
          />

          <div className="pt-8 border-t border-border mt-4">
            <Button type="submit" size="lg" className="w-full rounded-2xl py-8 text-xl font-black shadow-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-primary/30" disabled={loading}>
              {loading ? <Spinner /> : 'Initialize Sponsored Marketplace Presence'}
            </Button>
            <p className="text-center text-xs text-foreground/40 mt-6 font-bold uppercase tracking-widest">
              Secured by AdFlow Moderation Protocol
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
