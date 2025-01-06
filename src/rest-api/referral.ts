import axios from '../helper/axios';
import environment from '../environment';
import { ReferralHistoryTypeWithPagination } from '../type/referral';

// export async function getReferralHistory(
//   param?: string
// ): Promise<ReferralHistoryTypeWithPagination> {
//   const url = `${environment.apiUrl}/point-logs${param}`;
//   const { data } = await axios.get(url);
//   return data;
// }

export async function getReferralHistory(
  param?: string
): Promise<ReferralHistoryTypeWithPagination> {
  const url = `${environment.apiUrl}/transaction-logs${param}`;
  const { data } = await axios.get(url);
  return data;
}
export async function createReferralCode(): Promise<unknown> {
  const url = `${environment.apiUrl}/referral-codes`;
  const { data } = await axios.post(url);
  return data;
}
