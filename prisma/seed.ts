import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultPermissions = ['users.read', 'roles.read', 'permissions.read'];

async function main() {
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  const permissions = await Promise.all(
    defaultPermissions.map((permission) =>
      prisma.permission.upsert({
        where: {
          name: permission,
        },
        update: {},
        create: {
          name: permission,
        },
      })
    )
  );

  await prisma.role.create({
    data: {
      name: 'superuser',
      permissions: {
        connect: permissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });
}

main();
