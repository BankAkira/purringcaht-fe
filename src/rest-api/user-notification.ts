import axios from '../helper/axios';
import environment from '../environment';
import { Notification } from '../type/notification';

export async function readNotiApi(
  notificationId: string
): Promise<Notification> {
  const url = `${environment.apiUrl}/notifications/read/${notificationId}`;
  const { data } = await axios.patch(url, {});
  return data;
}

export async function readAllNotiApi(): Promise<Notification> {
  const url = `${environment.apiUrl}/notifications/read-all`;
  const { data } = await axios.patch(url, {});
  return data;
}
