/* eslint-disable @typescript-eslint/no-explicit-any */

import { ethers, providers } from 'ethers';
import environment from '../environment';
import { toast } from 'react-toastify';
import { mainTokenSymbol } from '../constant/unit';

const supportChain = environment.supportChains[0];
const blockExplorerUrl = supportChain.blockExplorers?.default.url;

export const isInstallMetamask = () => {
  return !!window?.ethereum;
};

export const getMetamaskProvider = () => {
  if (!window?.ethereum) {
    return null;
  }
  const provider = new providers.Web3Provider(window.ethereum, 'any');
  return provider;
};

export const switchToSupportChain = async () => {
  try {
    await window.ethereum.request?.({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: ethers.utils.hexValue(supportChain.id),
          chainName: supportChain.name,
          rpcUrls: supportChain.rpcUrls.default.http,
          nativeCurrency: supportChain.nativeCurrency,
          blockExplorerUrls: [blockExplorerUrl],
        },
      ],
    });
  } catch (error: any) {
    if (error?.code === -32602) {
      await window.ethereum.request?.({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: ethers.utils.hexValue(supportChain.id),
          },
        ],
      });
    }
  }
};

export const addMainTokenToWallet = async () => {
  if (!window?.ethereum) {
    return toast.error('MetaMask Not found!');
  }
  const wasAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: '0x5702accde69aa0b6e3211ef33aac8e637d474335', // The address that the token is at.
        symbol: mainTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: 18, // The number of decimals in the token
        image:
          'https://firebasestorage.googleapis.com/v0/b/test-b…54.appspot.com/o/1705574703520-JUTC.png?alt=media', // A string url of the token logo
      },
    },
  });
  return wasAdded;
};
