import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SuggestUser } from '../type/user';
import { StoreDispatch } from '.';

import { Logger } from '../helper/logger';
import { getSuggestFollowing } from '../rest-api/user';
import { GetFollowerUser } from '../type/follow';
import { getFollowingMe, getFollowerMe } from '../rest-api/follow';

const log = new Logger('FollowState');

export type FollowState = {
  suggestUsers: SuggestUser[] | [];
  myFollowingUsers: GetFollowerUser | null;
  myFollowerUsers: GetFollowerUser | null;
};

const initialState: FollowState = {
  suggestUsers: [],
  myFollowingUsers: null,
  myFollowerUsers: null,
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    setSuggestUser: (state, action: PayloadAction<SuggestUser[]>) => {
      state.suggestUsers = action.payload;
    },
    setFollowingUser: (state, action: PayloadAction<GetFollowerUser>) => {
      state.myFollowingUsers = action.payload;
    },
    setFollowerUser: (state, action: PayloadAction<GetFollowerUser>) => {
      state.myFollowerUsers = action.payload;
    },
  },
});

export const getSuggestUser = () => async (dispatch: StoreDispatch) => {
  try {
    const res = await getSuggestFollowing({ limit: 5 });
    if (res) {
      dispatch(setSuggestUser(res?.results));
    }
  } catch (error) {
    log.error('error', error);
  }
};
export const fetchFollowingMe = () => async (dispatch: StoreDispatch) => {
  try {
    const res = await getFollowingMe({ limit: 20 });
    if (res) {
      dispatch(setFollowingUser(res));
    }
  } catch (error) {
    log.error('error', error);
  }
};

export const fetchFollowerMe = () => async (dispatch: StoreDispatch) => {
  try {
    const res = await getFollowerMe({ limit: 20 });
    if (res) {
      dispatch(setFollowerUser(res));
    }
  } catch (error) {
    log.error('error', error);
  }
};

export const { setSuggestUser, setFollowingUser, setFollowerUser } =
  followSlice.actions;
export default followSlice;
