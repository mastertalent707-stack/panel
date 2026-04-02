import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from '@mantine/core';
import { makeComponentHookable } from 'shared';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

function AlertError({ error, setError }: { error: string; setError: (error: string) => void }) {
  const { t } = useTranslations();

  return (
    <Alert
      icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
      color='red'
      title={t('common.alert.error', {})}
      onClose={() => setError('')}
      withCloseButton
    >
      {error}
    </Alert>
  );
}

export default makeComponentHookable(AlertError);
