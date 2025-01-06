import { PageInfo } from './common';
import { TransactionLog } from './point';

export type ReferralHistoryType = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  userPointId: string;
  amount: number;
  type: PointLogType;
  extraData?: unknown;
};

export type ReferralHistoryTypeWithPagination = PageInfo<TransactionLog[]>;

export enum PointLogType {
  REGISTER = 'REGISTER',
  REFERRALCODE = 'REFERRALCODE',
  REFERENCE = 'REFERENCE',
  CHAT = 'CHAT',
  SHARE = 'SHARE',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  REPORT = 'REPORT',
  REPORT_BUG = 'REPORT_BUG',
  TICKET = 'TICKET',
}
