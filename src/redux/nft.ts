import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreDispatch } from '.';

export type NftReducerState = {
  tabClick: string;
};

const initialState: NftReducerState = {
  tabClick: 'My NFTs',
};

const nftSlice = createSlice({
  name: 'nftBar',
  initialState,
  reducers: {
    tabChange: (state: NftReducerState, action: PayloadAction<string>) => {
      state.tabClick = action.payload;
    },
  },
});

export const tabBarAction =
  (tab: string) => async (dispatch: StoreDispatch) => {
    dispatch(tabChange(tab));
  };

export const { tabChange } = nftSlice.actions;
export default nftSlice;
