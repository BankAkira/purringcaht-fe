import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation, useNavigate } from 'react-router-dom';

// icons
import { FaAngleLeft } from 'react-icons/fa6';

import classNames from 'classnames';

// redux
import { fetchFollowerMe, fetchFollowingMe } from '../../../redux/follow.ts';
import { useDispatch, useSelector } from '../../../redux';

// helper
import useResponsive from '../../../helper/hook/useResponsive.ts';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';
import { Logger } from '../../../helper/logger.ts';

// constant
import { defaultImages } from '../../../constant/default-images.ts';

// component
import Avatar from '../../../component/avatar/Avatar';
import Button from '../../../component/button/Button.tsx';
import NoData from '../components/NoData.tsx';
import ProfileSkeleton from '../components/profile-skeleton/ProfileSkeleton.tsx';

// api
import {
  followUser,
  getFollowerMe,
  getFollowingMe,
  unFollowUser,
} from '../../../rest-api/follow.ts';

// type
import { FollowerUser } from '../../../type/follow.ts';

const log = new Logger('Follow Page');

const tabs = [
  {
    id: 'following',
    title: 'Following',
  },
  {
    id: 'follower',
    title: 'Follower',
  },
];

export default function ProfileFollowSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { myFollowingUsers, myFollowerUsers } = useSelector(
    state => state.follow
  );
  const { isTabletOrMobile } = useResponsive();

  const [activeTab, setActiveTab] = useState('following');
  const [followings, setFollowings] = useState<FollowerUser[] | []>([]);
  const [followers, setFollowers] = useState<FollowerUser[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButtons, setIsLoadingButtons] = useState<string[]>([]);

  const goToProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const loadMoreFollowing = async () => {
    try {
      const response = await getFollowingMe({ limit: followings.length + 10 });
      const newFollowing = response.results.filter(
        user => !followings.some(follow => follow.id === user.id)
      );
      setTimeout(() => {
        setFollowings([...followings, ...newFollowing]);
      }, 1000);
    } catch (error) {
      log.error('Error loading more following', error);
    }
  };

  const loadMoreFollower = async () => {
    try {
      const response = await getFollowerMe({ limit: followers.length + 10 });
      const newFollowers = response.results.filter(
        user => !followers.some(follow => follow.id === user.id)
      );
      setTimeout(() => {
        setFollowers([...followers, ...newFollowers]);
      }, 1000);
    } catch (error) {
      log.error('Error loading more followers', error);
    }
  };

  const fetchFollowing = async () => {
    setIsLoading(true);
    dispatch(fetchFollowingMe());
    setTimeout(() => {
      if (myFollowingUsers?.results) setFollowings(myFollowingUsers.results);
      setIsLoading(false);
    }, 1000);
  };

  const fetchFollower = async () => {
    setIsLoading(true);
    dispatch(fetchFollowerMe());
    setTimeout(() => {
      if (myFollowerUsers?.results) setFollowers(myFollowerUsers.results);
      setIsLoading(false);
    }, 1000);
  };

  useDeepEffect(() => {
    fetchFollowing();
  }, [myFollowingUsers]);

  useDeepEffect(() => {
    fetchFollower();
  }, [myFollowerUsers]);

  const doFollow = async (userId: string) => {
    if (!userId) return;
    try {
      await followUser({ followingUserId: userId });
    } catch (error) {
      log.error('error doFollow', error);
    }
  };

  const unFollow = async (followId: string) => {
    if (!followId) return;
    try {
      await unFollowUser(followId);
    } catch (error) {
      log.error('error unFollow', error);
    }
  };

  const toggleFollow = async (
    followId: string,
    userId: string,
    isFollowedBack: boolean | undefined
  ) => {
    try {
      setIsLoadingButtons(prev => [...prev, followId]);

      if (!isFollowedBack) {
        await unFollow(followId);
        setFollowings(prevFollowings =>
          prevFollowings.map(follow =>
            follow.id === followId
              ? { ...follow, isFollowedBack: true }
              : follow
          )
        );
      } else {
        await doFollow(userId);
        setFollowings(prevFollowings =>
          prevFollowings.map(follow =>
            follow.id === followId
              ? { ...follow, isFollowedBack: false }
              : follow
          )
        );
      }

      setTimeout(() => {
        setIsLoadingButtons(prev => prev.filter(id => id !== followId));
      }, 1000);
    } catch (error) {
      log.error('Error toggling follow status', error);
    }
  };

  useEffect(() => {
    if (pathname.includes('/profile/following')) {
      setActiveTab('following');
      fetchFollowing();
    } else if (pathname.includes('/profile/follower')) {
      setActiveTab('follower');
      fetchFollower();
    }
  }, [pathname]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px]">
        <div className="flex items-center gap-3 max-w-[48%] sm:max-w-[75%]">
          <div
            className="flex items-center gap-4"
            onClick={() => {
              navigate(`/profile`);
            }}>
            <FaAngleLeft className="text-[#111928] text-[20px] cursor-pointer" />
            <div className="text-[20px] font-black text-gray-900 ">Follow</div>
          </div>
        </div>
      </div>

      <section
        className={`${
          isTabletOrMobile ? 'w-full min-h-full' : 'w-full'
        } bg-white`}
        id="content-container">
        <div className={`grid-cols-2 grid pb-3 mb-3 max-lg:mt-0`}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => navigate(`/profile/${tab.id}`)}
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

        {activeTab === 'following' && (
          <div
            className={`${
              isTabletOrMobile
                ? 'overflow-hidden h-[calc(92.5vh-132px)]'
                : 'overflow-hidden h-[calc(92.5vh-75px)]'
            } `}
            style={{ scrollbarColor: 'auto' }}>
            <div className="overflow-auto h-full" id="scrollableDiv">
              <InfiniteScroll
                className="!overflow-hidden"
                dataLength={followings.length}
                next={loadMoreFollowing}
                hasMore={
                  !!followings.length &&
                  (myFollowingUsers?.totalResults ?? 0) > followings.length
                }
                loader={<SkeletonLoader />}
                endMessage={<></>}
                scrollableTarget="scrollableDiv">
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="flex flex-col self-stretch gap-4 max-w-[500px] mx-auto px-2 mb-5">
                    {followings.map((follow, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-[10px] self-stretch">
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              goToProfile(follow?.followingUser?.id)
                            }>
                            <Avatar
                              size="md"
                              img={
                                follow?.followingUser?.picture ||
                                defaultImages.noProfile
                              }
                            />
                          </div>
                          <div
                            className="flex flex-col items-start gap-[1px] cursor-pointer"
                            style={{ flex: '1 0 0' }}>
                            <p
                              className="text-gray-900 text-base font-semibold"
                              onClick={() =>
                                goToProfile(follow?.followingUser.id)
                              }>
                              {follow?.followingUser?.displayName ||
                                'anonymous'}
                            </p>
                            <span className="self-stretch text-gray-500 text-xs font-normal">
                              @{follow?.followingUser?.displayId || '########'}
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              toggleFollow(
                                follow.id,
                                follow.followingUserId,
                                follow.isFollowedBack
                              )
                            }
                            variant={
                              follow.isFollowedBack ? 'danger' : 'secondary'
                            }
                            label={
                              isLoadingButtons.includes(follow.id) ? (
                                <div className="flex items-center">
                                  <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 text-white animate-spin"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="#E5E7EB"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <p className="text-[12px] font-medium">
                                  {follow.isFollowedBack
                                    ? 'Follow'
                                    : 'Following'}
                                </p>
                              )
                            }
                            disabled={isLoadingButtons.includes(follow.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoading && !followings.length && <NoData text="Follower" />}
              </InfiniteScroll>
            </div>
          </div>
        )}

        {activeTab === 'follower' && (
          <div
            className={`${
              isTabletOrMobile
                ? 'overflow-hidden h-[calc(92.5vh-132px)]'
                : 'overflow-hidden h-[calc(92.5vh-75px)]'
            } `}
            style={{ scrollbarColor: 'auto' }}>
            <div className="overflow-auto h-full" id="scrollableDiv">
              <InfiniteScroll
                className="!overflow-hidden"
                dataLength={followers.length}
                next={loadMoreFollower}
                hasMore={
                  !!followers.length &&
                  (myFollowerUsers?.totalResults ?? 0) > followers.length
                }
                loader={<SkeletonLoader />}
                endMessage={<></>}
                scrollableTarget="scrollableDiv">
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="flex flex-col self-stretch gap-4 max-w-[500px] mx-auto mb-1">
                    {followers.map((follow, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-[10px] self-stretch">
                          <div
                            className="cursor-pointer"
                            onClick={() => goToProfile(follow?.user?.id)}>
                            <Avatar
                              size="md"
                              img={
                                follow?.user?.picture || defaultImages.noProfile
                              }
                            />
                          </div>
                          <div
                            className="flex flex-col items-start gap-[1px] cursor-pointer"
                            style={{ flex: '1 0 0' }}>
                            <p
                              className="text-gray-900 text-base font-semibold"
                              onClick={() => goToProfile(follow?.user.id)}>
                              {follow?.user?.displayName || 'anonymous'}
                            </p>
                            <span className="self-stretch text-gray-500 text-xs font-normal">
                              @{follow?.user?.displayId || '########'}
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              toggleFollow(
                                follow.id,
                                follow.followingUserId,
                                follow.isFollowedBack
                              )
                            }
                            variant={
                              follow.isFollowedBack ? 'secondary' : 'danger'
                            }
                            label={
                              isLoadingButtons.includes(follow.id) ? (
                                <div className="flex items-center">
                                  <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-4 h-4 text-white animate-spin"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="#E5E7EB"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <p className=" text-[12px] font-medium">
                                  {follow.isFollowedBack
                                    ? 'Following'
                                    : 'Follow'}
                                </p>
                              )
                            }
                            disabled={isLoadingButtons.includes(follow.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoading && !followers.length && <NoData text="Follower" />}
              </InfiniteScroll>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col max-w-[500px] mx-auto px-2 gap-4 self-stretch">
      <ProfileSkeleton count={2} loading type="follow" />
      <ProfileSkeleton count={2} loading type="follow" />
      <ProfileSkeleton count={2} loading type="follow" />
      <ProfileSkeleton count={2} loading type="follow" />
      <ProfileSkeleton count={2} loading type="follow" />
    </div>
  );
}
