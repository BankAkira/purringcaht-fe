// import (Internal imports)
import { ComponentProps } from 'react';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// react-router-dom
import { useNavigate, useParams } from 'react-router-dom';

// react-toastify
import { toast } from 'react-toastify';

// react-icons
import { BiDislike, BiSolidHide, BiVolumeMute } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoCloseCircleOutline, IoVolumeMuteSharp } from 'react-icons/io5';
import { MdOutlineDelete } from 'react-icons/md';

// flowbite-react
import { Dropdown } from 'flowbite-react';

// helper functions
import trimAddress from '../../../helper/trim-address';
import useBoolean from '../../../helper/hook/useBoolean';
import useResponsive from '../../../helper/hook/useResponsive';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { errorFormat } from '../../../helper/error-format';
import { Logger } from '../../../helper/logger';

// redux
import { useDispatch, useSelector } from '../../../redux';
import { initializeAccountSuccess } from '../../../redux/account';
import {
  loadResultsAction,
  loadMoreResultAction,
  startLoadingAction,
  handleIsReloadUserBlock,
} from '../../../redux/contact';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout';
import { toggleIsShowLoader } from '../../../redux/layout';

// @share
import SearchPopover from '../@share/SearchPopover';

// types
import { User } from '../../../type/auth';
import { GlobalSearchType } from '../../../type/chat';
import { ContactPayload } from '../../../type/contact';
import {
  ConversationMenuTab,
  ConversationType,
  CreateConversationBody,
  PathnameKeyword,
} from '../../../type/conversation';
import { UpdateUserSettingPayload } from '../../../type/setting';

// constants
import { defaultImages } from '../../../constant/default-images';

// components
import Avatar from '../../../component/avatar/Avatar';
import ChatSkeleton from '../../../component/chat-skeleton/ChatSkeleton';
import ConfirmModal from '../../../component/@share/ConfirmModal';
import IconButton from '../../../component/icon-button/IconButton';
import ReportModal from '../../../component/@share/ReportModal';
import TabWrapper from '../../../component/TabWrapper';

// APIs
import { createConversationRequestApi } from '../../../rest-api/conversation';
import {
  deleteContactByIdApi,
  hideContactByIdApi,
} from '../../../rest-api/contact';
import {
  blockUserByIdApi,
  unblockUserByIdApi,
} from '../../../rest-api/user-block';
import { updateUserSettingApi } from '../../../rest-api/user-setting';

// images
import emptyContactImage from '../../../asset/images/empty-img/empty-user.svg';

const log = new Logger('Contact');

export default function Contact() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contactId } = useParams();
  const { isInitializing, queryParams, results, pageInfo } = useSelector(
    state => state.contact
  );

  useDeepEffect(() => {
    dispatch(startLoadingAction());
    dispatch(loadResultsAction());
  }, []);

  const onScrollEnd = async () => {
    const newQueryParams = {
      ...queryParams,
      page: +queryParams.page! + 1,
    };
    dispatch(loadMoreResultAction(newQueryParams));
  };

  const onClickAddContact = () => {
    dispatch(toggleMobileControlSidebarAction());
    navigate(`/chat/${ConversationMenuTab.CONTACTS}/${PathnameKeyword.ADD}`);
  };

  const onClickContact = (contactId: string) => {
    dispatch(toggleMobileControlSidebarAction());
    navigate(`/chat/${ConversationMenuTab.CONTACTS}/${contactId}`);
  };

  return (
    <>
      <div className="px-3 h-[50px]">
        <SearchPopover<ContactPayload>
          searchType={GlobalSearchType.CONTACT}
          content={(searchResult, handleCloseSearch) => (
            <>
              <div className="flex flex-col items-start">
                {[...searchResult].map((result, i) => (
                  <ContactTab
                    key={result.id + i}
                    active={contactId === result.id}
                    onClick={() => {
                      onClickContact(result.id);
                      handleCloseSearch();
                    }}
                    size="sm"
                    contact={result}
                  />
                ))}
              </div>
            </>
          )}
        />
      </div>

      <div className="flex items-center justify-between px-3 h-[45px]">
        <p className="text-base text-gray-500">Friends</p>
        <p
          className="flex gap-1 items-center text-[12px] text-[#ff6969] font-bold cursor-pointer hover:opacity-70 transition"
          onClick={onClickAddContact}>
          <IconButton icon={FaPlus} color="#ff6969" width={14} height={14} />
          <span>ADD</span>
        </p>
      </div>

      <div
        className="pb-3 overflow-y-auto contact-container-height max-lg:pb-[60px] max-lg:h-[calc(100vh-210px)]"
        id="content-container">
        {isInitializing ? (
          <SkeletonLoader />
        ) : (
          <>
            {!results.length && (
              <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400">
                <img src={emptyContactImage} width={62} alt="empty contact" />
                <div className="px-4 text-center">
                  <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                    No Contacts
                  </p>
                  <p className="text-sm font-normal text-[#9CA3AF] max-w-[280px]">
                    Tap the <b>+</b> icon to add contact
                  </p>
                </div>
              </div>
            )}
            <InfiniteScroll
              dataLength={+pageInfo.page * +pageInfo.limit}
              next={onScrollEnd}
              hasMore={
                !!results.length && results.length < pageInfo.totalResults
              }
              scrollableTarget="content-container"
              loader={
                <div className="my-3">
                  <SkeletonLoader />
                </div>
              }>
              <div className="flex flex-col items-start">
                {[...results].map((result, i) => {
                  if (result?.isRequested) {
                    // Skip rendering this result if isRequested is true
                    return null;
                  }
                  return (
                    <ContactTab
                      key={result.id + i}
                      active={contactId === result.id}
                      onClick={() => onClickContact(result.id)}
                      size="sm"
                      contact={result}
                    />
                  );
                })}
              </div>
            </InfiniteScroll>
          </>
        )}
      </div>
    </>
  );
}

function ContactTab(
  props: { contact: ContactPayload } & ComponentProps<typeof TabWrapper>
) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();
  const { contact, ...rest } = props;
  const { user } = useSelector(state => state.account);

  const [
    isOpenConfirmBlockModal,
    openConfirmBlockModal,
    closeConfirmBlockModal,
  ] = useBoolean(false);
  const [
    isOpenConfirmDeleteModal,
    openConfirmDeleteModal,
    closeConfirmDeleteModal,
  ] = useBoolean(false);
  const [
    isOpenConfirmHiddenModal,
    openConfirmHiddenModal,
    closeConfirmHiddenModal,
  ] = useBoolean(false);
  const [isOpenReportModal, openReportModal, closeReportModal] =
    useBoolean(false);

  const handleConversationRequest = async (hasConversation?: boolean) => {
    try {
      dispatch(toggleIsShowLoader(true));
      if (!contact) {
        throw new Error('Contact not found');
      }

      const body: CreateConversationBody = {
        userIds: [contact?.userId],
        description: contact.description,
        reason: contact.reason,
        type: ConversationType.DM,
      };

      const createdResp = await createConversationRequestApi(body);
      if (!createdResp?.conversationRequests[0].id) {
        throw new Error('Request is error');
      }

      if (hasConversation) {
        navigate(
          `/chat/${ConversationMenuTab.DIRECT}/${contact?.conversation?.id}`
        );
      } else {
        navigate(
          `/chat/${ConversationMenuTab.DIRECT_REQUEST}/${createdResp?.conversationRequests[0].id}`
        );
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      dispatch(toggleIsShowLoader(false));
    }
  };

  const handleBlockUser = async () => {
    try {
      if (contact?.user && contact?.user.id) {
        const resp = await blockUserByIdApi({ userId: contact.user.id });
        if (resp) {
          toast.success(`Blocked ${contact.user.displayName} successfully`);
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmBlockModal();
    }
  };

  const handleUnblock = async () => {
    try {
      let resp;
      if (contact?.conversation?.type === ConversationType.DM) {
        if (contact?.user?.id) {
          resp = await unblockUserByIdApi(contact?.user?.id);
        }
      }
      if (resp) {
        toast.success(`Unblock ${contact?.user?.displayName} successfully`);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmBlockModal();
    }
  };

  const handleUpdateMuteNotifications = async (isAlreadyMute?: boolean) => {
    try {
      if (contact && contact?.userId) {
        const muteId = user?.userSetting?.muteUsers
          ? [...user.userSetting.muteUsers, contact?.userId]
          : [];
        const newMuteIds = isAlreadyMute
          ? user?.userSetting?.muteUsers?.filter(
              item => item !== contact?.userId
            )
          : muteId;
        const payload: UpdateUserSettingPayload = {
          muteUsers: newMuteIds,
        };
        const resp = await updateUserSettingApi(payload);
        if (resp && user?.userSetting) {
          const newUserInfo: User = {
            ...user,
            userSetting: { ...user.userSetting, muteUsers: newMuteIds },
          };
          dispatch(initializeAccountSuccess({ user: newUserInfo }));
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
      log.error('error updateUserSettingApi', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      let resp;
      if (contact?.id) {
        resp = await deleteContactByIdApi(contact?.id);
      }
      if (resp) {
        toast.success(`Delete ${contact?.user?.displayName} successfully`);
        navigate('/chat/contacts');
        dispatch(startLoadingAction());
        dispatch(loadResultsAction());
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmDeleteModal();
    }
  };

  const handleHiddenUser = async () => {
    try {
      let resp;
      if (contact?.id && contact?.userId) {
        const payload = {
          contactId: contact?.id,
          userId: contact?.userId,
        };
        resp = await hideContactByIdApi(payload);
      }
      if (resp) {
        toast.success(`Hidden ${contact?.user?.displayName} successfully`);
        navigate('/chat/contacts');
        dispatch(startLoadingAction());
        dispatch(loadResultsAction());
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmHiddenModal();
    }
  };

  return (
    <>
      <TabWrapper {...rest}>
        <div className="flex items-center w-full gap-3">
          <div className="min-w-[40px]">
            <Avatar img={contact.user.picture || defaultImages.noProfile} />
          </div>
          <div className="font-medium dark:text-white">
            <div className="flex gap-1 items-center">
              <div className="text-[15px] font-normal text-gray-900 truncate max-w-[194px]">
                {contact?.userNickname
                  ? contact?.userNickname
                  : contact.user.displayName ||
                    trimAddress(contact.user.walletAddress)}
              </div>
              {user?.userSetting?.muteUsers?.includes(contact.userId) && (
                <IoVolumeMuteSharp className="text-gray-500 !text-[14px] ms-[1px]" />
              )}
            </div>

            <div className="text-xs text-gray-400 max-w-[194px] truncate fade-in">
              {'User ID: ' +
                (contact?.user?.displayId ||
                  trimAddress(contact?.user?.walletAddress))}
            </div>
          </div>
        </div>

        {!isTabletOrMobile && (
          <div className="button-dot-option">
            <Dropdown
              label={
                <HiOutlineDotsVertical className="text-[16px] p-0 hover:scale-125 transition " />
              }
              arrowIcon={false}
              style={{
                border: '0',
                backgroundColor: 'transparent',
                color: '#6b7280',
                zIndex: '2',
                padding: '0',
              }}>
              <Dropdown.Item
                className="text-orange-500"
                onClick={() => {
                  (async () => {
                    await handleConversationRequest(!!contact?.conversation);
                  })();
                }}>
                {contact?.conversation
                  ? 'Go to conversation'
                  : 'Start a conversation'}
              </Dropdown.Item>
              <Dropdown.Divider className="!m-0" />
              <Dropdown.Item
                onClick={() => {
                  (async () => {
                    await handleUpdateMuteNotifications(
                      !!user?.userSetting?.muteUsers?.some(
                        item => item === contact?.userId
                      )
                    );
                  })();
                }}>
                <BiVolumeMute className="-mt-[2px] me-2 text-[18px]" />{' '}
                {user?.userSetting?.muteUsers?.some(
                  item => item === contact?.userId
                )
                  ? 'Unmute notifications'
                  : 'Mute notifications'}
              </Dropdown.Item>{' '}
              <Dropdown.Item onClick={openConfirmBlockModal}>
                <IoCloseCircleOutline className="-mt-[2px] me-2 text-[16px]" />{' '}
                {contact?.isBlockedByMe
                  ? 'Unblock this user'
                  : 'Block this user'}
              </Dropdown.Item>
              <Dropdown.Item onClick={openReportModal}>
                <BiDislike className="-mt-[2px] me-2 text-[16px]" /> Report this
                user
              </Dropdown.Item>
              <Dropdown.Item onClick={openConfirmDeleteModal}>
                <MdOutlineDelete className="-mt-[2px] me-2 text-[16px]" />{' '}
                Delete this user
              </Dropdown.Item>
              <Dropdown.Item onClick={openConfirmHiddenModal}>
                <BiSolidHide className="-mt-[2px] me-2 text-[16px]" /> Hidden
                this user
              </Dropdown.Item>
            </Dropdown>
          </div>
        )}
      </TabWrapper>

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            isOpenConfirmDeleteModal
              ? await handleDeleteUser()
              : await handleHiddenUser();
          })();
        }}
        openModal={isOpenConfirmDeleteModal || isOpenConfirmHiddenModal}
        onCloseModal={() =>
          isOpenConfirmDeleteModal
            ? closeConfirmDeleteModal()
            : closeConfirmHiddenModal()
        }
        title={
          isOpenConfirmDeleteModal
            ? 'Confirm delete user'
            : 'Confirm hidden user'
        }
        color="red"
        description={`Do you want to ${
          isOpenConfirmDeleteModal ? 'delete' : 'hidden'
        } ${contact?.user?.displayName ? `'${contact?.user?.displayName}' ?` : 'this user ?'}`}
      />

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            contact?.isBlockedByMe
              ? await handleUnblock()
              : await handleBlockUser();

            dispatch(handleIsReloadUserBlock(true));
            setTimeout(() => {
              dispatch(handleIsReloadUserBlock(false));
            }, 200);
            dispatch(loadResultsAction());
          })();
        }}
        openModal={isOpenConfirmBlockModal}
        onCloseModal={closeConfirmBlockModal}
        title={contact?.isBlockedByMe ? 'Confirm unblock' : 'Confirm block'}
        color="red"
        description={`Do you want to ${
          contact?.isBlockedByMe ? 'unblock' : 'block'
        } ${contact?.user?.displayName ? `'${contact?.user?.displayName}' ?` : 'this user ?'}`}
      />

      <ReportModal
        openModal={isOpenReportModal}
        closeModal={() => {
          closeReportModal();
          dispatch(handleIsReloadUserBlock(true));
          setTimeout(() => {
            dispatch(handleIsReloadUserBlock(false));
          }, 200);
        }}
        profile={contact?.user}
        type={contact?.conversation?.type || ConversationType.DM}
      />
    </>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-1 px-3">
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
      <ChatSkeleton count={1} loading type="direct" />
    </div>
  );
}
