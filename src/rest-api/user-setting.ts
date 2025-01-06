import axios from '../helper/axios';
import environment from '../environment';
import { UpdateUserSettingPayload, UserSetting } from '../type/setting';

export async function updateUserSettingApi(
  payload: UpdateUserSettingPayload
): Promise<UserSetting | undefined> {
  const url = `${environment.apiUrl}/users-settings`;
  const { data } = await axios.patch(url, payload);
  return data;
}
