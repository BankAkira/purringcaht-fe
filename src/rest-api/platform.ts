import axios from '../helper/axios';
import environment from '../environment';
import { GetPlatform } from '../type/platform';

export async function getPlatformsByName(name: string): Promise<GetPlatform> {
  const url = `${environment.apiUrl}/platforms?name=${name}`;
  const { data } = await axios.get(url);
  return data;
}
