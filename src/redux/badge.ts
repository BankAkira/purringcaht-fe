import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreDispatch, StoreGetState } from '.';
import ccc_meow from '../asset/sound/ccc_meow.mp3';
import tab_sound from '../asset/sound/tap-notification.mp3';
import { ConversationType, CreateConversationBody } from '../type/conversation';
import {
  createConversationRequestApi,
  getConversationByIdApi,
} from '../rest-api/conversation';
import { errorFormat } from '../helper/error-format';
import { Logger } from '../helper/logger';
import { User } from '../type/auth';
import { ChatBadge } from '../type/chat';
import { debounce } from 'lodash';
import { Howl } from 'howler';

const log = new Logger('badge.ts');

const meowSound = new Howl({
  src: [ccc_meow],
});

const tabSound = new Howl({
  src: [tab_sound],
});

export type ReducerState = {
  dmCount: number;
  dmRequestCount: number;
  groupCount: number;
  groupRequestCount: number;
  unreadDmCount: number;
  unreadGroupCount: number;
  totalCount: number;
  firstInitialize: boolean;
};

const initialState: ReducerState = {
  dmCount: 0,
  dmRequestCount: 0,
  groupCount: 0,
  groupRequestCount: 0,
  unreadDmCount: 0,
  unreadGroupCount: 0,
  totalCount: 0,
  firstInitialize: true,
};

const slice = createSlice({
  name: 'chatBadge',
  initialState,
  reducers: {
    setBadge: (
      state,
      action: PayloadAction<Omit<ReducerState, 'firstInitialize'>>
    ) => {
      state.unreadGroupCount = action.payload.unreadGroupCount;
      state.unreadDmCount = action.payload.unreadDmCount;
      state.dmCount = action.payload.dmCount;
      state.dmRequestCount = action.payload.dmRequestCount;
      state.groupCount = action.payload.groupCount;
      state.groupRequestCount = action.payload.groupRequestCount;
      state.totalCount = action.payload.totalCount;
    },
    setFirstInitializeDone: state => {
      state.firstInitialize = false;
    },
    setDefaultChatBadgeState: () => initialState,
  },
});

export const handleCreateChat = async (
  userMe: User | null,
  conversationId?: string
) => {
  try {
    if (!conversationId) {
      log.error('Contact not found');
      return;
    }

    const conversation = await getConversationByIdApi(conversationId);

    if (conversation) {
      const participants =
        conversation?.type === ConversationType.GROUP
          ? conversation?.participants.find(item => item.userId === userMe?.id)
          : conversation?.participants.find(item => item.userId !== userMe?.id);

      if (participants) {
        const contact = conversation?.participants.find(
          item => item.userId !== userMe?.id
        )?.contact;
        const body: CreateConversationBody = {
          conversationId: conversation?.id,
          userIds: [participants.userId],
          description: contact?.description,
          reason: contact?.reason,
          type: conversation?.type || ConversationType.DM,
        };

        const createdResp = await createConversationRequestApi(body);
        if (!createdResp?.conversationRequests[0].id) {
          log.error('Request is error');
          return;
        } else {
          return conversation?.type || ConversationType.DM;
        }
      }
    }
  } catch (error) {
    log.error(errorFormat(error).message);
    return;
  }
};

const playSound = debounce((isTabSound?: boolean) => {
  if (isTabSound) {
    tabSound.play();
  } else {
    meowSound.play();
  }
}, 800);

export const updateBadge =
  (incomingBadge: ChatBadge) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { user } = getState().account;
    const { currentPath } = getState().layout;
    try {
      const { totalCount, firstInitialize } = getState().badge;
      const isMessageFromCurrentChat =
        currentPath?.includes('/chat') &&
        currentPath?.includes(`/${incomingBadge.payload?.conversationId}`);

      const newTotalCount =
        incomingBadge.unreadDmCount +
        incomingBadge.dmRequestCount +
        incomingBadge.unreadGroupCount +
        incomingBadge.groupRequestCount;

      const newTotalGroup =
        incomingBadge.groupRequestCount + incomingBadge.unreadGroupCount;
      const newTotalDm =
        incomingBadge.unreadDmCount + incomingBadge.dmRequestCount;

      if (newTotalCount > totalCount && !firstInitialize) {
        if (user?.userSetting?.isNotificationAccountActivity) {
          if (
            incomingBadge?.payload?.type === ConversationType.DM
              ? !user?.userSetting?.muteUsers?.includes(
                  incomingBadge.payload?.senderId || ''
                )
              : !user?.userSetting?.muteConversationGroups?.includes(
                  incomingBadge.payload?.conversationId || ''
                )
          ) {
            playSound(isMessageFromCurrentChat);
          }
        }
      }

      const badgeState: Omit<ReducerState, 'firstInitialize'> = {
        ...incomingBadge,
        totalCount: newTotalCount,
        unreadGroupCount: newTotalGroup,
        unreadDmCount: newTotalDm,
      };
      dispatch(setBadge(badgeState));
      dispatch(setFirstInitializeDone());
    } catch (error) {
      dispatch(setDefaultChatBadgeState());
    }
  };

export const { setBadge, setDefaultChatBadgeState, setFirstInitializeDone } =
  slice.actions;

export default slice;
