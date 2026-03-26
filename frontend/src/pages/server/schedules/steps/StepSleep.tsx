import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';
import NumberInput from '@/elements/input/NumberInput.tsx';
import { serverScheduleStepUpdateSchema } from '@/lib/schemas/server/schedules.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

export default function StepSleep({
  form,
}: {
  form: UseFormReturnType<z.infer<typeof serverScheduleStepUpdateSchema>>;
}) {
  const { t } = useTranslations();

  return (
    <NumberInput
      withAsterisk
      label={t('pages.server.schedules.steps.sleep.form.duration', {})}
      placeholder='1000'
      min={1}
      {...form.getInputProps('action.duration')}
    />
  );
}
