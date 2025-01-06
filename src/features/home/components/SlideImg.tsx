// import (Internal imports)
import { useState } from 'react';

import styled from 'styled-components';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

// helper functions
import useResponsive from '../../../helper/hook/useResponsive';
// import { Logger } from '../../../helper/logger';

// redux
import { useDispatch } from '../../../redux';
import { toggleMobileControlSidebarAction } from '../../../redux/convesation-layout';
import { showAlert } from '../../../redux/home';

// images
import BugBounty from '../../../asset/images/home/BugBounty.webp';
import FoodGuide from '../../../asset/images/home/FoodGuide.png';
import PurrChase from '../../../asset/images/home/PurrChase.webp';
import PurrCloud from '../../../asset/images/home/PurrCloud.webp';
import PurrHub from '../../../asset/images/home/PurrHub.webp';
import PurrPoints from '../../../asset/images/home/PurrPoints.webp';
import PurrPost from '../../../asset/images/home/PurrPost.webp';
import PurrVault from '../../../asset/images/home/PurrVault.webp';

// const log = new Logger('SlideImg');

export default function SlideImg() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isTabletOrMobile } = useResponsive();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const images = [
    {
      id: 'bug-bounty',
      name: 'Bug Bounty',
      image: BugBounty,
      link: '/bug-bounty',
    },
    {
      id: 'food-guide',
      name: 'Food Guide',
      image: FoodGuide,
      link: '',
    },
    {
      id: 'purr-chase',
      name: 'PurrChase',
      image: PurrChase,
      link: '',
    },
    {
      id: 'purr-cloud',
      name: 'PurrCloud',
      image: PurrCloud,
      link: '/keep',
    },
    {
      id: 'purr-hub',
      name: 'PurrHub',
      image: PurrHub,
      link: '',
    },
    {
      id: 'purr-points',
      name: 'PurrPoints',
      image: PurrPoints,
      link: '',
    },
    {
      id: 'purr-post',
      name: 'PurrPost',
      image: PurrPost,
      link: '/purr-post',
    },
    {
      id: 'purr-vault',
      name: 'PurrVault',
      image: PurrVault,
      link: '',
    },
  ];

  const handleFoodGuide = () => {
    const foodGuideUrl = `https://foodguide.purringchat.io`;
    window.open(foodGuideUrl, '_blank');
  };

  const handleUnavailableFeature = (name: string) => {
    if (!isAlertVisible) {
      setIsAlertVisible(true);
      dispatch(showAlert({ message: 'Feature is coming soon!', name: name }));
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    }
  };

  return (
    <CustomSwiperStyle>
      <Swiper
        slidesPerView={isTabletOrMobile ? 1 : 4}
        spaceBetween={30}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}>
        {images.map(img => (
          <SwiperSlide
            key={img.id}
            onClick={() => {
              if (img.id === 'food-guide') {
                handleFoodGuide();
              } else if (img.link) {
                dispatch(toggleMobileControlSidebarAction());
                navigate(img.link);
              } else {
                handleUnavailableFeature(img.name);
              }
            }}>
            <img
              src={img.image}
              alt={img.name}
              className="shadow-md cursor-pointer transition hover:scale-95"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </CustomSwiperStyle>
  );
}

const CustomSwiperStyle = styled.div`
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;

    border-radius: 0.5rem;
    border-width: 1px;
  }

  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #000;
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
  }

  .swiper-pagination-bullet-active {
    color: #fff;
    background: linear-gradient(130deg, #fd4077 -2.26%, #fe7601 96.97%);
  }
`;
