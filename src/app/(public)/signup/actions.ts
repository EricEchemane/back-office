'use server';

import { prisma } from '@/prisma';
import { NewUser } from './zod';
import hasher from 'bcryptjs';

const ErrUsernameUniqueConstraint =
  'Unique constraint failed on the fields: (`username`)';
const ErrEmailUniqueConstraint =
  'Unique constraint failed on the fields: (`email`)';

export async function createUser({ confirmPassword, ...data }: NewUser) {
  try {
    const salt = await hasher.genSalt(10);
    const hashedPassword = await hasher.hash(data.password, salt);
    data.password = hashedPassword;
    const newUser = await prisma.user.create({ data });
    return { ok: true, userId: newUser.id };
  } catch (error: any) {
    if (error?.message?.includes(ErrUsernameUniqueConstraint)) {
      return { ok: false, error: 'Username is already taken' };
    }
    if (error?.message?.includes(ErrEmailUniqueConstraint)) {
      return { ok: false, error: 'Email is already taken' };
    }

    // eslint-disable-next-line no-console
    console.error(error); // TODO: make a logger
    return { ok: false, error: 'Something went wrong, please try again' };
  }
}
