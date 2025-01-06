// import (Internal imports)
import { memo, useState } from 'react';

import classNames from 'classnames';
import { isArray, isEmpty } from 'lodash';
import moment from 'moment';

// react-icons
import { BiDislike } from 'react-icons/bi';
import { CiCirclePlus } from 'react-icons/ci';
import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { FaAngleLeft, FaRegCircleUser } from 'react-icons/fa6';
import { IoIosNotificationsOutline, IoMdMore } from 'react-icons/io';
import { LuAlertTriangle } from 'react-icons/lu';
import { MdBlock, MdOutlineDeleteOutline } from 'react-icons/md';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// react-modern-drawer
import Drawer from 'react-modern-drawer';

// react-router-dom
import { useNavigate, useParams } from 'react-router-dom';

// react-toastify
import { toast } from 'react-toastify';

// flowbite-react
import { Button, Dropdown, Spinner } from 'flowbite-react';

// helper functions
import { Logger } from '../../../../../helper/logger';
import { errorFormat } from '../../../../../helper/error-format';
import sleep from '../../../../../helper/sleep';
import useBoolean from '../../../../../helper/hook/useBoolean';
import useConversationProfile, {
  Profile,
} from '../../../../../helper/hook/useConversationProfile';
import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';
import useResponsive from '../../../../../helper/hook/useResponsive';

// redux
import { useDispatch, useSelector } from '../../../../../redux';
import { initializeAccountSuccess } from '../../../../../redux/account';
import {
  initializeMessageAction,
  loadMoreMessageAction,
  receiveIncomingMessageAction,
  removeMessageAction,
  resetMessageStateAction,
  unsendMessageAction,
  updateLatestReadMessageAction,
} from '../../../../../redux/message';
import {
  loadResultsAction,
  setStateIsGroupDeleted,
} from '../../../../../redux/conversation';
import {
  setIsOpenMobileControlSidebar,
  toggleMobileChatInfo,
  toggleMobileControlSidebarAction,
} from '../../../../../redux/convesation-layout';
import {
  loadFileResultsAction,
  loadMediaResultsAction,
} from '../../../../../redux/conversation-side-info';
import { openLightBox } from '../../../../../redux/lightbox.ts';
import { toggleIsShowLoader } from '../../../../../redux/layout';

// constants
import { defaultImages } from '../../../../../constant/default-images';

// components
import Avatar from '../../../../../component/avatar/Avatar';
import ChatBubble from '../../../../../component/ChatBubble';
import ChatInput from '../../../../../component/chat-input/ChatInput';
import FullSpinner from '../../../../../component/FullSpinner';
import InviteGroupModal from '../../../../../component/InviteGroupModal';
import ConfirmModal from '../../../../../component/@share/ConfirmModal';
import ReportModal from '../../../../../component/@share/ReportModal';

// sections
import SideChatInfoSection from './SideChatInfoSection';
import CreateConversationAfterDelete from './CreateConversationAfterDelete';

// types
import { User } from '../../../../../type/auth';
import {
  ConversationMenuTab,
  ConversationPayload,
  ConversationRole,
  ConversationType,
} from '../../../../../type/conversation';
import {
  IncomingMessage,
  LatestMessageRead,
  MessageContentType,
  MessagePayload,
  UnsentMessage,
} from '../../../../../type/message';
import { Notification as NotificationType } from '../../../../../type/notification';
import { UpdateUserSettingPayload } from '../../../../../type/setting';

// firebase
import { off, onChildChanged, onValue, ref } from 'firebase/database';

// APIs
import {
  deleteConversationApi,
  leaveConversationApi,
  removeGroupConversationApi,
} from '../../../../../rest-api/conversation';
import {
  deleteMessageApi,
  unsendMessageApi,
} from '../../../../../rest-api/conversation-message';
import {
  blockGroupByIdApi,
  blockUserByIdApi,
  unblockGroupByIdApi,
  unblockUserByIdApi,
} from '../../../../../rest-api/user-block';
import { updateUserSettingApi } from '../../../../../rest-api/user-setting';
import {
  handleDeleteMailVault,
  handleMistakeChat,
  handleOpenModalConfirmDeleteMailVault,
} from '../../../../../redux/chatbot-mail-vault.ts';

const MemoizedChatBubble = memo(ChatBubble);

const log = new Logger('ChatFeedSection');

export default function ChatFeedSection() {
  const params = useParams();
  const {
    conversation,
    messages,
    isInitializing,
    pageInfo,
    isLoadingMore,
    isError,
    latestReads,
    latestMessage,
  } = useSelector(state => state.message);
  const { modalConfirmDeleteMailVault, modalDeleteMailVault } = useSelector(
    state => state.chatBotMailVault
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useConversationProfile(conversation);

  const { database } = useSelector(state => state.firebase);
  const { user } = useSelector(state => state.account);

  const { isTabletOrMobile } = useResponsive();
  const { isGroupDeleted } = useSelector(state => state.conversation);
  const { isOpenMobileChatInfo, isOpenMobileControlSidebar } = useSelector(
    state => state.conversationLayout
  );

  const [
    isOpenConfirmUnBlockModal,
    openConfirmUnBlockModal,
    closeConfirmUnBlockModal,
  ] = useBoolean(false);
  const [isShowBlockedAlert, trueShowBlockedAlert, falseShowBlockedAlert] =
    useBoolean(true);
  const [isOpenInviteGroupModal, openInviteGroupModal, closeInviteGroupModal] =
    useBoolean(false);
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
  const [isOpenReportModal, openReportModal, closeReportModal] =
    useBoolean(false);
  const [
    isOpenConfirmLeaveModal,
    openConfirmLeaveModal,
    closeConfirmLeaveModal,
  ] = useBoolean(false);
  const [
    isOpenConfirmDeleteGroupModal,
    openConfirmDeleteGroupModal,
    closeConfirmDeleteGroupModal,
  ] = useBoolean(false);
  const [
    isOpenConfirmDeleteChatModal,
    openConfirmDeleteChatModal,
    closeConfirmDeleteChatModal,
  ] = useBoolean(false);
  const [
    isOpenConfirmUnSendChatModal,
    openConfirmUnSendChatModal,
    closeConfirmUnSendChatModal,
  ] = useBoolean(false);
  const [
    isOpenRedirectDisputeModal,
    openRedirectDisputeModal,
    closeRedirectDisputeModal,
  ] = useBoolean(false);
  const [isDeleteByMe, trueIsDeleteByMe, falseIsDeleteByMe] = useBoolean(false);

  const [isFailure, trueFailure, falseFailure] = useBoolean(false);

  const [selectedMessage, setSelectedMessage] = useState<
    MessagePayload | undefined
  >(undefined);

  useDeepEffect(() => {
    if (isError && params.directId) {
      if (isTabletOrMobile) {
        dispatch(setIsOpenMobileControlSidebar(true));
      }
      navigate(`/chat/${ConversationMenuTab.DIRECT}`);
    }
    if (isError && params.groupId) {
      if (isTabletOrMobile) {
        dispatch(setIsOpenMobileControlSidebar(true));
      }
      navigate(`/chat/${ConversationMenuTab.GROUP}`);
    }
  }, [isError]);

  useDeepEffect(() => {
    trueShowBlockedAlert();
    const conversationId =
      params.groupId || params.directId || params.conversationId;
    if (conversationId) {
      dispatch(initializeMessageAction(conversationId)).then(
        async respConversation => {
          if (respConversation?.isDispute) {
            navigate(`/dispute/${respConversation.id}`);
          }
          if (respConversation?.isDeleted) {
            trueFailure();
            await sleep(500);
            toast.error('This group chat has been deleted');
            falseFailure();
            if (isTabletOrMobile) {
              dispatch(setIsOpenMobileControlSidebar(true));
            }
            navigate(`/chat/${ConversationMenuTab.GROUP}`);
          }
        }
      );
    }

    return () => dispatch(resetMessageStateAction());
  }, [params.directId, params.groupId, params.conversationId]);

  useDeepEffect(() => {
    (async () => {
      if (isGroupDeleted) {
        trueFailure();
        await sleep(500);
        toast.error('This group chat has been deleted');
        falseFailure();
        if (isTabletOrMobile) {
          dispatch(setIsOpenMobileControlSidebar(true));
        }
        dispatch(setStateIsGroupDeleted(false));
        navigate(`/chat/${ConversationMenuTab.GROUP}`);
      }
    })();
  }, [isGroupDeleted]);

  useDeepEffect(() => {
    if (!isEmpty(conversation) && !isEmpty(database)) {
      const notificationRef = ref(database, `notifications`);
      if (user) {
        onChildChanged(notificationRef, snapshot => {
          if (snapshot.exists()) {
            if (snapshot.key === user.id) {
              const notification = snapshot.val() as NotificationType;
              if (notification.redirectUrl) {
                const converId = notification.redirectUrl.split('dispute/')[1];
                if (converId === conversation.id) {
                  setTimeout(() => {
                    openRedirectDisputeModal();
                  }, 2000);
                }
              }
            }
          }
        });
      }

      const latestMessageRef = ref(database, `${conversation.id}`);
      onChildChanged(latestMessageRef, snapshot => {
        if (snapshot.exists()) {
          if (snapshot.key === 'latestMessage') {
            const latestMessage = snapshot.val() as IncomingMessage;
            if (!isEmpty(latestMessage)) {
              dispatch(receiveIncomingMessageAction(latestMessage));
            }
          }
        }
      });

      const latestReadRef = ref(database, `${conversation.id}/latestRead`);
      const latestUnsentRef = ref(
        database,
        `${conversation.id}/latestMessageUnsent`
      );

      onValue(latestReadRef, snapshot => {
        if (snapshot.exists()) {
          const val = snapshot.val() as LatestMessageRead[];
          if (!isEmpty(val) && isArray(val) && val.length) {
            dispatch(updateLatestReadMessageAction(val));
          }
        }
      });
      onValue(latestUnsentRef, snapshot => {
        if (snapshot.exists()) {
          const val = snapshot.val() as UnsentMessage;
          if (!isEmpty(val) && val.senderId !== user?.id) {
            dispatch(unsendMessageAction(val.id));
          }
        }
      });
    }

    (async () => {
      await sleep(900);
      if (
        !isEmpty(latestMessage) &&
        latestMessage.conversationId === conversation?.id
      ) {
        dispatch(receiveIncomingMessageAction(latestMessage));
      }
    })();

    return () => {
      if (!isEmpty(conversation) && !isEmpty(database)) {
        const notificationRef = ref(database, `notifications`);
        const latestMessageRef = ref(database, `${conversation.id}`);
        const latestReadRef = ref(database, `${conversation.id}/latestRead`);
        const latestUnsentRef = ref(
          database,
          `${conversation.id}/latestMessageUnsent`
        );
        off(latestMessageRef);
        off(latestReadRef);
        off(latestUnsentRef);
        off(notificationRef);
      }
    };
  }, [database, conversation, latestMessage]);

  useDeepEffect(() => {
    if (conversation?.isDeleteByMe) {
      trueIsDeleteByMe();
    } else {
      falseIsDeleteByMe();
    }
  }, [conversation]);

  const onScrollEnd = () => {
    if (!isLoadingMore) {
      dispatch(loadMoreMessageAction());
    }
  };

  const handleRedirectToDispute = () => {
    if (conversation?.id) navigate(`/dispute/${conversation.id}`);
  };

  const handleUnblock = async () => {
    try {
      closeConfirmUnBlockModal();
      dispatch(toggleIsShowLoader(true));
      let resp;
      if (conversation?.type === ConversationType.DM) {
        if (profile?.userId) {
          resp = await unblockUserByIdApi(profile?.userId);
        }
      } else {
        if (conversation?.id) {
          resp = await unblockGroupByIdApi(conversation?.id);
        }
      }
      if (resp) {
        toast.success(
          `Unblock ${conversation?.type === ConversationType.DM ? profile?.name : conversation?.name} successfully`
        );
        const conversationId = params.groupId || params.directId;
        if (conversationId) {
          dispatch(
            loadResultsAction({
              type: conversation?.type,
            })
          );
          dispatch(initializeMessageAction(conversationId));
        }

        return () => dispatch(resetMessageStateAction());
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 100);
    }
  };

  const handleBlockUser = async (
    profile?: Profile | null,
    conversation?: ConversationPayload | null,
    isBlockGroup?: boolean
  ) => {
    try {
      closeConfirmBlockModal();
      dispatch(toggleIsShowLoader(true));
      if ((profile && profile?.userId) || (conversation && conversation?.id)) {
        let resp;
        if (!!conversation && isBlockGroup) {
          resp = await blockGroupByIdApi({ conversationId: conversation?.id });
        } else {
          resp = await blockUserByIdApi({ userId: profile?.userId || '' });
        }
        if (resp) {
          toast.success(
            `Blocked ${profile?.name || conversation?.name} successfully`
          );
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      setTimeout(() => {
        if (conversation && conversation?.id) {
          dispatch(
            loadResultsAction({
              type: conversation?.type,
            })
          );
          dispatch(initializeMessageAction(conversation.id));
        }
      }, 400);
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 100);
    }
  };

  const handleDeleteConversation = async () => {
    try {
      closeConfirmDeleteModal();
      dispatch(toggleIsShowLoader(true));
      let resp;
      if (conversation && conversation?.id) {
        resp = await deleteConversationApi(conversation?.id);
      }
      if (resp) {
        toast.success(
          `Delete ${profile?.name || conversation?.name}'s chat successfully`
        );
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      setTimeout(() => {
        if (conversation && conversation?.id) {
          dispatch(
            loadResultsAction({
              type: conversation?.type,
            })
          );
          dispatch(initializeMessageAction(conversation?.id));
          if (isTabletOrMobile) {
            dispatch(setIsOpenMobileControlSidebar(true));
          }
          navigate(
            `/chat/${conversation?.type === ConversationType.DM ? 'direct' : 'group'}`
          );
        }
      }, 400);
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 100);
    }
  };

  const handleLeaveConversation = async () => {
    try {
      closeConfirmLeaveModal();
      dispatch(toggleIsShowLoader(true));
      let resp;
      if (conversation && conversation?.id) {
        resp = await leaveConversationApi(conversation?.id);
      }
      if (resp) {
        toast.success(
          `Leave ${profile?.name || conversation?.name}'s chat successfully`
        );
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      setTimeout(() => {
        if (conversation && conversation?.id) {
          dispatch(
            loadResultsAction({
              type: conversation?.type,
            })
          );
          dispatch(initializeMessageAction(conversation?.id));
        }
      }, 400);
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 100);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      closeConfirmDeleteGroupModal();
      dispatch(toggleIsShowLoader(true));
      let resp;
      if (conversation && conversation?.id) {
        resp = await removeGroupConversationApi(conversation?.id);
      }
      if (resp) {
        toast.success(
          `Delete group ${profile?.name || conversation?.name} successfully`
        );
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      setTimeout(() => {
        if (conversation && conversation?.id) {
          dispatch(
            loadResultsAction({
              type: conversation?.type,
            })
          );
          dispatch(initializeMessageAction(conversation?.id));
        }
      }, 400);
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 100);
      if (isTabletOrMobile) {
        dispatch(setIsOpenMobileControlSidebar(true));
      }
      navigate(`/chat/${ConversationMenuTab.GROUP}`);
    }
  };

  const handleUnsendChat = async () => {
    try {
      closeConfirmUnSendChatModal();
      dispatch(toggleIsShowLoader(true));
      let resp;
      if (selectedMessage && selectedMessage?.id) {
        resp = await unsendMessageApi(selectedMessage?.id);
      }
      if (resp) {
        toast.success(`Unsend message successfully`);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      if (selectedMessage) {
        if (selectedMessage?.id) {
          dispatch(unsendMessageAction(selectedMessage?.id));
          dispatch(toggleIsShowLoader(false));
        }

        if (
          selectedMessage?.contentType === MessageContentType.IMAGE ||
          selectedMessage?.contentType === MessageContentType.VIDEO
        ) {
          dispatch(loadMediaResultsAction({ page: 1 }));
        }
        if (selectedMessage?.contentType === MessageContentType.FILE) {
          dispatch(loadFileResultsAction({ page: 1 }));
        }
      }
    }
  };

  const handleDeleteChat = async () => {
    try {
      closeConfirmDeleteChatModal();
      dispatch(toggleIsShowLoader(true));
      let resp;
      if (selectedMessage && selectedMessage?.id) {
        resp = await deleteMessageApi(selectedMessage?.id);
      }
      if (resp) {
        toast.success(`Delete message successfully`);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      if (selectedMessage && selectedMessage?.id) {
        dispatch(removeMessageAction(selectedMessage?.id));
        dispatch(toggleIsShowLoader(false));
      }
    }
  };

  const handleUpdateMuteNotifications = async (
    type: ConversationType,
    isAlreadyMute?: boolean
  ) => {
    try {
      if (type === ConversationType.DM) {
        if (profile && profile?.userId) {
          const muteId = user?.userSetting?.muteUsers
            ? [...user.userSetting.muteUsers, profile?.userId]
            : [];
          const newMuteIds = isAlreadyMute
            ? user?.userSetting?.muteUsers?.filter(
                item => item !== profile?.userId
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
      } else {
        if (conversation && conversation?.id) {
          const muteId = user?.userSetting?.muteConversationGroups
            ? [...user.userSetting.muteConversationGroups, conversation?.id]
            : [];
          const newMuteIds = isAlreadyMute
            ? user?.userSetting?.muteConversationGroups?.filter(
                item => item !== conversation?.id
              )
            : muteId;
          const payload: UpdateUserSettingPayload = {
            muteConversationGroups: newMuteIds,
          };
          const resp = await updateUserSettingApi(payload);
          if (resp && user?.userSetting) {
            const newUserInfo: User = {
              ...user,
              userSetting: {
                ...user.userSetting,
                muteConversationGroups: newMuteIds,
              },
            };
            dispatch(initializeAccountSuccess({ user: newUserInfo }));
          }
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
      log.error('error updateUserSettingApi', error);
    }
  };

  if (isInitializing || isFailure) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full gap-2 bg-white fade-in">
        <FullSpinner />
      </div>
    );
  }

  if (isDeleteByMe) {
    return (
      <CreateConversationAfterDelete
        conversation={conversation}
        onReload={() => {
          setTimeout(() => {
            if (conversation && conversation?.id) {
              dispatch(
                loadResultsAction({
                  type: conversation?.type,
                })
              );
              dispatch(initializeMessageAction(conversation?.id));
            }
          }, 400);
        }}
      />
    );
  }

  if (!conversation) return <></>;

  const findReaders = (message: MessagePayload) => {
    const opponentsReaders = latestReads.filter(r => r.user.id !== user?.id);
    const readersPayload = opponentsReaders.filter(
      r => r.timestamp === moment(message.createdAt).valueOf()
    );
    return readersPayload.map(r => r.user);
  };

  const img =
    conversation.type === ConversationType.GROUP
      ? conversation.profilePicture
      : profile?.pictures;

  const displayTextDate = (momentDate: string) => {
    return (
      <div className="mb-2.5 text-gray-400 text-sm text-center">
        <span>
          -{' '}
          {momentDate !== 'Invalid date'
            ? momentDate === moment().format('DD/MM/YYYY')
              ? 'Today'
              : momentDate === moment().subtract(1, 'days').format('DD/MM/YYYY')
                ? 'Yesterday'
                : momentDate
            : 'Today'}{' '}
          -
        </span>
      </div>
    );
  };

  // Open Lightbox //
  const handleOpenLightbox = (messageContent: string) => {
    const mediaUrls = messages.map(msg => msg.content);
    const mediaIndex = mediaUrls.findIndex(url => url === messageContent);

    if (mediaIndex !== -1) {
      dispatch(
        openLightBox({
          images: mediaUrls, // Send all media URLs to Lightbox
          imageIndex: mediaIndex, // Open at the clicked index
        })
      );
    }
  };
  // End Open Lightbox //

  return (
    <div className="flex min-h-full chat-page">
      <div
        className={
          (isTabletOrMobile ? '' : 'w-[calc(100vw-697px)]') +
          ' flex-grow fade-in'
        }>
        <div className="relative flex flex-col h-screen lg:h-full lg:min-h-full">
          <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px] max-lg:py-3 max-lg:h-[60px] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:z-20">
            <div className="flex items-center gap-3 max-w-[48%] sm:max-w-[75%]">
              {isTabletOrMobile && (
                <div
                  onClick={() => {
                    dispatch(toggleMobileControlSidebarAction());
                    navigate(
                      `/chat/${conversation?.type === ConversationType.DM ? 'direct' : 'group'}`
                    );
                  }}>
                  <FaAngleLeft className="text-[#F05252] text-[20px] cursor-pointer" />
                </div>
              )}
              <Avatar
                img={img ? img : defaultImages.noProfile}
                isShowTextStatus
                name={profile?.name}
                isMute={
                  conversation.type === ConversationType.DM
                    ? !!user?.userSetting?.muteUsers?.some(
                        item => item === profile?.userId
                      )
                    : !!user?.userSetting?.muteConversationGroups?.some(
                        item => item === conversation?.id
                      )
                }
                memberCount={
                  conversation.type === ConversationType.GROUP
                    ? conversation.participants.length
                    : undefined
                }
                onClick={() => {}}
                status={
                  conversation.type === ConversationType.DM
                    ? profile?.userSetting?.isInvisible
                      ? 'offline'
                      : profile?.userSetting?.isOnline
                        ? 'online'
                        : 'offline'
                    : undefined
                }
              />
            </div>
            <div className="flex items-center gap-2 button-dot-option">
              <Dropdown
                label={
                  <IoMdMore className="text-[26px] p-0 hover:scale-125 transition text-[#9CA3AF]" />
                }
                arrowIcon={false}
                style={{
                  border: '0',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  zIndex: '2',
                  padding: '0',
                }}>
                {conversation.type === ConversationType.GROUP ? (
                  <>
                    {conversation.participants.find(
                      item => item.userId === user?.id
                    )?.role == ConversationRole.ADMIN && (
                      <Dropdown.Item onClick={openInviteGroupModal}>
                        <CiCirclePlus className="-mt-[2px] me-2 text-[18px]" />{' '}
                        Invite
                      </Dropdown.Item>
                    )}
                    {/*<Dropdown.Item>*/}
                    {/*  <GrUpgrade className="-mt-[2px] me-2 text-[16px]" />{' '}*/}
                    {/*  Upgrade group*/}
                    {/*</Dropdown.Item>*/}
                  </>
                ) : (
                  <Dropdown.Item
                    onClick={() => {
                      navigate(
                        `/chat/${ConversationMenuTab.CONTACTS}/${profile?.contactId}`
                      );
                    }}>
                    <FaRegCircleUser className="-mt-[2px] me-2 text-[16px]" />{' '}
                    View profile
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={() => {
                    (async () => {
                      await handleUpdateMuteNotifications(
                        conversation.type,
                        conversation.type === ConversationType.DM
                          ? !!user?.userSetting?.muteUsers?.some(
                              item => item === profile?.userId
                            )
                          : !!user?.userSetting?.muteConversationGroups?.some(
                              item => item === conversation?.id
                            )
                      );
                    })();
                  }}>
                  <IoIosNotificationsOutline className="-mt-[2px] me-2 text-[18px]" />{' '}
                  {conversation.type === ConversationType.DM
                    ? user?.userSetting?.muteUsers?.some(
                        item => item === profile?.userId
                      )
                      ? 'Unmute notifications'
                      : 'Mute notifications'
                    : user?.userSetting?.muteConversationGroups?.some(
                          item => item === conversation?.id
                        )
                      ? 'Unmute notifications'
                      : 'Mute notifications'}
                </Dropdown.Item>
                <Dropdown.Divider className="!m-0" />
                {conversation.type === ConversationType.GROUP && (
                  <Dropdown.Item
                    className="!text-red-500"
                    onClick={() => {
                      conversation.participants.find(
                        item => item.userId === user?.id
                      )?.role !== ConversationRole.ADMIN
                        ? openConfirmLeaveModal()
                        : openConfirmDeleteGroupModal();
                    }}>
                    <MdOutlineDeleteOutline className="-mt-[2px] me-2 text-[16px]" />{' '}
                    {conversation.participants.find(
                      item => item.userId === user?.id
                    )?.role !== ConversationRole.ADMIN
                      ? 'Leave group'
                      : 'Delete group'}
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  className="!text-red-500"
                  onClick={() => {
                    if (!conversation?.isBlockedByMe) {
                      openConfirmBlockModal();
                    } else {
                      openConfirmUnBlockModal();
                    }
                  }}>
                  <MdBlock className="-mt-[2px] me-2 text-[16px]" />{' '}
                  {conversation.type === ConversationType.DM
                    ? conversation.isBlockedByMe
                      ? 'Unblock user'
                      : 'Block user'
                    : conversation.isBlockedByMe
                      ? 'Unblock group'
                      : 'Block group'}
                </Dropdown.Item>
                <Dropdown.Item
                  className="!text-red-500"
                  onClick={openReportModal}>
                  <BiDislike className="-mt-[2px] me-2 text-[16px]" />{' '}
                  {conversation.type === ConversationType.DM
                    ? 'Report user'
                    : 'Report group'}
                </Dropdown.Item>
                <Dropdown.Item
                  className="!text-red-500"
                  onClick={openConfirmDeleteModal}>
                  <MdOutlineDeleteOutline className="-mt-[2px] me-2 text-[16px]" />{' '}
                  Delete chat
                </Dropdown.Item>
              </Dropdown>
              {isTabletOrMobile && (
                <div
                  className="cursor-pointer"
                  onClick={() => dispatch(toggleMobileChatInfo())}>
                  <FaInfoCircle className="text-[24px] hover:scale-125 transition text-[#9CA3AF] " />
                </div>
              )}
            </div>
          </div>

          {(conversation.isBlockedByMe || conversation.isBlocked) &&
            isShowBlockedAlert && (
              <div className="bg-white z-[3] shadow-lg border rounded-md absolute -ms-1 top-20 left-1/2 -translate-x-1/2 w-[96%] max-lg:top-[100px]">
                <div className="relative flex flex-wrap items-center justify-between gap-2 px-4 py-5">
                  <FaTimesCircle
                    className="absolute text-red-500 -top-1.5 -right-1.5 text-lg cursor-pointer hover:text-red-400 transition"
                    onClick={falseShowBlockedAlert}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 font-semibold text-red-500">
                      <LuAlertTriangle className="!text-[18px] -mt-0.5" />
                      {conversation.isBlockedByMe
                        ? `You've blocked this ${conversation?.type === ConversationType.DM ? 'account' : 'group'}`
                        : 'You have been blocked'}
                    </span>
                    <span className="text-xs text-red-500">
                      {conversation.isBlockedByMe
                        ? `You can't chat with ${profile?.name}. To start a
                  conversation, you need to unblock this ${conversation?.type === ConversationType.DM ? 'user' : 'group'}.`
                        : `You can't chat with ${profile?.name} until you are unblocked`}
                    </span>
                  </div>
                  {conversation.isBlockedByMe && (
                    <Button
                      size="sm"
                      color="red"
                      pill
                      className="!text-red-500 ms-auto"
                      onClick={openConfirmUnBlockModal}>
                      Unblock
                    </Button>
                  )}
                </div>
              </div>
            )}

          <div
            className={classNames(
              'flex flex-col-reverse w-full h-[calc(100%-260px)] lg:h-[calc(100vh-260px)] px-4 overflow-y-auto pt-3',
              {
                ' !h-[calc(100vh-115px)] area-blocked ':
                  conversation.isBlockedByMe || conversation.isBlocked,
              }
            )}
            id="chat-feed-container">
            <InfiniteScroll
              inverse
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                overflow: 'hidden',
              }}
              endMessage={
                // <p className="my-3 text-sm text-center text-gray-400">
                //   {pageInfo.totalResults > 10 && `You've seen it all!`}
                // </p>
                <></>
              }
              dataLength={+pageInfo.page * +pageInfo.limit}
              next={onScrollEnd}
              hasMore={messages.length < pageInfo.totalResults}
              scrollableTarget="chat-feed-container"
              loader={
                <div className="flex justify-center my-5">
                  <Spinner />
                </div>
              }>
              {(function (): JSX.Element[] {
                return [...messages].map((msg, i): JSX.Element => {
                  const readers = findReaders(msg);
                  const momentDate = moment(new Date(msg.sendedDate)).format(
                    'DD/MM/YYYY'
                  );

                  // Determine if the next message has a different date
                  const nextMsg = messages[i + 1];
                  const nextMomentDate = nextMsg
                    ? moment(new Date(nextMsg.sendedDate)).format('DD/MM/YYYY')
                    : null;
                  const isLastInDateGroup = momentDate !== nextMomentDate;

                  return (
                    <div key={msg.id + `${i}`}>
                      {i !== 0 && isLastInDateGroup && momentDate ? (
                        displayTextDate(momentDate)
                      ) : messages.length === 1 &&
                        isLastInDateGroup &&
                        momentDate ? (
                        displayTextDate(momentDate)
                      ) : (
                        <></>
                      )}
                      <MemoizedChatBubble
                        widthNameTruncate={200}
                        message={msg}
                        isLatest={!i}
                        index={i}
                        totalResults={messages.length}
                        readers={readers}
                        conversation={conversation}
                        onReport={() => {
                          setSelectedMessage(msg);
                          openReportModal();
                        }}
                        onUnsend={() => {
                          setSelectedMessage(msg);
                          openConfirmUnSendChatModal();
                        }}
                        onDelete={() => {
                          setSelectedMessage(msg);
                          openConfirmDeleteChatModal();
                        }}
                        onOpenLightbox={() => handleOpenLightbox(msg.content)}
                      />
                    </div>
                  );
                });
              })()}
            </InfiniteScroll>
          </div>

          <div
            className={classNames({
              'pb-14 max-lg:pb-0 max-lg:relative max-lg:z-[100] wrapper-input-chat ':
                isTabletOrMobile,
            })}>
            {conversation.isBlockedByMe || conversation.isBlocked ? (
              <div className="flex items-center justify-between px-5 lg:px-4 py-3 bg-gray-50 max-lg:h-[60px]">
                <span className="text-sm text-gray-500 truncate">
                  {conversation.isBlockedByMe
                    ? `To start a conversation, you need to unblock this ${conversation?.type === ConversationType.DM ? 'user' : 'group'}.`
                    : 'Unable to send message, you have been blocked.'}
                </span>
              </div>
            ) : (
              <>
                {!isTabletOrMobile ? (
                  <ChatInput />
                ) : (
                  <>{!isOpenMobileControlSidebar && <ChatInput />}</>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {!isTabletOrMobile ? (
        <div
          className={classNames(
            'flex flex-grow-0 flex-shrink-0 fade-in',
            'w-[300px] bg-white min-h-full',
            'border-l border-gray-200',
            'block'
          )}>
          <SideChatInfoSection />
        </div>
      ) : (
        <div className="side-chat-info-section max-lg:!z-[111] fade-in">
          <Drawer
            size={'80%'}
            open={isOpenMobileChatInfo}
            onClose={() => {
              dispatch(toggleMobileChatInfo());
            }}
            direction="right">
            {isOpenMobileChatInfo && (
              <div className="min-w-[333px] max-w-[333px] max-lg:min-w-full max-lg:max-w-full bg-white min-h-full">
                <SideChatInfoSection />
              </div>
            )}
          </Drawer>
        </div>
      )}

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            setTimeout(() => {
              closeConfirmUnBlockModal();
            }, 100);
            await handleUnblock();
          })();
        }}
        openModal={isOpenConfirmUnBlockModal}
        onCloseModal={closeConfirmUnBlockModal}
        title="Confirm unblock"
        color="red"
        description={`Do you want to unblock '${conversation?.type === ConversationType.DM ? profile?.name : conversation?.name}'`}
      />

      <InviteGroupModal
        isOpen={isOpenInviteGroupModal}
        onClose={closeInviteGroupModal}
        conversation={conversation}
      />
      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleBlockUser(
              profile,
              conversation,
              conversation.type === ConversationType.GROUP
            );
          })();
        }}
        openModal={isOpenConfirmBlockModal}
        onCloseModal={closeConfirmBlockModal}
        title="Confirm block"
        color="red"
        description={`Do you want to block '${conversation.type === ConversationType.GROUP ? conversation?.name : profile?.name}' ?`}
      />
      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleDeleteConversation();
          })();
        }}
        openModal={isOpenConfirmDeleteModal}
        onCloseModal={closeConfirmDeleteModal}
        title="Confirm delete"
        color="red"
        description={`Do you want to delete chat '${conversation.type === ConversationType.GROUP ? conversation?.name : profile?.name}' ?`}
      />
      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleLeaveConversation();
          })();
        }}
        size="lg"
        openModal={isOpenConfirmLeaveModal}
        onCloseModal={closeConfirmLeaveModal}
        title="Confirm leave"
        color="red"
        description={`Do you want to leave chat group '${conversation.type === ConversationType.GROUP ? conversation?.name : profile?.name}' ?`}
      />
      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleDeleteGroup();
          })();
        }}
        size="lg"
        openModal={isOpenConfirmDeleteGroupModal}
        onCloseModal={closeConfirmDeleteGroupModal}
        title="Confirm delete group"
        color="red"
        description={`Do you want to delete chat group '${conversation.type === ConversationType.GROUP ? conversation?.name : profile?.name}' ?`}
      />
      <ReportModal
        openModal={isOpenReportModal}
        closeModal={() => {
          setSelectedMessage(undefined);
          closeReportModal();
        }}
        profile={profile}
        message={selectedMessage}
        groupId={conversation.id}
        groupName={conversation.name}
        type={selectedMessage ? selectedMessage.contentType : conversation.type}
      />

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleRedirectToDispute();
          })();
        }}
        openModal={isOpenRedirectDisputeModal}
        onCloseModal={closeRedirectDisputeModal}
        title="Redirect to Dispute page"
        color="red"
        description={`You have been chat dispute`}
        isHideBtnCancel={true}
      />
      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleUnsendChat();
          })();
        }}
        openModal={isOpenConfirmUnSendChatModal}
        onCloseModal={closeConfirmUnSendChatModal}
        title="Confirm unsend message"
        color="red"
        description={`Do you want to unsend this message ?`}
      />

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleDeleteChat();
          })();
        }}
        openModal={isOpenConfirmDeleteChatModal}
        onCloseModal={closeConfirmDeleteChatModal}
        title="Confirm remove message"
        color="red"
        description={`Do you want to remove this message ?`}
      />
      <ConfirmModal
        openModal={modalDeleteMailVault}
        onCloseModal={() => dispatch(handleMistakeChat(`No it's a mistake`))}
        onConfirm={() => dispatch(handleOpenModalConfirmDeleteMailVault())}
        btnTextConfirm="Yes, delete this mail."
        btnTextCancel={`No, it's a mistake`}
        title="Delete this MailVault"
        color="red"
        description={`Are you sure you want to delete this MailVault?`}
      />
      <ConfirmModal
        openModal={modalConfirmDeleteMailVault}
        onCloseModal={() => dispatch(handleDeleteMailVault(false))}
        onConfirm={() => dispatch(handleDeleteMailVault(true))}
        title="Confirm Delete MailValue"
        btnTextConfirm="Yes, delete it forever"
        btnTextCancel={`No, it's a mistake`}
        color="red"
        description={`This action cannot be undone. You will lose your mail forever. \n
          Do you want to continue?`}
      />
    </div>
  );
}
