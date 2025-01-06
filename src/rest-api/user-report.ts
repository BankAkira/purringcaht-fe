import axios from '../helper/axios';
import environment from '../environment';
import {
  UserReportFromSB_Resp,
  reportUserPayload,
  reportUserResp,
} from '../type/auth';

const headers = {
  'x-api-key': environment.xApiKey,
  'Content-Type': 'application/json',
};

export async function getReportUserApi(
  param: string
): Promise<UserReportFromSB_Resp | undefined> {
  const url = `${environment.sbApiUrl}/user-reports/cat-cha-chat${param}`;
  const { data } = await axios.get(url, { headers });
  return data;
}

export async function reportUserApi(
  payload: reportUserPayload
): Promise<reportUserResp | undefined> {
  const url = `${environment.sbApiUrl}/user-reports/cat-cha-chat`;
  const { data } = await axios.post(url, payload, { headers });
  return data;
}
