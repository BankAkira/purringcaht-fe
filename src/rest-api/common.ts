import axios from '../helper/axios';
import environment from '../environment';
import { SignedUrlResponse } from '../type/common';

export async function getSignedUrlApi(
  fileName: string
): Promise<SignedUrlResponse> {
  const url = `${environment.apiUrl}/signed-url/${fileName}`;
  const { data } = await axios.get(url);
  return data;
}
