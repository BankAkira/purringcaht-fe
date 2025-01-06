import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import Loadable from '../component/Loadable';
import GuestGuard from './guard/GuestGuard';

// types
import { ConversationMenuTab, PathnameKeyword } from '../type';
import { SettingMenuEnum } from '../type';
import { FollowMenuTap } from '../type';

import CheckReferralCode from './check-param/CheckReferralCode';

import Profile from '../page/profile/Profile';
import Unauthorized from '../page/miscellaneous/Unauthorized';

import ProfileFollowSection from '../features/profile/sections/ProfileFollowSection';
import MailBoxSection from '../features/purr-mail';

const Nft = Loadable(lazy(() => import('../page/nft/Nft')));
const Home = Loadable(lazy(() => import('../page/home/Home')));
const Chat = Loadable(lazy(() => import('../page/chat/Chat')));
const PurrPost = Loadable(lazy(() => import('../page/purr-post/PurrPost')));
const LuckyDraw = Loadable(lazy(() => import('../page/lucky-draw/LuckyDraw')));
const LatestDrawWinners = Loadable(
  lazy(() => import('../page/lucky-draw/LatestDrawWinners'))
);
const BugBounty = Loadable(lazy(() => import('../page/bug-bounty/BugBounty')));
const BugBountyDetail = Loadable(
  lazy(() => import('../page/bug-bounty/BugBountyDetail'))
);

const PurrMail = Loadable(lazy(() => import('../page/purr-mail/PurrMail')));
const MailList = Loadable(
  lazy(() => import('../features/purr-mail/sections/content-section/MailList'))
);

const Notification = Loadable(
  lazy(() => import('../page/notification/Notification'))
);

const Dispute = Loadable(lazy(() => import('../page/dispute/Dispute')));

const Keep = Loadable(lazy(() => import('../page/keep/Keep')));

const Setting = Loadable(lazy(() => import('../page/setting/Setting')));
const MyAccount = Loadable(lazy(() => import('../page/setting/MyAccount')));
const Referral = Loadable(lazy(() => import('../page/setting/Referral')));
const BlockedList = Loadable(lazy(() => import('../page/setting/BlockedList')));
const HiddenList = Loadable(lazy(() => import('../page/setting/HiddenList')));
const PurchaseChaPoints = Loadable(
  lazy(() => import('../page/setting/PurchasePurrPoints'))
);
const Storage = Loadable(lazy(() => import('../page/setting/Storage')));
const Billing = Loadable(lazy(() => import('../page/setting/Billing')));
const Points = Loadable(lazy(() => import('../page/setting/PurrPoints')));

const Plugin = Loadable(lazy(() => import('../page/plugin/Plugin')));
const PluginDetail = Loadable(
  lazy(() => import('../page/plugin/PluginDetail'))
);

const Error404 = Loadable(lazy(() => import('../page/miscellaneous/Error404')));

const routes: RouteObject = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <CheckReferralCode>
          <AppLayout />
        </CheckReferralCode>
      ),
      children: [
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'purr-post',
          element: <PurrPost />,
        },
        {
          path: 'lucky-draw',
          element: <LuckyDraw />,
        },
        {
          path: 'lucky-draw/latest-draw-winners',
          element: <LatestDrawWinners />,
        },
        {
          path: '',
          element: <Navigate to="/chat" />,
        },
        {
          path: 'chat',
          children: [
            {
              path: '',
              element: <Navigate to={ConversationMenuTab.DIRECT} />,
            },
            {
              path: ConversationMenuTab.DIRECT,
              children: [
                {
                  path: '',
                  element: <Chat />,
                },
                {
                  path: ':directId',
                  element: <Chat />,
                },
              ],
            },
            {
              path: ConversationMenuTab.DIRECT_REQUEST,
              children: [
                {
                  path: '',
                  element: <Chat />,
                },
                {
                  path: ':requestId',
                  element: <Chat />,
                },
              ],
            },
            {
              path: ConversationMenuTab.GROUP,
              children: [
                {
                  path: '',
                  element: <Chat />,
                },
                {
                  path: ':groupId',
                  element: <Chat />,
                },
              ],
            },
            {
              path: ConversationMenuTab.GROUP_INVITE,
              children: [
                {
                  path: '',
                  element: <Chat />,
                },
                {
                  path: ':requestId',
                  element: <Chat />,
                },
              ],
            },
            {
              path: ConversationMenuTab.CONTACTS,
              children: [
                {
                  path: '',
                  element: <Chat />,
                },
                {
                  path: PathnameKeyword.ADD,
                  element: <Chat />,
                },
                {
                  path: ':contactId',
                  element: <Chat />,
                },
              ],
            },
          ],
        },
        {
          path: 'purr-mail',
          element: <PurrMail />,
          children: [
            {
              path: '',
              element: <Navigate to="inbox" replace />,
            },
            {
              path: 'inbox',
              children: [
                {
                  path: '',
                  element: <MailList />,
                },
                {
                  path: ':conversationMailId',
                  element: <MailBoxSection />,
                },
              ],
            },
            {
              path: 'send',
              children: [
                {
                  path: '',
                  element: <MailList />,
                },
                {
                  path: ':conversationMailId',
                  element: <MailBoxSection />,
                },
              ],
            },
            {
              path: 'trash',
              children: [
                {
                  path: '',
                  element: <MailList />,
                },
                {
                  path: ':conversationMailId',
                  element: <MailBoxSection />,
                },
              ],
            },
          ],
        },
        {
          path: 'bug-bounty',
          element: <BugBounty />,
        },
        {
          path: 'nft',
          element: <Nft />,
        },
        {
          path: 'bug-bounty/detail/:bugBountyId',
          element: <BugBountyDetail />,
        },
        {
          path: 'profile',
          children: [
            {
              path: '',
              element: <Profile />,
            },
            {
              path: ':userId',
              element: <Profile />,
            },
            {
              path: '',
              element: <ProfileFollowSection />,
              children: [
                {
                  path: '',
                  element: <Navigate to={FollowMenuTap.FOLLOWING} />,
                },
                {
                  path: FollowMenuTap.FOLLOWING,
                  children: [
                    {
                      path: '',
                      element: <ProfileFollowSection />,
                    },
                  ],
                },
                {
                  path: FollowMenuTap.FOLLOWER,
                  children: [
                    {
                      path: '',
                      element: <ProfileFollowSection />,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: 'notification',
          element: <Notification />,
        },
        {
          path: 'dispute',
          element: <Dispute />,
          children: [
            {
              path: '',
              element: <Dispute />,
            },
            {
              path: ':conversationId',
              element: <Dispute />,
            },
          ],
        },
        {
          path: 'keep',
          element: <Keep />,
        },
        {
          path: 'setting',
          element: <Setting />,
          children: [
            {
              path: '',
              element: <Navigate to={SettingMenuEnum.MY_ACCOUNT} />,
            },
            {
              path: SettingMenuEnum.MY_ACCOUNT,
              element: <MyAccount />,
            },
            {
              path: SettingMenuEnum.REFERRAL,
              element: <Referral />,
            },
            {
              path: SettingMenuEnum.BLOCKED_LIST,
              element: <BlockedList />,
            },
            {
              path: SettingMenuEnum.HIDDEN_LIST,
              element: <HiddenList />,
            },
            {
              path: SettingMenuEnum.PURCHASE_CHA_POINTS,
              element: <PurchaseChaPoints />,
            },
            {
              path: SettingMenuEnum.STORAGE,
              element: <Storage />,
            },
            {
              path: SettingMenuEnum.BILLING,
              element: <Billing />,
            },
            {
              path: SettingMenuEnum.POINTS,
              element: <Points />,
            },
          ],
        },
        {
          path: 'plugins',
          element: <Plugin />,
        },
        {
          path: 'plugins/:pluginsId',
          element: <PluginDetail />,
        },
        {
          path: '/unauthorized',
          element: (
            <GuestGuard>
              <Unauthorized />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Error404 />,
    },
  ],
};

export default routes;
