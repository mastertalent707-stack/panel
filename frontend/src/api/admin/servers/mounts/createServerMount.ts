import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminServerMountSchema } from '@/lib/schemas/admin/servers.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

interface Data {
  mountUuid: string;
}

export default async (serverUuid: string, data: Data): Promise<z.infer<typeof adminServerMountSchema>> => {
  const { data } = await axiosInstance.post(`/api/admin/servers/${serverUuid}/mounts`, transformKeysToSnakeCase(data));
  return data;
};
