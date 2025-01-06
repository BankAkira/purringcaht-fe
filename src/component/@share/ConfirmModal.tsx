import { Button, Modal } from 'flowbite-react';
import { LuAlertTriangle } from 'react-icons/lu';

type Props = {
  title: string;
  description?: string;
  size?: string;
  openModal: boolean;
  isHideBtnCancel?: boolean;
  onCloseModal: () => void;
  color?: 'primary' | 'red' | 'green' | 'yellow' | 'orange';
  onConfirm: () => void;
  btnTextConfirm?: string;
  btnTextCancel?: string;
};

export default function ConfirmModal({
  color,
  title,
  size = 'sm',
  description,
  openModal,
  onCloseModal,
  onConfirm,
  isHideBtnCancel = false,
  btnTextConfirm = 'Yes, Confirm',
  btnTextCancel = ' No, Cancel',
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
      <Modal.Header
        className={
          // handleColor(true) +
          'pt-6 border-0'
        }>
        <div className="text-red-600 flex gap-2 justify-center items-center text-2xl text-center">
          <LuAlertTriangle className="!text-[30px] mt-1" /> {title}
        </div>
      </Modal.Header>
      {!!description && (
        <Modal.Body className="!pt-0 text-center">
          <div className="space-y-6 text-gray-600">{description}</div>
        </Modal.Body>
      )}
      <Modal.Footer className="border-0 pt-4 pb-6">
        <div className="flex gap-3 justify-center w-full">
          <Button
            pill
            className={handleColor() + ' w-[50%]'}
            onClick={() => onConfirm()}>
            {btnTextConfirm}
          </Button>
          {!isHideBtnCancel && (
            <Button
              pill
              color="gray"
              className="w-[50%]"
              onClick={() => onCloseModal()}>
              {btnTextCancel}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
