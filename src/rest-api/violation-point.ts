import axios from '../helper/axios';
import environment from '../environment';
import { ViolationPointConfigResponse } from '../type/auth';

type Payload = {
  name: string;
  type: string;
  point: number;
};

export async function getViolationPointConfig(): Promise<
  ViolationPointConfigResponse[]
> {
  const url = `${environment.apiUrl}/violation-point-config`;
  const { data } = await axios.get(url);
  return data;
}

export async function createViolationPointConfig(
  payload: Payload
): Promise<ViolationPointConfigResponse> {
  const url = `${environment.apiUrl}/violation-point-config`;
  const { data } = await axios.post(url, payload);
  return data;
}
