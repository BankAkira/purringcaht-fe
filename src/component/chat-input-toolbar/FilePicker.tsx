import { ChangeEvent, useRef } from 'react';
import { SelectedFile } from '../../type/message';
import { getFileOptional, getPdfPageCount } from '../../helper/file';
import { BsPaperclip } from 'react-icons/bs';

type Props = {
  onFileClick: (imageData: SelectedFile) => void;
};

export default function FilePicker({ onFileClick }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const selectedFile = files[0];

      const count = await getPdfPageCount(selectedFile);
      const file: SelectedFile = {
        file: selectedFile,
        optional: { ...getFileOptional(selectedFile), pageCount: count },
      };
      onFileClick(file);
    }
  };

  return (
    <div onClick={triggerFileInputClick}>
      <BsPaperclip className="text-xl text-gray-700 cursor-pointer text-[20px] mt-[1px]" />
      <input
        type="file"
        accept="application/pdf,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/zip"
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
