import { FileInputProps, FileInput as MantineFileInput } from '@mantine/core';
import { forwardRef } from 'react';
import { makeComponentHookable } from 'shared';

const FileInput = forwardRef<HTMLButtonElement, FileInputProps>(({ className, ...rest }, ref) => {
  return (
    <MantineFileInput
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default makeComponentHookable(FileInput);
