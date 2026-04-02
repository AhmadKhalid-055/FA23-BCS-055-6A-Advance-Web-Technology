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

    // Find scheduled ads that should be published
    const { data: scheduledAds, error: fetchError } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('status', 'scheduled')
      .lte('publish_at', now.toISOString());

    if (fetchError) throw new Error(fetchError.message);

    // Update them to published
    if (scheduledAds && scheduledAds.length > 0) {
      for (const ad of scheduledAds) {
        const { error: updateError } = await supabaseAdmin
          .from('ads')
          .update({ status: 'published' })
          .eq('id', ad.id);

        if (updateError) throw new Error(updateError.message);

        // Log the status change
        await logStatusChange(ad.id, 'scheduled', 'published', 'system', 'Auto-published by cron job');
      }
    }

    return NextResponse.json({
      success: true,
      message: `Published ${scheduledAds?.length || 0} scheduled ads`,
    });
  } catch (error) {
    console.error('Error publishing scheduled ads:', error);
    return serverError('Failed to publish scheduled ads');
  }
}
