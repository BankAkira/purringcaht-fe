import moment from 'moment';
import Avatar from '../avatar/Avatar';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { Spinner } from 'flowbite-react';
import OfficialIcon from '../../asset/icon/official/official-icon.png';

type Props = {
  img: string | string[];
  name: string;
  userId?: string;
  conversationId?: string;
  memberCount?: number;
  text: ReactNode;
  status?: 'online' | 'busy' | 'away' | 'offline';
  onClick?: () => void;
  unreadCount?: number;
  timestamp: number;
  textHighlight?: boolean;
  isFetch?: boolean;
  isOfficial?: boolean;
};

export default function ChatTab({
  img,
  name,
  text,
  memberCount,
  status,
  onClick,
  unreadCount,
  timestamp,
  textHighlight,
  isFetch,
  isOfficial = false,
}: Props) {
  return (
    <div
      className="flex w-full px-0 cursor-pointer justify-content-between"
      onClick={onClick}>
      <div className="flex items-center w-[80%] gap-3">
        <div className="min-w-[40px]">
          <Avatar img={img} status={status} size="md" />
        </div>
        <div className="font-medium dark:text-white">
          <div className="flex gap-1">
            <div className="text-sm font-normal text-gray-900 truncate max-w-44">
              <div className="flex">
                {' '}
                {isOfficial && (
                  <img
                    className="mr-1"
                    width={16}
                    height={16}
                    src={OfficialIcon}
                    alt="icon"
                  />
                )}
                {name}{' '}
              </div>
            </div>
            {!!memberCount && (
              <span className="text-sm font-normal text-gray-900">
                {memberCount ? `(${memberCount})` : ''}
              </span>
            )}
          </div>

          <div
            className={classNames('text-xs max-w-44 truncate fade-in ', {
              'font-semibold text-gray-900': !!unreadCount,
              'text-[#6B7280]': !unreadCount,
              'text-[#FE7601]': textHighlight,
            })}>
            {text}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end w-[20%] whitespace-nowrap">
        <div className="text-[10px] !text-gray-400 leading-[24px] fade-in">
          {moment.unix(timestamp).fromNow()}
        </div>
        {!isFetch ? (
          <>
            {!!unreadCount && (
              <div
                className={
                  (unreadCount >= 10 ? 'text-[9.5px]' : 'text-xs') +
                  ' bg-[#FE7601] rounded-full w-[16.5px] h-[16.5px] line-clamp-none font-bold text-white flex justify-center items-center'
                }>
                <span className="-mb-[0.5px]">
                  {unreadCount <= 99 ? unreadCount : 99}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="h-[12px] flex items-center justify-center">
            <Spinner color="gray" size="xs" />
          </div>
        )}
      </div>
    </div>
  );
}
