import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminMountSchema, adminMountUpdateSchema } from '@/lib/schemas/admin/mounts.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (data: z.infer<typeof adminMountUpdateSchema>): Promise<z.infer<typeof adminMountSchema>> => {
  const { data } = await axiosInstance.post('/api/admin/mounts', transformKeysToSnakeCase(data));
  return data.mount;
};
