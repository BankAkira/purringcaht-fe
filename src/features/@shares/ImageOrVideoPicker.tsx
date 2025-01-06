import { ChangeEvent, useRef } from 'react';

// icons
import GalleryGray from '../../asset/icon/icons/gallery-gray.svg';

// helper
import { getFileOptional } from '../../helper/file';

// type
import { SelectedFile } from '../../type';

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
    <div
      className="cursor-pointer hover:scale-90 transition"
      onClick={triggerFileInputClick}>
      <img src={GalleryGray} alt="IMAGE_VIDEO" />
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
