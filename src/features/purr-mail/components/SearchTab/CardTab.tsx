import { Avatar } from 'flowbite-react';

import moment from 'moment';

type ParticipantImage = {
  picture?: string;
  initials: string;
};

type Props = {
  img: ParticipantImage[];
  name: string;
  mail: string;
  onClick?: () => void;
  timestamp: number;
};

export default function CardTab({
  img,
  name,
  mail,
  onClick,
  timestamp,
}: Props) {
  const isMultipleImages = Array.isArray(img) && img.length > 1;

  return (
    <div
      className="flex w-full px-0 cursor-pointer justify-content-between"
      onClick={onClick}>
      <div className="flex items-center w-[70%] gap-3">
        <div className="min-w-[75px]">
          {isMultipleImages ? (
            <Avatar.Group className="-space-x-6">
              {img.slice(0, 2).map((image, index) => (
                <Avatar
                  className="space-x-6 text-2xl hover:z-10 hover:scale-100 hover:-translate-y-1 transition-transform duration-200"
                  key={index}
                  img={image.picture}
                  placeholderInitials={image.initials}
                  rounded
                  stacked
                />
              ))}
              {img.length > 2 && <Avatar.Counter total={img.length - 2} />}
            </Avatar.Group>
          ) : (
            <Avatar
              img={img[0]?.picture}
              placeholderInitials={img[0]?.initials}
              rounded
              stacked
            />
          )}
        </div>
        <div className="font-medium max-w-[80%]">
          <div className="text-gray-900 text-sm font-normal truncate">
            {name}
          </div>
          <div className=" text-gray-900 text-xs truncate font-semibold fade-in">
            {mail}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end w-[30%] whitespace-nowrap">
        <div className="text-[10px] !text-gray-400 leading-[24px] fade-in">
          {moment.unix(timestamp).fromNow()}
        </div>
      </div>
    </div>
  );
}
