import { NumberInput as MantineNumberInput, NumberInputProps } from '@mantine/core';
import { forwardRef } from 'react';
import { makeComponentHookable } from 'shared';

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({ className, ...rest }, ref) => {
  return (
    <MantineNumberInput
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default makeComponentHookable(NumberInput);
