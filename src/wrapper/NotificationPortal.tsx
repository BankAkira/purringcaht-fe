import { PropsWithChildren, useState } from 'react';
import { useDeepEffect } from '../helper/hook/useDeepEffect';
import { useSelector } from '../redux';
import { off, onChildChanged, ref } from 'firebase/database';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { Notification as NotificationType } from '../type/notification';
import { useNavigate } from 'react-router-dom';
import { getToken } from 'firebase/messaging';
import environment from '../environment';
import { updateUserApi } from '../rest-api/user';
import FullSpinner from '../component/FullSpinner';
import { Logger } from '../helper/logger';
import { useDispatch } from '../redux';
import { loadResultsAction } from '../redux/conversation';

const log = new Logger('NotificationPortal');

export default function NotificationPortal({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const { database, messaging } = useSelector(state => state.firebase);
  const { user } = useSelector(state => state.account);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useDeepEffect(() => {
    if (database && user) {
      const notificationRef = ref(database, `notifications`);
      onChildChanged(notificationRef, snapshot => {
        if (snapshot.exists()) {
          if (snapshot.key === user.id) {
            const notification = snapshot.val() as NotificationType;
            if (notification.redirectUrl) {
              if (notification.redirectUrl.includes('dispute/')) {
                dispatch(loadResultsAction());
                // dispatch(loadConversationAction());
              }
            }

            if (!isEmpty(notification)) {
              toast.dismiss();
              toast.info(notification.content, {
                onClick: () =>
                  notification.redirectUrl &&
                  navigate(notification.redirectUrl),
                autoClose: 10000,
              });
            }
          }
        }
      });
    }

    return () => {
      if (database) {
        const notificationRef = ref(database, `notifications`);
        off(notificationRef);
      }
    };
  }, [database, user]);

  useDeepEffect(() => {
    (async () => {
      try {
        if (messaging && user) {
          const permission = await Notification.requestPermission();

          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: environment.firebaseConfig.messagingKey,
            });

            if (currentToken) {
              await updateUserApi({ fcmToken: currentToken });
            }
          }
        }
      } catch (error) {
        log.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [messaging, user]);

  if (loading) {
    return <FullSpinner />;
  }

  return <>{children}</>;
}
