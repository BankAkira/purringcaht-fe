// import (Internal imports)
import classNames from 'classnames';
import styled from 'styled-components';

// react-redux
import { useSelector } from '../../../redux';
import { useDispatch } from '../../../redux';

// react-icons
// import { FaAngleRight } from 'react-icons/fa6';

// flowbite-react
import { Button } from 'flowbite-react';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive.ts';
import { Logger } from '../../../helper/logger.ts';

// helper
import useBoolean from '../../../helper/hook/useBoolean.ts';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';

// images
import BandRed from '../../../asset/images/lucky-draw/band-red.png';
import BoxPurrPoints from '../../../asset/images/lucky-draw/box-purr-points.png';
import BtnBallot from '../../../asset/images/lucky-draw/btn-ballots.png';
import ConfettiGold2 from '../../../asset/images/lucky-draw/confetti-glod-2.png';
import BallotTickets from '../../../asset/images/lucky-draw/ballot-tickets.svg';

// import BuyTicketModal from '../modals/BuyTicketModal.tsx';
import BuyTicketModal from '../modals/BuyTicketModal.tsx';
import UseTicketModal from '../modals/UseTicketModal.tsx';
import {
  redeemTickets,
  createUseTicketsApi,
} from '../../../rest-api/lucky-draw.ts';
import { getUserPoints } from '../../../redux/user-point.ts';

import { getPrizePoolNow, getUserTickets } from '../../../redux/lucky-draw.ts';
const log = new Logger('BalanceBallotsSection');

export default function BalanceBallotsSection() {
  const dispatch = useDispatch();
  const { isTabletOrMobile } = useResponsive();
  const { points } = useSelector(state => state.userPoint);
  const { tickets, prizePoolNow } = useSelector(state => state.luckyDraw);

  const [isOpenBuyTicketModal, onOpenBuyTicketModal, onCloseBuyTicketModal] =
    useBoolean();
  const [isOpenUseTicketModal, onOpenUseTicketModal, onCloseUseTicketModal] =
    useBoolean();

  useDeepEffect(() => {
    onCloseBuyTicketModal();
    onCloseUseTicketModal();
    dispatch(getUserTickets());
  }, []);

  const redeemTicket = (amount: number) => {
    if (amount === 0) return;
    redeemTicketApi(amount);
    onCloseBuyTicketModal();
  };

  const useTicket = (amount: number) => {
    if (amount === 0) return;
    createUseTicket(amount);
    onCloseUseTicketModal();
  };

  const redeemTicketApi = async (amount: number) => {
    try {
      const res = await redeemTickets({ amount });
      if (res) {
        dispatch(getUserPoints());
        dispatch(getUserTickets());
      }
    } catch (error) {
      log.error('error', error);
    }
  };
  const createUseTicket = async (amount: number) => {
    dispatch(getPrizePoolNow());
    try {
      setTimeout(async () => {
        if (!prizePoolNow?.id || amount <= 0) return;
        const res = await createUseTicketsApi({
          amount,
          prizePoolId: prizePoolNow.id,
        });
        if (res) {
          dispatch(getUserTickets());
        }
        log.debug(' res createUseTicket', res);
      }, 1000);
    } catch (error) {
      log.error('error', error);
    }
  };

  return (
    <section>
      <SectionCustom>
        <div className="s-card flex items-center gap-3">
          <CardStyled>
            <div className="flex flex-col justify-center w-full px-5 py-4">
              <div
                className={classNames('items-center', {
                  'flex flex-row justify-center': isTabletOrMobile,
                  'grid grid-cols-[1fr_1fr]': !isTabletOrMobile,
                })}>
                <div className="flex flex-col justify-between gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[#111928] text-xl font-medium text-center">
                      PurrPoints Balance
                    </p>
                    <p className="text-[#111928] text-5xl font-extrabold">
                      {points.toFixed(3)}
                    </p>
                    <p className="text-[#111928] text-base font-normal text-center">
                      1 Ballots for{' '}
                      <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
                        0.010 PurrPoints
                      </span>
                    </p>
                  </div>
                  <Button
                    pill
                    outline
                    size="md"
                    gradientDuoTone="pinkToOrange"
                    className="w-full bg-pink-orange group z-10"
                    onClick={() => onOpenBuyTicketModal()}>
                    <p className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent cursor-pointer group-hover:text-white">
                      Redeem Ballots
                    </p>
                  </Button>
                </div>
                <div
                  className={classNames('max-w-[750px] flex justify-end z-10', {
                    hidden: isTabletOrMobile,
                  })}>
                  <img src={BoxPurrPoints} alt="BOX_PURR_POINTS" />
                </div>
              </div>
              <div
                className={classNames(
                  'absolute max-w-[750px] right-[-170px] top-[-80px]',
                  {
                    hidden: isTabletOrMobile,
                  }
                )}>
                <img src={BandRed} alt="BAND_RED" />
              </div>
            </div>
          </CardStyled>
          <CardStyled>
            <div className="flex flex-col justify-center w-full px-5 py-4">
              <div
                className={classNames('items-center', {
                  'flex flex-row justify-center': isTabletOrMobile,
                  'grid grid-cols-[auto_1fr]': !isTabletOrMobile,
                })}>
                <div className="left-ballots flex flex-col justify-between gap-6 z-10">
                  <div className="tickets grid grid-rows-[1fr_1fr_auto] items-center gap-3">
                    <p className="tt-tickets text-[#111928] text-xl font-medium text-center bg-[#FFFFFFE8] rounded-2xl p-2">
                      Your Available ballots
                    </p>
                    <div className="flex items-center justify-center self-stretch gap-2">
                      <img src={BallotTickets} alt="BALLOT_TICKETS" />
                      <p className="t-tickets text-5xl font-extrabold inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                        x {tickets}
                      </p>
                    </div>
                  </div>
                  <Button
                    pill
                    size="lg"
                    gradientDuoTone="pinkToOrange"
                    className="w-full text-white text-base font-medium hover:opacity-65"
                    onClick={() => onOpenUseTicketModal()}>
                    Enter Lucky Draw with Ballots
                  </Button>
                </div>
                <div
                  className={classNames('max-w-[750px] flex justify-end z-10', {
                    hidden: isTabletOrMobile,
                  })}>
                  <img src={BtnBallot} alt="BTN_BALLOTS" />
                </div>
              </div>
              <div
                className={classNames(
                  'absolute max-w-[750px] right-[-170px] top-[-80px]',
                  {
                    hidden: isTabletOrMobile,
                  }
                )}>
                <img src={BandRed} alt="BAND_RED" />
              </div>
              <div
                className={classNames('absolute max-w-[750px] right-0 top-3', {
                  hidden: isTabletOrMobile,
                })}>
                <img src={ConfettiGold2} alt="CONFETTI_GOLD_2" />
              </div>
            </div>
          </CardStyled>
        </div>
      </SectionCustom>
      <BuyTicketModal
        onBuyTicket={redeemTicket}
        openModal={isOpenBuyTicketModal}
        onCloseModal={onCloseBuyTicketModal}
      />
      <UseTicketModal
        onUseTickets={useTicket}
        openModal={isOpenUseTicketModal}
        onCloseModal={onCloseUseTicketModal}
      />
    </section>
  );
}

const SectionCustom = styled.div`
  .s-card {
    @media screen and (max-width: 576px) {
      flex-wrap: wrap;
      width: 100%;
    }
  }
`;

const CardStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 250px;
  position: relative;
  border-radius: 20px;
  background: linear-gradient(274deg, #ffecf1 1.97%, #fff1e6 100%);
  overflow: hidden;

  /* shadow-md */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.05);

  @media (min-width: 1023px) and (max-width: 1315px),
    (min-width: 577px) and (max-width: 635px) {
    .left-ballots {
      .tickets {
        .tt-tickets {
          font-size: 16px;
        }
        .t-tickets {
          font-size: 28px;
        }
      }

      button {
        span {
          font-size: 12px;
        }
      }
    }
  }
`;
