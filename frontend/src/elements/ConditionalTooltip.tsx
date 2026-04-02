import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { makeComponentHookable } from 'shared';
import Tooltip from './Tooltip.tsx';

export interface TooltipProps extends React.ComponentProps<typeof Tooltip> {
  enabled: boolean;
  innerClassName?: string;
}

const ConditionalTooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, className, innerClassName, enabled, ...rest }, ref) => {
    return enabled ? (
      <Tooltip ref={ref} className={className} innerClassName={innerClassName} {...rest}>
        {children}
      </Tooltip>
    ) : (
      <div className={classNames(className, innerClassName)}>{children}</div>
    );
  },
);

export default makeComponentHookable(ConditionalTooltip);
