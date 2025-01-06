// import (Internal imports)

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreDispatch, StoreGetState } from '.';
import { omit } from 'lodash';

// react-toastify
import { toast } from 'react-toastify';

// helper functions
import { queryParamsToString } from '../helper/query-param';
import { errorFormat } from '../helper/error-format';
import { decryptMessage } from '../helper/crypto';

// types
import { PageInfo } from '../type/common';
import { MessageContentType, MessagePayload } from '../type/message';

// APIs
import { getConversationMessagesApi } from '../rest-api/conversation';

type MediaQueryParams = {
  page?: number;
  limit?: number;
  type?: MessageContentType[];
};

type FileQueryParams = {
  page?: number;
  limit?: number;
  type?: MessageContentType;
};

export type ReducerState = {
  media: {
    queryParams: MediaQueryParams;
    pageInfo: Omit<PageInfo, 'results'>;
    messages: MessagePayload[];
    isInitializing: boolean;
    isBackgroundUpdating: boolean;
    isLoadingMore: boolean;
    isError: boolean;
  };
  file: {
    queryParams: FileQueryParams;
    pageInfo: Omit<PageInfo, 'results'>;
    messages: MessagePayload[];
    isInitializing: boolean;
    isBackgroundUpdating: boolean;
    isLoadingMore: boolean;
    isError: boolean;
  };
};

const initialMediaQueryParams: MediaQueryParams = {
  page: 1,
  limit: 10,
  type: [MessageContentType.IMAGE, MessageContentType.VIDEO],
};

const initialFileQueryParams: FileQueryParams = {
  page: 1,
  limit: 30,
  type: MessageContentType.FILE,
};

const initialState: ReducerState = {
  media: {
    queryParams: initialMediaQueryParams,
    pageInfo: {
      limit: 0,
      page: 0,
      totalPages: 0,
      totalResults: 0,
    },
    messages: Array<MessagePayload>(),
    isInitializing: true,
    isBackgroundUpdating: false,
    isLoadingMore: false,
    isError: false,
  },
  file: {
    queryParams: initialFileQueryParams,
    pageInfo: {
      limit: 0,
      page: 0,
      totalPages: 0,
      totalResults: 0,
    },
    messages: Array<MessagePayload>(),
    isInitializing: true,
    isBackgroundUpdating: false,
    isLoadingMore: false,
    isError: false,
  },
};

const conversationSideInfoSlice = createSlice({
  name: 'conversationSideInfo',
  initialState,
  reducers: {
    // ----- MEDIA ----- //
    // initialization
    startInitializeMediaMessage: state => {
      state.media.isInitializing = true;
    },
    initializeMediaMessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
        queryParams: MediaQueryParams;
        pageInfo: Omit<PageInfo, 'results'>;
      }>
    ) => {
      state.media.isError = false;
      state.media.messages = action.payload.messages;
      state.media.pageInfo = action.payload.pageInfo;
      state.media.queryParams = action.payload.queryParams;
      state.media.isInitializing = false;
    },
    // load more
    startLoadMoreMediaMessage: state => {
      state.media.isLoadingMore = true;
    },
    loadMoreMediaMessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
        pageInfo: Omit<PageInfo, 'results'>;
        queryParams: MediaQueryParams;
      }>
    ) => {
      // Check before adding new files into the state to avoid duplicates
      const newMessages = action.payload.messages.filter(
        msg =>
          !state.media.messages.some(existingMsg => existingMsg.id === msg.id)
      );

      state.media.isError = false;
      state.media.messages = [
        ...state.media.messages,
        ...newMessages, // Append only new files
      ];
      state.media.pageInfo = action.payload.pageInfo;
      state.media.queryParams = action.payload.queryParams;
      state.media.isLoadingMore = false;
    },

    // ----- FILE ----- //
    // initialization
    startInitializeFileMessage: state => {
      state.file.isInitializing = true;
    },
    initializeFileMessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
        queryParams: FileQueryParams;
        pageInfo: Omit<PageInfo, 'results'>;
      }>
    ) => {
      state.file.isError = false;
      state.file.messages = action.payload.messages;
      state.file.pageInfo = action.payload.pageInfo;
      state.file.queryParams = action.payload.queryParams;
      state.file.isInitializing = false;
    },
    // load more
    startLoadMoreFileMessage: state => {
      state.file.isLoadingMore = true;
    },
    loadMoreFileMessage: (
      state,
      action: PayloadAction<{
        messages: MessagePayload[];
        pageInfo: Omit<PageInfo, 'results'>;
        queryParams: FileQueryParams;
      }>
    ) => {
      state.file.isError = false;
      state.file.messages = action.payload.messages;
      state.file.pageInfo = action.payload.pageInfo;
      state.file.queryParams = action.payload.queryParams;
      state.file.isLoadingMore = false;
    },

    // ----- OTHER ----- //
    fetchMessageFailure: () => {
      return { ...initialState, isInitializing: false, isError: true };
    },
    setDefaultMessageState: () => initialState,
  },
});

export const {
  // media
  startInitializeMediaMessage,
  initializeMediaMessage,
  startLoadMoreMediaMessage,
  loadMoreMediaMessage,

  // file
  startInitializeFileMessage,
  initializeFileMessage,
  startLoadMoreFileMessage,
  loadMoreFileMessage,

  // other
  fetchMessageFailure,
  //   setDefaultMessageState,
} = conversationSideInfoSlice.actions;

export const startMediaLoadingAction = () => (dispatch: StoreDispatch) => {
  dispatch(startInitializeMediaMessage());
};

export const loadMediaResultsAction =
  (newQueryParams?: MediaQueryParams) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { conversation, chatScheme } = getState().message;
      if (!conversation) {
        return;
      }
      const queryParams: MediaQueryParams = {
        ...initialMediaQueryParams,
        ...newQueryParams,
      };

      const messageResp = await getConversationMessagesApi(
        conversation.id,
        queryParamsToString(queryParams)
      );

      if (!messageResp) {
        throw new Error('Conversation not found.');
      }

      const decryptedPayload = await Promise.all(
        messageResp?.results.map(async msg => {
          const decrypted = await decryptMessage(
            msg.content,
            msg.contentType,
            chatScheme
          );
          return { ...msg, content: decrypted };
        })
      );

      dispatch(
        initializeMediaMessage({
          messages: decryptedPayload,
          pageInfo: omit(messageResp, ['results']),
          queryParams: queryParams,
        })
      );
    } catch (error) {
      dispatch(fetchMessageFailure());
      toast.error(errorFormat(error).message);
    }
  };

export const loadMoreMediaResultAction =
  () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { conversation, chatScheme } = getState().message;
      const {
        media: { queryParams, messages },
      } = getState().conversationSideInfo;

      if (!conversation) {
        return; // Check if there is a conversation
      }

      // Increment page for the new query
      const newQueryParams: MediaQueryParams = {
        ...queryParams,
        page: (queryParams.page || 1) + 1, // Increment to the next page
      };

      // Call API to load new data
      const messageResp = await getConversationMessagesApi(
        conversation.id,
        queryParamsToString(newQueryParams)
      );

      if (!messageResp || !messageResp.results) {
        throw new Error('Conversation not found or no results.');
      }

      // Decrypt the payload received
      const decryptedPayload = await Promise.all(
        messageResp.results.map(async msg => {
          const decrypted = await decryptMessage(
            msg.content,
            msg.contentType,
            chatScheme
          );
          return { ...msg, content: decrypted };
        })
      );

      // Check results before appending
      if (decryptedPayload.length === 0) {
        return; // No new files, no need to append
      }

      // Dispatch action to append new messages to the state
      dispatch(
        loadMoreMediaMessage({
          messages: [...messages, ...decryptedPayload], // Append new data
          pageInfo: omit(messageResp, ['results']), // Set pageInfo
          queryParams: newQueryParams, // Use the new queryParams
        })
      );
    } catch (error) {
      dispatch(fetchMessageFailure()); // Handle error
      toast.error(errorFormat(error).message); // Display error
    }
  };

export const startFileLoadingAction = () => (dispatch: StoreDispatch) => {
  dispatch(startInitializeFileMessage());
};

export const loadFileResultsAction =
  (newQueryParams?: FileQueryParams) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { conversation, chatScheme } = getState().message;
      if (!conversation) {
        return;
      }
      const queryParams: FileQueryParams = {
        ...initialFileQueryParams,
        ...newQueryParams,
      };

      const messageResp = await getConversationMessagesApi(
        conversation.id,
        queryParamsToString(queryParams)
      );

      if (!messageResp) {
        throw new Error('Conversation not found.');
      }

      const decryptedPayload = await Promise.all(
        messageResp?.results.map(async msg => {
          const decrypted = await decryptMessage(
            msg.content,
            msg.contentType,
            chatScheme
          );
          return { ...msg, content: decrypted };
        })
      );

      dispatch(
        initializeFileMessage({
          messages: decryptedPayload,
          pageInfo: omit(messageResp, ['results']),
          queryParams: queryParams,
        })
      );
    } catch (error) {
      dispatch(fetchMessageFailure());
      toast.error(errorFormat(error).message);
    }
  };

export const loadMoreFileResultAction =
  () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { conversation, chatScheme } = getState().message;
      const {
        file: { queryParams, messages },
      } = getState().conversationSideInfo;
      if (!conversation) {
        return;
      }
      dispatch(startLoadMoreFileMessage());

      const newQueryParams: FileQueryParams = {
        ...queryParams,
        page: queryParams.page! + 1,
      };

      const messageResp = await getConversationMessagesApi(
        conversation.id,
        queryParamsToString(newQueryParams)
      );

      if (!messageResp) {
        throw new Error('Conversation not found.');
      }

      const decryptedPayload = await Promise.all(
        messageResp?.results.map(async msg => {
          const decrypted = await decryptMessage(
            msg.content,
            msg.contentType,
            chatScheme
          );
          return { ...msg, content: decrypted };
        })
      );

      dispatch(
        loadMoreFileMessage({
          messages: [...messages, ...decryptedPayload],
          pageInfo: omit(messageResp, ['results']),
          queryParams: newQueryParams,
        })
      );
    } catch (error) {
      dispatch(fetchMessageFailure());
      toast.error(errorFormat(error).message);
    }
  };

export default conversationSideInfoSlice;
