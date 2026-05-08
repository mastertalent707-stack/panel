import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { makeComponentHookable } from 'shared';
import Copyright from '@/elements/Copyright.tsx';
import { announcementTypeColorMapping, announcementTypeIconMapping } from '@/lib/enums.ts';
import { useAuth } from '@/providers/AuthProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import Alert from './Alert.tsx';

interface LayoutProps {
  children: ReactNode;
  isNormal: boolean;
}

function Container({ children, isNormal }: LayoutProps) {
  const { t, language } = useTranslations();
  const { impersonating } = useAuth();
  const { announcements } = useGlobalStore();

  return (
    <div
      className={
        isNormal
          ? 'flex flex-col justify-between min-w-full h-full'
          : 'flex flex-col justify-between h-full overflow-auto'
      }
    >
      <div>
        {impersonating && (
          <Alert icon={<FontAwesomeIcon icon={faUserCheck} />} color='yellow' className='mt-2 mx-2'>
            {t('elements.container.alert.impersonating', {})}
          </Alert>
        )}
        {announcements.map((announcement) => (
          <Alert
            icon={<FontAwesomeIcon icon={announcementTypeIconMapping[announcement.type]} />}
            key={announcement.uuid}
            title={announcement.titleTranslations[language] ?? announcement.title}
            color={announcementTypeColorMapping[announcement.type]}
            className='mt-2 mx-2'
          >
            {(announcement.contentTranslations[language] ?? announcement.content).md()}
          </Alert>
        ))}

        {children}
      </div>
      <div className='my-2 ml-auto mr-12'>
        <Copyright className='justify-end' />
      </div>
    </div>
  );
}

export default makeComponentHookable(Container);
