import { axiosInstance } from '@/api/axios.ts';

export default async (userUuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/api/admin/users/${userUuid}/email/reset-password`)
      .then(() => resolve())
      .catch(reject);
  });
};
