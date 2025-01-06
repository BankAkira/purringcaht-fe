export interface Notification {
  receiverUserId: string;
  id: string;
  refDocId?: string;
  senderUserId: string;
  type: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  senderDetails?: SenderDetails;
  content: string;
  isRead: boolean;
  redirectUrl?: string;
}

export interface SenderDetails {
  firstname: unknown;
  gender: string;
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
  mobilePhone: unknown;
  role: string;
  // providerDatas: ProviderData[]
  email: unknown;
  displayId: string;
  displayNameUpdatedAt: {
    seconds: number;
    nanoseconds: number;
  };
  isInitProfile: boolean;
  walletAddress: string;
  picture: string;
  lastname: unknown;
  displayName: string;
  id: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  age: unknown;
  nickname: unknown;
}
