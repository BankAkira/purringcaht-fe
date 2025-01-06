import { useEffect, useState } from 'react';
import Avatar from '../../../../../component/avatar/Avatar';
import Button from '../../../../../component/button/Button';
import SwitchButton from '../../../../../component/switch/Switch';
import { RiEdit2Line } from 'react-icons/ri';
import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../../../helper/error-format';
import {
  deleteContactByIdApi,
  getContactByIdApi,
  hideContactByIdApi,
} from '../../../../../rest-api/contact';
import { useNavigate, useParams } from 'react-router-dom';
import { ContactPayload } from '../../../../../type/contact';
import useBoolean from '../../../../../helper/hook/useBoolean';
import trimAddress from '../../../../../helper/trim-address';
import FullSpinner from '../../../../../component/FullSpinner';
import { useDispatch, useSelector } from '../../../../../redux';
import { toggleIsShowLoader } from '../../../../../redux/layout';
import { defaultImages } from '../../../../../constant/default-images';
import {
  createConversationRequestApi,
  getConversationMessagesApi,
} from '../../../../../rest-api/conversation';
import {
  ConversationMenuTab,
  ConversationType,
  CreateConversationBody,
} from '../../../../../type/conversation';
import ConfirmModal from '../../../../../component/@share/ConfirmModal';
import {
  blockUserByIdApi,
  unblockUserByIdApi,
} from '../../../../../rest-api/user-block';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { BiDislike, BiSolidDislike, BiSolidHide } from 'react-icons/bi';
import ReportModal from '../../../../../component/@share/ReportModal';
import { BiSolidLike } from 'react-icons/bi';
import { getReportUserApi } from '../../../../../rest-api/user-report';
import { queryParamsToString } from '../../../../../helper/query-param';
import { User, UserReportFromSB_Resp } from '../../../../../type/auth';
import UserReportDetailModal from './UserReportDetailModal';
import { Spinner } from 'flowbite-react';
import { MessagePayload } from '../../../../../type/message';
import { formatDate } from '../../../../../helper/format-date';
import { MdOutlineDelete } from 'react-icons/md';
import {
  loadResultsAction,
  startLoadingAction,
} from '../../../../../redux/contact';
import { updateUserSettingApi } from '../../../../../rest-api/user-setting';
import { UpdateUserSettingPayload } from '../../../../../type/setting';
import { initializeAccountSuccess } from '../../../../../redux/account';
import NickNameModal from './NickNameModal';
import useResponsive from '../../../../../helper/hook/useResponsive';
import { FaAngleLeft } from 'react-icons/fa6';
import { toggleMobileControlSidebarAction } from '../../../../../redux/convesation-layout';
import classNames from 'classnames';

import { Logger } from '../../../../../helper/logger';
const log = new Logger('ContactInfoSection');

export default function ContactInfoSection() {
  const { user } = useSelector(state => state.account);
  const { isReloadUserReport, isReloadUserBlock } = useSelector(
    state => state.contact
  );
  const ITEM_PER_PAGE = 5;
  const { contactId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [contact, setContact] = useState<ContactPayload | null>(null);
  const [lastMessage, setLastMessage] = useState<MessagePayload | null>(null);
  const [userReports, setUserReports] = useState<UserReportFromSB_Resp | null>(
    null
  );
  const [isOpenReportModal, openReportModal, closeReportModal] =
    useBoolean(false);
  const [
    isOpenReportDetailModal,
    openReportDetailModal,
    closeReportDetailModal,
  ] = useBoolean(false);
  const [isInitializing, initializingStart, initializingDone] =
    useBoolean(true);
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
  const [isOpenNickNameModal, openNickNameModal, closeNickNameModal] =
    useBoolean(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isTabletOrMobile } = useResponsive();

  const [isLoadingReport, loadingReportStart, loadingReportDone] =
    useBoolean(true);

  const getUserReport = async (contactId: string) => {
    try {
      loadingReportStart();
      const param = {
        toUserId: contactId,
        status: 'DM',
        orderBy: 'createdAt:desc',
        page: currentPage,
        limit: ITEM_PER_PAGE,
      };
      const queryParam = queryParamsToString(param);
      const resp = await getReportUserApi(queryParam);

      if (!!resp?.data?.results && !!resp?.data?.results.length) {
        setUserReports(resp);
      } else {
        setUserReports(null);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      loadingReportDone();
    }
  };

  const getLastMessage = async () => {
    try {
      if (contact?.conversation?.id) {
        const param = {
          orderBy: 'createdAt:desc',
          limit: 1,
          page: 1,
        };
        const messageResp = await getConversationMessagesApi(
          contact?.conversation?.id,
          queryParamsToString(param)
        );
        setLastMessage(messageResp?.results[0] || null);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    }
  };

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
      initializingStart();
      if (contact?.user && contact?.user.id) {
        const resp = await blockUserByIdApi({ userId: contact.user.id });
        if (resp) {
          toast.success(`Blocked ${contact.user.displayName} successfully`);
          if (contactId) {
            const contactPayload = await getContactByIdApi(contactId);
            if (contactPayload) {
              setContact(contactPayload);
            }
          }
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      initializingDone();
      closeConfirmBlockModal();
    }
  };

  const handleUnblock = async () => {
    try {
      initializingStart();
      let resp;
      if (contact?.conversation?.type === ConversationType.DM) {
        if (contact?.user?.id) {
          resp = await unblockUserByIdApi(contact?.user?.id);
        }
      }
      if (resp) {
        toast.success(`Unblock ${contact?.user?.displayName} successfully`);
        if (contactId) {
          const contactPayload = await getContactByIdApi(contactId);
          if (contactPayload) {
            setContact(contactPayload);
          }
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      initializingDone();
      closeConfirmBlockModal();
    }
  };

  const handleDeleteUser = async () => {
    try {
      initializingStart();
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
      initializingDone();
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

  useEffect(() => {
    (async () => {
      loadingReportStart();
      await getLastMessage();
      if (!!contact && !!contact?.userId) {
        await getUserReport(contact?.userId);
      }
    })();
  }, [currentPage, contact]);

  useEffect(() => {
    (async () => {
      if (!!contact && !!contact?.userId && !!isReloadUserReport) {
        loadingReportStart();
        await getUserReport(contact?.userId);
      }
      if (contactId && !!isReloadUserBlock) {
        const contactPayload = await getContactByIdApi(contactId);
        if (contactPayload) {
          setContact(contactPayload);
        }
      }
    })();
  }, [isReloadUserReport, isReloadUserBlock, contactId, contact]);

  useEffect(() => {
    if (currentPage > 1 && !userReports?.data?.results?.length) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage, userReports]);

  const handleInit = async () => {
    try {
      if (contactId) {
        initializingStart();
        const contactPayload = await getContactByIdApi(contactId);
        if (contactPayload) {
          setContact(contactPayload);
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
      navigate(`/chat/${ConversationMenuTab.CONTACTS}`);
    } finally {
      initializingDone();
    }
  };

  useDeepEffect(() => {
    (async () => {
      await handleInit();
    })();
  }, [contactId]);

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-full gap-2 bg-white">
      {isTabletOrMobile && (
        <div className="flex w-full items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 h-[70px] max-lg:h-[60px] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:z-20">
          <div
            className="flex items-center gap-3"
            onClick={() => {
              dispatch(toggleMobileControlSidebarAction());
              navigate(`/chat/${ConversationMenuTab.CONTACTS}`);
            }}>
            <FaAngleLeft className="text-[#F05252] text-[20px]" />
            {!!contact?.user.displayName && (
              <span className="font-bold text-base text-[#555]">
                {contact?.user.displayName}
              </span>
            )}
          </div>
        </div>
      )}
      {isInitializing ? (
        <FullSpinner />
      ) : (
        <div
          className={classNames(
            'flex flex-col items-center justify-center w-full gap-2 min-h-screen',
            { 'pb-[50px] pt-[30px]': isTabletOrMobile }
          )}>
          {contact && (
            <>
              <Avatar
                noCursorPointer
                img={contact?.user.picture || defaultImages.noProfile}
                isChatProfile
                onClick={() => {}}
                size={isTabletOrMobile ? 'lg' : 'xl'}
                text={trimAddress(contact.user.walletAddress)}
              />
              <div className="flex items-center gap-1">
                {isLoadingReport ? (
                  <Spinner size="sm" className="-mt-1" color="gray" />
                ) : (
                  <>
                    {!!userReports?.data?.results &&
                    !!userReports?.data?.results?.length ? (
                      <BiSolidDislike
                        className="text-red-500 text-[18px] -mt-[1px] cursor-pointer"
                        onClick={openReportDetailModal}
                      />
                    ) : (
                      <BiSolidLike
                        className="text-green-500 text-[18px] -mt-[1px] cursor-pointer"
                        onClick={openReportDetailModal}
                      />
                    )}
                  </>
                )}
                {/* text-sm font-normal text-gray-900 truncate w-44 */}
                <p className="text-lg font-bold truncate max-w-[250px]">
                  {contact?.userNickname
                    ? contact?.userNickname
                    : contact?.user.displayName}
                </p>
                <RiEdit2Line
                  className="cursor-pointer text-[#6B7280] text-xl"
                  onClick={openNickNameModal}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5 -mt-2 mb-2">
                {!!contact?.userNickname && !!contact?.user?.displayName && (
                  <span className="text-sm text-gray-400">{`Profile name: ${contact.user.displayName}`}</span>
                )}
                {!!contact?.user?.displayId && (
                  <span className="text-sm text-gray-400">{`User ID: ${contact.user.displayId}`}</span>
                )}
              </div>

              <small className="text-[#6B7280] fade-in-600ms">
                Last seen{' '}
                {formatDate(
                  lastMessage?.createdAt || new Date(),
                  'DD/MM/YYYY, HH:mm'
                )}
              </small>
              <SwitchButton
                label="Mute notifications"
                onToggle={() => {
                  (async () => {
                    await handleUpdateMuteNotifications(
                      !!user?.userSetting?.muteUsers?.some(
                        item => item === contact.userId
                      )
                    );
                  })();
                }}
                isActive={
                  !!user?.userSetting?.muteUsers?.some(
                    item => item === contact.userId
                  )
                }
              />
              {/* <div className="flex">
              <TextInput placeholder="Alias name" />
              <Button
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400"
                label="Save"
                onClick={() => {}}
                size="lg"
                variant="primary"
              />
            </div> */}
              <div className="flex flex-col justify-center gap-3 mt-3 max-w-[300px] w-full">
                {contact?.conversation ? (
                  <Button
                    className="justify-center w-full text-white bg-gradient-to-br from-pink-500 to-orange-400"
                    label="Go to conversation"
                    onClick={() => {
                      (async () => {
                        await handleConversationRequest(true);
                      })();
                    }}
                    size="lg"
                    variant="primary"
                  />
                ) : (
                  <Button
                    className="justify-center w-full text-white bg-gradient-to-br from-pink-500 to-orange-400"
                    label="Start a conversation"
                    onClick={handleConversationRequest}
                    size="lg"
                    variant="primary"
                  />
                )}

                <Button
                  className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center w-full justify-center"
                  label={
                    contact?.conversation?.isBlockedByMe
                      ? 'Unblock this user'
                      : 'Block this user'
                  }
                  iconLeftSide={
                    <IoCloseCircleOutline className="w-5 h-5 mr-2" />
                  }
                  onClick={openConfirmBlockModal}
                />
                <Button
                  className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center w-full justify-center"
                  label="Report this user"
                  iconLeftSide={<BiDislike className="w-5 h-5 mr-2" />}
                  onClick={openReportModal}
                />
                <Button
                  className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center w-full justify-center"
                  label="Delete this user"
                  iconLeftSide={
                    <MdOutlineDelete className="mr-2 h-5 w-5 -mt-[1px]" />
                  }
                  onClick={() => {
                    closeConfirmHiddenModal();
                    openConfirmDeleteModal();
                  }}
                />
                <Button
                  className="!text-[#F05252] !border-[1px] !border-[#F05252] !shadow-none button-custom-border !flex items-center w-full justify-center"
                  label="Hide this user"
                  iconLeftSide={<BiSolidHide className="w-5 h-5 mr-2" />}
                  onClick={() => {
                    closeConfirmDeleteModal();
                    openConfirmHiddenModal();
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      <UserReportDetailModal
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        reports={userReports}
        openModal={isOpenReportDetailModal}
        onCloseModal={closeReportDetailModal}
      />

      <ConfirmModal
        onConfirm={() => {
          {
            (async () => {
              isOpenConfirmDeleteModal
                ? await handleDeleteUser()
                : await handleHiddenUser();
            })();
          }
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
            contact?.conversation?.isBlockedByMe
              ? await handleUnblock()
              : await handleBlockUser();

            dispatch(loadResultsAction());
          })();
        }}
        openModal={isOpenConfirmBlockModal}
        onCloseModal={closeConfirmBlockModal}
        title={
          contact?.conversation?.isBlockedByMe
            ? 'Confirm unblock'
            : 'Confirm block'
        }
        color="red"
        description={`Do you want to ${
          contact?.conversation?.isBlockedByMe ? 'unblock' : 'block'
        } ${contact?.user?.displayName ? `'${contact?.user?.displayName}' ?` : 'this user ?'}`}
      />

      <ReportModal
        openModal={isOpenReportModal}
        closeModal={() => {
          (async () => {
            loadingReportStart();
            setCurrentPage(1);
            await getLastMessage();
            if (!!contact && !!contact?.userId) {
              await getUserReport(contact?.userId);
            }
            closeReportModal();
          })();
        }}
        profile={contact?.user}
        type={ConversationType.DM}
      />

      <NickNameModal
        contact={contact}
        isOpen={isOpenNickNameModal}
        handleClose={closeNickNameModal}
        onSave={handleInit}
      />
    </div>
  );
}
