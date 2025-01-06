// import (Internal imports)

import classNames from 'classnames';

// react-icons
import { IoInformationCircle } from 'react-icons/io5';

// flowbite-react
import { Tooltip } from 'flowbite-react';

// helper functions
import useResponsive from '../../helper/hook/useResponsive.ts';

// layout
import CreateProfile from '../../layout/landing/CreateProfile';

// components
import IconButton from '../../component/icon-button/IconButton';

export default function MyAccount() {
  const { isTabletOrMobile } = useResponsive();

  return (
    <div
      className={classNames('flex flex-col gap-5 px-4 py-6', {
        '!py-20': isTabletOrMobile,
      })}>
      <div className="text-2xl font-bold text-gray-900 flex items-center max-lg:justify-center gap-2 max-lg:text-xl select-none">
        My Account{' '}
        <Tooltip
          content="Manage your personal information and account settings here"
          placement="top">
          <IconButton
            color="#9CA3AF"
            height={18}
            icon={IoInformationCircle}
            onClick={() => {}}
            width={18}
          />
        </Tooltip>
      </div>
      <CreateProfile isSetting />
    </div>
  );
}
