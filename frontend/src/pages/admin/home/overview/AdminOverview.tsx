import {
  faArchive,
  faArrowRightLong,
  faBan,
  faChartBar,
  faCheck,
  faCircleQuestion,
  faComputer,
  faCrow,
  faDatabase,
  faEarth,
  faEgg,
  faMemory,
  faMicrochip,
  faScroll,
  faServer,
  faStethoscope,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text, Title } from '@mantine/core';
import { startTransition, useEffect, useState } from 'react';
import getBackupStats, { type BackupStats } from '@/api/admin/stats/getBackupStats.ts';
import getGeneralStats, { type GeneralStats } from '@/api/admin/stats/getGeneralStats.ts';
import getOverview, { AdminSystemOverview } from '@/api/admin/system/getOverview.ts';
import { httpErrorToHuman } from '@/api/axios.ts';
import Alert from '@/elements/Alert.tsx';
import { AdminCan } from '@/elements/Can.tsx';
import Card from '@/elements/Card.tsx';
import Spinner from '@/elements/Spinner.tsx';
import TitleCard from '@/elements/TitleCard.tsx';
import { bytesToString } from '@/lib/size.ts';
import { parseVersion } from '@/lib/version.ts';
import { useAdminCan } from '@/plugins/usePermissions.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useAdminStore } from '@/stores/admin.tsx';

export default function AdminOverview() {
  const { addToast } = useToast();
  const { t } = useTranslations();
  const { updateInformation } = useAdminStore();
  const canReadStats = useAdminCan('stats.read');

  const [systemOverview, setSystemOverview] = useState<AdminSystemOverview | null>(null);
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [backupStats, setBackupStats] = useState<Record<'allTime' | 'today' | 'week' | 'month', BackupStats> | null>(
    null,
  );

  useEffect(() => {
    if (!canReadStats) return;

    Promise.all([getOverview(), getGeneralStats(), getBackupStats()])
      .then(([system, general, backup]) => {
        startTransition(() => {
          setSystemOverview(system);
          setGeneralStats(general);
          setBackupStats(backup);
        });
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  }, []);

  const containerTypeLabel = (type: AdminSystemOverview['containerType']) => {
    switch (type) {
      case 'unknown':
        return t('pages.admin.home.containerType.unknown', {});
      case 'none':
        return t('pages.admin.home.containerType.none', {});
      case 'official':
        return t('pages.admin.home.containerType.official', {});
      case 'official-aio':
        return t('pages.admin.home.containerType.officialAio', {});
      default:
        return t('pages.admin.home.containerType.officialHeavy', {});
    }
  };

  return (
    <>
      {updateInformation &&
        parseVersion(updateInformation.latestPanelVersion).isNewerThan(updateInformation.panelVersion) && (
          <Alert className='mb-4' color='yellow'>
            {t('pages.admin.home.alert.newPanelVersion', {
              current: updateInformation.panelVersion,
              latest: updateInformation.latestPanelVersion,
              upgradeUrl: 'https://calagopus.com/docs/panel/updating',
            }).md()}
          </Alert>
        )}

      <AdminCan
        action='stats.read'
        renderOnCant={
          <Text>
            {t('pages.admin.home.permissionDenied', {})} <FontAwesomeIcon icon={faArrowRightLong} />{' '}
            <FontAwesomeIcon icon={faCrow} />
          </Text>
        }
      >
        <TitleCard
          title={t('pages.admin.home.card.systemOverview', {})}
          icon={<FontAwesomeIcon icon={faStethoscope} />}
        >
          {!systemOverview ? (
            <Spinner.Centered />
          ) : (
            <>
              <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
                <Card className='flex col-span-2'>
                  <Title order={3}>
                    <FontAwesomeIcon icon={faMicrochip} /> {systemOverview.cpu.brand}
                  </Title>
                  {t('pages.admin.home.system.cpu', {})}
                </Card>
                <Card className='flex col-span-2'>
                  <Title order={3}>
                    <FontAwesomeIcon icon={faMemory} />{' '}
                    {t('pages.admin.home.system.memoryValue', {
                      used: bytesToString(systemOverview.memory.usedBytes),
                      total: bytesToString(systemOverview.memory.totalBytes),
                      percent: ((systemOverview.memory.usedBytes / systemOverview.memory.totalBytes) * 100).toFixed(2),
                    })}
                  </Title>
                  {t('pages.admin.home.system.memoryUsage', {
                    process: bytesToString(systemOverview.memory.usedBytesProcess),
                  })}
                </Card>
              </div>

              <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4'>
                <Card className='flex'>
                  <Title order={3}>
                    <FontAwesomeIcon icon={faServer} /> {systemOverview.kernelVersion}
                  </Title>
                  {t('pages.admin.home.system.kernelVersion', { architecture: systemOverview.architecture })}
                </Card>
                <Card className='flex'>
                  <Title order={3}>
                    <FontAwesomeIcon
                      icon={
                        systemOverview.containerType === 'unknown'
                          ? faCircleQuestion
                          : systemOverview.containerType === 'none'
                            ? faBan
                            : faCheck
                      }
                    />{' '}
                    {containerTypeLabel(systemOverview.containerType)}
                  </Title>
                  {t('pages.admin.home.system.containerType', {})}
                </Card>
                <Card className='flex'>
                  <Title order={3}>
                    <FontAwesomeIcon icon={faDatabase} /> PostgreSQL {systemOverview.database.version}
                  </Title>
                  {t('pages.admin.home.system.databaseVersion', {
                    size: bytesToString(systemOverview.database.sizeBytes),
                  })}
                </Card>
                <Card className='flex'>
                  <Title order={3}>
                    <FontAwesomeIcon icon={faDatabase} /> {systemOverview.cache.version}
                  </Title>
                  {t('pages.admin.home.system.cacheVersion', {})}
                </Card>
              </div>

              <div className='grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4'>
                <Card className='flex'>
                  <Title order={3}>{systemOverview.cache.totalCalls}</Title>
                  {t('pages.admin.home.system.cacheCalls', {})}
                </Card>
                <Card className='flex'>
                  <Title order={3}>{systemOverview.cache.totalHits}</Title>
                  {t('pages.admin.home.system.cacheHits', {
                    percent: ((systemOverview.cache.totalHits / systemOverview.cache.totalCalls) * 100).toFixed(2),
                  })}
                </Card>
                <Card className='flex'>
                  <Title order={3}>{systemOverview.cache.totalMisses}</Title>
                  {t('pages.admin.home.system.cacheMisses', {
                    percent: ((systemOverview.cache.totalMisses / systemOverview.cache.totalCalls) * 100).toFixed(2),
                  })}
                </Card>
                <Card className='flex'>
                  <Title order={3}>{(systemOverview.cache.averageCallLatencyNs / 1_000 / 1_000).toFixed(2)} ms</Title>
                  {t('pages.admin.home.system.avgCachedCallLatency', {})}
                </Card>
              </div>
            </>
          )}
        </TitleCard>

        <TitleCard
          title={t('pages.admin.home.card.generalStatistics', {})}
          icon={<FontAwesomeIcon icon={faChartBar} />}
          className='mt-4'
        >
          {!generalStats ? (
            <Spinner.Centered />
          ) : (
            <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faUsers} /> {generalStats.users}
                </Title>
                {t('pages.admin.home.stats.users', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faComputer} /> {generalStats.servers}
                </Title>
                {t('pages.admin.home.stats.servers', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faEarth} /> {generalStats.locations}
                </Title>
                {t('pages.admin.home.stats.locations', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faServer} /> {generalStats.nodes}
                </Title>
                {t('pages.admin.home.stats.nodes', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faEgg} /> {generalStats.nestEggs}
                </Title>
                {t('pages.admin.home.stats.nestEggs', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faDatabase} /> {generalStats.databaseHosts}
                </Title>
                {t('pages.admin.home.stats.databaseHosts', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faArchive} /> {generalStats.backupConfigurations}
                </Title>
                {t('pages.admin.home.stats.backupConfigurations', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  <FontAwesomeIcon icon={faScroll} /> {generalStats.roles}
                </Title>
                {t('pages.admin.home.stats.roles', {})}
              </Card>
            </div>
          )}
        </TitleCard>

        <TitleCard
          title={t('pages.admin.home.card.backupStatistics', {})}
          icon={<FontAwesomeIcon icon={faArchive} />}
          className='mt-4'
        >
          {!backupStats ? (
            <Spinner.Centered />
          ) : (
            <div className='grid grid-cols-2 xl:grid-cols-5 gap-4'>
              <Card className='col-span-2 xl:col-span-1'>
                <Title order={3}>{t('pages.admin.home.backup.allTime', {})}</Title>
              </Card>

              <Card className='flex'>
                <Title order={3}>{backupStats.allTime.total}</Title>
                {t('pages.admin.home.backup.totalAllTime', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.successfulValue', {
                    count: backupStats.allTime.successful,
                    size: bytesToString(backupStats.allTime.successfulBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.successfulAllTime', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>{backupStats.allTime.failed}</Title>
                {t('pages.admin.home.backup.failedAllTime', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.deletedValue', {
                    count: backupStats.allTime.deleted,
                    size: bytesToString(backupStats.allTime.deletedBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.deletedAllTime', {})}
              </Card>

              <Card className='col-span-2 xl:col-span-1'>
                <Title order={3}>{t('pages.admin.home.backup.today', {})}</Title>
              </Card>

              <Card className='flex'>
                <Title order={3}>{backupStats.today.total}</Title>
                {t('pages.admin.home.backup.totalToday', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.successfulValue', {
                    count: backupStats.today.successful,
                    size: bytesToString(backupStats.today.successfulBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.successfulToday', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>{backupStats.today.failed}</Title>
                {t('pages.admin.home.backup.failedToday', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.deletedValue', {
                    count: backupStats.today.deleted,
                    size: bytesToString(backupStats.today.deletedBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.deletedToday', {})}
              </Card>

              <Card className='col-span-2 xl:col-span-1'>
                <Title order={3}>{t('pages.admin.home.backup.week', {})}</Title>
              </Card>

              <Card className='flex'>
                <Title order={3}>{backupStats.week.total}</Title>
                {t('pages.admin.home.backup.totalWeek', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.successfulValue', {
                    count: backupStats.week.successful,
                    size: bytesToString(backupStats.week.successfulBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.successfulWeek', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>{backupStats.week.failed}</Title>
                {t('pages.admin.home.backup.failedWeek', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.deletedValue', {
                    count: backupStats.week.deleted,
                    size: bytesToString(backupStats.week.deletedBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.deletedWeek', {})}
              </Card>

              <Card className='col-span-2 xl:col-span-1'>
                <Title order={3}>{t('pages.admin.home.backup.month', {})}</Title>
              </Card>

              <Card className='flex'>
                <Title order={3}>{backupStats.month.total}</Title>
                {t('pages.admin.home.backup.totalMonth', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.successfulValue', {
                    count: backupStats.month.successful,
                    size: bytesToString(backupStats.month.successfulBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.successfulMonth', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>{backupStats.month.failed}</Title>
                {t('pages.admin.home.backup.failedMonth', {})}
              </Card>
              <Card className='flex'>
                <Title order={3}>
                  {t('pages.admin.home.backup.deletedValue', {
                    count: backupStats.month.deleted,
                    size: bytesToString(backupStats.month.deletedBytes),
                  })}
                </Title>
                {t('pages.admin.home.backup.deletedMonth', {})}
              </Card>
            </div>
          )}
        </TitleCard>
      </AdminCan>
    </>
  );
}
