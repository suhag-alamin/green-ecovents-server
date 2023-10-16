import { Prisma, User, UserRole } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { adminSearchableFields } from './admin.constant';
import { IAdminFilters } from './admin.interface';

const getAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { query, ...filtersData } = filters;

  const andConditions = [];

  andConditions.push({
    AND: {
      role: UserRole.ADMIN,
    },
  });

  if (query) {
    andConditions.push({
      OR: adminSearchableFields.map(field => ({
        [field]: {
          contains: query,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            equals: (filtersData as any)[key],
          },
        };
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      blogPosts: true,
      FAQs: true,
      events: true,
    },
  });
  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const AdminService = {
  getAdmins,
};
