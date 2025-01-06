// import (Internal imports)
import { PropsWithChildren, useState } from 'react';

// react-icons
import { FaTimesCircle, FaTrashAlt } from 'react-icons/fa';
import { FaCirclePlay, FaDownload } from 'react-icons/fa6';
import { GoReport } from 'react-icons/go';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import {
  IoIosRemoveCircle,
  IoIosSend,
  IoMdCheckmarkCircleOutline,
} from 'react-icons/io';
import { MdSaveAlt } from 'react-icons/md';
import { RiSaveFill } from 'react-icons/ri';
import OfficialIcon from '../asset/icon/official/official-icon.png';

// react-player
import ReactPlayer from 'react-player';

// react-toastify
import { toast } from 'react-toastify';

// flowbite-react
import { Dropdown, Spinner, Tooltip } from 'flowbite-react';

// helper functions
import { decryptMessage } from '../helper/crypto';
import { downloadFile } from '../helper/file';
import { errorFormat } from '../helper/error-format';
import ConvertToLinks from '../helper/useConvertTolinks';
import useBoolean from '../helper/hook/useBoolean';
import useMessageDateTime from '../helper/hook/useMessageTime';
import { useDeepEffect } from '../helper/hook/useDeepEffect';

// redux
import { useDispatch, useSelector } from '../redux';
import { updateMessageByIdAction } from '../redux/message';

// constants
import { defaultImages } from '../constant/default-images';
import { getIconByFileType } from '../constant/icon-files';

// components
import IconButton from './icon-button/IconButton';

// types
import { ConversationPayload, ConversationType } from '../type';
import {
  LatestMessageReader,
  MessageContentType,
  MessagePayload,
} from '../type';

// APIs
import { keepMessageApi } from '../rest-api/conversation-message';

// images
import imageExp from '../asset/images/empty-img/imageExp.png';
import environment from '../environment';
import ChatBotMailVaultBubble from '../features/chat-bot/ChatBotMailVaultBubble';
import { isBase64 } from '../helper/common';
import moment from 'moment';
import classNames from 'classnames';
import mime from 'mime';
import bytes from 'bytes';

type ChatBubbleProps = {
  message: MessagePayload;
  isLatest: boolean;
  index: number;
  widthNameTruncate?: number;
  totalResults?: number;
  readers: LatestMessageReader[];
  conversation: ConversationPayload;
  onReport: () => void;
  onUnsend: () => void;
  onDelete: () => void;
  onOpenLightbox: (index: number) => void;
};

type BubbleProps = {
  message: MessagePayload;
  isSender?: boolean;
  isLoading?: boolean;
  onOpenLightbox?: (index: number) => void;
  index?: number;
};

// ChatBubble component handles the display of individual chat bubbles,
// including different types of messages like text, image, video, and files.
export default function ChatBubble({
  message,
  isLatest,
  readers,
  conversation,
  onReport,
  onUnsend,
  onDelete,
  widthNameTruncate,
  index,
  totalResults,
  onOpenLightbox,
}: ChatBubbleProps) {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.account);
  const { chatScheme } = useSelector(state => state.message);

  const [isLoading, loadingStart, loadingDone] = useBoolean(true);
  const [isKeeping, keepingStart, keepingDone] = useBoolean(false);
  const [decryptedContent, setDecryptedContent] = useState('');

  const isSender = user?.id === message?.sender.id;
  const sentTime = useMessageDateTime(message.sendedDate).time;

  const bubbleUpdatedAt =
    !message.updatedAt && totalResults === 1
      ? moment(new Date()).format()
      : message.updatedAt;

  const bubbleCreatedAt =
    !message.createdAt && totalResults === 1
      ? moment(new Date()).format()
      : message.createdAt;

  // Effect to handle message decryption and update the state
  useDeepEffect(() => {
    (async () => {
      if (message) {
        loadingStart();

        if (!message.isDecrypted) {
          const _content =
            message.content === '' || message.isUnsent === true
              ? ''
              : await decryptMessage(
                  message.content,
                  message.contentType,
                  chatScheme
                );
          setDecryptedContent(_content);

          const decryptedMessagePayload: MessagePayload = {
            ...message,
            content: _content,
            isDecrypted: true,
          };
          dispatch(updateMessageByIdAction(decryptedMessagePayload));
        } else {
          setDecryptedContent(message.content);
        }
        loadingDone();
      }
    })();
  }, [message]);

  // Function to handle saving (keeping) a message
  const handleKeepMessage = async (messageId: string) => {
    try {
      keepingStart();
      await keepMessageApi(messageId);
      toast.success('Keep content success');
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      keepingDone();
    }
  };

  // Function to display the message readers status (e.g., delivered, read)
  const displayReaders = () => {
    const isShowDelivered = message?.updatedAt && isLatest && isSender;

    if (!readers.length && isShowDelivered) {
      return (
        <div className="text-[11px] text-gray-500 font-[300] absolute -bottom-[20px] right-0 select-none flex items-center gap-1 fade-in">
          Delivered{' '}
          <IoIosSend className="text-[12px] -mt-[3px] text-orange-500" />
        </div>
      );
    }

    return (
      <div className="w-[250px] gap-1 flex justify-end text-[11px] text-gray-500 font-[300] select-none absolute -bottom-[20px] right-0 fade-in">
        <div className="max-w-[120px] flex items-center gap-1">
          {isLatest && readers?.[0]?.displayName && (
            <>
              <span className="truncate max-w-[100px]">
                {conversation?.type === ConversationType.DM
                  ? 'Read'
                  : readers?.[0]?.displayName}
              </span>
              {conversation?.type === ConversationType.DM ? (
                <IoMdCheckmarkCircleOutline className="text-[12px] -mt-[2px] text-orange-500" />
              ) : (
                <>
                  {readers.length === 1 && (
                    <IoMdCheckmarkCircleOutline className="text-[12px] -mt-[2px] text-orange-500" />
                  )}
                </>
              )}
            </>
          )}
        </div>
        {readers.length > 1 && (
          <>
            <Tooltip
              content={`${readers.map(item => item.displayName).join(', ')}`}>
              and {readers.length - 1} people{readers.length - 1 > 1 && 's'}
            </Tooltip>
            {conversation?.type === ConversationType.GROUP && (
              <IoMdCheckmarkCircleOutline className="text-[12px] translate-y-[1.5px] text-orange-500" />
            )}
          </>
        )}
      </div>
    );
  };

  // Function to display the content of the message based on its type (text, image, video, etc.)
  const displayContent = () => {
    if (!message) return <></>;
    const bubbleProps: BubbleProps = {
      message: message,
      isSender,
      isLoading,
      index,
      onOpenLightbox,
    };

    if (!isLoading && !decryptedContent) {
      return <UnsendBubble {...bubbleProps} />;
    }

    switch (message?.contentType) {
      case MessageContentType.NOTIFICATION:
        return <NotificationBubble {...bubbleProps} />;
      case MessageContentType.TEXT:
        return <TextBubble {...bubbleProps} />;
      case MessageContentType.STICKER:
        return <StickerBubble {...bubbleProps} />;
      case MessageContentType.IMAGE:
        return <ImageBubble {...bubbleProps} />;
      case MessageContentType.VIDEO:
        return <VideoBubble {...bubbleProps} />;
      case MessageContentType.FILE:
        return <FileBubble {...bubbleProps} />;
      case MessageContentType.DISPUTED:
        return <DisputeBubble {...bubbleProps} />;
      default:
        <></>;
    }
  };

  // Function to display the dropdown menu for each chat bubble with options like save, download, report, etc.
  const displayDropdownMenu = () => {
    const isExp = message?.content === 'Unsupport Message';
    if (!message) return <></>;
    if (!bubbleCreatedAt || !decryptedContent) return <></>;
    const allowMediaTypes = [
      MessageContentType.IMAGE,
      MessageContentType.VIDEO,
      MessageContentType.FILE,
    ];
    const isSend = bubbleUpdatedAt && isLatest && isSender;

    return (
      <div
        className={
          (isSend ? 'fade-in' : '') +
          ' flex items-center justify-center option-dot-inner-chat'
        }>
        <Dropdown
          label={
            <HiOutlineDotsVertical className="text-[16px] p-0 hover:scale-125 transition" />
          }
          placement="top"
          arrowIcon={false}
          style={{
            border: '0',
            backgroundColor: 'transparent',
            color: '#6b7280',
            zIndex: '2',
            width: '30px',
            overflow: 'hidden',
          }}>
          {!isExp && allowMediaTypes.includes(message?.contentType) && (
            <>
              <Dropdown.Item
                className="!px-3"
                onClick={() => handleKeepMessage(message.id)}
                disabled={isKeeping}>
                <RiSaveFill className="text-[18px] -mt-0.5 me-2" />
                Save to PurrCloud
              </Dropdown.Item>
              <Dropdown.Item
                className="!px-3"
                onClick={() =>
                  downloadFile(decryptedContent, message.optional?.fileName)
                }>
                <MdSaveAlt className="text-[18px] -mt-0.5 me-2" />
                <span className="min-w-[95px] text-center">
                  Save <span className="max-md:hidden">to device</span>
                </span>
              </Dropdown.Item>
            </>
          )}
          {message.senderId !== user?.id && (
            <Dropdown.Item onClick={onReport} className="!text-red-500 !px-3">
              <GoReport className="text-[18px] me-2" />
              Report
            </Dropdown.Item>
          )}
          <Dropdown.Item
            className="text-red-600 !px-3"
            onClick={() => onDelete()}
            disabled={isKeeping}>
            <FaTrashAlt className="text-[16px] -mt-0.5 me-2" />
            Remove
          </Dropdown.Item>
          {isSender && (
            <Dropdown.Item
              className="text-red-600 !px-3"
              onClick={() => onUnsend()}>
              <IoIosRemoveCircle className="text-[18px] -mt-0.5 me-2" />
              Unsend
            </Dropdown.Item>
          )}
        </Dropdown>
      </div>
    );
  };

  // Render the chat bubble for the sender
  if (isSender) {
    const isSend = bubbleUpdatedAt && isLatest && isSender;
    return (
      <div className={(isSend ? 'mb-8' : 'mb-4') + ' flex justify-end gap-2'}>
        <div className="relative flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span
              className={`text-sm font-bold truncate ${widthNameTruncate ? `max-w-[${widthNameTruncate}px]` : ''}`}>
              {message?.sender.displayName}
            </span>
            {bubbleUpdatedAt && (
              <span
                className={
                  (isSend ? 'fade-in' : '') +
                  ' ms-2 text-xs !font-[300] text-[#6B7280]'
                }>
                {sentTime}
              </span>
            )}
          </div>
          <div className="flex break-all">
            {displayDropdownMenu()}
            <div
              className={
                (isSend ? 'fade-in' : index > 0 ? '' : 'opacity-50') +
                ' transition'
              }>
              {displayContent()}
            </div>
          </div>
          {displayReaders()}
        </div>
        <Avatar picture={message?.sender.picture} />
      </div>
    );
  }

  // Render the chat bubble for the receiver
  return (
    <>
      <div className="flex gap-2 mb-4">
        <div className="min-w-[32px]">
          <Avatar picture={message?.sender.picture} />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <span
              className={`text-sm me-1 font-bold ${widthNameTruncate ? `truncate max-w-[${widthNameTruncate}px]` : ''}`}>
              {conversation?.type === ConversationType.DM
                ? conversation?.userNickname || message?.sender.displayName
                : conversation?.participants.find(
                    item => item.userId === message?.senderId
                  )?.userNickname || message?.sender.displayName}
            </span>
            {message?.sender?.email ===
              environment.emailOfficialPurringChat && (
              <img src={OfficialIcon} width={16} alt="Official Icon" />
            )}
            {bubbleUpdatedAt && (
              <span className="ms-2 text-xs !font-[300] text-[#6B7280]">
                {sentTime}
              </span>
            )}
          </div>
          <div className="flex break-all">
            {displayContent()}
            {displayDropdownMenu()}
          </div>
        </div>
      </div>
    </>
  );
}

// Avatar component to display the profile picture of the user who sent the message
function Avatar({ picture }: { picture?: string }) {
  return (
    <img
      src={picture || defaultImages.noProfile}
      className="object-cover w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8 rounded-full"
      alt=""
    />
  );
}

// BubbleWrapper component that wraps around the content of the chat bubble
function BubbleWrapper({
  isSender,
  children,
  className,
  isUnsendBubble,
}: PropsWithChildren<{
  isSender?: boolean;
  className?: string;
  isUnsendBubble?: boolean;
}>) {
  if (!isSender) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #fe7fa4 0%, #fea355 100%)',
          wordBreak: 'break-word',
          whiteSpace: 'break-spaces',
        }}
        className={classNames(
          'rounded-bl-2xl rounded-br-2xl rounded-tr-2xl text-white text-base max-md:text-sm',
          { 'border px-3 py-2': isUnsendBubble },
          { 'px-4 py-3': !isUnsendBubble },
          className
        )}>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        wordBreak: 'break-word',
        whiteSpace: 'break-spaces',
      }}
      className={classNames(
        'bg-white rounded-bl-2xl rounded-br-2xl rounded-tl-2xl text-base max-md:text-sm',
        { 'border px-3 py-2': isUnsendBubble },
        { 'px-4 py-3': !isUnsendBubble },
        className
      )}>
      {children}
    </div>
  );
}

// FileBubble component to display file messages
function FileBubble({ message, isSender }: BubbleProps) {
  let isError = false;
  const { content, optional } = message;

  if (!message.sendedDate && isSender) {
    return (
      <SkeletonBubble
        className="px-4 py-3"
        isSender={isSender}
        message={message}
      />
    );
  }

  const fileIcon = optional?.fileType
    ? getIconByFileType(optional.fileType)
    : '/src/asset/icon/files/file.png';

  if (message?.content === 'Unsupport Message') {
    isError = true;
  }
  if (isError) {
    return (
      <BubbleWrapper isSender={isSender}>
        <div className="gap-4 file-message min-w-[204px] max-md:min-w-[194px] pointer-events-none">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                className="w-[21px] h-[21px] grayscale"
                src={fileIcon}
                alt=""
              />
              <div className="text-sm max-md:text-[11px] font-semibold text-gray-400 w-[120px] max-md:w-[100px] truncate">
                File has expired
              </div>
            </div>
            <div className="leading-[20px]">
              <div className="flex flex-row items-center">
                <div className="text-[11px] max-md:text-[10px] text-[#6B7280] uppercase">
                  {optional?.fileType && mime.extension(optional?.fileType)}
                </div>
                <div className="mx-2 text-gray-500">&#x2022;</div>
                <div className="text-[11px] max-md:text-[10px] text-[#6B7280]">
                  {bytes.format(optional?.fileSize || 0)}
                </div>
              </div>
            </div>
          </div>
          <div className="file-download-icon">
            <IconButton
              color="#9ba3af"
              icon={FaTimesCircle}
              width={20}
              height={20}
            />
          </div>
        </div>
      </BubbleWrapper>
    );
  }

  return (
    <BubbleWrapper isSender={isSender}>
      <div
        className="gap-4 file-message min-w-[204px] max-md:min-w-[194px] cursor-pointer"
        onClick={() => downloadFile(content, optional?.fileName)}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img className="w-[21px] h-[21px]" src={fileIcon} alt="" />
            <div className="text-sm max-md:text-[11px] font-semibold text-gray-900 w-[120px] max-md:w-[100px] truncate">
              {optional?.fileName}
            </div>
          </div>
          <div className="leading-[20px]">
            <div className="flex flex-row items-center">
              <div className="text-[11px] max-md:text-[10px] text-[#6B7280] uppercase">
                {optional?.fileType && mime.extension(optional?.fileType)}
              </div>
              <div className="mx-2 text-gray-500">&#x2022;</div>
              <div className="text-[11px] max-md:text-[10px] text-[#6B7280]">
                {bytes.format(optional?.fileSize || 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="file-download-icon">
          <IconButton
            color="#8a8a8a"
            icon={FaDownload}
            width={20}
            height={20}
          />
        </div>
      </div>
    </BubbleWrapper>
  );
}

// ImageBubble component to display image messages
function ImageBubble({
  message,
  isSender,
  isLoading,
  onOpenLightbox,
  index,
}: BubbleProps) {
  let isError = message.content === 'Unsupport Message';

  if (isLoading || (!message.sendedDate && isSender)) {
    return (
      <SkeletonBubble
        className="px-4 py-3"
        isSender={isSender}
        message={message}
      />
    );
  }

  if (isError) {
    return (
      <BubbleWrapper isSender={isSender}>
        <div className="relative w-full">
          <img
            draggable={false}
            src={imageExp}
            className="object-cover  h-[180px] !rounded-lg"
            alt=""
          />
          <div className="absolute w-full text-sm font-semibold text-center text-white -translate-x-1/2 -translate-y-1/2 bottom-2 left-1/2 drop-shadow-sm">
            Image has expired.
          </div>
        </div>
      </BubbleWrapper>
    );
  }
  return (
    <BubbleWrapper isSender={isSender}>
      <div
        className="w-full cursor-pointer"
        onClick={() => onOpenLightbox && onOpenLightbox(index!)}>
        <img
          src={message?.content}
          className="object-cover  h-[180px] !rounded-lg"
          alt=""
          onError={() => (isError = true)}
        />
      </div>
    </BubbleWrapper>
  );
}

// VideoBubble component to display video messages
function VideoBubble({
  message,
  isSender,
  isLoading,
  onOpenLightbox,
  index,
}: BubbleProps) {
  let isError = false;
  if (isLoading || (!message.sendedDate && isSender)) {
    return (
      <SkeletonBubble
        className="px-4 py-3"
        isSender={isSender}
        message={message}
      />
    );
  }

  let content = message.content;
  if (message.content.includes('/quicktime;')) {
    content = message.content.replace('/quicktime;', '/mp4;');
  }
  if (message?.content === 'Unsupport Message') {
    isError = true;
  }
  if (isError) {
    return (
      <BubbleWrapper isSender={isSender}>
        <div className="relative w-full">
          <img
            src={imageExp}
            draggable={false}
            className="object-cover h-[180px] !rounded-l"
            alt=""
          />
          <div className="absolute w-full text-sm font-semibold text-center text-white -translate-x-1/2 -translate-y-1/2 bottom-2 left-1/2 drop-shadow-sm">
            Video has expired
          </div>
        </div>
      </BubbleWrapper>
    );
  }
  return (
    <BubbleWrapper isSender={isSender}>
      <div
        className="rounded-lg overflow-hidden max-w-[280px] max-h-[200px] cursor-pointer relative"
        onClick={() => onOpenLightbox && onOpenLightbox(index!)}>
        <ReactPlayer
          style={{
            objectFit: 'cover',
          }}
          width="100%"
          height="100%"
          url={content}
          onError={() => (isError = true)}
          controls={false}
        />
        <FaCirclePlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invert text-[40px] opacity-70" />
      </div>
    </BubbleWrapper>
  );
}

// TextBubble component to display text messages
function TextBubble({ message, isSender, isLoading }: BubbleProps) {
  const convertToLinks = ConvertToLinks;
  if (isLoading || (!message.sendedDate && isSender)) {
    return (
      <SkeletonBubble
        className="px-4 py-3"
        isSender={isSender}
        message={message}
      />
    );
  }
  return (
    <BubbleWrapper isSender={isSender}>
      {convertToLinks(message.content)}
    </BubbleWrapper>
  );
}

/**
 * NotificationBubble component to display notification messages
 * Message Content will be send as base64 encoded string
 * @param {BubbleProps} props
 * @returns {JSX.Element}
 */
function NotificationBubble({ message, isSender, isLoading }: BubbleProps) {
  // console.log("message.content", message.content);

  const checkBase64 = isBase64(message.content);
  const data = checkBase64 ? atob(message.content) : message.content;
  let contentNotification = null;

  try {
    contentNotification = JSON.parse(data);
  } catch (error) {
    contentNotification = null;
  }

  const typeNotification = contentNotification?.name;
  if (isLoading || (!message.sendedDate && isSender)) {
    return (
      <SkeletonBubble
        className="px-4 py-3"
        isSender={isSender}
        message={message}
      />
    );
  }
  // will be check type notification for call component this is type;
  switch (typeNotification) {
    case 'notiVerifyMailVault':
      return (
        <BubbleWrapper isSender={isSender}>
          <ChatBotMailVaultBubble
            message={message}
            content={contentNotification}
          />
        </BubbleWrapper>
      );
    default:
      return (
        <BubbleWrapper isSender={isSender}>
          {' '}
          Welcome to Purring Chat
        </BubbleWrapper>
      );
  }
}

// StickerBubble component to display sticker messages
function StickerBubble({ message, isLoading, isSender }: BubbleProps) {
  if (isLoading || !message.sendedDate) {
    return (
      <SkeletonBubble
        className="px-4 py-3"
        isSender={isSender}
        message={message}
      />
    );
  }

  return <img src={message.content} className="w-[150px]" alt="" />;
}

// SkeletonBubble component to display a loading skeleton while the message is being loaded or decrypted
function SkeletonBubble({
  className,
  isSender,
  message,
}: {
  className?: string;
  isSender: boolean | undefined;
  message?: MessagePayload;
}) {
  const fileSkeleton = (type?: MessageContentType) => {
    return (
      <div
        role="status"
        className={
          (type === MessageContentType.FILE ||
          type === MessageContentType.STICKER
            ? 'h-36 w-44 bg-white'
            : 'h-48 w-56 bg-gray-300') +
          ' flex items-center justify-center max-w-sm rounded-lg animate-pulse dark:bg-gray-700'
        }>
        {type === MessageContentType.VIDEO ? (
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20">
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
          </svg>
        ) : type === MessageContentType.IMAGE ? (
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        ) : (
          <Spinner />
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  };
  return (
    <div
      style={{
        background: isSender
          ? '#fff'
          : 'linear-gradient(135deg, #fe7fa4 0%, #fea355 100%)',
      }}
      className={classNames(
        'flex',
        'items-center',
        'justify-center',
        { 'rounded-bl-2xl rounded-tl-2xl rounded-br-2xl': isSender },
        {
          'rounded-br-2xl rounded-tr-2xl rounded-bl-2xl text-white': !isSender,
        },
        className
      )}>
      {message?.contentType === MessageContentType.TEXT ||
      message?.contentType === MessageContentType.NOTIFICATION
        ? message.content
        : fileSkeleton(message?.contentType)}
    </div>
  );
}

// UnsendBubble component to display a message bubble for unsent messages
function UnsendBubble({ isSender }: BubbleProps) {
  return (
    <BubbleWrapper isSender={isSender} isUnsendBubble>
      <p className={(isSender ? 'text-gray-500' : 'text-white') + ' text-xs'}>
        Message was cancelled.
      </p>
    </BubbleWrapper>
  );
}

// DisputeBubble component to display a message bubble for disputed messages
function DisputeBubble({ message, isSender, isLoading }: BubbleProps) {
  if (isLoading || isSender) {
    return (
      <BubbleWrapper isSender={isSender}>
        <div className="bg-gray-100 p-6 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Detail dispute request
            </h2>
            <div className="mb-4">
              <p className="text-gray-600">
                The dispute request was submitted on Mar 30, 2023, at 19:47.
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Topic to Dispute</h3>
              <p>Marketplace</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Title of the dispute</h3>
              <p>I cannot get a refund.</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Description of the Dispute</h3>
              <p>
                I ordered a box of coffee capsules containing 10 capsules.
                However, when I received my order, there were only 7 capsules,
                and one of them was damaged. I requested a refund from the
                seller, but they refused they refused because I had already
                package. Do you think I should be entitled to a refund in this
                case?
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Time of the Incident</h3>
              <p>23 Mar, 2023 (08:47) - 30 Mar, 2023 (19:47)</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="text-gray-600">Evidenced file</h3>
              <img
                src={message?.content}
                alt="Evidenced file"
                className="border rounded-md w-[98px] h-[98px]"
                style={{ border: '2px solid #D1D5DB', borderRadius: '10px' }}
              />
            </div>
          </div>
        </div>
      </BubbleWrapper>
    );
  }
}
