import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';

export default async (): Promise<Record<string, z.infer<typeof adminEggSchema>[]>> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('/api/admin/nests/eggs')
      .then(({ data }) => resolve(data.nestEggs))
      .catch(reject);
  });
};
