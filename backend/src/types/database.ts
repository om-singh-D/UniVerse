import { Prisma } from '@prisma/client';

// Confession Types
export interface CreateConfessionRequest {
  content: string;
  category_id?: number;
  is_anonymous?: boolean;
}

export interface UpdateConfessionRequest {
  content?: string;
  category_id?: number;
}

export interface ConfessionFilterQuery {
  category_id?: number;
  is_approved?: boolean;
  user_id?: number;
  search?: string;
  date_from?: Date;
  date_to?: Date;
}

// Marketplace Types
export interface CreateMarketplaceItemRequest {
  title: string;
  description?: string;
  price: number;
  category_id?: number;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  pickup_location?: string;
  is_negotiable?: boolean;
}

export interface UpdateMarketplaceItemRequest {
  title?: string;
  description?: string;
  price?: number;
  category_id?: number;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  pickup_location?: string;
  is_negotiable?: boolean;
  status?: 'available' | 'sold' | 'reserved';
}

export interface MarketplaceFilterQuery {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  condition?: string;
  location?: string;
  user_id?: number;
  search?: string;
  status?: 'available' | 'sold' | 'reserved';
}

// Study Group Types
export interface CreateStudyGroupRequest {
  name: string;
  description?: string;
  subject?: string;
  course_code?: string;
  is_private?: boolean;
  max_members?: number;
  requires_approval?: boolean;
}

export interface UpdateStudyGroupRequest {
  name?: string;
  description?: string;
  subject?: string;
  course_code?: string;
  is_private?: boolean;
  max_members?: number;
  requires_approval?: boolean;
}

export interface GroupMembershipRequest {
  user_id: number;
  role?: 'admin' | 'moderator' | 'member';
}

// Event Types
export interface CreateEventRequest {
  title: string;
  description?: string;
  location?: string;
  venue_details?: string;
  start_date: Date;
  end_date?: Date;
  category?: string;
  max_attendees?: number;
  registration_required?: boolean;
  registration_deadline?: Date;
  is_public?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  venue_details?: string;
  start_date?: Date;
  end_date?: Date;
  category?: string;
  max_attendees?: number;
  registration_required?: boolean;
  registration_deadline?: Date;
  is_public?: boolean;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventRSVPRequest {
  rsvp_status: 'going' | 'maybe' | 'not_going';
}

// Notification Types
export interface CreateNotificationRequest {
  user_id: number;
  type: string;
  title: string;
  content?: string;
  related_confession_id?: number;
  related_item_id?: number;
  related_event_id?: number;
  related_group_id?: number;
}

// File Types
export interface CreateFileRequest {
  original_filename: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  entity_type?: string;
  entity_id?: number;
}

// Comment Types
export interface CreateCommentRequest {
  content: string;
  commentable_type: 'confession' | 'marketplace_item' | 'event';
  commentable_id: number;
  parent_comment_id?: number;
}

// Like Types
export interface CreateLikeRequest {
  likeable_type: 'confession' | 'comment';
  likeable_id: number;
}

// Report Types
export interface CreateReportRequest {
  reason: string;
  description?: string;
  reportable_type: 'confession' | 'comment' | 'marketplace_item' | 'user' | 'study_group' | 'event';
  reportable_id: number;
}

// Admin Types
export interface AdminStatsResponse {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    verified: number;
  };
  confessions: {
    total: number;
    pending_approval: number;
    approved_this_month: number;
    flagged: number;
  };
  marketplace: {
    total_items: number;
    active_items: number;
    items_sold_this_month: number;
  };
  events: {
    total: number;
    upcoming: number;
    this_month: number;
  };
  reports: {
    total: number;
    pending: number;
    resolved_this_month: number;
  };
}

// Database Include Types
export type UserWithProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    username: true;
    email: true;
    profile_pic_url: true;
    bio: true;
    year_of_study: true;
    major: true;
    is_verified: true;
    created_at: true;
  };
}>;

export type ConfessionWithDetails = Prisma.ConfessionGetPayload<{
  include: {
    category: true;
    user: {
      select: {
        id: true;
        name: true;
        username: true;
      };
    };
    _count: {
      select: {
        likes: true;
        comments: true;
      };
    };
  };
}>;

export type MarketplaceItemWithDetails = Prisma.MarketplaceItemGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        username: true;
        profile_pic_url: true;
      };
    };
    category: true;
    images: true;
    _count: {
      select: {
        favorites: true;
      };
    };
  };
}>;