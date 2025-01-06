import classNames from 'classnames';
import { AvatarProps } from '../../type/chat';
import Avatar from '../avatar/Avatar';
import './chat.css';

interface ChatProps {
  avatar: AvatarProps;
  isDelivered?: boolean;
  isSender?: boolean;
}

export default function Chat({
  avatar,
  isDelivered = false,
  isSender = false,
}: ChatProps) {
  const newData: AvatarProps = {
    ...avatar,
    chatBubble: { ...avatar.chatBubble, isSender: isSender },
  };
  return (
    <div
      className={classNames('w-full flex ', {
        'justify-end': isSender,
        'justify-start': !isSender,
      })}>
      {!!avatar &&
        !!avatar.chatBubble &&
        (!!avatar.chatBubble.message || !!avatar.chatBubble.fileDetails) && (
          <div className="flex flex-col items-end gap-1 mb-4">
            <Avatar size="xl" {...newData} />
            <span className="text-sm text-gray-500 me-[48px] font-[300]">
              {isDelivered && isSender ? 'Delivered' : ''}
            </span>
          </div>
        )}
    </div>
  );
}
