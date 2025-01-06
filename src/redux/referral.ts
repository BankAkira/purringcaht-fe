import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ReferralState = {
  param: string | null;
  refcode: string | null;
};

const initialState: ReferralState = {
  param: null,
  refcode: null,
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setReferralCode: (state, action: PayloadAction<string>) => {
      state.refcode = action.payload;
    },
  },
});

export const { setReferralCode } = referralSlice.actions;
export default referralSlice;
