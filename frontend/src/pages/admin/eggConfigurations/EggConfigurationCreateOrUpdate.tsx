import { faList, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect, useState } from 'react';
import { ServerRouteDefinition } from 'shared';
import { z } from 'zod';
import createEggConfiguration from '@/api/admin/egg-configurations/createEggConfiguration.ts';
import deleteEggConfiguration from '@/api/admin/egg-configurations/deleteEggConfiguration.ts';
import updateEggConfiguration from '@/api/admin/egg-configurations/updateEggConfiguration.ts';
import getAllEggs from '@/api/admin/nests/getAllEggs.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import { AdminCan } from '@/elements/Can.tsx';
import Code from '@/elements/Code.tsx';
import CollapsibleSection from '@/elements/CollapsibleSection.tsx';
import AdminContentContainer from '@/elements/containers/AdminContentContainer.tsx';
import MultiSelect from '@/elements/input/MultiSelect.tsx';
import NumberInput from '@/elements/input/NumberInput.tsx';
import Switch from '@/elements/input/Switch.tsx';
import TextArea from '@/elements/input/TextArea.tsx';
import TextInput from '@/elements/input/TextInput.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import {
  adminEggConfigurationSchema,
  adminEggConfigurationUpdateSchema,
} from '@/lib/schemas/admin/eggConfigurations.ts';
import { adminEggSchema } from '@/lib/schemas/admin/eggs.ts';
import { eggConfigurationRouteItemSchema } from '@/lib/schemas/generic.ts';
import { useResourceForm } from '@/plugins/useResourceForm.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import RouteOrderEditor from './RouteOrderEditor.tsx';

export default function EggConfigurationCreateOrUpdate({
  contextEggConfiguration,
}: {
  contextEggConfiguration?: z.infer<typeof adminEggConfigurationSchema>;
}) {
  const { addToast } = useToast();
  const { languages } = useGlobalStore();

  const [openModal, setOpenModal] = useState<'delete' | null>(null);
  const [eggs, setEggs] = useState<z.infer<typeof adminEggSchema>[]>([]);
  const [defaultRoutes, setDefaultRoutes] = useState<{
    order: z.infer<typeof eggConfigurationRouteItemSchema>[];
    entries: ServerRouteDefinition[];
  }>({ order: [], entries: [] });

  const form = useForm<z.infer<typeof adminEggConfigurationUpdateSchema>>({
    initialValues: {
      name: '',
      description: null,
      order: 0,
      eggs: [],
      configAllocations: null,
      configRoutes: null,
    },
    validateInputOnBlur: true,
    validate: zod4Resolver(adminEggConfigurationUpdateSchema),
  });

  const { loading, doCreateOrUpdate, doDelete } = useResourceForm<
    z.infer<typeof adminEggConfigurationUpdateSchema>,
    z.infer<typeof adminEggConfigurationSchema>
  >({
    form,
    createFn: () => createEggConfiguration(adminEggConfigurationUpdateSchema.parse(form.getValues())),
    updateFn: contextEggConfiguration
      ? () =>
          updateEggConfiguration(
            contextEggConfiguration.uuid,
            adminEggConfigurationUpdateSchema.parse(form.getValues()),
          )
      : undefined,
    deleteFn: contextEggConfiguration ? () => deleteEggConfiguration(contextEggConfiguration.uuid) : undefined,
    doUpdate: !!contextEggConfiguration,
    basePath: '/admin/egg-configurations',
    resourceName: 'Egg Configuration',
  });

  useEffect(() => {
    if (contextEggConfiguration) {
      form.setValues({
        name: contextEggConfiguration.name,
        description: contextEggConfiguration.description,
        order: contextEggConfiguration.order,
        eggs: contextEggConfiguration.eggs,
        configAllocations: contextEggConfiguration.configAllocations,
        configRoutes: contextEggConfiguration.configRoutes,
      });
    }
  }, [contextEggConfiguration]);

  useEffect(() => {
    getAllEggs()
      .then((eggs) => {
        const eggsArray: z.infer<typeof adminEggSchema>[] = [];
        for (const nestEggs of Object.values(eggs)) {
          eggsArray.push(...nestEggs);
        }

        setEggs(eggsArray);
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  }, []);

  useEffect(() => {
    const serverRoutes = import('@/routers/routes/serverRoutes.ts');

    serverRoutes
      .then((module) => {
        const routes: z.infer<typeof eggConfigurationRouteItemSchema>[] = [];

        for (const route of [...module.default, ...window.extensionContext.extensionRegistry.routes.serverRoutes]) {
          if (route.name === undefined) continue;
          routes.push({
            type: 'route',
            path: route.path,
          });
        }

        setDefaultRoutes({
          order: routes,
          entries: [...module.default, ...window.extensionContext.extensionRegistry.routes.serverRoutes],
        });
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  }, []);

  return (
    <AdminContentContainer
      title={`${contextEggConfiguration ? 'Update' : 'Create'} Egg Configuration`}
      fullscreen={!!contextEggConfiguration}
      titleOrder={2}
    >
      <ConfirmationModal
        opened={openModal === 'delete'}
        onClose={() => setOpenModal(null)}
        title='Confirm Egg Configuration Deletion'
        confirm='Delete'
        onConfirmed={doDelete}
      >
        Are you sure you want to delete <Code>{form.getValues().name}</Code>?
      </ConfirmationModal>

      <form onSubmit={form.onSubmit(() => doCreateOrUpdate(false))}>
        <Stack mt='xs'>
          <Group grow>
            <TextInput
              withAsterisk
              label='Name'
              placeholder='Name'
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <NumberInput
              withAsterisk
              label='Order'
              placeholder='Order'
              key={form.key('order')}
              {...form.getInputProps('order')}
            />
          </Group>

          <Group grow align='start'>
            <MultiSelect
              label='Eggs'
              placeholder='Select Eggs'
              data={eggs.map((egg) => ({
                label: egg.name,
                value: egg.uuid,
              }))}
              searchable
              loading={!eggs.length}
              {...form.getInputProps('eggs')}
            />
            <TextArea
              label='Description'
              placeholder='Description'
              rows={3}
              key={form.key('description')}
              {...form.getInputProps('description')}
            />
          </Group>

          <CollapsibleSection
            icon={<FontAwesomeIcon icon={faNetworkWired} />}
            title='Allocation Configuration'
            enabled={form.values.configAllocations !== null}
            onToggle={(enabled) =>
              form.setFieldValue(
                'configAllocations',
                enabled
                  ? {
                      userSelfAssign: {
                        enabled: false,
                        requirePrimaryAllocation: true,
                        startPort: 1024,
                        endPort: 65535,
                      },
                    }
                  : null,
              )
            }
          >
            <Stack>
              <Group grow>
                <Switch
                  label='User Self Assign'
                  description='Allow users to create their own allocations from a specified port range.'
                  key={form.key('configAllocations.userSelfAssign.enabled')}
                  {...form.getInputProps('configAllocations.userSelfAssign.enabled', { type: 'checkbox' })}
                />

                <Switch
                  label='Require Primary Allocation'
                  description='Whether users must always have a primary allocation.'
                  key={form.key('configAllocations.userSelfAssign.requirePrimaryAllocation')}
                  {...form.getInputProps('configAllocations.userSelfAssign.requirePrimaryAllocation', {
                    type: 'checkbox',
                  })}
                />
              </Group>

              <Group grow>
                <NumberInput
                  label='Automatic Allocation Start'
                  placeholder='Automatic Allocation Start'
                  key={form.key('configAllocations.userSelfAssign.startPort')}
                  {...form.getInputProps('configAllocations.userSelfAssign.startPort')}
                />
                <NumberInput
                  label='Automatic Allocation End'
                  placeholder='Automatic Allocation End'
                  key={form.key('configAllocations.userSelfAssign.endPort')}
                  {...form.getInputProps('configAllocations.userSelfAssign.endPort')}
                />
              </Group>
            </Stack>
          </CollapsibleSection>

          <CollapsibleSection
            icon={<FontAwesomeIcon icon={faList} />}
            title='Route Configuration'
            enabled={form.values.configRoutes !== null}
            onToggle={(enabled) =>
              form.setFieldValue(
                'configRoutes',
                enabled
                  ? {
                      order: defaultRoutes.order,
                    }
                  : null,
              )
            }
          >
            {form.values.configRoutes && (
              <RouteOrderEditor
                value={form.values.configRoutes.order}
                onChange={(order) => form.setFieldValue('configRoutes.order', order)}
                serverRoutes={defaultRoutes.entries}
                languages={languages}
              />
            )}
          </CollapsibleSection>

          <Group>
            <AdminCan
              action={contextEggConfiguration ? 'egg-configurations.update' : 'egg-configurations.create'}
              cantSave
            >
              <Button type='submit' disabled={!form.isValid()} loading={loading}>
                Save
              </Button>
              {!contextEggConfiguration && (
                <Button onClick={() => doCreateOrUpdate(true)} disabled={!form.isValid()} loading={loading}>
                  Save & Stay
                </Button>
              )}
            </AdminCan>
            {contextEggConfiguration && (
              <AdminCan action='egg-configurations.delete' cantDelete>
                <Button color='red' onClick={() => setOpenModal('delete')} loading={loading}>
                  Delete
                </Button>
              </AdminCan>
            )}
          </Group>
        </Stack>
      </form>
    </AdminContentContainer>
  );
}
