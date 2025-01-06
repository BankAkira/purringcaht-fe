// import (Internal imports)
import { useState, useEffect } from 'react';

import classNames from 'classnames';

// react-player
import ReactPlayer from 'react-player';

// helper functions
import sleep from '../../helper/sleep';

// redux
import { StoreDispatch, StoreGetState, useDispatch } from '../../redux';
import { openLightBox } from '../../redux/lightbox';

// images
import errorImage from '../../asset/images/empty-img/empty-media.svg';

type Props = {
  src: string;
  index?: number;
  allSrc?: string[];
  className?: string;
  videoClassName?: string;
  onlyThumbnail?: boolean;
  openMediaModal?: () => void;
};

export default function VideoErrorBoundary({
  src,
  index,
  allSrc,
  className,
  videoClassName,
  onlyThumbnail,
  openMediaModal,
}: Props) {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      await sleep(500);
      setShow(true);
    })();
  }, []);

  const handleError = () => {
    setIsError(true);
  };

  const toggleLightBox = () => {
    return (dispatch: StoreDispatch, getState: StoreGetState) => {
      const { media } = getState().conversationSideInfo;

      const safeAllSrc = allSrc ?? [];
      const safeIndex = index !== undefined ? index : 0;

      const matchingIndex = media.messages.findIndex(
        msg => msg.content === safeAllSrc[safeIndex]
      );

      if (matchingIndex !== -1) {
        dispatch(
          openLightBox({
            images: media.messages.map(msg => msg.content),
            imageIndex: matchingIndex,
          })
        );
      } else {
        dispatch(
          openLightBox({
            images: safeAllSrc,
            imageIndex: safeIndex,
          })
        );
      }
    };
  };

  const checkSrc = () => {
    let content = src;
    if (src.includes('/quicktime;')) {
      content = src.replace('/quicktime;', '/mp4;');
    }

    return content;
  };

  if (isError) {
    return (
      <div
        className={classNames(
          { 'opacity-0 ': !show } +
            (className ? className : '') +
            ' flex h-full w-full justify-center bg-gray-100'
        )}>
        <div className="flex items-center justify-center h-full w-full py-2">
          <img
            src={errorImage}
            alt=""
            className={
              (videoClassName ? videoClassName : '') +
              ' !object-contain z-50 h-full'
            }
          />
        </div>
      </div>
    );
  }
  return (
    <div
      className={classNames(
        { 'opacity-0': !show } + (className ? ` ${className}` : '')
      )}>
      {onlyThumbnail ? (
        <video
          onClick={() => {
            !!allSrc && !!allSrc?.length && index !== undefined
              ? dispatch(toggleLightBox())
              : openMediaModal && openMediaModal();
          }}
          src={checkSrc()}
          onError={handleError}
          className={videoClassName || ''}
        />
      ) : (
        <ReactPlayer
          url={checkSrc()}
          width="100%"
          height="100%"
          className={videoClassName || ''}
          controls
          onError={handleError}
        />
      )}
    </div>
  );
}
