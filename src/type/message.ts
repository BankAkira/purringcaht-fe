import { User } from './auth';
import { MailConversation } from './purr-mail';

export enum MessageContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  STICKER = 'STICKER',
  DISPUTED = 'DISPUTED',
  NOTIFICATION = 'NOTIFICATION',
}

export type MessagePayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  conversationId: string;
  content: string;
  contentType: MessageContentType;
  optional?: MessageOptional;
  infos?: unknown;
  sendedDate: string;
  expiredDate: string;
  isDeleted: boolean;
  isUnsent?: boolean;
  deletedDate: string;
  sender: User;
  isDecrypted?: boolean;
};

export type SendMessageBody = {
  content: string;
  contentType: MessageContentType;
  optional?: MessageOptional;
  sendedDateTime: number;
  senderId?: string;
};

export type SendingMessageState = Omit<SendMessageBody, 'sendedDateTime'>;

export type IncomingMessage = {
  content: string;
  contentType: MessageContentType;
  conversationId: string;
  conversationIsDeleted?: false;
  id: string;
  isDeleted: boolean;
  sender: User;
  senderId: string;
  timestamp: number;
};

export type UnsentMessage = {
  content: string;
  contentType: MessageContentType;
  conversationId: string;
  id: string;
  isDeleted: boolean;
  isUnsent: boolean;
  senderId: string;
};

export type LatestMessageRead = {
  user: LatestMessageReader;
  timestamp: number;
};

export type LatestMessageReader = {
  displayId: string;
  displayName: string;
  gender: string;
  id: string;
  isInitProfile: boolean;
  picture: string;
  role: string;
  walletAddress: string;
};

export type Sticker = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stickerCategoryId: string;
};

export type MessageOptional = {
  fileSize?: number;
  fileName?: string;
  fileType?: string;
  lastModified?: number;
  pageCount?: number | null;
  stickerInfo?: Sticker;
};

export type SelectedFile = {
  file: File;
  optional: MessageOptional;
};

export type SelectedFileDispute = {
  base64: string;
  optional: MessageOptional;
};

export type UpdateConversationPayload = {
  name?: string;
  description?: string;
  profilePicture?: string;
  isEnabled?: boolean;
};

export type ContentMessageNotification = {
  name: 'notiVerifyMailVault' | string;
  model: 'string';
  value: string;
};
export type ContentMessageChatBotMailVault = ContentMessageNotification & {
  data?: MailConversation;
};
