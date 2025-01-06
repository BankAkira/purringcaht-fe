import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ContentMessageChatBotMailVault,
  ConversationPayload,
  MessageContentType,
  SendingMessageState,
  SendMessageBody,
} from '../type';
import { encryptMessage } from '../helper/crypto';
import { StoreDispatch, StoreGetState } from '.';
import environment from '../environment';
import moment from 'moment';
import { sendMessageAction } from './message';
import {
  deleteConversationMailById,
  verifyUserAliveConversationMailById,
} from '../rest-api/purr-mail';
import { showAlert } from './home';

export type ChatBotMailVaultState = {
  modalDeleteMailVault: boolean;
  modalConfirmDeleteMailVault: boolean;
  contentNotificationMailVault: ContentMessageChatBotMailVault | null;
};

const initialState: ChatBotMailVaultState = {
  modalDeleteMailVault: false,
  modalConfirmDeleteMailVault: false,
  contentNotificationMailVault: null,
};

const chatBotMailVaultSlice = createSlice({
  name: 'chatBotMailVault',
  initialState,
  reducers: {
    setModalConfirmDeleteMailVault: (state, action: PayloadAction<boolean>) => {
      state.modalConfirmDeleteMailVault = action.payload;
    },
    setModalDeleteMailVault: (state, action: PayloadAction<boolean>) => {
      state.modalDeleteMailVault = action.payload;
    },
    setContentNotificationMailVault: (
      state,
      action: PayloadAction<ContentMessageChatBotMailVault>
    ) => {
      state.contentNotificationMailVault = action.payload;
    },
    setDefaultChatBotMailVaultState: () => initialState,
  },
});

export const handleOpenModalDeleteMailVault =
  (textBot: string, content: ContentMessageChatBotMailVault) =>
  async (dispatch: StoreDispatch) => {
    dispatch(setContentNotificationMailVault(content));
    dispatch(sendMessage(textBot, true));
    dispatch(setModalDeleteMailVault(true));
  };
export const handleOpenModalConfirmDeleteMailVault =
  () => async (dispatch: StoreDispatch) => {
    dispatch(
      sendMessage(`Are you sure you want to delete this MailVault? `, true)
    );
    dispatch(sendMessage(`Yes, delete this mail`, false));
    dispatch(setModalDeleteMailVault(false));
    dispatch(setModalConfirmDeleteMailVault(true));
  };

const sendMessage =
  (textMessage: string, isBot: boolean) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { chatScheme, conversation } = getState().message;
    if (!conversation) return;

    const payload: SendingMessageState = {
      content: await encryptMessage(
        textMessage,
        MessageContentType.TEXT,
        chatScheme
      ),
      contentType: MessageContentType.TEXT,
    };

    const senderOfficial = await checkUserOfficial(conversation);
    const sendingMessage: SendMessageBody = {
      ...payload,
      senderId: senderOfficial.id,
      sendedDateTime: moment().valueOf(),
    };

    // Conditional logic to handle bot or me
    if (isBot) {
      await dispatch(sendMessageAction(sendingMessage, senderOfficial)); // Bot case
    } else {
      await dispatch(sendMessageAction(sendingMessage)); // Regular user case
    }
  };

export const handleMistakeChat =
  (textMe: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { contentNotificationMailVault } = getState().chatBotMailVault;
    // dispatch(sendMessage(textMe, false));
    dispatch(setModalDeleteMailVault(false));
    dispatch(setModalConfirmDeleteMailVault(false));
    if (contentNotificationMailVault) {
      dispatch(handleVerifyAlive(textMe, contentNotificationMailVault));
    }

    dispatch(setDefaultChatBotMailVaultState());
  };

export const handleVerifyAlive =
  (text: string, content: ContentMessageChatBotMailVault) =>
  async (dispatch: StoreDispatch) => {
    if (!content) return;
    try {
      dispatch(sendMessage(text, false));
      await verifyUserAliveConversationMailById(content.value);
    } catch (error) {
      dispatch(
        showAlert({
          name: `Something went wrong`,
          message: `This MailVault has been deleted permanently.`,
          time: 3000,
        })
      );
      dispatch(sendMessage(`Something went wrong`, true));
    }
  };

export const handleDeleteMailVault =
  (confirm: boolean) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { contentNotificationMailVault } = getState().chatBotMailVault;
    dispatch(
      sendMessage(
        `This action cannot be undone. You will lose your mail forever.
      Do you want to continue?`,
        true
      )
    );

    if (!confirm) {
      dispatch(handleMistakeChat(`No it's a mistake`));
      return;
    }

    dispatch(
      sendMessage(
        `Yes, I'm sure I want to delete this MailVault forever.`,
        false
      )
    );
    dispatch(setModalDeleteMailVault(false));
    dispatch(setModalConfirmDeleteMailVault(false));
    if (!contentNotificationMailVault) return;
    try {
      await deleteConversationMailById(contentNotificationMailVault.value);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      dispatch(
        sendMessage(`This MailVault has been deleted permanently.`, true)
      );
    }
  };

const checkUserOfficial = async (conversation: ConversationPayload) => {
  const userOfficial = conversation.participants
    .filter(e => e.user.email === environment.emailOfficialPurringChat)
    .map(e => e.user)[0];
  return userOfficial;
};

export const {
  setModalConfirmDeleteMailVault,
  setModalDeleteMailVault,
  setContentNotificationMailVault,
  setDefaultChatBotMailVaultState,
} = chatBotMailVaultSlice.actions;

export default chatBotMailVaultSlice;
