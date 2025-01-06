import { useDispatch, useSelector } from '../../../redux';
import {
  LatestMessageReader,
  MessageContentType,
  MessagePayload,
} from '../../../type/message';
import { defaultImages } from '../../../constant/default-images';
import useMessageDateTime from '../../../helper/hook/useMessageTime';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect';
import { PropsWithChildren, useState } from 'react';
import useBoolean from '../../../helper/hook/useBoolean';
import { decryptMessage } from '../../../helper/crypto';
import { openLightBox } from '../../../redux/lightbox';
// import pdfIcon from '../asset/images/pdf-icon.svg';
import IconButton from '../../../component/icon-button/IconButton';
import { FaCirclePlay, FaDownload } from 'react-icons/fa6';
import bytes from 'bytes';
import { downloadFile } from '../../../helper/file';
import ReactPlayer from 'react-player';
import classNames from 'classnames';
import mime from 'mime';
import {
  ConversationPayload,
  ConversationType,
} from '../../../type/conversation';
import { Spinner, Tooltip } from 'flowbite-react';
// import { HiOutlineDotsVertical } from 'react-icons/hi';
// import { LuCopy } from 'react-icons/lu';
// import { MdSaveAlt } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import { errorFormat } from '../../../helper/error-format';
// import { keepMessageApi } from '../../../rest-api/conversation-message';
// import { RiSaveFill } from 'react-icons/ri';
import {
  // IoIosRemoveCircle,
  IoIosSend,
  IoMdCheckmarkCircleOutline,
} from 'react-icons/io';
// import { FaTrashAlt } from 'react-icons/fa';
import imageExp from '../../../asset/images/empty-img/imageExp.png';
import ConvertToLinks from '../../../helper/useConvertTolinks';
// import { GoReport } from 'react-icons/go';

// iconFiles
import { getIconByFileType } from '../../../constant/icon-files';
import moment from 'moment';
import { updateMessageByIdAction } from '../../../redux/message-dispute';

type ChatBubbleDisputeProps = {
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
};

type BubbleProps = {
  message: MessagePayload;
  isSender?: boolean;
  isLoading?: boolean;
};

export default function ChatBubbleDispute({
  message,
  isLatest,
  readers,
  conversation,
  // onReport,
  // onUnsend,
  // onDelete,
  widthNameTruncate,
  index,
  totalResults,
}: ChatBubbleDisputeProps) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.account);
  const { chatScheme } = useSelector(state => state.messageDispute);
  const [isLoading, loadingStart, loadingDone] = useBoolean(true);
  // const [isKeeping, keepingStart, keepingDone] = useBoolean(false);
  const isSender =
    user?.role === 'ADMIN_PLATFORM' && conversation.Dispute?.length
      ? conversation.Dispute[0].plaintiffId === message?.sender.id
      : user?.id === message?.sender.id;

  const [decryptedContent, setDecryptedContent] = useState('');

  const sentTime = useMessageDateTime(message.sendedDate).time;

  const bubbleUpdatedAt =
    !message.updatedAt && totalResults === 1
      ? moment(new Date()).format()
      : message.updatedAt;

  // const bubbleCreatedAt =
  //   !message.createdAt && totalResults === 1
  //     ? moment(new Date()).format()
  //     : message.createdAt;

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

  // const handleKeepMessage = async (messageId: string) => {
  //   try {
  //     keepingStart();
  //     await keepMessageApi(messageId);
  //     toast.success('Keep content success');
  //   } catch (error) {
  //     toast.error(errorFormat(error).message);
  //   } finally {
  //     keepingDone();
  //   }
  // };

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

  const displayContent = () => {
    if (!message) return <></>;
    const bubbleProps: BubbleProps = {
      message: message,
      isSender,
      isLoading,
    };

    if (!isLoading && !decryptedContent) {
      return <UnsendBubble {...bubbleProps} />;
    }

    switch (message?.contentType) {
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

  // const displayDropdownMenu = () => {
  //   if (!message) return <></>;
  //   if (!bubbleCreatedAt || !decryptedContent) return <></>;
  //   const allowMediaTypes = [
  //     MessageContentType.IMAGE,
  //     MessageContentType.VIDEO,
  //     MessageContentType.FILE,
  //   ];
  //   const isSend = bubbleUpdatedAt && isLatest && isSender;

  //   return (
  //     <div
  //       className={
  //         (isSend ? 'fade-in' : '') +
  //         ' flex items-center justify-center option-dot-inner-chat'
  //       }>
  //       <Dropdown
  //         label={
  //           <HiOutlineDotsVertical className="text-[16px] p-0 hover:scale-125 transition" />
  //         }
  //         placement="top"
  //         arrowIcon={false}
  //         style={{
  //           border: '0',
  //           backgroundColor: 'transparent',
  //           color: '#6b7280',
  //           zIndex: '2',
  //           width: '30px',
  //           overflow: 'hidden',
  //         }}>
  //         {allowMediaTypes.includes(message?.contentType) && (
  //           <>
  //             <Dropdown.Item
  //               className="!px-3"
  //               onClick={() => handleKeepMessage(message.id)}
  //               disabled={isKeeping}>
  //               <RiSaveFill className="text-[18px] -mt-0.5 me-2" />
  //               Keep
  //             </Dropdown.Item>
  //             <Dropdown.Item
  //               className="!px-3"
  //               onClick={() =>
  //                 downloadFile(decryptedContent, message.optional?.fileName)
  //               }>
  //               <MdSaveAlt className="text-[18px] -mt-0.5 me-2" />
  //               Save <span className="ml-1 max-md:hidden">to device</span>
  //             </Dropdown.Item>
  //           </>
  //         )}
  //         {message.senderId !== user?.id && (
  //           <Dropdown.Item onClick={onReport} className="!text-red-500 !px-3">
  //             <GoReport className="text-[18px] me-2" />
  //             Report
  //           </Dropdown.Item>
  //         )}
  //         <Dropdown.Item
  //           className="text-red-600 !px-3"
  //           onClick={() => onDelete()}
  //           disabled={isKeeping}>
  //           <FaTrashAlt className="text-[16px] -mt-0.5 me-2" />
  //           Remove
  //         </Dropdown.Item>
  //         {isSender && (
  //           <Dropdown.Item
  //             className="text-red-600 !px-3"
  //             onClick={() => onUnsend()}>
  //             <IoIosRemoveCircle className="text-[18px] -mt-0.5 me-2" />
  //             Unsend
  //           </Dropdown.Item>
  //         )}
  //       </Dropdown>
  //     </div>
  //   );
  // };

  // if (isLoading && isSender) {
  //   return (
  //     <div className={'mb-4 flex justify-end gap-2'}>
  //       <SkeletonBubble className="w-[100px] h-[40px]" />
  //     </div>
  //   );
  // }

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
            {/* {displayDropdownMenu()} */}

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

  return (
    <>
      <div className="flex gap-2 mb-4">
        <div className="min-w-[32px]">
          <Avatar picture={message?.sender.picture} />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <span
              // className={`text-sm font-bold truncate w-44`}>
              className={`text-sm font-bold ${widthNameTruncate ? `truncate max-w-[${widthNameTruncate}px]` : ''}`}>
              {conversation?.type === ConversationType.DM
                ? conversation?.userNickname || message?.sender.displayName
                : conversation?.participants.find(
                    item => item.userId === message?.senderId
                  )?.userNickname || message?.sender.displayName}
            </span>
            {bubbleUpdatedAt && (
              <span className="ms-2 text-xs !font-[300] text-[#6B7280]">
                {sentTime}
              </span>
            )}
          </div>
          <div className="flex break-all">
            {displayContent()}
            {/* {displayDropdownMenu()} */}
          </div>
        </div>
      </div>
    </>
  );
}

function Avatar({ picture }: { picture?: string }) {
  return (
    <img
      src={picture || defaultImages.noProfile}
      className="object-cover w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8 rounded-full"
      alt=""
    />
  );
}

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
        }}
        className={classNames(
          'text-white rounded-br-2xl rounded-tr-2xl rounded-bl-2xl',
          { 'border px-3 py-2': isUnsendBubble },
          { 'px-4 py-3': !isUnsendBubble },
          className
        )}>
        {/* className="px-4 py-3 text-white rounded-br-2xl rounded-tr-2xl rounded-bl-2xl max-w-[90%]"> */}
        {children}
      </div>
    );
  }
  return (
    <div
      className={classNames(
        'bg-white rounded-bl-2xl rounded-tl-2xl rounded-br-2xl max-md:text-[13px] max-md:leading-[20px] text-sm',
        { 'border px-3 py-2': isUnsendBubble },
        { 'px-4 py-3': !isUnsendBubble },

        className
      )}>
      {children}
    </div>
  );
}

function FileBubble({ message, isSender }: BubbleProps) {
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
              {/* {optional?.pageCount && (
                <>
                  <div className="text-xs text-[#6B7280]">12 Page(s)</div>
                  <div className="mx-2 text-gray-500">&#x2022;</div>
                </>
              )} */}
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

function ImageBubble({ message, isSender, isLoading }: BubbleProps) {
  let isError = message.content === 'Unsupport Message' ? true : false;
  const dispatch = useDispatch();

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
            Image has expired
          </div>
        </div>
      </BubbleWrapper>
    );
  }
  return (
    <BubbleWrapper isSender={isSender}>
      <div
        className="w-full cursor-pointer"
        onClick={() =>
          dispatch(
            openLightBox({
              images: [message?.content],
              imageIndex: 0,
            })
          )
        }>
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

function VideoBubble({ message, isSender, isLoading }: BubbleProps) {
  let isError = false;
  const dispatch = useDispatch();
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
  if (isError) {
    return (
      <BubbleWrapper isSender={isSender}>
        <div className="relative w-full">
          <img
            src={imageExp}
            draggable={false}
            className="object-cover  h-[180px] !rounded-l"
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
        onClick={() =>
          dispatch(
            openLightBox({
              images: [message?.content],
              imageIndex: 0,
            })
          )
        }>
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
// const convertToLinks = (text: string) => {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.split(urlRegex).map((part, index) => {
//     if (urlRegex.test(part)) {
//       return (
//         <a
//           className="cursor-pointer underline text-blue-500 hover:text-blue-700"
//           key={index}
//           href={part}
//           target="_blank"
//           rel="noopener noreferrer">
//           {part}
//         </a>
//       );
//     }
//     return part;
//   });
// };

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
      {message?.contentType === MessageContentType.TEXT
        ? message.content
        : fileSkeleton(message?.contentType)}
    </div>
  );
}

function UnsendBubble({ isSender }: BubbleProps) {
  return (
    <BubbleWrapper isSender={isSender} isUnsendBubble>
      <p className={(isSender ? 'text-gray-500' : 'text-white') + ' text-xs'}>
        Message was cancelled.
      </p>
    </BubbleWrapper>
  );
}

function DisputeBubble({ message, isSender, isLoading }: BubbleProps) {
  if (isLoading || isSender) {
    return (
      // User Dispute
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

      // Admin Dispute
      // <BubbleWrapper isSender={isSender}>
      //   <div className="bg-gray-100 p-6 flex items-center justify-center">
      //     <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
      //       <h2 className="text-xl font-semibold mb-4">
      //         Dispute Resolution Summary
      //       </h2>
      //       <div className="mb-4">
      //         <p className="text-gray-600">
      //           Dispute Resolution Summary from the admin
      //         </p>
      //       </div>
      //       <hr className="mb-4" />
      //       <div className="mb-4">
      //         <h3 className="text-gray-600">Case reference no.</h3>
      //         <p>#820786843</p>
      //       </div>
      //       <hr className="mb-4" />
      //       <div className="mb-4">
      //         <h3 className="text-gray-600">Dispute Date and Time</h3>
      //         <p>Submitted on: 30 Mar, 2024, at 19:47</p>
      //         <p>Resolved on: 3 April, 2024, at 10:35</p>
      //       </div>
      //       <hr className="mb-4" />
      //       <div className="mb-4">
      //         <h3 className="text-gray-600">Result</h3>
      //         <p>
      //           • I would instruct the seller to provide a refund or send a
      //           replacement box of coffee capsules containing the correct number
      //           of undamaged capsules.
      //         </p>
      //       </div>
      //       <hr className="mb-4" />
      //       <div className="mb-4">
      //         <h3 className="text-gray-600">Reason</h3>
      //         <p>
      //           • I would also remind the seller that customer satisfaction and
      //           trust are crucial for their business and that handling such
      //           issues fairly is important.
      //         </p>
      //       </div>
      //       <hr className="mb-4" />
      //       <div className="mb-4">
      //         <h3 className="text-gray-600">Consequences</h3>
      //         <p>
      //           • I would instruct the seller to provide a refund or send a
      //           replacement box of coffee capsules containing the correct number
      //           of undamaged capsules.
      //         </p>
      //       </div>
      //     </div>
      //   </div>
      // </BubbleWrapper>
    );
  }
}
