import { AutocompleteProps, Autocomplete as MantineAutocomplete } from '@mantine/core';
import { forwardRef } from 'react';

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(({ className, ...rest }, ref) => {
  return (
    <MantineAutocomplete
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default Autocomplete;
