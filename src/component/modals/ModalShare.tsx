import { Modal } from 'flowbite-react';
import Button from '../button/Button.tsx';

interface ModalShareProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  btnCancel: string;
  btnConfirm: string;
  onClickBtn: (value: boolean) => void;
}

export default function ModalShare({
  open,
  title,
  children,
  btnCancel,
  btnConfirm,
  onClickBtn,
}: ModalShareProps) {
  const handleConfirm = () => {
    onClickBtn(true);
  };
  const handleCancel = () => {
    onClickBtn(false);
  };
  return (
    <>
      {/* Trigger to open modal */}
      <Modal show={open}>
        <Modal.Header className="text-center">
          <span className="text-3xl">{title}</span>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer className="justify-center">
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
    </>
  );
}
