import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Logger } from '../helper/logger';
import { StoreDispatch } from '.';
import { getUserPoint } from '../rest-api/point';
import { pointPurrKit } from '../helper/point';
import { getUserInfoApi } from '../rest-api/user';
import { initializeAccountSuccess } from './account';
const log = new Logger('UserPointState');

export type UserPointState = {
  points: number;
};

const initialState: UserPointState = {
  points: 0,
};

const userPointSlice = createSlice({
  name: 'user-point',
  initialState,
  reducers: {
    setUserPoint: (state, action: PayloadAction<number>) => {
      state.points = pointPurrKit(action.payload);
    },
  },
});

export const getUserPoints = () => async (dispatch: StoreDispatch) => {
  try {
    const resUserPoint = await getUserPoint();
    const userInfo = await getUserInfoApi();
    if (userInfo) dispatch(initializeAccountSuccess({ user: userInfo }));
    if (resUserPoint) dispatch(setUserPoint(resUserPoint.point));
  } catch (error) {
    log.error(error);
  }
};

export const { setUserPoint } = userPointSlice.actions;
export default userPointSlice;
