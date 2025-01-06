import { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from '../redux';
import { providers } from 'ethers';
import SwitchChainModal from '../component/SwitchChainModal';
import { setIsOpenSwitchChainModal, setMetamaskChainId } from '../redux/layout';
import { getMetamaskProvider, isInstallMetamask } from '../helper/metamask';
import useConnectWallet from '../helper/hook/useConnectWallet';

export default function MetamaskPortal({ children }: PropsWithChildren) {
  const { layout, account } = useSelector(state => state);
  const dispatch = useDispatch();

  const { disconnectWallet, isAllowedToLogin } = useConnectWallet();

  useEffect(() => {
    if (isInstallMetamask()) {
      subscriptCurrentNetwork();
      subscriptOnAccountChange();
    }
  }, []);

  useEffect(() => {
    if (!isAllowedToLogin() && !!account.user) {
      dispatch(setIsOpenSwitchChainModal(true));
    }
  }, [layout.metamaskChainId]);

  const subscriptCurrentNetwork = () => {
    const provider = getMetamaskProvider();
    if (provider) {
      provider.on('network', (newNetwork: providers.Network) => {
        dispatch(setMetamaskChainId(newNetwork.chainId));
      });
    }
  };

  const subscriptOnAccountChange = () => {
    window.ethereum.on('accountsChanged', () => {
      disconnectWallet();
    });
  };

  return (
    <>
      {children}
      <SwitchChainModal />
    </>
  );
}
