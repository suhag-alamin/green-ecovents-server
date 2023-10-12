import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import { excludePassword, isPasswordMatch } from '../../../shared/utils';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';

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

const login = async (data: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = data;

  // check if user exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
      role: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check password

  if (
    isUserExist.password &&
    !(await isPasswordMatch(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  const { id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  signup,
  login,
};
