import { PageInfo } from './../type/common';
import axios from '../helper/axios';
import environment from '../environment';
import {
  AddContactBody,
  AddContactResponse,
  ContactHiddenWithPagination,
  ContactPayload,
  GetContact,
} from '../type/contact';

export async function addContactApi(
  body: AddContactBody
): Promise<AddContactResponse | undefined> {
  const url = `${environment.apiUrl}/contacts`;
  const { data } = await axios.post(url, body);
  return data;
}

export async function getMyContactsApi(
  params: string
): Promise<PageInfo<ContactPayload[]> | undefined> {
  const url = `${environment.apiUrl}/contacts/me${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function getContactByIdApi(
  contactId: string
): Promise<ContactPayload | undefined> {
  const url = `${environment.apiUrl}/contacts/${contactId}`;
  const { data } = await axios.get(url);
  return data;
}
export async function getContactByUserIdApi(
  userId: string
): Promise<GetContact | undefined> {
  const url = `${environment.apiUrl}/contacts/${userId}/userId`;
  const { data } = await axios.get(url);
  return data;
}
export async function deleteContactByIdApi(
  contactId: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/contacts/${contactId}`;
  const { data } = await axios.delete(url);
  return data;
}
export async function hideContactByIdApi(payload: {
  contactId: string;
  userId: string;
}): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/contact-hiddens`;
  const { data } = await axios.post(url, payload);
  return data;
}
export async function unHideContactByIdApi(
  id: string
): Promise<boolean | undefined> {
  const url = `${environment.apiUrl}/contact-hiddens/unhide-contact/${id}`;
  const { data } = await axios.delete(url);
  return data;
}
export async function getContactHiddenListApi(
  params?: string
): Promise<ContactHiddenWithPagination | undefined> {
  const url = `${environment.apiUrl}/contact-hiddens${params}`;
  const { data } = await axios.get(url);
  return data;
}

export async function createUserNickname(
  userId: string,
  nickname?: string
): Promise<ContactHiddenWithPagination | undefined> {
  const payload = { nickname: nickname, userId: userId };
  const url = `${environment.apiUrl}/nickname`;
  const { data } = await axios.post(url, payload);
  return data;
}

export async function updateUserNickname(
  userId: string,
  nickname?: string
): Promise<ContactHiddenWithPagination | undefined> {
  const payload = { nickname: nickname };
  const url = `${environment.apiUrl}/nickname/userId/${userId}`;
  const { data } = await axios.patch(url, payload);
  return data;
}
