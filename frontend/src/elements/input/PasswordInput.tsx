import { PasswordInput as MantinePasswordInput, PasswordInputProps } from '@mantine/core';
import { forwardRef } from 'react';

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...rest }, ref) => {
  return (
    <MantinePasswordInput
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default PasswordInput;
