import './avatar.css';
import { Avatar as FlowBiteAvatar } from 'flowbite-react';
import { defaultImages } from '../../constant/default-images';
import { isArray } from 'lodash';
import { LuCopy } from 'react-icons/lu';
import ChatBubble from '../chat-bubble/ChatBubble';
import { AvatarProps } from '../../type/chat';
import chatFormatDate from '../../helper/chat-format-date';
import { IoVolumeMuteSharp } from 'react-icons/io5';

/**
 * Primary UI component for user interaction
 */
export default function Avatar({
  noCursorPointer = false,
  status,
  isMute,
  size = 'md',
  name,
  memberCount,
  text,
  isShowTextStatus,
  isChatProfile,
  chatBubble,
  img,
  onClick,
  ...props
}: AvatarProps) {
  const statusTextColor = (status: 'online' | 'busy' | 'away' | 'offline') => {
    switch (status) {
      case 'online':
        return '!text-green-500';
      case 'busy':
        return '!text-red-500';
      case 'away':
        return '!text-yellow-500';
      case 'offline':
        return '!text-gray-500';
      default:
        return '';
    }
  };

  const minSize = () => {
    switch (size) {
      case 'xs':
        return { minWidth: '24px', minHeight: '24px' };
      case 'sm':
        return { minWidth: '32px', minHeight: '32px' };
      case 'md':
        return { minWidth: '40px', minHeight: '40px' };
      case 'lg':
        return { minWidth: '80px', minHeight: '80px' };
      case 'xl':
        return { minWidth: '144px', minHeight: '144px' };
      default:
        return { minWidth: '', minHeight: '' };
    }
  };
  // console.log('img', img);

  return (
    <>
      {isArray(img) && !!img.length ? (
        <>
          {isChatProfile ? (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <FlowBiteAvatar.Group>
                {img.slice(0, 2).map((item, index) => (
                  <FlowBiteAvatar
                    className={'avatar-' + index}
                    size={size}
                    key={index}
                    status={
                      isShowTextStatus && img.length === 1 ? undefined : status
                    }
                    statusPosition="top-right"
                    img={props => (
                      <img
                        alt=""
                        referrerPolicy="no-referrer"
                        style={{
                          objectFit: 'cover',
                          minWidth: minSize().minWidth,
                          minHeight: minSize().minHeight,
                        }}
                        src={item}
                        {...props}
                        onError={e => {
                          e.currentTarget.src = defaultImages.noProfile;
                        }}
                      />
                    )}
                    rounded
                    stacked
                    {...props}
                    onClick={onClick}
                  />
                ))}
                {/* <FlowBiteAvatar.Counter
              total={img.length - 2}
              className="max-w-[32px] max-h-[32px] avatar-2"
            /> */}
              </FlowBiteAvatar.Group>
              {!!name && (
                <>
                  <div className="font-medium dark:text-white">
                    <div
                      // className="flex flex-col items-center justify-center text-xl font-bold text-center text-gray-900"
                      className="items-center justify-center text-xl font-bold text-center text-gray-900 truncate max-w-[200px]"
                      {...props}>
                      <span>{name}</span>

                      {/* <span className="text-xs cursor-pointer text-primary-700">
                        view all member ({img.length})
                      </span> */}
                    </div>
                    {/* <p className="flex items-center mb-1 gap-2 text-[#6B7280]">
                          <span className="text-base font-normal">
                            ID : RobertaCasas_789
                          </span>
                          <LuCopy
                            className="text-[16px] rotate-90 cursor-pointer"
                            {...props}
                          />
                        </p> */}
                    {!!text && (
                      <div className="text-xs !text-[#9CA3AF] flex gap-2 items-center justify-center mt-2">
                        {text}
                      </div>
                    )}
                  </div>
                  {/* <Button className="w-full mt-2 rounded-full bg-gradient-to-br from-pink-500 to-orange-400">
                        Run a Background Check
                      </Button> */}
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-3 cursor-pointer wrapper-avatar-group-custom w-full">
              <FlowBiteAvatar.Group>
                {img.slice(0, 2).map((item, index) => (
                  <FlowBiteAvatar
                    className={'avatar-' + index}
                    size={status ? 'sm' : size}
                    key={index}
                    status={
                      isShowTextStatus && img.length === 1 ? undefined : status
                    }
                    statusPosition="top-right"
                    img={props => (
                      <img
                        alt=""
                        referrerPolicy="no-referrer"
                        style={{
                          objectFit: 'cover',
                          minWidth: minSize().minWidth,
                          minHeight: minSize().minHeight,
                        }}
                        src={item}
                        {...props}
                        onError={e => {
                          e.currentTarget.src = defaultImages.noProfile;
                        }}
                      />
                    )}
                    rounded
                    stacked
                    {...props}
                    onClick={onClick}
                  />
                ))}
                {/* <FlowBiteAvatar.Counter
              total={img.length - 2}
              className="max-w-[32px] max-h-[32px] avatar-2"
            /> */}
              </FlowBiteAvatar.Group>
              {!!name && (
                <div
                  className={
                    status
                      ? 'font-medium dark:text-white w-full'
                      : 'flex font-medium dark:text-white w-full'
                  }>
                  <div className="text-sm font-semibold flex items-center gap-2 overflow-hidden w-full">
                    {/* {name} */}
                    <div className={'flex gap-2 w-full items-center'}>
                      <div className="text-sm font-semibold truncate w-full">
                        {name}
                      </div>
                      {isMute && !status && (
                        <IoVolumeMuteSharp className="text-gray-500 !text-[18px] -mt-[1px]" />
                      )}
                    </div>
                  </div>
                  {!!text && (
                    <div className="text-sm !text-gray-400">{text}</div>
                  )}
                  {!text && isShowTextStatus && !!status && (
                    <div
                      className={
                        statusTextColor(status) +
                        ' text-sm flex gap-1 capitalize select-none items-center leading-[20px]'
                      }>
                      <span className="text-[32px] mt-[3px]">•</span>
                      <span>{status}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {!isArray(img) && (
            <>
              {isChatProfile && !chatBubble ? (
                <div className="flex flex-col items-center justify-center gap-2 w-full">
                  <FlowBiteAvatar
                    size={size}
                    img={props => (
                      <img
                        alt=""
                        referrerPolicy="no-referrer"
                        style={{
                          objectFit: 'cover',
                          cursor: noCursorPointer ? 'auto' : 'pointer',
                          minWidth: minSize().minWidth,
                          minHeight: minSize().minHeight,
                        }}
                        src={img || defaultImages.noProfile}
                        {...props}
                        onError={e => {
                          e.currentTarget.src = defaultImages.noProfile;
                        }}
                      />
                    )}
                    rounded
                    status={isShowTextStatus ? undefined : status}
                    className=""
                    statusPosition="top-right"
                    onClick={onClick}
                    {...props}
                  />
                  {!!name && (
                    <>
                      <div className="font-medium dark:text-white w-full">
                        <div
                          className="text-xl font-bold text-center text-gray-900 truncate"
                          {...props}>
                          {name}
                        </div>
                        {/* <p className="flex items-center mb-1 gap-2 text-[#6B7280]">
                          <span className="text-base font-normal">
                            ID : RobertaCasas_789
                          </span>
                          <LuCopy
                            className="text-[16px] rotate-90 cursor-pointer"
                            {...props}
                          />
                        </p> */}
                        {!!text && (
                          <div className="text-sm !text-[#9CA3AF] flex gap-2 items-center justify-center">
                            ID: {text}{' '}
                            <LuCopy
                              className="text-[16px] rotate-90 cursor-pointer"
                              {...props}
                            />
                          </div>
                        )}
                      </div>
                      {/* <Button className="w-full mt-2 rounded-full bg-gradient-to-br from-pink-500 to-orange-400">
                        Run a Background Check
                      </Button> */}
                    </>
                  )}
                </div>
              ) : (
                <FlowBiteAvatar
                  size={size || 'md'}
                  img={props => (
                    <img
                      alt=""
                      referrerPolicy="no-referrer"
                      style={{
                        objectFit: 'cover',
                        cursor: noCursorPointer ? 'auto' : 'pointer',
                        minWidth: minSize().minWidth,
                        minHeight: minSize().minHeight,
                      }}
                      src={img || defaultImages.noProfile}
                      {...props}
                      onError={e => {
                        e.currentTarget.src = defaultImages.noProfile;
                      }}
                    />
                  )}
                  rounded
                  status={isShowTextStatus ? undefined : status}
                  className={
                    (!!chatBubble && !chatBubble.isSender
                      ? 'items-start '
                      : !!chatBubble && chatBubble.isSender
                        ? 'flex-row-reverse items-start gap-3 !space-x-0'
                        : '') + ' w-full !justify-start custom-div-width'
                  }
                  statusPosition="top-right"
                  {...props}>
                  {!!name && (
                    <div className="font-medium dark:text-white  w-full">
                      <div
                        className={
                          (!!chatBubble && !!chatBubble.isSender
                            ? 'text-end'
                            : 'flex') +
                          ' text-sm text-[#111928] font-bold  w-full'
                        }
                        {...props}>
                        <div className="text-sm font-semibold flex items-center gap-2 overflow-hidden w-full">
                          {/* {name} */}
                          <div className="flex gap-1 w-full items-center">
                            <div className="text-sm font-semibold truncate w-full">
                              {name}
                            </div>
                            {!!memberCount && (
                              <span className="text-sm font-semibold">
                                {memberCount ? `(${memberCount})` : ''}
                              </span>
                            )}
                            {isMute && (
                              <IoVolumeMuteSharp className="text-gray-500 !text-[18px] -mt-[1px] ms-[1px]" />
                            )}
                          </div>
                        </div>
                        <span className="ms-2 !text-sm !font-[300] text-[#6B7280]">
                          {!!chatBubble &&
                            !!chatBubble.date &&
                            chatFormatDate(chatBubble.date)}
                        </span>
                      </div>

                      {isShowTextStatus && !!status && !chatBubble ? (
                        <div
                          className={
                            statusTextColor(status) +
                            ' text-sm flex gap-1 capitalize select-none items-center leading-[20px]'
                          }>
                          <span className="text-[32px] mt-[3px]">•</span>
                          <span>{status}</span>
                        </div>
                      ) : (
                        <>
                          {!!chatBubble &&
                          (!!chatBubble.message || !!chatBubble.fileDetails) ? (
                            <ChatBubble
                              message={chatBubble.message}
                              isSender={chatBubble.isSender || false}
                              fileDetails={chatBubble.fileDetails}
                            />
                          ) : (
                            <div className="text-sm !text-gray-400 truncate max-w-[220px]">
                              {text}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </FlowBiteAvatar>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
