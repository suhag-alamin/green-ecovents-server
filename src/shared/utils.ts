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

export const asyncForEach = async (array: any, callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};
