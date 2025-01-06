import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../../redux';
import { toggleIsShowLoader } from '../../../../redux/layout.ts';
import {
  ConversationMenuTab,
  ConversationPayload,
  ConversationType,
  CreateConversationBody,
} from '../../../../type/conversation.ts';
import { createConversationRequestApi } from '../../../../rest-api/conversation.ts';
import { toast } from 'react-toastify';
import { errorFormat } from '../../../../helper/error-format.ts';
import Avatar from '../../../../component/avatar/Avatar.tsx';
import trimAddress from '../../../../helper/trim-address.ts';
import Button from '../../../../component/button/Button.tsx';
import { defaultImages } from '../../../../constant/default-images.ts';
import useResponsive from '../../../../helper/hook/useResponsive.ts';
import { setIsOpenMobileControlSidebar } from '../../../../redux/convesation-layout.ts';

type Props = {
  conversation: ConversationPayload | null;
  onReload: () => void;
};
export default function CreateConversationAfterDelete({
  conversation,
  onReload,
}: Props) {
  const { user } = useSelector(state => state.account);
  const { isTabletOrMobile } = useResponsive();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoToConversation = async () => {
    try {
      dispatch(toggleIsShowLoader(true));
      if (!conversation) {
        throw new Error('Contact not found');
      }

      const participants =
        conversation.type === ConversationType.GROUP
          ? conversation?.participants.find(item => item.userId === user?.id)
          : conversation?.participants.find(item => item.userId !== user?.id);

      if (participants) {
        const contact = conversation?.participants.find(
          item => item.userId !== user?.id
        )?.contact;
        const body: CreateConversationBody = {
          conversationId: conversation.id,
          userIds: [participants.userId],
          description: contact?.description,
          reason: contact?.reason,
          type: conversation.type,
        };

        const createdResp = await createConversationRequestApi(body);
        if (!createdResp?.conversationRequests[0].id) {
          throw new Error('Request is error');
        }

        navigate(
          `/chat/${conversation.type === ConversationType.DM ? ConversationMenuTab.DIRECT : ConversationMenuTab.GROUP}/${conversation?.id}`
        );
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      onReload();
      setTimeout(() => {
        dispatch(toggleIsShowLoader(false));
      }, 500);
    }
  };

  return (
    <div
      className={
        (isTabletOrMobile ? 'min-h-[calc(100vh-58px)]' : 'min-h-full') +
        ' flex flex-col items-center justify-center w-full gap-2 bg-white fade-in'
      }>
      {conversation && (
        <>
          <Avatar
            noCursorPointer
            img={
              (conversation.type === ConversationType.DM
                ? conversation?.participants.find(
                    item => item.userId !== user?.id
                  )?.user?.picture
                : conversation?.profilePicture) || defaultImages.noProfile
            }
            isChatProfile
            onClick={() => {}}
            size="xl"
            text={trimAddress(
              conversation?.participants.find(item => item.userId !== user?.id)
                ?.user?.walletAddress
            )}
          />
          <p className="text-lg font-bold">
            {conversation.type === ConversationType.DM
              ? conversation?.participants.find(
                  item => item.userId !== user?.id
                )?.user?.displayName
              : conversation?.name}
          </p>
          <p className="mt-3 text-center text-gray-500">
            {`You haven't started a chat with '${
              conversation.type === ConversationType.DM
                ? conversation?.participants.find(
                    item => item.userId !== user?.id
                  )?.user?.displayName
                : conversation?.name
            }' yet`}
          </p>
          <p className="-mt-2 text-center text-gray-500">
            Press Start conversation to begin chatting
          </p>
          <div className="flex flex-col justify-center gap-3 mt-3 max-w-[600px]">
            {isTabletOrMobile && (
              <Button
                className="!text-red-500 !bg-transparent !p-0 mb-1"
                label="Go back"
                onClick={() => {
                  dispatch(setIsOpenMobileControlSidebar(true));
                  navigate(`/chat/${ConversationMenuTab.DIRECT}`);
                }}
                size="lg"
                variant="primary"
              />
            )}
            <Button
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400"
              label="Start conversation Dispute"
              onClick={() => {
                (async () => {
                  await handleGoToConversation();
                })();
              }}
              size="lg"
              variant="primary"
            />
          </div>
        </>
      )}
    </div>
  );
}
