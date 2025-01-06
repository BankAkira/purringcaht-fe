import axios from '../helper/axios';
import environment from '../environment';
import { ValidateWalletResponse, SignInResponse } from '../type/auth';

export async function validateWalletAddressApi(
  walletAddress: string
): Promise<ValidateWalletResponse | undefined> {
  const url = `${environment.apiUrl}/auth/wallet/validate`;
  const { data } = await axios.post(url, { walletAddress });
  return data;
}

export async function signInApi(
  walletAddress: string,
  signature: string
): Promise<SignInResponse | undefined> {
  const url = `${environment.apiUrl}/auth/wallet/signin`;
  const { data } = await axios.post(url, { walletAddress, signature });
  return data;
}
