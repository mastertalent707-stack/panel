import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { z } from 'zod';
import getEggConfiguration from '@/api/admin/egg-configurations/getEggConfiguration.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import AdminContentContainer from '@/elements/containers/AdminContentContainer.tsx';
import Spinner from '@/elements/Spinner.tsx';
import SubNavigation from '@/elements/SubNavigation.tsx';
import { adminEggConfigurationSchema } from '@/lib/schemas/admin/eggConfigurations.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import EggConfigurationCreateOrUpdate from './EggConfigurationCreateOrUpdate.tsx';

export default function EggConfigurationView() {
  const params = useParams<'id'>();
  const { addToast } = useToast();
  const [eggConfiguration, setEggConfiguration] = useState<z.infer<typeof adminEggConfigurationSchema> | null>(null);

  useEffect(() => {
    if (params.id) {
      getEggConfiguration(params.id)
        .then((eggConfiguration) => {
          setEggConfiguration(eggConfiguration);
        })
        .catch((msg) => {
          addToast(httpErrorToHuman(msg), 'error');
        });
    }
  }, [params.id]);

  return !eggConfiguration ? (
    <Spinner.Centered />
  ) : (
    <AdminContentContainer title={eggConfiguration.name}>
      <SubNavigation
        baseUrl={`/admin/egg-configurations/${params.id}`}
        items={[
          {
            name: 'General',
            icon: faCog,
            path: `/`,
            element: <EggConfigurationCreateOrUpdate contextEggConfiguration={eggConfiguration} />,
          },
        ]}
      />
    </AdminContentContainer>
  );
}
