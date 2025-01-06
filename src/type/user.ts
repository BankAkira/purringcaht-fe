import { User } from './auth';
import { PageInfo } from './common';

export type GetUserSuggest = PageInfo<SuggestUser[]>;
export type GetUserAdmin = PageInfo<UserAdmin[]>;

export type SuggestUser = User & {
  _count: {
    followerUser: number;
    followingUser: number;
  };
};
export type UserSecret = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  encryptedUserSecret: string;
  publicKeyPrefix: boolean;
  publicKeyX: string;
  address: string;
};

export type UserAdmin = User & {
  encryptedUserSecrets: UserSecret[];
};
