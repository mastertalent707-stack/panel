import { Progress as MantineProgress, ProgressRootProps } from '@mantine/core';
import classNames from 'classnames';
import { makeComponentHookable } from 'shared';
import AnimatedHourglass from './AnimatedHourglass.tsx';

function Progress({
  value,
  className,
  hourglass = true,
  ...rest
}: ProgressRootProps & { value: number; hourglass?: boolean }) {
  return (
    <div className={classNames('flex flex-row items-center', className)}>
      {hourglass && (
        <span className='mr-2'>
          <AnimatedHourglass />
        </span>
      )}

      <MantineProgress.Root size='xl' className='grow' {...rest}>
        <MantineProgress.Section value={value} color='blue'>
          <MantineProgress.Label>{value.toFixed(1)}%</MantineProgress.Label>
        </MantineProgress.Section>
      </MantineProgress.Root>
    </div>
  );
}

export default makeComponentHookable(Progress);
