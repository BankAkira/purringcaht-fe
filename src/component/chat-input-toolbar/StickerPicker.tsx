import { Spinner } from 'flowbite-react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { LuSticker } from 'react-icons/lu';
import { errorFormat } from '../../helper/error-format';
import { PopoverWrapper } from '../@styled/PopoverWrapper';
import { Sticker } from '../../type/message';
import { defaultImages } from '../../constant/default-images';
import useBoolean from '../../helper/hook/useBoolean';

type Props = {
  onStickerClick: (sticker: Sticker) => void;
};

export default function StickerPicker({ onStickerClick }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [stickers, setStickers] = useState<Sticker[]>(Array<Sticker>());
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  useEffect(() => {
    (async () => {
      if (isPopoverOpen) {
        try {
          setIsLoading(true);
          setStickers(mockSticker);
        } catch (error) {
          toast.error(errorFormat(error).message);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [isPopoverOpen]);

  const onSelectSticker = (sticker: Sticker) => {
    onStickerClick(sticker);
    closePopover();
  };

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        onClickOutside={() => closePopover()}
        positions={['top']}
        containerStyle={{
          paddingBottom: '10px',
          zIndex: '9999',
        }}
        containerClassName="sticker-popover-wrapper"
        content={
          <PopoverWrapper className="h-[400px] w-[300px]">
            {isLoading ? (
              <LoadingContainer>
                <Spinner />
              </LoadingContainer>
            ) : (
              <>
                <StickersContainer className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {!isEmpty(stickers) &&
                    stickers.map((sticker, index) => (
                      <StickerBox
                        key={index}
                        onClick={() => onSelectSticker(sticker)}>
                        <img
                          className="sticker-img"
                          src={sticker.image}
                          alt={sticker.name}
                          onError={e => {
                            e.currentTarget.src = defaultImages.errorImage;
                          }}
                        />
                      </StickerBox>
                    ))}
                </StickersContainer>
              </>
            )}
          </PopoverWrapper>
        }>
        <div onClick={() => openPopover()}>
          <LuSticker className="text-xl text-gray-700 cursor-pointer !text-[22px]" />
        </div>
      </Popover>
    </>
  );
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
`;

const StickersContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 1rem 0.5rem 1rem;
`;

const StickerBox = styled.div`
  min-height: 80px;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 0.5rem;

  .sticker-img {
    object-fit: contain;
    width: 60px;
    height: 60px;
  }

  &:hover {
    background-color: #ededed;
  }
`;

const mockSticker = [
  {
    id: '65a913f8e02ed753e6e5669f',
    createdAt: '2024-01-18T12:05:12.525Z',
    updatedAt: '2024-01-18T12:05:12.525Z',
    name: 'Wanted',
    description: 'wanted',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F29.png?alt=media',
    price: 40,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e56688',
    createdAt: '2024-01-18T12:05:09.427Z',
    updatedAt: '2024-01-18T12:05:09.427Z',
    name: 'Police whistle',
    description: 'police whistle',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F6.png?alt=media',
    price: 50,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e56693',
    createdAt: '2024-01-18T12:05:10.916Z',
    updatedAt: '2024-01-18T12:05:10.916Z',
    name: 'Target',
    description: 'target',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F17.png?alt=media',
    price: 50,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e5669b',
    createdAt: '2024-01-18T12:05:11.981Z',
    updatedAt: '2024-01-18T12:05:11.981Z',
    name: 'Police cap',
    description: 'Police cap',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F25.png?alt=media',
    price: 170,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f4e02ed753e6e56683',
    createdAt: '2024-01-18T12:05:08.705Z',
    updatedAt: '2024-01-18T12:05:08.705Z',
    name: 'Siren',
    description: 'siren',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F1.png?alt=media',
    price: 200,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e5668b',
    createdAt: '2024-01-18T12:05:09.834Z',
    updatedAt: '2024-01-18T12:05:09.834Z',
    name: 'Truncheon',
    description: 'truncheon',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F9.png?alt=media',
    price: 350,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e56690',
    createdAt: '2024-01-18T12:05:10.506Z',
    updatedAt: '2024-01-18T12:05:10.506Z',
    name: 'Traffic Cone',
    description: 'traffic cone',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F14.png?alt=media',
    price: 450,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e56695',
    createdAt: '2024-01-18T12:05:11.181Z',
    updatedAt: '2024-01-18T12:05:11.181Z',
    name: 'Police Shirt',
    description: 'Police shirt',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F19.png?alt=media',
    price: 450,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e56699',
    createdAt: '2024-01-18T12:05:11.718Z',
    updatedAt: '2024-01-18T12:05:11.718Z',
    name: 'Doughnut And Drink',
    description: 'doughnut and drink',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F23.png?alt=media',
    price: 635,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f4e02ed753e6e56684',
    createdAt: '2024-01-18T12:05:08.875Z',
    updatedAt: '2024-01-18T12:05:08.875Z',
    name: 'Police Hat',
    description: 'police hat',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F2.png?alt=media',
    price: 750,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e5668a',
    createdAt: '2024-01-18T12:05:09.694Z',
    updatedAt: '2024-01-18T12:05:09.694Z',
    name: 'Bullet',
    description: 'bullet',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F8.png?alt=media',
    price: 850,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e56694',
    createdAt: '2024-01-18T12:05:11.050Z',
    updatedAt: '2024-01-18T12:05:11.050Z',
    name: 'Magazine',
    description: 'magazine',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F18.png?alt=media',
    price: 1100,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e5668c',
    createdAt: '2024-01-18T12:05:09.967Z',
    updatedAt: '2024-01-18T12:05:09.967Z',
    name: 'Internee',
    description: 'internee',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F10.png?alt=media',
    price: 1200,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e5668e',
    createdAt: '2024-01-18T12:05:10.236Z',
    updatedAt: '2024-01-18T12:05:10.236Z',
    name: 'Police Flashlight',
    description: 'police flashlight',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F12.png?alt=media',
    price: 1350,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e56697',
    createdAt: '2024-01-18T12:05:11.448Z',
    updatedAt: '2024-01-18T12:05:11.448Z',
    name: 'Grenade',
    description: 'grenade',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F21.png?alt=media',
    price: 1450,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f8e02ed753e6e5669e',
    createdAt: '2024-01-18T12:05:12.393Z',
    updatedAt: '2024-01-18T12:05:12.393Z',
    name: 'Megaphone',
    description: 'megaphone',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F28.png?alt=media',
    price: 2500,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e56686',
    createdAt: '2024-01-18T12:05:09.155Z',
    updatedAt: '2024-01-18T12:05:09.155Z',
    name: 'Police walkie talkie',
    description: 'police walkie talkie',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F4.png?alt=media',
    price: 5000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e56689',
    createdAt: '2024-01-18T12:05:09.560Z',
    updatedAt: '2024-01-18T12:05:09.560Z',
    name: 'Court Scale',
    description: 'court scale',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F7.png?alt=media',
    price: 5500,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e56696',
    createdAt: '2024-01-18T12:05:11.313Z',
    updatedAt: '2024-01-18T12:05:11.313Z',
    name: 'Police Helmet',
    description: 'police helmet',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F20.png?alt=media',
    price: 6700,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e5668f',
    createdAt: '2024-01-18T12:05:10.370Z',
    updatedAt: '2024-01-18T12:05:10.370Z',
    name: 'Police Shield',
    description: 'police shield',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F13.png?alt=media',
    price: 13800,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e56692',
    createdAt: '2024-01-18T12:05:10.778Z',
    updatedAt: '2024-01-18T12:05:10.778Z',
    name: 'Taser',
    description: 'taser',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F16.png?alt=media',
    price: 17800,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f8e02ed753e6e5669c',
    createdAt: '2024-01-18T12:05:12.118Z',
    updatedAt: '2024-01-18T12:05:12.118Z',
    name: 'Bulletproof Vest',
    description: 'bulletproof vest',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F26.png?alt=media',
    price: 18250,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e5668d',
    createdAt: '2024-01-18T12:05:10.100Z',
    updatedAt: '2024-01-18T12:05:10.100Z',
    name: 'Gun',
    description: 'gun',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F11.png?alt=media',
    price: 38000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e5669a',
    createdAt: '2024-01-18T12:05:11.849Z',
    updatedAt: '2024-01-18T12:05:11.849Z',
    name: 'CCTV',
    description: 'cctv',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F24.png?alt=media',
    price: 76500,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e56685',
    createdAt: '2024-01-18T12:05:09.012Z',
    updatedAt: '2024-01-18T12:05:09.012Z',
    name: 'Police Car',
    description: 'police car',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F3.png?alt=media',
    price: 300000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f6e02ed753e6e56691',
    createdAt: '2024-01-18T12:05:10.639Z',
    updatedAt: '2024-01-18T12:05:10.639Z',
    name: 'Radar Gun',
    description: 'radar gun',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F15.png?alt=media',
    price: 350000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f7e02ed753e6e56698',
    createdAt: '2024-01-18T12:05:11.587Z',
    updatedAt: '2024-01-18T12:05:11.587Z',
    name: 'Safe container',
    description: 'safe container',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F22.png?alt=media',
    price: 420000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f8e02ed753e6e5669d',
    createdAt: '2024-01-18T12:05:12.258Z',
    updatedAt: '2024-01-18T12:05:12.258Z',
    name: 'Police truck',
    description: 'Police truck',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F27.png?alt=media',
    price: 1250000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
  {
    id: '65a913f5e02ed753e6e56687',
    createdAt: '2024-01-18T12:05:09.294Z',
    updatedAt: '2024-01-18T12:05:09.294Z',
    name: 'Police Station',
    description: 'police station',
    image:
      'https://firebasestorage.googleapis.com/v0/b/socialbureau-website.appspot.com/o/stickers%2Fofficial%2F5.png?alt=media',
    price: 10000000,
    stickerCategoryId: '65a913f4e02ed753e6e56682',
  },
];
