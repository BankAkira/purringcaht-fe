import { Modal } from 'flowbite-react';
import { Fragment } from 'react';
import Button from '../../../../component/button/Button.tsx';
import classNames from 'classnames';
import MediaSkeleton from '../../../../component/@share/MediaSkeleton.tsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageContentType } from '../../../../type/message.ts';
import { useDispatch, useSelector } from '../../../../redux';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect.ts';
import { openLightBox } from '../../../../redux/lightbox.ts';
import {
  loadMediaResultsAction,
  loadMoreMediaResultAction,
} from '../../../../redux/conversation-side-info-dispute.ts';
import { defaultImages } from '../../../../constant/default-images.ts';
import VideoErrorBoundary from '../../../../component/@share/VideoErrorBoundary.tsx';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export default function MediaModal({ isOpen, onCloseModal }: Props) {
  const dispatch = useDispatch();
  const {
    media: { pageInfo, messages, isInitializing },
  } = useSelector(state => state.conversationSideInfoDispute);

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
            {/* <div className="flex flex-wrap items-start w-full gap-3"> */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-start w-full">
              {[...messages].map(message => {
                return (
                  <Fragment key={message.id}>
                    {message.contentType === MessageContentType.IMAGE && (
                      <div
                        className={classNames(
                          // 'flex h-[150px] w-[150px] justify-center max-h-[512px] border-2 rounded-md overflow-hidden '
                          'flex h-full w-full justify-center max-lg:max-h-[100px] max-h-[150px] border-2 rounded-md overflow-hidden '
                        )}>
                        <img
                          src={message.content}
                          onClick={() => {
                            dispatch(
                              openLightBox({
                                images: [message.content],
                                imageIndex: 0,
                              })
                            );
                          }}
                          alt=""
                          className={'object-contain cursor-pointer'}
                          onError={e => {
                            e.currentTarget.src = defaultImages.errorImage;
                            e.currentTarget.onclick = () => {};
                          }}
                        />
                      </div>
                    )}
                    {message.contentType === MessageContentType.VIDEO && (
                      <div
                        className="flex h-[150px] w-[150px] justify-center max-h-[512px] border-2 rounded-md overflow-hidden"
                        onClick={() => {
                          dispatch(
                            openLightBox({
                              images: [message.content],
                              imageIndex: 0,
                            })
                          );
                        }}>
                        <VideoErrorBoundary
                          onlyThumbnail
                          src={message.content}
                          className="w-full h-full"
                          videoClassName="w-full h-full object-contain cursor-pointer"
                        />
                      </div>
                    )}
                  </Fragment>
                );
              })}
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
