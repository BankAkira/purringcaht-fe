import { ConversationType } from './conversation';

export type AvatarProps = {
  noCursorPointer?: boolean;
  isMute?: boolean;
  img: string | string[];
  name?: string;
  memberCount?: number;
  text?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  isShowTextStatus?: boolean;
  isChatProfile?: boolean;
  chatBubble?: ChatBubblePropsForAvatar;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
};

export type ChatBubblePropsForAvatar = {
  message?: string;
  isSender?: boolean;
  fileDetails?: FileDetailsType;
  maxWidth?: number;
  date?: Date;
};

export type ChatBubbleProps = {
  message?: string;
  isSender: boolean;
  fileDetails?: FileDetailsType;
  maxWidth?: number;
};

export type FileDetailsType = {
  name: string;
  page: string;
  size: string;
  type: string;
};

export enum GlobalSearchType {
  DM = 'DM',
  GROUP = 'GROUP',
  CONTACT = 'CONTACT',
  REQUEST = 'REQUEST',
}

export type ChatBadge = {
  dmCount: number;
  dmRequestCount: number;
  groupCount: number;
  groupRequestCount: number;
  unreadDmCount: number;
  unreadGroupCount: number;
  payload?: {
    conversationId: string;
    senderId: string;
    type: ConversationType;
  };
};
