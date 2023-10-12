import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CategoryService } from './category.service';
import sendResponse from '../../../shared/sendResponse';
import { Category } from '@prisma/client';
import httpStatus from 'http-status';

const createCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req.body);

    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category created successfully!',
      data: result,
    });
  },
);

export const CategoryController = {
  createCategoryController,
};
