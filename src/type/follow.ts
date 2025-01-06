import { User } from './auth';
import { PageInfo } from './common';

export type FollowPayload = {
  followingUserId: string;
};

export type Follower = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  followingUserId: string;
  user?: User;
};

export type FollowerUser = Follower & {
  user: User;
  followingUser: User;
  isFollowedBack?: boolean;
};

export enum FollowMenuTap {
  FOLLOW = 'follow',
  FOLLOWING = 'following',
  FOLLOWER = 'follower',
}

export type GetFollowerUser = PageInfo<FollowerUser[]>;
