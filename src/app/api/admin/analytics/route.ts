import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, serverError } from '@/lib/middleware';
import { isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { AnalyticsSummary, AnalyticsByCity } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    // Total ads
    const { count: totalAds } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact' });

    // Active ads
    const { count: activeAds } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .gt('expire_at', 'now()');

    // Pending reviews
    const { count: pendingReviews } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact' })
      .in('status', ['submitted', 'under_review']);

    // Expired ads
    const { count: expiredAds } = await supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact' })
      .eq('status', 'expired');

    // Revenue
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount, status')
      .eq('status', 'verified');

    const totalRevenue = payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

    // Approval/rejection rates
    const { count: approved } = await supabaseAdmin
      .from('ad_status_history')
      .select('*', { count: 'exact' })
      .eq('new_status', 'payment_pending');

    const { count: rejected } = await supabaseAdmin
      .from('ad_status_history')
      .select('*', { count: 'exact' })
      .eq('new_status', 'rejected');

    const total = (approved || 0) + (rejected || 0);
    const approvalRate = total > 0 ? ((approved || 0) / total * 100) : 0;
    const rejectionRate = total > 0 ? ((rejected || 0) / total * 100) : 0;

    // Ads by category
    const { data: adsByCategory } = await supabaseAdmin
      .from('ads')
      .select(
        `
        categories:category_id (name),
        id
      `
      )
      .eq('status', 'published');

    const categoryMap: { [key: string]: number } = {};
    adsByCategory?.forEach((item: any) => {
      const categoryName = item.categories?.name || 'Unknown';
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
    });

    // Ads by city
    const { data: adsByCity } = await supabaseAdmin
      .from('ads')
      .select(
        `
        cities:city_id (name),
        id
      `
      )
      .eq('status', 'published');

    const cityMap: { [key: string]: number } = {};
    adsByCity?.forEach((item: any) => {
      const cityName = item.cities?.name || 'Unknown';
      cityMap[cityName] = (cityMap[cityName] || 0) + 1;
    });

    const summary: AnalyticsSummary = {
      total_ads: totalAds || 0,
      active_ads: activeAds || 0,
      pending_reviews: pendingReviews || 0,
      expired_ads: expiredAds || 0,
      total_revenue: totalRevenue,
      approval_rate: Math.round(approvalRate * 100) / 100,
      rejection_rate: Math.round(rejectionRate * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      data: {
        summary,
        ads_by_category: Object.entries(categoryMap).map(([name, count]) => ({
          category_name: name,
          ad_count: count,
        })),
        ads_by_city: Object.entries(cityMap).map(([name, count]) => ({
          city_name: name,
          ad_count: count,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return serverError('Failed to fetch analytics');
  }
}
