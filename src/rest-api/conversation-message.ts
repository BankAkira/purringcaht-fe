import axios from '../helper/axios';
import environment from '../environment';

export async function readMessageApi(
  messageId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-messages/${messageId}/me/read`;
  const { data } = await axios.post(url);
  return data;
}

export async function readAllMessageApi(
  conversationId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversations/${conversationId}/read-all`;
  const { data } = await axios.post(url);
  return data;
}

export async function keepMessageApi(
  messageId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-messages/${messageId}/me/keep`;
  const { data } = await axios.post(url);
  return data;
}

export async function unkeepMessageApi(
  messageId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-messages/${messageId}/me/unkeep`;
  const { data } = await axios.post(url);
  return data;
}

export async function unsendMessageApi(
  messageId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-messages/${messageId}/unsent`;
  const { data } = await axios.patch(url);
  return data;
}

export async function deleteMessageApi(
  messageId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/conversation-messages/${messageId}`;
  const { data } = await axios.delete(url);
  return data;
}
