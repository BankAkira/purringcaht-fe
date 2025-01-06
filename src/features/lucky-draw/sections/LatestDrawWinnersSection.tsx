// import { useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';
// import { useWinners } from '../../../helper/hook/useWinner.tsx';
// import CardWinner from '../components/CardWinner';
import useResponsive from '../../../helper/hook/useResponsive';

export default function LatestDrawWinnersSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isTabletOrMobile } = useResponsive();
  // const winners = useWinners();

  // const displayedWinners = isTabletOrMobile
  //   ? winners.slice(0, 3)
  //   : winners.slice(0, 6);

  return (
    <section>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <p className="text-[#111928] text-2xl font-bold">
            Latest draw winners
          </p>
          <Button
            pill
            outline
            size="md"
            gradientDuoTone="pinkToOrange"
            className="bg-pink-orange group"
            onClick={() => {
              dispatch(toggleMobileControlSidebarAction());
              navigate('/lucky-draw/latest-draw-winners');
            }}>
            <p
              className={classNames(
                'inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent cursor-pointer group-hover:text-white',
                { 'px-5 ': !isTabletOrMobile }
              )}>
              View more
            </p>
          </Button>
        </div>
        <div className="flex justify-between gap-5">
          {/* {displayedWinners.map(winner => (
            <CardWinner
              key={winner.id}
              userDisplayId={winner.id}
              image={winner.image}
              name={winner.name}
              price={winner.prizeAmount}
              level={winner.level}
              frameColor={winner.frameColor}
            />
          ))} */}
        </div>
      </div>
    </section>
  );
}
