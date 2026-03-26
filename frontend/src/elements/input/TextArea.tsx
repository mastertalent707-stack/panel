import { Textarea as MantineTextarea, TextareaProps } from '@mantine/core';
import { forwardRef } from 'react';

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...rest }, ref) => {
  return (
    <MantineTextarea
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default TextArea;
