// Web3Auth Libraries
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector';
import { Web3Auth } from '@web3auth/modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
} from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, IAdapter } from '@web3auth/base';
import { Chain } from 'wagmi';
import environment from '../environment';

export default async function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0] as string,
  };

  const web3AuthInstance = new Web3Auth({
    clientId: environment.web3AuthClientId,
    sessionTime: 86400,
    chainConfig,
    // uiConfig refers to the whitelabel options, which is available only on Growth Plan and above
    // Please remove this parameter if you're on the Base Plan
    uiConfig: {
      appName: 'Purring Chat',
      // appLogo: "https://web3auth.io/images/web3auth-logo.svg", // Your App Logo Here
      theme: {
        primary: '#1a56db',
      },
      mode: 'light',
      logoLight: 'https://chat.socialbureau.io/apple-touch-icon-180x180.png',
      logoDark: 'https://chat.socialbureau.io/apple-touch-icon-180x180.png',
      defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
      loginGridCol: 2,
      primaryButton: 'socialLogin', // "externalLogin" | "socialLogin" | "emailLogin"
      modalZIndex: '2147483647',
    },
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: false,
  });

  // Add open login adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      uxMode: 'redirect',
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const metamaskAdapter = new MetamaskAdapter({
    clientId: environment.web3AuthClientId,
    sessionTime: 86400,
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
    chainConfig,
  }) as IAdapter<unknown>;

  web3AuthInstance.configureAdapter(metamaskAdapter);

  await web3AuthInstance.initModal({
    modalConfig: WEB3AUTH_MODAL_CONFIG,
  });

  const web3AuthConnector = new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
    },
  });

  return { web3AuthConnector, web3AuthInstance };
}

const WEB3AUTH_OPEN_LOGIN_METHOD = {
  google: {
    name: 'google',
    showOnModal: true,
  },
  twitter: {
    name: 'twitter',
    showOnModal: false,
  },
  facebook: {
    name: 'facebook',
    showOnModal: true,
  },
  line: {
    name: 'line',
    showOnModal: true,
  },
  discord: {
    name: 'discord',
    showOnModal: false,
  },
  github: {
    name: 'github',
    showOnModal: false,
  },
  twitch: {
    name: 'twitch',
    showOnModal: false,
  },
  reddit: {
    name: 'reddit',
    showOnModal: false,
  },
  apple: {
    name: 'apple',
    showOnModal: false,
  },
  linkedin: {
    name: 'linkedin',
    showOnModal: false,
  },
  weibo: {
    name: 'weibo',
    showOnModal: false,
  },
  wechat: {
    name: 'wechat',
    showOnModal: false,
  },
  kakao: {
    name: 'kakao',
    showOnModal: false,
  },
  email_passwordless: {
    name: 'email_passwordless',
    showOnModal: false,
  },
  sms_passwordless: {
    name: 'sms_passwordless',
    showOnModal: false,
  },
};

const WEB3AUTH_MODAL_CONFIG = {
  [WALLET_ADAPTERS.OPENLOGIN]: {
    label: WALLET_ADAPTERS.OPENLOGIN,
    loginMethods: WEB3AUTH_OPEN_LOGIN_METHOD,
  },
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: WALLET_ADAPTERS.TORUS_EVM,
    showOnModal: false,
  },
  [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
    label: WALLET_ADAPTERS.WALLET_CONNECT_V2,
    showOnModal: false,
  },
};
