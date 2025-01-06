import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PageInfo } from '../type/common';
import { StoreDispatch, StoreGetState } from '.';
import { isEmpty, omit } from 'lodash';
import { queryParamsToString } from '../helper/query-param';
// import { toast } from 'react-toastify';
// import { errorFormat } from '../helper/error-format';
import { ConversationPayload, ConversationType } from '../type/conversation';
import {
  getConversationByIdApi,
  getMyConversationsApi,
  getMyDeletedConversationsApi,
} from '../rest-api/conversation';
import { Logger } from '../helper/logger';
import moment from 'moment';
import { handleCreateChat } from './badge';
import { IncomingMessage } from '../type/message';
import { onValue, ref } from 'firebase/database';
import { setLatestMessageAction } from './message';

const log = new Logger('conversation-redux');

type QueryParams = {
  page?: number;
  limit?: number;
  text?: string;
  type?: ConversationType;
  orderBy?: string;
};

type Result = ConversationPayload;

export type ReducerState = {
  queryParams: QueryParams;
  pageInfo: Omit<PageInfo, 'results'>;
  results: Result[];
  deletedResults: { conversationId: string; deletedAt: Date }[];
  isInitializing: boolean;
  isFetchFirebase: boolean;
  isBackgroundUpdating: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  isGroupDeleted: boolean;
};

const sliceName = 'conversation';

const fetcher = getMyConversationsApi;

const initialQueryParams: QueryParams = {
  page: 1,
  limit: 30,
  text: '',
  type: ConversationType.DM,
  orderBy: 'latestMessageDate:desc',
};

const initialState: ReducerState = {
  queryParams: initialQueryParams,
  pageInfo: {
    limit: 0,
    page: 0,
    totalPages: 0,
    totalResults: 0,
  },
  results: Array<Result>(),
  deletedResults: Array<{ conversationId: string; deletedAt: Date }>(),
  isInitializing: true,
  isFetchFirebase: false,
  isBackgroundUpdating: false,
  isLoadingMore: false,
  isError: false,
  isGroupDeleted: false,
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    startLoadingResults: state => {
      state.isInitializing = true;
    },
    doneLoadingResults: state => {
      state.isInitializing = false;
    },
    setResultsPayload: (
      state,
      action: PayloadAction<{
        results: Result[];
        pageInfo: Omit<PageInfo, 'results'>;
      }>
    ) => {
      state.results = action.payload.results;
      state.pageInfo = action.payload.pageInfo;
      state.isInitializing = false;
    },
    setDeletedResultsPayload: (
      state,
      action: PayloadAction<{
        deletedResults: { conversationId: string; deletedAt: Date }[];
      }>
    ) => {
      state.deletedResults = action.payload.deletedResults;
    },
    startLoadMoreResults: state => {
      state.isLoadingMore = true;
    },
    setLoadMoreResultsPayload: (
      state,
      action: PayloadAction<{
        results: Result[];
        pageInfo: Omit<PageInfo, 'results'>;
      }>
    ) => {
      state.results = [...state.results, ...action.payload.results];
      state.pageInfo = action.payload.pageInfo;
      state.isLoadingMore = false;
    },
    startBackgroundResultsPayload: state => {
      state.isBackgroundUpdating = true;
    },
    setStatusIsFetchFirebase: (
      state,
      action: PayloadAction<{
        isFetchFirebase: boolean;
      }>
    ) => {
      state.isFetchFirebase = action.payload.isFetchFirebase;
    },
    backgroundResultsPayload: (
      state,
      action: PayloadAction<{
        results: Result[];
      }>
    ) => {
      state.isError = false;
      state.results = action.payload.results;
      state.isBackgroundUpdating = false;
    },
    setQueryParams: (state, action: PayloadAction<QueryParams>) => {
      state.queryParams = action.payload;
    },
    loadResultsFailure: state => {
      state.isError = true;
      state.isInitializing = false;
      state.isLoadingMore = false;
    },
    setIsGroupDeleted: (state, action: PayloadAction<boolean>) => {
      state.isGroupDeleted = action.payload;
    },
    setDefaultState: () => initialState,
  },
});

const {
  startLoadingResults,
  doneLoadingResults,
  setResultsPayload,
  startLoadMoreResults,
  setLoadMoreResultsPayload,
  startBackgroundResultsPayload,
  setDeletedResultsPayload,
  backgroundResultsPayload,
  setIsGroupDeleted,
  setStatusIsFetchFirebase,
  setQueryParams,
  loadResultsFailure,
  setDefaultState,
} = slice.actions;

export const setDefaultConversationStateAction =
  () => (dispatch: StoreDispatch) => {
    dispatch(setDefaultState());
  };

export const startLoadingAction = () => (dispatch: StoreDispatch) => {
  dispatch(startLoadingResults());
};
export const doneLoadingAction = () => (dispatch: StoreDispatch) => {
  dispatch(doneLoadingResults());
};

export const setStateIsGroupDeleted =
  (value: boolean) => (dispatch: StoreDispatch) => {
    dispatch(setIsGroupDeleted(value));
  };

export const setIsFetchFirebase =
  (isFetch: boolean) => (dispatch: StoreDispatch) => {
    dispatch(setStatusIsFetchFirebase({ isFetchFirebase: isFetch }));
  };

export const loadResultsAction =
  (newQueryParams?: QueryParams) => async (dispatch: StoreDispatch) => {
    try {
      const queryParams: QueryParams = {
        ...initialQueryParams,
        ...newQueryParams,
      };

      const { pageInfo, results } = await handleFetchPayload(
        dispatch,
        queryParams
      );
      const deletedResults = await getMyDeletedConversationsApi(
        queryParams.type ? `?type=${queryParams.type}` : undefined
      );
      dispatch(setDeletedResultsPayload({ deletedResults }));
      dispatch(setResultsPayload({ results, pageInfo }));
    } catch (error) {
      dispatch(loadResultsFailure());
      // toast.error(errorFormat(error).message);
    } finally {
      dispatch(setIsFetchFirebase(false));
    }
  };

export const setDeletedResultsAction =
  (deletedResults: { conversationId: string; deletedAt: Date }[]) =>
  async (dispatch: StoreDispatch) => {
    dispatch(setDeletedResultsPayload({ deletedResults }));
  };

export const loadMoreResultAction =
  (queryParams: QueryParams) => async (dispatch: StoreDispatch) => {
    try {
      dispatch(startLoadMoreResults());
      const { pageInfo, results } = await handleFetchPayload(
        dispatch,
        queryParams
      );
      dispatch(setLoadMoreResultsPayload({ results, pageInfo }));
    } catch (error) {
      dispatch(loadResultsFailure());
      // toast.error(errorFormat(error).message);
    }
  };

export const updatePayloadByIdAction =
  (conversationId: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { results } = getState().conversation;
      const { conversation } = getState().message;

      const targetConversation = results.find(
        conv => conv.id === conversationId
      );
      if (targetConversation) {
        dispatch(startBackgroundResultsPayload());
        const newPayload = await getConversationByIdApi(conversationId);
        if (newPayload) {
          const newConversation = results.map(conv => {
            if (conv.id === conversationId) {
              return newPayload;
            }
            return conv;
          });
          if (newPayload.id === conversation?.id) {
            const mappingConversation = newConversation.sort(
              (a, b) =>
                moment(b.latestMessageDate).valueOf() -
                moment(a.latestMessageDate).valueOf()
            );

            dispatch(
              backgroundResultsPayload({ results: mappingConversation })
            );
          } else {
            dispatch(backgroundResultsPayload({ results: newConversation }));
          }
        }
      }
    } catch (error) {
      log.error(error);
    }
  };

export const resetUnreadCountByIdAction =
  (conversationId: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { results } = getState().conversation;

      const targetConversation = results.find(
        conv => conv.id === conversationId
      );
      if (targetConversation) {
        dispatch(startBackgroundResultsPayload());
        const newConversation = results.map(conv => {
          if (conv.id === conversationId) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        });
        dispatch(backgroundResultsPayload({ results: newConversation }));
      }
    } catch (error) {
      log.error(error);
    }
  };

export const fetchMessages =
  () =>
  (
    dispatch: StoreDispatch,
    getState: StoreGetState
  ): Promise<IncomingMessage[]> => {
    const { database } = getState().firebase;
    const { results, isInitializing } = getState().conversation;

    return new Promise((resolve, reject) => {
      if (database && results.length > 0 && !isInitializing) {
        const incomingMessages: IncomingMessage[] = [];
        const promises = results.map(conversation => {
          return new Promise<void>(resolveInner => {
            const listenRef = ref(database, `${conversation.id}/latestMessage`);
            onValue(listenRef, snapshot => {
              if (snapshot.exists()) {
                const val = snapshot.val() as IncomingMessage;
                if (!isEmpty(val)) {
                  const existingMessageIndex = incomingMessages.findIndex(
                    msg => msg.conversationId === val.conversationId
                  );
                  if (existingMessageIndex >= 0) {
                    // Update existing message
                    incomingMessages[existingMessageIndex] = val;
                  } else {
                    // Add new message
                    incomingMessages.push(val);
                  }

                  if (
                    incomingMessages.length > 0 &&
                    incomingMessages.length < 2
                  ) {
                    if (results.length > 0 && !isInitializing) {
                      // log.info('get message from realtime DB');

                      if (val?.conversationIsDeleted) {
                        dispatch(setStateIsGroupDeleted(true));
                      }
                      dispatch(updatePayloadByIdAction(val.conversationId));
                    }
                  } else {
                    if (
                      incomingMessages.some(
                        item => item.timestamp !== val.timestamp
                      )
                    ) {
                      if (results.length > 0 && !isInitializing) {
                        log.info('get message from realtime DB');

                        if (val?.conversationIsDeleted) {
                          dispatch(setStateIsGroupDeleted(true));
                        }
                        dispatch(updatePayloadByIdAction(val.conversationId));
                      }
                    }
                  }

                  dispatch(setLatestMessageAction(val));
                }
              }
              resolveInner();
            });
          });
        });

        Promise.all(promises)
          .then(() => resolve(incomingMessages))
          .catch(error => reject(error));
      } else {
        resolve([]);
      }
    });
  };

export const fetchDeletedMessages =
  () =>
  async (dispatch: StoreDispatch, getState: StoreGetState): Promise<void> => {
    const { database } = getState().firebase;
    const { deletedResults, isInitializing } = getState().conversation;
    return new Promise(() => {
      if (database && deletedResults.length > 0 && !isInitializing) {
        const promises = deletedResults.map(deletedResult => {
          return new Promise<void>(() => {
            const listenRef = ref(
              database,
              `${deletedResult.conversationId}/latestMessage`
            );
            onValue(listenRef, async snapshot => {
              if (snapshot.exists()) {
                const val = snapshot.val() as IncomingMessage;
                if (!isEmpty(val)) {
                  if (
                    database &&
                    deletedResults.length > 0 &&
                    !isInitializing
                  ) {
                    await processIncomingMessages(val, dispatch, getState);
                  }
                }
              }
            });
          });
        });

        Promise.all(promises);
      }
    });
  };

const processIncomingMessages = async (
  incomingMessages: IncomingMessage,
  dispatch: StoreDispatch,
  getState: StoreGetState
) => {
  const { database } = getState().firebase;
  const { deletedResults, isInitializing } = getState().conversation;
  const { user } = getState().account;

  if (
    database &&
    incomingMessages &&
    deletedResults.length > 0 &&
    !isInitializing
  ) {
    if (
      deletedResults.length > 0 &&
      !!deletedResults.find(
        value => value.conversationId === incomingMessages.conversationId
      ) &&
      moment(
        deletedResults.find(
          value => value.conversationId === incomingMessages.conversationId
        )?.deletedAt
      ).valueOf() < moment(incomingMessages.timestamp).valueOf()
    ) {
      log.info('create conversation from delete message realtime DB');
      const resp = await handleCreateChat(
        user,
        incomingMessages.conversationId
      );
      if (resp) {
        setTimeout(() => {
          dispatch(setDeletedResultsAction([]));
          dispatch(
            loadResultsAction({
              type: resp,
            })
          );
        }, 300);
      }
    }
  }
};

const handleFetchPayload = async (
  dispatch: StoreDispatch,
  _queryParams: QueryParams
) => {
  const payload = await fetcher(queryParamsToString(_queryParams));
  if (!payload) {
    throw new Error('Payload not found');
  }
  const pageInfo = omit(payload, ['results']);
  dispatch(setQueryParams(_queryParams));
  return { pageInfo, results: payload.results };
};

export default slice;
