import { useEffect, useState } from 'react';
import { useDispatch } from '../../redux';
import { openLightBox } from '../../redux/lightbox';
import sleep from '../../helper/sleep';
import classNames from 'classnames';
import errorImage from '../../asset/images/empty-img/empty-media.svg';

type Props = {
  src: string;
  index: number;
  allSrc: string[];
  className?: string;
  fileClassName?: string;
};

export default function FileErrorBoundary({
  src,
  index,
  allSrc,
  className,
  fileClassName,
}: Props) {
  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const handleError = () => {
    setIsError(true);
  };

  useEffect(() => {
    (async () => {
      await sleep(0);
      setShow(true);
    })();
  }, []);

  const toggleLightBox = () => {
    dispatch(openLightBox({ images: allSrc, imageIndex: index }));
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
              (fileClassName ? fileClassName : '') +
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
      <div onClick={() => toggleLightBox()} className="h-full w-full">
        <img
          src={src}
          alt=""
          className={
            (fileClassName ? fileClassName : '') +
            ' object-contain cursor-pointer z-50 h-full w-full'
          }
          onError={handleError}
        />
      </div>
    </div>
  );
}
