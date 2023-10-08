import { Logger } from '@/config/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function handleErrorMessage(error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    const errMessage = getErrorMessage(error.message);
    Logger.raw({ error: errMessage }, 'error');
    return { error: errMessage };
  }

  Logger.raw(error as object, 'unexpected_error');
  return { error: 'Something went wrong, please try again' };
}

function getErrorMessage(errorMessage: string) {
  const ErrUsernameUniqueConstraint =
    'Unique constraint failed on the fields: (`username`)';
  const ErrEmailUniqueConstraint =
    'Unique constraint failed on the fields: (`email`)';

  if (errorMessage.includes(ErrUsernameUniqueConstraint))
    return 'That username is already taken';
  if (errorMessage.includes(ErrEmailUniqueConstraint))
    return 'That email is already taken';
  return 'An unknown error occurred, please try again';
}
