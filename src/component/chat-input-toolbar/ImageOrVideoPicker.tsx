import { ChangeEvent, useRef } from 'react';
import { GoImage } from 'react-icons/go';
import { SelectedFile } from '../../type/message';
import { getFileOptional } from '../../helper/file';

type Props = {
  onImageOrVideoClick: (imageData: SelectedFile) => void;
};

export default function ImageOrVideoPicker({ onImageOrVideoClick }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const selectedFile = files[0];

      const imageOrVideo: SelectedFile = {
        file: selectedFile,
        optional: getFileOptional(selectedFile),
      };

      onImageOrVideoClick(imageOrVideo);
    }
  };

  return (
    <div onClick={triggerFileInputClick}>
      <GoImage className="text-xl text-gray-700 cursor-pointer text-[23px] -mt-[0.5px]" />
      <input
        type="file"
        accept="image/*,video/mp4,video/quicktime,video/webm,video/ogg"
        hidden
        ref={fileInputRef}
        onChange={e => {
          handleFileChange(e);
          e.target.value = '';
        }}
      />
    </div>
  );
}
