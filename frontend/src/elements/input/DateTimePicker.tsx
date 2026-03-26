import { DateTimePickerProps, DateTimePicker as MantineDateTimePicker } from '@mantine/dates';
import { forwardRef } from 'react';

const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(({ className, ...rest }, ref) => {
  return (
    <MantineDateTimePicker
      ref={ref}
      className={className}
      placeholder={typeof rest.label === 'string' ? rest.label : undefined}
      {...rest}
    />
  );
});

export default DateTimePicker;
