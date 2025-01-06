import { FaBell, FaBug } from 'react-icons/fa6';
import { IoIosCloudy, IoMdMail } from 'react-icons/io';
import { IoChatboxEllipses, IoDocumentText } from 'react-icons/io5';
import { TbHammer } from 'react-icons/tb';
import { DiCodeigniter } from 'react-icons/di';

export const sidebarUpperMenu = [
  {
    id: 'chat',
    label: 'Chat',
    icon: IoChatboxEllipses,
    link: '/chat',
  },
  {
    id: 'purr-post',
    label: 'PurrPost',
    icon: IoDocumentText,
    link: '/purr-post',
  },
  {
    id: 'purr-mail',
    label: 'PurrMail',
    icon: IoMdMail,
    link: '/purr-mail',
  },
  {
    id: 'bug-bounty',
    label: 'Bug Bounty',
    icon: FaBug,
    link: '/bug-bounty',
  },
  {
    id: 'nft',
    label: 'NFT',
    icon: DiCodeigniter,
    link: '/nft',
  },
];

export const sidebarLowerMenu = [
  {
    id: 'dispute',
    label: 'Dispute',
    icon: TbHammer,
    link: '/dispute',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: FaBell,
    link: '/notification',
  },
  {
    id: 'keep',
    label: 'PurrCloud',
    icon: IoIosCloudy,
    link: '/keep',
  },
];
