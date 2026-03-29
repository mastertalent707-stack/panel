import { z } from 'zod';
import { roleSchema } from '@/lib/schemas/user.ts';

export const adminRoleUpdateSchema = z.lazy(() =>
  roleSchema.omit({
    uuid: true,
    created: true,
  }),
);
