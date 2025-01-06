import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'flowbite-react';
import { Logger } from '../../helper/logger.ts';
// import { useSelector } from 'react-redux';
// import { RootState, useDispatch } from '../../redux/index.ts';
import { toast } from 'react-toastify';
// import { useAccount, useNetwork } from 'wagmi';
// import { MarketAntennaAddresses } from '../../constant/addresses.ts';
// import { ethers } from 'ethers';
import { errorFormat } from '../../helper/error-format.ts';
// import { isEmpty } from 'lodash';
import { mainTokenSymbol } from '../../constant/unit.ts';
import numeral from 'numeral';

type Props = {
  chaToGet: number;
  usdtToPay: number;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const log = new Logger('ChaPurchasingConfirmModal');

export default function ChaPurchasingConfirmModal({
  chaToGet,
  usdtToPay,
  openModal,
  setOpenModal,
}: Props) {
  // const { address } = useAccount();
  // const { chain } = useNetwork();
  // const { usdtContract, marketAntennaContract } = useContract();
  // const dispatch = useDispatch();
  // const { user } = useSelector((state: RootState) => state.account);
  const [isInItializing, setIsInItializing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [needApproval, setNeedApproval] = useState<boolean>(false);
  // const debouncedUsdtToPay = useDebounce(usdtToPay, 500);

  const closeModal = () => {
    if (isLoading) return;
    setOpenModal(false);
  };

  const onConfirmClicked = async () => {
    try {
      setIsLoading(true);
      // if (user) {
      //   const response = await createOrder(user.id, usdtToPay);
      //   if (response.status !== 200) {
      //     toast.error(response?.message);
      //     throw response?.message;
      //   }
      //   log.debug(
      //     `order id : ${response.data.id}, number : ${response.data.orderNumber}`
      //   );

      //   if (!response?.data?.orderNumber) {
      //     throw `Order Number is empty`;
      //   }

      //   if (isEmpty(marketAntennaContract)) {
      //     throw `Market Antenna contract is empty`;
      //   }

      //   const transaction = await marketAntennaContract.pay(
      //     response.data.orderNumber,
      //     ethers.utils.parseEther(`${debouncedUsdtToPay}`)
      //   );
      //   await transaction.wait(); // Wait for the transaction to be mined

      //   log.debug('Transaction successful:', transaction);

      //   const whileCond = true;

      //   let maxRetries = 3;

      //   while (whileCond) {
      //     try {
      //       const check = await checkOrderApi(response?.data?.orderNumber);

      //       log.debug({ check });
      //       if (check?.data?.success) {
      setIsSuccess(true);
      //         break;
      //       }
      //     } catch (error) {
      //       log.error(error);
      //       if (maxRetries > 0) {
      //         log.debug(`Retrying... (${maxRetries} retries left)`);
      //         maxRetries -= 1;
      //       } else {
      //         log.debug('Max retries reached. Unable to complete operation.');
      //         setIsSuccess(true);
      //         break;
      //       }
      //     }
      //   }
      //   dispatch(setBalance());
      // }
    } catch (error) {
      toast.error(errorFormat(error).message);
      setOpenModal(false);
    } finally {
      setNeedApproval(false);
      setIsLoading(false);
    }
  };

  const onApproveClicked = async () => {
    setIsLoading(true);
    try {
      // if (isEmpty(usdtContract)) {
      //   throw `usdt contract is empty`;
      // }
      // const transaction = await usdtContract.approve(
      //   MarketAntennaAddresses[chain!.id],
      //   ethers.utils.parseEther(`${debouncedUsdtToPay}`)
      // );
      // await transaction.wait();
      // log.debug('Transaction successful:', transaction);
      // setNeedApproval(false);
    } catch (error) {
      toast.error(errorFormat(error).message);
      log.error(error);
      setOpenModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsInItializing(true);
        // if (usdtContract) {
        // if (isEmpty(chain)) {
        //   throw `chain infomation is empty`;
        // }
        // if (!address) {
        //   throw `user wallet address is empty`;
        // }
        // const approvalAmount = await usdtContract.allowance(
        //   address,
        //   MarketAntennaAddresses[chain.id]
        // );
        // log.debug(
        //   `trying to check approval to smart contract ${approvalAmount}`
        // );
        // const toPay = ethers.utils.parseEther(`${debouncedUsdtToPay}`);
        // log.debug(
        //   `user should approve more : ${toPay.gt(
        //     approvalAmount
        //   )}, to pay ${toPay}, approvalAmount ${approvalAmount}`
        // );
        // if (toPay.gt(approvalAmount)) {
        //   setNeedApproval(true);
        // }
        // }
      } catch (error) {
        log.error(errorFormat(error).message);
        toast.error(errorFormat(error).message);
        setOpenModal(false);
      } finally {
        setIsInItializing(false);
      }
    })();
  }, []);
  // }, [usdtContract]);

  const displayModalFooter = () => {
    if (isSuccess) {
      return (
        <Button color="gray" className="min-w-[100px]" onClick={closeModal}>
          Close
        </Button>
      );
    }
    if (needApproval) {
      return (
        <>
          <Button
            color="gray"
            className="min-w-[100px]"
            onClick={closeModal}
            disabled={isLoading}>
            Not now
          </Button>
          <Button
            className="bg-primary-700 min-w-[140px]"
            onClick={onApproveClicked}
            isProcessing={isLoading}
            disabled={isLoading}>
            Approve
          </Button>
        </>
      );
    }
    return (
      <>
        <Button
          color="gray"
          className="min-w-[100px]"
          onClick={closeModal}
          disabled={isLoading}>
          Not now
        </Button>
        <Button
          className="bg-orange-500 min-w-[140px]"
          onClick={onConfirmClicked}
          isProcessing={isLoading}
          disabled={isLoading}>
          <div className="w-16">Confirm</div>
        </Button>
      </>
    );
  };

  return (
    <Modal show={openModal} onClose={closeModal} size={'md'}>
      <Modal.Header className="title-modal-custom border-0">
        <div className="mb-0 mt-0 font-bold max-md:text-base text-lg">
          Confirm to buy a cha package?
        </div>
      </Modal.Header>
      {isInItializing ? (
        <>
          <Modal.Body className="py-4">
            <div className="flex justify-center items-center h-[200px]">
              <Spinner size="xl"></Spinner>
            </div>
          </Modal.Body>
        </>
      ) : (
        <>
          <Modal.Body className="py-0">
            {isSuccess ? (
              <p className={'text-green-500'}>
                <span className="font-bold">Success !</span> Transaction is
                persisted, wait 2-3 minutes to update your CHA amount in your
                wallet.
              </p>
            ) : (
              <>
                <div>
                  <div className="flex w-full justify-between flex-col mb-3 gap-2 border rounded-[8px] p-3 md:p-4">
                    <p className="max-sm:text-sm max-sm:mb-1 flex items-center justify-between gap-2">
                      <span className="text-gray-500">Get : </span>
                      <span className="font-bold">
                        {numeral(chaToGet).format('0,0')} CHA
                      </span>
                    </p>
                    <p className="max-sm:text-sm max-sm:mb-1 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-gray-500">Pay : </span>
                      <span className="font-bold">
                        <span className="mr-2 font-normal max-[399px]:text-[11px] text-[13px] text-gray-500">
                          Equivalent to
                        </span>
                        {numeral(usdtToPay).format('0,0')} {mainTokenSymbol}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Do you want to continue to buy ?
                  </p>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-end border-0 gap-2">
            {displayModalFooter()}
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
