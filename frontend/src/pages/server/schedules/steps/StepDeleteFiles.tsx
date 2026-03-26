import { Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import TagsInput from '@/elements/input/TagsInput.tsx';
import { serverScheduleStepUpdateSchema } from '@/lib/schemas/server/schedules.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import ScheduleDynamicParameterInput from '../ScheduleDynamicParameterInput.tsx';

export default function StepDeleteFiles({
  form,
}: {
  form: UseFormReturnType<z.infer<typeof serverScheduleStepUpdateSchema>>;
}) {
  const { t } = useTranslations();

  return (
    <Stack>
      <ScheduleDynamicParameterInput
        withAsterisk
        label={t('pages.server.schedules.form.rootPath', {})}
        placeholder={t('pages.server.schedules.form.rootPath', {})}
        value={form.getInputProps('action.root').value}
        onChange={(v) => form.setFieldValue('action.root', v)}
      />
      <TagsInput
        withAsterisk
        label={t('pages.server.schedules.steps.deleteFiles.form.filesToDelete', {})}
        placeholder={t('pages.server.schedules.steps.deleteFiles.form.filesToDelete', {})}
        {...form.getInputProps('action.files', { type: 'checkbox' })}
      />
    </Stack>
  );
}
