// import (Internal imports)
import { PropsWithChildren } from 'react';

import styled from 'styled-components';

// react-icons
import { BsDownload } from 'react-icons/bs';

// react-lightbox
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

// react-player
import ReactPlayer from 'react-player';

// helper functions
import { downloadFile } from '../helper/file';

// redux
import { useDispatch, useSelector } from '../redux';
import {
  closeLightBox,
  onMoveNextLightBoxFile,
  onMovePrevLightBoxFile,
} from '../redux/lightbox-file';

// constant
import { getIconByFileTypes } from '../constant/icon-files';

export default function LightboxFilePortal({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const { files, fileIndex } = useSelector(state => state.lightBoxFile);

  const onMovePrevRequest = () => {
    if (files.length > 1) {
      dispatch(onMovePrevLightBoxFile());
    }
  };

  const onMoveNextRequest = () => {
    if (files.length > 1) {
      dispatch(onMoveNextLightBoxFile());
    }
  };

  const onCloseRequest = () => {
    dispatch(closeLightBox());
  };

  const checkSrc = (src: string) => {
    let content = src;
    if (src.includes('/quicktime;')) {
      content = src.replace('/quicktime;', '/mp4;');
    }
    return content;
  };

  const isImageOrVideo = (src: string) => {
    return src.startsWith('data:image/') || src.startsWith('data:video/');
  };

  const isImage = (src: string) => {
    return src.startsWith('data:image/');
  };

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts[parts.length - 1];
  };

  const downloadFileHandler = () => {
    const { src, name } = files[fileIndex];
    downloadFile(src, name);
  };

  const renderFileContent = (file: { src: string; name?: string }) => {
    if (isImageOrVideo(file.src)) {
      return (
        <ReactPlayer
          url={checkSrc(file.src)}
          width="100%"
          height="100%"
          controls
          className="z-[1]"
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center gap-5 h-full w-full p-10 text-center">
          <img
            src={getIconByFileTypes(getFileExtension(file.name || ''))}
            alt="File"
            style={{ width: 120, height: 120 }}
          />
          <p className="text-white">
            Cannot display this file. You can download it using the download
            button.
          </p>
        </div>
      );
    }
  };

  return (
    <>
      {children}
      {!!files.length && (
        <>
          <Lightbox
            mainSrc={files[fileIndex].src}
            nextSrc={
              files.length > 1
                ? files[(fileIndex + 1) % files.length].src
                : undefined
            }
            prevSrc={
              files.length > 1
                ? files[(fileIndex + files.length - 1) % files.length].src
                : undefined
            }
            onCloseRequest={onCloseRequest}
            onMovePrevRequest={files.length > 1 ? onMovePrevRequest : undefined}
            onMoveNextRequest={files.length > 1 ? onMoveNextRequest : undefined}
            reactModalStyle={{ overlay: { zIndex: 9999 } }}
            enableZoom={isImage(files[fileIndex].src)}
            toolbarButtons={[
              !isImageOrVideo(files[fileIndex].src) && (
                <CustomButton key="download" onClick={downloadFileHandler}>
                  <BsDownload size={24} />
                </CustomButton>
              ),
            ]}
            imageLoadErrorMessage={renderFileContent(files[fileIndex])}
          />
        </>
      )}
    </>
  );
}

const CustomButton = styled.button`
  width: 35px;
  height: 35px;
  background: none;
  border: #b9b7b7;
  cursor: pointer;
  color: #b9b7b7;
  vertical-align: middle;

  &:hover {
    color: #fff;
  }
`;
