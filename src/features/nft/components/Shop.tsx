import './style.css';
import useResponsive from '../../../helper/hook/useResponsive';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
// import { NftAbi } from './NftABI';

declare global {
  interface Window {
    // ethereum?: unknown;
    web3?: Web3;
  }
}

export default function Shop() {
  const { isTabletOrMobile } = useResponsive();
  const [address, setAddress] = useState('');

  async function connectMetaMask() {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);

        const accounts = await window.web3.eth.getAccounts();
        const userAddress = accounts[0]; // Get user wallet address
        setAddress(userAddress);
        console.log('Connected MetaMask wallet:', userAddress);

        // Now get NFTs
        // getNFTs(userAddress);
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else {
      console.error('MetaMask is not installed.');
    }
  }

  // async function getNFTs(userAddress: unknown) {
  //   const nftContractAddress = '0x8d0F3A0297728aac50b8781D19206d0031AacD0B';
  //   const nftABI: unknown[] = NftAbi;

  //   const contract = new web3.eth.Contract(nftABI, nftContractAddress);

  //   try {
  //     // ERC721 standard function to get the balance of NFTs owned by the user
  //     const nftBalance = await contract.methods.balanceOf(userAddress).call();

  //     console.log(`User owns ${nftBalance} NFTs.`);

  //     for (let i = 0; i < nftBalance; i++) {
  //       // ERC721 standard function to get the token ID
  //       const tokenId = await contract.methods.owner(userAddress, i).call();

  //       console.log(`NFT Token ID: ${tokenId}`);

  //       // Optional: Fetch NFT metadata like name, description, image
  //       // const tokenURI = await contract.methods.tokenURI(tokenId).call();
  //       // console.log(`Token URI for ID ${tokenId}: ${tokenURI}`);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching NFTs:', error);
  //   }
  // }

  useEffect(() => {
    if (!address) {
      connectMetaMask();
    } else {
      const fetchAssets = async () => {
        try {
          const response = await fetch(
            `https://testnets-api.opensea.io/api/v2/accounts/${address}`
            // 'https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/0x8d0F3A0297728aac50b8781D19206d0031AacD0B/nfts/1' //edit number to find
          );
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error('Error fetching assets from OpenSea:', error);
        }
      };
      fetchAssets();
    }
  }, [address]);

  return (
    <section className="w-full h-full p-5 flex flex-col items-center justify-center overflow-y-auto">
      <div className={`flex flex-col items-center gap-6`}>
        <div className="flex flex-col items-center gap-6">
          <h1 className="w-fit text-center font-inter font-bold text-[54px]">
            Buy
            <br />
            Purring Heist NFTs
          </h1>
          <p className="w-fit font-inter font-bold text-[26px]">
            on OpenSea Now!
          </p>
        </div>
        <a
          href="https://opensea.io/"
          target="_blank"
          className={`${isTabletOrMobile ? 'w-[80%] max-w-[355px]' : 'w-[355px]'} py-2 text-white font-inter font-bold rounded-full flex justify-center`}
          style={{
            backgroundImage:
              'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)',
          }}>
          <button type="button" className="underline underline-offset-4">
            Click Here to Buy!
          </button>
        </a>
      </div>
    </section>
  );
}
