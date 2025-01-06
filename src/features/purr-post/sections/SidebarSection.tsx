// react-router-dom
// import { useNavigate } from 'react-router-dom';

// flowbite-react
import { Button } from 'flowbite-react';

// helper functions
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';

// constant
import { defaultImages } from '../../../constant/default-images.ts';

// components
import Avatar from '../../../component/avatar/Avatar.tsx';
import CountdownTimer from '../components/CountdownTimer.tsx';

// redux
import { useSelector, useDispatch } from '../../../redux';
import { getSuggestUser } from '../../../redux/follow.ts';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';

// images
import CatAvatar1 from '../../../asset/images/cat-avatar/cat-avatar-1.png';
import CatAvatar2 from '../../../asset/images/cat-avatar/cat-avatar-2.png';
import CatAvatar3 from '../../../asset/images/cat-avatar/cat-avatar-3.png';
import CatAvatar4 from '../../../asset/images/cat-avatar/cat-avatar-4.png';

import LuckyDraw from '../../../asset/images/lucky-draw/lucky-draw.png';
import Confetti from '../../../asset/images/lucky-draw/confetti.gif';
import { getPrizePoolNow } from '../../../redux/lucky-draw.ts';

import { isToday } from '../../../helper/format-date.ts';
import { showAlert } from '../../../redux/home.ts';

const mockData = [
  {
    displayName: 'Bonnie',
    picture: CatAvatar1,
  },
  {
    displayName: 'Jesse',
    picture: CatAvatar2,
  },
  {
    displayName: 'Thomas',
    picture: CatAvatar3,
  },
  {
    displayName: 'Jame',
    picture: CatAvatar4,
  },
];

export default function SidebarSection() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { prizePoolNow } = useSelector(state => state.luckyDraw);
  const { suggestUsers } = useSelector(state => state.follow);

  useDeepEffect(() => {
    dispatch(getSuggestUser());

    if (!prizePoolNow) dispatch(getPrizePoolNow());
  }, [suggestUsers, prizePoolNow]);

  return (
    <section className="flex flex-col items-center gap-6 sticky top-5">
      <div className="flex flex-col items-start gap-6 p-5 self-stretch rounded-2xl border-[1px] border-gray-200 bg-white">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <p className="self-stretch text-gray-900 text-ms font-bold">
            Top Ranking
          </p>
          <span className="self-stretch text-[#9CA3AF] text-base font-normal">
            reliability ranking
          </span>
          <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-xs font-medium text-transparent sm:text-ms">
            (This feature will be available soon.)
          </span>
        </div>
        <div className="flex flex-col h-5 p-0 justify-between items-start self-stretch">
          <div className="flex p-0 justify-between items-start self-stretch">
            <p className="text-[#9CA3AF] text-[13px] font-semibold">USER</p>
            <p className="text-[#9CA3AF] text-[13px] font-semibold">
              CONTRIBUTION
            </p>
          </div>
        </div>
        {mockData.map((person, index) => (
          <div
            key={index}
            className="flex flex-col items-start gap-4 self-stretch">
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="">
                <Avatar
                  size="xs"
                  img={person.picture || defaultImages.noProfile}
                />
              </div>
              <div
                className="flex p-0 flex-col items-start gap-[1px]"
                style={{ flex: '1 0 0' }}>
                <p className="text-gray-900 text-base font-semibold">
                  {person.displayName || 'anonymous'}
                </p>
              </div>
              <p className="text-gray-900 text-xs font-medium">$100</p>
            </div>
          </div>
        ))}
        <p className="text-[#4B99F1] text-sm font-medium hover:!text-blue-700 cursor-pointer">
          Show more
        </p>
      </div>

      <div className="w-full bg-pink-orange rounded-[1rem] p-6">
        <CountdownTimer
          title={
            isToday(prizePoolNow?.drawDate)
              ? 'Awards are being announced'
              : 'Next Drawn In'
          }
          endTime={prizePoolNow?.drawDate}
        />
      </div>

      <div className="relative rounded-[1rem] overflow-hidden">
        <img src={LuckyDraw} alt="LUCKY_DRAW" className="w-full h-auto" />
        <img
          src={Confetti}
          alt="LUCKY_DRAW"
          className="w-full h-auto absolute inset-0 z-10"
        />
        <Button
          pill
          size="sm"
          className="absolute min-w-[150px] bg-pink-orange hover:opacity-70 z-20"
          onClick={() => {
            dispatch(toggleMobileControlSidebarAction());
            // navigate('/lucky-draw');
            dispatch(
              showAlert({
                message: `We would like to inform you that the lucky draw event on the Purring Chat platform will be suspended this month. Instead, we will be conducting the lucky draw on DeBank. Thank you for your understanding and continued support.`,
                name: `Notice: Lucky Draw Suspension on Purring Chat Platform This Month`,
              })
            );
          }}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
          Lucky Draw
        </Button>
      </div>
    </section>
  );
}
