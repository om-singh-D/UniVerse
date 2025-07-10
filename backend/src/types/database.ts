export interface CreateConfessionRequest {
  content: string;
  category_id?: number;
  is_anonymous?: boolean;
}

export interface CreateMarketplaceItemRequest {
  title: string;
  description?: string;
  price: number;
  category_id?: number;
  condition?: string;
  pickup_location?: string;
  is_negotiable?: boolean;
}

export interface CreateStudyGroupRequest {
  name: string;
  description?: string;
  subject?: string;
  course_code?: string;
  is_private?: boolean;
  max_members?: number;
  requires_approval?: boolean;
}

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