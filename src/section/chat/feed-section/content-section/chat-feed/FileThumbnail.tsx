import { useDeepEffect } from '../../../../../helper/hook/useDeepEffect';
import { useDispatch, useSelector } from '../../../../../redux';
import {
  startFileLoadingAction,
  loadFileResultsAction,
} from '../../../../../redux/conversation-side-info';
import useBoolean from '../../../../../helper/hook/useBoolean';
import useConversationProfile from '../../../../../helper/hook/useConversationProfile';
import FileSkeleton from '../../../../../component/@share/FileSkeleton';
import bytes from 'bytes';
import { downloadFile } from '../../../../../helper/file';
// import pdfIcon from '../../../../../asset/images/pdf-icon.svg';
import FileModal from './FileModal';
import mime from 'mime';
import emptyFileImage from '../../../../../asset/images/empty-img/empty-file.svg';

// iconFiles
import { getIconByFileType } from '../../../../../constant/icon-files.ts';

export default function FileThumbnail() {
  const dispatch = useDispatch();
  const { conversation } = useSelector(state => state.message);
  const { file } = useSelector(state => state.conversationSideInfo);
  const [isOpenFileModal, openFileModal, closeFileModal] = useBoolean(false);
  const profile = useConversationProfile(conversation);

  useDeepEffect(() => {
    dispatch(startFileLoadingAction());
    dispatch(loadFileResultsAction());
  }, []);

  const additionalImages = file.pageInfo.totalResults - 2;
  const overflowText = additionalImages > 99 ? '+99' : `+${additionalImages}`;

  return (
    <div>
      <div className="flex justify-between">
        <p className="mb-2 text-sm text-gray-900">Files</p>
        {file.pageInfo.totalResults > 2 && (
          <a
            className="text-[#FE7601] text-sm font-normal cursor-pointer"
            onClick={() => openFileModal()}>
            See all
          </a>
        )}
      </div>
      {file.isInitializing ? (
        <div className={`flex flex-col gap-1`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full overflow-hidden thumbnail-image">
              <FileSkeleton className="py-3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {file.messages.length ? (
            <div className={`w-full flex flex-col gap-3`}>
              {file.messages.slice(0, 2).map((msg, index) => {
                const { content, optional, isUnsent } = msg;
                const fileIcon = optional?.fileType
                  ? getIconByFileType(optional.fileType)
                  : '/src/asset/icon/files/file.png';
                return (
                  <div
                    key={index}
                    className={
                      (isUnsent || content === 'Unsupport Message'
                        ? 'pointer-events-none'
                        : '') + ' w-full overflow-hidden thumbnail-image'
                    }>
                    <div
                      className="gap-4 file-message min-w-[230px] cursor-pointer"
                      onClick={() =>
                        (!isUnsent || content !== 'Unsupport Message') &&
                        downloadFile(content, optional?.fileName)
                      }>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            className={
                              (isUnsent || content === 'Unsupport Message'
                                ? 'grayscale'
                                : '') + ' w-[21px] h-[21px]'
                            }
                            src={fileIcon}
                            alt=""
                          />
                          <div
                            className={
                              (isUnsent || content === 'Unsupport Message'
                                ? 'text-gray-400'
                                : 'text-gray-900') +
                              ` text-sm font-semibold w-[130px] truncate`
                            }>
                            {isUnsent
                              ? 'File was cancelled'
                              : content === 'Unsupport Message'
                                ? 'File has expired'
                                : optional?.fileName}
                          </div>
                        </div>
                        <div className="leading-[20px]">
                          <div className="flex flex-row items-center">
                            <div className="text-[11px] text-[#6B7280] uppercase">
                              {optional?.fileType &&
                                mime.extension(optional?.fileType)}
                            </div>
                            <div className="mx-2 text-gray-500">&#x2022;</div>
                            <div className="text-[11px] text-[#6B7280]">
                              {bytes.format(optional?.fileSize || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {file.pageInfo.totalResults > 2 && (
                <div
                  className="flex justify-center w-full overflow-hidden cursor-pointer file-message h-[65px]"
                  onClick={() => openFileModal()}>
                  {overflowText}
                </div>
              )}
            </div>
          ) : (
            <div className={`media-thumbnail-container small`}>
              <div className="flex flex-col w-full gap-2 text-center overflow-indicator items-center justify-center">
                <img src={emptyFileImage} width={60} alt="empty media" />
                <span className="text-sm font-normal text-gray-500">
                  No file
                </span>
                <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
                  The files you exchange{' '}
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

      {file.pageInfo.totalResults > 2 && (
        <FileModal
          isOpen={isOpenFileModal}
          onCloseModal={() => closeFileModal()}
        />
      )}
    </div>
  );
}
