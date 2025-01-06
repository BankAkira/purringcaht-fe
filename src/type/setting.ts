export enum SettingMenuEnum {
  MY_ACCOUNT = 'my-account',
  REFERRAL = 'referral',
  BLOCKED_LIST = 'blocked-list',
  HIDDEN_LIST = 'hidden-list',
  PURCHASE_CHA_POINTS = 'purchase-cha-points',
  STORAGE = 'storage',
  BILLING = 'billing',
  POINTS = 'points',
}

export type UserSetting = UpdateUserSettingPayload & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserSettingPayload = {
  isInvisible?: boolean;
  isNotificationCatChaChatCommunication?: boolean;
  isNotificationAccountActivity?: boolean;
  isOnline?: boolean;
  muteUsers?: string[];
  muteConversationGroups?: string[];
  isShowDisplayId?: boolean;
};
