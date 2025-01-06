import { BiDislike } from 'react-icons/bi';
import { FaRegWindowClose } from 'react-icons/fa';

import { defaultImages } from '../../../../../constant/default-images';
import { ConversationRequestPayload } from '../../../../../type/conversation-requests';
import {
  ConversationRequestType,
  ConversationType,
} from '../../../../../type/conversation';
import { useDispatch, useSelector } from '../../../../../redux';
import { Avatar } from 'flowbite-react';
import useBoolean from '../../../../../helper/hook/useBoolean';
import ConfirmModal from '../../../../../component/@share/ConfirmModal';
import { toast } from 'react-toastify';
import {
  blockGroupByIdApi,
  blockUserByIdApi,
} from '../../../../../rest-api/user-block';
import { errorFormat } from '../../../../../helper/error-format';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../../../type/auth';
import ReportModal from '../../../../../component/@share/ReportModal';
import {
  loadResultsAction,
  startLoadingAction,
} from '../../../../../redux/conversation';
type Props = {
  request: ConversationRequestPayload;
};

export default function SideRequestInfoSection({ request }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.account);
  const [
    isOpenConfirmBlockModal,
    openConfirmBlockModal,
    closeConfirmBlockModal,
  ] = useBoolean(false);
  const [isOpenReportModal, openReportModal, closeReportModal] =
    useBoolean(false);
  const [isBlockGroup, trueIsBlockGroup, falseIsBlockGroup] = useBoolean(false);

  const reloadConversation = () => {
    dispatch(startLoadingAction());
    dispatch(
      loadResultsAction({
        type: ConversationType.GROUP,
      })
    );
    setTimeout(() => {
      navigate(`/chat/group`);
    }, 200);
  };

  const handleBlockUser = async (
    profile?: User | null,
    conversation?: ConversationRequestPayload | null,
    isBlockGroup?: boolean
  ) => {
    try {
      if (
        (profile && profile.id) ||
        (conversation && conversation?.conversationId)
      ) {
        let resp;
        if (!!conversation && !!conversation?.conversationId && isBlockGroup) {
          resp = await blockGroupByIdApi({
            conversationId: conversation?.conversationId,
          });
        } else {
          resp = await blockUserByIdApi({ userId: profile?.id || '' });
        }
        if (resp) {
          toast.success(
            `Blocked ${profile?.displayName || conversation?.conversation?.name} successfully`
          );
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      closeConfirmBlockModal();
      setTimeout(() => {
        !!conversation && isBlockGroup
          ? reloadConversation()
          : navigate(`/chat`);
      }, 400);
    }
  };

  const isMyRequest = user?.id === request.senderId;
  const profile = isMyRequest ? request.user : request.sender;

  const dmSection = () => {
    return (
      <>
        <div>
          <Avatar
            size="lg"
            rounded
            img={props => (
              <img
                {...props}
                alt=""
                referrerPolicy="no-referrer"
                style={{
                  objectFit: 'cover',
                }}
                src={profile.picture}
                onError={e => {
                  e.currentTarget.src = defaultImages.noProfile;
                }}
              />
            )}
          />
          <div className="text-xl font-bold text-center text-gray-900 cursor-pointer">
            {profile.displayName}
          </div>
        </div>

        <div className="flex flex-col gap-4 text-[#F05252]">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              falseIsBlockGroup();
              openConfirmBlockModal();
            }}>
            <span>
              <FaRegWindowClose className="text-base" />
            </span>
            <p className="text-sm">Block user</p>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => openReportModal()}>
            <span>
              <BiDislike className="text-base" />
            </span>
            <p className="text-sm">Report user</p>
          </div>
        </div>
      </>
    );
  };

  const groupSection = () => {
    const img = request.conversation?.profilePicture || defaultImages.noProfile;

    return (
      <>
        <div>
          <Avatar
            size="lg"
            rounded
            img={props => (
              <img
                {...props}
                alt=""
                referrerPolicy="no-referrer"
                style={{
                  objectFit: 'cover',
                }}
                src={img}
                onError={e => {
                  e.currentTarget.src = defaultImages.noProfile;
                }}
              />
            )}
          />
          <div className="text-xl font-bold text-center text-gray-900 cursor-pointer">
            {request.conversation?.name}
          </div>
        </div>

        <div className="flex flex-col gap-4 text-[#F05252]">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              trueIsBlockGroup();
              openConfirmBlockModal();
            }}>
            <span>
              <FaRegWindowClose className="text-base" />
            </span>
            <p className="text-sm">Block group</p>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => openReportModal()}>
            <span>
              <BiDislike className="text-base" />
            </span>
            <p className="text-sm">Report group</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-full gap-6 px-4 pt-4 pb-6 overflow-y-auto">
      {request.type === ConversationRequestType.MESSAGE_REQUEST && dmSection()}
      {request.type === ConversationRequestType.GROUP_REQUEST && groupSection()}

      <ConfirmModal
        onConfirm={() => {
          (async () => {
            await handleBlockUser(profile, request, isBlockGroup);
          })();
        }}
        openModal={isOpenConfirmBlockModal}
        onCloseModal={closeConfirmBlockModal}
        title="Confirm block"
        color="red"
        description={`Do you want to block '${request.type === ConversationRequestType.GROUP_REQUEST ? request.conversation?.name : profile?.displayName}' ?`}
      />

      <ReportModal
        openModal={isOpenReportModal}
        closeModal={() => closeReportModal()}
        profile={profile}
        groupId={request.conversation?.id}
        groupName={request.conversation?.name}
        type={
          request.type === ConversationRequestType.GROUP_REQUEST
            ? ConversationType.GROUP
            : ConversationType.DM
        }
      />
    </div>
  );
}
