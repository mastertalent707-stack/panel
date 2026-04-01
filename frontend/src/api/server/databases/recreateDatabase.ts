import { axiosInstance } from '@/api/axios.ts';

export default async (uuid: string, databaseUuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/api/client/servers/${uuid}/databases/${databaseUuid}/recreate`)
      .then(() => resolve())
      .catch(reject);
  });
};
