import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { userCommandSnippetSchema, userCommandSnippetUpdateSchema } from '@/lib/schemas/user/commandSnippets.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (
  data: z.infer<typeof userCommandSnippetUpdateSchema>,
): Promise<z.infer<typeof userCommandSnippetSchema>> => {
  const { data } = await axiosInstance.post('/api/client/account/command-snippets', transformKeysToSnakeCase(data));
  return data.commandSnippet;
};
