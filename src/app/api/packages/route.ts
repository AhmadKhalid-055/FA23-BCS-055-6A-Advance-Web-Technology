import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { serverError } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    const { data: packages, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return serverError('Failed to fetch packages');
  }
}
