import { MessageOptional } from './message';
import { User } from './auth.ts';

export enum SidebarMenuEnum {
  INBOX = 'inbox',
  SEND = 'send',
  TRASH = 'trash',
}

export type StatusMailVault = 'WAITING' | 'COMPLETED' | 'DRAFT';
export type TypeMailVault = 'MAIL' | 'VAULT';

export type FormCreateCompose = {
  verifyReminderDays?: number;
  sendAfterDays?: number;
  type: TypeMailVault;
  status: StatusMailVault;
  email: string;
  subject: string;
  content: string;
  memo?: string;
  files: {
    base64: string;
    optional: MessageOptional;
  }[];
  senderEncryptedMailSecret: string;
  peerEncryptedMailSecret: ParticipantMail[] | null;
  transactionHash?: string;
};

export type ParticipantMail = {
  userId: string;
  user: User;
  peerEncryptedMailSecret: string;
};

export type ResponseCreateCompose = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  verifyReminderDays: number;
  sendAfterDays: number;
  type: TypeMailVault;
  status: StatusMailVault;
  isDeleted: false;
};

export type MailConversation = {
  isImportant: boolean;
  isStarred: boolean;
  isRead: boolean;
  mailConversationUserRead: MailConversationUserRead[] | [];
  id: string;
  createdAt: string;
  updatedAt: string;
  verifyReminderDays: number | null;
  sendAfterDays: number | null;
  type: TypeMailVault;
  status: string;
  isDeleted: boolean;
  encryptedMailSecrets: EncryptedMailSecrets[];
  participant: ParticipantMail[];
  mailConversationMessage: MailConversationMessage[];
};

export type MailConversationUserRead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  mailConversation: MailConversation;
  mailConversationId: string;
  user: User;
  userId: string;
  timestamp: string;
};

export type EncryptedMailSecrets = {
  id: string;
  createdAt: string;
  updatedAt: string;
  mailConversationId: string;
  userId: string;
  senderEncryptedMailSecret: string;
  peerEncryptedMailSecret: ParticipantMail[];
};

export type MailConversationMessage = {
  id: string;
  createdAt: string;
  updatedAt: string;
  senderUserId: string;
  senderUser: User;
  mailConversationId: string;
  subject: string;
  memo?: string;
  content: string;
  files: FileMail[];
  transactionHash: string | null;
};

export type OptionalFileInfo = {
  fileSize: number;
  fileName: string;
  fileType: string;
  lastModified: number;
  pageCount: number | null;
};

export type FileInfo = {
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

export type FileMail = {
  content: string;
  optional: OptionalFileInfo;
  infos: FileInfo;
};

export type SelectedFileMail = {
  base64: string;
  optional: MessageOptional;
};

export type ReplyMailPayload = {
  content: string;
  files: {
    base64: string;
    optional: MessageOptional;
  }[];
  transactionHash: string;
};
