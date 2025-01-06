// import (Internal imports)
import { useState } from 'react';

// react-icons
import { FaUserPlus } from 'react-icons/fa6';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// flowbite-react
import { Dropdown } from 'flowbite-react';

// helper functions
// import { Logger } from '../../helper/logger';

// redux
import { useSelector } from '../../redux';

// constants
import { defaultImages } from '../../constant/default-images';

// components
import Avatar from '../../component/avatar/Avatar';

import DisconnectWalletModal from './modals/DisconnectWalletModal.tsx';

// const log = new Logger('Profile');

export default function Profile() {
  const navigate = useNavigate();

  const { user } = useSelector(state => state.account);
  const { points } = useSelector(state => state.userPoint);

  const [openDisconnectModal, setOpenDisconnectModal] = useState(false);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Dropdown
        arrowIcon={false}
        inline
        className="wrapper-dropdown-profile w-[220px] relative z-50"
        label={
          <div className="flex items-center justify-center w-full cursor-pointer">
            <Avatar
              img={user?.picture || defaultImages.noProfile}
              size="sm"
              status={
                user?.userSetting?.isInvisible
                  ? 'offline'
                  : user?.userSetting?.isOnline
                    ? 'online'
                    : 'offline'
              }
            />
          </div>
        }>
        <Dropdown.Header className="pt-3" onClick={() => navigate('profile')}>
          {user.displayId && (
            <span className="flex flex-wrap items-center gap-1 mt-1 text-sm font-semibold">
              <span title="Name" className="max-w-[200px] truncate">
                {user.displayName}
              </span>{' '}
              <span title="ID">({user.displayId})</span>
            </span>
          )}
          <div className="mt-1 text-xs font-semibold text-green-500">
            My purrPoints: {points}
          </div>
        </Dropdown.Header>

        <Dropdown.Item
          className="flex items-center gap-2 pt-2 max-lg:py-2"
          onClick={() => navigate('/setting')}>
          User Settings
        </Dropdown.Item>

        <Dropdown.Item
          className="flex items-center justify-between gap-2 pt-2 max-lg:py-2"
          onClick={() => navigate('setting/referral')}>
          <p>Invite Friends</p>
          <p>
            <FaUserPlus />
          </p>
        </Dropdown.Item>

        <Dropdown.Item
          className="flex items-center gap-2 pt-2 max-lg:py-2 lg:hidden"
          onClick={() => navigate('/keep')}>
          PurrCloud
        </Dropdown.Item>

        <Dropdown.Item
          className="flex items-center gap-2 pb-3 text-red-600 max-lg:py-3"
          onClick={() => setOpenDisconnectModal(true)}>
          Disconnect Wallet
        </Dropdown.Item>
      </Dropdown>
      <DisconnectWalletModal
        openModal={openDisconnectModal}
        setOpenModal={setOpenDisconnectModal}
      />
    </>
  );
}
