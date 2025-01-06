import { PropsWithChildren, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';
import { useSelector } from '../../redux';
import { isEmpty } from 'lodash';
import sleep from '../../helper/sleep';
import useConnectWallet from '../../helper/hook/useConnectWallet';
import { Logger } from '../../helper/logger';
const log = new Logger('AuthGuard');

export default function AuthGuard({ children }: PropsWithChildren) {
  const { user } = useSelector(state => state.account);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { disconnectWallet } = useConnectWallet();

  const signOut = () => {
    disconnectWallet();
  };

  useDeepEffect(() => {
    (async () => {
      log.debug(
        'address:',
        address,
        'chain?.unsupported :: ',
        chain?.unsupported,
        'user::',
        user
      );
      if (!address || chain?.unsupported || isEmpty(user)) {
        signOut();
        navigate(location?.state?.from || '/unauthorized', {
          state: {
            from: location.pathname,
          },
          replace: true,
        });
      }
      await sleep(500);
      setLoading(false);
    })();
  }, [address, navigate, location, chain]);

  if (loading) return <></>;

  return children;
}
