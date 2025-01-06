// import (Internal imports)
import { SetStateAction, useState } from 'react';
import classNames from 'classnames';

// react-icons
import { IoIosArrowDown } from 'react-icons/io';
import { IoFilter } from 'react-icons/io5';

// flowbite-react
import { Dropdown } from 'flowbite-react';

// type definitions
import { TabPosts } from '../../../type/purr-post.ts';

// helper functions
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';
import useResponsive from '../../../helper/hook/useResponsive.ts';

// sections
import PostFeedSection from './PostFeedSection.tsx';

export default function MenuTabSection() {
  const { isTabletOrMobile } = useResponsive();

  const [activeTab, setActiveTab] = useState('FOR_YOU');

  const onTabChange = (tabId: SetStateAction<string>) => {
    setActiveTab(tabId);
  };

  useDeepEffect(() => {
    // console.log('tab', activeTab);
  }, [activeTab]);

  return (
    <section
      className={`${
        isTabletOrMobile ? 'w-full min-h-full' : 'w-full'
      } bg-white`}>
      <div className="grid grid-cols-[1fr_1fr_auto] justify-items-center bg-[#ffffff80] backdrop-blur-[10px] border-b px-5 z-20 sticky top-16">
        {TabPosts.filter(
          tab => tab.display === 'FOR_YOU' || tab.display === 'FOLLOWING'
        ).map(tab => (
          <div
            key={tab.display}
            onClick={() => onTabChange(tab.display)}
            className={classNames(
              'flex justify-center items-center gap-2 text-[#6B7280] text-lg font-medium cursor-pointer py-3 max-md:flex-col max-md:gap-0 w-[80px]',
              {
                '!border-b-2 !border-[#FE7601] !text-[#FE7601]':
                  activeTab === tab.display,
              }
            )}>
            <span className="max-md:text-base">{tab.value}</span>
          </div>
        ))}

        <Dropdown
          label={
            <span className="flex items-center gap-2 text-[#6B7280] text-lg font-medium hover:text-[#FE7601] max-md:text-base !pr-0">
              {isTabletOrMobile ? (
                <IoFilter />
              ) : (
                <>
                  <p>Sorted By</p> <IoIosArrowDown />
                </>
              )}
            </span>
          }
          arrowIcon={false}
          className="border-0 !bg-white"
          style={{
            border: '0',
            backgroundColor: 'transparent',
            color: '#6b7280',
            zIndex: '2',
          }}>
          <Dropdown.Item className="hover:text-[#ff6969] hover:!bg-orange-50 !text-right">
            Hot
          </Dropdown.Item>
          <Dropdown.Item className="hover:text-[#ff6969] hover:!bg-orange-50">
            RePurr latest
          </Dropdown.Item>
          <Dropdown.Item className="hover:text-[#ff6969] hover:!bg-orange-50">
            Cat Treats highest
          </Dropdown.Item>
        </Dropdown>
      </div>

      {activeTab === 'FOR_YOU' && <PostFeedSection />}
      {activeTab === 'FOLLOWING' && <PostFeedSection />}
    </section>
  );
}
