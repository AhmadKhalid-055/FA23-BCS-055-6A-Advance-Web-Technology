import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, badRequest, unauthorized, forbidden, serverError } from '@/lib/middleware';
import { getActiveAds, filterAds, generateSlug, normalizeMediaUrl, logStatusChange } from '@/lib/ads';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const createAdSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
  category_id: z.string().uuid("Please select a category"),
  city_id: z.string().uuid("Please select a city"),
  package_id: z.string().uuid("Please select a package"),
  media_urls: z.array(z.string().url("Invalid image URL")).optional().default([]),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const categoryId = searchParams.get('category_id');
    const cityId = searchParams.get('city_id');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');


    // Get active ads with optional filters
    let ads;
    if (categoryId || cityId) {
      ads = await filterAds(categoryId || undefined, cityId || undefined, limit, offset);
    } else {
      ads = await getActiveAds(limit, offset);
    }

    // Get total count
    let countQuery = supabaseAdmin
      .from('ads')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .gt('expire_at', 'now()');

    if (categoryId) countQuery = countQuery.eq('category_id', categoryId);
    if (cityId) countQuery = countQuery.eq('city_id', cityId);

    const { count } = await countQuery;

    return NextResponse.json({
      success: true,
      data: {
        ads,
        pagination: {
          total: count || 0,
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    console.dir(error);
    return serverError('Failed to fetch ads');
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = verifyAuth(req);
    if (!auth) return unauthorized();

    const body = await req.json();
    const result = createAdSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.errors.map(e => e.message).join(', ');
      return badRequest(errorMessage);
    }

    const { title, description, category_id, city_id, package_id, media_urls } = result.data;

    // Create ad
    const { data: ad, error: adError } = await supabaseAdmin
      .from('ads')
      .insert([
        {
          user_id: auth.userId,
          package_id,
          title,
          slug: generateSlug(title),
          description,
          category_id,
          city_id,
          status: 'payment_pending',
        },
      ])
      .select()
      .single();

    if (adError) {
      console.error('FULL AD INSERT ERROR:', JSON.stringify(adError, null, 2));
      return badRequest('Database Error: ' + adError.message + ' (Detail: ' + (adError.details || 'none') + ')');
    }

    // Normalize and insert media
    const mediaRecords = await Promise.all(
      media_urls.map(url => normalizeMediaUrl(url))
    );

    const { error: mediaError } = await supabaseAdmin
      .from('ad_media')
      .insert(
        mediaRecords.map(media => ({
          ad_id: ad.id,
          ...media,
        }))
      );

    if (mediaError) {
      console.error('FULL MEDIA INSERT ERROR:', JSON.stringify(mediaError, null, 2));
      throw new Error(mediaError.message);
    }

    // Log status change
    await logStatusChange(ad.id, 'draft' as any, 'payment_pending', auth.userId, 'Ad created - awaiting payment info');

    return NextResponse.json(
      {
        success: true,
        data: ad,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ad:', error);
    return serverError('Failed to create ad');
  }
}
