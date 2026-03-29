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
  return new Promise((resolve, reject) => {
    axiosInstance
      .post('/api/admin/egg-configurations', transformKeysToSnakeCase(data))
      .then(({ data }) => resolve(data.eggConfiguration))
      .catch(reject);
  });
};
