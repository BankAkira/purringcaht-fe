// import (Internal imports)
import { SetStateAction, useState } from 'react';

import classNames from 'classnames';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// flowbite
import { Spinner } from 'flowbite-react';

// helper functions
// import useResponsive from '../../../helper/hook/useResponsive.ts';

// components
import Post from '../../../component/post/Post.tsx';

// images
import emptyMediaImage from '../../../asset/images/empty-img/empty-media.svg';

const tabs = [
  {
    id: 'purr',
    title: 'Purr',
  },
  {
    id: 'repurr',
    title: 'Repurr',
  },
  {
    id: 'bookmark',
    title: 'Bookmark',
  },
];

// Simulate a list of posts
const allPosts = Array.from({ length: 10 }, (_, index) => <Post key={index} />);

interface TabListSectionProps {
  isOwnProfile?: boolean;
}

export default function ProfileTabPostSection({
  isOwnProfile,
}: TabListSectionProps) {
  // const { isTabletOrMobile } = useResponsive();

  const [activeTab, setActiveTab] = useState('purr');
  const [posts, setPosts] = useState(allPosts.slice(0, 5));
  const [hasMore, setHasMore] = useState(true);

  const onTabChange = (tabId: SetStateAction<string>) => {
    setActiveTab(tabId);
    if (tabId === 'purr') {
      setPosts(allPosts.slice(0, 5));
      setHasMore(true);
    } else {
      setPosts([]);
      setHasMore(false);
    }
  };

  const loadMorePosts = () => {
    setTimeout(() => {
      setPosts(prevPosts => {
        const nextPosts = allPosts.slice(
          prevPosts.length,
          prevPosts.length + 5
        );
        const hasMorePosts =
          prevPosts.length + nextPosts.length < allPosts.length;
        setHasMore(hasMorePosts);
        return prevPosts.concat(nextPosts);
      });
    }, 1500);
  };

  return (
    <section>
      <div
        className={`${isOwnProfile ? 'grid-cols-3' : 'grid-cols-2'} grid sticky top-[62px] z-10 bg-[#FFFFFFC2] backdrop-blur-md max-lg:mt-0`}>
        {tabs
          .filter(
            tab =>
              (tab.id === 'purr' ||
                tab.id === 'repurr' ||
                tab.id === 'bookmark') &&
              (isOwnProfile || tab.id !== 'bookmark')
          )
          .map(tab => (
            <div
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={classNames(
                'flex justify-center items-center gap-2 border-b py-3 cursor-pointer text-base text-[#9CA3AF] border-[#D1D5DB] max-md:flex-col max-md:gap-0 ',
                {
                  '!border-[#FE7601] !text-[#FE7601]': activeTab === tab.id,
                }
              )}>
              <span className="max-md:text-[11px]">{tab.title}</span>
            </div>
          ))}
      </div>

      {activeTab === 'purr' && (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            <div className="my-3 flex justify-center">
              <Spinner className="w-12 h-12" />
            </div>
          }
          endMessage={
            <p className="text-center py-2">Yay! You have seen it all</p>
          }
          scrollableTarget="app-main">
          {posts}
        </InfiniteScroll>
      )}

      {activeTab !== 'purr' && (
        <div className="flex items-center justify-center h-[250px]">
          <div className="media-thumbnail-container small">
            <div className="flex flex-col items-center justify-center w-full gap-2 text-center overflow-indicator">
              <img src={emptyMediaImage} width={60} alt="empty media" />
              <span className="text-sm font-normal text-gray-500">
                No data.
              </span>
              <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
                There's nothing in{' '}
                {tabs.find(tab => tab.id === activeTab)?.title} yet.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
