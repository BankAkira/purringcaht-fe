import './select.css';
import { Select as FlowbiteSelect, SelectProps } from 'flowbite-react';

interface CustomSelectProps extends SelectProps {
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
}

/**
 * Primary UI component for user interaction
 */

export default function Select({
  options,
  style,
  className,
  ...props
}: CustomSelectProps) {
  return (
    <FlowbiteSelect
      {...props}
      className={`select-dropdown ${className}`}
      style={style}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FlowbiteSelect>
  );
}
