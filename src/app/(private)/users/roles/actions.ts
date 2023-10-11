'use server';

import { prisma } from '@/prisma';

export async function getRoles(args: {
  page: number;
  per_page: number;
  name?: string;
}) {
  const { page, per_page, name } = args;

  const getRolesData = async () => {
    return await prisma.role.findMany({
      skip: page * per_page - per_page,
      take: per_page,
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  };

  const [roles, count] = await Promise.all([
    getRolesData(),
    await prisma.role.count(),
  ]);

  return { roles, count };
}
