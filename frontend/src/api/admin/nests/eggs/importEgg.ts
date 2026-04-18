import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';

export default async (nestUuid: string, data: object): Promise<z.infer<typeof adminEggSchema>> => {
  const { data } = await axiosInstance.post(`/api/admin/nests/${nestUuid}/eggs/import`, data);
  return data.egg;
};
