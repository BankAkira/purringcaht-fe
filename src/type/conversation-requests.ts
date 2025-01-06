import { User } from './auth';
import { ConversationPayload, ConversationRequestType } from './conversation';

export type ConversationRequestPayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: ConversationRequestType;
  conversationId: string | null;
  role: string | null;
  senderId: string;
  reason: string;
  description: string;
  answer: string | null;
  isAnswered: boolean;
  answeredDate: string | null;
  conversation: ConversationPayload | null;
  sender: User;
  userId: string;
  user: User;
};
