import classNames from 'classnames';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  // setActiveTab,
  setIsOpenMobileControlSidebar,
  toggleMobileControlSidebarAction,
} from '../../redux/convesation-layout';
import { useDispatch, useSelector } from '../../redux';

import AddSection from '../../section/chat/feed-section/add-section';
import LandingSection from '../../section/chat/feed-section/landing-section';
import ContentSection from '../../features/dispute/sections';
import useResponsive from '../../helper/hook/useResponsive';

import Drawer from 'react-modern-drawer';
import DisputeConversationSection from '../../features/dispute/sections/control-section/DisputeConvesationSection.tsx';
import { ConversationDispute } from '../../type/conversation-dispute.ts';

export default function Dispute() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isOpenAddSection, isOpenMobileControlSidebar } = useSelector(
    state => state.conversationLayout
  );
  const params = useParams();

  const { isTabletOrMobile } = useResponsive();

  const isSelectedChatOrContact = !!params.conversationId;

  useEffect(() => {
    if (isSelectedChatOrContact) {
      dispatch(setIsOpenMobileControlSidebar(false));
    }
  }, []);

  useEffect(() => {
    const splitedPath = pathname.split('/');
    const tab = splitedPath[1] as ConversationDispute;
    console.debug('tab', tab);
    // dispatch(setActiveTab(tab));
  }, [pathname]);

  const toggleDrawer = () => {
    dispatch(toggleMobileControlSidebarAction());
  };

  if (isTabletOrMobile) {
    return (
      <div className={classNames('flex flex-col')}>
        <Drawer
          size={'100%'}
          open={isOpenMobileControlSidebar}
          onClose={toggleDrawer}
          direction="left">
          {isOpenMobileControlSidebar && (
            <div className="min-w-[333px] max-w-[333px] max-lg:min-w-full max-lg:max-w-full bg-white max-lg:!overflow-hidden h-full max-lg:!pb-[60px]">
              <div className="text-2xl max-lg:text-xl text-[#000] font-semibold px-3 pt-4">
                Dispute{' '}
                <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
                  (This feature will be available soon.)
                </span>
              </div>
              <DisputeConversationSection />
            </div>
          )}
        </Drawer>
        <div className="flex-grow">
          {isOpenAddSection ? (
            <AddSection />
          ) : (
            <>
              {isSelectedChatOrContact ? (
                <ContentSection />
              ) : (
                <LandingSection />
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames('flex justify-between overflow-hidden h-screen')}>
      <div className="min-w-[333px] max-w-[333px] max-lg:min-w-full max-lg:max-w-full bg-white min-h-full border-r">
        <div className="text-2xl max-lg:text-xl text-[#000] font-semibold px-3 pt-4">
          Dispute{' '}
          <span className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent">
            (This feature will be available soon.)
          </span>
        </div>
        <DisputeConversationSection />
      </div>

      <div className="flex-grow">
        {isOpenAddSection ? (
          <AddSection />
        ) : (
          <>
            {isSelectedChatOrContact ? <ContentSection /> : <LandingSection />}
          </>
        )}
      </div>
    </div>
  );
}
