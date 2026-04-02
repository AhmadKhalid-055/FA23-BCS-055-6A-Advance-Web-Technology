import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const results: any = {};

  // Check what tables exist and their row counts
  const tables = ['users', 'categories', 'cities', 'packages', 'ads', 'ad_media', 'payments', 'ad_status_history'];

  for (const table of tables) {
    const { data, error, count } = await supabaseAdmin
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    results[table] = error ? `ERROR: ${error.message}` : `OK (${count} rows)`;
  }

  return NextResponse.json({ success: true, tables: results });
}

export async function POST(req: NextRequest) {
  const results: any = {};

  // Seed categories
  const { error: catError } = await supabaseAdmin.from('categories').upsert([
    { name: 'Electronics', slug: 'electronics', description: 'Phones, laptops, and gadgets', display_order: 1, is_active: true },
    { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture', display_order: 2, is_active: true },
    { name: 'Vehicles', slug: 'vehicles', description: 'Cars, bikes, and motorcycles', display_order: 3, is_active: true },
    { name: 'Services', slug: 'services', description: 'Professional services', display_order: 4, is_active: true },
    { name: 'Real Estate', slug: 'real-estate', description: 'Properties and rentals', display_order: 5, is_active: true },
  ], { onConflict: 'slug' });
  results.categories = catError ? `ERROR: ${catError.message}` : 'Seeded OK';

  // Seed cities
  const { error: cityError } = await supabaseAdmin.from('cities').upsert([
    { name: 'Karachi', slug: 'karachi', is_active: true },
    { name: 'Lahore', slug: 'lahore', is_active: true },
    { name: 'Islamabad', slug: 'islamabad', is_active: true },
    { name: 'Rawalpindi', slug: 'rawalpindi', is_active: true },
    { name: 'Multan', slug: 'multan', is_active: true },
  ], { onConflict: 'slug' });
  results.cities = cityError ? `ERROR: ${cityError.message}` : 'Seeded OK';

  // Seed packages
  const { error: pkgError } = await supabaseAdmin.from('packages').upsert([
    { name: 'Basic', duration_days: 7, weight: 1, is_featured: false, refresh_rule: 'none', price: 99, description: 'Perfect for getting started', is_active: true },
    { name: 'Standard', duration_days: 15, weight: 2, is_featured: false, refresh_rule: 'manual', price: 199, description: 'Popular choice with manual refresh', is_active: true },
    { name: 'Premium', duration_days: 30, weight: 3, is_featured: true, refresh_rule: 'auto', price: 399, description: 'Best seller with auto-refresh', is_active: true },
  ], { onConflict: 'name' });
  results.packages = pkgError ? `ERROR: ${pkgError.message}` : 'Seeded OK';

  // Seed learning questions
  const { error: lqError } = await supabaseAdmin.from('learning_questions').upsert([
    { question: 'What is a classified ad?', answer: 'A classified ad is a short advertisement posted in a newspaper or online.', topic: 'General', difficulty: 'easy', is_active: true },
    { question: 'How long does an ad stay live?', answer: 'Duration depends on the package: Basic (7 days), Standard (15 days), Premium (30 days).', topic: 'Packages', difficulty: 'medium', is_active: true },
    { question: 'What payment methods are accepted?', answer: 'We accept bank transfers, online wallets, and digital payment methods.', topic: 'Payments', difficulty: 'easy', is_active: true },
  ], { onConflict: 'question' });
  results.learning_questions = lqError ? `ERROR: ${lqError.message}` : 'Seeded OK';

  return NextResponse.json({ success: true, seeded: results });
}
