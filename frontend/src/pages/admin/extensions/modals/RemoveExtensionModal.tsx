import { ModalProps, Stack } from '@mantine/core';
import { useState } from 'react';
import { z } from 'zod';
import Button from '@/elements/Button.tsx';
import Code from '@/elements/Code.tsx';
import Switch from '@/elements/input/Switch.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import { adminBackendExtensionSchema } from '@/lib/schemas/admin/backendExtension.ts';

interface Props extends ModalProps {
  extension: z.infer<typeof adminBackendExtensionSchema>;
  onRemove: (removeMigrations: boolean) => void;
}

export default function RemoveExtensionModal({ extension, onRemove, onClose, ...rest }: Props) {
  const [removeMigrations, setRemoveMigrations] = useState(false);

  return (
    <Modal title='Remove extension' onClose={onClose} {...rest}>
      <p>
        Are you sure you want to remove the extension <Code>{extension.metadataToml.packageName}</Code>? This action
        cannot be undone.
      </p>

      <Stack mt='md'>
        <Switch
          label='Do you want to remove & rollback the database migrations of this extension?'
          name='remove_migrations'
          defaultChecked={removeMigrations}
          onChange={(e) => setRemoveMigrations(e.target.checked)}
        />
      </Stack>

      <ModalFooter>
        <Button color='red' onClick={() => onRemove(removeMigrations)}>
          Delete
        </Button>
        <Button variant='default' onClick={() => onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
