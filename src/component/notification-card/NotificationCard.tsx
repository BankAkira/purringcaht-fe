import moment from 'moment';
import { defaultImages } from '../../constant/default-images';
import Avatar from '../avatar/Avatar';
import './notification-card.css';
import IconButton from '../icon-button/IconButton';
import { GoDotFill } from 'react-icons/go';

export type NotificationCardProps = {
  profileImg: string;
  profileImgSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  profileName: string;
  date: number;
  type:
    | 'RECEIVE_MESSAGE'
    | 'FOLLOWING'
    | 'RECEIVE_FEELING'
    | 'MENTIONED'
    | 'NEWS'
    | string;
  userOthersCount?: number;
  textContent?: string;
  contentType?: 'POST' | 'COMMENT' | 'REPLY_COMMENT';
  actionContentType?: 'VIDEO' | 'IMAGE' | 'TEXT';
  isRead: boolean;
  handleClick: () => void;
};

export default function NotificationCard({
  profileImg = defaultImages.noProfile,
  profileImgSize = 'md',
  profileName,
  date,
  handleClick,
  type,
  // userOthersCount,
  textContent,
  // contentType,
  // actionContentType,
  isRead,
}: NotificationCardProps) {
  // const formatMentionedType = (isNews?: boolean) => {
  //   switch (contentType) {
  //     case 'POST':
  //       return isNews ? 'posted' : 'post';
  //     case 'COMMENT':
  //       return isNews ? 'commented' : 'comment';
  //     case 'REPLY_COMMENT':
  //       return isNews ? 'reply commented' : 'reply comment';
  //     default:
  //       return '';
  //   }
  // };

  // const formatActionContentType = () => {
  //   switch (actionContentType) {
  //     case 'VIDEO':
  //       return ' a new video';
  //     case 'IMAGE':
  //       return ' a new image';
  //     case 'TEXT':
  //       return '';
  //     default:
  //       return '';
  //   }
  // };

  const formatText = () => {
    switch (type) {
      // ==== START MOCK TYPE ====

      // case 'RECEIVE_MESSAGE':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       New message from{' '}
      //       <span className="font-semibold text-gray-800">{profileName}</span>:
      //       "{textContent}"
      //     </span>
      //   );

      // case 'FOLLOWING':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       <span className="font-semibold text-gray-800">{profileName}</span>{' '}
      //       and{' '}
      //       <>
      //         {!!userOthersCount && (
      //           <span className="font-semibold text-gray-800">
      //             {userOthersCount} {userOthersCount > 1 ? 'others' : 'other'}
      //           </span>
      //         )}
      //       </>{' '}
      //       started following you.{' '}
      //     </span>
      //   );

      // case 'RECEIVE_FEELING':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       <span className="font-semibold text-gray-800">{profileName}</span>{' '}
      //       and{' '}
      //       {!!userOthersCount && (
      //         <span className="font-semibold text-gray-800">
      //           {userOthersCount} {userOthersCount > 1 ? 'others' : 'other'}
      //         </span>
      //       )}{' '}
      //       {textContent}
      //     </span>
      //   );

      // case 'MENTIONED':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       <span className="font-semibold text-gray-800">{profileName}</span>{' '}
      //       mentioned you in a {formatMentionedType()}: {textContent}
      //     </span>
      //   );

      // case 'NEWS':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       <span className="font-semibold text-gray-800">{profileName}</span>{' '}
      //       {formatMentionedType(true)}
      //       {formatActionContentType()}: Glassmorphism - learn how to implement
      //       the new design trend.
      //     </span>
      //   );
      // // ==== END MOCK TYPE ====

      // case 'DM':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       <span className="font-semibold text-gray-800">{profileName}</span>{' '}
      //       {textContent}
      //     </span>
      //   );
      // case 'GROUP':
      //   return (
      //     <span className="text-gray-500 leading-tight text-sm font-normal">
      //       <span className="font-semibold text-gray-800">{profileName}</span>{' '}
      //       {textContent}
      //     </span>
      //   );
      default:
        return (
          <span className="text-gray-500 leading-tight text-sm font-normal">
            {/* UNKNOWN_NOTI_TYPE ({type}) */}
            <span className="font-semibold text-gray-800">
              {profileName}
            </span>{' '}
            {textContent}
          </span>
        );
    }
  };
  return (
    <>
      {!!profileName && (
        <div
          className="flex gap-3 w-full items-center rounded-md cursor-pointer hover:bg-gray-100 transition p-2 max-lg:p-0"
          onClick={handleClick}>
          <div className="min-w-[40px]">
            <Avatar img={profileImg} size={profileImgSize} />
          </div>
          <div className="flex flex-col gap-1 items-start">
            {formatText()}
            <span className="leading-tight text-primary-600 text-xs font-normal">
              {moment(date).fromNow()}
            </span>
          </div>

          {isRead === false ? (
            <IconButton
              className="!cursor-default ms-auto pointer-events-none"
              icon={GoDotFill}
              color="#ff6969"
              width={20}
              height={20}
            />
          ) : (
            ''
          )}
        </div>
      )}
    </>
  );
}
