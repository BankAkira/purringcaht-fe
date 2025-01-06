import { Popover } from 'react-tiny-popover';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

// icons
import EmojiNormalGray from '../../asset/icon/icons/emoji-normal-gray.svg';

// hook
import useBoolean from '../../helper/hook/useBoolean';
import useResponsive from '../../helper/hook/useResponsive.ts';

// component
import { PopoverWrapper } from '../../component/@styled/PopoverWrapper.tsx';

type Props = {
  onEmojiClick: (emojiData: EmojiClickData) => void;
};

export default function EmojiPickerButton({ onEmojiClick }: Props) {
  const { isTabletOrMobile } = useResponsive();
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
      positions={['bottom']}
      containerStyle={{
        paddingBottom: '10px',
        zIndex: '9999',
        top: '10px',
        left: isTabletOrMobile ? '40px' : '72px',
      }}
      content={
        <PopoverWrapper>
          <EmojiPicker
            width="100%"
            onEmojiClick={emojiData => onSelectEmoji(emojiData)}
          />
        </PopoverWrapper>
      }>
      <div
        onClick={() => openEmojiPicker()}
        className="text-xl text-gray-700 cursor-pointer text-[20px] mt-[1px] hover:scale-90 transition">
        <img src={EmojiNormalGray} alt="EMOJI" />
      </div>
    </Popover>
  );
}
