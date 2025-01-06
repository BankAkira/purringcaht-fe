// helper functions
import useConnectWallet from '../../helper/hook/useConnectWallet';
import useResponsive from '../../helper/hook/useResponsive';

// components
import Landing from '../../component/landing/Landing';
import Button from '../../component/button/Button';

// icons
import Logo from '../../asset/icon/Logo';

export default function ConnectWallet() {
  const { isTabletOrMobile } = useResponsive();
  const { connectWallet } = useConnectWallet();

  return (
    <div className="w-full min-h-screen flex flex-col gap-3 justify-center items-center bg-gradient-to-l from-[#FEA7C0] from-8% to-[#FFC08A] to-100%">
      <div className="bg-white rounded-full p-5 overflow-hidden border-4 border-[#FFC08A]">
        {!isTabletOrMobile ? (
          <Logo width={110} height={110} />
        ) : (
          <Logo width={70} height={70} />
        )}
      </div>
      <Landing
        button={
          <Button
            className="text-white mt-6 bg-gradient-to-br from-pink-500 to-orange-400 min-h-[50px] min-w-[200px] w-full"
            label="Connect wallet"
            onClick={() => connectWallet()}
            size="lg"
            variant="primary"
          />
        }
        subTitle="Please connect your wallet to chat with the others."
        title="Connect Wallet to Continue"
        titleClass="text-white md:text-3xl"
        subTitleClass="text-white"
      />
    </div>
  );
}
