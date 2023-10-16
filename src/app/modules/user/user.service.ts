import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { excludePassword } from '../../../shared/utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getProfile = async (
  user: JwtPayload | null,
): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (result?.email) {
    const newResult = excludePassword(result, ['password']);

    return newResult;
  }
  return null;
};
const updateProfile = async (
  user: JwtPayload | null,
  data: Partial<User>,
): Promise<Partial<User> | null> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.user.update({
    where: {
      id: user?.id,
    },
    data,
  });

  if (result?.email) {
    const newResult = excludePassword(result, ['password']);

    return newResult;
  }
  return null;
};

export const UserService = {
  getProfile,
  updateProfile,
};
