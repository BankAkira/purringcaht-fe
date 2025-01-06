// import (Internal imports)

// import classNames from 'classnames';
import styled from 'styled-components';

// react-responsive
// import { Carousel } from 'react-responsive-carousel';

// import VideoErrorBoundary from './VideoErrorBoundary';
// import ImageErrorBoundary from './ImageErrorBoundary';

type Props = {
  image: string[];
  maxHeight?: string;
};

export default function LightBoxComponent({ image, maxHeight }: Props) {
  console.log('image', image);
  return (
    <ImageContainer style={{ maxHeight: maxHeight || '250px' }}>
      {/*<CustomCarousel*/}
      {/*  autoFocus={false}*/}
      {/*  autoPlay={false}*/}
      {/*  showStatus={false}*/}
      {/*  showArrows={image.length > 1}*/}
      {/*  showIndicators={false}*/}
      {/*  showThumbs={false}*/}
      {/*  swipeable={image.length > 1}*/}
      {/*  emulateTouch={image.length > 1}*/}
      {/*  centerMode={true}*/}
      {/*  onClickThumb={() => {}}*/}
      {/*  centerSlidePercentage={100}>*/}
      {/*  {image.map((url, i) => (*/}
      {/*    <div*/}
      {/*      key={i}*/}
      {/*      style={{ maxHeight: maxHight || '250px' }}*/}
      {/*      className={classNames(*/}
      {/*        'flex items-center justify-center w-full select-none',*/}
      {/*        'overflow-hidden cursor-pointer',*/}
      {/*        'relative'*/}
      {/*      )}>*/}
      {/*      <ImageErrorBoundary src={url} index={i} allSrc={image} />*/}
      {/*      <VideoErrorBoundary src={url} />*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</CustomCarousel>*/}
    </ImageContainer>
  );
}

// const CustomCarousel = styled(Carousel)`
//   width: 100%;
//
//   div > img {
//     position: relative;
//   }
//
//   .carousel .control-dots .dot {
//     width: 6px;
//     height: 6px;
//     opacity: 1;
//     margin: 0 14px;
//   }
//
//   .carousel .control-dots .dot.selected {
//     width: 6px;
//     height: 6px;
//     opacity: 1;
//     outline: #1be1ef solid 1px;
//     outline-offset: 10px;
//   }
//
//   .carousel .control-arrow,
//   .carousel.carousel-slider .control-arrow {
//     opacity: 1;
//     background: rgba(0, 0, 0, 0.2);
//     padding: 2px;
//   }
//
//   .carousel .slider-wrapper .slider .selected {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
// `;

const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;
