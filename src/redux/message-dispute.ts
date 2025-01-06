import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PageInfo } from '../type/common';
import {
  ConversationPayload,
  ConversationType,
  Participant,
} from '../type/conversation';
import {
  IncomingMessage,
  MessageContentType,
  MessagePayload,
  SendMessageBody,
  LatestMessageRead,
} from '../type/message';
import { StoreDispatch, StoreGetState } from '.';
import { isEmpty, omit } from 'lodash';
import {
  getDisputeByConversationId,
  getConversationMessagesDisputeApi,
  sendConversationMessageApi,
} from '../rest-api/conversation';
import { queryParamsToString } from '../helper/query-param';
// import { toast } from 'react-toastify';
// import { errorFormat } from '../helper/error-format';
import { v4 as uuidv4 } from 'uuid';
// import { readMessageApi } from '../rest-api/conversation-message';
import {
  resetUnreadCountByIdAction,
  setIsFetchFirebase,
} from './conversation-dispute';
import {
  loadFileResultsAction,
  loadMediaResultsAction,
} from './conversation-side-info';
import { toast } from 'react-toastify';
import { CryptoAES256 } from '../helper/rsa-crypto';
import { errorFormat } from '../helper/error-format';

type QueryParams = {
  page: number;
  limit: number;
};

export type MessageDisputeReducerState = {
  conversation: ConversationPayload | null;
  messages: MessagePayload[];
  latestMessage: IncomingMessage | null;
  latestReads: LatestMessageRead[];
  participants: Participant[];
  pageInfo: Omit<PageInfo, 'results'>;
  queryParams: QueryParams;
  isInitializing: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  isBackgroundUpdating: boolean;
  chatScheme: CryptoAES256 | null;
  chatSecret: string | null;
};

const initialState: MessageDisputeReducerState = {
  conversation: null,
  latestMessage: null,
  messages: Array<MessagePayload>(),
  latestReads: Array<LatestMessageRead>(),
  participants: Array<Participant>(),
  pageInfo: {
    limit: 0,
    page: 0,
    totalPages: 0,
    totalResults: 0,
  },
  queryParams: {
    page: 1,
    limit: 30,
  },
  isInitializing: false,
  isLoadingMore: false,
  isBackgroundUpdating: false,
  isError: false,
  chatScheme: null,
  chatSecret: null,
};

const messageDisputeSlice = createSlice({
  name: 'messageDispute',
  initialState,
  reducers: {
    initializeChatSchemeAction: (
      state,
      action: PayloadAction<{
        chatScheme: CryptoAES256;
      }>
    ) => ({
      ...state,
      chatScheme: action.payload.chatScheme,
    }),
    // initialization
    startInitializeMessage: state => {
      state.isInitializing = true;
    },
    initializeMessage: (
      state,
      action: PayloadAction<{
        conversation: ConversationPayload;
        messages: MessagePayload[];
        participants: Participant[];
        pageInfo: Omit<PageInfo, 'results'>;
      }>
    ) => {
      state.isError = false;
      state.conversation = action.payload.conversation;
      state.messages = action.payload.messages;
      state.participants = action.payload.participants;
      state.pageInfo = action.payload.pageInfo;
      state.isInitializing = false;
    },
    setLatestMessage: (
      state,
      action: PayloadAction<{
        latestMessage: IncomingMessage;
      }>
    ) => {
      state.latestMessage = action.payload.latestMessage;
    },
    setChatSecret: (
      state,
      action: PayloadAction<{
        chatSecret: string;
      }>
    ) => {
      state.chatSecret = action.payload.chatSecret;
    },
    // background update
    startBackgroundUpdateMessage: state => {
      state.isBackgroundUpdating = true;
    },
    backgroundUpdateMessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
      }>
    ) => {
      state.isError = false;
      state.messages = action.payload.messages;
      state.isBackgroundUpdating = false;
    },
    updateSendingMessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
      }>
    ) => {
      state.messages = action.payload.messages;
    },
    // load more
    startLoadMoreMessage: state => {
      state.isLoadingMore = true;
    },
    loadMoremessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
        pageInfo: Omit<PageInfo, 'results'>;
        queryParams: QueryParams;
      }>
    ) => {
      state.isError = false;
      state.messages = action.payload.messages;
      state.pageInfo = action.payload.pageInfo;
      state.queryParams = action.payload.queryParams;
      state.isLoadingMore = false;
    },
    // other
    updateLatestReadMessage: (
      state,
      action: PayloadAction<{
        latestReads: LatestMessageRead[];
      }>
    ) => {
      state.latestReads = action.payload.latestReads;
    },
    fetchMessageFailure: () => {
      return { ...initialState, isInitializing: false, isError: true };
    },
    setDefaultMessageState: () => initialState,
  },
});

export const { initializeChatSchemeAction } = messageDisputeSlice.actions;
export const { setChatSecret } = messageDisputeSlice.actions;

const {
  startInitializeMessage,
  initializeMessage,
  startBackgroundUpdateMessage,
  setLatestMessage,
  backgroundUpdateMessage,
  updateSendingMessage,
  fetchMessageFailure,
  startLoadMoreMessage,
  loadMoremessage,
  setDefaultMessageState,
  updateLatestReadMessage,
} = messageDisputeSlice.actions;

export const initializeMessageAction =
  (conversationId: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { queryParams } = getState().messageDispute;
      const { user } = getState().account;

      if (isEmpty(user)) {
        throw new Error('User not found.');
      }
      dispatch(startInitializeMessage());

      const [conversationResp, messageResp] = await Promise.all([
        getDisputeByConversationId(conversationId),
        getConversationMessagesDisputeApi(
          conversationId,
          queryParamsToString(queryParams)
        ),
      ]);
      if (!conversationResp || !messageResp) {
        throw new Error('Conversation not found.');
      }
      // if (messageResp?.results?.[0]?.id) {
      //   await readMessageApi(messageResp?.results[0].id);
      // }
      dispatch(resetUnreadCountByIdAction(conversationResp.id));
      dispatch(
        initializeMessage({
          conversation: conversationResp,
          messages: messageResp?.results,
          participants: conversationResp?.participants,
          pageInfo: omit(messageResp, ['results']),
        })
      );

      return conversationResp ? conversationResp : undefined;
    } catch (error) {
      dispatch(fetchMessageFailure());
    }
  };

export const updateLatestReadMessageAction =
  (inComingLatestReads: LatestMessageRead[]) => (dispatch: StoreDispatch) => {
    dispatch(updateLatestReadMessage({ latestReads: inComingLatestReads }));
  };

export const sendMessageAction =
  (messageBody: SendMessageBody) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { conversation, messages } = getState().messageDispute;
    try {
      const { user } = getState().account;
      const maxFileSize = 25 * 1024 * 1024; // 25MB in bytes

      if (isEmpty(conversation)) {
        throw new Error('Selected Conversation not found.');
      }

      if (isEmpty(user)) {
        throw new Error('User not found.');
      }

      if (
        messageBody.optional?.fileSize &&
        messageBody.optional?.fileSize > maxFileSize
      ) {
        throw new Error('File size exceeds the 25MB limit');
      }

      const sendingMessage: MessagePayload = {
        id: uuidv4(),
        createdAt: '',
        updatedAt: '',
        senderId: user.id,
        conversationId: conversation.id,
        content: messageBody.content,
        contentType: messageBody.contentType,
        optional: messageBody.optional,
        sendedDate: '',
        expiredDate: '',
        isDeleted: false,
        deletedDate: '',
        sender: user,
      };

      dispatch(
        updateSendingMessage({ messages: [sendingMessage, ...messages] })
      );
      await sendConversationMessageApi(conversation.id, messageBody);
      dispatch(setIsFetchFirebase(false));
    } catch (error) {
      if (errorFormat(error).message === 'File size exceeds the 25MB limit') {
        toast.error('File size exceeds the 25MB limit');
      } else {
        toast.error(
          messageBody.contentType !== MessageContentType.TEXT &&
            messageBody.contentType !== MessageContentType.STICKER
            ? `${messageBody.contentType === MessageContentType.IMAGE ? 'Image' : messageBody.contentType === MessageContentType.VIDEO ? 'Video' : 'File'} is too large`
            : conversation?.type === ConversationType.GROUP &&
                errorFormat(error).message === 'CONVERSATION_NOT_FOUND'
              ? 'This group chat has been deleted'
              : `Something's wrong, please try again later`
        );
        if (
          conversation?.type === ConversationType.GROUP &&
          errorFormat(error).message === 'CONVERSATION_NOT_FOUND'
        ) {
          throw new Error('CONVERSATION_NOT_FOUND');
        }
      }

      dispatch(updateSendingMessage({ messages: cleanMessage(messages) }));
    }
  };

export const unsendMessageAction =
  (messageId: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { messages } = getState().messageDispute;
    const newMessage = messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          content: '',
        };
      }
      return msg;
    });
    dispatch(updateSendingMessage({ messages: newMessage }));
  };

export const removeMessageAction =
  (messageId: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { messages } = getState().message;
    const newMessage = messages.filter(msg => msg.id !== messageId);
    dispatch(updateSendingMessage({ messages: newMessage }));
  };

export const receiveIncomingMessageAction =
  (incomingMessage: IncomingMessage) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { conversation, messages } = getState().message;
      const isDuplicate = messages.some(item => item.id === incomingMessage.id);
      if (
        conversation &&
        conversation.id === incomingMessage.conversationId &&
        !isDuplicate
      ) {
        dispatch(startBackgroundUpdateMessage());
        const cleanMessage = messages.filter(msg => !!msg.updatedAt);
        const latestMessage = cleanMessage[0];
        const messageResp = await getConversationMessagesDisputeApi(
          conversation.id,
          queryParamsToString({
            limit: 10,
            timestamp: latestMessage?.createdAt || '',
          })
        );

        if (!messageResp) {
          throw new Error('Message not found.');
        }

        dispatch(
          backgroundUpdateMessage({
            messages: [...messageResp.results, ...cleanMessage],
          })
        );
        // if (messageResp?.results?.[0]?.id) {
        //   await readMessageApi(messageResp?.results[0].id);
        // }
        // dispatch(resetUnreadCountByIdAction(conversation.id));

        if (
          incomingMessage.contentType === MessageContentType.IMAGE ||
          incomingMessage.contentType === MessageContentType.VIDEO
        ) {
          dispatch(loadMediaResultsAction({ page: 1 }));
        }
        if (incomingMessage.contentType === MessageContentType.FILE) {
          dispatch(loadFileResultsAction({ page: 1 }));
        }
      }
    } catch (error) {
      // toast.error(errorFormat(error).message);
      dispatch(fetchMessageFailure());
    }
  };

export const loadMoreMessageAction =
  () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { conversation, messages, queryParams } = getState().messageDispute;

      if (isEmpty(conversation)) {
        throw new Error('Selected Conversation not found.');
      }

      dispatch(startLoadMoreMessage());

      const trimedMessage = [...messages];
      trimedMessage.length = queryParams.page * queryParams.limit;

      const newQueryParams = {
        ...queryParams,
        page: queryParams.page + 1,
      };

      const messageResp = await getConversationMessagesDisputeApi(
        conversation?.id,
        queryParamsToString(newQueryParams)
      );

      if (!messageResp) {
        throw new Error('Message not found.');
      }

      dispatch(
        loadMoremessage({
          messages: [...messages, ...messageResp.results],
          pageInfo: omit(messageResp, ['results']),
          queryParams: newQueryParams,
        })
      );
    } catch (error) {
      dispatch(fetchMessageFailure());
    }
  };

export const resetMessageStateAction = () => (dispatch: StoreDispatch) => {
  dispatch(setDefaultMessageState());
};

export const setLatestMessageDisputeAction =
  (latestMessage: IncomingMessage) => (dispatch: StoreDispatch) => {
    dispatch(setLatestMessage({ latestMessage }));
  };

export const updateMessageByIdAction =
  (changedMessage: MessagePayload) =>
  (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { messages } = getState().messageDispute;

    const newMessages = messages.map(m => {
      if (changedMessage.id === m.id) {
        return changedMessage;
      }
      return m;
    });

    dispatch(updateSendingMessage({ messages: newMessages }));
  };

const cleanMessage = (messages: MessagePayload[]) => {
  return messages.filter(m => !!m.createdAt);
};

export default messageDisputeSlice;
