import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BugBountyPayload, ConfirmReportBug } from '../type/bug-bounty';

export type BugBountyState = {
  posts: Array<BugBountyPayload>;
  comments: Array<ConfirmReportBug>;
  isLoading: boolean;
  error: string | null;
};

const initialState: BugBountyState = {
  posts: [],
  comments: [],
  isLoading: false,
  error: null,
};

const bugBountySlice = createSlice({
  name: 'bugBounty',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Array<BugBountyPayload>>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<BugBountyPayload>) {
      state.posts.unshift(action.payload);
    },
    setComments(state, action: PayloadAction<Array<ConfirmReportBug>>) {
      state.comments = action.payload;
    },
    addComment(state, action: PayloadAction<ConfirmReportBug>) {
      state.comments.unshift(action.payload);
    },
    addComments(state, action: PayloadAction<Array<ConfirmReportBug>>) {
      state.comments = [...state.comments, ...action.payload];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  setComments,
  addComment,
  addComments,
  setLoading,
  setError,
} = bugBountySlice.actions;
export default bugBountySlice;
