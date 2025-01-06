import { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';
import { isEmpty } from 'lodash';
import { useSelector } from '../../redux';

export default function GuestGuard({ children }: PropsWithChildren) {
  const { user } = useSelector(state => state.account);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  useDeepEffect(() => {
    if (address && !chain?.unsupported && !isEmpty(user)) {
      navigate(location?.state?.from || '/', {
        state: {
          from: '',
        },
        replace: true,
      });
    }
  }, [address, navigate, location, chain]);

  return children;
}
