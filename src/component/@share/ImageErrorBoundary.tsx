// import (Internal imports)
import { useEffect, useState } from 'react';

import classNames from 'classnames';

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
  imageClassName?: string;
};

export default function ImageErrorBoundary({
  src,
  index,
  allSrc,
  className,
  imageClassName,
}: Props) {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      await sleep(0);
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

  if (isError) {
    return (
      <div
        className={classNames(
          { 'opacity-0 ': !show } +
            (className ? className : '') +
            ' flex h-full w-full justify-center bg-gray-100 max-h-[100px]'
        )}>
        <div className="flex items-center justify-center h-full w-full py-2">
          <img
            src={errorImage}
            alt=""
            className={
              (imageClassName ? imageClassName : '') +
              ' object-contain z-50 h-full'
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        { 'opacity-0 ': !show } +
          (className ? className : '') +
          ' flex h-full w-full justify-center bg-gray-100 max-h-[100px]'
      )}>
      <div onClick={() => dispatch(toggleLightBox())} className="h-full w-full">
        <img
          src={src}
          alt=""
          className={
            (imageClassName ? imageClassName : '') +
            ' object-contain cursor-pointer z-50 h-full w-full'
          }
          onError={handleError}
        />
      </div>
    </div>
  );
}
