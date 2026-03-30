import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';
import { adminNestSchema } from '@/lib/schemas/admin/nests.ts';

export default async (): Promise<
  { nest: z.infer<typeof adminNestSchema>; eggs: z.infer<typeof adminEggSchema>[] }[]
> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('/api/admin/nests/eggs')
      .then(({ data }) => resolve(data.nests))
      .catch(reject);
  });
};
