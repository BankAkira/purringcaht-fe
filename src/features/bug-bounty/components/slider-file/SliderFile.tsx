// import (Internal imports)
import React from 'react';

// react-icons
import { IoIosClose } from 'react-icons/io';

// react-slick
import Slider, { CustomArrowProps, Settings } from 'react-slick';

// react-player
import ReactPlayer from 'react-player';

// helper functions
import useResponsive from '../../../../helper/hook/useResponsive';

// css
import './slider-file.css';

// type definitions
import { Base64File } from '../../../../type/bug-bounty';

// constant
import { getIconByFileType } from '../../../../constant/icon-files';

type SliderFileProps = {
  files: (File | Base64File)[];
  handleDeleteFile: (fileName: string) => void;
};

const NextArrow: React.FC<CustomArrowProps> = ({
  className,
  style,
  onClick,
}) => {
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: 25, zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const PrevArrow: React.FC<CustomArrowProps> = ({
  className,
  style,
  onClick,
}) => {
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', left: 25, zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const NoneArrow: React.FC<CustomArrowProps> = ({
  className,
  style,
  onClick,
}) => {
  return (
    <div
      className={className}
      style={{ ...style, display: 'none' }}
      onClick={onClick}
    />
  );
};

const SliderFile: React.FC<SliderFileProps> = ({ files, handleDeleteFile }) => {
  const { isTabletOrMobile } = useResponsive();

  const settings: Settings = {
    dots: false,
    infinite: false,
    slidesToShow: isTabletOrMobile ? 2.2 : 2,
    slidesToScroll: 2,
    nextArrow:
      !isTabletOrMobile && files.length >= 3 ? (
        <NextArrow className="slick-next" />
      ) : (
        <NoneArrow />
      ),
    prevArrow:
      !isTabletOrMobile && files.length >= 3 ? (
        <PrevArrow className="slick-prev" />
      ) : (
        <NoneArrow />
      ),
  };

  return (
    <Slider {...settings}>
      {files.map((file, index) => {
        const fileUrl =
          'base64' in file ? file.base64 : URL.createObjectURL(file);
        const fileName = 'base64' in file ? file.optional.fileName : file.name;
        const fileType = 'base64' in file ? file.optional.fileType : file.type;

        const icon =
          getIconByFileType(fileType) || getIconByFileType('defaultImage');

        return (
          <div key={index} className="relative w-1/2 h-full p-2">
            <button
              type="button"
              className="absolute top-4 right-4 border-[#00000000] bg-[#0f1419bf] backdrop-blur-sm rounded-full min-w-[32px] min-h-[32px] z-10 hover:bg-[#272c30bf]"
              onClick={() => handleDeleteFile(fileName)}>
              <div className="flex justify-center items-center text-white">
                <IoIosClose className="h-8 w-8" />
              </div>
            </button>
            <div className="file-container border">
              {fileType.startsWith('image/') ? (
                <img src={fileUrl} alt={fileName} />
              ) : fileType.startsWith('video/') ? (
                <div className="react-player-wrapper">
                  <ReactPlayer
                    url={fileUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                  />
                </div>
              ) : (
                <img src={icon} alt={fileName} className="file-icon" />
              )}
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default SliderFile;
