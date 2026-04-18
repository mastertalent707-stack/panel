import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminNodeSchema, adminNodeUpdateSchema } from '@/lib/schemas/admin/nodes.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (data: z.infer<typeof adminNodeUpdateSchema>): Promise<z.infer<typeof adminNodeSchema>> => {
  const { data } = await axiosInstance.post('/api/admin/nodes', transformKeysToSnakeCase(data));
  return data.node;
};
