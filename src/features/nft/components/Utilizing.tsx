import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { level } from './Level';
import { imageList } from './MockImage';
import useResponsive from '../../../helper/hook/useResponsive';
import { Modal } from 'flowbite-react';
import { FiAlertTriangle } from 'react-icons/fi';

interface indexs {
  index: number | null;
}

export default function MyNfts() {
  const countReward: number[] = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
  const [reward, setReward] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isHovered, setIsHovered] = useState<indexs>({ index: null });
  const [openLevel, setOpenLevel] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const { isTabletOrMobile } = useResponsive();

  const handleClick = (lv: string) => {
    if (lv === 'All level') {
      setReward(countReward);
      return;
    }

    const filterLevel = countReward.filter(item => {
      return Number(lv.slice(3, 4)) === item;
    });
    setReward(filterLevel);
  };

  const handleMouseEnter = (index: number) => {
    setIsHovered({ index: index });
  };

  const handleMouseLeave = () => {
    setIsHovered({ index: null });
  };

  const handleUtilizing = (index: number | null) => {
    setConfirm(index);
    setModal(!modal);
  };

  const handleConfirm = (index: number) => {
    const newReward = [...reward];
    newReward.splice(index, 1);
    setReward(newReward);
  };

  return (
    <section className="p-5 flex flex-col gap-6">
      <header className="flex justify-between">
        <p className="text-2xl font-bold">My NFTs</p>
        <div className="font-bold relative">
          <button
            type="button"
            onClick={() => {
              setOpenLevel(!openLevel);
            }}
            className="flex items-center gap-2">
            <p>All level</p>
            <p>
              <IoIosArrowDown />
            </p>
          </button>
          {openLevel && (
            <>
              <div
                className="absolute w-56 right-0 bg-white rounded-2xl z-50"
                style={{ boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.10)' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleClick('All level');
                    setOpenLevel(!openLevel);
                  }}
                  className="w-full text-start px-4 py-2">
                  All level
                </button>
                {level.map((item, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        handleClick(item.lv);
                        setOpenLevel(!openLevel);
                      }}
                      className="w-full text-start px-4 py-2">
                      {item.lv}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </header>

      <ul
        className={
          'flex flex-wrap gap-y-4 gap-x-3 ' +
          `${isTabletOrMobile && 'justify-center'}`
        }>
        {reward.map((item, index) => {
          return (
            <li
              key={index}
              onMouseEnter={() => {
                handleMouseEnter(index);
              }}
              onMouseLeave={() => {
                handleMouseLeave();
              }}
              className="w-[19%] min-w-[200px] h-[346px] rounded-xl relative"
              style={{
                boxShadow:
                  '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
              }}>
              <img
                src={imageList[item - 1]}
                alt={imageList[item - 1]}
                className="w-full h-[50%] rounded-t-xl"
              />
              <p className="bg-white px-2 py-1 font-bold text-xs text-[#31C48D] rounded-2xl absolute top-3 left-2">
                Utilizing
              </p>
              <div className="relative">
                <p
                  className="w-full h-2"
                  style={{
                    backgroundImage: `${level[item - 1].backgroundLine}`,
                    boxShadow: `${level[item - 1].shadowLine}`,
                  }}></p>
                <p
                  className="w-10 h-10 absolute top-[-16px] right-2 text-sm text-white font-bold flex items-center justify-center rounded-xl"
                  style={{
                    backgroundImage: `${level[item - 1].backgroundBox}`,
                    boxShadow: `${level[item - 1].shadowBox}`,
                    border: `${level[item - 1].borderBox}`,
                  }}>
                  {level[item - 1].lv.slice(0, 4)}
                </p>
              </div>

              <div className="w-full h-[50%] flex flex-col">
                <h1 className="px-4 py-5 text-xl font-bold">Knight CAT</h1>

                <ul className="flex flex-col px-4 pb-5 gap-3">
                  <li className="flex justify-between">
                    <div>
                      <p className="text-sm ">You Got it for</p>
                      <p className="font-extrabold">$ 3.33</p>
                    </div>

                    <div>
                      <p className="text-sm">Asking Pricc</p>
                      <p className="font-extrabold">$ 16.53</p>
                    </div>
                  </li>

                  <li className="flex justify-between">
                    <p className="text-xs">% Reward pool shared</p>
                    <p className="text-xs text-[#31C48D]">350.15 %</p>
                  </li>
                </ul>
              </div>
              {isHovered.index === index && (
                <div className="w-full h-full bg-black bg-opacity-30 absolute top-0 rounded-xl flex justify-center items-center">
                  <button
                    onClick={() => {
                      handleUtilizing(index);
                    }}
                    className="bg-white py-3 px-4 font-bold text-xs  rounded-3xl">
                    Deactivate
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {modal && (
        <>
          <Modal dismissible show={modal} size={'lg'}>
            <div className="pt-8 pb-6 flex justify-center">
              <FiAlertTriangle style={{ width: '25px', height: '25px' }} />
            </div>
            <p className="text-center font-semibold text-lg">
              Confirm to Deactivate
            </p>

            <p className="gap-4 max-h-[60vh] text-center">
              You can reactivate it later if needed
            </p>

            <div className="flex justify-center p-8 gap-10">
              <button
                className="px-6 py-2 border-2 rounded-3xl"
                onClick={() => {
                  handleUtilizing(null);
                }}>
                Cancel
              </button>
              <button
                className="px-6 py-2 text-white  bg-gradient-to-br from-pink-500 to-orange-400 rounded-3xl"
                onClick={() => {
                  handleUtilizing(null);
                  handleConfirm(Number(confirm));
                }}>
                Confirm
              </button>
            </div>
          </Modal>
        </>
      )}
    </section>
  );
}
