import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Group, Stack, Title, Tooltip } from '@mantine/core';
import jsYaml from 'js-yaml';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import getNodes from '@/api/admin/nodes/getNodes.ts';
import { axiosInstance, httpErrorToHuman } from '@/api/axios.ts';
import Alert from '@/elements/Alert.tsx';
import AlertError from '@/elements/alerts/AlertError.tsx';
import Button from '@/elements/Button.tsx';
import Card from '@/elements/Card.tsx';
import Code from '@/elements/Code.tsx';
import HljsCode from '@/elements/HljsCode.tsx';
import { handleCopyToClipboard } from '@/lib/copy.ts';
import { getNodeConfiguration, getNodeConfigurationCommand } from '@/lib/node.ts';
import { adminNodeSchema } from '@/lib/schemas/admin/nodes.ts';
import { useToast } from '@/providers/contexts/toastContext.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { OobeComponentProps } from '@/routers/OobeRouter.tsx';

export default function OobeNodeConfigure({ onNext, skipFrom }: OobeComponentProps) {
  const { addToast } = useToast();
  const { t } = useTranslations();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [node, setNode] = useState<z.infer<typeof adminNodeSchema> | null>(null);
  const [nodeConfiguration, setNodeConfiguration] = useState({});
  const [command, setCommand] = useState('');

  useEffect(() => {
    getNodes(1)
      .then((nodes) => {
        if (nodes.total > 0) {
          setNode(nodes.data[0]);
          setLoading(false);
        } else {
          setError(t('pages.oobe.nodeConfiguration.error.noNodes', {}));
        }
      })
      .catch((msg) => {
        setError(httpErrorToHuman(msg));
      });
  }, []);

  useEffect(() => {
    if (!node) return;

    const remote = window.location.origin;
    const apiPort = parseInt(new URL(node.url).port || '8080');
    const sftpPort = node.sftpPort;

    setNodeConfiguration(getNodeConfiguration({ node, remote, apiPort, sftpPort }));
    setCommand(getNodeConfigurationCommand({ node, remote, apiPort, sftpPort }));
  }, [node]);

  const verifyNode = async () => {
    if (!node) return;

    setLoading(true);
    setIsVerified(false);

    axiosInstance
      .get(`${new URL(node.publicUrl ?? node.url).origin}/api/system`, {
        headers: {
          Authorization: `Bearer ${node.token}`,
        },
      })
      .then(({ data }) => {
        if (data.version) {
          setIsVerified(true);
          setError('');
        }
      })
      .catch((msg) => {
        console.error('Error while connecting to node', msg);
        setError(t('pages.oobe.nodeConfiguration.error.connectionError', {}));
      })
      .finally(() => setLoading(false));
  };

  return (
    <Stack gap='lg'>
      <Title order={2}>{t('pages.oobe.nodeConfiguration.title', {})}</Title>

      <div className='max-w-2xl flex flex-col mx-auto gap-4'>
        {error && <AlertError error={error} setError={setError} />}
        {isVerified && !error && (
          <Alert icon={<FontAwesomeIcon icon={faCheck} />} color='green' title={t('common.alert.success', {})}>
            {t('pages.oobe.nodeConfiguration.successMessage', {})}
          </Alert>
        )}

        <Card>
          <div className='flex flex-col md:col-span-3'>
            <HljsCode
              languageName='yaml'
              language={() => import('highlight.js/lib/languages/yaml').then((mod) => mod.default)}
            >
              {jsYaml.dump(nodeConfiguration)}
            </HljsCode>

            <div className='mt-2'>
              <p>
                Place this into the configuration file at <Code>/etc/pterodactyl/config.yml</Code> or run
              </p>
              <Group gap='xs' align='flex-start' wrap='nowrap' className='mt-2'>
                <Code block className='flex-1'>
                  {command}
                </Code>
                <Tooltip label='Copy command'>
                  <ActionIcon variant='subtle' onClick={handleCopyToClipboard(command, addToast)} size='lg'>
                    <FontAwesomeIcon icon={faCopy} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </div>
        </Card>

        <Button loading={loading} leftSection={<FontAwesomeIcon icon={faCheck} />} onClick={() => verifyNode()}>
          Verify
        </Button>
      </div>

      <Group justify='flex-end'>
        {!!skipFrom && (
          <Button variant='outline' onClick={() => skipFrom('node')}>
            {t('common.button.skip', {})}
          </Button>
        )}
        <Button disabled={!isVerified} loading={loading} onClick={() => onNext()}>
          {t('pages.oobe.nodeConfiguration.button.continue', {})}
        </Button>
      </Group>
    </Stack>
  );
}
