import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreDispatch } from '.';

// helper function
import { Logger } from '../helper/logger';

// types
import { LuckyDrawEvent, WinningPrize } from '../type/lucky-draw';
import { PageInfo } from '../type/common.ts';

// APIs
import {
  getPrizePoolNowApi,
  getTicketsMe,
  getWinningPrizesApi,
} from '../rest-api/lucky-draw';

const log = new Logger('LuckyDrawState');

export type LuckyDrawState = {
  tickets: number;
  prizePoolNow: LuckyDrawEvent | null;
  winningPrizes: WinningPrize[];
  pageInfo: Omit<PageInfo<WinningPrize[]>, 'results'>;
};

const initialState: LuckyDrawState = {
  tickets: 0,
  prizePoolNow: null,
  winningPrizes: [],
  pageInfo: { limit: 0, page: 0, totalPages: 0, totalResults: 0 },
};

const luckyDrawSlice = createSlice({
  name: 'lucky-draw',
  initialState,
  reducers: {
    setUserTickets: (state, action: PayloadAction<number>) => {
      state.tickets = action.payload;
    },
    setPrizePoolNow: (state, action: PayloadAction<LuckyDrawEvent>) => {
      state.prizePoolNow = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchWinningPrizes.fulfilled, (state, action) => {
      const { results, ...pageInfo } = action.payload || {
        results: [],
        limit: 0,
        page: 0,
        totalPages: 0,
        totalResults: 0,
      };
      state.winningPrizes = results || [];
      state.pageInfo = pageInfo;
    });
  },
});

export const getUserTickets = () => async (dispatch: StoreDispatch) => {
  try {
    const res = await getTicketsMe({ isUsed: false });
    if (res) dispatch(setUserTickets(res.totalResults));
  } catch (error) {
    log.error(error);
  }
};

export const getPrizePoolNow = () => async (dispatch: StoreDispatch) => {
  try {
    const res = await getPrizePoolNowApi();
    if (res) dispatch(setPrizePoolNow(res));
  } catch (error) {
    log.error(error);
  }
};

export const fetchWinningPrizes = createAsyncThunk(
  'luckyDraw/fetchWinningPrizes',
  async (params: string): Promise<PageInfo<WinningPrize[]> | undefined> => {
    const res = await getWinningPrizesApi(params);
    log.debug('res winningPrizes', res);
    return res;
  }
);

export const { setUserTickets, setPrizePoolNow } = luckyDrawSlice.actions;
export default luckyDrawSlice;
