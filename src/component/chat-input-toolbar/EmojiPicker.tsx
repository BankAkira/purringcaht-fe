import { BsEmojiSmile } from 'react-icons/bs';
import { Popover } from 'react-tiny-popover';
import { PopoverWrapper } from '../@styled/PopoverWrapper';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import useBoolean from '../../helper/hook/useBoolean';

type Props = {
  onEmojiClick: (emojiData: EmojiClickData) => void;
};

export default function EmojiPickerButton({ onEmojiClick }: Props) {
  const [isOpenEmojiPicker, openEmojiPicker, closeEmojiPicker] =
    useBoolean(false);

  const onSelectEmoji = (emojiData: EmojiClickData) => {
    onEmojiClick(emojiData);
    closeEmojiPicker();
  };

  return (
    <Popover
      isOpen={isOpenEmojiPicker}
      onClickOutside={() => closeEmojiPicker()}
      positions={['top']}
      containerStyle={{
        paddingBottom: '10px',
        zIndex: '9999',
      }}
      content={
        <PopoverWrapper>
          <EmojiPicker onEmojiClick={emojiData => onSelectEmoji(emojiData)} />
        </PopoverWrapper>
      }>
      <div
        onClick={() => openEmojiPicker()}
        className="text-xl text-gray-700 cursor-pointer text-[20px] mt-[1px]">
        <BsEmojiSmile />
      </div>
    </Popover>
  );
}
