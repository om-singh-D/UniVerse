import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { marketplaceService } from '@/services/marketplace.service';
import { sendSuccess, sendError, sendNotFound, sendCreateSuccess } from '@/utils/response';
import { ErrorCodes } from '@/types';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await marketplaceService.getCategories();
    sendSuccess(res, categories, 'Marketplace categories retrieved successfully');
  } catch (error: any) {
    sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR, error.message, 500);
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    const category = await marketplaceService.createCategory({ name, description });
    sendCreateSuccess(res, category, 'Marketplace category created successfully');
  } catch (error: any) {
    sendError(res, ErrorCodes.VALIDATION_ERROR, error.message, 400);
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await marketplaceService.updateCategory(parseInt(id), updateData);
    if (!category) {
      sendNotFound(res, 'Marketplace category');
      return;
    }
    
    sendSuccess(res, category, 'Marketplace category updated successfully');
  } catch (error: any) {
    sendError(res, ErrorCodes.VALIDATION_ERROR, error.message, 400);
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await marketplaceService.deleteCategory(parseInt(id));
    sendSuccess(res, null, 'Marketplace category deleted successfully', 204);
  } catch (error: any) {
    sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR, error.message, 500);
  }
};