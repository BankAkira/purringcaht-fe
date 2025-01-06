// import (Internal imports)
import { useEffect, useState } from 'react';

// flowbite-react
import { Spinner } from 'flowbite-react';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive.ts';

// components
import Post from '../../../component/post/Post.tsx';

// sections
import PostSection from './PostSection.tsx';

const allPosts = Array.from({ length: 2 }, (_, index) => <Post key={index} />);

export default function PostFeedSection() {
  const { isTabletOrMobile } = useResponsive();

  const [posts, setPosts] = useState(allPosts.slice(0, 10));
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts(allPosts.slice(0, 100));
  }, []);

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
    <section
      className={isTabletOrMobile ? '' : ''}
      style={{ scrollbarColor: 'auto' }}
      id="content-container">
      <PostSection />

      <div className="flex flex-col items-center self-stretch gap-5 px-7 py-5 border-b hover:bg-[#F9FAFB]">
        <p className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-base font-medium text-transparent cursor-pointer hover:opacity-70">
          Show 15 new updates
        </p>
      </div>

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
          <p style={{ textAlign: 'center', padding: '20px 20px' }}>
            Yay! You have seen it all
          </p>
        }
        scrollableTarget="app-main">
        {posts}
      </InfiniteScroll>
    </section>
  );
}
