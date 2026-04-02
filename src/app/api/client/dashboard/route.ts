import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, serverError } from '@/lib/middleware';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    // Get user profile
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(
        `
        *,
        seller_profiles (*)
      `
      )
      .eq('id', auth.userId)
      .single();

    if (userError) throw new Error(userError.message);

    // Get user's ads
    const { data: ads, error: adsError } = await supabaseAdmin
      .from('ads')
      .select(
        `
        *,
        packages (*),
        categories (*),
        cities (*),
        ad_media (*),
        payments (*)
      `
      )
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false });

    if (adsError) throw new Error(adsError.message);

    // Calculate stats
    const activeAds = ads.filter((ad: any) => ad.status === 'published' && new Date(ad.expire_at) > new Date()).length;
    const pendingReview = ads.filter((ad: any) => ['submitted', 'under_review'].includes(ad.status)).length;
    const rejectedAds = ads.filter((ad: any) => ad.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      data: {
        user,
        ads,
        stats: {
          total_ads: ads.length,
          active_ads: activeAds,
          pending_review: pendingReview,
          rejected_ads: rejectedAds,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return serverError('Failed to fetch dashboard');
  }
}
