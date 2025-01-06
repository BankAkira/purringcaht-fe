// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

// react-router-dom
import { To, useLocation, useNavigate } from 'react-router-dom';

// react-icons
import { GrAppsRounded } from 'react-icons/gr';

// flowbite-react
import { Sidebar, Tooltip } from 'flowbite-react';

// helper functions
import isSmallScreen from '../../helper/is-small-screen';
import useResponsive from '../../helper/hook/useResponsive';
import useBoolean from '../../helper/hook/useBoolean';

// redux
import { useDispatch, useSelector } from '../../redux';
import { setIsFetchFirebase } from '../../redux/conversation';
import { setIsOpenMobileControlSidebar } from '../../redux/convesation-layout';

// constants
import {
  sidebarLowerMenu,
  sidebarUpperMenu,
} from '../../constant/sidebar-menu';

// icons
import Logo from '../../asset/icon/Logo';

import IconHome from '../../asset/images/side-bar/icons/home.svg';
import IconHomeWhite from '../../asset/images/side-bar/icons/home-white.svg';
import IconMessages from '../../asset/images/side-bar/icons/messages.svg';
import IconMessagesWhite from '../../asset/images/side-bar/icons/messages-white.svg';
import IconDocumentText from '../../asset/images/side-bar/icons/document-text.svg';
import IconDocumentWhite from '../../asset/images/side-bar/icons/document-text-white.svg';

// firebase
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

// modals
import QuickActionsModal from './modals/QuickActionsModal';

import Profile from './Profile';
import {
  fetchUnreadConversations,
  setUnreadMails,
} from '../../redux/purr-mail.ts';

export default function AppSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();
  const { isOpenSidebar } = useSelector(state => state.layout);
  const { isOpenMobileControlSidebar } = useSelector(
    state => state.conversationLayout
  );
  const { isFetchFirebase } = useSelector(state => state.conversation);
  const { firestore } = useSelector(state => state.firebase);
  const { totalCount } = useSelector(state => state.badge);
  const { user } = useSelector(state => state.account);

  const [unreadNoti, setUnreadNoti] = useState<number>(0);
  const [isInit, initStart, initDone] = useBoolean(true);
  const [isRotated, setIsRotated] = useState(false);

  const [isQuickActionsModal, openQuickActionsModal, closeQuickActionsModal] =
    useBoolean(false);

  const { unreadMailCount } = useSelector(state => state.purrMail);

  // Set interval to fetch unread conversations every 30 seconds
  useEffect(() => {
    const fetchUnreadMails = async () => {
      const result = await dispatch(
        fetchUnreadConversations({ isOwner: false, isRead: false })
      );
      if (fetchUnreadConversations.fulfilled.match(result)) {
        const totalUnread = result.payload.totalResults;
        dispatch(setUnreadMails(totalUnread));
      }
    };

    fetchUnreadMails();

    const intervalId = setInterval(() => {
      fetchUnreadMails();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    switch (true) {
      case isFetchFirebase:
        initStart();
        break;
      default:
        setTimeout(() => {
          initDone();
        }, 800);
        break;
    }
  }, [isFetchFirebase]);

  const snapshotUnreadNotifications = async () => {
    if (!firestore) {
      return;
    }

    const notificationCollection = collection(firestore, 'notifications');
    const getNotifQuery = query(
      notificationCollection,
      where('receiverUserId', '==', user?.id),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(getNotifQuery, response => {
      const _notis = response.docs.map(doc => {
        return { ...doc.data(), refDocId: doc.id };
      });
      setUnreadNoti(_notis.length);
    });
  };

  useEffect(() => {
    snapshotUnreadNotifications();
  }, []);

  const Badge = (totalCount: number | string) => {
    if (!totalCount) return <></>;

    return (
      <div
        className={classNames(
          'absolute top-1 right-1 rounded-full text-white w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold',
          'ring-1 ring-white z-10',
          'bg-gradient-to-br from-[#FD4077] to-[#FE7601]',
          'overflow-hidden',
          { 'top-1 right-3': isTabletOrMobile }
        )}>
        {Number(totalCount) <= 99 ? totalCount : '99+'}
      </div>
    );
  };

  const handleQuickActionsClick = () => {
    setIsRotated(!isRotated);
    openQuickActionsModal();
  };

  const handleMouseEnter = () => {
    if (!isRotated) {
      setIsRotated(true);
    }
  };

  const handleMouseLeave = () => {
    if (isRotated && !isQuickActionsModal) {
      setIsRotated(false);
    }
  };

  const getIconBasedOnRoute = (
    defaultIcon: string,
    activeIcon: string,
    link: string
  ) => {
    return location.pathname.includes(link) ? activeIcon : defaultIcon;
  };

  const handleNavigate = (path: To) => {
    if (!location.pathname.startsWith(path as string)) {
      navigate(path);
    }
  };

  return (
    <div
      className={
        classNames('sidebar-main !block z-[102] border-t', {
          hidden: !isOpenSidebar,
          'opacity-0 -z-[300] pointer-events-none':
            isTabletOrMobile && !isOpenMobileControlSidebar,
        }) + ' transition'
      }>
      <CustomSideBarStyle>
        {isTabletOrMobile ? (
          <nav className="sidebar-nav-mobile" aria-label="Sidebar">
            <div className="px-[10px] py-[6px]">
              <ul>
                <li className={location.pathname === '/home' ? 'active' : ''}>
                  <a
                    className="flex items-center justify-center rounded-lg p-2 cursor-pointer"
                    onClick={() => navigate('/home')}>
                    <span className="px-3 flex-1 whitespace-nowrap">
                      <img
                        src={getIconBasedOnRoute(
                          IconHome,
                          IconHomeWhite,
                          '/home'
                        )}
                        alt="ICON"
                        className="transition hover:scale-110 focus:scale-75"
                      />
                    </span>
                  </a>
                </li>
                <li
                  className={
                    location.pathname.includes('/chat') ? 'active' : ''
                  }>
                  <a
                    className="flex items-center justify-center rounded-lg p-2 cursor-pointer"
                    onClick={() => navigate('/chat/direct')}>
                    <span className="px-3 flex-1 whitespace-nowrap">
                      <img
                        src={getIconBasedOnRoute(
                          IconMessages,
                          IconMessagesWhite,
                          '/chat/direct'
                        )}
                        alt="ICON"
                        className="transition hover:scale-110 focus:scale-75"
                      />
                      {Badge(totalCount)}
                    </span>
                  </a>
                </li>
                <li>
                  <a className="flex items-center justify-center rounded-lg p-2 cursor-pointer">
                    <span className="px-3 flex-1 whitespace-nowrap">
                      <div
                        className="w-14 h-14 rounded-full"
                        style={{
                          boxShadow:
                            'rgb(240 82 82 / 60%) 0px 15px 30px, rgb(0 0 0 / 52%) 0px 4px 8px',
                          background:
                            'radial-gradient(circle at 56% 14%, #FE6793, #FF9039)',
                        }}>
                        <button
                          type="button"
                          className="w-full h-full flex items-center justify-center rounded-full transition-transform"
                          style={{
                            transform: isRotated
                              ? 'rotate(315deg)'
                              : 'rotate(0deg)',
                            transition: 'transform 0.5s ease-in-out',
                          }}
                          onClick={handleQuickActionsClick}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}>
                          <GrAppsRounded className="transition hover:scale-75" />
                        </button>
                      </div>
                    </span>
                  </a>
                </li>
                <li
                  className={
                    location.pathname.includes('/purr-post') ? 'active' : ''
                  }>
                  <a
                    className="flex items-center justify-center rounded-lg p-2 cursor-pointer"
                    onClick={() => navigate('/purr-post')}>
                    <span className="px-3 flex-1 whitespace-nowrap">
                      <img
                        src={getIconBasedOnRoute(
                          IconDocumentText,
                          IconDocumentWhite,
                          '/purr-post'
                        )}
                        alt="ICON"
                        className="transition hover:scale-110 focus:scale-75"
                      />
                    </span>
                  </a>
                </li>
                <li
                  className={
                    location.pathname.includes('/profile') ? 'active' : ''
                  }>
                  <div className="flex items-center justify-center rounded-lg p-2 cursor-pointer">
                    <div className="profile px-3 flex-1 whitespace-nowrap">
                      <Profile />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        ) : (
          <Sidebar
            className="sidebar-nav"
            collapsed={!isOpenSidebar && !isSmallScreen()}>
            <div className="flex flex-col justify-between h-full py-2">
              <Sidebar.Items>
                <Sidebar.ItemGroup key="upperMenuGroup" id="upperMenuGroup">
                  {/* Home link */}
                  <div
                    className={classNames(
                      isFetchFirebase || location.pathname === '/home'
                        ? 'pointer-events-none'
                        : '',
                      isInit ? ' cursor-not-allowed' : ' cursor-pointer',
                      'hidden pb-3 lg:block'
                    )}
                    onClick={() => handleNavigate('/home')}>
                    <Logo />
                  </div>

                  {/* Upper Menu */}
                  {sidebarUpperMenu.map((menu, i) => {
                    const isActive = location.pathname.includes(menu.link);
                    return (
                      <div key={menu.id || i}>
                        <CustomTooltipStyle>
                          <Tooltip
                            content={menu.label}
                            placement="right"
                            data-testid="flowbite-tooltip-menu">
                            <div className="relative">
                              <Sidebar.Item
                                onClick={() => {
                                  if (!isInit) {
                                    if (menu.id === 'chat') {
                                      if (
                                        !isInit &&
                                        !location.pathname.includes('chat')
                                      ) {
                                        dispatch(setIsFetchFirebase(true));
                                        navigate(menu.link);
                                        dispatch(
                                          setIsOpenMobileControlSidebar(true)
                                        );
                                      }
                                    } else {
                                      // Check if path is already active to prevent re-navigation
                                      handleNavigate(menu.link);
                                      dispatch(
                                        setIsOpenMobileControlSidebar(true)
                                      );
                                    }
                                  }
                                }}
                                icon={menu.icon}
                                className={classNames(
                                  'rounded-full hover:bg-orange-50 transition',
                                  {
                                    'icon-gradient-outline': isActive,
                                    'cursor-pointer': !isInit,
                                    'cursor-not-allowed opacity-70': isInit,
                                  }
                                )}
                              />
                              {menu.id === 'chat' && Badge(totalCount)}
                              {menu.id === 'purr-mail' &&
                                Badge(unreadMailCount)}
                            </div>
                          </Tooltip>
                        </CustomTooltipStyle>
                      </div>
                    );
                  })}
                </Sidebar.ItemGroup>
              </Sidebar.Items>

              {/* Lower Menu */}
              <Sidebar.Items>
                <Sidebar.ItemGroup key="lowerMenuGroup" id="lowerMenuGroup">
                  {sidebarLowerMenu.map((menu, i) => {
                    const isActive = location.pathname.includes(menu.link);
                    if (isTabletOrMobile && menu.id === 'keep') {
                      return null; // Don't render 'keep' on mobile/tablet
                    }
                    return (
                      <div key={menu.id || i}>
                        <CustomTooltipStyle>
                          <Tooltip
                            content={menu.label}
                            placement="right"
                            data-testid="flowbite-tooltip-menu">
                            <div className="relative">
                              <Sidebar.Item
                                onClick={() => {
                                  if (!isInit) {
                                    handleNavigate(menu.link);
                                  }
                                }}
                                icon={menu.icon}
                                className={classNames(
                                  'cursor-pointer rounded-full hover:bg-orange-50',
                                  {
                                    'icon-gradient-outline': isActive,
                                    'cursor-pointer': !isInit,
                                    'cursor-not-allowed opacity-70': isInit,
                                  }
                                )}
                              />
                              {menu.id === 'notifications' && (
                                <div
                                  className={classNames({
                                    'cursor-pointer': !isInit,
                                    'cursor-not-allowed opacity-70': isInit,
                                  })}>
                                  {Badge(unreadNoti > 99 ? '99+' : unreadNoti)}
                                </div>
                              )}
                            </div>
                          </Tooltip>
                        </CustomTooltipStyle>
                      </div>
                    );
                  })}

                  {/* Profile Section */}
                  <div
                    className={classNames(
                      'flex items-center justify-center transition pt-2',
                      {
                        'cursor-pointer': !isInit,
                        'cursor-not-allowed opacity-70 pointer-events-none':
                          isInit,
                      }
                    )}>
                    <CustomTooltipStyle>
                      <Tooltip
                        content="My account"
                        placement="right"
                        data-testid="flowbite-tooltip-menu">
                        <Profile />
                      </Tooltip>
                    </CustomTooltipStyle>
                  </div>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </Sidebar>
        )}
      </CustomSideBarStyle>
      <QuickActionsModal
        profile={user}
        openModal={isQuickActionsModal}
        onCloseModal={() => {
          setIsRotated(false);
          closeQuickActionsModal();
        }}
      />
    </div>
  );
}

const CustomSideBarStyle = styled.div`
  .sidebar-nav-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    top: unset;

    background: linear-gradient(
      274deg,
      rgb(254 167 192 / 95%) 8%,
      rgb(255 192 138 / 95%) 100.08%
    );
    border-radius: 22px 22px 0 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    //backdrop-filter: blur(18px);
  }

  nav.sidebar-nav-mobile > div > ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-width: 50%;
  }

  nav.sidebar-nav-mobile > div > ul li a {
    margin: 0;
    background: transparent;
    border: none;
  }

  .sidebar-nav-mobile > div > ul li a svg {
    color: white;
    width: 28px;
    height: 28px;
  }

  .sidebar-nav-mobile > div > ul li a {
    position: relative;
  }

  .sidebar-nav-mobile > div > ul li a img {
    position: relative;
    z-index: 1;
  }

  .sidebar-nav-mobile > div > ul li.active a::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background-color: rgb(240 82 82 / 45%);
    border-radius: 50%;
    z-index: 0;
    filter: blur(20px);
  }

  .sidebar-nav-mobile > div > ul li.active div::after,
  .sidebar-nav-mobile > div > ul li.active a::after {
    content: '';
    position: absolute;
    bottom: -44px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 36px;
    height: 36px;
    background: #fff;
    border-radius: 12px;
  }

  .sidebar-nav-mobile > div > ul li.active div::after {
    bottom: -50px;
  }

  .sidebar-nav-mobile {
    .profile {
      img {
        transition-property: color, background-color, border-color,
          text-decoration-color, fill, stroke, opacity, box-shadow, transform,
          filter, backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }

      img:hover {
        transform: scale(1.1);
      }

      img:focus {
        transform: scale(0.75);
      }
    }
  }

  .sidebar-nav {
    #lowerMenuGroup {
      border-top-width: 1px;
      padding-top: 16px;
    }
  }
`;

const CustomTooltipStyle = styled.div`
  .space-y-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(8px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(8px * var(--tw-space-y-reverse));
  }

  [data-testid='flowbite-tooltip-menu'] {
    width: max-content;
  }
`;
