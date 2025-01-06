// MediaThumbnail.tsx
import React from 'react';
import './media-thumbnail.css';
import VideoErrorBoundary from '../@share/VideoErrorBoundary';
import ImageErrorBoundary from '../@share/ImageErrorBoundary';
import MediaSkeleton from '../@share/MediaSkeleton';
import emptyMediaImage from '../../asset/images/empty-img/empty-media.svg';
interface MediaThumbnailProps {
  images: string[];
  onImageClick: () => void;
  size: 'small' | 'medium' | 'large';
  conversationName?: string;
  isLoadingMedias: boolean;
  openMediaModal: () => void;
  totalMedias: number;
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  images,
  onImageClick,
  size,
  conversationName,
  isLoadingMedias,
  openMediaModal,
  totalMedias,
}) => {
  // Calculate additional images count
  const additionalImages = totalMedias - 2;
  // Determine the text for the overflow indicator
  const overflowText = additionalImages > 99 ? '+99' : `+${additionalImages}`;

  return (
    <>
      {isLoadingMedias ? (
        <div className={`media-thumbnail-container ${size}`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="thumbnail-image overflow-hidden w-[31%]">
              <MediaSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          {images.length ? (
            <div className={`media-thumbnail-container ${size}`}>
              {images.slice(0, 2).map((src, index) => (
                // <img
                //   key={index}
                //   src={src}
                //   className="thumbnail-image w-[31%]"
                //   alt={`Thumbnail ${index + 1}`}
                //   onClick={() => onImageClick(src)}
                // />
                <div
                  key={index}
                  className="thumbnail-image overflow-hidden w-[31%]">
                  <ImageErrorBoundary
                    src={src}
                    index={0}
                    allSrc={[src]}
                    className="thumbnail-image h-full w-full"
                    imageClassName="!object-cover"
                  />
                  <div className="thumbnail-image h-full w-full">
                    <VideoErrorBoundary
                      openMediaModal={() => openMediaModal()}
                      onlyThumbnail
                      src={src}
                      className="w-full h-full"
                      videoClassName="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                </div>
              ))}
              {additionalImages > 2 && (
                <div
                  className="overflow-indicator w-4/12 cursor-pointer"
                  onClick={() => onImageClick()}>
                  {overflowText}
                </div>
              )}
            </div>
          ) : (
            <div className={`media-thumbnail-container ${size}`}>
              <div className="overflow-indicator w-full flex flex-col text-center gap-2 items-center justify-center">
                <img src={emptyMediaImage} width={60} alt="empty media" />
                <span className="text-sm text-gray-500 font-normal">
                  No media
                </span>
                <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
                  The photos and videos you exchange{' '}
                  <b className="text-gray-500">
                    {conversationName ? `with ${conversationName}` : ''}
                  </b>{' '}
                  will appear here
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MediaThumbnail;
