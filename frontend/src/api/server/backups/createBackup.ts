import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serverBackupCreateSchema, serverBackupSchema } from '@/lib/schemas/server/backups.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (
  uuid: string,
  data: z.infer<typeof serverBackupCreateSchema>,
): Promise<z.infer<typeof serverBackupSchema>> => {
  const { data } = await axiosInstance.post(`/api/client/servers/${uuid}/backups`, transformKeysToSnakeCase(data));
  return data.backup;
};
