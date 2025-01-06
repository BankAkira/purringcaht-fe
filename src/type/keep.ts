import { MessageContentType } from './message';

export type KeepFile = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  conversationId: string;
  conversationMessageId: string;
  fileName: string;
  fileSize: number;
  conversationMessage: KeepConversationMessage;
  encryptedChatSecret: string;
};

export type KeepConversationMessage = {
  id: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  conversationId: string;
  content: string;
  decryptedContent?: string;
  contentType: MessageContentType;
  optional: {
    fileSize: number;
    fileName: string;
    fileType: string;
    lastModified: number;
  };
  infos: KeepInfos;
  sendedDate: string;
  expiredDate: string;
  isDeleted: boolean;
  deletedDate: string;
  conversation: KeepConversation;
};

export type KeepInfos = {
  type: string;
  bucket: string;
  generation: string;
  metageneration: string;
  fullPath: string;
  name: string;
  size: number;
  timeCreated: string;
  updated: string;
  md5Hash: string;
  contentDisposition: string;
  contentEncoding: string;
  contentType: string;
};

export type KeepConversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  type: string;
  profilePicture: string;
  isEnabled: boolean;
};
