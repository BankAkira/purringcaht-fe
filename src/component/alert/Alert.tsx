import './alert.css';
import { Alert as FlowbiteAlert } from 'flowbite-react';
import Judge from '../../asset/icon/icons/judge.png';

interface CustomAlertProps {
  title?:
    | {
        label: string;
        className?: string | undefined;
      }
    | undefined;
  description?:
    | {
        label: string;
        className?: string | undefined;
      }
    | undefined;
  subDescription?:
    | {
        label: string;
        className?: string | undefined;
      }
    | undefined;
  buttons?: {
    yes?: {
      label: string;
      onClick: () => void;
      className?: string;
    };
    no?: {
      label: string;
      onClick: () => void;
      className?: string;
    };
  };
  status?: string;
  className?: string;
}

/**
 * Primary UI component for user interaction
 */
export default function Alert({
  title,
  description,
  subDescription,
  buttons,
  status,
  className,
  ...props
}: CustomAlertProps) {
  return (
    <FlowbiteAlert
      {...props}
      color={status ? status : 'light'}
      className={`absolute ${className}`}>
      <div className="flex justify-between con-alert">
        <div className="flex-1 dt-alert">
          <div className="flex items-center mb-1">
            <img
              src={Judge}
              alt="judge icon"
              className="mr-2"
              style={{ width: '16px', height: '16px' }}
            />
            <span
              className={
                title?.className
                  ? title?.className
                  : 'font-semibold text-lg leading-6 text-blue-500'
              }>
              {title?.label}
            </span>
          </div>
          <div>
            <div
              className={
                description?.className
                  ? description?.className
                  : 'font-normal text-sm leading-6 text-gray-500'
              }>
              {description?.label}
            </div>
            <div
              className={
                subDescription?.className
                  ? subDescription?.className
                  : 'font-normal text-xs leading-6 text-gray-500'
              }>
              {subDescription?.label}
            </div>
          </div>
        </div>
        {buttons && (
          <div className="flex flex-col justify-center gap-2 btn-alert">
            {buttons.yes && (
              <button
                onClick={buttons.yes.onClick}
                className={`btn btn-outline btn-yes ${buttons.yes.className}`}>
                {buttons.yes.label}
              </button>
            )}
            {buttons.no && (
              <button
                onClick={buttons.no.onClick}
                className={`btn btn-outline btn-no ${buttons.no.className}`}>
                {buttons.no.label}
              </button>
            )}
          </div>
        )}
      </div>
    </FlowbiteAlert>
  );
}
