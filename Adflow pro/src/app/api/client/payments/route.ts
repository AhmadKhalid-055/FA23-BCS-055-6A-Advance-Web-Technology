import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorized, badRequest, serverError } from '@/lib/middleware';
import { supabaseAdmin } from '@/lib/supabase';
import { logStatusChange } from '@/lib/ads';
import { z } from 'zod';

const submitPaymentSchema = z.object({
  ad_id: z.string().uuid(),
  package_id: z.string().uuid(),
  amount: z.number().positive(),
  method: z.string(),
  transaction_ref: z.string(),
  sender_name: z.string(),
  screenshot_url: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    const body = await req.json();
    const result = submitPaymentSchema.safeParse(body);

    if (!result.success) {
      return badRequest('Invalid payment data');
    }

    const { ad_id, package_id, amount, method, transaction_ref, sender_name, screenshot_url } = result.data;

    // Check if transaction_ref already exists
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_ref', transaction_ref)
      .single();

    if (existingPayment) {
      return badRequest('Payment already submitted with this transaction reference');
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([
        {
          ad_id,
          amount,
          method,
          transaction_ref,
          sender_name,
          screenshot_url,
          status: 'submitted',
        },
      ])
      .select()
      .single();

    if (paymentError) throw new Error(paymentError.message);

    // Update ad status to payment_submitted
    const { error: adError } = await supabaseAdmin
      .from('ads')
      .update({ status: 'payment_submitted', package_id })
      .eq('id', ad_id);

    if (adError) throw new Error(adError.message);

    // Log status change
    await logStatusChange(ad_id, 'payment_pending', 'payment_submitted', auth.userId, 'Payment submitted');

    return NextResponse.json(
      {
        success: true,
        data: payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting payment:', error);
    return serverError('Failed to submit payment');
  }
}
