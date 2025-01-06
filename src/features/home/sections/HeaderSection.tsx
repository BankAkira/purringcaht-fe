// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// flowbite-react
import { Avatar } from 'flowbite-react';

// firebase
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

// helper functions
import useBoolean from '../../../helper/hook/useBoolean.ts';
import useResponsive from '../../../helper/hook/useResponsive.ts';
// import { Logger } from '../../../helper/logger.ts';

// redux
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout.ts';
import { useDispatch, useSelector } from '../../../redux';

// constant
import { defaultImages } from '../../../constant/default-images.ts';

// icons
import NotificationBingWhite from '../../../asset/images/home/icons/notification-bing-white.svg';
import SettingWhite from '../../../asset/images/home/icons/setting-white.svg';
import UserAddWhite from '../../../asset/images/home/icons/user-add-white.svg';

const topBarMenu = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: NotificationBingWhite,
    link: '/notification',
  },
  {
    id: 'add',
    label: 'Add',
    icon: UserAddWhite,
    link: '/chat/contacts/add',
  },
  {
    id: 'setting',
    label: 'Setting',
    icon: SettingWhite,
    link: '/setting',
  },
];

export default function HeaderSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();
  const { firestore } = useSelector(state => state.firebase);
  const { isFetchFirebase } = useSelector(state => state.conversation);
  const { user } = useSelector(state => state.account);

  const [unreadNoti, setUnreadNoti] = useState<number>(0);
  const [isInit, initStart, initDone] = useBoolean(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    snapshotUnreadNotifications();
  }, []);

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const maxScrollHeight = 160;
  const opacity = Math.min(scrollY / maxScrollHeight, 1);

  return (
    <section>
      <div className="flex flex-col">
        <HeaderStyle>
          <div
            className={classNames(
              'fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 transition-all duration-300',
              { 'left-16': !isTabletOrMobile }
            )}
            style={{
              backgroundColor: `rgba(255, 255, 255, ${opacity})`,
              boxShadow: opacity > 0 ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              backdropFilter: opacity > 0 ? 'blur(5px)' : 'none',
            }}>
            <div
              className="flex justify-between items-center gap-3"
              style={{ opacity: opacity }}
              onClick={() => {
                if (scrollY > maxScrollHeight) {
                  dispatch(toggleMobileControlSidebarAction());
                  navigate(`/profile`);
                }
              }}>
              <Avatar
                size="sm"
                img={user?.picture || defaultImages.noProfile}
                rounded
              />
              <p className="text-[#111928] text-base font-bold">
                {user?.displayName || 'anonymous'}
              </p>
            </div>
            <div className="flex justify-between items-center">
              {topBarMenu.map(menu => (
                <div key={menu.id} className="relative p-2">
                  <button
                    className="flex items-center transition hover:scale-75"
                    onClick={() => {
                      dispatch(toggleMobileControlSidebarAction());
                      navigate(`${menu.link}`);
                    }}>
                    <img
                      src={menu.icon}
                      alt={menu.label}
                      className="w-6 h-6"
                      style={{ filter: `brightness(${1 - opacity})` }}
                    />
                  </button>
                  {menu.id === 'notifications' && (
                    <div
                      className={
                        isInit
                          ? 'cursor-not-allowed opacity-70'
                          : 'cursor-pointer'
                      }>
                      <Badge
                        totalCount={unreadNoti > 99 ? '99+' : unreadNoti}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="pt-16 pb-6 px-6">
            <div
              className="flex items-center justify-center"
              onClick={() => {
                dispatch(toggleMobileControlSidebarAction());
                navigate(`/profile`);
              }}>
              <div className="flex flex-col flex-1 drop-shadow-md">
                <p className="text-[#111928] text-xl font-bold">
                  {user?.displayName || 'anonymous'}
                </p>
                {user?.userSetting?.isShowDisplayId ? (
                  <p className="text-white text-sm font-normal">
                    @{user?.displayId || 'anonymous'}
                  </p>
                ) : (
                  <p className="text-white text-sm font-normal">@#####</p>
                )}
              </div>
              <CustomAvatarStyle>
                <Avatar
                  img={user?.picture || defaultImages.noProfile}
                  rounded
                />
              </CustomAvatarStyle>
            </div>
          </div>
        </HeaderStyle>
      </div>
    </section>
  );
}

const HeaderStyle = styled.div`
  background: linear-gradient(
    274deg,
    rgba(254, 167, 192, 0.6) 8%,
    rgba(255, 192, 138, 0.6) 100.08%
  );
`;

const CustomAvatarStyle = styled.div`
  img {
    width: 64px;
    height: 64px;
    border: 2px solid #fff;
    object-fit: cover;
  }
`;

export const Badge = ({ totalCount }: { totalCount: number | string }) => {
  if (!totalCount) return null;

  return (
    <div className="absolute top-0 right-[3px] rounded-full text-white ring-1 ring-white w-4 h-4 badge-background font-bold text-xs flex justify-center items-center">
      {Number(totalCount) <= 99 ? totalCount : '99+'}
    </div>
  );
};
