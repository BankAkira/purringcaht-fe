// import (Internal imports)
import { useEffect } from 'react';

import classNames from 'classnames';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// react-icons
// import { Bs0Circle, Bs1Circle, Bs2Circle, Bs3Circle } from 'react-icons/bs';
import { FaAngleLeft } from 'react-icons/fa6';
// import { IoMdMore } from 'react-icons/io';

// flowbite-react
// import { Dropdown } from 'flowbite-react';

// helper functions
import useResponsive from '../../helper/hook/useResponsive.ts';
// import { Logger } from '../../helper/logger';

// redux
import {
  setIsOpenMobileControlSidebar,
  toggleMobileControlSidebarAction,
} from '../../redux/convesation-layout.ts';
import { useDispatch } from '../../redux';

// sections
import ProfileSection from '../../features/profile/sections/ProfileSection.tsx';
import ProfileSidebarSection from '../../features/profile/sections/ProfileSidebarSection.tsx';

// const log = new Logger('Profile');

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;

    if (mainDiv) {
      mainDiv.style.height = isTabletOrMobile ? 'calc(100vh - 70px)' : '100vh';
    }

    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  return (
    <div className="flex w-full min-h-full bg-white">
      <div className="flex-grow fade-in bg-white">
        <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div
            className="flex items-center gap-4"
            onClick={() => {
              dispatch(toggleMobileControlSidebarAction());
              navigate(`/chat/direct`);
            }}>
            <FaAngleLeft className="text-[#111928] text-[20px] cursor-pointer" />
            <div className="text-[20px] font-black text-gray-900 ">
              My Account
            </div>
          </div>

          {/*  <div className="flex items-center gap-2 button-dot-option">*/}
          {/*    <Dropdown*/}
          {/*      label={*/}
          {/*        <IoMdMore className="text-[24px] p-0 hover:scale-125 transition text-[#9CA3AF]" />*/}
          {/*      }*/}
          {/*      arrowIcon={false}*/}
          {/*      style={{*/}
          {/*        border: '0',*/}
          {/*        backgroundColor: 'transparent',*/}
          {/*        color: '#6B7280',*/}
          {/*        zIndex: '2',*/}
          {/*        padding: '0',*/}
          {/*      }}>*/}
          {/*      <Dropdown.Item>*/}
          {/*        <Bs0Circle className="-mt-[2px] me-2 text-[16px]" /> Select 1*/}
          {/*      </Dropdown.Item>*/}
          {/*      <Dropdown.Item>*/}
          {/*        <Bs1Circle className="-mt-[2px] me-2 text-[16px]" /> Select 2*/}
          {/*      </Dropdown.Item>*/}
          {/*      <Dropdown.Divider className="!m-0" />*/}
          {/*      <Dropdown.Item>*/}
          {/*        <Bs2Circle className="-mt-[2px] me-2 text-[16px]" /> Select 3*/}
          {/*      </Dropdown.Item>*/}
          {/*      <Dropdown.Item>*/}
          {/*        <Bs3Circle className="-mt-[2px] me-2 text-[16px]" /> Select 4*/}
          {/*      </Dropdown.Item>*/}
          {/*    </Dropdown>*/}
          {/*  </div>*/}
        </div>

        <ProfileSection />
      </div>
      {!isTabletOrMobile ? (
        <div
          className={classNames(
            'flex-grow-0 flex-shrink-0 fade-in',
            'w-[388px] bg-white min-h-full',
            'border-l border-gray-200',
            'block'
          )}>
          <ProfileSidebarSection />
        </div>
      ) : (
        <div className="max-lg:!z-[111] fade-in"></div>
      )}
    </div>
  );
}
