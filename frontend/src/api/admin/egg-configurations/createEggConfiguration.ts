import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import {
  adminEggConfigurationSchema,
  adminEggConfigurationUpdateSchema,
} from '@/lib/schemas/admin/eggConfigurations.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (
  data: z.infer<typeof adminEggConfigurationUpdateSchema>,
): Promise<z.infer<typeof adminEggConfigurationSchema>> => {
  const { data } = await axiosInstance.post('/api/admin/egg-configurations', transformKeysToSnakeCase(data));
  return data.eggConfiguration;
};
