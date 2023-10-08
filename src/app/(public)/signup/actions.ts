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
    await prisma.user.create({ data });
  } catch (error: any) {
    if (error?.message?.includes(ErrUsernameUniqueConstraint)) {
      return { error: 'Username is already taken' };
    }
    if (error?.message?.includes(ErrEmailUniqueConstraint)) {
      return { error: 'Email is already taken' };
    }

    // eslint-disable-next-line no-console
    console.error(error); // TODO: make a logger
    return { error: 'Something went wrong, please try again' };
  }
}
