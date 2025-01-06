import MediaSkeleton from '../../../../component/@share/MediaSkeleton.tsx';
import ImageErrorBoundary from '../../../../component/@share/ImageErrorBoundary.tsx';
import VideoErrorBoundary from '../../../../component/@share/VideoErrorBoundary.tsx';
import { useDeepEffect } from '../../../../helper/hook/useDeepEffect.ts';
import { useDispatch, useSelector } from '../../../../redux';
import {
  loadMediaResultsAction,
  startMediaLoadingAction,
} from '../../../../redux/conversation-side-info-dispute.ts';
import useBoolean from '../../../../helper/hook/useBoolean.ts';
import { MessageContentType } from '../../../../type/message.ts';
import MediaModal from './MediaModal.tsx';
import useConversationProfile from '../../../../helper/hook/useConversationProfile.tsx';
// import emptyMediaImage from '../../../asset/images/empty-img/empty-media.svg';

export default function MediaThumbnail() {
  const dispatch = useDispatch();
  const { conversation } = useSelector(state => state.messageDispute);
  const { media } = useSelector(state => state.conversationSideInfoDispute);
  const [isOpenMediaModal, openMediaModal, closeMediaModal] = useBoolean(false);
  const profile = useConversationProfile(conversation);

  useDeepEffect(() => {
    dispatch(startMediaLoadingAction());
    dispatch(loadMediaResultsAction());
  }, []);

  const additionalImages = media.pageInfo.totalResults - 2;
  const overflowText = additionalImages > 99 ? '+99' : `+${additionalImages}`;

  return (
    <div>
      <p className="mb-2 text-sm text-gray-900">Media</p>
      {media.isInitializing ? (
        <div className={`flex gap-2 max-h-[86px]`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden w-4/12 rounded-[16px]">
              <MediaSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          {media.messages.length ? (
            <div className={`flex gap-2 max-h-[86px]`}>
              {media.messages.slice(0, 2).map((msg, index) => (
                <div
                  key={index}
                  className="overflow-hidden w-4/12 rounded-[16px]">
                  {msg.contentType === MessageContentType.IMAGE && (
                    <ImageErrorBoundary
                      src={msg.content}
                      index={0}
                      allSrc={[msg.content]}
                      className="w-full h-full thumbnail-image"
                      imageClassName="!object-cover"
                    />
                  )}
                  {msg.contentType === MessageContentType.VIDEO && (
                    <div className="w-full h-full thumbnail-image">
                      <VideoErrorBoundary
                        onlyThumbnail
                        src={msg.content}
                        allSrc={[msg.content]}
                        index={0}
                        className="w-full h-full"
                        videoClassName="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              ))}
              {media.pageInfo.totalResults > 2 && (
                <div
                  className="w-4/12 cursor-pointer overflow-indicator bg-gray-100 flex items-center justify-center text-sm text-[#111928] rounded-[16px]"
                  onClick={() => openMediaModal()}>
                  {overflowText}
                </div>
              )}
            </div>
          ) : (
            <div className={`media-thumbnail-container small`}>
              <div className="flex flex-col w-full gap-2 text-center overflow-indicator items-center justify-center">
                {/*<img src={emptyMediaImage} width={60} alt="empty media" />*/}
                <span className="text-sm font-normal text-gray-500">
                  No media
                </span>
                <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
                  The photos and videos you exchange{' '}
                  <b className="text-gray-500">
                    {profile?.name ? `with ${profile?.name}` : ''}
                  </b>{' '}
                  will appear here
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {media.pageInfo.totalResults > 2 && (
        <MediaModal
          isOpen={isOpenMediaModal}
          onCloseModal={() => closeMediaModal()}
        />
      )}
    </div>
  );
}
