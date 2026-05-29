import { ModalProps, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import getAvailableNodeAllocations from '@/api/admin/nodes/allocations/getAvailableNodeAllocations.ts';
import createServerAllocation from '@/api/admin/servers/allocations/createServerAllocation.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Button from '@/elements/Button.tsx';
import MultiSelect from '@/elements/input/MultiSelect.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { adminNodeAllocationSchema } from '@/lib/schemas/admin/nodes.ts';
import { adminServerSchema } from '@/lib/schemas/admin/servers.ts';
import { formatAllocation } from '@/lib/server.ts';
import { useSearchableResource } from '@/plugins/useSearchableResource.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useAdminStore } from '@/stores/admin.tsx';

export default function ServerAllocationAddModal({
  server,
  opened,
  onClose,
}: ModalProps & { server: z.infer<typeof adminServerSchema> }) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const { addServerAllocation } = useAdminStore();

  const [loading, setLoading] = useState(false);
  const [selectedAllocationUuids, setSelectedAllocationUuids] = useState<string[]>([]);

  const availableAllocations = useSearchableResource<z.infer<typeof adminNodeAllocationSchema>>({
    queryKey: queryKeys.admin.nodes.allocations(server.node.uuid),
    fetcher: (search) => getAvailableNodeAllocations(server.node.uuid, 1, search),
  });

  useEffect(() => {
    if (!opened) {
      availableAllocations.setSearch('');
      setSelectedAllocationUuids([]);
    }
  }, [opened]);

  const doAdd = () => {
    setLoading(true);

    let didError = false;
    for (const allocationUuid of selectedAllocationUuids) {
      createServerAllocation(server.uuid, { allocationUuid })
        .then((allocation) => {
          addServerAllocation(allocation);
        })
        .catch((msg) => {
          addToast(httpErrorToHuman(msg), 'error');
          didError = true;
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (!didError) {
      addToast(
        t('pages.admin.servers.tabs.allocations.page.toast.added', { count: selectedAllocationUuids.length }),
        'success',
      );
      onClose();
    }
  };

  return (
    <Modal title={t('pages.admin.servers.tabs.allocations.page.modal.add.title', {})} onClose={onClose} opened={opened}>
      <Stack>
        <MultiSelect
          withAsterisk
          label={t('pages.admin.servers.tabs.allocations.page.modal.add.form.allocations', {})}
          placeholder={t('pages.admin.servers.tabs.allocations.page.modal.add.form.allocations', {})}
          value={selectedAllocationUuids}
          onChange={(value) => setSelectedAllocationUuids(value)}
          data={availableAllocations.items.map((alloc) => ({
            label: formatAllocation(alloc),
            value: alloc.uuid,
          }))}
          searchable
          searchValue={availableAllocations.search}
          onSearchChange={availableAllocations.setSearch}
          loading={availableAllocations.loading}
        />

        <ModalFooter>
          <Button onClick={doAdd} loading={loading} disabled={!selectedAllocationUuids.length}>
            {t('pages.admin.servers.tabs.allocations.page.modal.add.button.add', {
              count: selectedAllocationUuids.length,
            })}
          </Button>
          <Button variant='default' onClick={onClose}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Stack>
    </Modal>
  );
}
