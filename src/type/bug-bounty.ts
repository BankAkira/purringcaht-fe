import { User } from './auth';
import { TransactionLog } from './point.ts';

export type BugBountyPayload = {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  userId: string;
  title?: string;
  detail: string;
  files: File[];
};

// Create a new type for Base64 file
export type Base64File = {
  base64: string;
  optional: {
    fileName: string;
    fileSize: number;
    fileType: string;
    lastModified: number;
  };
};

export type CreatePostBugForm = {
  title: string;
  detail: string;
  files: (File | Base64File)[];
};

export type ConfirmReportBugPayload = {
  reportBugId: string;
  detail: string;
  status: ConfirmReportBugStatus;
  files: (File | Base64File)[];
};

export type ConfirmReportBug = {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  userId: string;
  detail: string;
  files: File[];
  reportBug: BugBountyPayload;
  reportBugId: string;
  status: ConfirmReportBugStatus;
  confirmReportBugLog: ConfirmReportBugLog;
};

export type ConfirmReportBugLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  userId: string;
  confirmReportBug: ConfirmReportBug;
  confirmReportBugId: string;
  transactionLog: TransactionLog;
};

export type ConfirmReportBugStatus = 'AGREE' | 'DISAGREE' | 'OTHERS';
