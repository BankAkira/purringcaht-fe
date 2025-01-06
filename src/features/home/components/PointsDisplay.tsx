// import (Internal imports)
// import classNames from 'classnames';

// react-icons
import { FaAngleRight } from 'react-icons/fa6';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// flowbite-react
import { Button } from 'flowbite-react';

// helper functions
// import useResponsive from '../../../helper/hook/useResponsive.ts';
// import { Logger } from '../../../helper/logger.ts';

// redux
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';
import { useDispatch, useSelector } from '../../../redux';

// icons
import PurrPointsToken from '../../../asset/icon/icons/PurrPointsToken.svg';

// const log = new Logger('PointsDisplay');

export default function PointsDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { isTabletOrMobile } = useResponsive();

  const { points } = useSelector(state => state.userPoint);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[#6B7280] text-sm font-normal">
        Your Purr points balance
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={PurrPointsToken} width={48} height={48} alt="PURR_POINTS" />
          <div className="text-[#111928] text-2xl font-bold">
            {points.toFixed(3)}
          </div>
        </div>
        <Button
          size="sm"
          gradientDuoTone="pinkToOrange"
          className="text-white text-base font-medium hover:opacity-65"
          onClick={() => {
            dispatch(toggleMobileControlSidebarAction());
            navigate('/setting/points');
          }}>
          View more
          <FaAngleRight className="ml-2 min-h-4 min-w-4" />
        </Button>
      </div>
    </div>
  );
}
