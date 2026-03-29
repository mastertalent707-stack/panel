import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminEggConfigurationSchema } from '@/lib/schemas/admin/eggConfigurations.ts';

export default async (eggConfigurationUuid: string): Promise<z.infer<typeof adminEggConfigurationSchema>> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/api/admin/egg-configurations/${eggConfigurationUuid}`)
      .then(({ data }) => resolve(data.eggConfiguration))
      .catch(reject);
  });
};
