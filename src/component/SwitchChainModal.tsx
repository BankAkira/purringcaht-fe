import { Button, Modal } from 'flowbite-react';
import { useDispatch, useSelector } from '../redux';
import { setIsOpenSwitchChainModal } from '../redux/layout';
import environment from '../environment';
import { switchToSupportChain } from '../helper/metamask';
import { useAccount } from 'wagmi';
import useConnectWallet from '../helper/hook/useConnectWallet';

export default function SwitchChainModal() {
  const dispatch = useDispatch();
  const { layout, account } = useSelector(state => state);
  const { isConnecting } = useAccount();
  const supportChain = environment.supportChains[0];
  const { connectWallet, disconnectWallet, isAllowedToLogin } =
    useConnectWallet();

  const onClickSwitchChain = async () => {
    await switchToSupportChain();
    if (account.user) {
      dispatch(setIsOpenSwitchChainModal(false));
    }
  };

  const onClickConnect = () => {
    connectWallet();
    closeModal();
  };

  const closeModal = () => {
    if (account.user) {
      disconnectWallet();
    }
    dispatch(setIsOpenSwitchChainModal(false));
  };

  const allowConnect = isAllowedToLogin();

  return (
    <Modal
      dismissible
      className="modal-responsive"
      show={layout.isOpenSwitchChainModal}
      onClose={() => closeModal()}
      size={'sm'}>
      <Modal.Header className="items-center pb-1 border-0 pt-6 justify-center font-bold text-gray-900 hide-close-btn-modal">
        <div className="max-md:text-base text-lg font-bold">
          {allowConnect ? <>Connect Wallet ?</> : <>Switch Network ?</>}
        </div>
      </Modal.Header>
      <Modal.Body className="!py-0 !px-3">
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 text-center">
          {allowConnect ? (
            <>Do you want to connect wallet ?</>
          ) : (
            <>
              You're currently on an unsupported network. Please tap to switch
              to the <b>{supportChain.name} Network</b>.
            </>
          )}
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-center gap-2 border-0 max-sm:px-4 max-sm:py-4 p-6 foobar-modal-custom">
        {allowConnect ? (
          <>
            <Button
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 min-w-[100px] w-[100%]"
              disabled={isConnecting}
              onClick={() => onClickConnect()}>
              Connect Wallet
            </Button>
          </>
        ) : (
          <>
            <Button
              color="gray"
              className="min-w-[100px] w-[50%] !m-0"
              onClick={() => closeModal()}>
              <span className="text-gray-500">Not now</span>
            </Button>
            <Button
              className="min-w-[100px] w-[50%] !bg-blue-700 !m-0"
              onClick={() => onClickSwitchChain()}>
              Switch
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
