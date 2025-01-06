import axios from '../helper/axios';
import environment from '../environment';
import {
  DmEncryptedChatSecret,
  DmEncryptedChatSecretPayload,
  GroupEncryptedChatSecret,
} from '../type/crypto';

export async function createChatSecretApi(
  secret: DmEncryptedChatSecret | GroupEncryptedChatSecret
): Promise<DmEncryptedChatSecretPayload | undefined> {
  const url = `${environment.apiUrl}/encrypted-chat-secrets`;
  const { data } = await axios.post(url, secret);
  return data;
}
