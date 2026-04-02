import { CheckboxProps, Checkbox as MantineCheckbox } from '@mantine/core';
import { forwardRef } from 'react';
import { makeComponentHookable } from 'shared';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...rest }, ref) => {
  return <MantineCheckbox ref={ref} className={className} {...rest} />;
});

export default makeComponentHookable(Checkbox);
