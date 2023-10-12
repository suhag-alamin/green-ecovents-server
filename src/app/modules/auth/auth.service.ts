import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import { excludePassword } from '../../../shared/utils';

const signup = async (data: User): Promise<Partial<User>> => {
  console.log(data);
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds),
  );

  const result = await prisma.user.create({
    data,
  });
  const newResult = excludePassword(result, ['password']);

  return newResult;
};

export const AuthService = {
  signup,
};
