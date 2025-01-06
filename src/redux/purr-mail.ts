// import (Internal imports)
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// helper functions
import { Logger } from '../helper/logger';
import { CryptoAES256 } from '../helper/rsa-crypto';

// types
import { MailConversation, MailConversationMessage, PageInfo } from '../type';

// APIs
import { getConversationMails } from '../rest-api/purr-mail.ts';

const log = new Logger('PurrMailState');

export type PurrMailReducerState = {
  conversationMail: MailConversation | null;
  mailMessages: MailConversationMessage[] | [];
  mailScheme: CryptoAES256 | null;
  mailSecret: string | null;
  mailInboxes: MailConversation[];
  unreadMailCount: number;
  checkedItemsCount: number;
  isVisible: boolean;
};

const initialState: PurrMailReducerState = {
  conversationMail: null,
  mailMessages: [],
  mailScheme: null,
  mailSecret: null,
  mailInboxes: [],
  unreadMailCount: 0,
  checkedItemsCount: 0,
  isVisible: true,
};

const purrMailSlice = createSlice({
  name: 'purrMail',
  initialState,
  reducers: {
    initializeMailSchemeAction: (
      state,
      action: PayloadAction<{ mailScheme: CryptoAES256 }>
    ) => ({
      ...state,
      mailScheme: action.payload.mailScheme,
    }),
    setMailSecret: (state, action: PayloadAction<{ mailSecret: string }>) => {
      state.mailSecret = action.payload.mailSecret;
    },
    setConversationMail: (state, action: PayloadAction<MailConversation>) => ({
      ...state,
      conversationMail: action.payload,
    }),
    setMailMessages: (
      state,
      action: PayloadAction<MailConversationMessage[]>
    ) => ({
      ...state,
      mailMessages: action.payload,
    }),
    setMailInboxes: (state, action: PayloadAction<MailConversation[]>) => {
      state.mailInboxes = action.payload;
    },
    setUnreadMails: (state, action: PayloadAction<number>) => {
      state.unreadMailCount = action.payload;
    },
    setCheckedItemsCount: (state, action: PayloadAction<number>) => {
      state.checkedItemsCount = action.payload;
    },
    toggleVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUnreadConversations.fulfilled, (state, action) => {
      state.unreadMailCount = action.payload.totalResults;
    });
    builder.addCase(fetchUnreadConversations.rejected, (_state, action) => {
      log.error('Error fetching unread conversations:', action.payload);
    });
  },
});

export const fetchUnreadConversations = createAsyncThunk(
  'mail/fetchUnreadConversations',
  async (
    { isOwner, isRead }: { isOwner: boolean; isRead: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response: PageInfo<MailConversation[]> = await getConversationMails(
        { isOwner, isRead }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const {
  setConversationMail,
  setMailMessages,
  initializeMailSchemeAction,
  setMailSecret,
  setMailInboxes,
  setUnreadMails,
  setCheckedItemsCount,
  toggleVisibility,
} = purrMailSlice.actions;

export default purrMailSlice;
