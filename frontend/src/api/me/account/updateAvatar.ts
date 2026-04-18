import { axiosInstance } from '@/api/axios.ts';

export default async (data: Blob): Promise<string> => {
  const { data } = await axiosInstance.put('/api/client/account/avatar', data, {
    headers: {
      'Content-Type': data.type,
    },
  });
  return data.avatar;
};
