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
  const getAllPermissions = () => prisma.permission.findMany();
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
      include: {
        permissions: true,
      },
    });
  };

  const [roles, count, permissions] = await Promise.all([
    getRolesData(),
    getCount(),
    getAllPermissions(),
  ]);

  return { roles, count, permissions };
}

export async function assignPermissionsToRole(
  roleName: string,
  permissionIds: number[]
) {
  try {
    const ids = permissionIds.map((id) => ({ id }));

    await prisma.role.update({
      where: {
        name: roleName,
      },
      data: {
        permissions: {
          set: ids,
        },
      },
    });
  } catch (error) {
    return { error: 'Something went wrong' };
  }
}
