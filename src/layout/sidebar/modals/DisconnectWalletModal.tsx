import { Button, Modal } from 'flowbite-react';
import { Dispatch, SetStateAction } from 'react';

import useConnectWallet from '../../../helper/hook/useConnectWallet.ts';

type Props = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function DisconnectWalletModal({
  openModal,
  setOpenModal,
}: Props) {
  const { disconnectWallet } = useConnectWallet();

  const onDisconnect = () => {
    disconnectWallet();
    setOpenModal(false);
  };

  return (
    <Modal
      dismissible
      show={openModal}
      onClose={() => setOpenModal(false)}
      size={'sm'}>
      <Modal.Header className="flex items-center justify-center pt-6 pb-1 font-bold text-gray-900 border-0">
        <div className="text-lg max-md:text-base text-center">
          Disconnect wallet ?
        </div>
      </Modal.Header>
      <Modal.Body className="!p-0">
        <p className="text-sm leading-relaxed text-center text-gray-500 dark:text-gray-400">
          Do you want to disconnect your wallet ?
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-center gap-2 border-0">
        <Button
          color="gray"
          pill
          className="min-w-[100px] w-[50%]"
          onClick={() => setOpenModal(false)}>
          Not now
        </Button>
        <Button
          color="failure"
          pill
          className="min-w-[100px] w-[50%]"
          onClick={() => onDisconnect()}>
          Disconnect
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
