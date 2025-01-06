import { User } from './auth';
import { PageInfo } from './common';
import { TransactionLog } from './point.ts';

export type GetTickets = PageInfo<Ticket[]>;
export type GetRedeemPointLogs = PageInfo<RedeemPointLog[]>;

// Define the Prize type
export type Prize = {
  id: string;
  createdAt: string;
  updatedAt: string;
  sequence: number;
  name: string;
  prizeAmount: number;
  winnerAmount: number;
  prizePoolId: string;
};

export type LuckyDrawEvent = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  drawDate: string;
  prizeAmount: number;
  isDraw: boolean;
  prizes: Prize[];
};

// Define the Ticket type
export type Ticket = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userPointId: string;
  usedAfterDate: string | null;
  expiredDate: string | null;
  isUsed: boolean;
  usedDate: string | null;
  prizePoolId: string | null;
};

// Define the Ticket Log type
export type TicketLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userPointId: string;
  type: 'REMOVE' | 'ADD';
  amount: number;
  extraData: string;
};

// Represents a Result object
export type RedeemPointLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  pointLogId: string | null;
  type: 'TICKET';
  userReportLogId: string | null;
  confirmReportBugLogId: string | null;
  winningPrizeLogId: string | null;
  ticketLogId: string;
  user: User;
  pointLog: string | null;
  userReportLog: string | null;
  ticketLog: TicketLog;
};

// WinningPrize Type
export type WinningPrize = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userTicketId: string;
  userTicket: UserTicket;
  prizePoolId: string;
  prizeId: string;
  amount: number;
  winningPrizeLogs: WinningPrizeLog[];
};

// WinningPrizeLog Type
export type WinningPrizeLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  winnigPrizeId: string;
  status: 'PENDING' | 'SUCCESS';
  transactionLogs: TransactionLog[];
};

export type UserTicket = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userPointId: string;
  usedAfterDate: string | null;
  expiredDate: string | null;
  isUsed: boolean;
  usedDate: string;
  prizePoolId: string;
  userPoint: UserPoint;
};

export type UserPoint = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  point: number;
  user: User;
};
