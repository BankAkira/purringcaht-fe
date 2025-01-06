import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PageInfo } from '../type/common';
import { StoreDispatch } from '.';
import { omit } from 'lodash';
import { queryParamsToString } from '../helper/query-param';
// import { toast } from 'react-toastify';
// import { errorFormat } from '../helper/error-format';
import { getMyConversationRequestsApi } from '../rest-api/conversation-requests';
import { ConversationRequestPayload } from '../type/conversation-requests';
import { ConversationRequestType } from '../type/conversation';

type Result = ConversationRequestPayload;

type QueryParams = {
  page?: number;
  limit?: number;
  text?: string;
  type: ConversationRequestType;
  orderBy?: string;
};

export type ReducerState = {
  queryParams: QueryParams;
  pageInfo: Omit<PageInfo, 'results'>;
  results: Result[];
  isInitializing: boolean;
  isLoadingMore: boolean;
  isError: boolean;
};

const sliceName = 'conversation-request';

const fetcher = getMyConversationRequestsApi;

const initialQueryParams: QueryParams = {
  page: 1,
  limit: 30,
  text: '',
  type: ConversationRequestType.MESSAGE_REQUEST,
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
  isInitializing: true,
  isLoadingMore: false,
  isError: false,
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    startLoadingResults: state => {
      state.isInitializing = true;
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
    setQueryParams: (state, action: PayloadAction<QueryParams>) => {
      state.queryParams = action.payload;
    },
    loadResultsFailure: state => {
      state.isError = true;
      state.isInitializing = false;
      state.isLoadingMore = false;
    },
  },
});

const {
  startLoadingResults,
  setResultsPayload,
  startLoadMoreResults,
  setLoadMoreResultsPayload,
  setQueryParams,
  loadResultsFailure,
} = slice.actions;

export const startLoadingAction = () => (dispatch: StoreDispatch) => {
  dispatch(startLoadingResults());
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
      dispatch(setResultsPayload({ results, pageInfo }));
    } catch (error) {
      dispatch(loadResultsFailure());
      // toast.error(errorFormat(error).message);
    }
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
