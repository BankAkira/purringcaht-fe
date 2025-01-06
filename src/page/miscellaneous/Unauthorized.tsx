import { useAccount, useNetwork } from 'wagmi';
import UnauthorizedWallet from '../../section/unauthorized/UnauthorizedWallet';
import UnauthorizedNetwork from '../../section/unauthorized/UnauthorizedNetwork';

export default function Unauthorized() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const displayComponent = () => {
    if (!address) return <UnauthorizedWallet />;
    if (chain?.unsupported) return <UnauthorizedNetwork />;
    return <></>;
  };

  return <>{displayComponent()}</>;
}
