import axios from '../helper/axios';
import environment from '../environment';
import { ConversationRequestPayload } from '../type/conversation-requests';
import { PageInfo } from '../type/common';
import { ConversationPayload } from '../type/conversation';

export async function getMyConversationRequestsApi(
  params: string
): Promise<PageInfo<ConversationRequestPayload[]> | undefined> {
  const url = `${environment.apiUrl}/conversation-requests/me${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getConversationRequestByIdApi(
  requestsId: string
): Promise<ConversationRequestPayload | undefined> {
  const url = `${environment.apiUrl}/conversation-requests/${requestsId}`;
  const { data } = await axios.get(url);
  return data;
}

export async function acceptConversationRequestApi(
  requestsId: string
): Promise<ConversationPayload | undefined> {
  const url = `${environment.apiUrl}/conversation-requests/${requestsId}/accept`;
  const { data } = await axios.post(url);
  return data;
}

export async function denyConversationRequestApi(
  requestsId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-requests/${requestsId}/deny`;
  const { data } = await axios.post(url);
  return data;
}

export async function cancelConversationRequestApi(
  requestsId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-requests/${requestsId}/cancel`;
  const { data } = await axios.post(url);
  return data;
}
