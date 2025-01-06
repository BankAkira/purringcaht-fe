import { User } from './auth';
import { PageInfo } from './common';
import { ConversationPayload } from './conversation';

export type GetDisputes = PageInfo<Dispute[]>;

export type DisputeInformation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  disputeId: string;
  topic: string;
  title: string;
  description: string;
  plaintiffId: string;
  plaintiff: User;
  defendantId: string;
  defendant: User;
  user: User;
  files: FileOption[] | [];
  userAdminDisputes: UserAdminDisputes[] | [];
};

export type ResultDispute = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  disputeId: string;
  countDispute: number;
  disputeInformationId: string;
  resultDisputeConfirm: ResultDisputeConfirm[];
};

export type ResultDisputeConfirm = {
  id: string;
  createdAt: string;
  updatedAt: string;
  resultDisputeId: string;
  plaintiffId: string;
  plaintiffStatus: AcceptDisputeStatus;
  defendantId: string;
  defendantStatus: AcceptDisputeStatus;
  resultStatus: ResultsDisputeStatus;
};

export type AcceptDisputeStatus = 'ACCEPT' | 'PENDING' | 'REJECT';
export type ResultsDisputeStatus = 'SUCCESS' | 'PENDING' | 'REJECT';

export type UserAdminDisputes = {
  adminSecretKey: string;
  adminId: string;
};

export type Dispute = {
  id: string;
  createdAt: string;
  updatedAt: string;
  plaintiffId: string;
  defendantId: string;
  conversationId: string;
  conversation: ConversationPayload;
  startDate: string;
  endDate: string;
  platformType: string;
  disputeInformations: DisputeInformation[];
  AdminJudgmentDispute: AdminJudgmentDispute[];
  ResultDispute: ResultDispute[];
  defendant: User;
  plaintiff: User;
};

export type FileOptional = {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  lastModified?: number;
  pageCount?: number | null;
};

export type FileOption = {
  content?: string;
  base64?: string;
  optional?: FileOptional;
};

export type UserAdminDispute = {
  adminSecretKey: string;
  adminId: string;
};

export type AdminJudgmentDispute = {
  id: string;
  createdAt: string;
  updatedAt: string;
  disputeId: string;
  userId: string;
  user: User;
  resultDisputeId: string;
  date: string;
  pointOfAdmin: string | null;
  detail: ResultDisputeDetail;
  userWonId: string;
  userWon: User;
};

export type ResultDisputeDetail = {
  result: string;
  reason: string;
  consequence: string;
};

export type DisputeForm = {
  topic: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  userAdminDisputes?: UserAdminDispute[];
  files?: FileOption[] | [];
};

export type ResultDisputeForm = {
  disputeId: string;
  disputeInformationId: string;
  resultDisputeId: string;
  date: string;
  pointOfAdmin?: string;
  detail: ResultDisputeDetail;
  userWonId?: string;
};

export type ConfirmResultsDisputeForm = {
  status: 'ACCEPT' | 'PENDING' | 'REJECT';
};
