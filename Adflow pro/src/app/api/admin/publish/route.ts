import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, badRequest, serverError } from '@/lib/middleware';
import { isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';
import { z } from 'zod';

const publishSchema = z.object({
  ad_id: z.string().uuid(),
  action: z.enum(['publish', 'schedule', 'feature']),
  publish_at: z.string().datetime().optional(),
  feature_duration_days: z.number().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    const body = await req.json();
    const result = publishSchema.safeParse(body);

    if (!result.success) {
      return badRequest('Invalid publish data');
    }

    const { ad_id, action, publish_at, feature_duration_days } = result.data;

    // Get ad with package info
    const { data: ad, error: adError } = await supabaseAdmin
      .from('ads')
      .select(
        `
        *,
        packages (duration_days)
      `
      )
      .eq('id', ad_id)
      .single();

    if (adError || !ad) {
      return badRequest('Ad not found');
    }

    const now = new Date();
    let updateData: any = {};

    if (action === 'publish') {
      updateData = {
        status: 'published',
        publish_at: now.toISOString(),
        expire_at: new Date(now.getTime() + (ad.packages.duration_days * 24 * 60 * 60 * 1000)).toISOString(),
      };
    } else if (action === 'schedule') {
      if (!publish_at) {
        return badRequest('publish_at is required for scheduling');
      }
      updateData = {
        status: 'scheduled',
        publish_at,
        expire_at: new Date(new Date(publish_at).getTime() + (ad.packages.duration_days * 24 * 60 * 60 * 1000)).toISOString(),
      };
    } else if (action === 'feature') {
      updateData = {
        is_featured: true,
        featured_until: new Date(now.getTime() + ((feature_duration_days || 3) * 24 * 60 * 60 * 1000)).toISOString(),
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from('ads')
      .update(updateData)
      .eq('id', ad_id);

    if (updateError) throw new Error(updateError.message);

    // Log status change if status changed
    if (updateData.status) {
      await logStatusChange(ad_id, ad.status, updateData.status, auth.userId, `${action} by admin`);
    }

    return NextResponse.json({
      success: true,
      message: `Ad ${action}ed successfully`,
    });
  } catch (error) {
    console.error('Error publishing ad:', error);
    return serverError('Failed to publish ad');
  }
}
