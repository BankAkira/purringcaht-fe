import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// redux
import { getSuggestUser } from '../../../redux/follow';
import { useSelector, useDispatch } from '../../../redux';
import useResponsive from '../../../helper/hook/useResponsive';

// helper
import { Logger } from '../../../helper/logger';
import useBoolean from '../../../helper/hook/useBoolean';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';

// icon
import ChatGray from '../../../asset/icon/icons/chat-gray.png';
import CopyGray from '../../../asset/icon/icons/copy-gray.svg';
import EditUserOutlineGray from '../../../asset/icon/icons/edit-user-outline-gray.svg';
import TicketStart from '../../../asset/images/lucky-draw/icons/ticket-star.svg';
import LineGray from '../../../asset/icon/icons/line-gray.png';
import QrGray from '../../../asset/icon/icons/qr-gray.svg';
import { toast } from 'react-toastify';

// type
import { User } from '../../../type/auth';

// constant
import { defaultImages } from '../../../constant/default-images';
import { getIconByCatType } from '../../../constant/icon-cat-lavel.ts';

// component
import Avatar from '../../../component/avatar/Avatar';
import Button from '../../../component/button/Button';

// profile/section
import ProfileTabPostSection from './ProfileTabPostSection.tsx';

// modals
import QrCodeUserProfileModal from '../modals/QrCodeUserProfileModal';

// api
import { followUser, unFollowUser } from '../../../rest-api/follow';
import { getUserById } from '../../../rest-api/user';
import classNames from 'classnames';
import { showAlert } from '../../../redux/home.ts';

// import { shortenAddress } from '../../../helper/extractText.ts';
import CopyToClipboard from 'react-copy-to-clipboard';
import { errorFormat } from '../../../helper/error-format.ts';
const log = new Logger('ProfileSection');

export default function ProfileSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  const { userId: paramId } = useParams<{ userId: string }>();
  const { myFollowingUsers, myFollowerUsers } = useSelector(
    state => state.follow
  );
  const { user, web3AuthInstance } = useSelector(state => state.account);
  const { suggestUsers } = useSelector(state => state.follow);
  const { points } = useSelector(state => state.userPoint);

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [privateKey, setPrivateKey] = useState<string | null>('');
  const [isOpenQrCodeProfile, openQrCodeProfileModal, closeQrCodeProfileModal] =
    useBoolean(false);

  const getProfile = async () => {
    if (!paramId) return;
    try {
      const res = await getUserById(paramId);
      if (res) setUserProfile(res);
    } catch (error) {
      log.error('get user id error', error);
    }
  };

  const getPrivateKey = async () => {
    if (!web3AuthInstance?.provider) {
      log.error('web3AuthInstance provider is null');
      return;
    }
    try {
      const privateKey = await web3AuthInstance.provider.request({
        method: 'eth_private_key',
      });
      if (typeof privateKey === 'string') setPrivateKey(privateKey);
      toast.success('copy your private key success');
    } catch (error) {
      log.error(' private key error', error);
      toast.error(errorFormat(error).message);
    }
  };

  const follow = async () => {
    if (!paramId) return;
    try {
      const res = await followUser({ followingUserId: paramId });
      if (res) getProfile();
    } catch (error) {
      log.error('error', error);
    }
  };
  const unFollow = async () => {
    if (!userProfile?.isFollower) return;
    try {
      const res = await unFollowUser(userProfile?.isFollower?.id);
      if (res) getProfile();
    } catch (error) {
      log.error('error', error);
    }
  };

  const handleFollow = () => {
    if (!paramId) return;
    if (userProfile?.isFollower) {
      unFollow();
    } else {
      follow();
    }
    if (checkUserFollowed(paramId)) dispatch(getSuggestUser());
  };

  const checkUserFollowed = (userId: string): boolean => {
    return suggestUsers.some(s => s.id === userId);
  };

  const goToFollowing = () => {
    if (isOwnProfile) navigate('/profile/following');
  };

  const goToFollower = () => {
    if (isOwnProfile) navigate('/profile/follower');
  };

  useDeepEffect(() => {
    if (paramId === user?.id || !paramId) {
      setIsOwnProfile(true);
      setUserProfile(user);
    } else {
      getProfile();
      setIsOwnProfile(false);
    }
  }, [paramId, user, suggestUsers, myFollowingUsers, myFollowerUsers]);

  const catLevelOption = () => {
    const catLevel = 9;
    if (catLevel < 10) {
      return getIconByCatType('cat-green');
    } else if (catLevel <= 50) {
      return getIconByCatType('cat-blue');
    } else if (catLevel <= 100) {
      return getIconByCatType('cat-yellow');
    } else if (catLevel <= 500) {
      return getIconByCatType('cat-back');
    } else {
      return getIconByCatType('cat-red');
    }
  };

  const iconSrc = catLevelOption();

  return (
    <section>
      <div className="flex items-start flex-col gap-8 px-5 pt-8">
        <div className="flex justify-between gap-2 w-full">
          <div className="grid grid-cols-1 auto-rows-[max-content] xl:grid-cols-[auto,1fr] gap-2 sm:gap-4">
            <div className="flex justify-center items-center">
              <Avatar
                size="xl"
                img={userProfile?.picture || defaultImages.noProfile}
              />
            </div>
            <div className="flex flex-col justify-between items-start gap-2 sm:gap-0">
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-2">
                  <p className="text-gray-900 text-[24px] font-bold text-center">
                    {userProfile?.displayName || 'anonymous'}
                  </p>
                  <img
                    className="w-[21px] h-[21px]"
                    src={iconSrc}
                    alt="ICON_CAT"
                  />
                </div>
                {isOwnProfile && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* {shortenAddress(userProfile?.walletAddress, 9, 4) ||
                    'No Address'} */}
                    <span className="text-[12px]">
                      {userProfile?.walletAddress || 'No Address'}{' '}
                    </span>
                    <CopyToClipboard
                      onCopy={() => {
                        toast.success('Copy address successfully');
                      }}
                      text={userProfile?.walletAddress || ''}>
                      <img
                        className="w-[16px] h-[16px] cursor-pointer"
                        src={CopyGray}
                        alt="ICON_COPPY"
                      />
                    </CopyToClipboard>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* {shortenAddress(userProfile?.walletAddress, 9, 4) ||
                    'No Address'} */}
                    <span className="text-[12px]">Copy Your Private Key</span>
                    <CopyToClipboard
                      onCopy={() => {
                        getPrivateKey();
                      }}
                      text={privateKey || ''}>
                      <img
                        className="w-[16px] h-[16px] cursor-pointer"
                        src={CopyGray}
                        alt="ICON_COPPY"
                      />
                    </CopyToClipboard>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {userProfile?.userSetting?.isShowDisplayId ? (
                    <div className="text-[#6B7280] text-[16px] font-normal">
                      @{userProfile?.displayId}
                    </div>
                  ) : (
                    <div className="text-[#6B7280] text-[16px] font-normal">
                      @#####
                    </div>
                  )}
                  <button
                    type="button"
                    className="flex justify-center items-center w-[28px] h-[28px] bg-[#F9FAFB] border-[1px] border-[#DBE2E5] rounded-full hover:scale-90 transition">
                    <img
                      className="w-[16px] h-[16px]"
                      src={CopyGray}
                      alt="ICON_COPPY"
                    />
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center w-[28px] h-[28px] bg-[#F9FAFB] border-[1px] border-[#DBE2E5] rounded-full hover:scale-90 transition"
                    onClick={() => openQrCodeProfileModal()}>
                    <img
                      className="w-[16px] h-[16px]"
                      src={QrGray}
                      alt="ICON_QR"
                    />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 flex-col sm:flex-row sm:gap-9 items-center max-[420px]:items-start">
                <div className="flex gap-4 flex-row sm:flex-row sm:gap-9">
                  <div
                    className="flex flex-col justify-center items-center gap-1 cursor-pointer"
                    onClick={() => goToFollowing()}>
                    <p className="text-[#263238] text-base font-bold">
                      {userProfile?.following || 0}
                    </p>
                    <span className="text-[#6B7280] text-base font-normal">
                      Following
                    </span>
                  </div>
                  <div
                    onClick={() => goToFollower()}
                    className="flex flex-col justify-center items-center gap-1 cursor-pointer">
                    <p className="text-[#263238] text-base font-bold">
                      {userProfile?.followers || 0}
                    </p>
                    <span className="text-[#6B7280] text-base font-normal">
                      Followers
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-1">
                    <p className="text-[#263238] text-base font-bold">{0}</p>
                    <span className="text-[#6B7280] text-base font-normal">
                      Purrs
                    </span>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div className="hidden sm:block">
                      <img src={LineGray} alt="LINE" />
                    </div>
                    <div className="flex gap-4 flex-row sm:flex-row sm:gap-9 max-[420px]:flex-col max-[420px]:gap-0">
                      <div className="flex flex-col justify-center items-center gap-1 sm:ml-6 max-[420px]:flex-row max-[420px]:gap-3">
                        <p className="text-[#263238] text-base font-bold">
                          {points || 0}
                        </p>
                        <span className="text-[#6B7280] text-base font-normal text-center">
                          PurrPoints
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isOwnProfile ? (
            <div
              className={classNames('flex items-start gap-3', {
                'flex-col': isTabletOrMobile,
              })}>
              <Button
                className="!flex items-center justify-center gap-1 focus:!border-gray-200 focus:!bg-gray-100 p-2"
                onClick={() => {
                  // navigate(`/lucky-draw`)
                  dispatch(
                    showAlert({
                      message: `We would like to inform you that the lucky draw event on the Purring Chat platform will be suspended this month. Instead, we will be conducting the lucky draw on DeBank. Thank you for your understanding and continued support.`,
                      name: `Notice: Lucky Draw Suspension on Purring Chat Platform This Month`,
                    })
                  );
                }}
                iconLeftSide={
                  <img
                    className="w-[16px] h-[16px]"
                    src={TicketStart}
                    alt="Ticket"
                  />
                }
                label={
                  <p
                    className="text-gray-800 text-sm font-medium"
                    style={{ width: 'max-content' }}>
                    {!isTabletOrMobile && 'Available '}
                    {`(${(points / 0.01).toLocaleString() || 0})`}
                  </p>
                }
              />
              <Button
                className="!flex items-center justify-center gap-2 focus:!border-gray-200 focus:!bg-gray-100"
                onClick={() => navigate(`/setting/my-account`)}
                iconLeftSide={
                  <img
                    className="w-[16px] h-[16px]"
                    src={EditUserOutlineGray}
                    alt="EDIT_USER"
                  />
                }
                label={
                  <p className="text-gray-800 text-sm font-medium">Edit</p>
                }
              />
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <button
                onClick={() =>
                  navigate(
                    `/chat/contacts/add?displayName=${userProfile?.displayName}`
                  )
                }
                type="button"
                className="flex justify-center items-center p-3 border-[1px] border-[#DBE2E5] rounded-full hover:bg-orange-500">
                <img className="w-[16px] h-[16px]" src={ChatGray} alt="CHAT" />
              </button>
              <Button
                onClick={() => handleFollow()}
                variant={userProfile?.isFollower ? 'secondary' : 'danger'}
                className="!flex items-center gap-2 !rounded-full !border-[1px] border-gray-200 "
                label={
                  <p className="text-[#FFFFFF] text-sm font-medium">
                    {userProfile?.isFollower ? 'Following' : 'Follow'}
                  </p>
                }
              />
            </div>
          )}
        </div>
      </div>
      <ProfileTabPostSection isOwnProfile={isOwnProfile} />
      <QrCodeUserProfileModal
        profile={userProfile}
        openModal={isOpenQrCodeProfile}
        onCloseModal={closeQrCodeProfileModal}
      />
    </section>
  );
}
