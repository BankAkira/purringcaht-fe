import axios from '../helper/axios';
import environment from '../environment';
import { PageInfo } from '../type/common';
import {
  ConversationOfficialPayload,
  ConversationPayload,
  CreateConversationBody,
  SentConversationRequestResponse,
} from '../type/conversation';
import {
  MessagePayload,
  SendMessageBody,
  UpdateConversationPayload,
} from '../type/message';
import { omit } from 'lodash';

export async function createConversationRequestApi(
  body: CreateConversationBody
): Promise<SentConversationRequestResponse | undefined> {
  const url = `${environment.apiUrl}/conversations`;
  const { data } = await axios.post(url, body);
  return data;
}

export async function getMyConversationsApi(
  params: string
): Promise<PageInfo<ConversationPayload[]> | undefined> {
  const url = `${environment.apiUrl}/conversations/me${params}`;
  const { data } = await axios.get(url);
  return data;
}
export async function getMyConversationsDisputeApi(
  params: string
): Promise<PageInfo<ConversationPayload[]> | undefined> {
  const url = `${environment.apiUrl}/conversations/me/dispute${params}`;
  const { data } = await axios.get(url);
  return data;
}
export async function getDisputeByConversationId(
  conversationId: string
): Promise<ConversationPayload | undefined> {
  const url = `${environment.apiUrl}/conversations/me/dispute/${conversationId}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getMyDeletedConversationsApi(
  params?: string
): Promise<{ conversationId: string; deletedAt: Date }[]> {
  const url = `${environment.apiUrl}/conversations/me/isDeletedByMe${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getConversationMessagesApi(
  conversationId: string,
  params: string
): Promise<PageInfo<MessagePayload[]> | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/messages${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getConversationMessagesDisputeApi(
  conversationId: string,
  params: string
): Promise<PageInfo<MessagePayload[]> | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/messages/dispute${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getConversationByIdApi(
  conversationId: string
): Promise<ConversationPayload | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}`;
  const { data } = await axios.get(url);
  return data;
}

export async function sendConversationMessageApi(
  conversationId: string,
  body: SendMessageBody
): Promise<MessagePayload | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/send`;
  const { data } = await axios.post(url, body);
  return data;
}
export async function sendConversationMessageBotApi(
  conversationId: string,
  body: SendMessageBody
): Promise<MessagePayload | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/send-bot`;
  const { data } = await axios.post(url, body);
  return data;
}

export async function updateConversationApi(
  id: string,
  payload: UpdateConversationPayload
): Promise<MessagePayload | undefined> {
  let mappingPayload = payload;
  Object.entries(mappingPayload || {}).forEach(([detailKey, detail]) => {
    if (
      detail === null ||
      detail === undefined ||
      (Array.isArray(detail) && !detail.length)
    ) {
      mappingPayload = omit(mappingPayload, [detailKey + '']);
    }
  });
  const url = `${environment.apiUrl}/conversations/${id}`;
  const { data } = await axios.patch(url, mappingPayload);
  return data;
}

export async function deleteConversationApi(
  id: string
): Promise<MessagePayload | undefined> {
  const url = `${environment.apiUrl}/conversations/${id}`;
  const { data } = await axios.delete(url);
  return data;
}

export async function inviteConversationApi(
  id: string,
  userIds: string[]
): Promise<MessagePayload | undefined> {
  const payload = {
    userIds: userIds,
  };
  const url = `${environment.apiUrl}/conversations/${id}/invite-members`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function removeMemberConversationApi(
  id: string,
  userIds: string[]
): Promise<MessagePayload | undefined> {
  const payload = {
    userIds: userIds,
  };
  const url = `${environment.apiUrl}/conversations/${id}/remove-members`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function removeGroupConversationApi(
  id: string
): Promise<MessagePayload | undefined> {
  const url = `${environment.apiUrl}/conversations/${id}/group`;
  const { data } = await axios.delete(url);
  return data;
}

export async function leaveConversationApi(
  id: string
): Promise<MessagePayload | undefined> {
  const url = `${environment.apiUrl}/conversations/${id}/leave`;
  const { data } = await axios.post(url);
  return data;
}

export async function updateRoleMemberConversationApi(
  id: string,
  userId: string,
  role: 'ADMIN' | 'MEMBER' | 'MANAGER'
): Promise<MessagePayload | undefined> {
  const payload = {
    datas: [{ userId: userId, role: role }],
  };
  const url = `${environment.apiUrl}/conversations/${id}/request-update-roles`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function getConversationSecretByIdApi(
  conversationId: string
): Promise<{ secret: string } | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/secret`;
  const { data } = await axios.get(url);
  return data;
}
export async function getConversationSecretDisputeByIdApi(
  conversationId: string
): Promise<{ secret: string } | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/secret/dispute`;
  const { data } = await axios.get(url);
  return data;
}

export async function addConversationOfficial(
  payload: ConversationOfficialPayload
): Promise<MessagePayload | undefined> {
  const url = `${environment.apiUrl}/users/add-official`;
  const { data } = await axios.post(url, payload);
  return data;
}
