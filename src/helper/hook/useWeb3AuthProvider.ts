/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

export default function useWeb3AuthProvider() {
  const { connector } = useAccount();

  if (!connector) {
    return null;
  }

  const provider = new ethers.providers.Web3Provider(
    (connector as any).web3AuthInstance.provider
  );

  return provider;
}
