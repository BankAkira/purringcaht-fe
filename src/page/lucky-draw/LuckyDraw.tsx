// import (Internal imports)
import { useEffect } from 'react';

import classNames from 'classnames';

// react-icons
import { FaAngleLeft } from 'react-icons/fa6';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// helper functions
import useResponsive from '../../helper/hook/useResponsive';
// import { Logger } from '../../helper/logger';

// redux
import {
  setIsOpenMobileControlSidebar,
  toggleMobileControlSidebarAction,
} from '../../redux/convesation-layout';
import { useDispatch } from '../../redux';

// sections
import HeaderSection from '../../features/lucky-draw/sections/HeaderSection';
import BalanceBallotsSection from '../../features/lucky-draw/sections/BalanceBallotsSection';
import LatestDrawWinnersSection from '../../features/lucky-draw/sections/LatestDrawWinnersSection';
import BallotsUsageHistorySection from '../../features/lucky-draw/sections/BallotsUsageHistorySection';

// const log = new Logger('LuckyDraw');

export default function LuckyDraw() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;

    if (mainDiv) {
      mainDiv.style.height = 'auto';
    }

    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  return (
    <div className="w-full min-h-full bg-white">
      <div className="flex items-center gap-2 bg-white fixed w-full p-4 z-50">
        <div
          onClick={() => {
            dispatch(toggleMobileControlSidebarAction());
            navigate('/home');
          }}>
          <FaAngleLeft className="text-[#6B7280] text-[20px] cursor-pointer w-[23px] h-[23px]" />
        </div>
        <p className="text-gray-900 text-2xl font-bold">Lucky Draw</p>
      </div>
      <div
        className={classNames(
          'flex flex-col justify-between gap-5 bg-white pt-20',
          {
            'px-4 pb-28': isTabletOrMobile,
            'px-8 pb-10': !isTabletOrMobile,
          }
        )}>
        <HeaderSection />
        <BalanceBallotsSection />
        <LatestDrawWinnersSection />
        <BallotsUsageHistorySection />
      </div>
    </div>
  );
}
