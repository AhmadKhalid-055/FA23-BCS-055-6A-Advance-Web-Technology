<<<<<<< HEAD
import { useAuth } from '@/store/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: any;
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ data?: T; error?: string; success: boolean }> {
  const { method = 'GET', body, requiresAuth = false } = options;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const { token } = useAuth.getState();
      if (!token) {
        return { error: 'Not authenticated', success: false };
      }
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: responseData.error || 'Request failed',
        success: false,
      };
    }

    return {
      data: responseData.data,
      success: responseData.success,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    };
  }
}

// API shortcuts
export const api = {
  // Auth
  register: (email: string, password: string, name: string) =>
    apiRequest('/api/auth', {
      method: 'POST',
      body: { email, password, name },
    }),
  
  login: (email: string, password: string) =>
    apiRequest('/api/auth', {
      method: 'POST',
      body: { email, password },
    }),

  // Ads
  getAds: (categoryId?: string, cityId?: string) =>
    apiRequest('/api/ads', {
      method: 'GET',
    }),
  
  getAdBySlug: (slug: string) =>
    apiRequest(`/api/ads/${slug}`),
  
  createAd: (title: string, description: string, categoryId: string, cityId: string, mediaUrls: string[]) =>
    apiRequest('/api/ads', {
      method: 'POST',
      body: { title, description, category_id: categoryId, city_id: cityId, media_urls: mediaUrls },
      requiresAuth: true,
    }),

  // Packages
  getPackages: () =>
    apiRequest('/api/packages'),

  // Client Dashboard
  getClientDashboard: () =>
    apiRequest('/api/client/dashboard', { requiresAuth: true }),

  // Moderator
  getReviewQueue: () =>
    apiRequest('/api/moderator/review-queue', { requiresAuth: true }),
  
  reviewAd: (adId: string, action: 'approve' | 'reject', note?: string) =>
    apiRequest('/api/moderator/review-queue', {
      method: 'PATCH',
      body: { ad_id: adId, action, note },
      requiresAuth: true,
    }),

  // Admin
  getPaymentQueue: () =>
    apiRequest('/api/admin/payments', { requiresAuth: true }),
  
  verifyPayment: (paymentId: string, action: 'verify' | 'reject', note?: string) =>
    apiRequest('/api/admin/payments', {
      method: 'PATCH',
      body: { payment_id: paymentId, action, note },
      requiresAuth: true,
    }),
  
  publishAd: (adId: string, action: 'publish' | 'schedule' | 'feature', publishAt?: string) =>
    apiRequest('/api/admin/publish', {
      method: 'PATCH',
      body: { ad_id: adId, action, publish_at: publishAt },
      requiresAuth: true,
    }),
  
  getAnalytics: () =>
    apiRequest('/api/admin/analytics', { requiresAuth: true }),

  // Questions
  getRandomQuestion: () =>
    apiRequest('/api/questions/random'),

  // Payments
  submitPayment: (adId: string, packageId: string, amount: number, method: string, transactionRef: string, senderName: string) =>
    apiRequest('/api/client/payments', {
      method: 'POST',
      body: { ad_id: adId, package_id: packageId, amount, method, transaction_ref: transactionRef, sender_name: senderName },
      requiresAuth: true,
    }),
};
=======
import { useAuth } from '@/store/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: any;
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ data?: T; error?: string; success: boolean }> {
  const { method = 'GET', body, requiresAuth = false } = options;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const { token } = useAuth.getState();
      if (!token) {
        return { error: 'Not authenticated', success: false };
      }
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: responseData.error || 'Request failed',
        success: false,
      };
    }

    return {
      data: responseData.data,
      success: responseData.success,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    };
  }
}

// API shortcuts
export const api = {
  // Auth
  register: (email: string, password: string, name: string) =>
    apiRequest('/api/auth', {
      method: 'POST',
      body: { email, password, name },
    }),
  
  login: (email: string, password: string) =>
    apiRequest('/api/auth', {
      method: 'POST',
      body: { email, password },
    }),

  // Ads
  getAds: (categoryId?: string, cityId?: string) =>
    apiRequest('/api/ads', {
      method: 'GET',
    }),
  
  getAdBySlug: (slug: string) =>
    apiRequest(`/api/ads/${slug}`),
  
  createAd: (title: string, description: string, categoryId: string, cityId: string, mediaUrls: string[]) =>
    apiRequest('/api/ads', {
      method: 'POST',
      body: { title, description, category_id: categoryId, city_id: cityId, media_urls: mediaUrls },
      requiresAuth: true,
    }),

  // Packages
  getPackages: () =>
    apiRequest('/api/packages'),

  // Client Dashboard
  getClientDashboard: () =>
    apiRequest('/api/client/dashboard', { requiresAuth: true }),

  // Moderator
  getReviewQueue: () =>
    apiRequest('/api/moderator/review-queue', { requiresAuth: true }),
  
  reviewAd: (adId: string, action: 'approve' | 'reject', note?: string) =>
    apiRequest('/api/moderator/review-queue', {
      method: 'PATCH',
      body: { ad_id: adId, action, note },
      requiresAuth: true,
    }),

  // Admin
  getPaymentQueue: () =>
    apiRequest('/api/admin/payments', { requiresAuth: true }),
  
  verifyPayment: (paymentId: string, action: 'verify' | 'reject', note?: string) =>
    apiRequest('/api/admin/payments', {
      method: 'PATCH',
      body: { payment_id: paymentId, action, note },
      requiresAuth: true,
    }),
  
  publishAd: (adId: string, action: 'publish' | 'schedule' | 'feature', publishAt?: string) =>
    apiRequest('/api/admin/publish', {
      method: 'PATCH',
      body: { ad_id: adId, action, publish_at: publishAt },
      requiresAuth: true,
    }),
  
  getAnalytics: () =>
    apiRequest('/api/admin/analytics', { requiresAuth: true }),

  // Questions
  getRandomQuestion: () =>
    apiRequest('/api/questions/random'),

  // Payments
  submitPayment: (adId: string, packageId: string, amount: number, method: string, transactionRef: string, senderName: string) =>
    apiRequest('/api/client/payments', {
      method: 'POST',
      body: { ad_id: adId, package_id: packageId, amount, method, transaction_ref: transactionRef, sender_name: senderName },
      requiresAuth: true,
    }),
};
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
