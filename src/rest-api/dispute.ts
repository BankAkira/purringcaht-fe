import axios from '../helper/axios';
import environment from '../environment';
import {
  ConfirmResultsDisputeForm,
  Dispute,
  DisputeForm,
  GetDisputes,
  ResultDisputeForm,
} from '../type/dispute';

export async function createDispute(
  conversationId: string,
  payload: DisputeForm
): Promise<Dispute> {
  const url = `${environment.apiUrl}/disputes/make-dispute/${conversationId}`;
  const { data } = await axios.post(url, payload);
  return data;
}
export async function updateDispute(
  conversationId: string,
  payload: DisputeForm
): Promise<Dispute> {
  const url = `${environment.apiUrl}/disputes/update-dispute/${conversationId}`;
  const { data } = await axios.patch(url, payload);
  return data;
}
export async function updateConfirmResultDispute(
  confirmResultId: string,
  payload: ConfirmResultsDisputeForm
): Promise<unknown> {
  const url = `${environment.apiUrl}/result-dispute-confirms/${confirmResultId}`;
  const { data } = await axios.patch(url, payload);
  return data;
}
export async function createResultDispute(
  payload: ResultDisputeForm
): Promise<unknown> {
  const url = `${environment.apiUrl}/admin-judgment-disputes`;
  const { data } = await axios.post(url, payload);
  return data;
}
export async function getDisputes(): Promise<GetDisputes> {
  const url = `${environment.apiUrl}/disputes/me`;
  const { data } = await axios.get(url);
  return data;
}
export async function getDisputesById(disputeId: string): Promise<Dispute> {
  const url = `${environment.apiUrl}/disputes/${disputeId}`;
  const { data } = await axios.get(url);
  return data;
}
