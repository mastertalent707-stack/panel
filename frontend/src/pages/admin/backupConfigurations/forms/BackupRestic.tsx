import { faBroom, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import cronstrue from 'cronstrue/i18n';
import { z } from 'zod';
import getNodes from '@/api/admin/nodes/getNodes.ts';
import ActionIcon from '@/elements/ActionIcon.tsx';
import Button from '@/elements/Button.tsx';
import MultiKeyValueInput from '@/elements/input/MultiKeyValueInput.tsx';
import MultiSelect from '@/elements/input/MultiSelect.tsx';
import NumberInput from '@/elements/input/NumberInput.tsx';
import PasswordInput from '@/elements/input/PasswordInput.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import TitleCard from '@/elements/TitleCard.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { adminBackupConfigurationResticSchema } from '@/lib/schemas/admin/backupConfigurations.ts';
import { adminNodeSchema } from '@/lib/schemas/admin/nodes.ts';
import { useAdminCan } from '@/plugins/usePermissions.ts';
import { useSearchableResource } from '@/plugins/useSearchableResource.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

type ResticForm = UseFormReturnType<z.infer<typeof adminBackupConfigurationResticSchema>>;

function cronDescription(cron: string, language: string): string | null {
  try {
    return cronstrue.toString(cron, { locale: language });
  } catch {
    return null;
  }
}

function PruneJobRow({ form, index }: { form: ResticForm; index: number }) {
  const { language } = useTranslations();
  const canReadNodes = useAdminCan('nodes.read');

  const nodes = useSearchableResource<z.infer<typeof adminNodeSchema>>({
    queryKey: queryKeys.admin.nodes.all(),
    fetcher: (search) => getNodes(1, search),
    canRequest: canReadNodes,
  });

  const description = cronDescription(form.values.pruneJobs[index].cron, language);

  return (
    <Card withBorder padding='md'>
      <Group align='flex-start' wrap='nowrap'>
        <Stack gap='xs' className='flex-1'>
          <TextInput
            withAsterisk
            label='Cron Schedule'
            placeholder='0 0 0 * * *'
            description={description ?? 'Format: second minute hour day month weekday'}
            key={form.key(`pruneJobs.${index}.cron`)}
            {...form.getInputProps(`pruneJobs.${index}.cron`)}
          />
          <MultiSelect
            searchable
            label='Nodes'
            placeholder='Select nodes'
            data={nodes.items.map((node) => ({ value: node.uuid, label: node.name }))}
            searchValue={nodes.search}
            onSearchChange={nodes.setSearch}
            key={form.key(`pruneJobs.${index}.nodes`)}
            {...form.getInputProps(`pruneJobs.${index}.nodes`)}
          />
        </Stack>
        <ActionIcon color='red' variant='subtle' onClick={() => form.removeListItem('pruneJobs', index)}>
          <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
      </Group>
    </Card>
  );
}

export default function BackupRestic({ form }: { form: ResticForm }) {
  const pruneJobs = form.values.pruneJobs ?? [];

  return (
    <Stack gap='xs' mt='md'>
      <Stack gap={0}>
        <Title order={2}>Restic Settings</Title>
        <Divider />
      </Stack>

      <Stack>
        <Group grow>
          <TextInput
            withAsterisk
            label='Repository'
            key={form.key('repository')}
            {...form.getInputProps('repository')}
          />
          <NumberInput
            withAsterisk
            label='Retry Lock Seconds'
            key={form.key('retryLockSeconds')}
            {...form.getInputProps('retryLockSeconds')}
          />
        </Group>

        <PasswordInput
          withAsterisk
          label='Password'
          value={form.values.environment?.RESTIC_PASSWORD || ''}
          onChange={(e) => form.setFieldValue('environment.RESTIC_PASSWORD', e.target.value)}
        />

        <MultiKeyValueInput
          label='Environment Variables'
          allowReordering={false}
          options={form.values.environment}
          onChange={(e) => form.setFieldValue('environment', e)}
          transformValue={(key, value) => (key === 'AWS_SECRET_ACCESS_KEY' ? '*'.repeat(value.length) : value)}
          hideKey={(key) => key === 'RESTIC_PASSWORD'}
        />
      </Stack>

      <TitleCard title='Prune Jobs' icon={<FontAwesomeIcon icon={faBroom} />} className='mt-2'>
        <Stack>
          <Text size='sm' c='dimmed'>
            Scheduled restic prune runs. Each job runs on the configured nodes following its cron schedule.
          </Text>

          {pruneJobs.map((_, index) => (
            <PruneJobRow key={form.key(`pruneJobs.${index}`)} form={form} index={index} />
          ))}

          <Group>
            <Button
              variant='light'
              leftSection={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => form.insertListItem('pruneJobs', { cron: '0 0 0 * * *', nodes: [] })}
            >
              Add Prune Job
            </Button>
          </Group>
        </Stack>
      </TitleCard>
    </Stack>
  );
}
