import surpriceBox from '/nft/Lootbox PurringChat-01 1.png';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useState } from 'react';
import './style.css';
import useResponsive from '../../../helper/hook/useResponsive';
import { imageList } from './MockImage';
import { level } from './Level';
export default function Gacha() {
  const [boxCount, setBoxCount] = useState(10);
  const [selectBox, setSelectBox] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [reward, setReward] = useState<number[]>([]);
  const { isTabletOrMobile } = useResponsive();

  const handleChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value;
    if (isNaN(Number(value))) {
      return;
    }
    if (Number(value) > boxCount) {
      setSelectBox(boxCount);
      return;
    }
    setSelectBox(Number(value));
  };

  return (
    <section className="p-5 flex flex-col justify-center items-center gap-4 relative">
      <div
        className="w-28 pb-1 pr-1 rounded-full absolute top-5 right-8"
        style={{
          backgroundImage:
            'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)',
        }}>
        <div
          className="w-full px-3 py-1 flex justify-between items-center rounded-full bg-white"
          style={{
            border: '2.034px solid #FEA7C0',
          }}>
          <img src={surpriceBox} alt={surpriceBox} width={30} height={30} />
          <p className="font-bold">{boxCount}</p>
        </div>
      </div>
      <img src={surpriceBox} alt={surpriceBox} width={375} height={396} />
      <div className="max-w-[444px] flex flex-col items-center gap-4">
        <h1 className="text-xl font-bold">Purring Heist NFT Prize Checker</h1>
        <p className="text-center text-[#637381]">
          Welcome to the Purring Chat NFT Prize Checker! Unlock your prize from
          the exclusive Purring Heist collection and discover the rewards that
          await you. Each NFT holds a secret prize, and lucky winners could
          claim incredible rewards, including a share of our generous prize
          pool.
          <br />
          <br /> Reveal Your Prize: Once your ownership is verified, you’ll be
          able to unveil the prize hidden within your NFT. Will you be our next
          big winner?
          <br />
          <br /> Prizes Include: <br /> 1st Prize: Up to 10 ETH! <br /> 2nd
          Prize: Two winners sharing 5 ETH! <br /> 3rd Prize: 100 winners
          sharing 5 ETH! Good luck! Even if you don’t score a top prize, each
          Purring Heist NFT is a valuable piece of our unique collection.
        </p>
      </div>
      <div
        className={`${isTabletOrMobile ? 'w-full' : 'w-[375px]'} flex justify-center gap-5`}>
        <div
          className="w-[270px] h-[48px] flex justify-between items-center px-2 bg-[#F3F4F6] rounded-full"
          style={{ border: '1px solid #D1D5DB' }}>
          <button
            disabled={selectBox === 0}
            onClick={() => {
              setSelectBox(selectBox - 1);
            }}
            className="bg-[#D1D5DB] rounded-full p-2 text-white"
            style={{
              backgroundImage: `${selectBox === 0 ? '' : 'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)'}`,
            }}>
            <FaMinus style={{ fontSize: 20 }} />
          </button>

          <input
            className="font-bold text-center text-xl w-10 bg-[#F3F4F6]"
            onChange={handleChange}
            value={selectBox}
          />

          <button
            disabled={selectBox === boxCount}
            onClick={() => {
              setSelectBox(selectBox + 1);
            }}
            className="bg-[#D1D5DB] rounded-full p-2 text-white"
            style={{
              backgroundImage: `${selectBox === 10 ? '' : 'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)'}`,
            }}>
            <FaPlus style={{ fontSize: 20 }} />
          </button>
        </div>

        <button
          onClick={() => {
            setSelectBox(boxCount);
          }}
          className="py-3 px-6 text-white font-bold rounded-3xl border-b-2 border-[#B45401]"
          style={{
            backgroundImage:
              'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)',
          }}>
          MAX
        </button>
      </div>
      <div
        className={`${isTabletOrMobile ? 'w-[90%] max-w-[375px]' : 'w-[375px]'} flex flex-col items-center gap-2 text-[#6B7280]`}>
        <p className="font-bold">Own: {boxCount}</p>
        <button
          onClick={() => {
            setBoxCount(10);
            setReward([3, 4, 2]);
            setModal(!modal);
          }}
          style={{
            backgroundImage:
              'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)',
          }}
          className="w-full h-[45px] rounded-3xl font-bold text-white border-b-2 border-[#B45401]">
          UnPack
        </button>
      </div>
      {modal && (
        <>
          <div className="w-full h-full bg-black bg-opacity-25 backdrop-blur-sm absolute left-0 top-0 flex justify-center items-center rounded-3xl">
            <div className="w-[90%] max-h-[500px] bg-white rounded-xl flex flex-col">
              <p className="text-center font-semibold text-lg px-6 py-4">
                Congratulations
              </p>

              <div className="h-full flex flex-col items-center">
                <div
                  className="w-[80%] p-2 scrollbar-hide flex justify-center flex-wrap gap-14 max-h-[70%] overflow-y-auto"
                  style={{}}>
                  {reward.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className="w-[220px] h-[175px] rounded-2xl relative">
                          <img
                            src={imageList[item - 1]}
                            alt={imageList[item - 1]}
                            className={`${index === 1 ? '' : 'mt-20'} w-full h-full rounded-2xl`}
                          />
                          <p
                            className="w-10 h-10 absolute top-0 left-0 text-white flex items-center justify-center rounded-xl"
                            style={{
                              backgroundImage: `${level[item - 1].backgroundBox}`,
                              boxShadow: `${level[item - 1].shadowBox}`,
                            }}>
                            {level[item - 1].lv.slice(0, 4)}
                          </p>
                        </div>
                        <h1
                          className="text-center text-xl mt-2 font-bold p-4 rounded-2xl"
                          style={{
                            boxShadow: `${level[item - 1].shadowLine}`,
                          }}>
                          Knight Cat
                        </h1>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6">
                  <button
                    className="px-6 py-3 rounded-full text-white bg-gradient-to-br from-pink-500 to-orange-400"
                    onClick={() => {
                      setModal(!modal);
                    }}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
