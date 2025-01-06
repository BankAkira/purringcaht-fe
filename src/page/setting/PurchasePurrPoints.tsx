// import (Internal imports)
import { ChangeEvent, useEffect, useState } from 'react';

import numeral from 'numeral';

// react-icons
import { IoInformationCircle } from 'react-icons/io5';

// flowbite-react
import { Label, Tooltip, Spinner, TextInput } from 'flowbite-react';

// helper functions
import { Logger } from '../../helper/logger';
import useResponsive from '../../helper/hook/useResponsive';

// constants
import { defaultImages } from '../../constant/default-images';
import { mainTokenSymbol } from '../../constant/unit';

// components
import Button from '../../component/button/Button';
import ChaPurchasingConfirmModal from '../../component/setting/ChaPurchasingConfirmModal';
import IconButton from '../../component/icon-button/IconButton';
import classNames from 'classnames';

const log = new Logger('Purchase');

export type ChaPackage = {
  name: string;
  amountIn: number;
  amountOut: number;
};

const mockPackage = [
  { name: '1', amountIn: 100, amountOut: 1000 },
  { name: '2', amountIn: 200, amountOut: 2000 },
  { name: '3', amountIn: 300, amountOut: 3000 },
  { name: '4', amountIn: 400, amountOut: 4000 },
  { name: '5', amountIn: 500, amountOut: 5000 },
  { name: '6', amountIn: 600, amountOut: 6000 },
];

export default function PurchasePurrPoints() {
  const { isTabletOrMobile } = useResponsive();

  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [chaPackages, setChaPackages] = useState<ChaPackage[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalCha, setTotalCha] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<ChaPackage>();

  const [customAmount, setCustomAmount] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetchPackages = async () => {
    try {
      // const resp = await fetchStarExchangeRate();
      // if (resp.status !== 200) {
      //   toast.error(resp?.message);
      //   throw resp?.message;
      // }
      // log.debug(`exchange rate `, resp.data);
      // setStarPackages(resp.data.packages);
      // setExchangeRate(resp.data.exchangeRate);
      setChaPackages(mockPackage);
      setExchangeRate(1);
      setTotalPrice(0);
      setTotalCha(0);
    } catch (error) {
      log.error(error);
    }
  };

  useEffect(() => {
    fetchPackages().catch(error => log.error(error));
    //getMyToken();
  }, []);

  useEffect(() => {
    const coinInput = document.getElementById('coin-input');
    if (coinInput) {
      coinInput.focus();
    }

    setTotalPrice(selectedPackage ? selectedPackage.amountIn : 0);
    setTotalCha(selectedPackage ? selectedPackage.amountOut : 0);
  }, [selectedPackage]);

  const handlePackageSelected = (starPackage: ChaPackage) => {
    setIsCustomAmount(false);
    setSelectedPackage(starPackage);
  };

  const handleCustomCoinsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setCustomAmount(isNaN(value) ? 0 : value);
    setTotalPrice(value / exchangeRate);
    setTotalCha(value);
  };

  const handlePurchaseButtonClicked = () => {
    setOpenModal(true);
  };

  const handleCustomAmountSelected = () => {
    setSelectedPackage(undefined);
    setIsCustomAmount(true);
  };

  return (
    <div
      className={classNames('h-screen flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 max-lg:text-xl select-none flex-wrap">
          Purchase Points{' '}
          <Tooltip
            content="Check your points balance and use PURRING tokens to purchase more points"
            placement="top">
            <IconButton
              color="#9CA3AF"
              height={18}
              icon={IoInformationCircle}
              onClick={() => {}}
              width={18}
            />
          </Tooltip>
          <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
            (This feature will be available soon.)
          </span>
        </div>
        <Label className="text-gray-500">
          Using USDT to purchase points, which can be used on our platform to
          save on gas fees.
        </Label>
      </div>

      <div className="pb-40">
        {chaPackages && chaPackages.length ? (
          <>
            <div className="flex flex-col items-stretch">
              <div className="items-start bg-white w-full grow mx-auto rounded-none sm:rounded-lg max-md:mt-5 max-lg:pb-[50px]">
                <div className="justify-between items-start self-center flex w-full gap-0">
                  <div className="text-gray-900 max-sm:text-base text-lg font-extrabold leading-7 self-stretch basis-auto">
                    Select package to purchase
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-0 mt-4 mb-4 gap-x-4 gap-y-4 items-center justify-start">
                  {chaPackages.map((chaPackage, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-center border-[1px] rounded-lg p-8 w-full ${
                        selectedPackage === chaPackage
                          ? 'border-orange-500 cursor-pointer'
                          : 'cursor-pointer'
                      }`}
                      onClick={() => handlePackageSelected(chaPackage)}>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-1.5 text-center">
                          <img
                            src={defaultImages.chaImg}
                            width="20"
                            alt=""
                            onError={e => {
                              e.currentTarget.src = defaultImages.errorImage;
                            }}
                            style={{
                              borderRadius: '9999px',
                            }}
                          />
                          <span className="font-bold text-xl">
                            {numeral(chaPackage.amountOut).format('0,0')}
                          </span>
                        </div>
                        <p className="text-gray-500 text-base text-center">
                          <span className="mr-1 text-xs">Equivalent to</span>
                          {numeral(chaPackage.amountIn).format('0,0')}{' '}
                          {mainTokenSymbol}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div
                    className={`flex items-center justify-center border-[1px] rounded-lg p-3 min-h-[124px] w-full ${
                      isCustomAmount
                        ? 'border-orange-500 cursor-pointer'
                        : 'cursor-pointer'
                    }`}
                    onClick={handleCustomAmountSelected}>
                    <div className="flex flex-col items-start">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="font-bold text-2xl w-full flex items-center gap-1.5 justify-center">
                          <img
                            src={defaultImages.chaImg}
                            width="20"
                            alt=""
                            onError={e => {
                              e.currentTarget.src = defaultImages.errorImage;
                            }}
                            style={{
                              borderRadius: '9999px',
                            }}
                          />

                          {isCustomAmount ? (
                            <TextInput
                              id="coin-input"
                              placeholder="Enter the amount you want"
                              type="number"
                              value={customAmount === 0 ? '' : customAmount}
                              onChange={handleCustomCoinsChange}
                              style={{
                                fontWeight: '300',
                                width: '100%',
                                height: '34px',
                              }}
                              className="max-sm:min-w-[200px] w-full xl:min-w-[200px]"
                            />
                          ) : (
                            <>
                              <h5 className="text-base md:text-base xl:text-xl">
                                Custom Amount
                              </h5>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-normal text-center">
                          Customize your star amount to get
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-6" />
                <div className="w-full max-sm:max-w-[100%] max-w-[350px] flex flex-col justify-center items-start ml-auto max-sm:bg-[#ffffff80] max-sm:backdrop-blur-[10px] max-sm:fixed max-sm:left-0 max-sm:bottom-16 max-sm:pb-8 max-sm:pt-4 max-sm:px-3 max-sm:border-t z-[100]">
                  <div className="flex w-full justify-between flex-col max-sm:mb-2 mb-3">
                    <h5 className="max-sm:text-base text-xl font-bold max-sm:mb-1 mb-2">
                      Summary
                    </h5>
                    <p className="max-sm:text-sm max-sm:mb-1 mb-2 flex items-center justify-between gap-2">
                      <span className="text-gray-500">Get :</span>
                      <span className="font-bold">
                        {isNaN(totalCha) ? 0 : numeral(totalCha).format('0,0')}{' '}
                        Points
                      </span>
                    </p>
                    <p className="max-sm:text-sm max-sm:mb-1 mb-2 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-gray-500">Pay : </span>
                      <span className="font-bold">
                        <span className="mr-2 font-normal max-[399px]:text-[11px] text-[13px] text-gray-500">
                          Equivalent to
                        </span>
                        {isNaN(totalPrice)
                          ? 0
                          : numeral(totalPrice).format('0,0')}{' '}
                        {mainTokenSymbol}
                      </span>
                    </p>
                  </div>

                  <Button
                    disabled={totalPrice === 0 || totalCha === 0}
                    className="!flex w-full items-center justify-center gap-2 !text-white bg-gradient-to-br from-pink-500 to-orange-400 !shadow-none"
                    label="Purchase"
                    onClick={handlePurchaseButtonClicked}
                  />
                </div>
              </div>
            </div>
            {openModal && (
              <ChaPurchasingConfirmModal
                chaToGet={totalCha}
                usdtToPay={totalPrice}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            )}
          </>
        ) : (
          <div className="w-full h-[80vh] flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
