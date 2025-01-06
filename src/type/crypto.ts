export type EncryptedUserSecret = {
  encryptedUserSecret: string;
  publicKeyPrefix: boolean;
  publicKeyX: string;
  address: string;
};

export type EncryptedUserSecretPayload = EncryptedUserSecret & {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  address: string;
};

export type DmEncryptedChatSecret = {
  myEncryptedChatSecret: string;
  peerEncryptedChatSecret: string;
  peerUserId: string;
  conversationId: string;
};

export type DmEncryptedChatSecretPayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  userId: string;
  peerUserId: string;
  myEncryptedChatSecret: string;
  peerEncryptedChatSecret: string;
};

export type GroupEncryptedChatSecret = {
  groupEncryptedChatSecret: string;
  conversationId: string;
};

export type UserEncryptedSecret = {
  address: string;
  encryptedUserSecret: string;
  publicKeyPrefix: boolean;
  publicKeyX: string;
  updatedAt: Date;
  createdAt: Date;
};
