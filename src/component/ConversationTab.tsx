import moment from 'moment';
import { ComponentProps, ReactNode, useState } from 'react';
import { defaultImages } from '../constant/default-images';
import useConversationProfile from '../helper/hook/useConversationProfile';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import { ConversationPayload, ConversationType } from '../type/conversation';
import { IncomingMessage, MessageContentType } from '../type/message';
import TabWrapper from './TabWrapper';
import ChatTab from './chat-tab/ChatTab';
// import { decryptMessage } from '../helper/crypto';
import { BsPaperclip } from 'react-icons/bs';
import { LuSticker } from 'react-icons/lu';
import { MdVideoLibrary } from 'react-icons/md';
import { GoImage } from 'react-icons/go';
import { useSelector } from '../redux';

type LatestMessageState = {
  message: string;
  contentType: MessageContentType;
};

export default function ConversationTab(
  props: {
    conversation: ConversationPayload;
    userNickname?: string;
    isSearch?: boolean;
    incomingMessage: IncomingMessage | null;
  } & ComponentProps<typeof TabWrapper>
) {
  const { conversation, userNickname, isSearch, incomingMessage, ...rest } =
    props;
  const profile = useConversationProfile(conversation);
  const { conversation: conversationMessage } = useSelector(
    state => state.message
  );
  const { isFetchFirebase } = useSelector(state => state.conversation);

  const [latestMessage, setLatestMessage] = useState<LatestMessageState | null>(
    null
  );

  useDeepEffect(() => {
    (async () => {
      if (incomingMessage) {
        const message: LatestMessageState = {
          message: '',
          contentType: incomingMessage.contentType,
        };
        setLatestMessage(message);
      }
    })();
  }, [incomingMessage]);

  const getlatestMessageText = () => {
    // if (!isOnceloadDone) {
    //   return 'Start Conversation';
    // }
    let defaultText: ReactNode = '[Encrypted Message]';
    if (!latestMessage) {
      return defaultText;
    }

    switch (latestMessage?.contentType) {
      case MessageContentType.TEXT:
        defaultText = '[Encrypted Message]';
        break;
      case MessageContentType.DISPUTED:
        defaultText = (
          // <div className="flex items-center gap-1">
          //   <GoImage />
          //   Image
          // </div>
          // <div className="text-[#4B99F1]">Under Dispute</div>
          <div className="text-[#0E9F6E]">Dispute Resolved</div>
        );
        break;
      case MessageContentType.IMAGE:
        defaultText = (
          <div className="flex items-center gap-1">
            <GoImage />
            Image
          </div>
        );
        break;
      case MessageContentType.VIDEO:
        defaultText = (
          <div className="flex items-center gap-1">
            <MdVideoLibrary />
            Video
          </div>
        );
        break;
      case MessageContentType.STICKER:
        defaultText = (
          <div className="flex items-center gap-1">
            <LuSticker />
            Sticker
          </div>
        );
        break;
      case MessageContentType.FILE:
        defaultText = (
          <div className="flex items-center gap-1">
            <BsPaperclip />
            Attachment
          </div>
        );
        break;
    }

    return defaultText;
  };

  const img =
    conversation.type === ConversationType.GROUP
      ? conversation.profilePicture
      : profile?.pictures;

  const timestamp = conversation.lastestMessageDate
    ? moment(conversation.lastestMessageDate).unix()
    : moment(conversation.latestMessageDate).unix();

  return (
    <TabWrapper {...rest}>
      <ChatTab
        isOfficial={conversation.description === 'Add friend official'}
        isFetch={conversation.id === conversationMessage?.id && isFetchFirebase}
        img={img ? img : defaultImages.noProfile}
        unreadCount={conversation.unreadCount}
        memberCount={
          conversation.type === ConversationType.GROUP
            ? conversation.participants.length
            : undefined
        }
        name={userNickname || profile?.name || ''}
        text={
          isSearch
            ? profile?.displayId
              ? `User ID: ${profile?.displayId}`
              : getlatestMessageText()
            : getlatestMessageText()
        }
        timestamp={timestamp}
      />
    </TabWrapper>
  );
}
