import axios from '../helper/axios';
import environment from '../environment';

// types
import {
  GetRedeemPointLogs,
  GetTickets,
  LuckyDrawEvent,
  WinningPrize,
} from '../type/lucky-draw';
import { QueryParams } from '../type/query-param';
import { PageInfo } from '../type/common.ts';

export async function getPrizePoolNowApi(): Promise<LuckyDrawEvent> {
  try {
    const url = `${environment.apiUrl}/prize-pools/now`;
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Error getting following users:', error);
    throw error;
  }
}

export async function redeemTickets(payload: {
  amount: number;
}): Promise<unknown> {
  const url = `${environment.apiUrl}/user-tickets/buy`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function createUseTicketsApi(payload: {
  amount: number;
  prizePoolId: string;
}): Promise<unknown> {
  const dataTemp = {
    amount: payload.amount,
  };

  const url = `${environment.apiUrl}/prize-pools/${payload.prizePoolId}/use-tickets`;
  const { data } = await axios.post(url, dataTemp);
  return data;
}

export async function getTicketsMe(params?: QueryParams): Promise<GetTickets> {
  const { page = 1, limit = 10, isUsed = false } = params || {};
  const url = `${environment.apiUrl}/user-tickets/me?page=${page}&limit=${limit}&isUsed=${isUsed}&orderBy=usedDate:desc`;
  const { data } = await axios.get(url);
  return data;
}

export async function getRedeemPointLogs(
  params?: QueryParams
): Promise<GetRedeemPointLogs> {
  const { page = 1, limit = 10 } = params || {};
  const url = `${environment.apiUrl}/transaction-logs/ticket?type=TICKET&page=${page}&limit=${limit}&activity=ADD&orderBy=createdAt:desc`;
  const { data } = await axios.get(url);
  return data;
}

// Get a list of winning prizes with optional sorting and pagination
export async function getWinningPrizesApi(
  params?: string
): Promise<PageInfo<WinningPrize[]> | undefined> {
  const url = `${environment.apiUrl}/winning-prizes${params}`;
  const { data } = await axios.get(url);
  return data;
}
