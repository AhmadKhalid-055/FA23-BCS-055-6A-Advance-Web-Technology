'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Button, Card, Spinner, Badge, Modal, Input } from '@/components/ui';
import Link from 'next/link';
import { Plus, Package2, CheckCircle, Clock, ExternalLink, Zap, ShieldCheck, CreditCard, ChevronRight, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface Ad {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  slug: string;
  ad_media?: { original_url: string }[];
  category_name?: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
}

export default function ClientDashboard() {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [paymentData, setPaymentData] = useState({
    package_id: '',
    amount: '',
    method: 'Bank Transfer',
    transaction_ref: '',
    sender_name: '',
    screenshot_url: ''
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/client/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const result = await res.json();
      if (result.success) setPackages(result.data);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchDashboard();
    fetchPackages();
  }, [isAuthenticated, token, router]);

  const openPaymentModal = (ad: Ad) => {
    setSelectedAdId(ad.id);
    setPaymentData({ ...paymentData, package_id: '' });
    setIsPaymentModalOpen(true);
  };

  const handlePackageChange = (pkgId: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    setPaymentData({
      ...paymentData,
      package_id: pkgId,
      amount: pkg ? pkg.price.toString() : ''
    });
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPayment(true);
    
    try {
      const res = await fetch('/api/client/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ad_id: selectedAdId,
          package_id: paymentData.package_id,
          amount: parseFloat(paymentData.amount),
          method: paymentData.method,
          transaction_ref: paymentData.transaction_ref,
          sender_name: paymentData.sender_name,
          screenshot_url: paymentData.screenshot_url || "https://example.com/receipt.jpg"
        })
      });

      const result = await res.json();
      if (result.success) {
        setIsPaymentModalOpen(false);
        fetchDashboard();
        alert('Payment submitted successfully! Waiting for admin verification.');
      } else {
        alert(result.error || 'Failed to submit payment');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to permanently decommission this ad node? This action is irreversible.')) return;
    
    try {
      const res = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      if (result.success) {
        setData({
          ...data,
          ads: data.ads.filter((a: any) => a.id !== adId)
        });
      } else {
        alert(result.error || 'Failed to delete ad');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during decommissioning');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
      <Spinner />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/20 animate-pulse">Syncing Marketplace Data</p>
    </div>
  );

  return (
    <div className="space-y-12 py-12 animate-fade-in text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Online</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            Control <span className="text-primary italic">Center</span>
          </h1>
          <p className="text-lg text-foreground/60 font-medium italic">
            Greetings, <span className="text-foreground font-black underline decoration-primary/30 decoration-4 underline-offset-4">{user?.name || 'Partner'}</span>. Your marketplace performance is scaling.
          </p>
        </div>
        
        <Link href="/dashboard/client/create-ad" className="group">
          <Button size="lg" className="rounded-2xl px-10 py-8 text-lg shadow-2xl shadow-primary/30 font-black hover:scale-[1.05] active:scale-95 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
            Launch New Ad
          </Button>
        </Link>
      </div>

      {/* Stats Grid - Futuristic Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Listings', value: data?.stats.total_ads || 0, icon: Package2, color: 'primary' },
          { label: 'Live Market', value: data?.stats.active_ads || 0, icon: ShieldCheck, color: 'green' },
          { label: 'Under Review', value: data?.stats.pending_review || 0, icon: Clock, color: 'yellow' },
          { label: 'Declined', value: data?.stats.rejected_ads || 0, icon: Zap, color: 'red' }
        ].map((stat, i) => (
          <div key={i} className="group relative">
            <div className={clsx(
              "absolute -inset-0.5 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500",
              stat.color === 'primary' ? 'bg-primary' : 
              stat.color === 'green' ? 'bg-green-500' : 
              stat.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            )} />
            <Card className="relative p-6 bg-white border-border/50 shadow-sm flex flex-col justify-between h-full group-hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx(
                  "p-3 rounded-2xl",
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' : 
                  stat.color === 'green' ? 'bg-green-500/10 text-green-600' : 
                  stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
                )}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className={clsx(
                  "h-full animate-in slide-in-from-left duration-1000",
                  stat.color === 'primary' ? 'bg-primary' : 
                  stat.color === 'green' ? 'bg-green-500' : 
                  stat.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                )} style={{ width: '65%' }} />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Ads Main Grid Display */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            Active Sponsored Nodes
          </h2>
          <div className="h-[1px] flex-grow mx-8 bg-gradient-to-r from-border/50 via-border to-transparent hidden md:block" />
          <Badge variant="default" className="font-black px-4 py-1.5 shadow-sm">Real-time Syncing</Badge>
        </div>

        {data?.ads && data.ads.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.ads.map((ad: Ad, index: number) => (
              <div key={ad.id} className="group perspective-1000 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="relative overflow-hidden h-full flex flex-col p-0 bg-white border-border/80 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-b-4 border-b-transparent hover:border-b-primary">
                  {/* Card Media Area */}
                  <div className="relative h-48 w-full bg-muted overflow-hidden">
                    <img 
                      src={ad.ad_media?.[0]?.original_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAd(ad.id);
                        }}
                        className="bg-white/90 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded-xl shadow-xl transition-all duration-300 backdrop-blur-md"
                        title="Decommission Node"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4">
                      {ad.status === 'published' || ad.status === 'active' ? (
                        <div className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          Live
                        </div>
                      ) : ad.status === 'payment_pending' ? (
                        <div className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          <CreditCard className="h-3 w-3" />
                          Unpaid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          <Clock className="h-3 w-3" />
                          Review
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{ad.category_name || 'Classified Node'}</p>
                        <p className="text-[10px] font-bold text-foreground/30 font-mono">#{ad.id.slice(0,8)}</p>
                      </div>
                      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">{ad.title}</h3>
                    </div>

                    <p className="text-xs text-foreground/60 font-medium line-clamp-2 leading-relaxed">
                      {ad.description || "Initializing high-performance marketplace node for maximum ROI and market exposure..."}
                    </p>

                    <div className="pt-4 border-t border-border/50 mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">Post Date</span>
                        <span className="text-xs font-bold text-foreground/80">{new Date(ad.created_at).toLocaleDateString('en-GB')}</span>
                      </div>
                      
                      {ad.status === 'payment_pending' ? (
                        <Button 
                          size="sm" 
                          className="rounded-xl px-4 py-5 font-black text-[11px] uppercase tracking-tighter shadow-lg shadow-primary/20 animate-pulse-slow"
                          onClick={() => openPaymentModal(ad)}
                        >
                          Verify Payment
                        </Button>
                      ) : (
                        <Link href={`/ads/${ad.slug || ad.id}`}>
                          <Button size="sm" variant="outline" className="rounded-xl px-4 py-5 font-black text-[11px] uppercase tracking-tighter border-border/50 group-hover:border-primary group-hover:text-primary">
                            Preview
                            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative py-24 px-8 rounded-[3rem] border-2 border-dashed border-border/50 flex flex-col items-center text-center space-y-6">
            <div className="bg-muted p-8 rounded-full animate-float">
              <Plus className="h-12 w-12 text-foreground/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">No Active Nodes Detected</h3>
              <p className="text-foreground/60 font-medium max-w-sm mx-auto">Your dashboard is currently idle. Initiate your first sponsored listing to begin marketplace domination.</p>
            </div>
            <Link href="/dashboard/client/create-ad">
              <Button size="lg" className="rounded-full px-12 font-black shadow-xl shadow-primary/20">Launch Alpha Node</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Verification Modal - Futuristic Polish */}
      <Modal isOpen={isPaymentModalOpen} title="Node Verification" onClose={() => !submittingPayment && setIsPaymentModalOpen(false)}>
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-primary/[0.03] p-4 rounded-2xl border border-primary/10">
            <div className="bg-primary/10 p-3 rounded-xl text-primary"><CreditCard className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest">Financial Interface</p>
              <p className="text-sm font-bold text-foreground/60">Finalize listing verification protocol.</p>
            </div>
          </div>
          
          <form onSubmit={submitPayment} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Desired Visibility Logic</label>
              <select 
                required
                className="rounded-2xl border-2 border-border bg-muted/20 px-4 py-4 text-sm text-foreground font-black focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none cursor-pointer"
                value={paymentData.package_id}
                onChange={(e) => handlePackageChange(e.target.value)}
              >
                <option value="" className="bg-white">-- Select Tier --</option>
                {packages.map(p => (
                  <option key={p.id} value={p.id} className="bg-white text-foreground">{p.name} Logic - PKR {p.price}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Verified Amount" type="number" readOnly value={paymentData.amount} required className="bg-muted font-black border-none rounded-2xl" />
              <Input label="Auth ID / TRX" placeholder="TRX-123..." required 
                     value={paymentData.transaction_ref} onChange={(e) => setPaymentData({...paymentData, transaction_ref: e.target.value})} className="rounded-2xl font-black border-2 border-border" />
            </div>
            
            <Input label="Sender Account Name" placeholder="Holder Name" required 
                   value={paymentData.sender_name} onChange={(e) => setPaymentData({...paymentData, sender_name: e.target.value})} className="rounded-2xl font-black border-2 border-border py-6" />
                   
            <div className="pt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-border/50">
              <Button type="button" variant="outline" className="rounded-2xl w-full sm:w-auto font-black px-8 py-7" onClick={() => setIsPaymentModalOpen(false)} disabled={submittingPayment}>Discard</Button>
              <Button type="submit" className="rounded-2xl w-full sm:w-auto px-12 py-7 font-black shadow-2xl shadow-primary/30" disabled={submittingPayment}>
                {submittingPayment ? <Spinner /> : 'Validate & Scale'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
