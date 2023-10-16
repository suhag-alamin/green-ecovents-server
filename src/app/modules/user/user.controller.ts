import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

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

export const UserController = {
  getProfileController,
};
