import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { User } from '@prisma/client';

const getProfileController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await UserService.getProfile(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});
const updateProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.updateProfile(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile updated successfully!',
      data: result,
    });
  },
);

const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUser(req.params.id);
  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  });
});

export const UserController = {
  getProfileController,
  updateProfileController,
  deleteUserController,
};
