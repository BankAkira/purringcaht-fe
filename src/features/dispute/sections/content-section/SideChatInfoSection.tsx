import Avatar from '../../../../component/avatar/Avatar.tsx';
import MediaThumbnail from './MediaThumbnail.tsx';
import { FaEdit, FaRegWindowClose } from 'react-icons/fa';
import { BiDislike } from 'react-icons/bi';
import { GoTrash } from 'react-icons/go';
import { useSelector } from '../../../../redux';
import useConversationProfile from '../../../../helper/hook/useConversationProfile.tsx';
import { defaultImages } from '../../../../constant/default-images.ts';
// import { Logger } from '../../../../../../helper/logger';

import FileThumbnail from './FileThumbnail.tsx';
import {
  ConversationRole,
  ConversationType,
} from '../../../../type/conversation.ts';

// const log = new Logger('SideChatInfoSection');

export default function SideChatInfoSection() {
  const { conversation } = useSelector(state => state.messageDispute);
  const { user } = useSelector(state => state.account);

  const profile = useConversationProfile(conversation);

  if (!conversation) return <></>;

  const img =
    conversation.type === ConversationType.GROUP
      ? conversation.profilePicture
      : profile?.pictures;

  return (
    <div className="flex flex-col w-full min-h-full gap-6 px-3 pt-4 pb-6 overflow-y-auto">
      <div className="text-center w-full">
        {profile && (
          <div
            className={
              (conversation.participants.find(item => item.userId === user?.id)
                ?.role !== ConversationRole.MEMBER
                ? ''
                : 'pointer-events-none') + ' relative w-full'
            }>
            <Avatar
              img={img ? img : defaultImages.noProfile}
              isChatProfile
              name={profile.name}
              size="lg"
              text={''}
            />
            {conversation.participants.find(item => item.userId === user?.id)
              ?.role !== ConversationRole.MEMBER && (
              <>
                <FaEdit className="absolute top-[calc(50%+13px)] right-[calc(50%-51px)] -translate-x-1/2 -translate-y-1/2 text-[20px] text-gray-700 drop-shadow cursor-pointer z-[1]" />
                <div className="absolute top-[calc(50%+13px)] right-[calc(50%-46px)] -translate-x-1/2 -translate-y-1/2 bg-white w-[18px] h-[18px] rounded pointer-events-none" />
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {conversation.type === ConversationType.GROUP && (
            <span className="text-xs text-blue-500 cursor-pointer">
              View all member ({conversation.participants.length})
            </span>
          )}
          {conversation.type === ConversationType.GROUP &&
            conversation?.description && (
              <span className="text-xs text-gray-500 break-all">
                {conversation?.description}
              </span>
            )}
        </div>
      </div>
      <MediaThumbnail />
      <FileThumbnail />
      <div className="flex flex-col gap-4 mt-3 text-[#F05252]">
        {!conversation.isBlocked && !conversation.isBlockedByMe && (
          <div
            className="flex items-center gap-2 transition select-none opacity-70"
            onClick={() => {}}>
            <span>
              <FaRegWindowClose className="text-base" />
            </span>
            <p className="text-sm">
              {conversation.type === ConversationType.DM
                ? 'Block user'
                : 'Block group'}
            </p>
          </div>
        )}
        <div
          className="flex items-center gap-2 transition select-none opacity-70"
          onClick={() => {}}>
          <span>
            <BiDislike className="text-base" />
          </span>
          <p className="text-sm">
            {conversation.type === ConversationType.DM
              ? 'Report user'
              : 'Report group'}
          </p>
        </div>
        <div
          className="flex items-center gap-2 transition select-none opacity-70"
          onClick={() => {}}>
          <span>
            <GoTrash className="text-base" />
          </span>
          <p className="text-sm">Delete chat</p>
        </div>
      </div>
    </div>
  );
}
