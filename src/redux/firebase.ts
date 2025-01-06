import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Analytics } from 'firebase/analytics';
import { Firestore } from 'firebase/firestore';
import { Database } from 'firebase/database';
import { Messaging } from 'firebase/messaging';

export type FirebaseReducerState = {
  database: Database | null;
  analytics: Analytics | null;
  firestore: Firestore | null;
  messaging: Messaging | null;
  error: boolean;
};

const initialState: FirebaseReducerState = {
  database: null,
  analytics: null,
  firestore: null,
  messaging: null,
  error: false,
};

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    initializeFirebase: (
      state,
      action: PayloadAction<{
        database: Database;
        analytics: Analytics;
        firestore: Firestore;
        messaging: Messaging;
      }>
    ) => ({
      ...state,
      analytics: action.payload.analytics,
      database: action.payload.database,
      firestore: action.payload.firestore,
      messaging: action.payload.messaging,
    }),
    initializeFirebaseFailure: () => initialState,
  },
});

export const { initializeFirebase, initializeFirebaseFailure } =
  firebaseSlice.actions;

export default firebaseSlice;
