// App constants
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export const CONFESSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const MARKETPLACE_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved',
  HIDDEN: 'hidden'
} as const;

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const NOTIFICATION_TYPES = {
  CONFESSION_APPROVED: 'confession_approved',
  CONFESSION_REJECTED: 'confession_rejected',
  ITEM_SOLD: 'item_sold',
  EVENT_REMINDER: 'event_reminder',
  GROUP_INVITATION: 'group_invitation',
  NEW_MESSAGE: 'new_message'
} as const;

export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video'
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword'];
