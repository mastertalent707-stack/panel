import { MultiSelect as MantineMultiSelect, MultiSelectProps } from '@mantine/core';
import { forwardRef } from 'react';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(({ className, ...rest }, ref) => {
  const { t } = useTranslations();

  return (
    <MantineMultiSelect
      ref={ref}
      className={className}
      nothingFoundMessage={t('elements.selectInput.noResults', {})}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default MultiSelect;
