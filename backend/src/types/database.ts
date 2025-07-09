// Database types
export interface Confession {
  id: number;
  userId: number;
  content: string;
  categoryId?: number;
  isApproved: boolean;
  isAnonymous: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceItem {
  id: number;
  userId: number;
  title: string;
  description?: string;
  price: number;
  categoryId?: number;
  condition: string;
  status: string;
  isNegotiable: boolean;
  viewsCount: number;
  favoritesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
