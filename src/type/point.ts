import { User } from './auth';
import { PageInfo } from './common';
import { PointLogType } from './referral';
export type GetPointLogs = PageInfo<PointLog[]>;

export type UserPoint = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  point: number;
};
export type UserPointState = {
  point: number;
};

export type PointLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userPointId: string;
  amount: number;
  extraData: unknown;
  isOutcome?: boolean;
  type: PointLogType;
};

export type TransactionLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  pointLogId: string;
  type: string;
  user: User;
  pointLog: PointLog;
};
