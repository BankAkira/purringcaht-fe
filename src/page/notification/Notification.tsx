import NotificationCard from '../../component/notification-card/NotificationCard';
import { defaultImages } from '../../constant/default-images';
import moment, { Moment } from 'moment';
import { Logger } from '../../helper/logger';
import { Dropdown, Tooltip } from 'flowbite-react';
import { IoMdMore } from 'react-icons/io';
import { MdCheck, MdOutlineVisibility } from 'react-icons/md';
import { useEffect, useState } from 'react';
import IconButton from '../../component/icon-button/IconButton';
import { IoInformationCircle } from 'react-icons/io5';
// import emptyNotiImage from '../../../asset/images/empty-img/empty-chat.svg';
import emptyNotiImage from '../../asset/images/empty-img/empty-chat.svg';

import {
  QueryDocumentSnapshot,
  collection,
  endBefore,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

import { useSelector } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { readAllNotiApi, readNotiApi } from '../../rest-api/user-notification';
import { errorFormat } from '../../helper/error-format';

import { Notification as NotificationType } from '../../../src/type/notification';
import useResponsive from '../../helper/hook/useResponsive';
// import { FaCheckDouble } from 'react-icons/fa6';

const log = new Logger('Notification');
const LIMIT_PER_PAGE = 15;

export default function Notification() {
  const { isTabletOrMobile } = useResponsive();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.account);

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [realtimeNotis, setRealtimeNotis] = useState<NotificationType[]>([]);
  const [staticNotis, setStaticNotis] = useState<NotificationType[]>([]);

  const { firestore } = useSelector(state => state.firebase);
  const REFERENCE = moment();
  const TODAY = REFERENCE.clone().startOf('day');
  const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');

  const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot>();
  const [firstVisibleDoc, setFirstVisibleDoc] =
    useState<QueryDocumentSnapshot>();
  const [initFirstVisibleDoc, setInitFirstVisibleDoc] =
    useState<boolean>(false);

  function isToday(momentDate: Moment) {
    return momentDate.isSame(TODAY, 'd');
  }
  function isYesterday(momentDate: Moment) {
    return momentDate.isSame(YESTERDAY, 'd');
  }

  const getRealtimeNotifications = async () => {
    if (!firestore) {
      return;
    }
    const notificationCollection = collection(firestore, 'notifications');

    log.debug(
      'getRealtimeNotifications firstVisibleDoc => %o',
      firstVisibleDoc
    );

    let getRealtimeNotifQuery;
    if (firstVisibleDoc == null) {
      getRealtimeNotifQuery = query(
        notificationCollection,
        where('receiverUserId', '==', user?.id),
        orderBy('createdAt', 'desc')
      );
    } else {
      getRealtimeNotifQuery = query(
        notificationCollection,
        where('receiverUserId', '==', user?.id),
        orderBy('createdAt', 'desc'),
        endBefore(firstVisibleDoc)
      );
    }

    onSnapshot(getRealtimeNotifQuery, response => {
      const _realtimeDocs: NotificationType[] = [];
      response.docs.map(doc => {
        if (doc) {
          const _doc = {
            ...(doc.data() as NotificationType),
            refDocId: doc.id,
          };
          _realtimeDocs.push(_doc);
        }
      });
      if (_realtimeDocs.length) {
        log.debug('Realtime _realtimeDocs => ', _realtimeDocs);
        setRealtimeNotis(_realtimeDocs);
      }
    });
  };

  const queryPage = async (page: 'next' | 'first') => {
    if (!firestore) {
      return;
    }
    const notificationCollection = collection(firestore, 'notifications');

    // Query the first page of docs
    let _query;
    if (page == 'first') {
      _query = query(
        notificationCollection,
        where('receiverUserId', '==', user?.id),
        orderBy('createdAt', 'desc'),
        limit(LIMIT_PER_PAGE)
      );
    } else {
      if (!lastVisibleDoc) {
        log.debug('no more data to load more');
        return;
      }
      _query = query(
        notificationCollection,
        where('receiverUserId', '==', user?.id),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleDoc),
        limit(LIMIT_PER_PAGE)
      );
    }
    const documentSnapshots = await getDocs(_query);
    const _docs: NotificationType[] = [];
    documentSnapshots.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      log.debug('doc[' + page + '] => ', doc.data());
      const _doc = { ...(doc.data() as NotificationType), refDocId: doc.id };
      // log.debug({ _notis });
      _docs.push(_doc);
    });
    log.debug({ _docs });
    setStaticNotis([...staticNotis, ..._docs]);
    log.debug({ staticNotis });

    // // Get the last visible document
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisibleDoc(
      documentSnapshots.docs.length == LIMIT_PER_PAGE ? lastVisible : undefined
    );

    if (page == 'first') {
      const _firstVisibleDoc = documentSnapshots.docs[0];
      log.debug({ _firstVisibleDoc });
      setFirstVisibleDoc(_firstVisibleDoc);
      setInitFirstVisibleDoc(true);
    }
  };

  useEffect(() => {
    queryPage('first');
  }, []);

  useEffect(() => {
    log.debug('realtimeNotis => ', realtimeNotis);
    log.debug('staticNotis => ', staticNotis);
    setNotifications([...realtimeNotis, ...staticNotis]);
  }, [realtimeNotis, staticNotis]);

  useEffect(() => {
    log.debug('initFirstVisibleDoc => ', initFirstVisibleDoc);
    if (initFirstVisibleDoc) {
      getRealtimeNotifications();
    }
  }, [initFirstVisibleDoc]);

  async function markAsRead(notiId: string) {
    // log.debug('markAsRead calling...');
    try {
      const resReadNoti = await readNotiApi(notiId);
      log.debug('markAsRead resReadNoti... %o', resReadNoti);
    } catch (error) {
      toast.error(errorFormat(error).message);
    }
  }

  async function readAllNoti() {
    log.debug('readAllNoti calling...');
    try {
      const resAllNoti = await readAllNotiApi();
      log.debug('readAllNoti resAllNoti... %o', resAllNoti);
    } catch (error) {
      toast.error(errorFormat(error).message);
    }
  }

  function navigateByNotiRedirectUrl(noti: NotificationType) {
    // const navigate = useNavigate();
    // log.debug({ type });
    // switch (type) {
    //   case 'RECEIVE_MESSAGE':
    //     break;
    //   case 'FOLLOWING':
    //     break;
    //   case 'RECEIVE_FEELING':
    //     break;
    //   case 'MENTIONED':
    //     break;
    //   case 'NEWS':
    //     break;
    //   case 'DM':
    //     navigate('/chat/direct-request');
    //     break;
    //   case 'GROUP':
    //     navigate('/chat/group-invite');
    //     break;
    //   default:
    //     alert('UNKNOWN_NOTI_TYPE: ' + type);
    //     // navigate('/plugins');
    //     break;
    // }

    if (!noti.redirectUrl) {
      log.debug("redirectUrl not found. (It's old noti!)");
      return;
    }
    navigate(noti.redirectUrl);
    markAsRead(noti.id);
  }

  function NotiRoute({ noti }: { noti: NotificationType }) {
    return (
      <div
        className="flex items-center w-full py-3 border-b border-gray-200 gap-2"
        onClick={() => {
          // navigateByNotiType(noti.type);
        }}>
        <NotificationCard
          profileImg={
            noti.senderDetails
              ? noti.senderDetails.picture
              : defaultImages.noProfile
          }
          profileName={
            noti.senderDetails
              ? noti.senderDetails.displayName
              : noti.senderUserId
          }
          date={noti.createdAt.seconds * 1000}
          type={noti.type}
          textContent={noti.content}
          isRead={noti.isRead}
          handleClick={() => navigateByNotiRedirectUrl(noti)}
          // userOthersCount={noti.userOthersCount}
        />

        <Dropdown
          arrowIcon={false}
          inline
          className="w-[200px]"
          label={
            <IoMdMore
              className="text-gray-500"
              style={{ width: '26px', height: '26px' }}
            />
          }>
          <Dropdown.Item
            className="flex items-center gap-2 pt-3"
            onClick={() => {
              navigateByNotiRedirectUrl(noti);
            }}>
            <MdOutlineVisibility />
            View
          </Dropdown.Item>

          <Dropdown.Item
            className="flex items-center gap-2 pb-3"
            onClick={() => {
              markAsRead(noti.id);
            }}>
            <MdCheck />
            Mark as read
          </Dropdown.Item>
        </Dropdown>
      </div>
    );
  }

  return (
    <section
      className={
        (isTabletOrMobile ? 'h-[calc(100vh-57px)]' : 'h-screen') +
        ' p-4 bg-white overflow-auto'
      }>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 select-none">
          <h2 className="text-2xl font-extrabold tracking-tight max-lg:text-xl">
            Notification
          </h2>{' '}
          <Tooltip
            content="Stay updated with important information and alerts"
            placement="right">
            <IconButton
              color="#9CA3AF"
              height={18}
              icon={IoInformationCircle}
              onClick={() => {}}
              width={18}
            />
          </Tooltip>
        </div>
        {!!notifications.length && (
          <div
            className="flex items-center justify-between py-2 px-3 cursor-pointer max-lg:h-auto rounded-md hover:bg-orange-50 hover:!text-gray-900 transition"
            onClick={() => {
              readAllNoti();
            }}>
            <IconButton
              className="mr-2"
              icon={MdCheck}
              width={16}
              height={16}
            />
            <p className="text-sm text-gray-500">Mask all as read</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {!notifications.length && (
          <div className="flex flex-col items-center gap-[12px] justify-center w-full mt-6 text-sm text-gray-400 h-[calc(100vh-170px)]">
            <img src={emptyNotiImage} width={100} alt="empty noti" />
            <div className="px-4 text-center">
              <p className="text-xl font-semibold text-[#9CA3AF] mb-1">
                No Notification
              </p>
              <p className="text-sm font-normal text-[#9CA3AF] max-w-[280px]">
                You didn't made any notification yet.
              </p>
            </div>
          </div>
        )}

        {notifications.filter(noti =>
          isToday(moment(noti.createdAt.seconds * 1000))
        ).length > 0 && (
          <div>
            <p className="text-xl max-lg:text-base">Today</p>
            <div className="flex flex-wrap">
              {notifications
                .filter(noti => isToday(moment(noti.createdAt.seconds * 1000)))
                .map(noti => (
                  <NotiRoute key={noti.id} noti={noti}></NotiRoute>
                ))}
            </div>
          </div>
        )}

        {notifications.filter(noti =>
          isYesterday(moment(noti.createdAt.seconds * 1000))
        ).length > 0 && (
          <div>
            <p className="text-xl max-lg:text-base">Yesterday</p>
            <div className="flex flex-wrap">
              {notifications
                .filter(noti =>
                  isYesterday(moment(noti.createdAt.seconds * 1000))
                )
                .map(noti => (
                  <NotiRoute key={noti.id} noti={noti}></NotiRoute>
                ))}
            </div>
          </div>
        )}

        {notifications.filter(
          noti =>
            !isToday(moment(noti.createdAt.seconds * 1000)) &&
            !isYesterday(moment(noti.createdAt.seconds * 1000))
        ).length > 0 && (
          <div>
            <p className="text-xl">Older</p>
            <div className="flex flex-wrap">
              {notifications
                .filter(
                  noti =>
                    !isToday(moment(noti.createdAt.seconds * 1000)) &&
                    !isYesterday(moment(noti.createdAt.seconds * 1000))
                )
                .map(noti => (
                  <NotiRoute key={noti.id} noti={noti}></NotiRoute>
                ))}
            </div>
          </div>
        )}

        {lastVisibleDoc && (
          <div
            onClick={() => queryPage('next')}
            className="flex flex-col text-gray-500 py-2 items-center cursor-pointer max-lg:h-auto rounded-md bg-gray-100 hover:bg-gray-200 hover:!text-gray-900 transition">
            Load more
          </div>
        )}
      </div>
    </section>
  );
}
