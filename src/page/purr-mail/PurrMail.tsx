// import (Internal imports)

// react-icons
import { FaAngleLeft } from 'react-icons/fa6';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// helper functions
import useResponsive from '../../helper/hook/useResponsive';

// redux
import { RootState, useDispatch, useSelector } from '../../redux';
import { toggleMobileControlSidebarAction } from '../../redux/convesation-layout';

// sections
import SidebarSection from '../../features/purr-mail/sections/SidebarSection.tsx';

export default function PurrMail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  // Get the visibility state from Redux
  const isSidebarVisible = useSelector(
    (state: RootState) => state.purrMail.isVisible
  );

  const checkedItemsCount = useSelector(
    (state: RootState) => state.purrMail.checkedItemsCount
  );

  return (
    <div className="w-full min-h-full bg-white overflow-hidden">
      {!isTabletOrMobile ? (
        <>
          <div className="flex items-center gap-2 p-4 bg-white sticky top-0 z-50">
            <div
              onClick={async () => {
                await dispatch(toggleMobileControlSidebarAction());
                navigate('/home');
              }}>
              <FaAngleLeft className="text-[#6B7280] text-[20px] cursor-pointer w-[23px] h-[23px]" />
            </div>
            <p className="text-gray-900 text-2xl font-bold">PurrMail</p>
          </div>

          <div className="p-4">
            <div className="bg-pink-orange-100 rounded-2xl p-2">
              <SidebarSection />
            </div>
          </div>
        </>
      ) : (
        <div
          className={`relative ${
            checkedItemsCount > 0
              ? 'top-24 pb-52'
              : isSidebarVisible
                ? 'top-16 pb-40'
                : 'top-0 -mb-6 !p-1'
          } p-4`}>
          <div className="bg-pink-orange-100 rounded-2xl p-2">
            <SidebarSection />
          </div>
        </div>
      )}
    </div>
  );
}
