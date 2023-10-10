import { PrismaClient } from '@prisma/client';
import hasher from 'bcryptjs';
const prisma = new PrismaClient();

const defaultPermissions = ['users.read', 'roles.read', 'permissions.read'];
const defaultUsers = [
  {
    email: 'johndoe@example.com',
    password: 'password',
    username: 'johndoe',
  },
  {
    email: 'uhja@zan.eh',
    password: 'password',
    username: 'Clayton',
  },
  {
    email: 'ni@adked.ma',
    password: 'password',
    username: 'Myra',
  },
];

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

  const superuser = await prisma.role.create({
    data: {
      name: 'superuser',
      permissions: {
        connect: permissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  await prisma.user.createMany({
    data: defaultUsers.map((user) => ({
      ...user,
      password: hasher.hashSync(user.password, 10),
    })),
  });

  await prisma.user.create({
    data: {
      email: 'eechemane29@gmail.com',
      password: hasher.hashSync('asdasd', 10),
      username: 'echemane',
      status: 1,
      role: {
        connect: {
          id: superuser.id,
        },
      },
    },
  });
}

main();
