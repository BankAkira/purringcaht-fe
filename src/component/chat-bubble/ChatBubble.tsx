import React from 'react';
import './chat-bubble.css';
import IconButton from '../icon-button/IconButton';
import { FaDownload } from 'react-icons/fa6';
import { ChatBubbleProps } from '../../type/chat';
import pdfIcon from '../../asset/images/pdf-icon.svg';

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isSender,
  fileDetails,
  maxWidth,
}) => {
  const bubbleClasses = `chat-bubble ${isSender ? 'sender' : 'receiver'}`;

  return (
    <div
      className={` ${isSender ? 'align-right' : 'align-left'}`}
      style={{
        maxWidth: `${maxWidth && maxWidth !== 0 ? maxWidth : '300'}px`,
      }}>
      <div className={bubbleClasses}>
        <div
          className={
            fileDetails !== undefined && fileDetails !== null
              ? 'chat-content file-content'
              : 'chat-content text-content'
          }>
          {fileDetails !== undefined && fileDetails !== null ? (
            <div className="gap-4 file-message">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={pdfIcon} alt="" />
                  <div className="text-sm font-semibold text-gray-900">
                    {fileDetails.name}
                  </div>
                </div>
                <div className="leading-[20px]">
                  <div className="flex flex-row items-center">
                    <div className="text-xs text-[#6B7280]">
                      {fileDetails.page}
                    </div>
                    <div className="mx-2 text-gray-500">&#x2022;</div>
                    <div className="text-xs text-[#6B7280]">
                      {fileDetails.size}
                    </div>
                    <div className="mx-2 text-gray-500">&#x2022;</div>
                    <div className="text-xs text-[#6B7280]">
                      {fileDetails.type}
                    </div>
                  </div>
                </div>
              </div>
              <div className="file-download-icon">
                <IconButton
                  color="#111928"
                  icon={FaDownload}
                  width={20}
                  height={20}
                />
              </div>
            </div>
          ) : (
            <p className="!text-base !font-[300] tracking-wide">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
