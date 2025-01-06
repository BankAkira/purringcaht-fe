import { User } from './auth';
import { ContactPayload } from './contact';
import { ConversationRequestPayload } from './conversation-requests';
import { Dispute } from './dispute';

export enum ConversationMenuTab {
  DIRECT = 'direct',
  DIRECT_REQUEST = 'direct-request',
  GROUP = 'group',
  GROUP_INVITE = 'group-invite',
  CONTACTS = 'contacts',
  DISPUTE = 'dispute',
}

export enum ConversationRequestType {
  MESSAGE_REQUEST = 'MESSAGE_REQUEST',
  GROUP_REQUEST = 'GROUP_REQUEST',
  UPDATE_ROLE = 'UPDATE_ROLE',
}

export enum PathnameKeyword {
  ADD = 'add',
}

export enum ConversationType {
  DM = 'DM',
  GROUP = 'GROUP',
}

export enum ConversationRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export type ConversationPayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  latestMessageDate?: string;
  name: string;
  description: string;
  type: ConversationType;
  isEnabled: boolean;
  isBlocked: boolean;
  isBlockedByMe: boolean;
  isDeleted: boolean;
  isDeleteByMe: boolean;
  isDispute: boolean;
  participants: Participant[];
  unreadCount: number;
  lastestMessageDate: string;
  profilePicture?: string;
  userNickname?: string;
  Dispute?: Dispute[] | [] | null;
  platformType?: string;
};

export type SentConversationRequestResponse = ConversationPayload & {
  conversationRequests: ConversationRequestPayload[];
};

export type CreateConversationBody = {
  userIds: string[];
  name?: string;
  conversationId?: string;
  description?: string;
  reason?: string;
  type: ConversationType;
  profilePicture?: string;
};

export type Participant = {
  id: string;
  contact: ContactPayload | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  conversationId: string;
  role: ConversationRole;
  user: User;
  userNickname?: string;
};

export type ConversationUserDeletePayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  userId: string;
  timestamp: string;
  isEnabled: boolean;
};

export type ConversationOfficialPayload = {
  myEncryptedChatSecret: string;
  peerEncryptedChatSecret: string;
  peerUserId: string;
  officialId: string;
};
