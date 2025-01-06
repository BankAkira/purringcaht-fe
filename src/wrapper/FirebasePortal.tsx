import { PropsWithChildren } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import environment from '../environment';
import Error500 from '../page/miscellaneous/Error500';
// import { toast } from 'react-toastify';
// import { errorFormat } from '../helper/error-format';
import { useDispatch, useSelector } from '../redux';
import {
  initializeFirebase,
  // initializeFirebaseFailure,
} from '../redux/firebase';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

export default function FirebasePortal({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.firebase);

  useDeepEffect(() => {
    try {
      const firebaseApp = initializeApp(environment.firebaseConfig);
      const database = getDatabase(firebaseApp);
      const analytics = getAnalytics(firebaseApp);
      const firestore = getFirestore(firebaseApp);
      const messaging = getMessaging(firebaseApp);

      dispatch(
        initializeFirebase({ database, analytics, firestore, messaging })
      );
    } catch (error) {
      // dispatch(initializeFirebaseFailure());
      // toast.error(errorFormat(error).message);
    }
  }, []);

  if (error) {
    return <Error500 />;
  }

  return <>{children}</>;
}
