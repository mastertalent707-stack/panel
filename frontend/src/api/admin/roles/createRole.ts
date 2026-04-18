import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminRoleUpdateSchema } from '@/lib/schemas/admin/roles.ts';
import { roleSchema } from '@/lib/schemas/user.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (data: z.infer<typeof adminRoleUpdateSchema>): Promise<z.infer<typeof roleSchema>> => {
  const { data } = await axiosInstance.post('/api/admin/roles', {
    ...transformKeysToSnakeCase(data),
    admin_permissions: Array.from(data.adminPermissions),
    server_permissions: Array.from(data.serverPermissions),
  });
  return data.role;
};
