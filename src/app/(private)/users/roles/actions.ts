'use server';

import { prisma } from '@/prisma';

export async function getRoles(args: {
  page: number;
  per_page: number;
  name?: string;
}) {
  const { page, per_page, name } = args;
  const table = prisma.role;

  const getCount = () => table.count();
  const getRolesData = async () => {
    return await table.findMany({
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

  const [roles, count] = await Promise.all([getRolesData(), getCount()]);

  return { roles, count };
}
