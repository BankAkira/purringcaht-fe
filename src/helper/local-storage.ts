import { tokenKey } from '../constant/local-storage';
import { JwtToken } from '../type';
import { setAxiosAuthorization } from './axios';

export const setCredentialTokens = (tokens: JwtToken | null) => {
  if (tokens) {
    localStorage.setItem(tokenKey.accessToken, tokens.accessToken);
    localStorage.setItem(tokenKey.refreshToken, tokens.refreshToken);
    setAxiosAuthorization(tokens);
  } else {
    localStorage.removeItem(tokenKey.accessToken);
    localStorage.removeItem(tokenKey.refreshToken);
    setAxiosAuthorization(null);
  }
};

export const getCredentialTokens = () => {
  const accessToken = localStorage.getItem(tokenKey.accessToken);
  const refreshToken = localStorage.getItem(tokenKey.refreshToken);
  if (!!accessToken && !!refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
};

export const getSwInstall = () => {
  const sw_install = localStorage.getItem('SW_INSTALL');
  if (sw_install) {
    return JSON.parse(sw_install);
  }
  return null;
};

export const setSwInstall = (value: unknown) => {
  const installingString = JSON.stringify(value);
  localStorage.setItem('SW_INSTALL', installingString);
};
export const setRefCode = (value: unknown) => {
  const refCodeString = JSON.stringify(value);
  localStorage.setItem('REF_CODE', refCodeString);
};
export const getRefCode = () => {
  const refCodeString = localStorage.getItem('REF_CODE');
  if (refCodeString) {
    return JSON.parse(refCodeString);
  }
  return null;
};
