// import (Internal imports)
import { useEffect, useState } from 'react';

// react-modern-drawer
import Drawer from 'react-modern-drawer';

// react-icons
import { GiHamburgerMenu } from 'react-icons/gi';

// react-router-dom
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// flowbite-react
import { Tooltip } from 'flowbite-react';

// types
import { SettingMenuEnum } from '../../type/setting';

// helper functions
import useResponsive from '../../helper/hook/useResponsive';

// redux
import { useDispatch } from '../../redux';
import { setIsOpenMobileControlSidebar } from '../../redux/convesation-layout.ts';

// layouts
import DisconnectWalletModal from '../../layout/sidebar/modals/DisconnectWalletModal';

// components
import IconButton from '../../component/icon-button/IconButton';

export default function Setting() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  const [openDisconnectModal, setOpenDisconnectModal] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const onClickNav = (href: string) => {
    setIsOpenSidebar(false);
    navigate(href);
  };

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;
    if (mainDiv) {
      mainDiv.style.height = 'auto';
    }
    dispatch(setIsOpenMobileControlSidebar(isTabletOrMobile));
  }, [isTabletOrMobile, dispatch]);

  const settingSideBar = () => (
    <div className="h-full overflow-y-auto w-full max-w-[240px] max-lg:max-w-[250px] flex flex-col gap-3 bg-white py-3 border-r border-gray-200 max-lg:pb-[58px]">
      <span className="text-sm font-normal text-gray-500 px-[12px] py-[6px]">
        USER SETTINGS
      </span>
      <a
        onClick={() => onClickNav(SettingMenuEnum.MY_ACCOUNT)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.MY_ACCOUNT}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.MY_ACCOUNT}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.MY_ACCOUNT}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          My Account
        </span>
      </a>
      <a
        onClick={() => onClickNav(SettingMenuEnum.REFERRAL)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.REFERRAL}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.REFERRAL}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.REFERRAL}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Referral
        </span>
      </a>
      <a
        onClick={() => onClickNav(SettingMenuEnum.BLOCKED_LIST)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.BLOCKED_LIST}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.BLOCKED_LIST}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.BLOCKED_LIST}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Blocked Lists
        </span>
      </a>
      <a
        onClick={() => onClickNav(SettingMenuEnum.HIDDEN_LIST)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.HIDDEN_LIST}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.HIDDEN_LIST}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.HIDDEN_LIST}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Hidden Lists
        </span>
      </a>
      <hr className="mt-2" />
      <span className="text-sm font-normal text-gray-500 px-[12px] py-[8px] pb-[8px]">
        BILLING SETTINGS
      </span>
      <a
        onClick={() => onClickNav(SettingMenuEnum.PURCHASE_CHA_POINTS)}
        className={
          (location.pathname ===
          `/setting/${SettingMenuEnum.PURCHASE_CHA_POINTS}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname ===
          `/setting/${SettingMenuEnum.PURCHASE_CHA_POINTS}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname ===
            `/setting/${SettingMenuEnum.PURCHASE_CHA_POINTS}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Purchase Points
        </span>
      </a>
      <a
        onClick={() => onClickNav(SettingMenuEnum.STORAGE)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.STORAGE}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.STORAGE}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.STORAGE}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Storage
        </span>
      </a>
      <a
        onClick={() => onClickNav(SettingMenuEnum.BILLING)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.BILLING}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.BILLING}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.BILLING}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Billing
        </span>
      </a>
      <hr className="mt-2" />
      <a
        onClick={() => onClickNav(SettingMenuEnum.POINTS)}
        className={
          (location.pathname === `/setting/${SettingMenuEnum.POINTS}`
            ? 'bg-primary-gradient hover:opacity-80'
            : 'hover:bg-gray-50') +
          ' cursor-pointer px-[12px] py-[8px] pb-[8px] transition relative'
        }>
        {location.pathname === `/setting/${SettingMenuEnum.POINTS}` && (
          <div className="border-primary-gradient w-[2px] h-full absolute left-0 top-0" />
        )}
        <span
          className={
            (location.pathname === `/setting/${SettingMenuEnum.POINTS}`
              ? 'text-primary-gradient'
              : '') + ' text-base font-medium transition'
          }>
          Points
        </span>
      </a>
    </div>
  );

  return (
    <>
      {isTabletOrMobile ? (
        <>
          <div className={'flex flex-col min-h-screen overflow-hidden'}>
            <div
              className="flex w-full items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px] max-lg:h-[60px] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:z-20"
              onClick={() => setIsOpenSidebar(prev => !prev)}>
              <div className="pointer flex items-center gap-3">
                <Tooltip content="Menu settings" placement="bottom">
                  <IconButton
                    color="#8a8a8a"
                    icon={GiHamburgerMenu}
                    width={25}
                    height={25}
                  />
                </Tooltip>
                <span className="font-bold text-base text-[#555]">
                  User Settings
                </span>
              </div>
            </div>

            <Drawer
              open={isOpenSidebar}
              className="drawer-setting-custom max-lg:!z-[200]"
              onClose={() => setIsOpenSidebar(prev => !prev)}
              direction="left">
              {isOpenSidebar && <> {settingSideBar()}</>}
            </Drawer>

            <div className="bg-white w-full min-h-full overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full h-screen">
          {settingSideBar()}{' '}
          <div className="bg-white w-full min-h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      )}

      <DisconnectWalletModal
        openModal={openDisconnectModal}
        setOpenModal={setOpenDisconnectModal}
      />
    </>
  );
}
