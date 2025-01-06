import environment from '../environment';

// helper functions
import axios from '../helper/axios';
import { queryParamsToString } from '../helper/query-param';

// types
import {
  FormCreateCompose,
  MailConversation,
  MailConversationMessage,
  MessageOptional,
  PageInfo,
  QueryParams,
  ResponseCreateCompose,
  User,
} from '../type';

export async function searchEmail(
  params?: QueryParams
): Promise<PageInfo<User[]>> {
  const { page = 1, limit = 10, text = false } = params || {};
  const url = `${environment.apiUrl}/users/search-email?page=${page}&limit=${limit}&text=${text}`;
  const { data } = await axios.get(url);
  return data;
}
export async function createMailConversation(
  payload: FormCreateCompose
): Promise<ResponseCreateCompose> {
  const url = `${environment.apiUrl}/mail-conversations`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function getConversationMailById(
  conversationId: string
): Promise<MailConversation> {
  const url = `${environment.apiUrl}/mail-conversations/${conversationId}`;
  const { data } = await axios.get(url);
  return data;
}
export async function deleteConversationMailById(
  conversationId: string
): Promise<MailConversation> {
  const url = `${environment.apiUrl}/mail-conversations/${conversationId}`;
  const { data } = await axios.delete(url);
  return data;
}

export async function verifyUserAliveConversationMailById(
  conversationId: string
): Promise<MailConversation> {
  const url = `${environment.apiUrl}/mail-conversations/${conversationId}/verify`;
  const { data } = await axios.patch(url);
  return data;
}

export async function getConversationMails(
  params?: QueryParams
): Promise<PageInfo<MailConversation[] | []>> {
  const {
    page = 1,
    limit = 10,
    orderBy = 'updatedAt:desc',
    status = 'WAITING,COMPLETED',
    isDeleted,
    isOwner,
    isRead,
  } = params || {};
  const isDeletedQuery =
    isDeleted !== undefined ? `&isDeleted=${isDeleted}` : '';
  const isOwnerQuery = isOwner !== undefined ? `&isOwner=${isOwner}` : '';
  const isReadQuery = isRead !== undefined ? `&isRead=${isRead}` : '';
  const url = `${environment.apiUrl}/mail-conversations?page=${page}&limit=${limit}&orderBy=${orderBy}&status=${status}${isDeletedQuery}${isOwnerQuery}${isReadQuery}`;
  const { data } = await axios.get(url);
  return data;
}

export async function searchMailApi<T>(
  params: QueryParams
): Promise<PageInfo<T[]> | undefined> {
  const queryString = queryParamsToString(params);
  const url = `${environment.apiUrl}/mail-conversations${queryString}`;
  const { data } = await axios.get(url);
  return data;
}

export async function markMailAsRead(id: string): Promise<void> {
  const url = `${environment.apiUrl}/mail-conversations/${id}/read`;
  const { data } = await axios.patch(url);
  return data;
}

export async function updateStarredAndImportantStatus(
  id: string,
  options: { isStarred?: boolean; isImportant?: boolean }
) {
  const payload = {
    ...(options.isStarred !== undefined && { isStarred: options.isStarred }),
    ...(options.isImportant !== undefined && {
      isImportant: options.isImportant,
    }),
  };

  const url = `${environment.apiUrl}/mail-conversations/${id}`;
  const { data } = await axios.patch(url, payload);
  return data;
}

export async function moveMailToRecycleBin(id: string): Promise<void> {
  const url = `${environment.apiUrl}/mail-conversations/${id}/recycle-bin`;
  const { data } = await axios.delete(url);
  return data;
}

export async function delMailApi(id: string): Promise<void> {
  const url = `${environment.apiUrl}/mail-conversations/${id}/recycle-bin/permanently-deleted`;
  const { data } = await axios.delete(url);
  return data;
}

export async function restoreMailApi(id: string): Promise<void> {
  const url = `${environment.apiUrl}/mail-conversations/${id}/recycle-bin/restore`;
  const { data } = await axios.patch(url);
  return data;
}

export async function replyMailConversation(
  id: string,
  payload: {
    files: Awaited<{ base64: string; optional: MessageOptional }>[];
    content: string;
    transactionHash: string;
  }
): Promise<void> {
  const url = `${environment.apiUrl}/mail-conversations/${id}/reply`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function getConversationMailBoxByMailConversationId(
  params?: QueryParams
): Promise<PageInfo<MailConversationMessage[] | []>> {
  const {
    page = 1,
    limit = 10,
    orderBy = 'createdAt:desc',
    mailConversationId,
  } = params || {};
  const url = `${environment.apiUrl}/mail-conversations/${mailConversationId}/message?page=${page}&limit=${limit}&orderBy=${orderBy}`;
  const { data } = await axios.get(url);
  return data;
}
