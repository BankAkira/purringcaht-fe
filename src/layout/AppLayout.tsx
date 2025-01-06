// import (Internal imports)
import { useEffect } from 'react';

import classNames from 'classnames';

// react-router-dom
import { Outlet, useLocation } from 'react-router-dom';

// helper functions
import { Logger } from '../helper/logger';
import { errorFormat } from '../helper/error-format';
import { useDeepEffect } from '../helper/hook/useDeepEffect';

// redux
import { useDispatch, useSelector } from '../redux';
import { initializeAccountSuccess } from '../redux/account';
import { setCurrentPath } from '../redux/layout';
import { setDefaultViolationPointConfig } from '../redux/violation-point';
import { doneLoadingAction, setIsFetchFirebase } from '../redux/conversation';
import { getUserPoints } from '../redux/user-point';

// types
import { UpdateUserSettingPayload } from '../type/setting';
import { User } from '../type/auth';

// components
import FullScreenLoader from '../component/FullScreenLoader';
import InstallModal from '../component/modals/InstallModal';

// landing
import ConnectWallet from './landing/ConnectWallet';
import CreateProfile from './landing/CreateProfile';

// wrapper
import ChatPortal from '../wrapper/ChatPortal';

// sidebar
import Sidebar from './sidebar/Sidebar';
import PolicyModal from './sidebar/modals/PolicyModal';

// APIs
import { updateUserSettingApi } from '../rest-api/user-setting';

import { useAccount } from 'wagmi';
import { Alert } from 'flowbite-react';
import { clearAlert } from '../redux/home';
import OfficialAccountModal from '../component/modals/AddContactOfficial';

const log = new Logger('AppLayout');

export default function AppLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isOpenSidebar, isShowLoader } = useSelector(state => state.layout);
  const { user } = useSelector(state => state.account);
  const { isConnected } = useAccount();

  const alertMessageData = useSelector(state => state.home.alertMessage);

  const updateIsOnline = async () => {
    try {
      const userSettingPayload: UpdateUserSettingPayload = {
        isOnline: true,
      };
      const resp = await updateUserSettingApi(userSettingPayload);

      if (resp?.id) {
        if (user && user.userSetting) {
          const userInfo: User = {
            ...user,
            userSetting: {
              ...user.userSetting,
              isOnline: true,
            },
          };
          dispatch(initializeAccountSuccess({ user: userInfo }));
        }
      }
    } catch (error) {
      log.error(errorFormat(error).message);
    }
  };

  useEffect(() => {
    if (user && user.userSetting) {
      updateIsOnline();
      const userInfo: User = {
        ...user,
        userSetting: {
          ...user.userSetting,
          isOnline: true,
        },
      };
      dispatch(initializeAccountSuccess({ user: userInfo }));

      dispatch(setDefaultViolationPointConfig());
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  useDeepEffect(() => {
    if (location.pathname) {
      dispatch(setCurrentPath(location.pathname));
    }
    if (!location.pathname.includes('chat')) {
      dispatch(setIsFetchFirebase(false));
    }
    if (
      location.pathname.includes('contacts') ||
      location.pathname.includes('direct-request') ||
      location.pathname.includes('group-invite')
    ) {
      setTimeout(() => {
        dispatch(doneLoadingAction());
      }, 400);
    }
  }, [location.pathname]);

  useDeepEffect(() => {
    if (user) dispatch(getUserPoints());
  }, [user]);

  useDeepEffect(() => {
    console.log('alertMessageData', alertMessageData);
    if (alertMessageData) {
      const timer = setTimeout(() => {
        dispatch(clearAlert());
      }, alertMessageData.time);
      return () => clearTimeout(timer);
    }
  }, [alertMessageData, dispatch]);

  return (
    <>
      <div className="flex items-start min-h-screen">
        {!isConnected ? (
          <>
            <ConnectWallet />
            <InstallModal />
          </>
        ) : (
          !!user && (
            <>
              {!user?.isInitProfile ? (
                <CreateProfile />
              ) : (
                <ChatPortal>
                  <Sidebar />
                  <main
                    id="app-main"
                    className={classNames(
                      'relative size-full bg-gradient-to-l from-[#FFECF1] from-2% to-[#FFF1E6] to-100% overflow-y-auto overscroll-y-none',
                      !isOpenSidebar ? 'lg:ml-16' : 'lg:ml-64'
                    )}>
                    <Outlet />
                  </main>
                </ChatPortal>
              )}
            </>
          )
        )}
      </div>
      {isShowLoader && <FullScreenLoader />}

      {!!user && !!user?.isInitProfile && (
        <>
          <PolicyModal show={!user?.isPolicy} />
          <InstallModal />
        </>
      )}

      {alertMessageData && (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
          <Alert className="bg-[#582f05] p-8 max-w-[500px]">
            <div className="flex flex-col items-center justify-center text-white">
              <p className="font-bold mb-2">{alertMessageData.name}</p>
              <span className="font-medium">{alertMessageData.message}</span>
            </div>
          </Alert>
        </div>
      )}
      <OfficialAccountModal />
    </>
  );
}
