// import (Internal imports)
import { useState, useEffect } from 'react';

// react-icons
import { PiPaperclipHorizontal } from 'react-icons/pi';

import styled from 'styled-components';

// helper functions
import { downloadFile } from '../../../helper/file';
import { decryptMessage } from '../../../helper/crypto';
import { formatDate } from '../../../helper/format-date';

// redux
import { useSelector } from '../../../redux';

// types
import { FileMail, MessageContentType } from '../../../type';

// constants
import { defaultImages } from '../../../constant/default-images';
import { getIconByFileTypes } from '../../../constant/icon-files';

interface MessageListItemProps {
  avatarUrl: string;
  senderName: string;
  senderEmail: string;
  recipientEmail?: string;
  timestamp: string;
  content?: string;
  files?: FileMail[];
  isExpanded: boolean;
}

export default function MessageListItem({
  avatarUrl,
  senderName,
  senderEmail,
  recipientEmail,
  timestamp,
  content,
  files,
  isExpanded: isExpandedProp,
}: MessageListItemProps) {
  const { mailScheme } = useSelector(state => state.purrMail);

  // Use isExpandedProp as the initial state
  const [isExpanded, setIsExpanded] = useState(isExpandedProp);

  // Update local state if the prop changes
  useEffect(() => {
    setIsExpanded(isExpandedProp);
  }, [isExpandedProp]);

  const handleExpandClick = () => {
    setIsExpanded(prev => !prev);
  };

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts[parts.length - 1];
  };

  const handleDownloadFile = async (content: string, fileName: string) => {
    if (!content) return;
    const base64 = await decryptMessage(
      content,
      MessageContentType.FILE,
      mailScheme
    );
    if (base64 === 'Unsupport Message') return;
    downloadFile(base64, fileName);
  };

  const processContent = (htmlContent: string) => {
    let imageCounter = 0;
    const imgRegex = /<img.*?src="data:(image\/\w+);base64,.*?".*?>/g;

    return htmlContent
      .replace(imgRegex, (_match, p1) => {
        imageCounter += 1;
        const fileType = p1.split('/')[1];
        const fileName = `image_${imageCounter}.${fileType}`;
        return `[Embedded Image: ${fileName}]`;
      })
      .replace(/<\/?p>/g, ' ')
      .replace(/<br\s*\/?>/g, ' ')
      .trim();
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div
        className="grid grid-cols-2 items-start cursor-pointer"
        onClick={handleExpandClick}>
        {/* Sender and Recipient Information */}
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={avatarUrl || defaultImages.noProfile}
            alt={senderName}
            className="w-10 h-10 rounded-full"
          />

          {/* Sender Info */}
          <CustomSenderInfoStyle>
            <p className="text-[#212B36] text-sm font-semibold text-ellipsis whitespace-nowrap overflow-hidden sender-info">
              {senderName}
              <span className="text-[#919EAB] text-xs font-normal text-ellipsis whitespace-nowrap overflow-hidden pl-2">
                &lt;{senderEmail}&gt;
              </span>
            </p>
            {recipientEmail && (
              <p className="flex items-baseline justify-start gap-2 text-[#212B36] text-xs font-normal">
                To:
                <span className="text-[#919EAB] text-xs font-normal truncate">
                  {recipientEmail}
                </span>
              </p>
            )}
          </CustomSenderInfoStyle>
        </div>

        {/* Timestamp */}
        <p className="flex items-center justify-end gap-3 text-[#919EAB] text-xs text-end font-normal">
          {files && files.length > 0 && <PiPaperclipHorizontal size={20} />}
          {formatDate(timestamp)}
        </p>
      </div>
      {!isExpanded ? (
        <div
          className="flex items-center justify-start cursor-pointer"
          onClick={handleExpandClick}>
          <p className="text-[#555] text-xs truncate">
            {processContent(content || '')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div
            className="message-content"
            dangerouslySetInnerHTML={{ __html: content || '' }}></div>
          {files && files.length > 0 && (
            <>
              <p className="text-[#5A6A85] text-sm font-semibold">
                Attachments: {files.length} files
              </p>
              <CustomFileListStyle>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 cursor-pointer">
                  {files.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex items-center gap-3"
                      onClick={() =>
                        handleDownloadFile(file.content, file.optional.fileName)
                      }>
                      <div className="flex items-center justify-center min-w-12 min-h-12 rounded-lg bg-[#F2F6FA]">
                        <img
                          src={getIconByFileTypes(
                            getFileExtension(file.optional.fileName || '')
                          )}
                          alt="INCON_FILES"
                          width={30}
                          height={30}
                        />
                      </div>
                      <div className="flex flex-col max-w-[50%]">
                        <p className="text-[#2A3547] text-sm font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
                          {file.optional.fileName}
                        </p>
                        <p className="flex flex-wrap gap-1 text-[#7C8FAC] text-xs font-normal">
                          <span>{file.optional.fileSize}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CustomFileListStyle>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const CustomSenderInfoStyle = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media screen and (max-width: 495px) {
    gap: 12px;
    .sender-info {
      margin-right: 44px;
    }
  }
`;

const CustomFileListStyle = styled.div`
  .grid {
    display: grid;
    @media screen and (max-width: 344px) {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
`;
