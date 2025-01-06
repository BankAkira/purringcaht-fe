import { PropsWithChildren, useState } from 'react';
import { useDispatch, useSelector } from '../redux';
import { useAccount } from 'wagmi';
import {
  CryptoECIES,
  CryptoWallet,
  generateSecret,
} from '../helper/rsa-crypto';
import { EncryptedUserSecret, UserEncryptedSecret } from '../type/crypto';
import { getMyUserSecretApi, updateUserSecretApi } from '../rest-api/user';
import { initializeUserSchemeAction } from '../redux/account';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import FullSpinner from '../component/FullSpinner';
import { ethers } from 'ethers';
import { isEmpty } from 'lodash';
import { Spinner } from 'flowbite-react';
import Button from '../component/button/Button';
import Logo from '../asset/icon/Logo.tsx';
import useResponsive from '../helper/hook/useResponsive';
import useConnectWallet from '../helper/hook/useConnectWallet';

// images
import AwardWinner from '../asset/images/4-award-winner.png';
import ETHGlobalIstanbul from '../asset/images/ETHGlobal-Istanbul.png';

export default function UserEncryptionScheme({ children }: PropsWithChildren) {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const { web3AuthInstance, user, userScheme } = useSelector(
    state => state.account
  );
  const [isInitialize, setIsInitialize] = useState(false);
  const [isError, setIsError] = useState(false);
  const { isTabletOrMobile } = useResponsive();
  const { disconnectWallet } = useConnectWallet();

  useDeepEffect(() => {
    if (!web3AuthInstance && !!address && !!user) {
      window.location.reload();
    }
  }, [web3AuthInstance, address, user]);

  const getMyUserSecret = async () => {
    try {
      const mySecret = await getMyUserSecretApi();

      // {
      //   address
      //   :
      //   "0x3BBfda72Ea631eA009371543d8cC9Bf25078e52e"
      //   createdAt
      //   :
      //   "2024-12-06T05:03:19.668Z"
      //   encryptedUserSecret
      //   :
      //   "0x8ea9cec9e07d8d5bece4e727171008554606221b9fb2916dc22c06ad5cd6583e183aef09d49b8303935cb94d0e271f267425122fd847a310a261f0450431d0090cfc565fff6bce14d3d42c0239c9969f2b6c50e9c966af4b4d90c5469886537ff6de73f3152cab4f68351394cca8f2949117a046"
      //   id
      //   :
      //   "67528597a9338e8faa4133b6"
      //   publicKeyPrefix
      //   :
      //   true
      //   publicKeyX
      //   :
      //   "0x642ede894e9fef43679ed02bfeaa20005848e9780f287623625d3a25d513190f"
      //   updatedAt
      //   :
      //   "2024-12-06T05:03:19.668Z"
      //   userId
      //   :
      //   "67528550a9338e8faa4133ae"
      // }
      console.log('mySecret', mySecret);

      return mySecret;
    } catch (error) {
      return undefined;
    }
  };

  const inCaseAlreadyHaveSecret = async (mySecret: UserEncryptedSecret) => {
    const userSecretBuff = Buffer.from(
      mySecret.encryptedUserSecret.slice(2),
      'hex'
    );
    console.log('userSecretBuff', userSecretBuff);
    const userSecret = await new CryptoWallet(
      address!,
      web3AuthInstance!.provider
    ).decrypt(userSecretBuff);
    console.log('userSecret', userSecret);

    const userScheme = new CryptoECIES(userSecret);
    console.log('userScheme', userScheme);
    dispatch(initializeUserSchemeAction({ userScheme }));
  };

  const inCaseNoSecret = async () => {
    const userSecret = generateSecret();

    const publicKey = Buffer.from(
      new CryptoECIES(userSecret).getPublicKey(),
      'hex'
    );

    const encryptedUserSecret = await new CryptoWallet(
      address!,
      web3AuthInstance!.provider
    ).encrypt(userSecret);

    const userInitialization: EncryptedUserSecret = {
      encryptedUserSecret: ethers.utils.hexlify(
        encryptedUserSecret.toJSON().data
      ),

      publicKeyPrefix: publicKey[0] == 2,
      publicKeyX: ethers.utils.hexlify(publicKey.slice(1).toJSON().data),
      address: address!,
    };

    const response = await updateUserSecretApi(userInitialization);
    if (!response) {
      throw new Error('Update user secret fail');
    }

    const userScheme = new CryptoECIES(userSecret);
    dispatch(initializeUserSchemeAction({ userScheme }));
  };

  const initializeUserSecret = async () => {
    if (web3AuthInstance && address && user && user.isInitProfile) {
      setIsInitialize(true);

      try {
        const mySecret = await getMyUserSecret();
        if (mySecret) {
          await inCaseAlreadyHaveSecret(mySecret);
        } else {
          await inCaseNoSecret();
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsInitialize(false);
      }
    }
  };

  if (isInitialize && !isEmpty(user) && !web3AuthInstance) {
    return <FullSpinner />;
  }

  if (isEmpty(userScheme) && user?.isInitProfile) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-6 bg-gradient-to-l from-[#FEA7C0] from-8% to-[#FFC08A] to-100%">
        <div className="bg-white rounded-full p-5 overflow-hidden border-4 border-[#FFC08A]">
          {!isTabletOrMobile ? (
            <Logo width={110} height={110} />
          ) : (
            <Logo width={70} height={70} />
          )}
        </div>
        <div className="flex flex-col gap-5 justify-center items-center m-[-10px]">
          <img
            className={`${!isTabletOrMobile ? 'w-[30%]' : 'w-[60%]'}`}
            src={AwardWinner}
            alt="AWARD_WINNER"
          />
          <img
            className={`${!isTabletOrMobile ? 'w-[30%]' : 'w-[60%]'}`}
            src={ETHGlobalIstanbul}
            alt="ETHGLOBAL"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <span className="px-2 text-2xl font-semibold text-white lg:text-3xl">
            Welcome to Purring Chat !
          </span>
          <span className="px-2 text-base font-normal text-white max-w-[500px]">
            To secure your messages, Purring Chat needs to authenticate your
            wallet by signing a one-time message. Your private key remains
            secure and is never shared with us. Please sign the message to
            continue.
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <Button
            className="bg-gradient-to-br from-pink-500 to-orange-400 !flex items-center justify-center gap-2 !text-white min-w-[200px] max-h-[40px] !shadow-none"
            disabled={isInitialize}
            label={isInitialize ? <Spinner /> : 'Accept'}
            type="submit"
            onClick={() => initializeUserSecret()}
            size="lg"
          />
          <p
            className="!text-white cursor-pointer text-sm"
            onClick={() => disconnectWallet()}>
            Logout
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-8 bg-gradient-to-l from-[#FEA7C0] from-8% to-[#FFC08A] to-100%">
        <span className="text-3xl font-semibold text-white">
          Something went wrong !
        </span>
        <Button
          className="bg-gradient-to-br from-pink-500 to-orange-400 !flex items-center justify-center gap-2 !text-white min-w-[200px] max-h-[40px] !shadow-none"
          disabled={isInitialize}
          label={'Try again'}
          type="submit"
          onClick={() => window.location.reload()}
          size="lg"
        />
      </div>
    );
  }

  return <>{children}</>;
}
