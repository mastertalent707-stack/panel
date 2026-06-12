import { Text as MantineText, TextProps } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { makeComponentHookable } from 'shared';

const Text = forwardRef<HTMLParagraphElement, TextProps & ComponentPropsWithoutRef<'p'>>(({ ...rest }, ref) => {
  return <MantineText ref={ref} {...rest} />;
});

export default makeComponentHookable(Text);
