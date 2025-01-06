import { Dropdown } from 'flowbite-react';
import { IoMdMore } from 'react-icons/io';
import { MdOutlineSaveAlt } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { KeepFile } from '../../type/keep';
import { MessageContentType } from '../../type/message';
import bytes from 'bytes';
import { downloadFile } from '../../helper/file';
import { openLightBox } from '../../redux/lightbox';
import { useDispatch } from 'react-redux';
import { getIconByFileType } from '../../constant/icon-files';

type Props = {
  file: KeepFile;
  handleUnkeep: (messageId: string) => void;
};

export default function FileCard({ file, handleUnkeep }: Props) {
  const { conversationMessage } = file;
  const dispatch = useDispatch();

  const displayDropdownMenu = () => {
    return (
      <div className="absolute cursor-pointer top-1.5 right-1">
        <Dropdown
          arrowIcon={false}
          inline
          className="w-[200px]"
          label={
            <IoMdMore
              className="text-[#D1D5DB] hover:scale-110 hover:text-orange-400 transition"
              style={{ width: '26px', height: '26px' }}
            />
          }>
          <Dropdown.Item
            className="flex items-center gap-2 pt-3"
            onClick={() =>
              downloadFile(
                conversationMessage.decryptedContent!,
                conversationMessage.optional?.fileName
              )
            }>
            <MdOutlineSaveAlt />
            Save to device
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item
            className="flex items-center gap-2 pb-3 text-red-600"
            onClick={() => handleUnkeep(conversationMessage.id)}>
            <FaRegTrashAlt />
            Delete
          </Dropdown.Item>
        </Dropdown>
      </div>
    );
  };

  const displayThumbnail = () => {
    if (conversationMessage.contentType === MessageContentType.IMAGE) {
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${conversationMessage.decryptedContent})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      );
    }

    if (conversationMessage.contentType === MessageContentType.FILE) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-[#f3f4f6] overflow-hidden rounded-t-[8px]">
          <img
            src={getIconByFileType(conversationMessage.optional?.fileType)}
            width={80}
            alt=""
          />
        </div>
      );
    }

    if (conversationMessage.contentType === MessageContentType.VIDEO) {
      let content = conversationMessage.decryptedContent;
      if (conversationMessage?.decryptedContent?.includes('/quicktime;')) {
        content = conversationMessage?.decryptedContent?.replace(
          '/quicktime;',
          '/mp4;'
        );
      }

      return (
        <div className="flex items-center justify-center w-full h-full rounded-t-[8px] overflow-hidden">
          <video
            className="object-cover w-full h-full"
            src={content}
            controls={false}
          />
        </div>
      );
    }

    return <></>;
  };

  return (
    <div className="h-[300px] border-2 rounded-[10px] relative">
      <div
        className={
          (conversationMessage.contentType === MessageContentType.IMAGE ||
          conversationMessage.contentType === MessageContentType.VIDEO
            ? 'cursor-pointer'
            : '') + ' w-full h-[235px]'
        }
        onClick={() => {
          if (
            (conversationMessage.contentType === MessageContentType.IMAGE ||
              conversationMessage.contentType === MessageContentType.VIDEO) &&
            !!conversationMessage?.decryptedContent
          ) {
            dispatch(
              openLightBox({
                images: [conversationMessage?.decryptedContent],
                imageIndex: 0,
              })
            );
          }
        }}>
        {displayThumbnail()}
      </div>
      <div className="flex flex-col p-3">
        <span className="text-sm font-normal text-gray-700 truncate dark:text-gray-400">
          {conversationMessage.optional.fileName}
        </span>
        <small className="text-gray-400">
          {bytes(conversationMessage.optional.fileSize)}
        </small>
      </div>
      {displayDropdownMenu()}
    </div>
  );
}
