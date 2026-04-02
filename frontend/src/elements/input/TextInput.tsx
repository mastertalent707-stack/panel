import { TextInput as MantineTextInput, TextInputProps } from '@mantine/core';
import { forwardRef } from 'react';
import { makeComponentHookable } from 'shared';

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ className, ...rest }, ref) => {
  return (
    <MantineTextInput
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default makeComponentHookable(TextInput);
