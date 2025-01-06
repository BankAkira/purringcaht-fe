// FilesThumbnail.tsx
import React from 'react';
import './files-thumbnail.css';
import {
  FaRegFilePdf,
  FaRegImage,
  FaMusic,
  FaRegFileLines,
} from 'react-icons/fa6';

interface FilesThumbnailProps {
  name: string;
  size: string;
  extension: string;
  type: 'FILE' | 'IMAGE' | 'VIDEO';
  pages?: number;
}

const FilesThumbnail: React.FC<FilesThumbnailProps> = ({
  name,
  size,
  extension,
  pages,
  type,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'FILE':
        return <FaRegFilePdf size={18} />;
      case 'IMAGE':
        return <FaRegImage size={18} />;
      case 'VIDEO':
        return <FaMusic size={18} />;
      default:
        return <FaRegFileLines size={18} />;
    }
  };

  return (
    <div className="file-thumbnail flex-col !items-start justify-start gap-1">
      <div className="flex items-center gap-2 text-[#6B7280]">
        <div className="file-icon">{getIcon(type)}</div>
        <div className="file-name font-normal text-sm">{name}</div>
      </div>
      <div className="">
        <div className="flex items-center leading-[20px]">
          {type === 'FILE' && pages && (
            <>
              <div className="text-xs text-[#6B7280]">{pages} Pages</div>
              <div className="mx-2 text-gray-500">•</div>
            </>
          )}
          <div className="text-xs text-[#6B7280]">{size}</div>
          <div className="mx-2 text-gray-500">•</div>
          <div className="text-xs text-[#6B7280]">
            {extension.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesThumbnail;
