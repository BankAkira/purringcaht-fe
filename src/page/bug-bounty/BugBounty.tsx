// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';

// flowbite-react
import { Button } from 'flowbite-react';

// react-icons
import { FaBug } from 'react-icons/fa6';

// helper functions
import useResponsive from '../../helper/hook/useResponsive.ts';
import useBoolean from '../../helper/hook/useBoolean.ts';
import { useDeepEffect } from '../../helper/hook/useDeepEffect.ts';
import { Logger } from '../../helper/logger.ts';

// redux
import { setIsOpenMobileControlSidebar } from '../../redux/convesation-layout.ts';
import { useDispatch } from '../../redux';

// sections
import PostFeedBugSection from '../../features/bug-bounty/sections/PostFeedBugSection.tsx';
import PostBugModal from '../../features/bug-bounty/modals/PostBugModal.tsx';

const log = new Logger('BugBounty');

export default function BugBounty() {
  const dispatch = useDispatch();

  const { isTabletOrMobile } = useResponsive();

  const [isOpenPostBugModal, openPostBugModal, closeOpenPostBugModal] =
    useBoolean(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const handlePostBug = async () => {
    log.debug('Post Bug Report');
  };

  useDeepEffect(() => {
    if (isTabletOrMobile) {
      dispatch(setIsOpenMobileControlSidebar(true));
    }
  }, []);

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;

    if (mainDiv) {
      mainDiv.style.height = isTabletOrMobile ? 'calc(100vh - 70px)' : '100dvh';

      const handleScroll = () => {
        const currentScrollTop = mainDiv.scrollTop;
        if (currentScrollTop > lastScrollTop) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
        setLastScrollTop(currentScrollTop);
      };

      mainDiv.addEventListener('scroll', handleScroll);
      return () => {
        mainDiv.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isTabletOrMobile, lastScrollTop]);

  return (
    <div className="w-full min-h-full bg-white">
      <div
        className={classNames(
          'flex justify-between items-center gap-2 bg-white sticky top-0 z-30',
          {
            'p-4 pt-4 pb-2': isTabletOrMobile,
            'px-10 pt-5': !isTabletOrMobile,
          }
        )}>
        <div className="flex flex-col items-center">
          <p className="text-gray-900 text-2xl font-bold">
            Bug Report & Suggestions
          </p>
        </div>
        {!isTabletOrMobile && (
          <Button
            pill
            size="sm"
            className="min-w-[150px] bg-pink-orange hover:opacity-70"
            onClick={() => openPostBugModal()}>
            <FaBug className="mr-2 min-h-4 min-w-4" />
            Report Bugs
          </Button>
        )}
      </div>

      {isTabletOrMobile && (
        <button
          className={classNames(
            'fixed bottom-24 right-4 w-14 h-14 rounded-full bg-pink-orange flex items-center justify-center shadow-lg z-10',
            {
              'opacity-65': isScrolled,
              'hover:opacity-70': !isScrolled,
            }
          )}
          aria-label="Report a bug"
          onClick={() => openPostBugModal()}>
          <FaBug className="h-6 w-6 text-white" />
        </button>
      )}

      <div
        className={classNames('', {
          'p-4': isTabletOrMobile,
          'px-10 pt-5': !isTabletOrMobile,
        })}>
        <p className="text-gray-500 text-base font-normal">
          Send feedback on improvements or reporting issues on our Bug Bounty
          page, and you'll earn 0.01 points! We value your feedback and
          suggestions to enhance Purring Chat.
        </p>
      </div>

      <PostFeedBugSection />

      <PostBugModal
        onPostBug={handlePostBug}
        openModal={isOpenPostBugModal}
        onCloseModal={closeOpenPostBugModal}
      />
    </div>
  );
}
