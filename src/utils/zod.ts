import { ZodError } from 'zod';

export function flattenErrors(errors: ZodError) {
  return Object.values(errors.flatten().fieldErrors).flat();
}
