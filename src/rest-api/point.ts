import axios from '../helper/axios';
import environment from '../environment';
import { GetPointLogs, UserPoint } from '../type/point';

export async function getUserPoint(): Promise<UserPoint> {
  const url = `${environment.apiUrl}/user-points/me`;
  const { data } = await axios.get(url);
  return data;
}
export async function getPointLogsMe(): Promise<GetPointLogs> {
  const url = `${environment.apiUrl}/point-logs/me?orderBy=createdAt:desc`;
  const { data } = await axios.get(url);
  return data;
}
