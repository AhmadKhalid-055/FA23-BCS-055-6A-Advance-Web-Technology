// User Roles
export type UserRole = 'client' | 'moderator' | 'admin' | 'super_admin';

export type AdStatus = 'draft' | 'submitted' | 'under_review' | 'payment_pending' | 'payment_submitted' | 'payment_verified' | 'scheduled' | 'published' | 'expired' | 'archived' | 'rejected';

export type PaymentStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type MediaSourceType = 'image' | 'youtube' | 'external_url';

// Database Models
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  display_name: string;
  business_name: string;
  phone: string;
  city: string;
  bio: string;
  is_verified: boolean;
  verification_date: string | null;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  duration_days: number;
  weight: number;
  is_featured: boolean;
  refresh_rule: 'none' | 'manual' | 'auto';
  auto_refresh_days: number | null;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Ad {
  id: string;
  user_id: string;
  package_id: string;
  title: string;
  slug: string;
  category_id: string;
  city_id: string;
  description: string;
  status: AdStatus;
  publish_at: string | null;
  expire_at: string | null;
  admin_boost: number;
  is_featured: boolean;
  featured_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdMedia {
  id: string;
  ad_id: string;
  source_type: MediaSourceType;
  original_url: string;
  thumbnail_url: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  created_at: string;
}

export interface Payment {
  id: string;
  ad_id: string;
  amount: number;
  method: string;
  transaction_ref: string;
  sender_name: string;
  screenshot_url: string | null;
  status: PaymentStatus;
  verified_by: string | null;
  verification_note: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  old_value: any;
  new_value: any;
  created_at: string;
}

export interface AdStatusHistory {
  id: string;
  ad_id: string;
  previous_status: AdStatus;
  new_status: AdStatus;
  changed_by: string;
  note: string | null;
  changed_at: string;
}

export interface LearningQuestion {
  id: string;
  question: string;
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
}

export interface SystemHealthLog {
  id: string;
  source: string;
  response_ms: number;
  checked_at: string;
  status: 'healthy' | 'degraded' | 'down';
  error_message: string | null;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateAdRequest {
  title: string;
  description: string;
  category_id: string;
  city_id: string;
  media_urls: string[];
}

export interface SubmitPaymentRequest {
  ad_id: string;
  amount: number;
  method: string;
  transaction_ref: string;
  sender_name: string;
  screenshot_url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Analytics
export interface AnalyticsSummary {
  total_ads: number;
  active_ads: number;
  pending_reviews: number;
  expired_ads: number;
  total_revenue: number;
  approval_rate: number;
  rejection_rate: number;
}

export interface analytics_by_category {
  category_name: string;
  ad_count: number;
}

export interface AnalyticsByCity {
  city_name: string;
  ad_count: number;
}
