import axios from '../helper/axios';
import environment from '../environment';
import { EncryptedUserSecretPayload } from '../type/crypto';

export async function getEncryptedUserSecretByUserIdApi(
  userId: string
): Promise<EncryptedUserSecretPayload | undefined> {
  const url = `${environment.apiUrl}/encrypted-user-secrets/user/${userId}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getEncryptedUserSecretByAddressApi(
  address: string
): Promise<EncryptedUserSecretPayload | undefined> {
  const url = `${environment.apiUrl}/encrypted-user-secrets/user/${address}`;
  const { data } = await axios.get(url);
  return data;
}
