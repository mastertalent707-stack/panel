import { Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import Switch from '@/elements/input/Switch.tsx';
import { serverScheduleStepUpdateSchema } from '@/lib/schemas/server/schedules.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import ScheduleDynamicParameterInput from '../ScheduleDynamicParameterInput.tsx';

export default function StepSendCommand({
  form,
}: {
  form: UseFormReturnType<z.infer<typeof serverScheduleStepUpdateSchema>>;
}) {
  const { t } = useTranslations();

  return (
    <Stack>
      <ScheduleDynamicParameterInput
        withAsterisk
        label={t('pages.server.schedules.steps.sendCommand.form.command', {})}
        placeholder={t('pages.server.schedules.steps.sendCommand.form.command', {})}
        value={form.getInputProps('action.command').value}
        onChange={(v) => form.setFieldValue('action.command', v)}
      />
      <Switch
        label={t('pages.server.schedules.form.ignoreFailure', {})}
        {...form.getInputProps('action.ignoreFailure', { type: 'checkbox' })}
      />
    </Stack>
  );
}
