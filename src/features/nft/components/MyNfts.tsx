import { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Modal } from 'flowbite-react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useWinners } from '../../../helper/hook/useWinner';
import { getNftData } from '../../../rest-api/opensea';
import { useAccount } from 'wagmi';
import useResponsive from '../../../helper/hook/useResponsive';

// interface IndexState {
//   index: number | null;
// }

interface UtilState {
  [key: number]: boolean;
}

interface NFT {
  identifier: number;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string | null;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}

interface NFTResponse {
  nfts: NFT[];
}

export default function MyNfts() {
  const { isTabletOrMobile } = useResponsive();
  // const walletAddress = useAccount();
  // const walletAddress = useAccount();
  const nftwinners = useWinners(); // Winner data
  const [nftData, setNFTData] = useState<NFTResponse | null>(null);
  // const [isHovered, setIsHovered] = useState<IndexState>({ index: null });
  const [confirm, setConfirm] = useState<number | null>(null);
  const [utilizing, setUtilizing] = useState<UtilState>({});
  const [modal, setModal] = useState(false);
  // const [reward, setReward] = useState<number[]>([1, 2, 3, 4, 5]);
  // const [reward, setReward] = useState<number[]>([1, 2, 3, 4, 5]);

  const disableUselessUI = true;

  const { address } = useAccount(); // Extract the address from the useAccount result

  // Fetch NFT data
  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        if (!address) {
          console.error('No wallet address found');
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await getNftData(address); // Use the extracted address

        const mappedData: NFTResponse = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nfts: data.nfts.map((nft: any) => ({
            ...nft,
          })),
        };
        setNFTData(mappedData);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    };

    fetchNFTData();
  }, [address]);

  // Fetch NFT data
  // useEffect(() => {
  //   const fetchNFTData = async () => {
  //     try {
  //       const data: any = await getNftData(
  //         walletAddress
  //       );
  //       const mappedData: NFTResponse = {
  //         nfts: data.nfts.map((nft: any) => ({
  //           ...nft,
  //         })),
  //       };
  //       setNFTData(mappedData);
  //     } catch (error) {
  //       console.error('Error fetching NFT data:', error);
  //     }
  //   };
  //   fetchNFTData();
  // }, []);

  const getPrizeForNFT = (identifier: number): string => {
    const idAsBigInt = BigInt(identifier); // Convert identifier to BigInt

    if (nftwinners.first.map(BigInt).includes(idAsBigInt)) return '1st prize';
    if (nftwinners.second.map(BigInt).includes(idAsBigInt)) return '2nd prize';
    if (nftwinners.third.map(BigInt).includes(idAsBigInt)) return '3rd prize';
    return 'No reward';
  };

  const handleUtilizing = (index: number | null) => {
    setConfirm(index);
    setModal(!modal);
  };

  const handleConfirm = (index: number) => {
    const newUtil = { ...utilizing };
    if (newUtil[index]) {
      delete newUtil[index];
    } else if (Object.keys(utilizing).length < 10) {
      newUtil[index] = true;
    }
    setUtilizing(newUtil);
  };

  return (
    <section className="p-5 flex flex-col gap-6">
      <header className="flex justify-between">
        <p className="text-2xl font-bold">My NFTs</p>
        {!disableUselessUI && (
          <div className="font-bold relative">
            <button
              type="button"
              onClick={() => setModal(!modal)}
              className="flex items-center gap-2">
              <p>All level</p>
              <IoIosArrowDown />
            </button>
          </div>
        )}
      </header>

      <ul
        className={`flex flex-wrap gap-y-4 gap-x-3 ${
          isTabletOrMobile ? 'justify-center' : ''
        }`}>
        {nftData?.nfts.map((item, index) => (
          <li
            key={index}
            className="w-[19%] min-w-[200px] min-h-250 h-[300px] rounded-xl relative"
            style={{
              boxShadow:
                '0px 0px 2px 0px rgba(145, 158, 171, 0.20), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            }}>
            {utilizing[index] && (
              <p className="bg-white px-2 py-1 font-bold text-xs text-[#31C48D] rounded-2xl absolute top-3 left-2">
                Utilizing
              </p>
            )}
            <img
              src={item.display_image_url}
              alt={`img_${item.name}`}
              className="w-full h-[70%] object-cover rounded-t-xl"
            />

            <div className="w-full h-[30%] flex flex-col">
              <h1 className="px-4 py-5 text-l font-bold">{item.name}</h1>
              <div className="flex justify-between px-4">
                <p>{getPrizeForNFT(Number(item.identifier))}</p>
              </div>
            </div>

            {/* {isHovered.index === index && (
              <div className="w-full h-full bg-black bg-opacity-30 absolute top-0 rounded-xl flex justify-center items-center">
                <button
                  onClick={() => handleUtilizing(index)}
                  className={`bg-white py-3 px-4 font-bold text-xs ${
                    !utilizing[index] && 'text-[#31C48D]'
                  } rounded-3xl`}>
                  {utilizing[index] ? 'Deactivate' : 'Utilizing'}
                </button>
              </div>
            )} */}
          </li>
        ))}
      </ul>

      {modal && (
        <Modal dismissible show={modal} size="lg">
          <div className="pt-8 pb-6 flex justify-center">
            <FiAlertTriangle style={{ width: '25px', height: '25px' }} />
          </div>
          <p className="text-center font-semibold text-lg">
            Confirm to {utilizing[Number(confirm)] ? 'Deactivate' : 'Utilizing'}
          </p>
          <div className="flex justify-center p-8 gap-10">
            <button
              className="px-6 py-2 border-2 rounded-3xl"
              onClick={() => handleUtilizing(null)}>
              Cancel
            </button>
            <button
              className="px-6 py-2 text-white bg-gradient-to-br from-pink-500 to-orange-400 rounded-3xl"
              onClick={() => {
                handleUtilizing(null);
                handleConfirm(Number(confirm));
              }}>
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
