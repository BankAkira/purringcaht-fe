import './textInput.css';
import { TextInput as FlowbiteTextInput, TextInputProps } from 'flowbite-react';

/**
 * Primary UI component for user interaction
 */
export default function TextInput({ ...props }: TextInputProps) {
  return (
    <FlowbiteTextInput
      {...props}
      size={24}
      className="con-text-input"
      style={{
        borderRadius: '100px',
        height: '40px',
      }}
    />
  );
}
