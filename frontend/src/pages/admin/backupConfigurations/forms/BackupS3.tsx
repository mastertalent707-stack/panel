import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import Divider from '@/elements/Divider.tsx';
import Group from '@/elements/Group.tsx';
import PasswordInput from '@/elements/input/PasswordInput.tsx';
import Select from '@/elements/input/Select.tsx';
import SizeInput from '@/elements/input/SizeInput.tsx';
import Switch from '@/elements/input/Switch.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import Stack from '@/elements/Stack.tsx';
import Title from '@/elements/Title.tsx';
import { compressionTypeLabelMapping } from '@/lib/enums.ts';
import { adminBackupConfigurationS3Schema } from '@/lib/schemas/admin/backupConfigurations.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function BackupS3({
  form,
}: {
  form: UseFormReturnType<z.infer<typeof adminBackupConfigurationS3Schema>>;
}) {
  const { t } = useTranslations();

  return (
    <Stack gap='xs' mt='md'>
      <Stack gap={0}>
        <Title order={2}>{t('pages.admin.backupConfigurations.tabs.general.page.s3.title', {})}</Title>
        <Divider />
      </Stack>

      <Stack>
        <Group grow>
          <TextInput
            withAsterisk
            label={t('common.form.accessKey', {})}
            key={form.key('accessKey')}
            {...form.getInputProps('accessKey')}
          />
          <PasswordInput
            withAsterisk
            label={t('common.form.secretKey', {})}
            key={form.key('secretKey')}
            {...form.getInputProps('secretKey')}
          />
        </Group>

        <Group grow>
          <TextInput
            withAsterisk
            label={t('common.form.bucket', {})}
            key={form.key('bucket')}
            {...form.getInputProps('bucket')}
          />
          <TextInput
            withAsterisk
            label={t('common.form.region', {})}
            key={form.key('region')}
            {...form.getInputProps('region')}
          />
        </Group>

        <Group grow>
          <TextInput
            withAsterisk
            label={t('common.form.endpoint', {})}
            key={form.key('endpoint')}
            {...form.getInputProps('endpoint')}
          />
          <SizeInput
            withAsterisk
            label={t('pages.admin.backupConfigurations.tabs.general.page.s3.form.partSize', {})}
            mode='b'
            min={0}
            value={form.values.partSize}
            onChange={(v) => form.setFieldValue('partSize', v)}
          />
        </Group>

        <Group grow>
          <Select
            withAsterisk
            label={t('pages.admin.backupConfigurations.tabs.general.page.s3.form.compressionType', {})}
            data={Object.entries(compressionTypeLabelMapping).map(([value, label]) => ({
              value,
              label,
            }))}
            key={form.key('compressionType')}
            {...form.getInputProps('compressionType')}
          />

          <Switch
            label={t('pages.admin.backupConfigurations.tabs.general.page.s3.form.pathStyle', {})}
            {...form.getInputProps('pathStyle', { type: 'checkbox' })}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
