import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useConnect, useDisconnect } from 'wagmi';
import { isInstallMetamask } from '../metamask';
import { useDispatch, useSelector } from '../../redux';
import { setIsOpenSwitchChainModal } from '../../redux/layout';
import environment from '../../environment';
import { signOut } from '../../redux/account';
// import { UpdateUserSettingPayload } from '../../type/setting';
// import { updateUserSettingApi } from '../../rest-api/user-setting';
// import { errorFormat } from '../error-format';
// import { Logger } from '../logger';

// const log = new Logger('useConnectWallet');

export default function useConnectWallet() {
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { metamaskChainId } = useSelector(state => state.layout);

  const dispatch = useDispatch();

  // const updateIsOnline = async () => {
  //   try {
  //     const userSettingPayload: UpdateUserSettingPayload = {
  //       isOnline: false,
  //     };
  //     await updateUserSettingApi(userSettingPayload);
  //   } catch (error) {
  //     log.error('error updateUserSettingApi', error);
  //     toast.error(errorFormat(error).message);
  //   }
  // };

  useEffect(() => {
    if (error?.message && error.name !== 'UserRejectedRequestError') {
      toast.error(error?.message);
    }
  }, [error?.message]);

  const connectWallet = () => {
    if (!isAllowedToLogin()) {
      return dispatch(setIsOpenSwitchChainModal(true));
    }
    connect({ connector: connectors[0] });
  };

  const disconnectWallet = () => {
    disconnect();
    dispatch(signOut());
  };

  const isAllowedToLogin = () => {
    if (isInstallMetamask()) {
      const supportChain = environment.supportChains[0];
      return metamaskChainId === supportChain.id;
    }
    return true;
  };

  return { connectWallet, isAllowedToLogin, disconnectWallet };
}
