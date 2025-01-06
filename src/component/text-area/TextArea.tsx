import './textArea.css';
import { Textarea as FlowbiteTextarea, TextareaProps } from 'flowbite-react';
import { IconType } from 'react-icons';

interface CustomTextAreaProps extends TextareaProps {
  style?: React.CSSProperties;
  icon?: IconType;
}

/**
 * Primary UI component for user interaction
 */

export default function TextArea({
  style,
  className,
  icon: Icon,
  ...props
}: CustomTextAreaProps) {
  return (
    <div className="textarea-container">
      {Icon && (
        <Icon className="absolute icon-position h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
      <FlowbiteTextarea {...props} className={className} style={style} />
    </div>
  );
}
