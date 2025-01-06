import { PropsWithChildren, useState } from 'react';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import { errorFormat } from '../helper/error-format';
import {
  signInApi,
  validateWalletAddressApi,
} from '../rest-api/authentication';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { toast } from 'react-toastify';
import FullSpinner from '../component/FullSpinner';
import { getUserInfoApi } from '../rest-api/user';
import { useDispatch } from '../redux';
import { initializeAccountSuccess } from '../redux/account';
import {
  getCredentialTokens,
  setCredentialTokens,
} from '../helper/local-storage';
import useConnectWallet from '../helper/hook/useConnectWallet';
// import { Logger } from '../helper/logger';

// const log = new Logger('AccountPortal');

export default function AccountPortal({ children }: PropsWithChildren) {
  const { address, status } = useAccount();

  const dispatch = useDispatch();

  const { signMessageAsync } = useSignMessage();
  const { isLoading: disconnecting } = useDisconnect();
  const [userInitializing, setUserInitializing] = useState(true);
  const [signingMessage, setSigningMessage] = useState(true);
  const { disconnectWallet } = useConnectWallet();

  useDeepEffect(() => {
    (async () => {
      const isweb3AuthConnected = status === 'connected';
      if (isweb3AuthConnected && address && !getCredentialTokens()) {
        await signMessageWithMessage();
      }
      if (isweb3AuthConnected && address && getCredentialTokens()) {
        await setUserInfo();
      }
      setUserInitializing(false);
      setSigningMessage(false);
    })();
  }, [address, status]);

  const signMessageWithMessage = async () => {
    try {
      setSigningMessage(true);
      const respSingin = await validateWalletAddressApi(address!);
      // log.info('Sing in info:', { respSingin });
      if (!respSingin) {
        throw new Error('Validate Wallet Error.');
      }
      const signature = await signMessageAsync({
        message: respSingin.msg,
      });
      const respAuth = await signInApi(address!, signature!);

      if (!respAuth) {
        throw new Error('Sign In Error.');
      }

      setCredentialTokens(respAuth.tokens);
      // log.info('user info:', respAuth.user);

      dispatch(initializeAccountSuccess({ user: respAuth.user }));
    } catch (error) {
      handleDisconnect();
      toast.error(errorFormat(error).message);
    }
  };

  const setUserInfo = async () => {
    try {
      setUserInitializing(true);
      const storageToken = getCredentialTokens();
      if (!storageToken) {
        return handleDisconnect();
      }
      setCredentialTokens(storageToken);
      const userInfo = await getUserInfoApi();

      if (!userInfo) {
        throw 'user not found';
      }

      // log.info('user info:', userInfo);
      dispatch(initializeAccountSuccess({ user: userInfo }));
    } catch (error) {
      handleDisconnect();
      // toast.error(errorFormat(error).message);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (
    userInitializing ||
    signingMessage ||
    disconnecting ||
    status === 'reconnecting' ||
    status === 'connecting'
  ) {
    return <FullSpinner />;
  }

  return <>{children}</>;
}
