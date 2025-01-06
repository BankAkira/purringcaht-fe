import { PageInfo, ResponseInfo } from './common';
import { ConversationPayload, ConversationType } from './conversation';
import { EncryptedUserSecretPayload } from './crypto';
import { Follower } from './follow';
import { MessageContentType, MessagePayload } from './message';
import { UserRole } from './role';
import { UserSetting } from './setting';

export type JwtToken = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  isPolicy: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  walletAddress: string;
  displayId: string;
  displayName: string;
  nickname?: string;
  displayNameUpdatedAt: string;
  picture: string;
  isFollower?: Follower | null;
  isInitProfile: boolean;
  followers?: number;
  following?: number;
  userSetting?: UserSetting;
  userSettings?: UserSetting;
  userNickname?: string;
  referralCode?: UserReferral;
  isShowDisplayId?: UserSetting;
  role: UserRole;
  encryptedUserSecrets?: EncryptedUserSecretPayload[];
};

export type UserReferral = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  refCode: string;
};

export type ValidateWalletResponse = {
  user: User;
  msg: string;
};

export type SignInResponse = {
  user: User;
  tokens: JwtToken;
};

export type UpdateUserPayload = {
  walletAddress?: string;
  displayId?: string;
  displayName?: string;
  email?: string;
  picture?: string;
  isInitProfile?: boolean;
  fcmToken?: string;
  referralCode?: string | null;
  platformId?: string | null;
};

export type UserBlockedWithPagination = PageInfo<UserBlocked[]>;
export type GroupBlockedWithPagination = PageInfo<GroupBlocked[]>;

export type UserBlocked = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  blockerId: string;
};
export type GroupBlocked = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  conversation: ConversationPayload;
  blockerId: string;
};

export type reportUserResp = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  reporterId: string;
  type: string;
  reason: string;
  description: string;
};

export type reportUserPayload = {
  fromUserId: string;
  toUserId: string;
  annotation: string;
  violationPointId: string;
  violationPointName: string;
  message?: MessagePayload;
  type: ConversationType | MessageContentType;
};

export type ViolationPointConfigResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: ViolationPointConfigName;
  type: string;
  point: number;
};
export type ViolationPointConfigName =
  | 'Discrimination'
  | 'Honesty and Truthfulness'
  | 'No Harmful Content'
  | 'No Hate Speech'
  | 'No Plagiarism'
  | 'No Pornography'
  | 'Others'
  | 'Positive Engagement'
  | 'Respect for Intellectual Property'
  | 'Respect for Privacy'
  | 'Zero Tolerance for Fraud';

export type UserReportFromSB_Resp = ResponseInfo & {
  data: PageInfo<UserReportFromSB[]>;
};

export type UserReportFromSB = {
  id: string;
  createdAt: string;
  updatedAt: string;
  violationPointId: string;
  violationPointName: string;
  postId?: string;
  commentId?: string;
  replyCommentId?: string;
  fromUserId: string;
  toUserId: string;
  annotation: string;
  voteAgreementScore: number;
  voteDisagreementScore: number;
  isConfirmed: boolean;
  status: string;
};
