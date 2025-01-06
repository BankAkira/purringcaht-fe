// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { omit } from 'lodash';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// react-loading-skeleton
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// react-icons
import { IoFilter } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';

// flowbite-react
import { Dropdown } from 'flowbite-react';

// helper functions
import useBoolean from '../../../helper/hook/useBoolean';
import useResponsive from '../../../helper/hook/useResponsive';
import { Logger } from '../../../helper/logger.ts';
import { queryParamsToString } from '../../../helper/query-param';

// sections
import PostBugSection from './PostBugSection.tsx';

// components

// type definitions
import { PageInfo } from '../../../type/common';

// redux
import { ReduxRootState, useDispatch, useSelector } from '../../../redux';
import { setPosts } from '../../../redux/bug-bounty.ts';

// APIs
import { getPostBugBountyApi } from '../../../rest-api/bug-bounty';

// images
import emptyMediaImage from '../../../asset/images/empty-img/empty-media.svg';

const log = new Logger('PostFeedBugSection');

type QueryParams = {
  page?: number;
  limit?: number;
  text?: string;
  orderBy?: string;
  type?: string;
};

const defaultQueryParams: QueryParams = {
  page: 1,
  limit: 10,
  text: '',
  orderBy: 'updatedAt:asc',
  type: '',
};

const filterMapping: { [key: string]: string } = {
  'createdAt:desc': 'Latest',
  'createdAt:asc': 'Oldest',
  'createdAt:popular': 'Most Popular',
};

export default function PostFeedBugSection() {
  const dispatch = useDispatch();
  const postBugs = useSelector(
    (state: ReduxRootState) => state.bugBounty.posts
  );
  const { isTabletOrMobile } = useResponsive();

  const [isLoading, loadingStart, loadingEnd] = useBoolean(true);
  const [queryParams, setQueryParams] =
    useState<QueryParams>(defaultQueryParams);
  const [pageInfo, setPageInfo] = useState<Omit<PageInfo, 'results'>>({
    limit: 0,
    page: 0,
    totalPages: 0,
    totalResults: 0,
  });
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [newPostsCount, setNewPostsCount] = useState<number>(0);
  const [initialTotalResults, setInitialTotalResults] = useState<number | null>(
    null
  );

  const fetchPosts = async (
    _queryParams: QueryParams,
    append: boolean = false
  ) => {
    try {
      const payload = await getPostBugBountyApi(
        queryParamsToString(_queryParams)
      );
      if (payload && payload.results) {
        const newPosts = payload.results;
        const allPosts = append ? [...postBugs, ...newPosts] : newPosts;
        dispatch(setPosts(allPosts));
        setPageInfo(omit(payload, ['results']));
        setQueryParams(_queryParams);
        setHasMore(newPosts.length >= _queryParams.limit!);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      log.error('Error fetching posts:', error);
      loadingEnd();
      setHasMore(false);
    } finally {
      loadingEnd();
    }
  };

  const onScrollEnd = () => {
    const newQueryParams = {
      ...queryParams,
      page: (queryParams.page || 1) + 1,
    };
    fetchPosts(newQueryParams, true);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    const newQueryParams = {
      ...defaultQueryParams,
      orderBy: filter,
    };
    fetchPosts(newQueryParams);
  };

  const checkNewPosts = async () => {
    if (initialTotalResults === null) return;

    const newQueryParams = {
      ...queryParams,
      page: 1,
    };
    try {
      const payload = await getPostBugBountyApi(
        queryParamsToString(newQueryParams)
      );
      if (payload && payload.totalResults > initialTotalResults) {
        const updatedQueryParams = {
          ...queryParams,
          page: payload.totalPages,
        };
        const newPayload = await getPostBugBountyApi(
          queryParamsToString(updatedQueryParams)
        );

        if (newPayload && newPayload.results) {
          const newPosts = newPayload.results.filter(
            post => !postBugs.some(existingPost => existingPost.id === post.id)
          );
          setNewPostsCount(newPosts.length);
        }
      }
    } catch (error) {
      log.error('Error checking for new posts:', error);
    }
  };

  const handleShowNewPosts = () => {
    loadingStart();
    const newQueryParams = {
      ...queryParams,
      page: 1,
    };
    fetchPosts(newQueryParams);
    setNewPostsCount(0);
    setTimeout(() => {
      loadingEnd();
    }, 500);
  };

  useEffect(() => {
    const fetchInitialPosts = async () => {
      loadingStart();
      const payload = await getPostBugBountyApi(
        queryParamsToString(defaultQueryParams)
      );

      if (payload && payload.results) {
        dispatch(setPosts(payload.results));
        setPageInfo(omit(payload, ['results']));
        setInitialTotalResults(payload.totalResults);
        setHasMore(payload.results.length >= defaultQueryParams.limit!);
      }

      loadingEnd();
    };

    fetchInitialPosts();
  }, []);

  useEffect(() => {
    if (initialTotalResults !== null) {
      const intervalId = setInterval(() => {
        checkNewPosts();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [queryParams, postBugs, initialTotalResults]);

  return (
    <section className={isTabletOrMobile ? 'pb-[60px]' : ''}>
      <div className="flex justify-center items-center self-stretch border-b sticky top-14 z-30">
        <div
          className={classNames('w-full bg-[#ffffff80] backdrop-blur-[10px]', {
            'px-4 pt-3 pb-2 text-[15px] border': isTabletOrMobile,
            'px-10 py-5 text-lg': !isTabletOrMobile,
          })}>
          <div className="flex items-center justify-between">
            <p className="text-[#6B7280] font-medium">
              Total bugs: {pageInfo.totalResults}
            </p>
            <Dropdown
              label={
                <span className="flex items-center gap-2 text-[#6B7280] text-lg font-medium hover:text-[#FE7601] max-md:text-base !pr-0">
                  {isTabletOrMobile ? (
                    <IoFilter />
                  ) : (
                    <>
                      {filterMapping[selectedFilter] || 'Sorted By'}
                      <IoIosArrowDown />
                    </>
                  )}
                </span>
              }
              arrowIcon={false}
              inline>
              <Dropdown.Item
                className="hover:text-[#ff6969] hover:!bg-orange-50 focus:text-[#FE7601]"
                onClick={() => handleFilterChange('createdAt:desc')}>
                Latest
              </Dropdown.Item>
              <Dropdown.Item
                className="hover:text-[#ff6969] hover:!bg-orange-50 focus:text-[#FE7601]"
                onClick={() => handleFilterChange('createdAt:asc')}>
                Oldest
              </Dropdown.Item>
              <Dropdown.Item
                className="hover:text-[#ff6969] hover:!bg-orange-50 focus:text-[#FE7601]"
                onClick={() => handleFilterChange('createdAt:popular')}>
                Most Popular
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>

        {newPostsCount > 0 && (
          <div className="absolute flex justify-center items-center top-14">
            <button
              className="bg-pink-orange shadow-lg z-10 text-white p-2 rounded-[1rem] hover:opacity-65"
              aria-label="Report a bug"
              onClick={handleShowNewPosts}>
              Show {newPostsCount} new updates
            </button>
          </div>
        )}
      </div>

      <InfiniteScroll
        dataLength={postBugs.length}
        next={onScrollEnd}
        hasMore={hasMore}
        scrollableTarget="app-main"
        loader={<SkeletonLoader count={1} />}
        endMessage={<></>}>
        {isLoading ? (
          <SkeletonLoader count={3} />
        ) : (
          <>
            {postBugs.map((post, index) => (
              <PostBugSection post={post} key={`${post.id}-${index}`} />
            ))}
          </>
        )}
      </InfiniteScroll>

      {!isLoading && !postBugs.length && (
        <div className="flex items-center justify-center h-[250px]">
          <div className="flex flex-col items-center justify-center w-full gap-2 text-center">
            <img src={emptyMediaImage} width={60} alt="No Bug Reports" />
            <span className="text-sm font-normal text-gray-500">
              No Bug Reports or Suggestions Yet
            </span>
            <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
              Your bug reports and suggestions will appear here once you submit
              them.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function SkeletonLoader({ count }: { count: number }) {
  const { isTabletOrMobile } = useResponsive();
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={classNames('flex flex-row items-start gap-3 border-b', {
            'p-4': isTabletOrMobile,
            'px-10 py-5': !isTabletOrMobile,
          })}>
          <div className="min-w-[25px] min-h-[25px] w-[25px] h-[25px]">
            <Skeleton
              circle
              height="100%"
              containerClassName="avatar-skeleton"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-3 w-full">
            <div className="flex flex-col items-start self-stretch gap-2">
              <div className="flex justify-between items-center self-stretch">
                <p className="w-[50%]">
                  <Skeleton count={1} height={25} />
                </p>
                <span className="text-base w-[20%]">
                  <Skeleton count={1} />
                </span>
              </div>
              <div className="w-[100%]">
                <Skeleton count={2} />
              </div>
              <div className="flex justify-end self-stretch">
                <p className="text-base w-[10%]">
                  <Skeleton />
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
