import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import {
  configureStore,
  combineReducers,
  CombinedState,
  Reducer,
} from '@reduxjs/toolkit';
import layoutSlice, { LayoutReducerState } from './layout';
import homeSlice, { HomeReducerState } from './home';
import referralSlice, { ReferralState } from './referral';
import followSlice, { FollowState } from './follow';
import userPointSlice, { UserPointState } from './user-point';
import luckyDrawSlice, { LuckyDrawState } from './lucky-draw';
import accountSlice, { AccountReducerState } from './account';
import contactSlice, { ReducerState as ContactReducerState } from './contact';
import conversationRequestSlice, {
  ReducerState as ConversationRequestReducerState,
} from './conversation-request';
import conversationSlice, {
  ReducerState as ConversationReducerState,
} from './conversation';
import conversationDisputeSlice, {
  ReducerState as ConversationDisputeReducerState,
} from './conversation-dispute';
import lightBoxSlice, { LightBoxReducerState } from './lightbox';
import lightBoxFileSlice, { LightBoxFileReducerState } from './lightbox-file';
import conversationLayoutSlice, {
  ConversationLayoutReducerState,
} from './convesation-layout';
import nftSlice, { NftReducerState } from './nft';
import firebaseSlice, { FirebaseReducerState } from './firebase';
import messageSlice, { MessageReducerState } from './message';
import purrMailSlice, { PurrMailReducerState } from './purr-mail';
import messageDisputeSlice, {
  MessageDisputeReducerState,
} from './message-dispute';
import conversationSideInfoSlice, {
  ReducerState as ConversationSideInfoReducerState,
} from './conversation-side-info';
import conversationSideInfoDisputeSlice, {
  ReducerState as ConversationSideInfoDisputeReducerState,
} from './conversation-side-info-dispute';
import badgeSlice, { ReducerState as BadgeReducerState } from './badge';
import violationPointSlice, {
  ViolationPointReducerState,
} from './violation-point';
import bugBountySlice, { BugBountyState } from './bug-bounty';
import chatBotMailVaultSlice, {
  ChatBotMailVaultState,
} from './chatbot-mail-vault';

export type ReduxRootState = {
  layout: LayoutReducerState;
  home: HomeReducerState;
  account: AccountReducerState;
  contact: ContactReducerState;
  lightBox: LightBoxReducerState;
  lightBoxFile: LightBoxFileReducerState;
  conversationLayout: ConversationLayoutReducerState;
  conversationRequest: ConversationRequestReducerState;
  conversation: ConversationReducerState;
  conversationDispute: ConversationDisputeReducerState;
  firebase: FirebaseReducerState;
  message: MessageReducerState;
  purrMail: PurrMailReducerState;
  messageDispute: MessageDisputeReducerState;
  conversationSideInfo: ConversationSideInfoReducerState;
  conversationSideInfoDispute: ConversationSideInfoDisputeReducerState;
  badge: BadgeReducerState;
  violationPoint: ViolationPointReducerState;
  referral: ReferralState;
  follow: FollowState;
  userPoint: UserPointState;
  luckyDraw: LuckyDrawState;
  bugBounty: BugBountyState;
  nft: NftReducerState;
  chatBotMailVault: ChatBotMailVaultState;
};

const rootReducer: Reducer<CombinedState<ReduxRootState>> = combineReducers({
  layout: layoutSlice.reducer,
  home: homeSlice.reducer,
  account: accountSlice.reducer,
  contact: contactSlice.reducer,
  lightBox: lightBoxSlice.reducer,
  lightBoxFile: lightBoxFileSlice.reducer,
  conversationLayout: conversationLayoutSlice.reducer,
  conversationRequest: conversationRequestSlice.reducer,
  conversation: conversationSlice.reducer,
  conversationDispute: conversationDisputeSlice.reducer,
  firebase: firebaseSlice.reducer,
  message: messageSlice.reducer,
  purrMail: purrMailSlice.reducer,
  messageDispute: messageDisputeSlice.reducer,
  conversationSideInfo: conversationSideInfoSlice.reducer,
  conversationSideInfoDispute: conversationSideInfoDisputeSlice.reducer,
  badge: badgeSlice.reducer,
  violationPoint: violationPointSlice.reducer,
  referral: referralSlice.reducer,
  userPoint: userPointSlice.reducer,
  luckyDraw: luckyDrawSlice.reducer,
  follow: followSlice.reducer,
  bugBounty: bugBountySlice.reducer,
  nft: nftSlice.reducer,
  chatBotMailVault: chatBotMailVaultSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;

export const useDispatch: () => StoreDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<ReduxRootState> =
  useReduxSelector;

export type RootState = ReturnType<typeof rootReducer>;

export default store;
