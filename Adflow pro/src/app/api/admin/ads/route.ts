import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, serverError } from '@/lib/middleware';
import { isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    const { data: ads, error } = await supabaseAdmin
      .from('ads')
      .select(`
        *,
        user:user_id (name, email),
        packages (name, duration_days)
      `)
      .in('status', ['payment_verified', 'scheduled'])
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error('Error fetching ads for admin:', error);
    return serverError('Failed to fetch ads for admin');
  }
}
