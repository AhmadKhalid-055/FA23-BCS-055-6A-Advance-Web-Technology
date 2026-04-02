import { Ad, AdStatus, MediaSourceType } from '@/types';
import { supabaseAdmin } from './supabase';

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Calculate ad ranking score
export const calculateRankScore = (ad: Ad & { package_weight?: number; daysSincePublish?: number }): number => {
  let score = 0;

  // Featured boost
  if (ad.is_featured) {
    score += 50;
  }

  // Package weight
  score += (ad.package_weight || 1) * 10;

  // Freshness points (decay over time)
  const daysSince = ad.daysSincePublish || 0;
  const freshnessPoints = Math.max(0, 30 - daysSince * 2);
  score += freshnessPoints;

  // Admin boost
  score += ad.admin_boost || 0;

  return score;
};

// Validate and normalize media URL
export const normalizeMediaUrl = async (url: string): Promise<{
  source_type: MediaSourceType;
  original_url: string;
  thumbnail_url: string;
  validation_status: 'valid' | 'invalid' | 'pending';
}> => {
  try {
    // Check if YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return {
          source_type: 'youtube',
          original_url: url,
          thumbnail_url: '',
          validation_status: 'invalid',
        };
      }

      return {
        source_type: 'youtube',
        original_url: url,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        validation_status: 'valid',
      };
    }

    // Check if image URL or generic web URL (Google images often don't have extensions)
    const isPotentiallyImage = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url) || 
                               url.includes('googleusercontent.com') || 
                               url.includes('gstatic.com');

    try {
      // Attempt head check but don't hard fail
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return {
          source_type: isPotentiallyImage ? 'image' : 'external_url',
          original_url: url,
          thumbnail_url: url,
          validation_status: 'valid',
        };
      }
    } catch (e) {
      // Fallback for CORS or timeout - treat as pending and let client try to load it
      return {
        source_type: 'image',
        original_url: url,
        thumbnail_url: url,
        validation_status: 'pending',
      };
    }

    // Default catch-all for any valid URL
    return {
      source_type: 'image',
      original_url: url,
      thumbnail_url: url,
      validation_status: 'pending',
    };
  } catch (error) {
    return {
      source_type: 'external_url',
      original_url: url,
      thumbnail_url: '',
      validation_status: 'invalid',
    };
  }
};

// Extract YouTube video ID
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^&\n?#]+)/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

// Get active ads with ranking
export const getActiveAds = async (limit = 20, offset = 0) => {
  const { data: ads, error } = await supabaseAdmin
    .from('ads')
    .select(
      `
      *,
      packages:package_id (weight),
      user:user_id (email, name),
      ad_media (*),
      categories:category_id (name),
      cities:city_id (name),
      seller:user_id (seller_profiles (*))
    `
    )
    .eq('status', 'published')
    .gt('expire_at', 'now()')
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  // Calculate and sort by rank score
  const adsWithRank = ads.map((ad: any) => ({
    ...ad,
    category_name: ad.categories?.name,
    city_name: ad.cities?.name,
    main_image: ad.ad_media?.[0]?.original_url,
    rank_score: calculateRankScore({
      ...ad,
      package_weight: ad.packages?.weight || 1,
      daysSincePublish: Math.floor(
        (Date.now() - new Date(ad.publish_at).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }),
  }));

  return adsWithRank.sort((a: any, b: any) => b.rank_score - a.rank_score);
};

// Filter ads by category and city
export const filterAds = async (categoryId?: string, cityId?: string, limit = 20, offset = 0) => {
  let query = supabaseAdmin
    .from('ads')
    .select(
      `
      *,
      packages:package_id (weight),
      user:user_id (email, name),
      ad_media (*),
      categories:category_id (name),
      cities:city_id (name)
    `
    )
    .eq('status', 'published')
    .gt('expire_at', 'now()');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data: ads, error } = await query
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  return ads?.map((ad: any) => ({
    ...ad,
    category_name: ad.categories?.name,
    city_name: ad.cities?.name,
    main_image: ad.ad_media?.[0]?.original_url
  })) || [];
};

// Log ad status change
export const logStatusChange = async (adId: string, previousStatus: AdStatus, newStatus: AdStatus, changedBy: string, note?: string) => {
  const { error } = await supabaseAdmin
    .from('ad_status_history')
    .insert([
      {
        ad_id: adId,
        previous_status: previousStatus,
        new_status: newStatus,
        changed_by: changedBy,
        note,
      },
    ]);

  if (error) throw new Error(error.message);
};

// Generate placeholder image URL
export const getPlaceholderImage = (width = 400, height = 300): string => {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
};
