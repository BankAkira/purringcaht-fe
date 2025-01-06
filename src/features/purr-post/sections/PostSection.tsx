// import (Internal imports)
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

// flowbite-react
import { Avatar, Button, Textarea } from 'flowbite-react';

// emoji-picker-react
import { EmojiClickData } from 'emoji-picker-react';

// react-icons
import { BsPaperclip } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';

// type definitions
import { SelectedFile } from '../../../type/purr-post.ts';

// helper functions
import { isImage, isVideo } from '../../../helper/file.ts';

// shares
import EmojiPicker from '../../@shares/EmojiPicker.tsx';
import ImageOrVideoPicker from '../../@shares/ImageOrVideoPicker.tsx';

// constant
import { defaultImages } from '../../../constant/default-images.ts';

export default function PostSection() {
  const [textPost, setTextPost] = useState('');
  const [filePost, setFilePost] = useState<SelectedFile | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    setTextPost(textarea.value);
  };

  const onImageOrVideoOrFileClick = async (file: SelectedFile) => {
    setFilePost(file);
  };

  const onEmojiClick = async (emojiData: EmojiClickData) => {
    setTextPost(prev => `${prev}${emojiData.emoji}`);
    textAreaRef.current && textAreaRef.current.focus();
  };

  const DisplayFileThumbnail = () => {
    if (filePost) {
      const { file, optional } = filePost;

      return (
        <>
          <div className="relative w-fit">
            {isImage(file) ? (
              <>
                <img
                  className="h-[150px] border-2 rounded-[8px]"
                  src={URL.createObjectURL(file)}
                  alt=""
                  onError={e => {
                    e.currentTarget.src = defaultImages.errorImage;
                  }}
                />
              </>
            ) : isVideo(file) ? (
              <>
                <ReactPlayer
                  url={URL.createObjectURL(file)}
                  width="70px"
                  height="50px"
                  controls={false}
                />
              </>
            ) : (
              <>
                <div className="w-[56px] h-[56px] border flex flex-col items-center">
                  <BsPaperclip className="flex-1 text-2xl text-gray-500 cursor-pointer" />
                  <small className="text-[10px] max-w-full px-1 truncate text-center text-gray-400 min-h-[18px]">
                    {optional.fileName}
                  </small>
                </div>
              </>
            )}

            <div className="items-center flex justify-center absolute h-[0px] w-[0px] right-[20px] top-[20px] z-1">
              <span
                className="cursor-pointer p-0.5 bg-white border border-gray-200 hover:border-red-300 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-700"
                onClick={handleCancelImageOrVideoOrFile}>
                <IoCloseOutline style={{ fontSize: 20 }} />
              </span>
            </div>
          </div>
        </>
      );
    }

    return <></>;
  };

  const handleCancelImageOrVideoOrFile = () => {
    setFilePost(null);
  };

  return (
    <section>
      <div className="flex flex-col items-start self-stretch gap-5 px-7 py-5 border-b">
        <div className="flex flex-col items-start self-stretch">
          <div className="flex items-start self-stretch gap-5">
            <Avatar size="md" alt="AVATAR" rounded />
            <div className="flex flex-col justify-between items-start flex-1">
              <Textarea
                id="post"
                className="textarea-color-gray border-none !bg-transparent resize-none p-0 text-xl"
                style={{ scrollbarColor: 'auto' }}
                placeholder="What Is Your Purr Today?"
                value={textPost}
                onChange={handleInput}
                required
              />
              {DisplayFileThumbnail()}
              <div className="flex justify-between items-end self-stretch pt-2">
                <div className="flex items-center gap-4 pr-4">
                  <ImageOrVideoPicker
                    onImageOrVideoClick={onImageOrVideoOrFileClick}
                  />
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
                <Button
                  pill
                  size="md"
                  className="bg-pink-orange hover:opacity-65">
                  Purr
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
