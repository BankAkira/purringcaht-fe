import Avatar from '../../../../../component/avatar/Avatar';

import MediaThumbnail from './MediaThumbnail';
// import SwitchButton from '../../../../../component/switch/Switch';
import { FaEdit, FaRegWindowClose } from 'react-icons/fa';
import { BiDislike } from 'react-icons/bi';
import { GoTrash } from 'react-icons/go';
import { TbHammer } from 'react-icons/tb';
import { useDispatch, useSelector } from '../../../../../redux';
import useConversationProfile, {
  Profile,
} from '../../../../../helper/hook/useConversationProfile';
import { defaultImages } from '../../../../../constant/default-images';
import useBoolean from '../../../../../helper/hook/useBoolean';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../../../helper/error-format';
// import { Logger } from '../../../../../helper/logger';
import {
  blockGroupByIdApi,
  blockUserByIdApi,
} from '../../../../../rest-api/user-block';
import ConfirmModal from '../../../../../component/@share/ConfirmModal';
import FileThumbnail from './FileThumbnail';
import {
  ConversationPayload,
  ConversationRole,
  ConversationType,
} from '../../../../../type/conversation';
import ReportModal from '../../../../../component/@share/ReportModal';
import { deleteConversationApi } from '../../../../../rest-api/conversation';
import {
  initializeMessageAction,
  resetMessageStateAction,
} from '../../../../../redux/message';
import {
  loadResultsAction,
  startLoadingAction,
} from '../../../../../redux/conversation';
import GroupModal from '../../../../../component/GroupModal';
import InviteGroupModal from '../../../../../component/InviteGroupModal';
import { useNavigate } from 'react-router-dom';
import { toggleIsShowLoader } from '../../../../../redux/layout';
import useResponsive from '../../../../../helper/hook/useResponsive';
import { setIsOpenMobileControlSidebar } from '../../../../../redux/convesation-layout';
import DisputeModal from '../../../../../features/dispute/modals/DisputeModal';
import { Dispute } from '../../../../../type/dispute';

// const log = new Logger('SideChatInfoSection');

export default function SideChatInfoSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversation } = useSelector(state => state.message);
  const { user } = useSelector(state => state.account);
  const { isTabletOrMobile } = useResponsive();

  const [isOpenGroupModal, openGroupModal, closeGroupModal] = useBoolean(false);
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

  const [isOpenDispute, openDisputeModal, closeDisputeModal] =
    useBoolean(false);
  const [
    isOpenDisputeComingSoon,
    openDisputeModalComingsoon,
    closeDisputeModalComingSoon,
  ] = useBoolean(false);

  const profile = useConversationProfile(conversation);

  const reloadConversation = (conversationId?: string) => {
    dispatch(startLoadingAction());
    dispatch(
      loadResultsAction({
        type: conversation?.type,
      })
    );
    if (conversationId) {
      dispatch(initializeMessageAction(conversationId));
    }

    return () => dispatch(resetMessageStateAction());
  };

  const handleDispute = async (dispute: Dispute) => {
    if (dispute) navigate(`/dispute/${dispute.conversationId}`);
  };

  const handleBlockUser = async (
    profile?: Profile | null,
    conversation?: ConversationPayload | null,
    isBlockGroup?: boolean
  ) => {
    try {
      closeConfirmBlockModal();
      dispatch(toggleIsShowLoader(true));
      if ((profile && profile.userId) || (conversation && conversation.id)) {
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
        reloadConversation(conversation?.id);
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
      if (!!conversation && !!conversation?.id) {
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
        reloadConversation(conversation?.id);
        if (isTabletOrMobile) {
          dispatch(setIsOpenMobileControlSidebar(true));
        }
        navigate(
          `/chat/${conversation?.type === ConversationType.DM ? 'direct' : 'group'}`
        );
      }, 400);
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 100);
    }
  };

  if (!conversation) return <></>;

  const img =
    conversation.type === ConversationType.GROUP
      ? conversation.profilePicture
      : profile?.pictures;

  return (
    <div className="flex flex-col w-full min-h-full gap-6 px-3 pt-4 pb-6 overflow-y-auto">
      <div className="text-center w-full">
        {profile && (
          <div
            className={
              (conversation.participants.find(item => item.userId === user?.id)
                ?.role !== ConversationRole.MEMBER
                ? ''
                : 'pointer-events-none') + ' relative w-full'
            }>
            <Avatar
              img={img ? img : defaultImages.noProfile}
              isChatProfile
              name={profile.name}
              onClick={openGroupModal}
              size="lg"
              text={''}
            />
            {conversation.participants.find(item => item.userId === user?.id)
              ?.role !== ConversationRole.MEMBER && (
              <>
                <FaEdit
                  onClick={openGroupModal}
                  className="absolute top-[calc(50%+13px)] right-[calc(50%-51px)] -translate-x-1/2 -translate-y-1/2 text-[20px] text-gray-700 drop-shadow cursor-pointer z-[1]"
                />
                <div className="absolute top-[calc(50%+13px)] right-[calc(50%-46px)] -translate-x-1/2 -translate-y-1/2 bg-white w-[18px] h-[18px] rounded pointer-events-none" />
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {conversation.type === ConversationType.GROUP && (
            <span
              className="text-xs text-blue-500 cursor-pointer"
              onClick={openGroupModal}>
              View all member ({conversation.participants.length})
            </span>
          )}
          {conversation.type === ConversationType.GROUP &&
            conversation?.description && (
              <span className="text-xs text-gray-500 break-all">
                {conversation?.description}
              </span>
            )}
        </div>
      </div>
      <MediaThumbnail />
      <FileThumbnail />
      {/* <SwitchButton label="Mute notifications" onToggle={() => {}} /> */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h6 className="mb-1 text-gray-900">Encryption</h6>
          <small className="text-[#6B7280] text-sm">
            Messages are end-to-end encrypted by using blockchain.
          </small>
        </div>
      </div> */}
      <div className="flex flex-col gap-4 mt-3 text-[#F05252]">
        {conversation.type === ConversationType.DM && (
          <div
            className="flex items-center gap-2 transition cursor-pointer select-none hover:opacity-70"
            onClick={() => openDisputeModalComingsoon()}>
            <span>
              <TbHammer className="text-base" />
            </span>
            <p className="text-sm">Dispute </p>
          </div>
        )}
        {!conversation.isBlocked && !conversation.isBlockedByMe && (
          <div
            className="flex items-center gap-2 transition cursor-pointer select-none hover:opacity-70"
            onClick={() => {
              openConfirmBlockModal();
            }}>
            <span>
              <FaRegWindowClose className="text-base" />
            </span>
            <p className="text-sm">
              {conversation.type === ConversationType.DM
                ? 'Block user'
                : 'Block group'}
            </p>
          </div>
        )}
        <div
          className="flex items-center gap-2 transition cursor-pointer select-none hover:opacity-70"
          onClick={() => {
            openReportModal();
          }}>
          <span>
            <BiDislike className="text-base" />
          </span>
          <p className="text-sm">
            {conversation.type === ConversationType.DM
              ? 'Report user'
              : 'Report group'}
          </p>
        </div>
        <div
          className="flex items-center gap-2 transition cursor-pointer select-none hover:opacity-70"
          onClick={() => openConfirmDeleteModal()}>
          <span>
            <GoTrash className="text-base" />
          </span>
          <p className="text-sm">Delete chat</p>
        </div>
      </div>
      {conversation.type === ConversationType.DM && (
        <DisputeModal
          onDispute={handleDispute}
          openModal={isOpenDispute}
          onCloseModal={closeDisputeModal}
          conversationId={conversation.id}
          platform={conversation.platformType}
        />
      )}
      <ConfirmModal
        onConfirm={closeDisputeModalComingSoon}
        openModal={isOpenDisputeComingSoon}
        onCloseModal={openDisputeModal}
        isHideBtnCancel
        title="Dispute Coming Soon"
        color="red"
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
      <ReportModal
        openModal={isOpenReportModal}
        closeModal={() => closeReportModal()}
        profile={profile}
        groupId={conversation.id}
        groupName={conversation.name}
        type={conversation.type}
      />
      <GroupModal
        isOpen={isOpenGroupModal}
        onClose={closeGroupModal}
        conversation={conversation}
        onInvite={openInviteGroupModal}
        onReload={() => {
          setTimeout(() => {
            reloadConversation(conversation?.id);
          }, 400);
        }}
      />
      <InviteGroupModal
        isOpen={isOpenInviteGroupModal}
        onClose={closeInviteGroupModal}
        conversation={conversation}
      />
    </div>
  );
}
