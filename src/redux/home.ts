import { createSlice } from '@reduxjs/toolkit';

export type HomeReducerState = {
  alertMessage: {
    message: string | null;
    name: string | null;
    time: number | 2000;
  } | null;
};

const initialState: HomeReducerState = {
  alertMessage: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.alertMessage = action.payload;
    },
    clearAlert: state => {
      state.alertMessage = null;
    },
  },
});

export const { showAlert, clearAlert } = homeSlice.actions;
export default homeSlice;
