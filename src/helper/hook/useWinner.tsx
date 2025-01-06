import { useEffect, useState } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import contractABI from '../../environment/nftwinnerABI.json';
// import CatProfile from '../../../asset/images/lucky-draw/cat-profile.png';

const contractAddress = '0x2164D3a4776892330c05290A0d03E312FA8D1940';

// type Winner = number | undefined;
type Winner = {
  first: number[];
  second: number[];
  third: number[];
};

export const useWinners = (): Winner => {
  const { isConnected } = useAccount(); // Get the user's address
  const [winners, setWinner] = useState<Winner>({
    first: [],
    second: [],
    third: [],
  });

  // Fetch winners from the smart contract using useContractRead
  const { data: winnersData, isError } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getWinners',
    enabled: isConnected, // Only enable when the account is connected
  });

  useEffect(() => {
    if (winnersData && !isError) {
      // console.log('winnersData:', winnersData, typeof(winnersData));
      // eslint-disable-next-line prefer-const
      let tempWinner = winnersData as number[][] | undefined;
      //convert object to nummber[][]

      // console.log('winnersData before tempWinner :', tempWinner);
      if (tempWinner) {
        // eslint-disable-next-line prefer-const
        let len = tempWinner.length;
        // eslint-disable-next-line prefer-const
        let dataWinner: Winner = {
          first: [],
          second: [],
          third: [],
        };

        // console.log('winnersData before if len 3 :', winnersData,len);
        if (len == 3) {
          // foreach tempWinner as number[][];
          tempWinner.forEach((winnerArray, index) => {
            if (index === 0) {
              dataWinner.first = winnerArray;
            } else if (index === 1) {
              dataWinner.second = winnerArray;
            } else if (index === 2) {
              dataWinner.third = winnerArray;
            }
          });
          // console.log('winnersData after if len 3 :', winnersData);
          setWinner(dataWinner);
        }
      }
    }
  }, [winnersData, isError]);

  return winners;
};
