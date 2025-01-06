// import (Internal imports)

import styled from 'styled-components';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// helper functions
// import { Logger } from '../../../helper/logger.ts';

// redux
import { useDispatch } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';

// constants
import { defaultImages } from '../../../constant/default-images';

// images
import FrameGold from '../../../asset/images/lucky-draw/icons/frame-gold.svg';
import FrameSilver from '../../../asset/images/lucky-draw/icons/frame-silver.svg';
import FrameBlack from '../../../asset/images/lucky-draw/icons/frame-black.svg';

type CardProps = {
  userDisplayId?: string;
  onClick?: () => void;
  image?: string;
  name?: string;
  price?: number | string;
  level?: number;
  frameColor: 'gold' | 'silver' | 'black';
};

// const log = new Logger('CardWinner');

export default function CardWinner({
  userDisplayId,
  image,
  name,
  price,
  level,
  frameColor,
}: CardProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (userDisplayId) {
      dispatch(toggleMobileControlSidebarAction());
      navigate(`/profile/${userDisplayId}`);
    } else {
      console.warn('userDisplayId is not available');
    }
  };

  return (
    <CustomCardWinnerStyle
      className="inline-flex flex-col justify-center items-center w-full bg-white rounded-2xl cursor-pointer overflow-hidden pt-8 px-3 py-3 hover:bg-[#F9FAFB]"
      onClick={handleCardClick}>
      <div className="relative flex items-center justify-center w-full max-w-[100px] aspect-square">
        <div className="relative w-[50%] h-[50%] rounded-full overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={image || defaultImages.noProfile}
            alt="AVATAR"
          />
        </div>
        {frameColor === 'gold' ? (
          <img
            src={FrameGold}
            alt="FRAME_GOLD"
            className="absolute inset-0 w-full h-full"
          />
        ) : frameColor === 'silver' ? (
          <img
            src={FrameSilver}
            alt="FRAME_SILVER"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <img
            src={FrameBlack}
            alt="FRAME_BLACK"
            className="absolute inset-0 w-full h-full"
          />
        )}
        {level && level > 0 && (
          <div className="absolute top-0 right-0">
            <div className="text-[#da5e37] text-[22px] font-black leading-[20.85px]">
              {level}
              <sup className="text-[#da5e37] text-sm font-bold leading-[20.85px]">
                {level === 1 ? 'st' : level === 2 ? 'nd' : 'rd'}
              </sup>
            </div>
          </div>
        )}
      </div>
      <div className="text-center max-w-full">
        <div className="text-[#212b36] text-sm mb-2 text-ellipsis whitespace-nowrap overflow-hidden">
          {name || 'anonymous'}
        </div>
        <div className="text-[#212b36] text-base font-bold text-ellipsis whitespace-nowrap overflow-hidden">
          ${price}
        </div>
      </div>
    </CustomCardWinnerStyle>
  );
}

const CustomCardWinnerStyle = styled.div`
  box-shadow:
    0 0 2px 0 rgba(145, 158, 171, 0.2),
    0 12px 24px -4px rgba(145, 158, 171, 0.12);
`;
