// import (Internal imports)
import { useEffect } from 'react';

// helper functions
import useResponsive from '../../helper/hook/useResponsive.ts';
// import { Logger } from '../../helper/logger';

// redux
import { useDispatch } from '../../redux';
import { setIsOpenMobileControlSidebar } from '../../redux/convesation-layout.ts';

// sections
import HeaderSection from '../../features/home/sections/HeaderSection.tsx';
import UserOverviewSection from '../../features/home/sections/UserOverviewSection.tsx';

// const log = new Logger('Home');

export default function Home() {
  const dispatch = useDispatch();

  const { isTabletOrMobile } = useResponsive();

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;
    if (mainDiv) {
      mainDiv.style.height = 'auto';
    }
    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  return (
    <div className="relative flex flex-col w-full bg-white">
      <HeaderSection />
      <UserOverviewSection />
    </div>
  );
}
