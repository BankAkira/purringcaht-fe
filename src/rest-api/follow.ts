import axios from '../helper/axios';
import environment from '../environment';
import { FollowPayload, GetFollowerUser } from '../type/follow';
import { QueryParams } from '../type/query-param';

const headers = {
  'x-api-key': environment.xApiKey,
  'Content-Type': 'application/json',
};

export async function followUser(payload: FollowPayload): Promise<unknown> {
  const url = `${environment.apiUrl}/followers`;
  const { data } = await axios.post(url, payload, { headers });
  return data;
}

export async function unFollowUser(followId: string): Promise<unknown> {
  const url = `${environment.apiUrl}/followers/${followId}`;
  const { data } = await axios.delete(url);
  return data;
}

export async function getFollowingMe(
  params?: QueryParams
): Promise<GetFollowerUser> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const url = `${environment.apiUrl}/followers/following/me?page=${page}&limit=${limit}`;
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Error getting following users:', error);
    throw error;
  }
}

export async function getFollowerMe(
  params?: QueryParams
): Promise<GetFollowerUser> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const url = `${environment.apiUrl}/followers/me?page=${page}&limit=${limit}`;
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Error getting follower users:', error);
    throw error;
  }
}
