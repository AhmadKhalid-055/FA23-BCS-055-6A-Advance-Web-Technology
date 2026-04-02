<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, badRequest, serverError } from '@/lib/middleware';
import { isModerator, isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';
import { z } from 'zod';

const reviewSchema = z.object({
  ad_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isModerator(auth.role)) return forbidden();

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Get submitted ads for review
    const { data: ads, error } = await supabaseAdmin
      .from('ads')
      .select(
        `
        *,
        categories (*),
        cities (*),
        packages (*),
        ad_media (*),
        user:user_id (name, email),
        ad_status_history (*)
      `
      )
      .eq('status', 'submitted')
      .order('created_at', { ascending: true })
      .limit(limit)
      .offset(offset);

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      data: {
        ads,
        pagination: {
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return serverError('Failed to fetch review queue');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isModerator(auth.role)) return forbidden();

    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return badRequest('Invalid review data');
    }

    const { ad_id, action, note } = result.data;

    // Determine new status
    const newStatus = action === 'approve' ? 'payment_pending' : 'rejected';

    // Update ad status
    const { error } = await supabaseAdmin
      .from('ads')
      .update({ status: newStatus })
      .eq('id', ad_id);

    if (error) throw new Error(error.message);

    // Log status change
    await logStatusChange(ad_id, 'submitted', newStatus as any, auth.userId, note);

    return NextResponse.json({
      success: true,
      message: `Ad ${action}ed for review`,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return serverError('Failed to update review');
  }
}
=======
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, badRequest, serverError } from '@/lib/middleware';
import { isModerator, isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';
import { z } from 'zod';

const reviewSchema = z.object({
  ad_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isModerator(auth.role)) return forbidden();

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Get submitted ads for review
    const { data: ads, error } = await supabaseAdmin
      .from('ads')
      .select(
        `
        *,
        categories (*),
        cities (*),
        packages (*),
        ad_media (*),
        user:user_id (name, email),
        ad_status_history (*)
      `
      )
      .eq('status', 'submitted')
      .order('created_at', { ascending: true })
      .limit(limit)
      .offset(offset);

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      data: {
        ads,
        pagination: {
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return serverError('Failed to fetch review queue');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isModerator(auth.role)) return forbidden();

    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return badRequest('Invalid review data');
    }

    const { ad_id, action, note } = result.data;

    // Determine new status
    const newStatus = action === 'approve' ? 'payment_pending' : 'rejected';

    // Update ad status
    const { error } = await supabaseAdmin
      .from('ads')
      .update({ status: newStatus })
      .eq('id', ad_id);

    if (error) throw new Error(error.message);

    // Log status change
    await logStatusChange(ad_id, 'submitted', newStatus as any, auth.userId, note);

    return NextResponse.json({
      success: true,
      message: `Ad ${action}ed for review`,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return serverError('Failed to update review');
  }
}
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
