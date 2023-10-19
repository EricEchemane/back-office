'use server';

import { prisma } from '@/prisma';
import { handleErrorMessage } from '@/utils/error_handling';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function getPermissions(args: {
  page: number;
  per_page: number;
  name?: string;
}) {
  const { page, per_page, name } = args;
  const table = prisma.permission;

  const getCount = () => table.count();
  const getRows = async () => {
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

  const [permissions, count] = await Promise.all([getRows(), getCount()]);

  return { permissions, count };
}

export async function createNewPermission(name: string) {
  try {
    await prisma.permission.create({
      data: {
        name,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function updatePermission(id: number, name: string) {
  try {
    await prisma.permission.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllPermissions() {
  return await prisma.permission.findMany();
}

function handleError(error: unknown) {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error?.message.includes('Unique constraint failed on the fields: (`name`)')
  ) {
    return { error: `"${name}" already exist` };
  }

  return handleErrorMessage(error);
}
