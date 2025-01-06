import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PageInfo } from '../type/common';
import { StoreDispatch } from '.';
import { omit } from 'lodash';
import { queryParamsToString } from '../helper/query-param';
import { toast } from 'react-toastify';
import { errorFormat } from '../helper/error-format';
import { getMyContactsApi } from '../rest-api/contact';
import { ContactPayload } from '../type/contact';

type Result = ContactPayload;

type QueryParams = {
  page?: number;
  limit?: number;
  text?: string;
  isConversation?: boolean;
};

export type ReducerState = {
  queryParams: QueryParams;
  pageInfo: Omit<PageInfo, 'results'>;
  results: Result[];
  isInitializing: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  isReloadUserReport: boolean;
  isReloadUserBlock: boolean;
};

const sliceName = 'contact';

const fetcher = getMyContactsApi;

const initialQueryParams: QueryParams = {
  page: 1,
  limit: 30,
  text: '',
  isConversation: false,
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
  isInitializing: false,
  isLoadingMore: false,
  isError: false,
  isReloadUserReport: false,
  isReloadUserBlock: false,
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
    setIsReloadUserReport: (
      state,
      action: PayloadAction<{
        isLoad: boolean;
      }>
    ) => {
      state.isReloadUserReport = action.payload.isLoad;
    },
    setIsReloadUserBlock: (
      state,
      action: PayloadAction<{
        isLoad: boolean;
      }>
    ) => {
      state.isReloadUserBlock = action.payload.isLoad;
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
  setIsReloadUserReport,
  setIsReloadUserBlock,
  loadResultsFailure,
} = slice.actions;

export const handleIsReloadUserBlock =
  (isLoad: boolean) => (dispatch: StoreDispatch) => {
    dispatch(setIsReloadUserBlock({ isLoad }));
  };
export const handleIsReloadUserReport =
  (isLoad: boolean) => (dispatch: StoreDispatch) => {
    dispatch(setIsReloadUserReport({ isLoad }));
  };

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
      toast.error(errorFormat(error).message);
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
      toast.error(errorFormat(error).message);
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
