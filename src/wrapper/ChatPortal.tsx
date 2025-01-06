import { PropsWithChildren } from 'react';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import { useDispatch, useSelector } from '../redux';
// import { useDispatch, useSelector } from '../redux';
import { updateBadge } from '../redux/badge';
import {
  onValue,
  ref,
  DatabaseReference,
  onChildChanged,
  off,
} from 'firebase/database';
import { ChatBadge } from '../type/chat';
// import { updateUserSettingApi } from '../rest-api/user-setting';
// import { initializeAccountSuccess } from '../redux/account';
// import { UpdateUserSettingPayload } from '../type/setting';
// import { User } from '../type/auth';

export default function ChatPortal({ children }: PropsWithChildren) {
  const { user } = useSelector(state => state.account);
  const { database } = useSelector(state => state.firebase);

  const dispatch = useDispatch();

  useDeepEffect(() => {
    let onValueRef: DatabaseReference | undefined;
    let onChildChangedRef: DatabaseReference | undefined;

    if (user && database) {
      onValueRef = ref(database, `badges/${user.id}`);
      onValue(onValueRef, async snapshot => {
        if (snapshot.exists()) {
          const val: ChatBadge = snapshot.val();
          await dispatch(updateBadge(val));
        }
      });

      onChildChangedRef = ref(database, `badges`);
      onChildChanged(onChildChangedRef, async snapshot => {
        if (snapshot.exists()) {
          if (snapshot.key === user.id) {
            const val: ChatBadge = snapshot.val();
            await dispatch(updateBadge(val));
          }
        }
      });
    }

    return () => {
      if (onValueRef) {
        off(onValueRef);
      }
      if (onChildChangedRef) {
        off(onChildChangedRef);
      }
    };
  }, [user, database]);

  // useDeepEffect(() => {
  //   const onlineInterval = setInterval(
  //     () => {
  //       updateIsOnline();
  //     },
  //     5 * 60 * 1000
  //   );

  //   return () => {
  //     clearInterval(onlineInterval);
  //   };
  // }, []);

  // const updateIsOnline = async (isMovingMouse?: boolean) => {
  //   try {
  //     const userSettingPayload: UpdateUserSettingPayload = {
  //       isOnline: !isMovingMouse ? false : true,
  //     };
  //     const resp = await updateUserSettingApi(userSettingPayload);

  //     if (resp?.id) {
  //       if (user && user.userSetting) {
  //         const userInfo: User = {
  //           ...user,
  //           userSetting: {
  //             ...user.userSetting,
  //             isOnline: userSettingPayload.isOnline,
  //           },
  //         };
  //         dispatch(initializeAccountSuccess({ user: userInfo }));
  //       }
  //     }
  //   } catch (error) {
  //     // log.error(errorFormat(error).message);
  //   }
  // };

  return <>{children}</>;
}
