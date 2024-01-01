import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import {
  excludePassword,
  isPasswordMatch,
  sendMail,
} from '../../../shared/utils';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const signup = async (data: User): Promise<Partial<User>> => {
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

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  // checking deleted users refresh token
  const { id } = verifiedToken;

  // check if user exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // generate new token

  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<Partial<User>> => {
  const { currentPassword, newPassword } = payload;

  // check if user exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.id,
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
    !(await isPasswordMatch(currentPassword, isUserExist.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Current Password is incorrect',
    );
  }

  // check password

  if (
    isUserExist.password &&
    (await isPasswordMatch(newPassword, isUserExist.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Current password can not be same as old password!',
    );
  }

  isUserExist.password = newPassword;

  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  const result = await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      password: newHashPassword,
    },
  });
  const newResult = excludePassword(result, ['password']);

  return newResult;
};

const forgetPassword = async (data: { email: string }): Promise<void> => {
  const { email } = data;
  // check if user exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const token = jwtHelpers.createToken(
    { email: isUserExist.email },
    config.jwt.reset_secret as Secret,
    config.jwt.reset_expires_in as string,
  );

  const url = `${config.client_url}token=${token}`;
  if (isUserExist?.email) {
    await sendMail({
      subject: `Password Reset Request`,
      to: isUserExist.email,
      message: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1F3C4A;">
        <h2 style="color: #3BA27A;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to set a new password. If you did not make this request, please ignore this email.</p>
        <a href="${url}/reset-password/${token}" style="background-color: #3BA27A; color: #EDF4ED; text-decoration: none; padding: 10px 20px; margin: 15px 0; display: inline-block; border-radius: 8px;">Reset Password</a>
        <p>Note: This link will expire in 5 minutes.</p>
        <p>Best Regards,</p>
        <p>GreenEcovents</p>
      </div>
      `,
    });
  }
};

const resetPassword = async (data: {
  token: string;
  newPassword: string;
}): Promise<void> => {
  const { token, newPassword } = data;

  const verifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_secret as Secret,
  );

  if (!verifiedToken.exp) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Token expired');
  }

  if (!verifiedToken.email) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }
  if (!newPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'New password is required');
  }

  // update the user's password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      email: verifiedToken.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthService = {
  signup,
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
