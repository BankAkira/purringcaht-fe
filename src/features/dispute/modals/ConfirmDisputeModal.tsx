import { Button, Modal } from 'flowbite-react';
import { LuAlertTriangle } from 'react-icons/lu';

type Props = {
  title?: {
    label: string;
    className: string;
  };
  description?: {
    label: string;
    className: string;
  };
  subDescription?: {
    label: string;
    className: string;
  };
  size?: string;
  openModal: boolean;
  onCloseModal: () => void;
  color?: 'primary' | 'red' | 'green' | 'yellow' | 'orange';
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
  onConfirm: () => void;
};

export default function ConfirmDisputeModal({
  title,
  description,
  subDescription,
  size = 'sm',
  openModal,
  onCloseModal,
  color,
  buttons,
  onConfirm,
}: Props) {
  const handleColor = (isHeader?: boolean) => {
    switch (color) {
      case 'primary':
        return `bg-primary-700 ${isHeader ? '' : ' hover:bg-primary-800'}`;
      case 'red':
        return `bg-red-500 ${isHeader ? '' : ' hover:bg-red-600'}`;
      case 'green':
        return `bg-green-500 ${isHeader ? '' : ' hover:bg-green-600'}`;
      case 'yellow':
        return `bg-yellow-400 ${isHeader ? '' : ' hover:bg-yellow-500'}`;
      case 'orange':
        return `bg-orange-400 ${isHeader ? '' : ' hover:bg-orange-500'}`;
      default:
        return `bg-primary-700 ${isHeader ? '' : ' hover:bg-primary-800'}`;
    }
  };
  return (
    <Modal show={openModal} size={size} onClose={() => onCloseModal()}>
      <Modal.Header className={'pt-6 border-0'}>
        <div className="flex flex-col justify-center items-center text-2xl gap-4 text-red-600">
          <LuAlertTriangle className="!text-[30px] -mt-1" />
          <div className={title?.className}>{title?.label}</div>
        </div>
      </Modal.Header>
      {description && (
        <Modal.Body className="!pt-0 text-center">
          <div
            className={
              description?.className
                ? description?.className
                : 'space-y-6 text-gray-600'
            }>
            {description?.label}
          </div>
          <div
            className={
              subDescription?.className
                ? subDescription?.className
                : 'space-y-6 text-gray-600'
            }>
            {subDescription?.label}
          </div>
        </Modal.Body>
      )}
      {buttons && (
        <Modal.Footer className="border-0 pt-4 pb-6">
          <div className="flex gap-3 justify-center w-full">
            {buttons.no && (
              <Button
                pill
                color="gray"
                className={`${buttons.no.className}`}
                onClick={() => onCloseModal()}>
                {buttons.no.label ? buttons.no.label : 'No, Cancel'}
              </Button>
            )}
            {buttons.yes && (
              <Button
                pill
                className={handleColor() + `${buttons.yes.className}`}
                onClick={() => onConfirm()}>
                {buttons.yes.label ? buttons.yes.label : `Yes, I’m sure`}
              </Button>
            )}
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
}
