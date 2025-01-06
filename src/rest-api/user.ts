import axios from '../helper/axios';
import environment from '../environment';
import { UpdateUserPayload, User } from '../type/auth';
import { PageInfo } from '../type/common';
import { errorFormat } from '../helper/error-format';
import { ChatBadge } from '../type/chat';
import { KeepFile } from '../type/keep';
import {
  EncryptedUserSecret,
  EncryptedUserSecretPayload,
  UserEncryptedSecret,
} from '../type/crypto';
import { GetUserSuggest, GetUserAdmin, UserAdmin } from '../type/user';
import { QueryParams } from '../type/query-param';

export async function getUserInfoApi(): Promise<User | undefined> {
  const url = `${environment.apiUrl}/users/me`;
  const { data } = await axios.get(url);
  return data;
}
export async function getUserById(userId: string): Promise<User | undefined> {
  const url = `${environment.apiUrl}/users/${userId}`;
  const { data } = await axios.get(url);
  return data;
}

export async function searchUsersApi(
  params: string
): Promise<PageInfo<User[]> | undefined> {
  const url = `${environment.apiUrl}/users/search${params}`;
  const { data } = await axios.get(url);
  return data;
}
export async function updateUserApi(payload: UpdateUserPayload): Promise<User> {
  try {
    const url = `${environment.apiUrl}/users/me`;
    const { data } = await axios.patch(url, payload);
    return data;
  } catch (error) {
    const message = errorFormat(error).message;
    return message;
  }
}

export async function globalSearchApi<T>(
  params: string
): Promise<PageInfo<T[]> | undefined> {
  const url = `${environment.apiUrl}/users/me/conversations/search${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getUserBadgeApi(): Promise<ChatBadge | undefined> {
  const url = `${environment.apiUrl}/users/me/badges`;
  const { data } = await axios.get(url);
  return data;
}

export async function getUserKeepsApi(
  params?: string
): Promise<PageInfo<KeepFile[]> | undefined> {
  const url = `${environment.apiUrl}/users/me/file-keeps${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function updateUserPolicy(): Promise<User | undefined> {
  const url = `${environment.apiUrl}/users/me/updatePolicy`;
  const { data } = await axios.patch(url);
  return data;
}

export async function updateUserSecretApi(
  payload: EncryptedUserSecret
): Promise<EncryptedUserSecretPayload | undefined> {
  const url = `${environment.apiUrl}/users/me/secret`;
  const { data } = await axios.patch(url, payload);
  return data;
}

export async function getMyUserSecretApi(): Promise<
  UserEncryptedSecret | undefined
> {
  const url = `${environment.apiUrl}/users/me/secret`;
  const { data } = await axios.get(url);
  const newData = {
    encryptedUserSecret: data.encryptedUserSecret,
    publicKeyPrefix: data.publicKeyPrefix,
    publicKeyX: data.publicKeyX,
    address: data.address,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
  return newData;
}

export async function getSuggestFollowing(
  params?: QueryParams
): Promise<GetUserSuggest> {
  const limit = params?.limit || 10;
  const url = `${environment.apiUrl}/users/suggest/user-following?limit=${limit}`;
  const { data } = await axios.get(url);
  return data;
}
export async function getAdminPlatform(
  platform = 'SB',
  params?: QueryParams
): Promise<GetUserAdmin> {
  const limit = params?.limit || 10;
  const url = `${environment.apiUrl}/users/admin/platform?page=1&limit=${limit}&platform=${platform}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getUserOfficial(): Promise<UserAdmin> {
  const url = `${environment.apiUrl}/users/official`;
  const { data } = await axios.get(url);
  return data;
}

export async function getCheckYourFriend(): Promise<boolean> {
  const url = `${environment.apiUrl}/users/check-friend-official`;
  const { data } = await axios.get(url);
  return data;
}
