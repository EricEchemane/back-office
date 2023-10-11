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
  {
    email: 'ka@riujdeg.ve',
    password: 'password',
    username: 'Barry',
  },
  {
    email: 'ripge@cosu.nf',
    password: 'password',
    username: 'Rosa',
  },
  {
    email: 'sih@golcil.mx',
    password: 'password',
    username: 'Jayden',
  },
  {
    email: 'suunvo@ajci.gq',
    password: 'password',
    username: 'Dora',
  },
  {
    email: 'lozugonub@ujrevjup.in',
    password: 'password',
    username: 'Louisa',
  },
  {
    email: 'cifjap@alu.edu',
    password: 'password',
    username: 'Isabelle',
  },
  {
    email: 'cir@surda.vg',
    password: 'password',
    username: 'Aiden',
  },
  {
    email: 'folah@licsib.gg',
    password: 'password',
    username: 'Evan',
  },
  {
    email: 'op@cuhuzaba.ph',
    password: 'password',
    username: 'Martha',
  },
  {
    email: 'taozdup@jalra.eg',
    password: 'password',
    username: 'Ellen',
  },
  {
    email: 'loezric@pif.af',
    password: 'password',
    username: 'Melvin',
  },
  {
    email: 'seopa@dekwicjub.zw',
    password: 'password',
    username: 'Kyle',
  },
  {
    email: 'wa@lespajes.im',
    password: 'password',
    username: 'Frank',
  },
  {
    email: 'ugeoceh@zeli.ee',
    password: 'password',
    username: 'Craig',
  },
  {
    email: 'pevbobsut@sac.tk',
    password: 'password',
    username: 'bob',
  },
  {
    email: 'bazac@ucatva.cn',
    password: 'password',
    username: 'Louise',
  },
  {
    email: 'zutopoh@lusjos.ky',
    password: 'password',
    username: 'Sean',
  },
];
const defaultRoles = [
  'bank officer',
  'bank manager',

  'payment officer',
  'payment manager',

  'human resource',

  'customer service',
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

  await Promise.all(
    defaultRoles.map((role) =>
      prisma.role.create({
        data: {
          name: role,
        },
      })
    )
  );

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
