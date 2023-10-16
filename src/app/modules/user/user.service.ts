import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { excludePassword } from '../../../shared/utils';

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

export const UserService = {
  getProfile,
};
