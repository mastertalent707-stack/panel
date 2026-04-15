import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { publicSettingsSchema } from '@/lib/schemas/settings.ts';

export default async (): Promise<{ settings: z.infer<typeof publicSettingsSchema>; serverTime: Date }> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('/api/settings')
      .then(({ data, headers }) => resolve({ settings: data, serverTime: new Date(headers['date']) }))
      .catch(reject);
  });
};
