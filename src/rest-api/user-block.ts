import axios from '../helper/axios';
import environment from '../environment';
import { UserBlocked, UserBlockedWithPagination } from '../type/auth';

export async function checkUserBlockApi(
  userId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/user-blocks/check-user-is-blocked/${userId}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getUsersBlockListApi(
  params?: string
): Promise<UserBlockedWithPagination | undefined> {
  const url = `${environment.apiUrl}/user-blocks${params}`;
  const { data } = await axios.get(url);
  return data;
}
export async function getGroupsBlockListApi(
  params?: string
): Promise<UserBlockedWithPagination | undefined> {
  const url = `${environment.apiUrl}/conversation-blocks${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function blockUserByIdApi(payload: {
  userId: string;
}): Promise<UserBlocked | undefined> {
  const url = `${environment.apiUrl}/user-blocks`;
  const { data } = await axios.post(url, payload);
  return data;
}
export async function blockGroupByIdApi(payload: {
  conversationId: string;
}): Promise<UserBlocked | undefined> {
  const url = `${environment.apiUrl}/conversation-blocks`;
  const { data } = await axios.post(url, payload);
  return data;
}
export async function unblockUserByIdApi(
  userId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/user-blocks/unblock-user/${userId}`;
  const { data } = await axios.delete(url);
  return data;
}
export async function unblockGroupByIdApi(
  conversationId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-blocks/unblock-conversation/${conversationId}`;
  const { data } = await axios.delete(url);
  return data;
}
