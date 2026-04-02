<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { serverError, notFound, verifyAuth, unauthorized, forbidden, badRequest } from '@/lib/middleware';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    // Check if UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let query = supabaseAdmin
      .from('ads')
      .select(
        `
        *,
        categories (*),
        cities (*),
        packages (*),
        ad_media (*),
        user:user_id (name, email),
        payments (*)
      `
      );

    if (isUuid) {
      query = query.eq('id', slug);
    } else {
      query = query.eq('slug', slug);
    }

    const { data: ad, error } = await query.single();

    if (error || !ad) {
      return notFound();
    }

    return NextResponse.json({
      success: true,
      data: ad,
    });
  } catch (error) {
    console.error('Error fetching ad:', error);
    return serverError('Failed to fetch ad');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    const adIdOrSlug = params.slug;

    // Check if UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adIdOrSlug);

    // Verify ownership
    let query = supabaseAdmin.from('ads').select('id, user_id');
    if (isUuid) {
      query = query.eq('id', adIdOrSlug);
    } else {
      query = query.eq('slug', adIdOrSlug);
    }

    const { data: ad, error: fetchError } = await query.single();

    if (fetchError || !ad) {
      return badRequest('Ad not found');
    }

    if (ad.user_id !== auth.userId && auth.role !== 'admin' && auth.role !== 'super_admin') {
      return forbidden();
    }

    // 1. Delete media
    await supabaseAdmin.from('ad_media').delete().eq('ad_id', ad.id);
    
    // 2. Delete status history
    await supabaseAdmin.from('ad_status_history').delete().eq('ad_id', ad.id);
    
    // 3. Delete payments
    await supabaseAdmin.from('payments').delete().eq('ad_id', ad.id);

    // 4. Finally delete the ad
    const { error: deleteError } = await supabaseAdmin
      .from('ads')
      .delete()
      .eq('id', ad.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return serverError('Failed to delete ad');
  }
}
=======
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { serverError, notFound, verifyAuth, unauthorized, forbidden, badRequest } from '@/lib/middleware';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    // Check if UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let query = supabaseAdmin
      .from('ads')
      .select(
        `
        *,
        categories (*),
        cities (*),
        packages (*),
        ad_media (*),
        user:user_id (name, email),
        payments (*)
      `
      );

    if (isUuid) {
      query = query.eq('id', slug);
    } else {
      query = query.eq('slug', slug);
    }

    const { data: ad, error } = await query.single();

    if (error || !ad) {
      return notFound();
    }

    return NextResponse.json({
      success: true,
      data: ad,
    });
  } catch (error) {
    console.error('Error fetching ad:', error);
    return serverError('Failed to fetch ad');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    const adIdOrSlug = params.slug;

    // Check if UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adIdOrSlug);

    // Verify ownership
    let query = supabaseAdmin.from('ads').select('id, user_id');
    if (isUuid) {
      query = query.eq('id', adIdOrSlug);
    } else {
      query = query.eq('slug', adIdOrSlug);
    }

    const { data: ad, error: fetchError } = await query.single();

    if (fetchError || !ad) {
      return badRequest('Ad not found');
    }

    if (ad.user_id !== auth.userId && auth.role !== 'admin' && auth.role !== 'super_admin') {
      return forbidden();
    }

    // 1. Delete media
    await supabaseAdmin.from('ad_media').delete().eq('ad_id', ad.id);
    
    // 2. Delete status history
    await supabaseAdmin.from('ad_status_history').delete().eq('ad_id', ad.id);
    
    // 3. Delete payments
    await supabaseAdmin.from('payments').delete().eq('ad_id', ad.id);

    // 4. Finally delete the ad
    const { error: deleteError } = await supabaseAdmin
      .from('ads')
      .delete()
      .eq('id', ad.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return serverError('Failed to delete ad');
  }
}
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
