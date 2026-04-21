import classNames from 'classnames';
import { useGlobalStore } from '@/stores/global.ts';
import Tooltip from './Tooltip.tsx';

export default function Copyright({ className }: { className?: string }) {
  const { settings } = useGlobalStore();

  return (
    <div className={classNames('flex flex-col text-xs transition-all text-gray-400', className)}>
      {window.extensionContext.extensionRegistry.elements.copyright.prependedComponents.map((Component, index) => (
        <Component key={`global-copyright-prepended-${index}`} />
      ))}

      <Tooltip label={settings.version}>
        <span className='flex flex-row gap-2'>
          <a href='https://calagopus.com' target='_blank' className='underline'>
            Calagopus
          </a>
          &copy; 2025 - {new Date().getFullYear()}
        </span>
      </Tooltip>

      {window.extensionContext.extensionRegistry.elements.copyright.appendedComponents.map((Component, index) => (
        <Component key={`global-copyright-appended-${index}`} />
      ))}
    </div>
  );
}
