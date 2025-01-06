// import (Internal imports)
import { ChangeEvent, useEffect, useRef, useState } from 'react';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// react-router-dom
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// react-icons
import { AiOutlineClose } from 'react-icons/ai';
import { BsPaperclip } from 'react-icons/bs';
import { CiCircleChevLeft, CiCircleChevRight } from 'react-icons/ci';
import { FaReply, FaStar } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { MdArrowBackIos } from 'react-icons/md';
import { PiTagChevronFill, PiWarningOctagonFill } from 'react-icons/pi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowRedoSharp, IoBookmark, IoPaw } from 'react-icons/io5';

// flowbite-react
import { Button, FileInput, Label, Modal, Spinner } from 'flowbite-react';

import classNames from 'classnames';
import styled from 'styled-components';

// helper functions
import {
  decryptMessage,
  encryptMessage,
  fileToBase64,
} from '../../../../helper/crypto';
import { Logger } from '../../../../helper/logger';
import useResponsive from '../../../../helper/hook/useResponsive';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect';
import { getFileOptional, getPdfPageCount } from '../../../../helper/file';
import { CryptoAES256 } from '../../../../helper/rsa-crypto';

// redux
import { useSelector, useDispatch } from '../../../../redux';
import { setMailMessages } from '../../../../redux/purr-mail';

// types
import {
  FileMail,
  MailConversation,
  MailConversationMessage,
  MessageContentType,
  ReplyMailPayload,
  SelectedFileMail,
} from '../../../../type';

// component/@share
import QuillEditor from '../../../../component/@share/QuillEditor';

// components
import MessageListItem from '../../components/MessageListItem';

// APIs
import {
  delMailApi,
  getConversationMailBoxByMailConversationId,
  getConversationMails,
  markMailAsRead,
  moveMailToRecycleBin,
  replyMailConversation,
  updateStarredAndImportantStatus,
} from '../../../../rest-api/purr-mail';

const log = new Logger('MailBox');

interface DecryptedMessage extends MailConversationMessage {
  decryptedContent: string;
}

export default function MailBox() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { conversationMailId } = useParams();
  const { isTabletOrMobile } = useResponsive();

  const mailStatus = location.state?.status || 'inbox';
  const validPaths = ['inbox', 'send', 'trash'];

  const { user, userScheme } = useSelector(state => state.account);
  const { conversationMail, mailMessages, mailScheme } = useSelector(
    state => state.purrMail
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [filesMail, setFilesMail] = useState<SelectedFileMail[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [decryptedMessages, setDecryptedMessages] = useState<
    DecryptedMessage[]
  >([]);

  const [userRecipients, setUserRecipients] = useState<string>('');
  const [encryptMailSecret, setEncryptMailSecret] = useState<string>('');

  const [resMailList, setResMailList] = useState<MailConversation[]>([]);

  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Fetch mail box data
  const fetchMailBox = async (
    mailConversationId: string,
    limit?: number
  ): Promise<{ messages: MailConversationMessage[]; totalResults: number }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await getConversationMailBoxByMailConversationId({
        mailConversationId,
        page: 1,
        limit: limit || 10,
      });
      console.log('response.results', response.results);

      setTotalResults(response.totalResults);
      dispatch(setMailMessages(response.results));
      return {
        messages: response.results,
        totalResults: response.totalResults,
      };
    } catch (error) {
      log.error('Error fetching mail:', error);
      return { messages: [], totalResults: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch more messages
  const fetchMoreMessages = async (page: number) => {
    try {
      const response = await getConversationMailBoxByMailConversationId({
        mailConversationId: conversationMailId!,
        page,
        limit: 10,
      });

      if (response.results.length === 0) {
        setHasMore(false);
      } else {
        dispatch(setMailMessages([...mailMessages, ...response.results]));
        setDecryptedMessages(prevMessages => [
          ...prevMessages,
          ...response.results.map(message => ({
            ...message,
            decryptedContent: message.content,
          })),
        ]);
      }
    } catch (error) {
      log.error('Error fetching more messages:', error);
    }
  };

  // Load more data
  const loadMoreData = () => {
    if (hasMore && !isLoading) {
      setPage(prevPage => prevPage + 1);
      fetchMoreMessages(page + 1);
    }
  };

  // Check for new messages based on totalResults
  const checkForNewMessages = async () => {
    try {
      const response = await getConversationMailBoxByMailConversationId({
        mailConversationId: conversationMailId!,
        page: 1,
        limit: totalResults, // Request all results to check if new messages exist
      });

      // If the totalResults has increased, calculate the difference
      if (response.totalResults > totalResults) {
        const newMessagesCount = response.totalResults - totalResults;
        const limit = Math.min(newMessagesCount + 10, totalResults); // Limit to newMessagesCount + 10

        const newMessagesResponse =
          await getConversationMailBoxByMailConversationId({
            mailConversationId: conversationMailId!,
            page: 1,
            limit: limit, // Fetch new messages with the calculated limit
          });

        const newMessages = newMessagesResponse.results.filter(
          message =>
            !mailMessages.some(
              existingMessage => existingMessage.id === message.id
            )
        );

        if (newMessages.length > 0) {
          setDecryptedMessages(prevMessages => [
            ...newMessages.map(message => ({
              ...message,
              decryptedContent: message.content,
            })),
            ...prevMessages,
          ]);

          // Update Redux state with new messages
          dispatch(setMailMessages([...newMessages, ...mailMessages]));
          setTotalResults(response.totalResults); // Update total results
        }
      }
    } catch (error) {
      log.error('Error checking for new messages:', error);
    }
  };

  // Clean up messages and abort ongoing requests
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMailBox = async () => {
      try {
        const response = await getConversationMailBoxByMailConversationId({
          mailConversationId: conversationMailId,
          page: 1,
          limit: 10,
        });
        if (!signal.aborted) {
          dispatch(setMailMessages(response.results));
        }
      } catch (error) {
        if (signal.aborted) {
          log.info('Fetch aborted');
        } else {
          log.error('Error fetching mailbox', error);
        }
      }
    };

    if (conversationMailId) {
      fetchMailBox();
    }

    return () => {
      dispatch(setMailMessages([])); // Clear messages on unmount
      setDecryptedMessages([]); // Clear decrypted messages on unmount
      controller.abort(); // Cancel any pending API requests
    };
  }, [conversationMailId]);

  // Use interval to check for new messages
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkForNewMessages();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [totalResults, mailMessages]);

  const handleMarkMailAsRead = async (conversationMailId: string) => {
    if (conversationMailId) {
      try {
        await markMailAsRead(conversationMailId);
      } catch (error) {
        log.error('Failed to mark mail as read:', error);
      }
    }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentStatus = pathSegments[2];

    if (currentStatus !== mailStatus) {
      if (!validPaths.includes(currentStatus)) {
        navigate('/purr-mail/inbox');
      } else {
        navigate('/purr-mail/inbox');
      }
    }
  }, [location, navigate, mailStatus]);

  useDeepEffect(() => {
    if (conversationMailId) {
      fetchMailBox(conversationMailId).then(response => {
        setTotalResults(response.totalResults);
        dispatch(setMailMessages(response.messages));
      });
    }
  }, [conversationMailId]);

  // Decrypt messages when mailMessages changes
  useDeepEffect(() => {
    const decryptMessages = async () => {
      const decrypted = await Promise.all(
        mailMessages.map(async message => {
          const decryptedContent = await decryptMail(message.content);
          return { ...message, decryptedContent };
        })
      );
      console.log('decrypted', decrypted);

      setDecryptedMessages(decrypted);
    };

    decryptMessages();
  }, [mailMessages]);

  useDeepEffect(() => {
    if (conversationMail?.participant) {
      const senderId =
        conversationMail?.mailConversationMessage[0]?.senderUserId || '';

      const mapUserPatient = conversationMail.participant
        .filter(e => e.userId !== user?.id)
        .map(e => e.user.email);

      if (mapUserPatient.length > 0) {
        setUserRecipients(mapUserPatient.join(', '));
      } else {
        setUserRecipients(user?.email || '');
      }

      if (user?.id === senderId) {
        setEncryptMailSecret(
          conversationMail.encryptedMailSecrets[0]?.senderEncryptedMailSecret ||
            ''
        );
      } else {
        const recipientSecret =
          conversationMail.encryptedMailSecrets[0]?.peerEncryptedMailSecret.find(
            e => e.userId === user?.id
          )?.peerEncryptedMailSecret || '';
        setEncryptMailSecret(recipientSecret);
      }
    }
    // log.debug('conversationMail', conversationMail);
  }, [conversationMail]);

  // Reset pagination when coming back to the page
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
  }, []);

  const decryptMail = async (content: string) => {
    console.log('mailScheme', mailScheme);

    return await decryptMessage(content, MessageContentType.TEXT, mailScheme);
  };
  // Encrypt message and files
  const encryptContentAndFiles = async (
    content: string,
    filesMail: SelectedFileMail[],
    mailScheme: CryptoAES256
  ) => {
    const encryptedContent = await encryptMessage(
      content,
      MessageContentType.TEXT,
      mailScheme
    );

    const encryptedFiles = await Promise.all(
      filesMail.map(async file =>
        encryptMessage(file.base64, MessageContentType.TEXT, mailScheme)
      )
    );

    return { encryptedContent, encryptedFiles };
  };

  // Handle sending the reply
  const handleSendReply = async () => {
    setIsSending(true);

    try {
      // Encrypt the content using mailScheme
      const encryptedChatSecret = Buffer.from(
        encryptMailSecret.slice(2),
        'hex'
      );
      const mailSecret = userScheme!.decrypt(encryptedChatSecret);
      const mailScheme = new CryptoAES256(mailSecret);

      const { encryptedContent, encryptedFiles } = await encryptContentAndFiles(
        editorContent,
        filesMail,
        mailScheme
      );

      // Create the payload
      const payload: ReplyMailPayload = {
        content: encryptedContent,
        files: filesMail.map((f, i) => ({
          base64: encryptedFiles[i],
          optional: f.optional,
        })),
        transactionHash: '',
      };

      log.debug('Reply payload', payload);
      const res = await replyMailConversation(conversationMailId!, payload);
      log.debug('Reply sent successfully', res);

      // Fetch new messages and filter duplicates
      const newMessagesResponse = await fetchMailBox(conversationMailId!);
      updateMessageState(newMessagesResponse.messages); // Access only the messages

      // Clear the Quill editor content and files
      resetEditor();

      await handleMarkMailAsRead(conversationMailId!);
    } catch (error) {
      log.error('Failed to send reply:', error);
    } finally {
      setIsSending(false);
      setShowEditor(false);
      scrollToBottom();
    }
  };

  // Update the message state
  const updateMessageState = (newMessages: MailConversationMessage[]) => {
    if (newMessages.length > 0) {
      const filteredMessages = newMessages.filter(
        newMessage =>
          Array.isArray(mailMessages) &&
          !mailMessages.some(
            existingMessage => existingMessage.id === newMessage.id
          )
      );

      setDecryptedMessages((prevMessages: DecryptedMessage[]) => [
        {
          id: 'new-id',
          updatedAt: new Date().toISOString(),
          senderUserId: user!.id || 'default-user-id',
          mailConversationId: conversationMailId || 'default-conversation-id',
          decryptedContent: editorContent,
          senderUser: user!,
          createdAt: new Date().toISOString(),
          files: filesMail as unknown as FileMail[],
        } as DecryptedMessage,
        ...filteredMessages.map((message: MailConversationMessage) => ({
          ...message,
          decryptedContent: message.content,
        })),
        ...prevMessages,
      ]);

      // Update Redux state
      dispatch(setMailMessages([...filteredMessages, ...mailMessages]));
    }
  };

  // Reset the editor
  const resetEditor = () => {
    setEditorContent(''); // Clear the editor content
    setFilesMail([]); // Clear attached files
  };

  const openReply = () => {
    setShowEditor(true);
    scrollToBottom();
  };

  // <-- Delete Mail And Move Mail To RecycleBin --> //
  const handleDeleteMail = async () => {
    if (conversationMailId) {
      try {
        await delMailApi(conversationMailId);
        log.debug(`Permanently deleted mail with id: ${conversationMailId}`);

        navigate(`/purr-mail/${mailStatus}`);
      } catch (error) {
        log.error('Failed to delete mail permanently:', error);
      }
    }
  };

  const handleMoveMailToRecycleBin = async () => {
    try {
      if (conversationMailId) {
        await moveMailToRecycleBin(conversationMailId);
        log.debug(`Moved mail to recycle bin with id: ${conversationMailId}`);

        navigate(`/purr-mail/${mailStatus}`);
      }
    } catch (error) {
      log.error('Failed to move mail to recycle bin:', error);
    }
  };

  const handleDeleteClick = () => {
    if (mailStatus === 'trash') {
      handleDeleteMail();
    } else {
      handleMoveMailToRecycleBin();
    }
  };
  // <-- END Delete Mail And Move Mail To RecycleBin --> //

  useDeepEffect(() => {
    const storedMailList = localStorage.getItem('mailList');

    if (storedMailList) {
      const { isDeleted, isOwner, totalResults } = JSON.parse(storedMailList);

      if (totalResults && isDeleted !== undefined && isOwner !== undefined) {
        const fetchMailList = async () => {
          try {
            const resMailList = await getConversationMails({
              page: 1,
              limit: totalResults,
              orderBy: 'updatedAt:desc',
              status: 'COMPLETED',
              isDeleted: isDeleted,
              isOwner: isOwner,
            });

            setResMailList(resMailList.results);

            const currentMail = resMailList.results.find(
              mail => mail.id === conversationMailId
            );

            if (currentMail) {
              setIsStarred(currentMail.isStarred);
              setIsImportant(currentMail.isImportant);
            }
          } catch (error) {
            log.error('Error fetching mail list:', error);
          }
        };

        fetchMailList();
      }
    }
  }, [conversationMailId]);

  const getConversationIndex = (conversationMailId: string) => {
    const index = resMailList.findIndex(mail => mail.id === conversationMailId);
    return index !== -1 ? index + 1 : 0;
  };

  const handleNextMail = () => {
    setIsLoading(true);
    const currentIndex = resMailList.findIndex(
      mail => mail.id === conversationMailId
    );
    if (currentIndex !== -1 && currentIndex < resMailList.length - 1) {
      const nextMailId = resMailList[currentIndex + 1].id;
      navigate(`/purr-mail/${mailStatus}/${nextMailId}`, {
        state: { status: mailStatus },
      });
    }
  };

  const handlePrevMail = () => {
    setIsLoading(true);
    const currentIndex = resMailList.findIndex(
      mail => mail.id === conversationMailId
    );
    if (currentIndex > 0) {
      const prevMailId = resMailList[currentIndex - 1].id;
      navigate(`/purr-mail/${mailStatus}/${prevMailId}`, {
        state: { status: mailStatus },
      });
    }
  };

  // Update isStarred or isImportant status directly
  const handleStarredAndImportantStatusClick = async (
    statusKey: 'isStarred' | 'isImportant'
  ) => {
    try {
      const newStatus = statusKey === 'isStarred' ? !isStarred : !isImportant;

      // Update mail status via API
      await updateStarredAndImportantStatus(conversationMailId!, {
        [statusKey]: newStatus,
      });

      // Update local state after successful update
      if (statusKey === 'isStarred') {
        setIsStarred(newStatus);
      } else {
        setIsImportant(newStatus);
      }
    } catch (error) {
      log.error(`Failed to update ${statusKey} status:`, error);
    }
  };

  // <-- Upload File --> //
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      const filesArray = Array.from(files);
      const filesMap = filesArray.map(async (item: File) => {
        const count = await getPdfPageCount(item);

        const fileInfo: SelectedFileMail = {
          base64: (await fileToBase64(item)).toString(),
          optional: { ...getFileOptional(item), pageCount: count },
        };
        return fileInfo;
      });

      const resolvedFiles = await Promise.all(filesMap);

      setFilesMail((prevFiles: SelectedFileMail[]) => [
        ...prevFiles,
        ...resolvedFiles,
      ]);
    }
  };

  const handleRemoveFile = (index: number) =>
    setFilesMail(prevFiles => prevFiles.filter((_, i) => i !== index));

  const renderFileList = (
    filesMail: SelectedFileMail[],
    handleRemoveFile: (index: number) => void
  ) => {
    return (
      <div
        className={classNames('overflow-y-auto', {
          'max-h-48 my-2': isTabletOrMobile,
          'max-h-80 border-x border-[#ccc] px-2': !isTabletOrMobile,
        })}>
        <ul>
          {filesMail.map((file, index) => (
            <li
              key={index}
              className="flex justify-between w-1/2 items-center bg-gray-100 rounded-xl p-2 mb-2">
              <div className="grid grid-cols-[1fr_max-content] items-center justify-between gap-2 w-full">
                <p className="text-blue-600 font-medium text-ellipsis whitespace-nowrap overflow-hidden">
                  {file.optional.fileName}
                </p>
                <span className="text-sm text-gray-600">
                  ({((file?.optional?.fileSize || 0) / 1024).toFixed(1)} K)
                </span>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="ml-2 text-gray-500 hover:text-red-500">
                <RiDeleteBin6Line size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  // <-- End Upload File --> //

  const handleBackClick = () => {
    navigate(-1);
  };
  console.log('mailMessages', mailMessages);
  console.log('decryptedMessages', decryptedMessages);

  return (
    <section>
      {/* Header */}
      <button
        className="flex items-center justify-center gap-2 min-w-16 h-8 p-5 text-[#212B36] text-lg font-bold"
        onClick={handleBackClick}>
        <MdArrowBackIos size={20} />
        Back
      </button>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 h-[72px] p-4 border-b border-[#919EAB33]">
        {/* Select All Checkbox and Refresh */}
        <div className="flex items-center gap-4 cursor-pointer">
          {/* Icon Group */}
          <button className="text-gray-500 hover:text-yellow-400">
            <FaStar
              size={20}
              className={isStarred ? 'text-yellow-400' : 'text-gray-500'}
              onClick={() => handleStarredAndImportantStatusClick('isStarred')}
            />
          </button>
          <button className="text-gray-500 hover:text-yellow-400">
            <PiTagChevronFill
              size={20}
              className={isImportant ? 'text-yellow-400' : 'text-gray-500'}
              onClick={() =>
                handleStarredAndImportantStatusClick('isImportant')
              }
            />
          </button>
          <div className="border-r-2 border-[#D1D5DB] h-8 mx-2"></div>
          {/* Vertical Divider */}
          <button className="text-gray-500 hover:text-rose-500">
            <IoPaw size={20} />
          </button>
          <button className="text-gray-500 hover:text-rose-500">
            <IoBookmark size={20} />
          </button>
          <button className="text-gray-500 hover:text-rose-500">
            <IoArrowRedoSharp size={20} />
          </button>
          <button className="text-gray-500 hover:text-rose-500">
            <PiWarningOctagonFill size={20} />
          </button>
          <button
            className="text-gray-500 hover:text-rose-500"
            onClick={handleDeleteClick}>
            <ImBin size={20} />
          </button>
        </div>

        {!isTabletOrMobile ? (
          <>
            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2">
              <p className="text-[#919EAB] text-right text-xs font-normal">
                {getConversationIndex(conversationMailId!)} of{' '}
                {resMailList.length}
              </p>
              <button
                className={`text-rose-500 hover:text-rose-600 ${
                  (resMailList.findIndex(
                    mail => mail.id === conversationMailId
                  ) === 0 ||
                    isLoading) &&
                  '!text-gray-400 cursor-not-allowed'
                }`}
                onClick={handlePrevMail}
                disabled={
                  resMailList.findIndex(
                    mail => mail.id === conversationMailId
                  ) === 0 || isLoading
                }>
                <CiCircleChevLeft size={22} />
              </button>
              <button
                className={`text-rose-500 hover:text-rose-600 ${
                  (resMailList.findIndex(
                    mail => mail.id === conversationMailId
                  ) ===
                    resMailList.length - 1 ||
                    isLoading) &&
                  '!text-gray-400 cursor-not-allowed'
                }`}
                onClick={handleNextMail}
                disabled={
                  resMailList.findIndex(
                    mail => mail.id === conversationMailId
                  ) ===
                    resMailList.length - 1 || isLoading
                }>
                <CiCircleChevRight size={22} />
              </button>
            </div>
          </>
        ) : null}
      </div>

      <CustomMessageListStyle>
        <div className="flex justify-between items-center p-4">
          <div className="inline-flex items-center flex-wrap max-w-full">
            <p className="text-gray-800 text-lg font-semibold truncate mr-1">
              Subject: {conversationMail?.mailConversationMessage[0]?.subject}
            </p>
            <span className="text-xs font-medium rounded-full bg-gray-100 text-gray-500 px-3 py-1">
              {(() => {
                const pathSegments = location.pathname.split('/');
                const currentStatus = pathSegments[2];
                switch (currentStatus) {
                  case 'inbox':
                    return 'Inbox';
                  case 'send':
                    return 'Send';
                  case 'trash':
                    return 'Trash';
                  default:
                    return 'Unknown';
                }
              })()}
            </span>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-500`}>
            {conversationMail?.type === 'VAULT' ? 'MailVault' : 'Mail'}
          </span>
        </div>
        <div
          className={classNames('size-full', {
            'configure-screen-mobile': isTabletOrMobile,
            'configure-screen-desktop': !isTabletOrMobile,
            'flex flex-col-reverse': decryptedMessages.length > 5,
          })}
          id="mailbox-container">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner color="pink" aria-label="Center-aligned spinner" />
            </div>
          ) : (
            <>
              <div ref={messagesEndRef} />
              {/* message List */}
              <InfiniteScroll
                className="flex flex-col-reverse !overflow-visible"
                dataLength={decryptedMessages.length}
                next={loadMoreData}
                hasMore={hasMore}
                scrollableTarget="mailbox-container"
                inverse={true}
                loader={<></>}>
                <>
                  {decryptedMessages.map((message, index) => (
                    <div
                      key={index}
                      className="border-b border-dashed border-gray-200">
                      <MessageListItem
                        avatarUrl={message.senderUser?.picture}
                        senderName={message?.senderUser?.displayName}
                        senderEmail={message?.senderUser?.email}
                        recipientEmail={
                          message.senderUserId !== user?.id
                            ? user?.email
                            : userRecipients
                        }
                        timestamp={message.createdAt}
                        content={message.decryptedContent}
                        files={message.files}
                        isExpanded={
                          index === 0 || index === decryptedMessages.length - 1
                        }
                      />

                      {index === 0 && (
                        <>
                          {!showEditor && (
                            <div className="p-4">
                              <Button
                                size="sm"
                                className="min-w-28 text-center bg-pink-orange rounded-xl hover:opacity-70"
                                onClick={() => {
                                  openReply();
                                }}>
                                <FaReply className="mr-2 h-4 w-4" />
                                Reply
                              </Button>
                            </div>
                          )}

                          {showEditor && (
                            <div className="p-4">
                              {isTabletOrMobile ? (
                                <CustomModalStyle
                                  show={showEditor}
                                  onClose={() => setShowEditor(false)}
                                  size="full"
                                  className="fixed inset-0 z-50 rounded-xl">
                                  <Modal.Header className="modal-header bg-pink-orange text-white rounded-xl py-3">
                                    <div className="flex justify-between items-center">
                                      <h2 className="text-white text-lg font-bold">
                                        Reply
                                      </h2>
                                      <Button
                                        size="xs"
                                        onClick={() => setShowEditor(false)}
                                        className="w-8 h-8 p-2 bg-white text-black rounded-xl hover:bg-gray-100 hover:opacity-85">
                                        <AiOutlineClose size={20} />
                                      </Button>
                                    </div>
                                  </Modal.Header>
                                  <Modal.Body className="modal-body flex-1 overflow-y-auto p-4">
                                    <CustomQuillEditorStyle>
                                      <QuillEditor
                                        value={editorContent}
                                        onChange={setEditorContent}
                                      />
                                    </CustomQuillEditorStyle>

                                    {renderFileList(
                                      filesMail,
                                      handleRemoveFile
                                    )}
                                  </Modal.Body>
                                  <Modal.Footer className="modal-footer flex items-center justify-between border-0 rounded-b-xl">
                                    <Label className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 hover:opacity-85">
                                      <BsPaperclip size={22} />
                                      <FileInput
                                        multiple
                                        accept="*/*"
                                        id="mail-image"
                                        className="hidden"
                                        onChange={handleFileChange}
                                      />
                                    </Label>
                                    <Button
                                      size="sm"
                                      className="min-w-28 bg-pink-orange shadow-lg hover:opacity-70"
                                      onClick={handleSendReply}>
                                      {isSending ? (
                                        <Spinner size="sm" />
                                      ) : (
                                        'Send'
                                      )}
                                    </Button>
                                  </Modal.Footer>
                                </CustomModalStyle>
                              ) : (
                                <div className="relative pt-5 group">
                                  <Button
                                    size="xs"
                                    onClick={() => setShowEditor(false)}
                                    className="absolute w-8 h-8 top-[26px] right-[6px] p-2 bg-pink-orange group-hover:shadow-lg">
                                    <AiOutlineClose size={20} />
                                  </Button>
                                  <CustomQuillEditorStyle className="group-hover:shadow-lg group-hover:rounded-xl">
                                    <QuillEditor
                                      value={editorContent}
                                      onChange={setEditorContent}
                                    />

                                    {renderFileList(
                                      filesMail,
                                      handleRemoveFile
                                    )}

                                    <div className="flex items-center justify-between border-x border-b border-[#ccc] rounded-b-xl p-2">
                                      <Label className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 hover:opacity-85">
                                        <BsPaperclip size={22} />
                                        <FileInput
                                          multiple
                                          accept="*/*"
                                          id="mail-image"
                                          className="hidden"
                                          onChange={handleFileChange}
                                        />
                                      </Label>
                                      <Button
                                        size="sm"
                                        className="min-w-28 bg-pink-orange group-hover:shadow-lg"
                                        onClick={handleSendReply}>
                                        {isSending ? (
                                          <Spinner size="sm" />
                                        ) : (
                                          'Send'
                                        )}
                                      </Button>
                                    </div>
                                  </CustomQuillEditorStyle>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </>
              </InfiniteScroll>
            </>
          )}
        </div>
      </CustomMessageListStyle>
    </section>
  );
}

const CustomMessageListStyle = styled.div`
  .configure-screen-desktop {
    height: calc(100vh - 284px);
    overflow-y: auto;
    scrollbar-color: auto;
  }

  .configure-screen-mobile {
    height: calc(100vh - 278px);
    overflow-y: auto;
    scrollbar-color: auto;
  }
`;

const CustomModalStyle = styled(Modal)`
  & > div > div {
    border-radius: 0.75rem;
  }

  .modal-body {
    .ql-container.ql-snow {
      border-bottom: 1px solid #ccc !important;
      border-bottom-left-radius: 0.75rem !important;
      border-bottom-right-radius: 0.75rem !important;
    }
  }

  .modal-footer {
    button,
    label {
      border-radius: 0.75rem;
      box-shadow:
        0 1px 2px 0 rgba(60, 64, 67, 0.3),
        0 2px 6px 2px rgba(60, 64, 67, 0.15);
    }
  }
`;

const CustomQuillEditorStyle = styled.div`
  .ql-toolbar.ql-snow {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
  }

  .ql-container.ql-snow {
    border-bottom: unset;
  }

  .ql-editor {
    height: 100%;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }

  .group,
  label,
  &:hover,
  &:focus-within {
    border-radius: 0.75rem;
    box-shadow:
      0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 2px 6px 2px rgba(60, 64, 67, 0.15);
  }
`;
