'use client';

import { Card, Button, Badge } from '@/components/ui';
import { Mail, MessageCircle, ShieldQuestion, Zap, Globe, Cpu, ArrowRight, HelpCircle, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const supportEmail = 'ahmad.khalid.regno.055@gmail.com';

  const faqs = [
    {
      q: "How do I initialize a new Ad Node?",
      a: "Navigate to your Client Dashboard and select 'Create New Ad'. Follow the prompts to input your asset metadata and upload media to the grid."
    },
    {
      q: "What are the verification protocols?",
      a: "Every ad undergoes a dual-layer check: first by our moderation matrix for content integrity, and second for financial clearance after payment submission."
    },
    {
      q: "How long does publication take?",
      a: "Once financial protocols are verified by an Admin, your ad node is deployed to the live stream typically within 1-2 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in pb-20">
      {/* Support Header */}
      <div className="relative overflow-hidden pt-24 pb-20 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <ShieldQuestion className="h-3 w-3" />
              Information Mainframe
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Support <span className="text-primary italic">Uplink</span>
            </h1>
            <p className="text-xl text-foreground/60 font-bold leading-relaxed">
              Having trouble with the marketplace grid? Our technical support units are ready to assist with node deployment and account synchronization.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* FAQ Nodes */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
               <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-primary" />
                  Knowledge Matrix
               </h2>
               <div className="h-1 w-20 bg-primary/20 rounded-full" />
            </div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <Card key={i} className="p-8 bg-white border-border/60 hover:border-primary/30 transition-all rounded-[2rem] shadow-sm hover:shadow-xl group">
                  <h3 className="text-xl font-black mb-4 flex items-start gap-4">
                    <span className="text-primary mt-1"><Zap className="h-5 w-5" /></span>
                    {faq.q}
                  </h3>
                  <p className="text-foreground/60 font-medium leading-relaxed pl-9">
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Core */}
          <div className="lg:col-span-5 space-y-8">
             <div className="sticky top-32">
                <Card className="p-10 bg-white border-border shadow-2xl rounded-[3rem] overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4 text-center">
                       <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                          <Mail className="h-10 w-10 text-primary" />
                       </div>
                       <h2 className="text-3xl font-black tracking-tight">Direct Uplink</h2>
                       <p className="text-foreground/50 font-bold">Initiate direct communication with the platform administrator for critical troubleshooting.</p>
                    </div>

                    <div className="p-6 bg-muted/30 border border-border/50 rounded-2xl space-y-2 text-center group-hover:bg-white transition-colors duration-500">
                       <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">Administrator Channel</p>
                       <p className="text-xl font-black text-foreground break-all select-all">
                          {supportEmail}
                       </p>
                    </div>

                    <a href={`mailto:${supportEmail}`} className="block">
                       <Button size="lg" className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-all">
                          Send Transmission
                          <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                       </Button>
                    </a>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/50">
                       <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Efficiency</span>
                          <span className="text-sm font-black text-green-600">99.8%</span>
                       </div>
                       <div className="w-px h-6 bg-border" />
                       <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Sync Time</span>
                          <span className="text-sm font-black text-primary">~24h</span>
                       </div>
                    </div>
                  </div>
                </Card>

                <div className="mt-8 p-6 bg-white border border-border shadow-md rounded-[2.5rem] flex items-center gap-4 group hover:shadow-xl transition-all">
                   <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <LifeBuoy className="h-6 w-6 text-foreground/40 group-hover:text-primary transition-colors" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">Emergency Protocol</p>
                      <p className="text-sm font-black text-foreground">Global Status: Healthy</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
