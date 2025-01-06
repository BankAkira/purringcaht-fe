import { useDeepEffect } from '../../helper/hook/useDeepEffect';
import './datepicker.css';
import {
  Datepicker as FlowbiteDatepicker,
  DatepickerProps,
} from 'flowbite-react';

interface CustomDatepickerProps extends Omit<DatepickerProps, 'onChange'> {
  onChange: (date: Date) => void;
  name?: string;
  style?: React.CSSProperties;
  defaultToNow?: boolean;
  selected?: Date;
}

/**
 * Primary UI component for user interaction
 */

export default function Datepicker({
  onChange,
  name,
  style,
  className,
  ...props
}: CustomDatepickerProps) {
  const handleChange: DatepickerProps['onSelectedDateChanged'] = event => {
    onChange(event as Date);
  };

  useDeepEffect(() => {
    onChange(new Date());
  }, []);

  return (
    <FlowbiteDatepicker
      onSelectedDateChanged={event => handleChange(event)}
      name={name}
      className={`custom-datepicker ${className || ''}`}
      style={style}
      {...props}
    />
  );
}
