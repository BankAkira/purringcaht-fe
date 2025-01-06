// import (Internal imports)
import classNames from 'classnames';
import styled from 'styled-components';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive.ts';
import { useDispatch, useSelector } from '../../../redux/index.ts';
import { Logger } from '../../../helper/logger.ts';

// images
import LuckyDrawPrize from '../../../asset/images/lucky-draw/lucky-draw-prize.png';
import Ballots from '../../../asset/images/lucky-draw/ballots.png';
import BandGray from '../../../asset/images/lucky-draw/band-gray.png';
import ConfettiGold from '../../../asset/images/lucky-draw/confetti-gold.png';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';
import CountdownTimer from '../../purr-post/components/CountdownTimer.tsx';
import { getPrizePoolNow } from '../../../redux/lucky-draw.ts';
import { isToday } from '../../../helper/format-date.ts';

const log = new Logger('HeaderSection');

export default function HeaderSection() {
  const dispatch = useDispatch();
  const { prizePoolNow } = useSelector(state => state.luckyDraw);

  const { isTabletOrMobile } = useResponsive();
  // const [prizePoolNow, setPrizePoolNow] = useState<LuckyDrawEvent | null>();

  useDeepEffect(() => {
    if (!prizePoolNow) dispatch(getPrizePoolNow());
    log.debug('HeaderSection luckyDraw');
  }, [prizePoolNow]);

  return (
    <section>
      <CardStyled>
        <div
          className={classNames(
            'flex items-center justify-between self-stretch gap-10',
            {
              'flex-col p-4': isTabletOrMobile,
              'px-5 py-8': !isTabletOrMobile,
            }
          )}>
          <div className="prize-fund flex flex-col items-center text-center z-10">
            <img src={LuckyDrawPrize} alt="LUCKY_DRAW_PRICE" />
            <div
              className="inline-block transform rotate-[-10deg] skew-x-[-10deg] shadow-lg"
              style={{
                background:
                  'linear-gradient(100deg, #F2EBC6 8.63%, #FFEEAB 44.6%, #F9ED84 70.07%, #F9EB7E 77.56%, #FBE76E 88.05%, #FDE153 100.04%, #FFDE45 106.03%, #EEC02E 113.52%, #F4A52C 146.49%)',
                borderRadius: '2px',
                padding: '8px 16px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}>
              <p className="text-[#A14A0D] text-4xl font-extrabold transform skew-x-[10deg]">
                $
                {prizePoolNow?.prizeAmount
                  ? Number(prizePoolNow?.prizeAmount).toLocaleString()
                  : 0}{' '}
                USDC
              </p>
            </div>
          </div>
          <div
            className={classNames(
              'lucky-count-down flex flex-col items-center gap-4 bg-[#FFFFFF33] rounded-2xl px-5 py-6 z-10',
              {
                'w-full': isTabletOrMobile,
                '': !isTabletOrMobile,
              }
            )}>
            <CountdownTimer
              title={
                isToday(prizePoolNow?.drawDate)
                  ? 'Awards are being announced'
                  : 'Next Drawn In'
              }
              endTime={prizePoolNow?.drawDate}
            />
          </div>
          {!isTabletOrMobile && <div className="ballots"></div>}
        </div>
        <div
          className={classNames('absolute', {
            'max-w-[1247px] w-[1247px] bottom-[-142px] left-[-182px]':
              isTabletOrMobile,
            'max-w-[1050px] left-[35px] top-[-256px]': !isTabletOrMobile,
          })}>
          <img src={ConfettiGold} alt="CONFETTI_GOLD" />
        </div>
        <div
          className={classNames(
            'absolute max-w-[750px] right-[-170px] top-[-124px] z-[5]',
            {
              hidden: isTabletOrMobile,
              '': !isTabletOrMobile,
            }
          )}>
          <img src={Ballots} alt="BALLOTS" />
        </div>
        <div
          className={classNames(
            'absolute max-w-[750px] right-[-170px] top-[-124px]',
            {
              hidden: isTabletOrMobile,
              '': !isTabletOrMobile,
            }
          )}>
          <img src={BandGray} alt="BAND_GRAY" />
        </div>
      </CardStyled>
    </section>
  );
}

const CardStyled = styled.div`
  position: relative;
  border-radius: 20px;
  background: linear-gradient(100deg, #ff5f6d 1.23%, #ffc371 98.52%);
  overflow: hidden;

  /* shadow-md */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.05);

  .prize-fund,
  .ballots {
    width: 100%;
    max-width: 500px;
  }
`;
