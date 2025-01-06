import { Modal } from 'flowbite-react';
import Button from '../button/Button.tsx';

type ModalShareProps = {
  open: boolean;
  title: string;
  description: string;
  btnConfirm?: string;
  btnCancel?: string;
  onClickBtn: (value: boolean) => void;
};

function ConfirmModal({
  open,
  title = 'Title',
  description = 'Description',
  btnConfirm = 'Confirm',
  btnCancel = 'Cancel',
  onClickBtn,
}: ModalShareProps) {
  const handleConfirm = () => {
    onClickBtn(true);
  };
  const handleCancel = () => {
    onClickBtn(false);
  };
  return (
    <Modal show={open}>
      <Modal.Header className="text-center">
        <span className="text-3xl">{title}</span>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className=" justify-center">
        <Button
          className="flex items-center justify-center gap-2 outline !outline-1 outline-pink-500 !text-pink-500 bg-transparent shadow-none text-lg h-[38px] px-[28px] transition-colors duration-300 ease-in-out !hover:bg-pink-500 hover:text-white"
          onClick={handleCancel}
          label={btnCancel}
        />

        <Button
          className="flex items-center justify-center gap-2 !text-white bg-gradient-to-br from-pink-500 to-orange-400 shadow-none text-lg h-[38px] px-[28px] transition-colors duration-300 ease-in-out hover:bg-gradient-to-br hover:from-orange-400 hover:to-pink-500"
          onClick={handleConfirm}
          label={btnConfirm}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
