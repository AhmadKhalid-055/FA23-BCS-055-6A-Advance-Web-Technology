<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, badRequest, serverError } from '@/lib/middleware';
import { isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
  payment_id: z.string().uuid(),
  action: z.enum(['verify', 'reject']),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Get pending payments
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select(
        `
        *,
        ads:ad_id (
          *,
          user:user_id (name, email)
        )
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
        payments,
        pagination: {
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return serverError('Failed to fetch payments');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    const body = await req.json();
    const result = verifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return badRequest('Invalid verification data');
    }

    const { payment_id, action, note } = result.data;

    // Get payment and ad info
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      return badRequest('Payment not found');
    }

    const newPaymentStatus = action === 'verify' ? 'verified' : 'rejected';
    const newAdStatus = action === 'verify' ? 'payment_verified' : 'rejected';

    // Update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        status: newPaymentStatus,
        verified_by: auth.userId,
        verification_note: note,
        verified_at: new Date().toISOString(),
      })
      .eq('id', payment_id);

    if (updatePaymentError) throw new Error(updatePaymentError.message);

    // Update ad status
    const { error: updateAdError } = await supabaseAdmin
      .from('ads')
      .update({ status: newAdStatus })
      .eq('id', payment.ad_id);

    if (updateAdError) throw new Error(updateAdError.message);

    // Log status change
    await logStatusChange(payment.ad_id, 'payment_submitted', newAdStatus as any, auth.userId, note);

    return NextResponse.json({
      success: true,
      message: `Payment ${action}ed`,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return serverError('Failed to verify payment');
  }
}
=======
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, forbidden, badRequest, serverError } from '@/lib/middleware';
import { isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
  payment_id: z.string().uuid(),
  action: z.enum(['verify', 'reject']),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Get pending payments
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select(
        `
        *,
        ads:ad_id (
          *,
          user:user_id (name, email)
        )
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
        payments,
        pagination: {
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return serverError('Failed to fetch payments');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    if (!isAdmin(auth.role)) return forbidden();

    const body = await req.json();
    const result = verifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return badRequest('Invalid verification data');
    }

    const { payment_id, action, note } = result.data;

    // Get payment and ad info
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      return badRequest('Payment not found');
    }

    const newPaymentStatus = action === 'verify' ? 'verified' : 'rejected';
    const newAdStatus = action === 'verify' ? 'payment_verified' : 'rejected';

    // Update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        status: newPaymentStatus,
        verified_by: auth.userId,
        verification_note: note,
        verified_at: new Date().toISOString(),
      })
      .eq('id', payment_id);

    if (updatePaymentError) throw new Error(updatePaymentError.message);

    // Update ad status
    const { error: updateAdError } = await supabaseAdmin
      .from('ads')
      .update({ status: newAdStatus })
      .eq('id', payment.ad_id);

    if (updateAdError) throw new Error(updateAdError.message);

    // Log status change
    await logStatusChange(payment.ad_id, 'payment_submitted', newAdStatus as any, auth.userId, note);

    return NextResponse.json({
      success: true,
      message: `Payment ${action}ed`,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return serverError('Failed to verify payment');
  }
}
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
