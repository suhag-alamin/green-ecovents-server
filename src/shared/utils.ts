import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

export const isPasswordMatch = async (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const excludePassword = (
  user: User,
  keys: string[],
): Omit<User, string> => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
};
