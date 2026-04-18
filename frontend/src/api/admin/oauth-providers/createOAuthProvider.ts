import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { adminOAuthProviderSchema, adminOAuthProviderUpdateSchema } from '@/lib/schemas/admin/oauthProviders.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (
  data: z.infer<typeof adminOAuthProviderUpdateSchema>,
): Promise<z.infer<typeof adminOAuthProviderSchema>> => {
  const { data } = await axiosInstance.post('/api/admin/oauth-providers', transformKeysToSnakeCase(data));
  return data.oauthProvider;
};
