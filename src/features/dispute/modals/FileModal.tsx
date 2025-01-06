import { Modal } from 'flowbite-react';
import Button from '../../../component/button/Button.tsx';
import classNames from 'classnames';
import FileSkeleton from '../../../component/@share/FileSkeleton.tsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from '../../../redux';
import { useDeepEffect } from '../../../helper/hook/useDeepEffect.ts';
import {
  loadFileResultsAction,
  loadMoreFileResultAction,
} from '../../../redux/conversation-side-info-dispute.ts';
import { downloadFile } from '../../../helper/file.ts';
import pdfIcon from '../../../asset/images/pdf-icon.svg';
import bytes from 'bytes';
import mime from 'mime';
import IconButton from '../../../component/icon-button/IconButton.tsx';
import { FaDownload } from 'react-icons/fa6';

type Props = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export default function FileModal({ isOpen, onCloseModal }: Props) {
  const dispatch = useDispatch();
  const {
    file: { pageInfo, messages, isInitializing },
  } = useSelector(state => state.conversationSideInfoDispute);

  const handleScrollEnd = () => {
    dispatch(loadMoreFileResultAction());
  };

  useDeepEffect(() => {
    if (isOpen) {
      dispatch(loadFileResultsAction());
    }
    return () => {
      dispatch(loadFileResultsAction({ page: 1 }));
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal show={isOpen} dismissible size="xl">
      <Modal.Header>All File</Modal.Header>
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
                  <FileSkeleton key={index} />
                ))}
              </div>
            }>
            <div className="flex flex-wrap items-start w-full gap-3">
              {[...messages].map(msg => {
                const { content, optional } = msg;
                return (
                  <div
                    key={msg.id}
                    className="w-full overflow-hidden thumbnail-image">
                    <div
                      className="gap-4 file-message min-w-[230px] cursor-pointer"
                      onClick={() => downloadFile(content, optional?.fileName)}>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <img src={pdfIcon} alt="" />
                          <div className="text-sm font-semibold text-gray-900 w-[130px] truncate">
                            {optional?.fileName}
                          </div>
                        </div>
                        <div className="leading-[20px]">
                          <div className="flex flex-row items-center">
                            {/* {optional?.pageCount && (
                              <>
                                <div className="text-xs text-[#6B7280]">
                                  12 Page(s)
                                </div>
                                <div className="mx-2 text-gray-500">
                                  &#x2022;
                                </div>
                              </>
                            )} */}
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
                      <div className="file-download-icon min-w-[30px] mx-auto">
                        <IconButton
                          color="#8a8a8a"
                          icon={FaDownload}
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
        {isInitializing && (
          <div className="flex flex-col w-full gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <FileSkeleton key={index} className="w-full" />
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="flex justify-center !py-4">
        <Button
          label="Close"
          className="min-w-[200px] !border !border-gray-200 rounded-full min-h-[44px]"
          onClick={() => onCloseModal()}
        />
      </Modal.Footer>
    </Modal>
  );
}
