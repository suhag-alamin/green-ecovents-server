import { Feedback } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createFeedback = async (data: Feedback): Promise<Feedback> => {
  const result = await prisma.feedback.create({
    data,
  });
  return result;
};

const getFeedbacks = async (): Promise<Feedback[]> => {
  const result = await prisma.feedback.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getSingleFeedback = async (id: string): Promise<Feedback | null> => {
  const result = await prisma.feedback.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateFeedback = async (
  id: string,
  data: Feedback,
): Promise<Feedback | null> => {
  const result = await prisma.feedback.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFeedback = async (id: string): Promise<Feedback | null> => {
  const result = await prisma.feedback.delete({
    where: {
      id,
    },
  });
  return result;
};

const getFeedbacksByUser = async (
  userId: string,
): Promise<Feedback[] | null> => {
  const result = await prisma.feedback.findMany({
    where: {
      userId,
    },
  });
  return result;
};

export const FeedbackService = {
  createFeedback,
  getFeedbacks,
  getSingleFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByUser,
};
