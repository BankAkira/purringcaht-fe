import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../type/auth';
import { StoreDispatch } from '.';
import { setCredentialTokens } from '../helper/local-storage';
import { redirect } from 'react-router-dom';
import { Web3Auth } from '@web3auth/modal';
import { CryptoECIES } from '../helper/rsa-crypto';

export type AccountReducerState = {
  user: User | null;
  web3AuthInstance: Web3Auth | null;
  userScheme: CryptoECIES | null;
  error: boolean;
};

const initialState: AccountReducerState = {
  user: null,
  web3AuthInstance: null,
  userScheme: null,
  error: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    initializeAccountSuccess: (
      state,
      action: PayloadAction<{
        user: User;
      }>
    ) => ({
      ...state,
      user: action.payload.user,
    }),
    initializeWeb3Auth: (
      state,
      action: PayloadAction<{
        web3AuthInstance: Web3Auth;
      }>
    ) => ({
      ...state,
      web3AuthInstance: action.payload.web3AuthInstance,
    }),
    initializeUserSchemeAction: (
      state,
      action: PayloadAction<{
        userScheme: CryptoECIES;
      }>
    ) => ({
      ...state,
      userScheme: action.payload.userScheme,
    }),
    initializeAccountFailure: () => ({
      user: null,
      web3AuthInstance: null,
      userScheme: null,
      error: true,
    }),
    resetAccountState: () => initialState,
  },
});

export const signOut = () => (dispatch: StoreDispatch) => {
  setCredentialTokens(null);
  dispatch(resetAccountState());
  redirect(location.pathname);
};

export const {
  initializeAccountSuccess,
  initializeAccountFailure,
  resetAccountState,
  initializeWeb3Auth,
  initializeUserSchemeAction,
} = accountSlice.actions;
export default accountSlice;
