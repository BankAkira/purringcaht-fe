// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { omit } from 'lodash';

// react-icons
import { FaAngleLeft, FaBug } from 'react-icons/fa6';

// react-router-dom
import { useNavigate, useParams } from 'react-router-dom';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// react-loading-skeleton
import Skeleton from 'react-loading-skeleton';

// flowbite-react
import { Button } from 'flowbite-react';

// helper functions
import useResponsive from '../../helper/hook/useResponsive.ts';
import useBoolean from '../../helper/hook/useBoolean.ts';
import { Logger } from '../../helper/logger.ts';
import { queryParamsToString } from '../../helper/query-param.ts';

// redux
import { ReduxRootState, useDispatch, useSelector } from '../../redux';
import {
  setIsOpenMobileControlSidebar,
  toggleMobileControlSidebarAction,
} from '../../redux/convesation-layout.ts';
import { addComments, setComments } from '../../redux/bug-bounty.ts';

// components
import FullScreenLoader from '../../component/FullScreenLoader.tsx';

import PostComment from '../../features/bug-bounty/components/post-comment/PostComment.tsx';

// modals
import CommentBugModal from '../../features/bug-bounty/modals/CommentBugModal.tsx';

// type definitions
import { BugBountyPayload } from '../../type/bug-bounty.ts';
import { PageInfo } from '../../type/common.ts';

// APIs
import {
  getBugBountyByIdApi,
  getConfirmReportBugApi,
} from '../../rest-api/bug-bounty';

// images
import emptyMediaImage from '../../asset/images/empty-img/empty-media.svg';
import { useDeepEffect } from '../../helper/hook/useDeepEffect.ts';

const log = new Logger('BugBountyDetail');

type QueryParams = {
  reportBugId?: string;
  page?: number;
  limit?: number;
  text?: string;
  orderBy?: string;
  type?: string;
};

const defaultQueryParams: QueryParams = {
  reportBugId: '',
  page: 1,
  limit: 10,
  text: '',
  orderBy: 'updatedAt:asc',
  type: '',
};

export default function BugBountyDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const commentBugs = useSelector(
    (state: ReduxRootState) => state.bugBounty.comments
  );

  const { bugBountyId } = useParams<{ bugBountyId: string }>();
  const { isTabletOrMobile } = useResponsive();

  const [isLoading, loadingStart, loadingDone] = useBoolean(true);
  const [isLoadingData, loadingDataStart, loadingDataEnd] = useBoolean(true);
  const [queryParams, setQueryParams] =
    useState<QueryParams>(defaultQueryParams);
  const [pageInfo, setPageInfo] = useState<Omit<PageInfo, 'results'>>({
    limit: 0,
    page: 0,
    totalPages: 0,
    totalResults: 0,
  });
  const [postBugReport, setPostBugReport] = useState<
    BugBountyPayload | undefined
  >(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isOpenCommentBugModal, openCommentBugModal, closeOpenCommentBugModal] =
    useBoolean(false);
  const [initialCommentCount, setInitialCommentCount] = useState<number | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const fetchPostBug = async () => {
    try {
      const postBugReportData = await getBugBountyByIdApi(bugBountyId!);
      setPostBugReport(postBugReportData);
      loadingDataStart();
      fetchCommentBugs(defaultQueryParams); // Fetch comments after loading postBugReport
    } catch (error) {
      log.error('Error fetching post bug:', error);
      loadingDataEnd();
      setHasMore(false);
    } finally {
      loadingDone();
    }
  };

  const fetchCommentBugs = async (
    _queryParams: QueryParams,
    append: boolean = false
  ) => {
    try {
      const paramsWithBugId = { ..._queryParams, reportBugId: bugBountyId };
      const confirmReportsData = await getConfirmReportBugApi(
        queryParamsToString(paramsWithBugId)
      );

      if (confirmReportsData && confirmReportsData.results) {
        const newComments = confirmReportsData.results;
        const allComments = append
          ? [...commentBugs, ...newComments]
          : newComments; // Append only if 'append' is true
        dispatch(setComments(allComments));
        setPageInfo(omit(confirmReportsData, ['results']));
        setQueryParams(paramsWithBugId);
        setHasMore(newComments.length >= _queryParams.limit!);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      log.error('Error fetching comments:', error);
      setHasMore(false);
    } finally {
      loadingDataEnd();
    }
  };

  const checkNewComments = async () => {
    try {
      const paramsWithBugId = { ...queryParams, reportBugId: bugBountyId };
      const confirmReportsData = await getConfirmReportBugApi(
        queryParamsToString(paramsWithBugId)
      );

      // Set the number of comments when fetching data for the first time.
      if (initialCommentCount === null) {
        setInitialCommentCount(confirmReportsData?.totalResults ?? 0);
      }

      if (
        confirmReportsData &&
        confirmReportsData.totalResults > commentBugs.length
      ) {
        const updatedQueryParams = {
          ...queryParams,
          page: confirmReportsData.totalPages,
        };
        const newConfirmReportsData = await getConfirmReportBugApi(
          queryParamsToString(updatedQueryParams)
        );
        if (newConfirmReportsData && newConfirmReportsData.results) {
          const newComments = newConfirmReportsData.results.filter(
            comment =>
              !commentBugs.some(
                existingComment => existingComment.id === comment.id
              )
          );
          dispatch(addComments(newComments));

          // Update the new comment count value
          setInitialCommentCount(confirmReportsData.totalResults ?? 0);
        }
      }
    } catch (error) {
      log.error('Error checking new comments:', error);
    }
  };

  const onScrollEnd = () => {
    const newQueryParams = {
      ...queryParams,
      page: (queryParams.page || 1) + 1,
      reportBugId: bugBountyId,
    };
    fetchCommentBugs(newQueryParams, true); // Append new comments when scrolling
  };

  useEffect(() => {
    loadingStart();
    fetchPostBug();
  }, [bugBountyId]);

  useDeepEffect(() => {
    if (isTabletOrMobile) {
      dispatch(setIsOpenMobileControlSidebar(true));
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(checkNewComments, 5000); // Check for new comments every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [commentBugs.length]);

  useEffect(() => {
    const mainDiv = document.querySelector('#app-main') as HTMLElement | null;

    if (mainDiv) {
      mainDiv.style.height = isTabletOrMobile ? 'calc(100vh - 70px)' : '100vh';

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
    <div
      className={classNames('w-full min-h-full bg-white', {
        'pb-[60px]': isTabletOrMobile,
      })}>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div
            className={classNames(
              'flex items-center gap-2 bg-white z-30 sticky top-0',
              {
                'p-4 border-b': isTabletOrMobile,
                'px-10 py-5': !isTabletOrMobile,
              }
            )}>
            <div
              onClick={() => {
                dispatch(toggleMobileControlSidebarAction());
                navigate('/bug-bounty');
              }}>
              <FaAngleLeft className="text-[#6B7280] text-[20px] cursor-pointer w-[23px] h-[23px]" />
            </div>
            <p
              className={classNames('text-gray-900 font-bold', {
                'text-xl': isTabletOrMobile,
                'text-2xl': !isTabletOrMobile,
              })}>
              Detail Bug Report & Suggestions
            </p>
          </div>

          {postBugReport && <PostComment data={postBugReport} />}

          <div
            className={classNames(
              'flex justify-between items-center self-stretch border-b px-10 py-5',
              {
                'px-5': isTabletOrMobile,
              }
            )}>
            <div className="flex items-center gap-1">
              <p className="text-gray-900 text-xl font-bold max-sm:text-base">
                Found the same bug
              </p>
              <span className="text-[#9CA3AF] text-xl font-medium max-sm:text-base">
                (
                {(pageInfo?.totalResults > initialCommentCount!
                  ? pageInfo?.totalResults
                  : initialCommentCount) || 0}
                )
              </span>
            </div>
            {!isTabletOrMobile && (
              <Button
                pill
                size="sm"
                className="min-w-[150px] bg-pink-orange hover:opacity-70"
                onClick={() => openCommentBugModal()}>
                <FaBug className="mr-2 h-4 w-4" />
                Reply
              </Button>
            )}
          </div>

          {isTabletOrMobile && (
            <button
              className={classNames(
                'fixed bottom-[74px] right-4 w-14 h-14 rounded-full bg-pink-orange flex items-center justify-center shadow-lg z-10',
                {
                  'opacity-65': isScrolled,
                  'hover:opacity-70': !isScrolled,
                }
              )}
              aria-label="Report a bug"
              onClick={() => openCommentBugModal()}>
              <FaBug className="h-6 w-6 text-white" />
            </button>
          )}

          <InfiniteScroll
            dataLength={commentBugs.length}
            next={onScrollEnd}
            hasMore={hasMore}
            scrollableTarget="app-main"
            loader={<SkeletonLoader count={1} />}
            endMessage={<></>}>
            {isLoadingData ? (
              <SkeletonLoader count={3} />
            ) : (
              <>
                {commentBugs.map((comment, index) => (
                  <PostComment data={comment} key={`${comment.id}-${index}`} />
                ))}
              </>
            )}
          </InfiniteScroll>

          {!isLoadingData && !commentBugs.length && (
            <div className="flex items-center justify-center h-[250px]">
              <div className="flex flex-col items-center justify-center w-full gap-2 text-center">
                <img src={emptyMediaImage} width={60} alt="No Bug Reports" />
                <span className="text-sm font-normal text-gray-500">
                  No Comment Bugs Yet
                </span>
                <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
                  Your bug reports and suggestions will appear here once you
                  submit them.
                </span>
              </div>
            </div>
          )}

          <CommentBugModal
            onCommentBug={() => fetchCommentBugs(defaultQueryParams)} // Reset comments after new comment
            openModal={isOpenCommentBugModal}
            onCloseModal={closeOpenCommentBugModal}
            reportBugId={bugBountyId!}
          />
        </>
      )}
    </div>
  );
}

function SkeletonLoader({ count }: { count: number }) {
  const { isTabletOrMobile } = useResponsive();
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={classNames(
            'grid grid-cols-[auto_1fr] items-start gap-3 border-b bg-white',
            {
              'p-4': isTabletOrMobile,
              'px-10 py-5': !isTabletOrMobile,
            }
          )}>
          <div className="min-w-[30px] min-h-[30px] w-[40px] h-[40px]">
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
                <span className="w-[20%]">
                  <Skeleton count={1} />
                </span>
              </div>
              <div className="w-[100%]">
                <Skeleton count={4} />
              </div>
              <div
                className={classNames('rounded-[1rem]', {
                  'w-[50%]': isTabletOrMobile,
                  'w-[20%]': !isTabletOrMobile,
                })}>
                <Skeleton height={165} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
