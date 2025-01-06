// import (Internal imports)
import { PropsWithChildren, useState } from 'react';

// react-player
import ReactPlayer from 'react-player';

// react-18-image-lightbox
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

// helper functions
import { Logger } from '../helper/logger.ts';

// redux
import {
  StoreDispatch,
  StoreGetState,
  useDispatch,
  useSelector,
} from '../redux';
import {
  loadMoreMediaResultAction,
  startLoadMoreMediaMessage,
} from '../redux/conversation-side-info.ts';
import {
  closeLightBox,
  onMoveNextLightBoxImage,
  onMovePrevLightBoxImage,
  updateImagesInLightBox,
} from '../redux/lightbox';

const log = new Logger('LightboxPortal');

export default function LightboxPortal({ children }: PropsWithChildren) {
  const dispatch = useDispatch();

  const { images, imageIndex } = useSelector(state => state.lightBox);

  const [isLoading, setIsLoading] = useState(false);

  const totalMediaFiles = useSelector(
    state => state.conversationSideInfo.media.pageInfo.totalResults
  );
  const mediaMessages = useSelector(state =>
    state.conversationSideInfo.media.messages.map(msg => msg.content)
  );

  const isVideo = (src?: string) => {
    if (!src) return false;
    return src.endsWith('.mp4') || src.includes('video');
  };

  const checkSrc = (src: string) => {
    let content = src;
    if (src.includes('/quicktime;')) {
      content = src.replace('/quicktime;', '/mp4;');
    } else if (src.includes('/mkv;')) {
      content = src.replace('/mkv;', '/mp4;');
    }
    return content;
  };

  const onVideoError = () => {
    return 'Video is not available or expired.';
  };

  const onMoveNextRequest =
    () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
      const { media } = getState().conversationSideInfo;
      const shouldLoadMore =
        media.messages.length < media.pageInfo.totalResults;

      if (isLoading) return;

      if (imageIndex >= mediaMessages.length - 5 && shouldLoadMore) {
        try {
          setIsLoading(true);
          dispatch(startLoadMoreMediaMessage());
          await dispatch(loadMoreMediaResultAction());

          const updatedImages =
            getState().conversationSideInfo.media.messages.map(
              msg => msg.content
            );
          dispatch(updateImagesInLightBox(updatedImages));
          dispatch(onMoveNextLightBoxImage());
        } catch (error) {
          log.error('Error loading more media:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        dispatch(onMoveNextLightBoxImage());
      }
    };

  const onMovePrevRequest = () => (dispatch: StoreDispatch) => {
    if (imageIndex > 0) {
      dispatch(onMovePrevLightBoxImage());
    }
  };

  const onCloseRequest = () => {
    dispatch(closeLightBox());
  };

  return (
    <>
      {children}
      {!!images.length && images[imageIndex] ? (
        <Lightbox
          mainSrc={mediaMessages[imageIndex]}
          nextSrc={
            imageIndex < totalMediaFiles - 1
              ? mediaMessages[(imageIndex + 1) % mediaMessages.length]
              : undefined
          }
          prevSrc={
            imageIndex > 0
              ? mediaMessages[
                  (imageIndex + mediaMessages.length - 1) % mediaMessages.length
                ]
              : undefined
          }
          onCloseRequest={onCloseRequest}
          onMovePrevRequest={
            imageIndex > 0 ? () => dispatch(onMovePrevRequest()) : undefined
          }
          onMoveNextRequest={
            imageIndex < totalMediaFiles - 1
              ? () => dispatch(onMoveNextRequest())
              : undefined
          }
          reactModalStyle={{ overlay: { zIndex: 9999 } }}
          imageLoadErrorMessage={
            isVideo(mediaMessages[imageIndex]) ? (
              <ReactPlayer
                url={checkSrc(mediaMessages[imageIndex])}
                width="100%"
                height="100%"
                controls
                onError={onVideoError}
                className="z-[1]"
              />
            ) : (
              'Image has expired.'
            )
          }
        />
      ) : null}
    </>
  );
}
