import { Select as MantineSelect, SelectProps } from '@mantine/core';
import { forwardRef } from 'react';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

const Select = forwardRef<HTMLInputElement, SelectProps>(({ className, allowDeselect = false, ...rest }, ref) => {
  const { t } = useTranslations();

  return (
    <MantineSelect
      ref={ref}
      className={className}
      allowDeselect={allowDeselect}
      nothingFoundMessage={t('elements.selectInput.noResults', {})}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default Select;
