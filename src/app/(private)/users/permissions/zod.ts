import { z } from 'zod';

export const newPermissionSchema = z
  .object({
    name: z.string(),
  })
  .refine(({ name }) => name.split('.').length > 1, {
    message:
      "Permission name must be in the format 'resource.action' (e.g. 'users.create')",
    path: ['name'],
  });
export type NewPermission = z.infer<typeof newPermissionSchema>;

export const updatePermissionSchema = newPermissionSchema;
export type UpdatePermission = z.infer<typeof updatePermissionSchema>;
