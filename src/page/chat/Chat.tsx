import classNames from 'classnames';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  setActiveTab,
  setIsOpenAddSection,
  setIsOpenMobileControlSidebar,
} from '../../redux/convesation-layout';
import { useDispatch, useSelector } from '../../redux';
import { ConversationMenuTab, PathnameKeyword } from '../../type/conversation';
import ControlSection from '../../section/chat/control-section';
import AddSection from '../../section/chat/feed-section/add-section';
import LandingSection from '../../section/chat/feed-section/landing-section';
import ContentSection from '../../section/chat/feed-section/content-section';
import useResponsive from '../../helper/hook/useResponsive';

export default function Chat() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isOpenAddSection, isOpenMobileControlSidebar } = useSelector(
    state => state.conversationLayout
  );
  const params = useParams();

  const { isTabletOrMobile } = useResponsive();

  const isSelectedChatOrContact =
    !!params.directId ||
    !!params.groupId ||
    !!params.contactId ||
    !!params.requestId;

  useEffect(() => {
    if (isSelectedChatOrContact) {
      dispatch(setIsOpenMobileControlSidebar(false));
    }
  }, []);

  useEffect(() => {
    const splitedPath = pathname.split('/');
    const tab = splitedPath[2] as ConversationMenuTab;
    const isAddKeyword =
      tab === ConversationMenuTab.CONTACTS &&
      splitedPath?.[3] === PathnameKeyword.ADD;

    dispatch(setActiveTab(tab));
    dispatch(setIsOpenAddSection(isAddKeyword));
  }, [pathname]);

  if (isTabletOrMobile) {
    return (
      // <div className={classNames('flex flex-col overflow-hidden h-screen ')}>
      <div className={classNames('flex flex-col ')}>
        <div
          className={
            (isOpenMobileControlSidebar
              ? 'left-0 z-[1]'
              : '-left-[100vw] pointer-events-none opacity-0') +
            ' absolute transition-all duration-500 shadow min-w-[333px] max-w-[333px] max-lg:min-w-full max-lg:max-w-full bg-white max-lg:!overflow-hidden h-full max-lg:!pb-[60px]'
          }>
          <div className="text-2xl max-lg:text-xl text-[#000] font-semibold px-3 pt-4">
            Messages
          </div>
          <ControlSection />
        </div>
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
      <div className="min-w-[333px] max-w-[333px] max-lg:min-w-full max-lg:max-w-full bg-white min-h-full">
        <ControlSection />
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
