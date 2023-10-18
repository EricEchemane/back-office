'use server';

import { prisma } from '@/prisma';

export async function getRoleByName(name: string) {
  return await prisma.role.findUnique({
    where: {
      name,
    },
    include: {
      permissions: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
}

export async function getPermissionsNotInRole(roleName: string) {
  return await prisma.permission.findMany({
    where: {
      roles: {
        none: {
          name: roleName,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function assignPermissionsToRole(
  roleName: string,
  permissionIds: number[]
) {
  const ids = permissionIds.map((id) => ({ id }));

  return await prisma.role.update({
    where: {
      name: roleName,
    },
    data: {
      permissions: {
        set: ids,
      },
    },
  });
}
