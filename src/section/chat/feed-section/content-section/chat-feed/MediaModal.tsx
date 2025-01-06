// import (Internal imports)
import { Fragment } from 'react';

import classNames from 'classnames';

// react-infinite-scroll
import InfiniteScroll from 'react-infinite-scroll-component';

// flowbite-react
import { Modal } from 'flowbite-react';

// helper functions
import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';

// redux
import { useDispatch, useSelector } from '../../../../../redux';
import { openLightBox } from '../../../../../redux/lightbox';
import {
  loadMediaResultsAction,
  loadMoreMediaResultAction,
} from '../../../../../redux/conversation-side-info';

// types
import { MessageContentType } from '../../../../../type/message';

// components
import Button from '../../../../../component/button/Button';
import MediaSkeleton from '../../../../../component/@share/MediaSkeleton';
import VideoErrorBoundary from '../../../../../component/@share/VideoErrorBoundary';

// constants
import { defaultImages } from '../../../../../constant/default-images';

// images
import imageExp from '../../../../../asset/images/empty-img/imageExp.png';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export default function MediaModal({ isOpen, onCloseModal }: Props) {
  const dispatch = useDispatch();
  const {
    media: { pageInfo, messages, isInitializing },
  } = useSelector(state => state.conversationSideInfo);

  const handleScrollEnd = () => {
    dispatch(loadMoreMediaResultAction());
  };

  useDeepEffect(() => {
    if (isOpen) {
      dispatch(loadMediaResultsAction());
    }
    return () => {
      dispatch(loadMediaResultsAction({ page: 1 }));
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Correct function to open the Lightbox
  const handleOpenLightbox = (messageContent: string) => {
    const mediaUrls = messages.map(msg => msg.content);
    const mediaIndex = mediaUrls.findIndex(url => url === messageContent);

    if (mediaIndex !== -1) {
      dispatch(
        openLightBox({
          images: mediaUrls, // Send all media URLs to Lightbox
          imageIndex: mediaIndex, // Open at the clicked index
        })
      );
    }
  };

  const imageExpOrCancel = (type: 'Image' | 'Video', isUnsent?: boolean) => {
    return (
      <div className="relative w-full">
        <img
          draggable={false}
          src={imageExp}
          className="object-cover w-full h-[150px]"
          alt=""
        />
        <div className="absolute w-full text-sm font-semibold text-center text-white -translate-x-1/2 -translate-y-1/2 bottom-2 left-1/2 drop-shadow-sm">
          {isUnsent ? `${type} was cancelled` : `${type} has expired`}
        </div>
      </div>
    );
  };

  return (
    <Modal show={isOpen} dismissible size="4xl">
      <Modal.Header>All Media</Modal.Header>
      <Modal.Body
        id="media-container"
        className={classNames('!relative min-h-[70vh]', {})}>
        <div className={classNames('flex flex-wrap gap-3 w-full', {})}>
          <InfiniteScroll
            dataLength={+pageInfo.page * +pageInfo.limit}
            next={handleScrollEnd}
            hasMore={
              !!messages.length && messages.length < pageInfo.totalResults
            }
            scrollableTarget="media-container"
            endMessage={<></>}
            loader={
              <div className="flex flex-wrap w-full gap-3 mt-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <MediaSkeleton
                    key={index}
                    className="min-h-[150px] w-[150px]"
                  />
                ))}
              </div>
            }>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-start w-full">
              {[...messages].map(message => (
                <Fragment key={message.id}>
                  {message.contentType === MessageContentType.IMAGE && (
                    <div
                      className={classNames(
                        'flex h-full w-full min-h-[150px] justify-center max-lg:max-h-[100px] max-h-[150px] border-2 rounded-md overflow-hidden'
                      )}>
                      {message.isUnsent ||
                      message.content === 'Unsupport Message' ? (
                        <>{imageExpOrCancel('Image', message.isUnsent)}</>
                      ) : (
                        <img
                          src={message.content}
                          onClick={() => handleOpenLightbox(message.content)}
                          alt=""
                          className={'object-contain cursor-pointer'}
                          onError={e => {
                            e.currentTarget.src = defaultImages.errorImage;
                            e.currentTarget.onclick = () => {};
                          }}
                        />
                      )}
                    </div>
                  )}
                  {message.contentType === MessageContentType.VIDEO && (
                    <>
                      {message.isUnsent ||
                      message.content === 'Unsupport Message' ? (
                        <div className="flex h-[150px] justify-center max-h-[512px] border-2 rounded-md overflow-hidden">
                          {imageExpOrCancel('Video', message.isUnsent)}
                        </div>
                      ) : (
                        <div
                          className="flex h-[150px] w-[150px] justify-center max-h-[512px] border-2 rounded-md overflow-hidden"
                          onClick={() => handleOpenLightbox(message.content)}>
                          <VideoErrorBoundary
                            onlyThumbnail
                            src={message.content}
                            allSrc={[message.content]}
                            className="w-full h-full"
                            videoClassName="w-full h-full object-contain cursor-pointer"
                          />
                        </div>
                      )}
                    </>
                  )}
                </Fragment>
              ))}
            </div>
          </InfiniteScroll>
        </div>
        {isInitializing && (
          <div className="flex flex-wrap w-full gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <MediaSkeleton className="min-h-[150px] w-[150px]" key={index} />
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="flex justify-end !py-3">
        <Button
          label="Close"
          className="min-w-[100px] bg-transparent !shadow-none !border !border-solid !border-gray-300 focus:!border-gray-300 focus:!border focus:border-solid"
          onClick={() => onCloseModal()}
        />
      </Modal.Footer>
    </Modal>
  );
}
