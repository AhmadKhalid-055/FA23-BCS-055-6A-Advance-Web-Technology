import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret, badRequest, serverError } from '@/lib/middleware';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';

export async function POST(req: NextRequest) {
  try {
    if (!verifyCronSecret(req)) {
      return badRequest('Invalid cron secret');
    }

    const now = new Date();

    // Find published ads that have expired
    const { data: expiredAds, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('status', 'published')
      .lt('expire_at', now.toISOString());

    if (fetchError) throw new Error(fetchError.message);

    // Update them to expired
    if (expiredAds && expiredAds.length > 0) {
      for (const ad of expiredAds) {
        const { error: updateError } = await supabaseAdmin
          .from('ads')
          .update({ status: 'expired' })
          .eq('id', ad.id);

        if (updateError) throw new Error(updateError.message);

        // Log the status change
        await logStatusChange(ad.id, 'published', 'expired', 'system', 'Auto-expired by cron job');
      }
    }

    return NextResponse.json({
      success: true,
      message: `Expired ${expiredAds?.length || 0} ads`,
    });
  } catch (error) {
    console.error('Error expiring ads:', error);
    return serverError('Failed to expire ads');
  }
}
