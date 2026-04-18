import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import {
  adminBackupConfigurationSchema,
  adminBackupConfigurationUpdateSchema,
} from '@/lib/schemas/admin/backupConfigurations.ts';
import { transformKeysToSnakeCase } from '@/lib/transformers.ts';

export default async (
  data: z.infer<typeof adminBackupConfigurationUpdateSchema>,
): Promise<z.infer<typeof adminBackupConfigurationSchema>> => {
  const { data } = await axiosInstance.post('/api/admin/backup-configurations', {
    ...transformKeysToSnakeCase(data),
    backup_configs: data.backupConfigs
      ? {
          ...transformKeysToSnakeCase(data.backupConfigs),
          restic: data.backupConfigs.restic
            ? {
                ...transformKeysToSnakeCase(data.backupConfigs.restic),
                environment: data.backupConfigs.restic.environment,
              }
            : null,
        }
      : null,
  });
  return data.backupConfiguration;
};
