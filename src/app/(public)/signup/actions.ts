'use server';

import { prisma } from '@/prisma';
import { NewUser, newUserSchema } from './zod';
import hasher from 'bcryptjs';
import { flattenErrors } from '@/utils/zod';
import { handleErrorMessage } from '@/utils/error_handling';

export async function createUser(payload: NewUser) {
  try {
    const validation = newUserSchema.safeParse(payload);
    if (!validation.success) {
      return {
        error: flattenErrors(validation.error).at(0),
      };
    }

    const { email, username, password } = payload;
    const salt = await hasher.genSalt(10);
    await prisma.user.create({
      data: {
        email,
        username,
        password: await hasher.hash(password, salt),
      },
    });
  } catch (error) {
    return handleErrorMessage(error);
  }
}
