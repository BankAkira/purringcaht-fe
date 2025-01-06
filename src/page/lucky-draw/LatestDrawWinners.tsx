import { useEffect } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

import { FaAngleLeft } from 'react-icons/fa6';

import { useNavigate } from 'react-router-dom';

import useResponsive from '../../helper/hook/useResponsive';
import { Logger } from '../../helper/logger';

import { RootState, useDispatch, useSelector } from '../../redux';
import {
  setIsOpenMobileControlSidebar,
  toggleMobileControlSidebarAction,
} from '../../redux/convesation-layout';
import { fetchWinningPrizes } from '../../redux/lucky-draw.ts';

import { WinningPrize } from '../../type/lucky-draw.ts';

import CardWinner from '../../features/lucky-draw/components/CardWinner';

import FrameBlack from '../../asset/images/lucky-draw/icons/frame-black.svg';
import CatProfile from '../../asset/images/lucky-draw/cat-profile.png';
import { formatDate } from '../../helper/format-date.ts';

// Create a combined type
type WinningPrizeOrMock =
  | WinningPrize
  | {
      id: string;
      createdAt: string;
      prize: {
        id: string;
        name: string;
        image: string;
        prizeAmount: string;
      };
    };

const log = new Logger('LatestDrawWinners');

// Function to generate mock data
const generateMockData = (count: number): WinningPrizeOrMock[] => {
  const mockData = [];
  for (let i = 1; i <= count; i++) {
    mockData.push({
      id: `mock-id-${i}`,
      createdAt: '-- ----',
      prize: {
        id: `prize-id-${i}`,
        name: `? ? ? ?`,
        image: CatProfile,
        prizeAmount: '0.00',
      },
    });
  }
  return mockData;
};

export default function LatestDrawWinners() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  const winningPrizes = useSelector(
    (state: RootState) => state.luckyDraw.winningPrizes
  ) as WinningPrizeOrMock[];

  useEffect(() => {
    dispatch(fetchWinningPrizes('?page=1&limit=200'));
  }, [dispatch]);

  useEffect(() => {
    log.debug('Winning prizes data:', winningPrizes);
  }, [winningPrizes]);

  useEffect(() => {
    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  const displayPrizes =
    winningPrizes.length === 0 ? generateMockData(103) : winningPrizes;

  const handleCardClick = (userDisplayId?: false | string | undefined) => {
    if (userDisplayId) {
      dispatch(toggleMobileControlSidebarAction());
      navigate(`/profile/${userDisplayId}`);
    } else {
      log.warn('userDisplayId is not available');
    }
  };

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;

    if (mainDiv) {
      mainDiv.style.height = 'auto';
    }

    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  return (
    <div className="w-full min-h-full">
      <div className="flex items-center gap-2 bg-white fixed w-full p-4 z-50">
        <div
          onClick={() => {
            dispatch(toggleMobileControlSidebarAction());
            navigate('/lucky-draw');
          }}>
          <FaAngleLeft className="text-[#6B7280] text-[20px] cursor-pointer w-[23px] h-[23px]" />
        </div>
        <p
          className={classNames('text-gray-900 font-bold', {
            'text-xl': isTabletOrMobile,
            'text-2xl': !isTabletOrMobile,
          })}>
          Latest Draw Winners
        </p>
      </div>
      <div
        className={classNames(
          'flex flex-col justify-between gap-5 bg-white pt-20',
          {
            'px-4 pb-28': isTabletOrMobile,
            'px-8 pb-10': !isTabletOrMobile,
          }
        )}>
        <div className="flex flex-col items-center gap-5">
          <div className="flex justify-center w-full">
            {displayPrizes.slice(0, 1).map((winner, index) => {
              const level = 1;
              const frameColor = 'gold' as const;
              return (
                <CardWinner
                  userDisplayId={
                    'userTicket' in winner &&
                    winner.userTicket?.userPoint?.userId
                      ? winner.userTicket.userPoint.userId
                      : undefined
                  }
                  image={
                    'userTicket' in winner &&
                    winner.userTicket?.userPoint?.user?.picture
                      ? winner.userTicket.userPoint.user.picture
                      : CatProfile
                  }
                  name={
                    'userTicket' in winner
                      ? // eslint-disable-next-line prettier/prettier
                        (winner.userTicket?.userPoint?.user?.displayName ??
                        // eslint-disable-next-line prettier/prettier
                        '? ? ? ?')
                      : '? ? ? ?'
                  }
                  price={'amount' in winner ? winner.amount : '0.00'}
                  level={level}
                  frameColor={frameColor}
                  key={index}
                />
              );
            })}
          </div>
          <div className="flex justify-center w-full gap-5">
            {displayPrizes.slice(1, 3).map((winner, index) => {
              const level = 2;
              const frameColor = 'silver' as const;
              return (
                <CardWinner
                  userDisplayId={
                    'userTicket' in winner &&
                    winner.userTicket?.userPoint?.userId
                      ? winner.userTicket.userPoint.userId
                      : undefined
                  }
                  image={
                    'userTicket' in winner &&
                    winner.userTicket?.userPoint?.user?.picture
                      ? winner.userTicket.userPoint.user.picture
                      : CatProfile
                  }
                  name={
                    'userTicket' in winner
                      ? (winner.userTicket?.userPoint?.user?.displayName ??
                        '? ? ? ?')
                      : '? ? ? ?'
                  }
                  price={'amount' in winner ? winner.amount : '0.00'}
                  level={level}
                  frameColor={frameColor}
                  key={index + 1}
                />
              );
            })}
          </div>
        </div>

        <TableStyled>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              {displayPrizes.slice(3).map((item, index) => {
                const userDisplayId =
                  'userTicket' in item && item.userTicket?.userPoint?.userId;

                return (
                  <tr
                    key={index}
                    className="border-dashed bg-white cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCardClick(userDisplayId)}>
                    <td className="pl-6 py-4 w-[10%] w-unset">
                      <div className="lv-size whitespace-nowrap font-black text-[#6B7280] text-3xl">
                        #{index + 4} {/* Starting from rank 4 */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid sm:grid-cols-2 items-center gap-4">
                        <div className="relative flex items-center justify-center w-full max-w-[70px] aspect-square hide-on-mobile">
                          <div className="relative w-[50%] h-[50%] rounded-full overflow-hidden">
                            <img
                              className="object-cover w-full h-full"
                              src={
                                'userTicket' in item &&
                                item.userTicket?.userPoint?.user?.picture
                                  ? item.userTicket.userPoint.user.picture
                                  : CatProfile
                              }
                              alt="AVATAR"
                            />
                          </div>
                          <img
                            src={FrameBlack}
                            alt="FRAME_BLACK"
                            width={100}
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                        <p className="text-[#212B36] text-sm text-center font-normal">
                          {'userTicket' in item
                            ? (item.userTicket?.userPoint?.user?.displayName ??
                              '? ? ? ?')
                            : '? ? ? ?'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 t-center">
                      ${'amount' in item ? item.amount : '0.00'}
                    </td>
                    <td className="text-end px-12 py-4 hide-on-mobile">
                      {formatDate(
                        item.createdAt || new Date(),
                        'DD/MM/YYYY, HH:mm'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableStyled>
      </div>
    </div>
  );
}

const TableStyled = styled.div`
  border-radius: 16px;
  background: white;
  overflow-x: auto;
  position: relative;
  padding-bottom: 1rem;

  /* shadow-md */
  box-shadow:
    0 0 2px 0 rgba(145, 158, 171, 0.2),
    0 12px 24px -4px rgba(145, 158, 171, 0.12);

  .border-dashed {
    border-bottom: 1px dashed rgba(145, 158, 171, 0.2);
  }

  @media screen and (max-width: 448px) {
    .lv-size {
      font-size: 22px;
    }

    .w-unset {
      width: unset;
    }

    .t-center {
      text-align: center;
    }

    .hide-on-mobile {
      display: none;
    }
  }
`;
