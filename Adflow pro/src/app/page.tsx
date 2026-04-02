'use client';

import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface Package {
  id: string;
  name: string;
  duration_days: number;
  price: number;
  is_featured: boolean;
  description: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
}

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, questionRes] = await Promise.all([
          fetch('/api/packages'),
          fetch('/api/questions/random'),
        ]);

        const packagesData = await packagesRes.json();
        const questionData = await questionRes.json();

        if (packagesData.success) {
          setPackages(packagesData.data);
        }

        if (questionData.success) {
          setRandomQuestion(questionData.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-32 mb-32 animate-fade-in text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full bg-white/80 border border-border px-4 py-1.5 mb-8 shadow-sm">
            <Badge variant="success">New Features</Badge>
            <span className="ml-3 text-sm font-bold text-foreground/80">Marketplace analytics 2.0 is now live</span>
          </div>
          
          <h1 className="mb-8 text-6xl md:text-7xl font-black tracking-tighter text-foreground">
            Post & Sell Smarter <br />
            with <span className="text-primary">AdFlow Pro</span>
          </h1>
          
          <p className="mb-12 text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed font-medium">
            The ultimate production-style classified ads marketplace. 
            Experience secure moderation, instant payment verification, and powerful listing performance analytics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Link href="/explore">
              <Button size="lg" className="rounded-full px-10 py-8 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Browse Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-8 text-lg font-bold border-border bg-white/50 hover:bg-white shadow-sm">
                Launch an Ad
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl font-black text-foreground tracking-tight">Engineered for Excellence</h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-medium">Built with security and speed in mind to provide the most reliable trading platform.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-8 space-y-6 group bg-white border-border shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Verified Security</h3>
            <p className="text-foreground/70 leading-relaxed font-medium">Every account and listing undergoes multi-layer moderation and payment verification for 100% confidence.</p>
          </Card>

          <Card className="p-8 space-y-6 group border-green-500/20 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Market Supremacy</h3>
            <p className="text-foreground/70 leading-relaxed font-medium">Boost your reach with our prioritization algorithms. Premium packages deliver up to 10x higher engagement rates.</p>
          </Card>

          <Card className="p-8 space-y-6 group border-yellow-500/20 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Instant Insights</h3>
            <p className="text-foreground/70 leading-relaxed font-medium">Monitor your listing performance in real-time. Our intuitive client dashboard puts you in full control of your ads.</p>
          </Card>
        </div>
      </section>

      {/* Packages Section */}
      {!loading && packages.length > 0 && (
        <section className="relative py-32 overflow-hidden bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-4xl font-black text-foreground">Scale Your Reach</h2>
              <p className="text-foreground/60 font-bold uppercase tracking-widest text-sm">Select the listing power that fits your business needs</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {packages.map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className={clsx(
                    'relative flex flex-col p-8 transition-all duration-500 hover:scale-[1.02] bg-white border-border shadow-md',
                    pkg.is_featured ? 'ring-2 ring-primary shadow-primary/20 bg-primary/[0.02]' : ''
                  )}
                >
                  {pkg.is_featured && (
                    <div className="absolute top-0 right-8 -translate-y-1/2">
                      <Badge variant="success" className="px-5 py-1.5 text-sm uppercase tracking-wider font-bold">Most Popular</Badge>
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-foreground">{pkg.name}</h3>
                    <p className="text-xs text-primary mt-1 tracking-widest uppercase font-black">Active for {pkg.duration_days} Days</p>
                  </div>
                  <div className="mb-8">
                    <span className="text-5xl font-black text-foreground tracking-tighter">₨{pkg.price}</span>
                    <span className="text-foreground/40 ml-2 font-bold uppercase text-xs tracking-widest">/listing</span>
                  </div>
                  <p className="mb-10 text-foreground/70 leading-relaxed flex-grow font-medium">{pkg.description}</p>
                  
                  <div className="space-y-4 mb-10 border-t border-border pt-8">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-500/10 p-1"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                      <span className="text-sm text-foreground font-bold">Verified Status</span>
                    </div>
                    {pkg.is_featured && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-500/10 p-1"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                        <span className="text-sm text-foreground font-bold">Top Priority Placement</span>
                      </div>
                    )}
                  </div>
                  
                  <Link href="/auth/register">
                    <Button variant={pkg.is_featured ? 'default' : 'outline'} className="w-full rounded-xl py-6 font-black text-base transition-all group shadow-sm transition-all active:scale-95">
                      Select {pkg.name}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learning Question Section */}
      {randomQuestion && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="p-12 relative overflow-hidden bg-white border-primary/20 shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="bg-primary/10 p-5 rounded-3xl animate-float">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-4">
                <Badge variant="warning" className="px-4 py-1 font-bold">PRO KNOWLEDGE TIP</Badge>
                <h3 className="text-3xl font-black text-foreground tracking-tight">{randomQuestion.question}</h3>
                <p className="text-xl text-foreground/70 leading-relaxed font-medium">{randomQuestion.answer}</p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-40">
        <div className="relative rounded-[3rem] overflow-hidden py-24 text-center bg-primary shadow-2xl shadow-primary/30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
          <div className="relative z-10 px-6">
            <h2 className="mb-6 text-5xl md:text-6xl font-black text-white tracking-tighter">Ready to Capture the Market?</h2>
            <p className="mb-12 text-xl text-white/80 max-w-xl mx-auto font-medium">Join thousands of sellers and experience the new standard in classified trading.</p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="rounded-full px-12 py-8 text-xl font-bold hover:scale-105 active:scale-95 shadow-2xl transition-all">
                Access Now — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
