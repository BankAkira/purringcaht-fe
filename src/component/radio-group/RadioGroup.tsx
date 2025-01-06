import { useEffect, useState } from 'react';
// import { Logger } from '../../helper/logger';
import './radioGroup.css';
import { Label, Radio } from 'flowbite-react';

interface RadioProps {
  id: string;
  title: string;
  value: string;
  supTitle?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

interface RadioGroupProps {
  radios: RadioProps[];
  name: string;
  legendText?: string;
  onChange: (value: string) => void;
}

// const log = new Logger('RadioGroup');
/**
 * Primary UI component for user interaction
 */
export default function RadioGroup({
  legendText,
  name,
  radios,
  onChange,
}: RadioGroupProps) {
  const theme = {
    root: {
      base: 'h-4 w-4 border border-gray-300 !text-orange-600 ',
    },
  };
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  useEffect(() => {
    // Ensure the initial checked state is communicated to the parent component
    if (selectedValue) {
      onChange(selectedValue);
    }
  }, []);

  return (
    <fieldset className="flex max-w-md flex-col gap-4">
      {legendText && <legend className="mb-4">{legendText}</legend>}
      {radios.map((radio: RadioProps) => {
        return (
          <div key={radio.id} className="flex items-center gap-2">
            <Radio
              theme={theme}
              id={radio.id}
              name={name}
              value={radio.value}
              checked={selectedValue === radio.value}
              disabled={radio.disabled ? true : false}
              onChange={() => handleChange(radio.value)}
            />
            <Label htmlFor={radio.id} disabled={radio.disabled ? true : false}>
              {radio.title}
              <p className="text-gray-400">{radio.supTitle}</p>
            </Label>
          </div>
        );
      })}
    </fieldset>
  );
}
