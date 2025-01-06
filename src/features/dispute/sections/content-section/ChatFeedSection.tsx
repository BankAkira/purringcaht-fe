import Avatar from '../../../../component/avatar/Avatar.tsx';
import { off, onChildChanged, onValue, ref } from 'firebase/database';
import { IoMdMore } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import SideChatInfoSection from './SideChatInfoSection.tsx';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect.ts';
import { useDispatch, useSelector } from '../../../../redux';
import {
  initializeMessageAction,
  loadMoreMessageAction,
  receiveIncomingMessageAction,
  resetMessageStateAction,
  updateLatestReadMessageAction,
} from '../../../../redux/message-dispute.ts';
import FullSpinner from '../../../../component/FullSpinner.tsx';
import { defaultImages } from '../../../../constant/default-images.ts';
import { isArray, isEmpty } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Dropdown, Spinner } from 'flowbite-react';
import useConversationProfile from '../../../../helper/hook/useConversationProfile.tsx';
import Judge from '../../../../asset/icon/icons/judge.png';

import {
  IncomingMessage,
  LatestMessageRead,
  MessagePayload,
  UnsentMessage,
} from '../../../../type/message.ts';
import moment from 'moment';
// import { toast } from 'react-toastify';
import useBoolean from '../../../../helper/hook/useBoolean.ts';
import { Notification as NotificationType } from '../../../../type/notification.ts';

// import { errorFormat } from '../../../../../../helper/error-format';

// import { initializeAccountSuccess } from '../../../../../../redux/account';
// import { updateUserSettingApi } from '../../../../../../rest-api/user-setting';
// import { User } from '../../../../../../type/auth';
// import { UpdateUserSettingPayload } from '../../../../../../type/setting';
import useResponsive from '../../../../helper/hook/useResponsive.ts';
import { FaInfoCircle } from 'react-icons/fa';
import {
  setIsOpenMobileControlSidebar,
  toggleMobileChatInfo,
  toggleMobileControlSidebarAction,
} from '../../../../redux/convesation-layout.ts';
import CreateConversationAfterDelete from './CreateConversationAfterDelete.tsx';
import { loadResultsAction } from '../../../../redux/conversation-dispute.ts';
import { FaAngleLeft } from 'react-icons/fa6';

// import sleep from '../../../../../../helper/sleep';
// import { ConversationDispute } from '../../../../../../type/conversation-dispute';

// import Alert from '../../../../../../component/alert/Alert';
// import DisputeResolutionModal from '../../../../modals/DisputeResolutionModal';
import { memo, useState } from 'react';
import ChatBubbleDispute from '../../components/ChatBubbleDispute.tsx';
// import { ResultDisputeForm } from '../../../../../../type/dispute.ts';
import InformationDisputeBubble from '../../components/InfomationDisputeBubble.tsx';
import { Dispute } from '../../../../type/dispute.ts';
import { Logger } from '../../../../helper/logger.ts';
import _ from 'lodash';
import { RiChatNewLine } from 'react-icons/ri';
import { getContactByUserIdApi } from '../../../../rest-api/contact.ts';

const log = new Logger('ChatFeedSection');
const MemoizedChatBubble = memo(ChatBubbleDispute);
const MemoizedInformationBubble = memo(InformationDisputeBubble);

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
  } = useSelector(state => state.messageDispute);
  const { database } = useSelector(state => state.firebase);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useConversationProfile(conversation);
  const { user } = useSelector(state => state.account);
  const { isTabletOrMobile } = useResponsive();

  const [isDeleteByMe, trueIsDeleteByMe, falseIsDeleteByMe] = useBoolean(false);
  const [dispute, setDispute] = useState<Dispute>({} as Dispute);
  const [typeUser, setTypeUser] = useState<string | undefined>(undefined);

  // const [
  //   isOpenDisputeResolution,
  //   openDisputeResolutionModal,
  //   closeDisputeResolutionModal,
  // ] = useBoolean(false);
  // const [isAdminPlatform, trueAdminPlatform, falseAdminPlatform] =
  //   useBoolean(false);
  // const [isFailure, trueFailure, falseFailure] = useBoolean(false);
  // const [
  //   isOpenDisputeResolution,
  //   openDisputeResolutionModal,
  //   closeDisputeResolutionModal,
  // ] = useBoolean(false);

  useDeepEffect(() => {
    if (isError && params.conversationId) {
      if (isTabletOrMobile) {
        dispatch(setIsOpenMobileControlSidebar(true));
        log.debug(trueIsDeleteByMe);
      }
      navigate(`/dispute`);
    }
  }, [isError]);

  useDeepEffect(() => {
    const conversationId =
      params.groupId || params.directId || params.conversationId;
    if (conversationId) {
      dispatch(initializeMessageAction(conversationId)).then();
    }
    return () => dispatch(resetMessageStateAction());
  }, [params.directId, params.groupId, params.conversationId]);

  useDeepEffect(() => {
    if (conversation?.Dispute) {
      setDispute(conversation?.Dispute[0]);
    }

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
                  dispatch(initializeMessageAction(conversation.id)).then();
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
            // dispatch(unsendMessageAction(val.id));
          }
        }
      });
    }
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
  }, [database, conversation]);

  useDeepEffect(() => {
    // if (conversation?.isDeleteByMe) {
    //   // trueIsDeleteByMe();
    // } else {

    // }
    falseIsDeleteByMe();
    if (user && conversation?.Dispute) {
      const typeUser = findUser(conversation?.Dispute[0], user.id);
      setTypeUser(typeUser);
    }
  }, [conversation, user]);

  const findUser = (dispute: Dispute, userId: string) => {
    // will be return defendantId or  plaintiffId
    return _.findKey(dispute, value => value === userId);
  };

  // useDeepEffect(() => {
  //   if (user?.role === UserRole.ADMIN_PLATFORM) {
  //     trueAdminPlatform();
  //   } else {
  //     falseAdminPlatform();
  //   }
  // }, [user]);

  const onScrollEnd = () => {
    if (!isLoadingMore) {
      dispatch(loadMoreMessageAction());
    }
  };

  // const handleUpdateMuteNotifications = async (
  //   type: ConversationType,
  //   isAlreadyMute?: boolean
  // ) => {
  //   try {
  //     if (type === ConversationType.DM) {
  //       if (profile && profile?.userId) {
  //         const muteId = user?.userSetting?.muteUsers
  //           ? [...user.userSetting.muteUsers, profile?.userId]
  //           : [];
  //         const newMuteIds = isAlreadyMute
  //           ? user?.userSetting?.muteUsers?.filter(
  //               item => item !== profile?.userId
  //             )
  //           : muteId;
  //         const payload: UpdateUserSettingPayload = {
  //           muteUsers: newMuteIds,
  //         };
  //         const resp = await updateUserSettingApi(payload);
  //         if (resp && user?.userSetting) {
  //           const newUserInfo: User = {
  //             ...user,
  //             userSetting: { ...user.userSetting, muteUsers: newMuteIds },
  //           };
  //           dispatch(initializeAccountSuccess({ user: newUserInfo }));
  //         }
  //       }
  //     } else {
  //       if (conversation && conversation?.id) {
  //         const muteId = user?.userSetting?.muteConversationGroups
  //           ? [...user.userSetting.muteConversationGroups, conversation?.id]
  //           : [];
  //         const newMuteIds = isAlreadyMute
  //           ? user?.userSetting?.muteConversationGroups?.filter(
  //               item => item !== conversation?.id
  //             )
  //           : muteId;
  //         const payload: UpdateUserSettingPayload = {
  //           muteConversationGroups: newMuteIds,
  //         };
  //         const resp = await updateUserSettingApi(payload);
  //         if (resp && user?.userSetting) {
  //           const newUserInfo: User = {
  //             ...user,
  //             userSetting: {
  //               ...user.userSetting,
  //               muteConversationGroups: newMuteIds,
  //             },
  //           };
  //           dispatch(initializeAccountSuccess({ user: newUserInfo }));
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(errorFormat(error).message);
  //   }
  // };

  // if (isInitializing || isFailure) {
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full gap-2 bg-white fade-in">
        <FullSpinner />
      </div>
    );
  }
  // d
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
    const readers = readersPayload.map(r => r.user);
    return readers;
  };

  const img = profile?.pictures;

  // const handleDisputeResolution = async (payload: ResultDisputeForm) => {
  //   log.debug('DisputeResolution', payload);
  //   onCreateResultsDispute(payload);
  // };

  const createNewConversation = async (userId: string) => {
    if (!userId) {
      navigate('/chat/contacts');
    }
    try {
      const resContact = await getContactByUserIdApi(userId);
      if (resContact?.contact?.id) {
        navigate('/chat/contacts/' + resContact.contact.id);
      } else {
        navigate('/chat/contacts');
      }
    } catch (error) {
      log.error('error ', error);
    }
  };
  return (
    <div className="flex min-h-full chat-page">
      <div
        className={
          (isTabletOrMobile ? '' : 'w-[calc(100vw-697px)]') +
          ' flex-grow fade-in'
        }>
        <div className="relative flex flex-col min-h-full">
          <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px] max-lg:py-3 max-lg:h-[60px] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:z-20">
            <div className="flex items-center gap-3 max-w-[55%] sm:max-w-[75%]">
              {isTabletOrMobile && (
                <div
                  onClick={() => {
                    dispatch(toggleMobileControlSidebarAction());
                    navigate(`/dispute`);
                  }}>
                  <FaAngleLeft className="text-[#F05252] text-[20px] cursor-pointer" />
                </div>
              )}
              <Avatar
                img={img ? img : defaultImages.noProfile}
                name={profile?.name}
                size="sm"
              />
              <img src={Judge} width={'16px'} alt="judge" />{' '}
              {typeUser === undefined && (
                <div className={'flex gap-2 w-full items-center'}>
                  <div className='text-sm font-semibold truncate w-full"'>
                    {' '}
                    {dispute?.defendant?.displayName || 'Anonymous'}
                  </div>
                  <Avatar size="sm" img={dispute?.defendant?.picture || ''} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 button-dot-option">
              {typeUser !== undefined && (
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
                  <Dropdown.Item
                    onClick={() =>
                      createNewConversation(
                        typeUser === 'plaintiffId'
                          ? dispute.defendantId
                          : dispute.plaintiffId
                      )
                    }>
                    <RiChatNewLine className="-mt-[2px] me-2 text-[18px]" />
                    Create New Conversation
                  </Dropdown.Item>
                  <Dropdown.Divider className="!m-0" />
                </Dropdown>
              )}
              {isTabletOrMobile && (
                <div
                  className="cursor-pointer"
                  onClick={() => dispatch(toggleMobileChatInfo())}>
                  <FaInfoCircle className="text-[24px] hover:scale-125 transition text-[#9CA3AF] " />
                </div>
              )}
            </div>
          </div>

          {/* <Alert
            title={{
              label: 'This conversation is on a dispute',
              className: 'font-semibold text-lg leading-6 text-blue-500',
            }}
            description={{
              label:
                'This conversation is currently in dispute and is awaiting resolution by the Admin. The result will be displayed here soon',
              className: 'font-normal text-sm leading-6 text-gray-500',
            }}
            subDescription={{
              label:
                'The dispute request was submitted on April 22, 2024, at 22:35.',
              className: 'font-normal text-xs leading-6 text-gray-500',
            }}
            buttons={{
              yes: {
                label: 'Start a new conversation',
                onClick: () => alert('Yes button clicked'),
                className: 'text-red-500 border-red-500',
              },
              // no: {
              //   label: 'no',
              //   onClick: () => alert('Yes button clicked'),
              //   className: 'text-red-500 border-red-500',
              // },
            }}
            status="info"
            className={'custom-dispute'}
          /> */}

          <div
            className={classNames(
              'flex flex-col-reverse w-full h-[calc(100vh-115px)] area-blocked px-4 pt-5 pb-1 overflow-y-auto',
              {
                ' !h-[calc(100vh-115px)] area-blocked ':
                  conversation.isBlockedByMe || conversation.isBlocked,
              }
            )}
            id="chat-feed-container-dispute">
            <InfiniteScroll
              inverse
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                overflow: 'hidden',
              }}
              endMessage={
                <p className="my-3 text-sm text-center text-gray-400">
                  {pageInfo.totalResults > 10 && `You've seen it all!`}
                </p>
              }
              dataLength={+pageInfo.page * +pageInfo.limit}
              next={onScrollEnd}
              hasMore={messages.length < pageInfo.totalResults}
              scrollableTarget="chat-feed-container-dispute"
              loader={
                <div className="flex justify-center my-5">
                  <Spinner />
                </div>
              }>
              <div>
                <div>
                  <div className="mb-2.5 text-gray-400 text-sm text-center delay-chat">
                    <span>dispute</span>
                  </div>
                  {dispute && (
                    <MemoizedInformationBubble
                      widthNameTruncate={200}
                      conversation={conversation}
                      dispute={dispute}
                    />
                  )}
                </div>
              </div>

              {(() => {
                return [...messages].map((msg, i) => {
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
                    <div key={msg.id}>
                      {isLastInDateGroup && momentDate && (
                        <div className="mb-2.5 text-gray-400 text-sm text-center delay-chat">
                          <span>
                            -{' '}
                            {momentDate !== 'Invalid date'
                              ? momentDate === moment().format('DD/MM/YYYY')
                                ? 'Today'
                                : momentDate ===
                                    moment()
                                      .subtract(1, 'days')
                                      .format('DD/MM/YYYY')
                                  ? 'Yesterday'
                                  : momentDate
                              : 'Today'}{' '}
                            -
                          </span>
                        </div>
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
                          // setSelectedMessage(msg);
                          // openReportModal();
                        }}
                        onUnsend={() => {
                          // setSelectedMessage(msg);
                          // openConfirmUnSendChatModal();
                        }}
                        onDelete={() => {
                          // setSelectedMessage(msg);
                          // openConfirmDeleteChatModal();
                        }}
                      />
                    </div>
                  );
                });
              })()}
            </InfiniteScroll>
            {/* )}
            <div className="flex justify-center pb-4 absolute w-full">
              <Button
                pill
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => openDisputeResolutionModal()}>
                Dispute Resolution Summary
              </Button>
            </div> */}
          </div>

          <div
            className={classNames({
              'pb-14 max-lg:pb-0 max-lg:relative max-lg:z-[100] wrapper-input-chat ':
                isTabletOrMobile,
            })}>
            <div className="flex items-center justify-between w-[100%] h-[50px] px-5 bg-gray-50 max-lg:h-[60px]">
              <span className="text-sm text-gray-500">
                You cannot send any message because this conversation is on a
                dispute.
              </span>
            </div>
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
        <div className="side-chat-info-section max-lg:!z-[111] fade-in"></div>
      )}
    </div>
  );
}

// const onCreateResultsDispute = async (payload: ResultDisputeForm) => {
//   try {
//     const res = await createResultDispute(payload);
//     log.debug('res create resultsDispute', res);
//   } catch (error) {
//     log.error('error create resultsDispute', error);
//   }
// };
