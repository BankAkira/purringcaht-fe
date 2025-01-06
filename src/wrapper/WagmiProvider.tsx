import { PropsWithChildren, useEffect, useState } from 'react';
// import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig, configureChains, createConfig, Config } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import environment from '../environment';
import Web3AuthConnectorInstance from '../helper/web3auth-connector';
import FullSpinner from '../component/FullSpinner';
import { useDispatch } from '../redux';
import { initializeWeb3Auth } from '../redux/account';

// const projectId = environment.walletconnectProjectId;

// const chains = [...environment.supportChains];
// const wagmiConfig = defaultWagmiConfig({ chains, projectId });

// createWeb3Modal({ wagmiConfig, projectId, chains });

export default function WagmiProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [...environment.supportChains],
    [publicProvider()]
  );

  useEffect(() => {
    (async () => {
      const { web3AuthConnector, web3AuthInstance } =
        await Web3AuthConnectorInstance(chains);
      const config = createConfig({
        autoConnect: true,
        connectors: [web3AuthConnector],
        publicClient,
        webSocketPublicClient,
      });
      setWagmiConfig(config as Config);
      dispatch(initializeWeb3Auth({ web3AuthInstance }));
    })();
  }, []);

  if (!wagmiConfig) {
    return <FullSpinner />;
  }

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
