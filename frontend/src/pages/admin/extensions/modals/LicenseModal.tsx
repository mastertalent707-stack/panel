import { ModalProps } from '@mantine/core';
import Button from '@/elements/Button.tsx';
import Code from '@/elements/Code.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';

interface Props extends ModalProps {
  packageName: string;
  licenseText: string;
  onAccept: () => void;
}

export default function LicenseModal({ packageName, licenseText, onAccept, onClose, ...rest }: Props) {
  return (
    <Modal title='License agreement' size='lg' onClose={onClose} {...rest}>
      <p className='text-sm text-(--mantine-color-dimmed) mb-3'>
        The extension <Code>{packageName}</Code> requires you to accept the following license before it can be
        installed.
      </p>
      <div>{licenseText.md()}</div>

      <ModalFooter>
        <Button color='green' onClick={onAccept}>
          Accept
        </Button>
        <Button variant='default' onClick={() => onClose()}>
          Decline
        </Button>
      </ModalFooter>
    </Modal>
  );
}
