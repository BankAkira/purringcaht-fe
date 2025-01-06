import { useRef, useState } from 'react';
import { Button } from 'flowbite-react';
import {
  MessageContentType,
  SelectedFile,
  SendMessageBody,
  SendingMessageState,
  Sticker,
} from '../../type/message';
import { EmojiClickData } from 'emoji-picker-react';
import StickerPicker from '../chat-input-toolbar/StickerPicker';
import EmojiPicker from '../chat-input-toolbar/EmojiPicker';
import ImageOrVideoPicker from '../chat-input-toolbar/ImageOrVideoPicker';
import { IoCloseOutline } from 'react-icons/io5';
import { defaultImages } from '../../constant/default-images';
import ReactPlayer from 'react-player';
import { encryptMessage } from '../../helper/crypto';
import FilePicker from '../chat-input-toolbar/FilePicker';
import { BsPaperclip } from 'react-icons/bs';
import { isImage, isVideo } from '../../helper/file';
import moment from 'moment';
import { sendMessageAction } from '../../redux/message';
import { scrollToBottom } from '../../helper/scroll-to';
import { useDispatch, useSelector } from '../../redux';
import { toast } from 'react-toastify';
import { errorFormat } from '../../helper/error-format';
import { IoSend } from 'react-icons/io5';
import useResponsive from '../../helper/hook/useResponsive';
import useBoolean from '../../helper/hook/useBoolean';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';
import {
  resetUnreadCountByIdAction,
  setIsFetchFirebase,
} from '../../redux/conversation';
import { readAllMessageApi } from '../../rest-api/conversation-message';
import { ConversationMenuTab } from '../../type/conversation';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import tab_sound from '../../asset/sound/tap-notification.mp3';

export default function ChatInput() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState('');
  const [fileMessage, setFileMessage] = useState<SelectedFile | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { isTabletOrMobile } = useResponsive();
  const [isLoading, trueLoading, falseLoading] = useBoolean(false);
  const { results, isFetchFirebase } = useSelector(state => state.conversation);
  const { conversation, chatScheme } = useSelector(state => state.message);

  useDeepEffect(() => {
    if (results[0]?.id === conversation?.id) {
      dispatch(setIsFetchFirebase(false));
    }
  }, [results, conversation, isFetchFirebase]);

  const handleSendMessage = async () => {
    try {
      textMessage.trim() !== '' && trueLoading();
      if (
        textMessage &&
        textMessage.trim() !== '' &&
        !isLoading &&
        !isFetchFirebase
      ) {
        dispatch(setIsFetchFirebase(true));
        const payload: SendingMessageState = {
          content: await encryptMessage(
            textMessage,
            MessageContentType.TEXT,
            chatScheme
          ),
          contentType: MessageContentType.TEXT,
        };

        setTextMessage('');
        await sendMessage(payload);
      }
      if (fileMessage && !isLoading && !isFetchFirebase) {
        dispatch(setIsFetchFirebase(true));
        const contentType = isImage(fileMessage.file)
          ? MessageContentType.IMAGE
          : isVideo(fileMessage.file)
            ? MessageContentType.VIDEO
            : MessageContentType.FILE;

        const payload: SendingMessageState = {
          content: await encryptMessage(
            fileMessage.file,
            contentType,
            chatScheme
          ),
          contentType,
          optional: fileMessage.optional,
        };
        setFileMessage(null);
        await sendMessage(payload);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    }
  };
  const onTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && !e.shiftKey && !isLoading && !isFetchFirebase) {
      e.preventDefault();
      return handleSendMessage();
    }
  };

  const onImageOrVideoOrFileClick = async (file: SelectedFile) => {
    await handleReadAll();
    setFileMessage(file);
    scrollToBottom('chat-feed-container');
  };

  const handleCancelImageOrVideoOrFile = () => {
    setFileMessage(null);
  };

  const onStickerClick = async (sticker: Sticker) => {
    await handleReadAll();
    const payload: SendingMessageState = {
      content: await encryptMessage(
        sticker.image,
        MessageContentType.STICKER,
        chatScheme
      ),
      contentType: MessageContentType.STICKER,
      optional: {
        stickerInfo: sticker,
      },
    };
    await sendMessage(payload);
  };

  const onEmojiClick = async (emojiData: EmojiClickData) => {
    await handleReadAll();
    setTextMessage(prev => `${prev}${emojiData.emoji}`);
    textAreaRef.current && textAreaRef.current.focus();
  };

  const playSound = debounce(async () => {
    const audio = new Audio(tab_sound);
    await audio.play();
  }, 400);

  const sendMessage = async (message: SendingMessageState) => {
    setTimeout(() => scrollToBottom('chat-feed-container'), 50);

    const sendingMessage: SendMessageBody = {
      ...message,
      sendedDateTime: moment().valueOf(),
    };
    await dispatch(sendMessageAction(sendingMessage))
      .then(async () => {
        await playSound();
        setTimeout(() => {
          textAreaRef.current && textAreaRef.current.focus();
        }, 1);
        setTimeout(() => scrollToBottom('chat-feed-container'), 500);
      })
      .catch(error => {
        if (errorFormat(error).message === 'CONVERSATION_NOT_FOUND') {
          navigate(`/chat/${ConversationMenuTab.GROUP}`);
        }
      })
      .finally(() => {
        falseLoading();
      });
  };

  const handleReadAll = async () => {
    if (conversation) {
      await readAllMessageApi(conversation?.id);
      dispatch(resetUnreadCountByIdAction(conversation?.id));
    }
  };

  const DisplayFileThumbnail = () => {
    if (fileMessage) {
      const { file, optional } = fileMessage;

      return (
        <>
          <div className="relative p-3 w-fit">
            {isImage(file) ? (
              <>
                <img
                  className="h-[56px] border-2"
                  src={URL.createObjectURL(file)}
                  alt=""
                  onError={e => {
                    e.currentTarget.src = defaultImages.errorImage;
                  }}
                />
              </>
            ) : isVideo(file) ? (
              <>
                <ReactPlayer
                  url={URL.createObjectURL(file)}
                  width="70px"
                  height="50px"
                  controls={false}
                />
              </>
            ) : (
              <>
                <div className="w-[56px] h-[56px] border flex flex-col items-center">
                  <BsPaperclip className="flex-1 text-2xl text-gray-500 cursor-pointer" />
                  <small className="text-[10px] max-w-full px-1 truncate text-center text-gray-400 min-h-[18px]">
                    {optional.fileName}
                  </small>
                </div>
              </>
            )}

            <div className="items-center flex justify-center absolute h-[20px] w-[20px] right-[5px] top-[10px] z-1">
              <span
                className="cursor-pointer p-0.5 bg-white border border-gray-200 hover:border-red-300 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-700"
                onClick={handleCancelImageOrVideoOrFile}>
                <IoCloseOutline style={{ fontSize: 24 }} />
              </span>
            </div>
          </div>
        </>
      );
    }

    return <></>;
  };

  return (
    <div className="bg-white border-t ">
      <textarea
        onFocus={() =>
          (async () => {
            await handleReadAll();
            setTimeout(() => scrollToBottom('chat-feed-container'), 500);
          })()
        }
        ref={textAreaRef}
        id="editor"
        rows={fileMessage ? 1 : 5}
        className="px-3 mt-3 block w-full text-sm text-gray-800 !bg-white border-0 focus:ring-0 resize-none max-lg:max-h-[50px] max-lg:mt-2"
        placeholder="Write a message..."
        value={textMessage}
        onChange={e => setTextMessage(e.target.value)}
        onKeyDown={onTextAreaKeyDown}
      />
      {DisplayFileThumbnail()}
      <div className="flex items-center justify-between p-3 border-t max-lg:px-3 max-lg:pt-1 max-lg:pb-3">
        <div className="flex gap-4 max-lg:gap-6">
          <FilePicker onFileClick={onImageOrVideoOrFileClick} />
          <ImageOrVideoPicker onImageOrVideoClick={onImageOrVideoOrFileClick} />
          <EmojiPicker onEmojiClick={onEmojiClick} />
          <StickerPicker onStickerClick={onStickerClick} />
        </div>
        <Button
          color={isTabletOrMobile ? 'gray' : undefined}
          size="sm"
          pill
          disabled={isLoading}
          className={
            (isTabletOrMobile ? '' : 'hover:opacity-70') +
            ' ms-auto bg-gradient-to-br from-pink-500 to-orange-400 !border-0 min-w-0 lg:min-w-[124px] h-[34px] max-lg:max-h-[28px] max-lg:bg-none max-lg:bg-transparent transition bg-white text-white'
          }
          onClick={() => handleSendMessage()}>
          <span className="hidden lg:block fade-in">Send message</span>
          <IoSend className="block lg:hidden text-[#F05252] text-[20px] translate-x-[2px] fade-in" />
        </Button>
      </div>
    </div>
  );
}
