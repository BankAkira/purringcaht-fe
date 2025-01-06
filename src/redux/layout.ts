import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type LayoutReducerState = {
  isOpenSidebar: boolean;
  isShowLoader: boolean;
  isOpenSwitchChainModal: boolean;
  metamaskChainId: number;
  currentPath: string | null;
  isOpenAddOfficialModal?: boolean;
};

const initialState: LayoutReducerState = {
  isOpenSidebar: false,
  isShowLoader: false,
  isOpenSwitchChainModal: false,
  metamaskChainId: 0,
  currentPath: null,
  isOpenAddOfficialModal: false,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
    toggleIsShowLoader: (state, action: PayloadAction<boolean>) => {
      state.isShowLoader = action.payload;
    },
    setIsOpenSwitchChainModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenSwitchChainModal = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setMetamaskChainId: (state, action: PayloadAction<number>) => {
      state.metamaskChainId = action.payload;
    },
    setIsOpenAddOfficialModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenAddOfficialModal = action.payload;
    },
  },
});

export const {
  toggleIsOpenSidebar,
  toggleIsShowLoader,
  setIsOpenSwitchChainModal,
  setMetamaskChainId,
  setCurrentPath,
  setIsOpenAddOfficialModal,
} = layoutSlice.actions;
export default layoutSlice;
