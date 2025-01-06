import { User } from './auth';
import { PageInfo } from './common';
import { ConversationPayload } from './conversation';

export type AddContactValue = {
  walletAddress: string;
  reason: string;
  description: string;
  submitType: 0 | 1 | 2;
};

export type AddContactBody = {
  walletAddress: string;
  reason: string;
  description: string;
};

export type AddContactResponse = {
  walletAddress: string;
  reason: string;
  description: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  ownerId: string;
};

export type ContactPayload = {
  reason: string;
  description: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  ownerId: string;
  user: User;
  isBlockedByMe?: boolean;
  isRequested?: boolean;
  conversation: ConversationPayload;
  userNickname?: string;
};

export type GetContact = {
  contact: Contact;
};

export type Contact = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  reason: string;
  description: string;
  latestMessageDate: string | null;
  isDeleted: boolean;
  deletedAt: string;
  ownerId: string;
};

export type ContactHiddenWithPagination = PageInfo<ContactHidden[]>;

export type ContactHidden = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  contactId: string;
  contact: ContactPayload;
  user: User;
  hiderId: string;
};
