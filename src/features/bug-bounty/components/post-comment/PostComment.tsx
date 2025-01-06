// import (Internal imports)
import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

// draft-js and draft-js-export-html
import { convertFromRaw } from 'draft-js';
import { Options, stateToHTML } from 'draft-js-export-html';

// react-player
import ReactPlayer from 'react-player';

// react-loading-skeleton
import Skeleton from 'react-loading-skeleton';

// flowbite-react
import { Avatar } from 'flowbite-react';

// helper functions
import useBoolean from '../../../../helper/hook/useBoolean.ts';
import useResponsive from '../../../../helper/hook/useResponsive';
import { Logger } from '../../../../helper/logger.ts';

// redux
import { useDispatch } from '../../../../redux';
import { openLightBoxFile } from '../../../../redux/lightbox-file';

// wrapper
import LightboxFilePortal from '../../../../wrapper/LightBoxFilePortal';

// constant
import { defaultImages } from '../../../../constant/default-images';
import { getIconByFileType } from '../../../../constant/icon-files';

// type definitions
import { BugBountyPayload } from '../../../../type/bug-bounty';

// @shares
import {
  blockStyleFn,
  customInlineStyles,
} from '../../../@shares/custom-styles/CustomInlineStyles';

// css
import './post-comment.css';

const log = new Logger('PostComment');

interface FileWithContent {
  content: string;
  optional: {
    fileName: string;
    fileSize: number;
    fileType: string;
    lastModified: number;
  };
}

interface PostCommentProps {
  data: BugBountyPayload;
}

const PostComment: React.FC<PostCommentProps> = ({ data }) => {
  const dispatch = useDispatch();

  const { isTabletOrMobile } = useResponsive();

  const [base64Files, setBase64Files] = useState<FileWithContent[]>([]);
  const [isLoadingData, loadingDataStart, loadingDataEnd] = useBoolean(true);

  const formattedTime = new Date(data.createdAt).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = new Date(data.createdAt).toLocaleString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    loadingDataStart();
    const fetchBase64Files = async () => {
      const filesInformationArray: FileWithContent[] = [];
      try {
        await Promise.all(
          (data.files as unknown as FileWithContent[]).map(async file => {
            const con = file?.content;
            if (con) {
              const resp = await fetch(con);
              const content = await resp.text();
              filesInformationArray.push({ ...file, content });
            } else {
              filesInformationArray.push(file);
            }
          })
        );
        setBase64Files(filesInformationArray);
        loadingDataEnd();
      } catch (error) {
        log.error('Error fetching or converting files:', error);
        loadingDataEnd();
      }
    };

    if (data.files && data.files.length > 0) {
      fetchBase64Files();
    } else {
      loadingDataEnd();
    }
  }, [data.files]);

  let postComment = '';

  try {
    if (data.detail.startsWith('{') && data.detail.endsWith('}')) {
      const parsedComment = JSON.parse(data.detail);
      const contentState = convertFromRaw(parsedComment);

      const customOptions: Options = {
        inlineStyles: customInlineStyles,
        blockStyleFn: blockStyleFn,
      };

      postComment = stateToHTML(contentState, customOptions);
    } else {
      postComment = data.detail;
    }
  } catch (error) {
    log.error('Error parsing or converting post comment:', error);
    postComment = data.detail;
  }

  const openLightboxFile = (index: number) => {
    const files = base64Files.map(file => ({
      src: file.content,
      name: file.optional.fileName,
    }));
    dispatch(openLightBoxFile({ files, fileIndex: index }));
  };

  const renderFiles = (files: FileWithContent[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="max-w-[165px] max-h-[165px] relative flex justify-center items-center overflow-hidden border rounded-[1rem]"
            onClick={() => openLightboxFile(index)}
            style={{ cursor: 'pointer' }}>
            {file.optional.fileType.startsWith('image/') ? (
              <img
                src={file.content || defaultImages.errorImage}
                className="object-cover"
                alt={file.optional.fileName}
              />
            ) : file.optional.fileType.startsWith('video/') ? (
              <div className="object-contain h-[165px]">
                <ReactPlayer
                  url={file.content}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
            ) : (
              <img
                src={getIconByFileType(file.optional?.fileType)}
                className="p-5 object-contain"
                alt={file.optional?.fileName}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMobileLayout = (files: FileWithContent[]) => {
    return (
      <div className="grid rounded-[1rem] bg-white gap-1 overflow-hidden">
        {files.length === 1 && (
          <div
            className="col-span-1 border rounded-[1rem] overflow-hidden"
            onClick={() => openLightboxFile(0)}
            style={{ cursor: 'pointer' }}>
            {checkFiles(files.slice(0, 1))}
          </div>
        )}
        {files.length === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {files.slice(0, 2).map((file, index) => (
              <div
                key={index}
                className="border rounded-[1rem] overflow-hidden"
                onClick={() => openLightboxFile(index)}
                style={{ cursor: 'pointer' }}>
                {checkFiles([file])}
              </div>
            ))}
          </div>
        )}
        {files.length === 3 && (
          <div className="grid grid-cols-2 gap-1">
            <div
              className="col-span-1 row-span-2 border rounded-[1rem] overflow-hidden"
              onClick={() => openLightboxFile(0)}
              style={{ cursor: 'pointer' }}>
              {checkFiles(files.slice(0, 1))}
            </div>
            <div className="grid grid-rows-2 gap-1">
              <div
                className="row-span-1 border rounded-[1rem] overflow-hidden"
                onClick={() => openLightboxFile(1)}
                style={{ cursor: 'pointer' }}>
                {checkFiles(files.slice(1, 2))}
              </div>
              <div
                className="row-span-1 border rounded-[1rem] overflow-hidden"
                onClick={() => openLightboxFile(2)}
                style={{ cursor: 'pointer' }}>
                {checkFiles(files.slice(2, 3))}
              </div>
            </div>
          </div>
        )}
        {files.length === 4 && (
          <div className="grid grid-cols-2 grid-rows-[1fr_1fr] gap-1">
            {files.slice(0, 4).map((file, index) => (
              <div
                key={index}
                className="border rounded-[1rem] overflow-hidden"
                onClick={() => openLightboxFile(index)}
                style={{ cursor: 'pointer' }}>
                {checkFiles([file])}
              </div>
            ))}
          </div>
        )}
        {files.length >= 5 && (
          <div className="grid auto-rows-auto gap-1">
            <div className="grid grid-cols-2 gap-1">
              {files.slice(0, 2).map((file, index) => (
                <div
                  key={index}
                  className="border rounded-[1rem] overflow-hidden"
                  onClick={() => openLightboxFile(index)}
                  style={{ cursor: 'pointer' }}>
                  {checkFiles([file])}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {files.slice(2, 5).map((file, index) => (
                <div
                  key={index}
                  className="border rounded-[1rem] overflow-hidden"
                  onClick={() => openLightboxFile(index + 2)}
                  style={{ cursor: 'pointer' }}>
                  {checkFiles([file])}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const checkFiles = (files: FileWithContent[]) => {
    return (
      <>
        {files.map((file, index) => (
          <div
            key={index}
            className="w-full h-full flex items-center justify-center">
            {file.optional.fileType.startsWith('image/') ? (
              <img
                src={file.content || defaultImages.errorImage}
                className="object-cover w-full h-full"
                alt={file.optional.fileName}
              />
            ) : file.optional.fileType.startsWith('video/') ? (
              <div className="w-full h-full">
                <ReactPlayer
                  url={file.content}
                  controls={true}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <img
                src={getIconByFileType(file.optional?.fileType)}
                className="p-5 object-contain w-full h-full"
                alt={file.optional?.fileName}
              />
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <LightboxFilePortal>
      <div
        className={classNames(
          'grid grid-cols-[auto_1fr] items-start gap-3 border-b bg-white',
          {
            'p-4': isTabletOrMobile,
            'px-10 py-5': !isTabletOrMobile,
          }
        )}>
        <CustomAvatar>
          <Avatar
            img={data.user?.picture || defaultImages.noProfile}
            size="md"
            alt="AVATAR"
            rounded
          />
        </CustomAvatar>

        <div className="flex flex-col items-start self-stretch gap-3 w-full max-sm:gap-1">
          <div className="flex justify-between items-center self-stretch flex-wrap">
            <p className="text-[#111928] text-xl font-bold max-sm:text-lg">
              {data.user?.displayName}
            </p>
            <span className="text-[#6B7280] text-sm font-normal">
              {formattedTime} • {formattedDate}
            </span>
          </div>
          <div className="flex flex-col items-start self-stretch gap-3 max-sm:gap-1">
            {data.title && (
              <p
                className={classNames('text-[#111928] font-bold', {
                  'text-2xl max-sm:text-lg': isTabletOrMobile,
                  'text-3xl': !isTabletOrMobile,
                })}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {data.title}
              </p>
            )}
            <p
              className="text-base font-normal"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: postComment }}></p>
            {isLoadingData ? (
              <SkeletonLoader count={1} />
            ) : (
              <CustomRenderFiles>
                <div className="flex flex-col items-start self-stretch gap-3">
                  {isTabletOrMobile
                    ? renderMobileLayout(base64Files)
                    : renderFiles(base64Files)}
                </div>
              </CustomRenderFiles>
            )}
          </div>
        </div>
      </div>
    </LightboxFilePortal>
  );
};

export default PostComment;

function SkeletonLoader({ count }: { count: number }) {
  const { isTabletOrMobile } = useResponsive();
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex w-full">
          <div className="w-full h-full">
            <Skeleton
              height={280}
              className={classNames('!rounded-[1rem]', {
                '!w-full !max-w-[350px] !max-h-[280px] ': isTabletOrMobile,
                '!max-w-[165px] !max-h-[165px]': !isTabletOrMobile,
              })}
            />
          </div>
        </div>
      ))}
    </>
  );
}

const CustomRenderFiles = styled.div`
  @media (min-width: 512px) and (max-width: 1024px) {
    width: 380px;
  }
`;

const CustomAvatar = styled.div`
  img {
    object-fit: cover;
  }
`;
