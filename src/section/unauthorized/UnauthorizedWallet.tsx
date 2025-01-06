// import { useWeb3Modal } from '@web3modal/wagmi/react';
// import { Button } from 'flowbite-react';
// import { useAccount } from 'wagmi';

export default function UnauthorizedWallet() {
  // const { open } = useWeb3Modal();
  // const { isConnecting } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh_-_8rem)]">
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh_-_8rem)]">
        <h1 className="w-4/5 mt-6 mb-2 text-2xl font-bold text-center text-gray-500 md:mb-3 md:text-4xl dark:text-white">
          Connect Wallet
        </h1>
        <p className="w-4/5 max-w-3xl mb-6 text-base text-center text-gray-500 md:text-lg dark:text-gray-300">
          Please connect your wallet to continue to social bureau platform
        </p>
        {/* <Button
          disabled={isConnecting}
          onClick={() => open({ view: 'Networks' })}>
          Connect Wallet
        </Button> */}
      </div>
    </div>
  );
}
