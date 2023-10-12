import { Event, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IEventFilters } from './event.interface';
import { eventSearchableFields } from './event.constant';

const createEvent = async (data: Event): Promise<Event> => {
  const result = await prisma.event.create({
    data,
  });
  return result;
};

const getEvents = async (
  filters: IEventFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Event[]>> => {
  const { query, ...filtersData } = filters;

  const andConditions = [];

  if (query) {
    andConditions.push({
      OR: eventSearchableFields.map(field => ({
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

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.event.findMany({
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
  });
  const total = await prisma.event.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleEvent = async (id: string): Promise<Event | null> => {
  const result = await prisma.event.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateEvent = async (id: string, data: Event): Promise<Event | null> => {
  const result = await prisma.event.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteEvent = async (id: string): Promise<Event | null> => {
  const result = await prisma.event.delete({
    where: {
      id,
    },
  });
  return result;
};

export const EventService = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
