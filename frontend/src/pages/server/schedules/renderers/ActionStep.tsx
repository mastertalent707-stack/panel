import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { z } from 'zod';
import AnimatedHourglass from '@/elements/AnimatedHourglass.tsx';
import Badge from '@/elements/Badge.tsx';
import Card from '@/elements/Card.tsx';
import Group from '@/elements/Group.tsx';
import Text from '@/elements/Text.tsx';
import ThemeIcon from '@/elements/ThemeIcon.tsx';
import Timeline from '@/elements/Timeline.tsx';
import Tooltip from '@/elements/Tooltip.tsx';
import { scheduleStepIconMapping, scheduleStepLabelMapping } from '@/lib/enums.ts';
import { serverScheduleStepSchema } from '@/lib/schemas/server/schedules.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import ActionRenderer from './ActionRenderer.tsx';

interface ActionStepProps {
  step: z.infer<typeof serverScheduleStepSchema>;
  isActive: boolean;
}

export default function ActionStep({ step, isActive }: ActionStepProps) {
  const { t } = useTranslations();

  return (
    <Timeline.Item
      bullet={
        isActive ? (
          <AnimatedHourglass />
        ) : (
          <FontAwesomeIcon icon={scheduleStepIconMapping[step.action.type]} size='sm' />
        )
      }
      title={
        <Group gap='sm' align='start'>
          <Text fw={600}>{scheduleStepLabelMapping[step.action.type]()} </Text>
          {isActive && <Badge ml='md'>{t('pages.server.schedules.view.badge.running', {})}</Badge>}
          {step.error && (
            <Tooltip label={step.error}>
              <ThemeIcon size='sm' color='red' className='cursor-help'>
                <FontAwesomeIcon icon={faExclamationTriangle} size='xs' />
              </ThemeIcon>
            </Tooltip>
          )}
        </Group>
      }
    >
      <Card p='sm' mt='xs'>
        <ActionRenderer action={step.action} mode='detailed' />
      </Card>
    </Timeline.Item>
  );
}
