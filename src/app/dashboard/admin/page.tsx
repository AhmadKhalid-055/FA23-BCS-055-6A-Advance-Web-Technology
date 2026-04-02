'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Target, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Rocket,
  CreditCard,
  User,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function AdminDashboard() {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [publishQueue, setPublishQueue] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.push('/dashboard/client');
      return;
    }

    const fetchData = async () => {
      try {
        const [analyticsRes, paymentsRes, adsRes] = await Promise.all([
          fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/ads', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const analyticsData = await analyticsRes.json();
        const paymentsData = await paymentsRes.json();
        const adsData = await adsRes.json();

        if (analyticsData.success) setAnalytics(analyticsData.data);
        if (paymentsData.success) setPayments(paymentsData.data?.payments || []);
        if (adsData.success) setPublishQueue(adsData.data || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router, token]);

  const handleVerifyPayment = async (paymentId: string, action: 'verify' | 'reject') => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ payment_id: paymentId, action })
      });

      const result = await res.json();
      if (result.success) {
        setPayments(payments.filter(p => p.id !== paymentId));
        alert(action === 'verify' ? 'Payment verified! Ad is now awaiting publication.' : 'Payment rejected');
        // Reload ads to publish
        const adsRes = await fetch('/api/admin/ads', { headers: { Authorization: `Bearer ${token}` } });
        const adsData = await adsRes.json();
        if (adsData.success) setPublishQueue(adsData.data || []);
      } else {
        alert(result.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  const handlePublishAd = async (adId: string) => {
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ad_id: adId, action: 'publish' })
      });

      const result = await res.json();
      if (result.success) {
        setPublishQueue(publishQueue.filter(ad => ad.id !== adId));
        alert('Ad successfully published!');
      } else {
        alert(result.error || 'Failed to publish ad');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
      <Spinner />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 animate-pulse">Establishing Secure Neural Link</p>
    </div>
  );

  return (
    <div className="space-y-12 py-12 animate-fade-in text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono select-none">Platform Authority Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Mainframe <span className="text-primary italic">Admin</span>
          </h1>
          <p className="text-lg text-foreground/60 font-medium italic">
            Overseeing <span className="text-foreground font-black underline decoration-primary/30 decoration-4 underline-offset-4">{analytics?.summary.total_ads || 0}</span> marketplace nodes across the grid.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-sm">
           <div className="px-4 text-right hidden sm:block">
              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest leading-none mb-1">Grid Controller</p>
              <p className="text-sm font-black">{user?.name}</p>
           </div>
           <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:rotate-12 cursor-pointer">
              <Globe className="text-white h-7 w-7" />
           </div>
        </div>
      </div>

      {/* Analytics Command Grid */}
      {analytics && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
           {[
             { label: 'Total Nodes', value: analytics.summary.total_ads, icon: BarChart3, color: 'primary' },
             { label: 'Active Matrix', value: analytics.summary.active_ads, icon: Target, color: 'green' },
             { label: 'Total Revenue', value: `₨${analytics.summary.total_revenue}`, icon: DollarSign, color: 'blue' },
             { label: 'Auth Success', value: `${analytics.summary.approval_rate}%`, icon: CheckCircle2, color: 'emerald' },
             { label: 'Drop Rate', value: `${analytics.summary.rejection_rate}%`, icon: XCircle, color: 'red' }
           ].map((item, i) => (
             <Card key={i} className="p-6 relative overflow-hidden group hover:scale-[1.05] transition-all border-border/80">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                  <item.icon className="h-16 w-16" />
                </div>
                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">{item.label}</p>
                <p className={clsx(
                  "text-3xl font-black tracking-tighter",
                  item.color === 'primary' ? 'text-primary' : 
                  item.color === 'green' ? 'text-green-600' : 
                  item.color === 'blue' ? 'text-blue-600' :
                  item.color === 'emerald' ? 'text-emerald-600' : 'text-red-600'
                )}>{item.value}</p>
             </Card>
           ))}
        </div>
      )}

      {/* Dynamic Queue Management */}
      <div className="grid gap-12 lg:grid-cols-2">
        
        {/* Payment Verification Hub */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              Financial Clearances
            </h2>
            <Badge variant={payments.length > 0 ? "warning" : "success"} className="font-black font-mono">
              QUEUE_SIZE::{payments.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {payments.length > 0 ? (
              payments.map((p, index) => (
                <div key={p.id} className="animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className="p-5 flex flex-col sm:flex-row gap-5 hover:border-primary/20 shadow-md group">
                    <div className="sm:w-12 sm:h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
                      <TrendingUp className="h-6 w-6 text-foreground/20 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{p.ads?.title || 'Unknown Cluster'}</h3>
                        <p className="font-mono text-[9px] font-bold text-foreground/20">TXN::{p.id.slice(0,8)}</p>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                          <DollarSign className="h-3 w-3" />
                          PKR {p.amount}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                          <Globe className="h-3 w-3" />
                          {p.method}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary">
                          ID: {p.transaction_ref}
                        </div>
                      </div>
                      <div className="pt-4 flex items-center gap-3">
                        <Button size="sm" variant="outline" className="rounded-xl px-4 py-4 text-[10px] font-black border-red-500/30 text-red-600 hover:bg-red-500/5 hover:border-red-500" onClick={() => handleVerifyPayment(p.id, 'reject')}>REJECT</Button>
                        <Button size="sm" className="rounded-xl px-4 py-4 text-[10px] font-black shadow-lg shadow-primary/20" onClick={() => handleVerifyPayment(p.id, 'verify')}>VERIFY DEPOSIT</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="py-20 rounded-[2rem] bg-muted/20 border-2 border-dashed border-border flex flex-col items-center justify-center text-center px-6">
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-4 opacity-50" />
                <p className="text-sm font-black text-foreground/40 uppercase tracking-widest">Financial Stream Empty</p>
              </div>
            )}
          </div>
        </section>

        {/* Publication Matrix */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              Deployment Matrix
            </h2>
            <Badge variant={publishQueue.length > 0 ? "warning" : "success"} className="font-black font-mono">
              ADS_READY::{publishQueue.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {publishQueue.length > 0 ? (
              publishQueue.map((ad, index) => (
                <div key={ad.id} className="animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className="p-5 flex flex-col sm:flex-row gap-5 hover:border-primary/20 shadow-md group">
                    <div className="sm:w-16 h-16 bg-muted rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={ad.ad_media?.[0]?.original_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                      />
                    </div>
                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-lg text-foreground">{ad.title}</h3>
                        <Badge variant="success" className="font-black px-2 text-[9px] uppercase tracking-tighter">Verified</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                          <User className="h-3 w-3" />
                          {ad.user?.name || 'Partner'}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest italic">
                          <Zap className="h-3 w-3" />
                          {ad.packages?.name || 'Standard'} TIER
                        </div>
                      </div>
                      <div className="pt-4 flex items-center justify-between">
                        <Link href={`/ads/${ad.id}`} className="text-[10px] font-black text-foreground/30 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest">
                          Audit Listing <ExternalLink className="h-3 w-3" />
                        </Link>
                        <Button size="sm" className="rounded-xl px-10 py-5 text-[11px] font-black shadow-xl shadow-primary/20 group hover:scale-105 active:scale-95 transition-all" onClick={() => handlePublishAd(ad.id)}>
                          <Rocket className="h-4 w-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          LAUNCH NODE
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="py-20 rounded-[2rem] bg-muted/20 border-2 border-dashed border-border flex flex-col items-center justify-center text-center px-6">
                <ShieldAlert className="h-10 w-10 text-primary mb-4 opacity-50" />
                <p className="text-sm font-black text-foreground/40 uppercase tracking-widest">Publication Ready</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
