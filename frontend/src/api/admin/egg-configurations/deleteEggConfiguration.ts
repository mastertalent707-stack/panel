import { axiosInstance } from '@/api/axios.ts';

export default async (eggConfigurationUuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`/api/admin/egg-configurations/${eggConfigurationUuid}`)
      .then(() => resolve())
      .catch(reject);
  });
};
