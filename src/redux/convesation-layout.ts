import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ConversationMenuTab } from '../type/conversation';
import { StoreDispatch, StoreGetState } from '.';

export type ConversationLayoutReducerState = {
  activeTab: ConversationMenuTab | null;
  isOpenAddSection: boolean;
  isOpenMobileControlSidebar: boolean;
  isOpenMobileChatInfo: boolean;
};

const initialState: ConversationLayoutReducerState = {
  activeTab: null,
  isOpenAddSection: false,
  isOpenMobileControlSidebar: true,
  isOpenMobileChatInfo: false,
};

const conversationLayoutSlice = createSlice({
  name: 'conversation-layout',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ConversationMenuTab>) => {
      state.activeTab = action.payload;
    },
    setIsOpenAddSection: (state, action: PayloadAction<boolean>) => {
      state.isOpenAddSection = action.payload;
    },
    toggleMobileControlSidebar: state => {
      state.isOpenMobileControlSidebar = !state.isOpenMobileControlSidebar;
    },
    setIsOpenMobileControlSidebar: (state, action: PayloadAction<boolean>) => {
      state.isOpenMobileControlSidebar = action.payload;
    },
    toggleMobileChatInfo: state => {
      state.isOpenMobileChatInfo = !state.isOpenMobileChatInfo;
    },
  },
});

export const toggleMobileControlSidebarAction =
  () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { isOpenMobileChatInfo } = getState().conversationLayout;
    if (isOpenMobileChatInfo) {
      dispatch(toggleMobileChatInfo());
    }
    dispatch(toggleMobileControlSidebar());
  };

export const {
  setActiveTab,
  setIsOpenAddSection,
  toggleMobileControlSidebar,
  setIsOpenMobileControlSidebar,
  toggleMobileChatInfo,
} = conversationLayoutSlice.actions;
export default conversationLayoutSlice;
