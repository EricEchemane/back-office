'use server';

import { prisma } from '@/prisma';

export async function getUsers(args: {
  page: number;
  per_page: number;
  username?: string;
  email?: string;
  status?: number;
  date_from?: string;
  date_to?: string;
}) {
  const { page, per_page, username, email, status } = args;

  const getUsersData = async () => {
    return await prisma.user.findMany({
      skip: page * per_page - per_page,
      take: per_page,
      select: {
        id: true,
        role: true,
        email: true,
        status: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        email,
        status,
        username: {
          contains: username,
          mode: 'insensitive',
        },
        createdAt: {
          gte: args.date_from,
          lte: args.date_to,
        },
      },
    });
  };

  const [users, count] = await Promise.all([
    getUsersData(),
    await prisma.user.count(),
  ]);

  return { users, count };
}
