import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminEggConfigScriptSchema, adminEggSchema, adminEggUpdateSchema } from '@/lib/schemas/admin/eggs.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (
  nestUuid: string,
  data: z.infer<typeof adminEggUpdateSchema> & { configScript: z.infer<typeof adminEggConfigScriptSchema> },
): Promise<z.infer<typeof adminEggSchema>> => {
  const { data } = await axiosInstance.post(`/api/admin/nests/${nestUuid}/eggs`, {
    ...transformKeysToSnakeCase(data),
    docker_images: data.dockerImages,
  });
  return data.egg;
};
